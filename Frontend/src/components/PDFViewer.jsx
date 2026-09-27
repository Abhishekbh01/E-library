import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Use the local proxy endpoint for PDF.js worker
const pdfJsWorkerPath = '/pdfjs/pdfjs-dist@5.3.93/build/pdf.worker.min.mjs';
pdfjs.GlobalWorkerOptions.workerSrc = pdfJsWorkerPath;

const PDFViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col items-center h-[90vh] bg-gray-100 p-4">
      <div className="flex-1 w-full max-w-4xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto border border-gray-300 bg-white p-2">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="flex items-center justify-center h-full">Loading PDF...</div>}
            error={<div className="flex items-center justify-center h-full">Failed to load PDF.</div>}
            className="w-full h-full"
          >
            <Page 
              pageNumber={pageNumber} 
              className="w-full"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={800}
            />
          </Document>
        </div>
      </div>

      <div className="mt-4 flex gap-4 items-center bg-white p-3 rounded-lg shadow">
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
        >
          Previous
        </button>
        <p className="text-gray-700">
          Page {pageNumber} of {numPages || '...'}
        </p>
        <button
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || prev))}
          disabled={pageNumber >= (numPages || 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
