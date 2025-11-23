"use client";

import React, { useEffect, useState } from 'react';
import { usePDF } from '@react-pdf/renderer';
import ProfessionalTemplate from './pdf-templates/ProfessionalTemplate';
import ModernTemplate from './pdf-templates/ModernTemplate';
import { ResumeData } from '../types/resume';

interface PDFExportProps {
    data: ResumeData;
    template: "professional" | "modern";
}

const PDFExport: React.FC<PDFExportProps> = ({ data, template }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const MyDocument = template === "professional"
        ? <ProfessionalTemplate data={data} />
        : <ModernTemplate data={data} />;

    const [instance, updateInstance] = usePDF({ document: MyDocument });

    if (!isClient) return null;

    if (instance.loading) {
        return (
            <button disabled className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-400 cursor-not-allowed w-full sm:w-auto">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Preparing PDF...
            </button>
        );
    }

    if (instance.error) {
        return <div className="text-red-500 text-sm">Error generating PDF: {instance.error}</div>;
    }

    return (
        <a
            href={instance.url || '#'}
            download={`resume-${template}.pdf`}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
        >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
        </a>
    );
};

export default PDFExport;
