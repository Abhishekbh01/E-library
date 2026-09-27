import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use the local proxy endpoint for PDF.js worker
const pdfJsWorkerPath = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.31/pdf.worker.min.mjs';
pdfjs.GlobalWorkerOptions.workerSrc = pdfJsWorkerPath;

const PDFViewerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { file, fileName } = location.state || {};
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [workerReady, setWorkerReady] = useState(false);
  const [showNextPagePreview, setShowNextPagePreview] = useState(true);

  useEffect(() => {
    const verifyWorker = async () => {
      try {
        await pdfjs.getDocument({
          data: new Uint8Array(),
          useWorker: true,
          useSystemFonts: true
        }).promise;
        setWorkerReady(true);
      } catch (error) {
        console.error('PDF.js worker failed to load:', error);
        setWorkerReady(true);
      }
    };

    verifyWorker();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(newPageNumber, 1), numPages || 1);
    });
  };

  const toggleNextPagePreview = () => {
    setShowNextPagePreview(!showNextPagePreview);
  };

  if (!file) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">No PDF Selected</h1>
          <p className="text-gray-600 mb-6">Please select a PDF to view from the library.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  if (!workerReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF viewer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-lg font-medium text-gray-900 truncate">
                {fileName || 'PDF Document'}
              </h1>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main PDF Viewer */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* PDF Container */}
              <div className="relative flex items-center justify-center bg-gray-100 rounded-lg p-8">
                {/* Navigation Arrows */}
                <button
                  onClick={() => changePage(-1)}
                  disabled={pageNumber <= 1}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md border border-gray-200 transition-all ${
                    pageNumber <= 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-lg hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={() => changePage(1)}
                  disabled={pageNumber >= numPages}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md border border-gray-200 transition-all ${
                    pageNumber >= numPages 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-lg hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* PDF Document */}
                <div className="relative">
                  <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="flex items-center justify-center h-96 w-[700px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                      </div>
                    }
                    error={
                      <div className="text-center p-8 text-red-600 w-[700px]">
                        Failed to load PDF. Please try again.
                      </div>
                    }
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={Math.min(700, window.innerWidth * 0.6)}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-sm border border-gray-200 rounded"
                    />
                  </Document>
                </div>
              </div>

              {/* Page Controls */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Page {pageNumber} of {numPages || '--'}
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(pageNumber / (numPages || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changePage(-1)}
                    disabled={pageNumber <= 1}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => changePage(1)}
                    disabled={pageNumber >= numPages}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Next Page Preview */}
          {pageNumber < (numPages || 1) && (
            <div className="w-80">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-8">
                {/* Preview Header */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Next Page</span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                        {pageNumber + 1}
                      </span>
                    </div>
                    <button
                      onClick={toggleNextPagePreview}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNextPagePreview ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                {showNextPagePreview && (
                  <div className="p-4">
                    <div 
                      className="cursor-pointer transition-transform hover:scale-105"
                      onClick={() => changePage(1)}
                    >
                      <Document
                        file={file}
                        loading={
                          <div className="flex items-center justify-center h-48 bg-gray-50 rounded border border-gray-200">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                          </div>
                        }
                      >
                        <Page
                          pageNumber={pageNumber + 1}
                          width={280}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="shadow-sm border border-gray-200 rounded hover:shadow-md transition-shadow"
                        />
                      </Document>
                    </div>
                    
                    <button
                      onClick={() => changePage(1)}
                      className="w-full mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Go to Page {pageNumber + 1}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewerPage;