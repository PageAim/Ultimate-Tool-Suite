import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  FilePlus, 
  FileMinus, 
  FileStack, 
  FileSearch, 
  Lock, 
  Unlock, 
  Scissors, 
  Layers, 
  FileType, 
  Table, 
  AlignLeft,
  Upload,
  Download,
  Loader2,
  FileDigit,
  FileJson,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { jsPDF } from 'jspdf';
import { PDFDocument, rgb } from 'pdf-lib';

// --- Types ---

type DocToolCategory = 'Conversion' | 'Manipulation' | 'Security' | 'Analysis';

interface DocTool {
  id: string;
  name: string;
  icon: React.ElementType;
  category: DocToolCategory;
  description: string;
}

const DOC_TOOLS: DocTool[] = [
  { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: FileType, category: 'Conversion', description: 'Convert PDF pages into high-quality JPG images.' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: FilePlus, category: 'Conversion', description: 'Convert images into a single PDF document.' },
  { id: 'pdf-to-word', name: 'PDF to Word', icon: FileText, category: 'Conversion', description: 'Convert PDF files into editable Word documents.' },
  { id: 'word-to-pdf', name: 'Word to PDF', icon: FileType, category: 'Conversion', description: 'Convert Word documents into PDF format.' },
  { id: 'merge-pdf', name: 'Merge PDF', icon: FileStack, category: 'Manipulation', description: 'Combine multiple PDF files into one.' },
  { id: 'split-pdf', name: 'Split PDF', icon: Scissors, category: 'Manipulation', description: 'Separate a PDF into individual pages.' },
  { id: 'compress-pdf', name: 'Compress PDF', icon: FileMinus, category: 'Manipulation', description: 'Reduce the file size of your PDF.' },
  { id: 'lock-pdf', name: 'Lock / Unlock PDF', icon: Lock, category: 'Security', description: 'Add or remove password protection from PDFs.' },
  { id: 'remove-pages', name: 'Remove PDF Pages', icon: Trash2Icon, category: 'Manipulation', description: 'Delete specific pages from your PDF.' },
  { id: 'watermark-pdf', name: 'Add Watermark', icon: Layers, category: 'Manipulation', description: 'Add text or image watermarks to your PDF.' },
  { id: 'docx-to-txt', name: 'DOCX to TXT', icon: FileText, category: 'Conversion', description: 'Extract plain text from Word documents.' },
  { id: 'txt-to-pdf', name: 'TXT to PDF', icon: FileDigit, category: 'Conversion', description: 'Convert plain text files into PDF documents.' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', icon: Table, category: 'Conversion', description: 'Convert spreadsheets into PDF format.' },
  { id: 'csv-to-excel', name: 'CSV to Excel', icon: FileJson, category: 'Conversion', description: 'Convert CSV data into Excel spreadsheets.' },
  { id: 'doc-word-counter', name: 'Word Counter', icon: AlignLeft, category: 'Analysis', description: 'Count words and characters in your documents.' },
];

function Trash2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

export default function DocumentTools() {
  const [activeToolId, setActiveToolId] = useState(DOC_TOOLS[0].id);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeTool = DOC_TOOLS.find(t => t.id === activeToolId) || DOC_TOOLS[0];

  useEffect(() => {
    if (window.innerWidth < 1024) setIsToolSidebarOpen(false);
  }, [activeToolId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setResultUrl(null);
    setAnalysisResult(null);
  };

  const processTool = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setResultUrl(null);
    setAnalysisResult(null);

    try {
      const firstFile = selectedFiles[0];
      
      switch (activeTool.id) {
        case 'jpg-to-pdf': {
          const doc = new jsPDF();
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
            if (i > 0) doc.addPage();
            doc.addImage(dataUrl, 'JPEG', 10, 10, 190, 280);
          }
          const blob = doc.output('blob');
          setResultUrl(URL.createObjectURL(blob));
          break;
        }

        case 'txt-to-pdf': {
          const text = await firstFile.text();
          const doc = new jsPDF();
          const splitText = doc.splitTextToSize(text, 180);
          doc.text(splitText, 10, 10);
          const blob = doc.output('blob');
          setResultUrl(URL.createObjectURL(blob));
          break;
        }

        case 'merge-pdf': {
          const mergedPdf = await PDFDocument.create();
          for (const file of selectedFiles) {
            const pdfBytes = await file.arrayBuffer();
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          }
          const pdfBytes = await mergedPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          setResultUrl(URL.createObjectURL(blob));
          break;
        }

        case 'watermark-pdf': {
          const pdfBytes = await firstFile.arrayBuffer();
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const pages = pdfDoc.getPages();
          pages.forEach(page => {
            page.drawText('TEXTCRAFT WATERMARK', {
              x: 50,
              y: 50,
              size: 50,
              color: rgb(0.5, 0.5, 0.5),
              opacity: 0.3,
              rotate: { type: 'degrees', angle: 45 } as any,
            });
          });
          const savedBytes = await pdfDoc.save();
          const blob = new Blob([savedBytes], { type: 'application/pdf' });
          setResultUrl(URL.createObjectURL(blob));
          break;
        }

        case 'doc-word-counter': {
          const text = await firstFile.text(); // Basic for now, real docx needs a parser
          const words = text.trim().split(/\s+/).filter(Boolean).length;
          const chars = text.length;
          setAnalysisResult(`Analysis for ${firstFile.name}:\n\nWords: ${words}\nCharacters: ${chars}\nLines: ${text.split('\n').length}`);
          break;
        }

        default:
          setAnalysisResult("This advanced document conversion tool is coming soon in the Pro version! We are currently integrating server-side processing for complex formats like Word and Excel.");
          break;
      }
    } catch (err) {
      console.error(err);
      setAnalysisResult("Error processing document. Please ensure the file format is correct.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
      {/* Mobile Tool Sidebar Toggle */}
      <button 
        onClick={() => setIsToolSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 transition-all active:scale-95"
      >
        <AlignLeft className="w-6 h-6" />
      </button>

      {/* Tool Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 overflow-y-auto transition-transform duration-300 lg:relative lg:translate-x-0",
        !isToolSidebarOpen && "-translate-x-full"
      )}>
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between lg:hidden mb-2">
            <h3 className="text-sm font-bold text-slate-900">Document Tools</h3>
            <button onClick={() => setIsToolSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          {(['Conversion', 'Manipulation', 'Security', 'Analysis'] as DocToolCategory[]).map(cat => (
            <div key={cat}>
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {cat} Tools
              </h3>
              <div className="space-y-1">
                {DOC_TOOLS.filter(t => t.category === cat).map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveToolId(tool.id);
                      setResultUrl(null);
                      setAnalysisResult(null);
                      setSelectedFiles([]);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      activeToolId === tool.id 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <tool.icon className={cn("w-4 h-4", activeToolId === tool.id ? "text-indigo-600" : "text-slate-400")} />
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Workspace */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{activeTool.name}</h2>
            <p className="text-sm sm:text-base text-slate-500">{activeTool.description}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center min-h-[300px] relative">
                {selectedFiles.length > 0 ? (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">Selected Files ({selectedFiles.length})</h4>
                      <button onClick={() => setSelectedFiles([])} className="text-xs text-red-500 font-bold hover:underline">Clear All</button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <FileText className="w-5 h-5 text-indigo-500" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{f.name}</p>
                            <p className="text-xs text-slate-500">{(f.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Upload documents</p>
                      <p className="text-xs text-slate-500">PDF, Word, Excel, or Text files</p>
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Select Files
                    </button>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  multiple 
                />
              </div>

              <button
                onClick={processTool}
                disabled={isProcessing || selectedFiles.length === 0}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <activeTool.icon className="w-5 h-5" />}
                Process Document
              </button>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[300px]">
                {isProcessing ? (
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                    <p className="text-sm font-medium text-slate-500">Processing document...</p>
                  </div>
                ) : resultUrl ? (
                  <div className="text-center space-y-6 w-full">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircleIcon className="w-10 h-10 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Document Ready!</h3>
                      <p className="text-sm text-slate-500">Your file has been processed successfully.</p>
                    </div>
                    <a 
                      href={resultUrl}
                      download={`textcraft-result-${activeTool.id}.pdf`}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                    >
                      <Download className="w-5 h-5" /> Download Result
                    </a>
                  </div>
                ) : analysisResult ? (
                  <div className="w-full h-full bg-slate-50 rounded-xl p-6 border border-slate-200 overflow-y-auto">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Analysis Result</h4>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-mono text-sm">{analysisResult}</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <FileSearch className="w-12 h-12 text-slate-200 mx-auto" />
                    <p className="text-sm font-medium text-slate-400">Result will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
