import { GoogleGenAI, createPartFromUri } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
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
        const fileBlob = new Blob([arrayBuffer], { type: file.type });

        const uploadResult = await ai.files.upload({
            file: fileBlob,
            config: {
                displayName: file.name,
                mimeType: file.type,
            },
        });

        if (!uploadResult.name) {
            throw new Error('Upload failed: No file name returned.');
        }

        let fileRecord = await ai.files.get({ name: uploadResult.name });
        while (fileRecord.state === 'PROCESSING') {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            fileRecord = await ai.files.get({ name: uploadResult.name });
        }

        if (fileRecord.state === 'FAILED') {
            throw new Error('File processing failed.');
        }

        if (!fileRecord.uri || !fileRecord.mimeType) {
            throw new Error('File URI or MIME type is missing.');
        }

        const prompt = "Extract the key information from this document in JSON format. Return ONLY the JSON object, no markdown formatting.";

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        createPartFromUri(fileRecord.uri, fileRecord.mimeType),
                    ],
                },
            ],
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
