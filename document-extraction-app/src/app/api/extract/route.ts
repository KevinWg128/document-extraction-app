import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";

const EducationSchema = z.object({
    degree: z.string().describe("The degree of the person"),
    field_of_study: z.string().describe("The field of study of the person"),
    start_date: z.string().describe("The start date of the person"),
    end_date: z.string().describe("The end date of the person"),
});

const WorkExperienceSchema = z.object({
    company: z.string().describe("The company name"),
    title: z.string().describe("The job title"),
    start_date: z.string().describe("The start date"),
    end_date: z.string().describe("The end date"),
    description: z.string().describe("The job description"),
});

const ResumeSchema = z.object({
    name: z.string().describe("The name of the person"),
    email: z.string().describe("The email of the person"),
    phone: z.string().describe("The phone number of the person"),
    address: z.string().describe("The address of the person"),
    skills: z.array(z.string()).describe("The skills of the person"),
    education: z.array(EducationSchema).describe("The education of the person"),
    work_experience: z.array(WorkExperienceSchema).describe("The work experience of the person"),
});

export async function POST(request: Request) {
    try {
        // Authenticate user
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not set" },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const arrayBuffer = await file.arrayBuffer();
        const fileContent = Buffer.from(arrayBuffer).toString("base64");

        const uploadBlob = new Blob([fileContent], { type: file.type });

        const uploadResult = await ai.files.upload({
            file: uploadBlob,
            config: {
                displayName: file.name,
                mimeType: file.type,
            },
        });

        if (!uploadResult.name) {
            throw new Error('Upload failed: No file name returned.');
        }

        const prompt = "Extract the resume information from this document";

        const contents = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: fileContent
                }
            }
        ]


        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(ResumeSchema),
            },
        });

        const jsonString = (response.text || "").replace(/```json\n|\n```/g, "").trim();
        const json = JSON.parse(jsonString);

        // Save extraction to database
        await db.insert(documents).values({
            id: crypto.randomUUID(),
            userId: session.user.id,
            fileName: file.name,
            fileSize: file.size,
            extractedData: json,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json(json);

    } catch (error) {
        console.error("Error processing document:", error);
        return NextResponse.json(
            { error: "Failed to process document" },
            { status: 500 }
        );
    }
}
