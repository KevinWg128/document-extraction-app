"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { UserMenu } from "@/components/user-menu";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ResumeData } from "@/types/resume";

const PDFExport = dynamic(() => import("@/components/PDFExport"), {
    ssr: false,
    loading: () => <p className="text-sm text-gray-500">Loading PDF tools...</p>,
});

interface Document {
    id: string;
    fileName: string;
    fileSize: number;
    createdAt: string;
    extractedData: ResumeData;
}

export default function DocumentDetailPage() {
    const params = useParams();
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<"professional" | "modern">("professional");

    useEffect(() => {
        fetchDocument();
    }, [params.id]);

    const fetchDocument = async () => {
        try {
            const response = await fetch(`/api/documents/${params.id}`);
            if (!response.ok) throw new Error("Failed to fetch document");
            const data = await response.json();
            setDocument(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !document) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <UserMenu />
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-4">
                        <p className="text-red-700">{error || "Document not found"}</p>
                    </div>
                    <Link
                        href="/history"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        ← Back to History
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <UserMenu />

                <Link
                    href="/history"
                    className="text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center font-medium"
                >
                    <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to History
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 mt-4">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-12 w-12 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {document.fileName}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                <span>•</span>
                                <span>
                                    Extracted on {new Date(document.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Extracted Data
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Success
                        </span>
                    </div>
                    <div className="p-6 bg-gray-50/50">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm font-mono max-h-[500px]">
                            {JSON.stringify(document.extractedData, null, 2)}
                        </pre>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">
                                Export to PDF
                            </h4>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex space-x-4 mb-4 sm:mb-0">
                                    <button
                                        onClick={() => setSelectedTemplate("professional")}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedTemplate === "professional"
                                            ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        Professional
                                    </button>
                                    <button
                                        onClick={() => setSelectedTemplate("modern")}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedTemplate === "modern"
                                            ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        Modern
                                    </button>
                                </div>

                                <PDFExport data={document.extractedData} template={selectedTemplate} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
