import { GoogleGenAI, createPartFromUri } from "@google/genai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import fs from "fs";
import path from "path";

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
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        console.log(apiKey);
        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not set" },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Define upload directory
        const uploadDir = path.join(process.cwd(), "uploads");

        // Ensure upload directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Create a unique filename to avoid collisions
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${timestamp}-${safeName}`;
        const filePath = path.join(uploadDir, filename);

        // Write file to local filesystem
        fs.writeFileSync(filePath, buffer);
        console.log(`File saved to: ${filePath}`);

        // Read file back using fs.readFileSync as requested
        const fileContent = fs.readFileSync(filePath);
        console.log(`File successfully read back from ${filePath}, size: ${fileContent.length} bytes`);

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
                    data: Buffer.from(fileContent).toString('base64')
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

        const text = response.text;

        // Clean up markdown code blocks if present
        const jsonString = (text || "").replace(/```json\n|\n```/g, "").trim();

        let data;
        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            // If parsing fails, return the raw text
            data = { raw_text: text };
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error processing document:", error);
        return NextResponse.json(
            { error: "Failed to process document" },
            { status: 500 }
        );
    }
}
