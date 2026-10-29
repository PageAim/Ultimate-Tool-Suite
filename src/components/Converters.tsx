import React, { useState, useEffect, useRef } from 'react';
import { 
  RefreshCw, 
  FileImage, 
  FileText, 
  FileCode, 
  Hash, 
  Table, 
  Thermometer, 
  Ruler, 
  Weight, 
  Zap, 
  Clock, 
  Coins, 
  ArrowRightLeft,
  Upload,
  Download,
  Loader2,
  Check,
  Copy,
  Trash2,
  AlignLeft,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';

// --- Types ---

type ConverterId = 
  | 'jpg-to-word' 
  | 'word-to-jpg' 
  | 'pdf-to-text' 
  | 'text-to-pdf' 
  | 'image-to-b64' 
  | 'b64-to-image' 
  | 'csv-to-json' 
  | 'json-to-csv' 
  | 'units' 
  | 'currency' 
  | 'temp' 
  | 'length' 
  | 'weight' 
  | 'speed' 
  | 'time';

interface ConverterTool {
  id: ConverterId;
  name: string;
  icon: React.ElementType;
  category: 'File' | 'Data' | 'Unit';
  description: string;
}

const CONVERTER_TOOLS: ConverterTool[] = [
  { id: 'jpg-to-word', name: 'JPG to Word', icon: FileImage, category: 'File', description: 'Convert images containing text into editable Word documents.' },
  { id: 'word-to-jpg', name: 'Word to JPG', icon: FileText, category: 'File', description: 'Convert Word document pages into JPG images.' },
  { id: 'pdf-to-text', name: 'PDF to Text', icon: FileText, category: 'File', description: 'Extract plain text from PDF documents.' },
  { id: 'text-to-pdf', name: 'Text to PDF', icon: FileText, category: 'File', description: 'Convert plain text files into PDF format.' },
  { id: 'image-to-b64', name: 'Image to Base64', icon: Hash, category: 'Data', description: 'Convert images into Base64 strings for web use.' },
  { id: 'b64-to-image', name: 'Base64 to Image', icon: FileImage, category: 'Data', description: 'Convert Base64 strings back into viewable images.' },
  { id: 'csv-to-json', name: 'CSV to JSON', icon: Table, category: 'Data', description: 'Convert spreadsheet data into JSON format.' },
  { id: 'json-to-csv', name: 'JSON to CSV', icon: FileCode, category: 'Data', description: 'Convert JSON data into CSV spreadsheets.' },
  { id: 'units', name: 'Units Converter', icon: RefreshCw, category: 'Unit', description: 'Convert between various measurement units.' },
  { id: 'currency', name: 'Currency Converter', icon: Coins, category: 'Unit', description: 'Convert values between global currencies.' },
  { id: 'temp', name: 'Temperature', icon: Thermometer, category: 'Unit', description: 'Convert between Celsius, Fahrenheit, and Kelvin.' },
  { id: 'length', name: 'Length', icon: Ruler, category: 'Unit', description: 'Convert between meters, feet, inches, and more.' },
  { id: 'weight', name: 'Weight', icon: Weight, category: 'Unit', description: 'Convert between kilograms, pounds, ounces, etc.' },
  { id: 'speed', name: 'Speed', icon: Zap, category: 'Unit', description: 'Convert between km/h, mph, knots, and m/s.' },
  { id: 'time', name: 'Time', icon: Clock, category: 'Unit', description: 'Convert between seconds, minutes, hours, and days.' },
];

export default function Converters() {
  const [activeToolId, setActiveToolId] = useState<ConverterId>('jpg-to-word');
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeTool = CONVERTER_TOOLS.find(t => t.id === activeToolId) || CONVERTER_TOOLS[0];

  useEffect(() => {
    setSelectedFile(null);
    setResult(null);
    setResultUrl(null);
    if (window.innerWidth < 1024) {
      setIsToolSidebarOpen(false);
    }
  }, [activeToolId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const processConversion = async () => {
    if (activeTool.category === 'File' && !selectedFile) return;
    setIsProcessing(true);
    setResult(null);
    setResultUrl(null);

    try {
      switch (activeToolId) {
        case 'text-to-pdf': {
          if (!selectedFile) break;
          const text = await selectedFile.text();
          const doc = new jsPDF();
          const splitText = doc.splitTextToSize(text, 180);
          doc.text(splitText, 10, 10);
          const blob = doc.output('blob');
          setResultUrl(URL.createObjectURL(blob));
          break;
        }
        case 'image-to-b64': {
          if (!selectedFile) break;
          const reader = new FileReader();
          reader.onload = () => setResult(reader.result as string);
          reader.readAsDataURL(selectedFile);
          break;
        }
        case 'csv-to-json': {
          if (!selectedFile) break;
          const text = await selectedFile.text();
          Papa.parse(text, {
            header: true,
            complete: (results) => {
              setResult(JSON.stringify(results.data, null, 2));
            }
          });
          break;
        }
        case 'json-to-csv': {
          if (!selectedFile) break;
          const text = await selectedFile.text();
          const json = JSON.parse(text);
          const csv = Papa.unparse(json);
          setResult(csv);
          break;
        }
        default:
          // For unit converters and complex file conversions
          if (activeTool.category === 'File') {
            setResult("This advanced file conversion is coming soon in the Pro version! We are currently integrating server-side OCR and document processing.");
          }
          break;
      }
    } catch (err) {
      console.error(err);
      setResult("Error processing conversion. Please check your input.");
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

      {/* Tool Sidebar Overlay */}
      {isToolSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsToolSidebarOpen(false)}
        />
      )}

      {/* Tool Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 overflow-y-auto transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0",
        !isToolSidebarOpen && "-translate-x-full"
      )}>
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between lg:hidden mb-4 px-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Converters
            </h3>
            <button 
              onClick={() => setIsToolSidebarOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {(['File', 'Data', 'Unit'] as const).map(cat => (
            <div key={cat}>
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {cat} Converters
              </h3>
              <div className="space-y-1">
                {CONVERTER_TOOLS.filter(t => t.category === cat).map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveToolId(tool.id)}
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
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{activeTool.name}</h2>
            <p className="text-sm sm:text-base text-slate-500">{activeTool.description}</p>
          </div>

          {activeTool.category === 'Unit' ? (
            <UnitConverterView type={activeToolId} />
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center min-h-[300px]">
                  {selectedFile ? (
                    <div className="text-center space-y-4 w-full">
                      <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                        <FileText className="w-8 h-8 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate px-4">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button onClick={() => setSelectedFile(null)} className="text-xs text-red-500 font-bold hover:underline">Remove File</button>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Upload file to convert</p>
                        <p className="text-xs text-slate-500">Select a file from your device</p>
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700"
                      >
                        Select File
                      </button>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                </div>

                <button
                  onClick={processConversion}
                  disabled={isProcessing || !selectedFile}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRightLeft className="w-5 h-5" />}
                  Convert Now
                </button>
              </div>

              {/* Output Section */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[300px] relative">
                  {isProcessing ? (
                    <div className="text-center space-y-4">
                      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                      <p className="text-sm font-medium text-slate-500">Processing conversion...</p>
                    </div>
                  ) : resultUrl ? (
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Conversion Complete!</h3>
                      <a 
                        href={resultUrl}
                        download={`converted-${activeToolId}.pdf`}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                      >
                        <Download className="w-5 h-5" /> Download Result
                      </a>
                    </div>
                  ) : result ? (
                    <div className="w-full h-full space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Result</h4>
                        <button onClick={handleCopy} className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <textarea
                        readOnly
                        value={result}
                        className="w-full h-48 bg-slate-50 border border-slate-100 rounded-xl p-4 font-mono text-xs text-slate-600 outline-none resize-none"
                      />
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <RefreshCw className="w-12 h-12 text-slate-200 mx-auto" />
                      <p className="text-sm font-medium text-slate-400">Result will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Unit Converter View ---

function UnitConverterView({ type }: { type: string }) {
  const [val1, setVal1] = useState('1');
  const [val2, setVal2] = useState('');
  const [unit1, setUnit1] = useState('');
  const [unit2, setUnit2] = useState('');

  const UNITS: Record<string, string[]> = {
    temp: ['Celsius', 'Fahrenheit', 'Kelvin'],
    length: ['Meters', 'Kilometers', 'Miles', 'Feet', 'Inches'],
    weight: ['Kilograms', 'Grams', 'Pounds', 'Ounces'],
    speed: ['Km/h', 'Mph', 'Knots', 'm/s'],
    time: ['Seconds', 'Minutes', 'Hours', 'Days'],
    currency: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
    units: ['Standard', 'Metric', 'Imperial']
  };

  const currentUnits = UNITS[type] || [];

  useEffect(() => {
    if (currentUnits.length >= 2) {
      setUnit1(currentUnits[0]);
      setUnit2(currentUnits[1]);
    }
  }, [type]);

  useEffect(() => {
    calculate();
  }, [val1, unit1, unit2]);

  const calculate = () => {
    const v = parseFloat(val1);
    if (isNaN(v)) {
      setVal2('');
      return;
    }

    let result = v;

    if (type === 'temp') {
      if (unit1 === 'Celsius' && unit2 === 'Fahrenheit') result = (v * 9/5) + 32;
      if (unit1 === 'Celsius' && unit2 === 'Kelvin') result = v + 273.15;
      if (unit1 === 'Fahrenheit' && unit2 === 'Celsius') result = (v - 32) * 5/9;
      if (unit1 === 'Fahrenheit' && unit2 === 'Kelvin') result = (v - 32) * 5/9 + 273.15;
      if (unit1 === 'Kelvin' && unit2 === 'Celsius') result = v - 273.15;
      if (unit1 === 'Kelvin' && unit2 === 'Fahrenheit') result = (v - 273.15) * 9/5 + 32;
    } else if (type === 'length') {
      const toMeters: Record<string, number> = { Meters: 1, Kilometers: 1000, Miles: 1609.34, Feet: 0.3048, Inches: 0.0254 };
      result = (v * toMeters[unit1]) / toMeters[unit2];
    } else if (type === 'weight') {
      const toKg: Record<string, number> = { Kilograms: 1, Grams: 0.001, Pounds: 0.453592, Ounces: 0.0283495 };
      result = (v * toKg[unit1]) / toKg[unit2];
    } else if (type === 'speed') {
      const toKmh: Record<string, number> = { 'Km/h': 1, Mph: 1.60934, Knots: 1.852, 'm/s': 3.6 };
      result = (v * toKmh[unit1]) / toKmh[unit2];
    } else if (type === 'time') {
      const toSec: Record<string, number> = { Seconds: 1, Minutes: 60, Hours: 3600, Days: 86400 };
      result = (v * toSec[unit1]) / toSec[unit2];
    } else if (type === 'currency') {
      const rates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 151.41, CAD: 1.35, AUD: 1.52 };
      result = (v / rates[unit1]) * rates[unit2];
    }

    setVal2(result.toFixed(4));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-12 shadow-sm max-w-2xl mx-auto">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">From</label>
            <div className="space-y-3">
              <input 
                type="number" 
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-xl"
              />
              <select 
                value={unit1}
                onChange={(e) => setUnit1(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {currentUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">To</label>
            <div className="space-y-3">
              <input 
                type="text" 
                readOnly
                value={val2}
                className="w-full bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4 outline-none text-indigo-700 font-bold text-xl"
              />
              <select 
                value={unit2}
                onChange={(e) => setUnit2(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {currentUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-slate-600">
            {val1} {unit1} is equal to <span className="font-bold text-slate-900">{val2} {unit2}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
