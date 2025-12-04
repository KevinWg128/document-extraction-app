import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        const [document] = await db
            .select()
            .from(documents)
            .where(
                and(
                    eq(documents.id, id),
                    eq(documents.userId, session.user.id)
                )
            )
            .limit(1);

        if (!document) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(document);
    } catch (error) {
        console.error("Error fetching document:", error);
        return NextResponse.json(
            { error: "Failed to fetch document" },
            { status: 500 }
        );
    }
}
