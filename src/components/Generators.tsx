import React, { useState, useEffect, useRef } from 'react';
import { 
  Key, 
  User, 
  Building2, 
  Globe, 
  Mail, 
  QrCode, 
  Barcode, 
  FileText, 
  FileUser, 
  FileEdit, 
  Sparkles, 
  ShoppingBag, 
  Megaphone, 
  Quote, 
  Hash,
  RefreshCw,
  Copy,
  Check,
  Download,
  Loader2,
  Trash2,
  ChevronRight,
  Plus,
  Minus,
  AlignLeft,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { jsPDF } from 'jspdf';

// --- Types ---

type GeneratorId = 
  | 'password' 
  | 'username' 
  | 'business' 
  | 'domain' 
  | 'email-sig' 
  | 'qr-code' 
  | 'barcode' 
  | 'invoice' 
  | 'resume' 
  | 'cover-letter' 
  | 'ai-bio' 
  | 'ai-product' 
  | 'ai-ad' 
  | 'random-quote' 
  | 'random-number';

interface GeneratorTool {
  id: GeneratorId;
  name: string;
  icon: React.ElementType;
  category: 'Identity' | 'Business' | 'Marketing' | 'Utility';
  description: string;
}

const GENERATOR_TOOLS: GeneratorTool[] = [
  { id: 'password', name: 'Password Gen', icon: Key, category: 'Identity', description: 'Generate strong, secure passwords with custom rules.' },
  { id: 'username', name: 'Username Gen', icon: User, category: 'Identity', description: 'Create unique and catchy usernames for social media.' },
  { id: 'business', name: 'Business Name', icon: Building2, category: 'Business', description: 'AI-powered business name ideas based on your niche.' },
  { id: 'domain', name: 'Domain Name', icon: Globe, category: 'Business', description: 'Find available and creative domain name suggestions.' },
  { id: 'email-sig', name: 'Email Signature', icon: Mail, category: 'Business', description: 'Create professional HTML email signatures.' },
  { id: 'qr-code', name: 'QR Code Gen', icon: QrCode, category: 'Utility', description: 'Generate QR codes for URLs, text, or contact info.' },
  { id: 'barcode', name: 'Barcode Gen', icon: Barcode, category: 'Utility', description: 'Create standard barcodes (Code128, EAN, etc.).' },
  { id: 'invoice', name: 'Invoice Gen', icon: FileText, category: 'Business', description: 'Generate professional PDF invoices quickly.' },
  { id: 'resume', name: 'Resume Gen', icon: FileUser, category: 'Identity', description: 'Create a simple, professional resume template.' },
  { id: 'cover-letter', name: 'Cover Letter', icon: FileEdit, category: 'Identity', description: 'AI-generated cover letters tailored to a job.' },
  { id: 'ai-bio', name: 'AI Bio Gen', icon: Sparkles, category: 'Marketing', description: 'Generate professional or creative social media bios.' },
  { id: 'ai-product', name: 'AI Product Desc', icon: ShoppingBag, category: 'Marketing', description: 'Create compelling product descriptions with AI.' },
  { id: 'ai-ad', name: 'AI Ad Copy', icon: Megaphone, category: 'Marketing', description: 'Generate high-converting ad copy for any platform.' },
  { id: 'random-quote', name: 'Random Quote', icon: Quote, category: 'Utility', description: 'Get inspired with a random famous quote.' },
  { id: 'random-number', name: 'Random Number', icon: Hash, category: 'Utility', description: 'Generate random numbers within a specific range.' },
];

export default function Generators() {
  const [activeToolId, setActiveToolId] = useState<GeneratorId>('password');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(false);

  const activeTool = GENERATOR_TOOLS.find(t => t.id === activeToolId) || GENERATOR_TOOLS[0];

  useEffect(() => {
    setResult(null);
    setResultUrl(null);
    if (window.innerWidth < 1024) setIsToolSidebarOpen(false);
  }, [activeToolId]);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
            <h3 className="text-sm font-bold text-slate-900">Generators</h3>
            <button onClick={() => setIsToolSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          {(['Identity', 'Business', 'Marketing', 'Utility'] as const).map(cat => (
            <div key={cat}>
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {cat} Generators
              </h3>
              <div className="space-y-1">
                {GENERATOR_TOOLS.filter(t => t.category === cat).map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveToolId(tool.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      activeToolId === tool.id 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <tool.icon className={cn("w-4 h-4", activeToolId === tool.id ? "text-white" : "text-slate-400")} />
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

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-8 lg:p-12 shadow-sm min-h-[400px] sm:min-h-[500px]">
            {activeToolId === 'password' && <PasswordGeneratorView />}
            {activeToolId === 'username' && <UsernameGeneratorView />}
            {activeToolId === 'business' && <AIGeneratorView type="business" />}
            {activeToolId === 'domain' && <AIGeneratorView type="domain" />}
            {activeToolId === 'email-sig' && <EmailSignatureView />}
            {activeToolId === 'qr-code' && <QRCodeGeneratorView />}
            {activeToolId === 'barcode' && <BarcodeGeneratorView />}
            {activeToolId === 'invoice' && <InvoiceGeneratorView />}
            {activeToolId === 'resume' && <ResumeGeneratorView />}
            {activeToolId === 'cover-letter' && <AIGeneratorView type="cover-letter" />}
            {activeToolId === 'ai-bio' && <AIGeneratorView type="bio" />}
            {activeToolId === 'ai-product' && <AIGeneratorView type="product" />}
            {activeToolId === 'ai-ad' && <AIGeneratorView type="ad" />}
            {activeToolId === 'random-quote' && <RandomQuoteView />}
            {activeToolId === 'random-number' && <RandomNumberView />}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Generator Views ---

function PasswordGeneratorView() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };
    
    let charset = '';
    if (options.uppercase) charset += chars.uppercase;
    if (options.lowercase) charset += chars.lowercase;
    if (options.numbers) charset += chars.numbers;
    if (options.symbols) charset += chars.symbols;

    if (!charset) return;

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  useEffect(generate, [length, options]);

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="bg-slate-900 rounded-3xl p-8 text-center shadow-2xl relative group">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Generated Password</div>
        <div className="text-3xl font-mono font-bold text-white break-all">{password || 'Select options'}</div>
        <div className="mt-6 flex justify-center gap-2">
          <button 
            onClick={generate}
            className="p-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { navigator.clipboard.writeText(password); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">Length: {length}</label>
            <input 
              type="range" min="8" max="64" value={length} 
              onChange={e => setLength(parseInt(e.target.value))}
              className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(options).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setOptions(prev => ({ ...prev, [key]: !val }))}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-bold text-sm capitalize",
                  val ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-100 text-slate-400"
                )}
              >
                {key}
                {val ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsernameGeneratorView() {
  const [keywords, setKeywords] = useState('');
  const [usernames, setUsernames] = useState<string[]>([]);

  const generate = () => {
    const prefixes = ['The', 'Real', 'Official', 'Its', 'Super', 'Cool', 'Mega', 'Ultra', 'Neon', 'Cyber'];
    const suffixes = ['Pro', 'Gamer', 'Dev', 'Life', 'World', 'Master', 'King', 'Queen', 'X', '99'];
    const base = keywords.split(',')[0].trim() || 'User';
    
    const results = [];
    for (let i = 0; i < 10; i++) {
      const p = prefixes[Math.floor(Math.random() * prefixes.length)];
      const s = suffixes[Math.floor(Math.random() * suffixes.length)];
      const num = Math.floor(Math.random() * 1000);
      
      const variants = [
        `${p}${base}`,
        `${base}${s}`,
        `${p}${base}${s}`,
        `${base}${num}`,
        `${p}_${base}`,
        `${base}.${s}`
      ];
      results.push(variants[Math.floor(Math.random() * variants.length)]);
    }
    setUsernames([...new Set(results)]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex gap-4">
        <input 
          type="text" 
          placeholder="Enter keywords (e.g. tech, music)..." 
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
        />
        <button 
          onClick={generate}
          className="px-8 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Generate
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {usernames.map((u, i) => (
          <button
            key={i}
            onClick={() => { navigator.clipboard.writeText(u); }}
            className="bg-white border border-slate-100 rounded-2xl p-4 text-center hover:border-indigo-600 hover:shadow-md transition-all group"
          >
            <span className="text-slate-900 font-bold block mb-1">{u}</span>
            <span className="text-[10px] text-slate-400 uppercase font-black group-hover:text-indigo-600">Click to Copy</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AIGeneratorView({ type }: { type: 'business' | 'domain' | 'bio' | 'product' | 'ad' | 'cover-letter' }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompts = {
        business: `Generate 10 creative and catchy business names for: ${input}`,
        domain: `Suggest 10 unique .com domain names for: ${input}`,
        bio: `Write a professional and creative social media bio for: ${input}`,
        product: `Write a compelling product description for: ${input}`,
        ad: `Write high-converting ad copy for: ${input}`,
        'cover-letter': `Write a professional cover letter for a job with these details: ${input}`
      };
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompts[type],
      });
      setOutput(response.text || '');
    } catch (err) {
      console.error(err);
      setOutput('Error generating content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {type === 'business' ? 'What is your business about?' : 
           type === 'bio' ? 'Tell us about yourself...' : 
           'Enter details...'}
        </label>
        <textarea 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type here..."
          className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-6 outline-none focus:ring-2 focus:ring-indigo-500 font-medium resize-none"
        />
        <button 
          onClick={generate}
          disabled={loading || !input}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Generate with AI
        </button>
      </div>

      {output && (
        <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Result</span>
            <button 
              onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 text-xs font-bold"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="text-slate-300 whitespace-pre-wrap font-medium leading-relaxed">{output}</div>
        </div>
      )}
    </div>
  );
}

function EmailSignatureView() {
  const [data, setData] = useState({ name: 'John Doe', role: 'Product Designer', company: 'Text', email: 'john@example.com', phone: '+1 234 567 890' });
  const [copied, setCopied] = useState(false);

  const signatureHtml = `
<div style="font-family: Arial, sans-serif; color: #333;">
  <p style="margin: 0; font-weight: bold; font-size: 16px;">${data.name}</p>
  <p style="margin: 0; color: #666; font-size: 14px;">${data.role} @ ${data.company}</p>
  <div style="margin-top: 10px; font-size: 12px; color: #888;">
    <p style="margin: 2px 0;">Email: <a href="mailto:${data.email}" style="color: #4f46e5; text-decoration: none;">${data.email}</a></p>
    <p style="margin: 2px 0;">Phone: ${data.phone}</p>
  </div>
</div>`;

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-4">
        {Object.entries(data).map(([key, val]) => (
          <div key={key} className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key}</label>
            <input 
              type="text" value={val} 
              onChange={e => setData(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
            />
          </div>
        ))}
      </div>
      <div className="space-y-6">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preview</label>
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm min-h-[150px] flex items-center justify-center">
          <div dangerouslySetInnerHTML={{ __html: signatureHtml }} />
        </div>
        <button 
          onClick={() => { navigator.clipboard.writeText(signatureHtml); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          Copy HTML Code
        </button>
      </div>
    </div>
  );
}

function QRCodeGeneratorView() {
  const [text, setText] = useState('https://text.app');
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, { width: 400, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } })
        .then(url => setQrUrl(url))
        .catch(err => console.error(err));
    }
  }, [text]);

  return (
    <div className="max-w-md mx-auto space-y-8 text-center">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enter URL or Text</label>
        <input 
          type="text" value={text} onChange={e => setText(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-center"
        />
      </div>
      {qrUrl && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl inline-block">
            <img src={qrUrl} alt="QR Code" className="w-64 h-64" />
          </div>
          <a 
            href={qrUrl} download="qrcode.png"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Download className="w-5 h-5" /> Download PNG
          </a>
        </div>
      )}
    </div>
  );
}

function BarcodeGeneratorView() {
  const [text, setText] = useState('123456789');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (text && canvasRef.current) {
      try {
        JsBarcode(canvasRef.current, text, {
          format: "CODE128",
          lineColor: "#0f172a",
          width: 2,
          height: 100,
          displayValue: true
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [text]);

  return (
    <div className="max-w-md mx-auto space-y-8 text-center">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enter Value</label>
        <input 
          type="text" value={text} onChange={e => setText(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-center"
        />
      </div>
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl inline-block">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

function InvoiceGeneratorView() {
  const [invoice, setInvoice] = useState({ number: 'INV-001', date: format(new Date(), 'yyyy-MM-dd'), client: 'Client Name', items: [{ desc: 'Service', qty: 1, price: 100 }] });

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('INVOICE', 20, 20);
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.number}`, 20, 35);
    doc.text(`Date: ${invoice.date}`, 20, 42);
    doc.text(`To: ${invoice.client}`, 20, 55);
    
    let y = 70;
    doc.text('Description', 20, y);
    doc.text('Qty', 120, y);
    doc.text('Price', 150, y);
    doc.text('Total', 180, y);
    
    y += 10;
    let total = 0;
    invoice.items.forEach(item => {
      const lineTotal = item.qty * item.price;
      doc.text(item.desc, 20, y);
      doc.text(item.qty.toString(), 120, y);
      doc.text(`$${item.price}`, 150, y);
      doc.text(`$${lineTotal}`, 180, y);
      total += lineTotal;
      y += 10;
    });
    
    doc.setFontSize(14);
    doc.text(`Total Amount: $${total}`, 140, y + 10);
    doc.save(`invoice-${invoice.number}.pdf`);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice #</label>
            <input type="text" value={invoice.number} onChange={e => setInvoice(prev => ({ ...prev, number: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none font-bold text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
            <input type="date" value={invoice.date} onChange={e => setInvoice(prev => ({ ...prev, date: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none font-bold text-sm" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</label>
          <input type="text" value={invoice.client} onChange={e => setInvoice(prev => ({ ...prev, client: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none font-bold text-sm" />
        </div>
        <button onClick={generatePdf} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <Download className="w-5 h-5" /> Generate PDF Invoice
        </button>
      </div>
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col items-center justify-center">
        <FileText className="w-16 h-16 text-slate-200 mb-4" />
        <p className="text-sm font-bold text-slate-400">Invoice Preview</p>
      </div>
    </div>
  );
}

function ResumeGeneratorView() {
  const [resume, setResume] = useState({ name: 'Jane Doe', email: 'jane@example.com', summary: 'Experienced software engineer...', experience: 'Senior Developer @ TechCorp (2020-Present)' });

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.text(resume.name, 20, 25);
    doc.setFontSize(12);
    doc.text(resume.email, 20, 35);
    doc.line(20, 40, 190, 40);
    
    doc.setFontSize(14);
    doc.text('Professional Summary', 20, 55);
    doc.setFontSize(11);
    const summary = doc.splitTextToSize(resume.summary, 170);
    doc.text(summary, 20, 65);
    
    doc.setFontSize(14);
    doc.text('Experience', 20, 95);
    doc.setFontSize(11);
    const exp = doc.splitTextToSize(resume.experience, 170);
    doc.text(exp, 20, 105);
    
    doc.save(`resume-${resume.name.replace(' ', '-')}.pdf`);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
          <input type="text" value={resume.name} onChange={e => setResume(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none font-bold text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Summary</label>
          <textarea value={resume.summary} onChange={e => setResume(prev => ({ ...prev, summary: e.target.value }))} className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm resize-none" />
        </div>
        <button onClick={generatePdf} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <Download className="w-5 h-5" /> Generate PDF Resume
        </button>
      </div>
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col items-center justify-center">
        <FileUser className="w-16 h-16 text-slate-200 mb-4" />
        <p className="text-sm font-bold text-slate-400">Resume Preview</p>
      </div>
    </div>
  );
}

function RandomQuoteView() {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [loading, setLoading] = useState(false);

  const QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  ];

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
      setLoading(false);
    }, 300);
  };

  useEffect(generate, []);

  return (
    <div className="max-w-2xl mx-auto text-center space-y-12 py-12">
      <div className="relative">
        <Quote className="w-20 h-20 text-indigo-50 absolute -top-10 -left-10 -z-10" />
        {loading ? (
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
        ) : (
          <div className="space-y-6">
            <p className="text-3xl font-serif italic text-slate-800 leading-relaxed">"{quote.text}"</p>
            <p className="text-lg font-bold text-indigo-600">— {quote.author}</p>
          </div>
        )}
      </div>
      <button 
        onClick={generate}
        className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
      >
        Get Another Quote
      </button>
    </div>
  );
}

function RandomNumberView() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);

  const generate = () => {
    const r = Math.floor(Math.random() * (max - min + 1)) + min;
    setResult(r);
  };

  useEffect(generate, []);

  return (
    <div className="max-w-md mx-auto space-y-12 text-center">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Min</label>
          <input type="number" value={min} onChange={e => setMin(parseInt(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-xl text-center" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Max</label>
          <input type="number" value={max} onChange={e => setMax(parseInt(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-xl text-center" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="w-48 h-48 bg-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-indigo-200 border-8 border-white">
          <span className="text-6xl font-black text-white">{result}</span>
        </div>
        <button 
          onClick={generate}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          Roll Again
        </button>
      </div>
    </div>
  );
}

function format(date: Date, fmt: string) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return fmt.replace('yyyy', String(y)).replace('MM', m).replace('dd', d);
}
