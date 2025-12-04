"use client";

import { useState, useEffect } from "react";
import { UserMenu } from "@/components/user-menu";
import Link from "next/link";

interface Document {
    id: string;
    fileName: string;
    fileSize: number;
    createdAt: string;
    extractedData: unknown;
}

export default function HistoryPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await fetch("/api/documents");
            if (!response.ok) throw new Error("Failed to fetch documents");
            const data = await response.json();
            setDocuments(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <UserMenu />

                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Document <span className="text-blue-600">History</span>
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        View all your extracted documents
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                        <p className="text-red-700">{error}</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                        <p className="text-gray-500 mb-4 text-lg">
                            No documents yet
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Extract your first document
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {documents.map((doc) => (
                            <Link
                                key={doc.id}
                                href={`/history/${doc.id}`}
                                className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-200 p-6 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-0.5"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-10 w-10 text-blue-500"
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
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                {doc.fileName}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-700">
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(doc.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
