import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userDocuments = await db
            .select()
            .from(documents)
            .where(eq(documents.userId, session.user.id))
            .orderBy(desc(documents.createdAt))
            .limit(100); // Limit to recent 100 documents

        return NextResponse.json(userDocuments);
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json(
            { error: "Failed to fetch documents" },
            { status: 500 }
        );
    }
}
