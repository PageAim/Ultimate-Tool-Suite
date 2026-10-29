import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Layers, 
  Type, 
  Square, 
  Box, 
  Image as ImageIcon, 
  PenTool, 
  Maximize, 
  Grid3X3, 
  Layout,
  RefreshCw,
  Copy,
  Check,
  Download,
  Sparkles,
  Loader2,
  ChevronRight,
  Plus,
  Minus,
  Settings,
  AlignLeft,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

// --- Types ---

type DesignToolId = 
  | 'palette' 
  | 'gradient' 
  | 'fonts' 
  | 'button' 
  | 'shadow' 
  | 'favicon' 
  | 'logo' 
  | 'resizer' 
  | 'instagram' 
  | 'wireframe';

interface DesignTool {
  id: DesignToolId;
  name: string;
  icon: React.ElementType;
  description: string;
}

const DESIGN_TOOLS: DesignTool[] = [
  { id: 'palette', name: 'Color Palette', icon: Palette, description: 'Generate beautiful color schemes for your projects.' },
  { id: 'gradient', name: 'Gradient Gen', icon: Layers, description: 'Create stunning CSS linear and radial gradients.' },
  { id: 'fonts', name: 'Font Pairing', icon: Type, description: 'Find perfect typography combinations for your UI.' },
  { id: 'button', name: 'Button Gen', icon: Square, description: 'Design and export custom CSS buttons.' },
  { id: 'shadow', name: 'Box Shadow', icon: Box, description: 'Generate realistic CSS box shadows with ease.' },
  { id: 'favicon', name: 'Favicon Gen', icon: ImageIcon, description: 'Create simple favicons from text or icons.' },
  { id: 'logo', name: 'Logo Gen', icon: PenTool, description: 'AI-powered logo ideas and concepts.' },
  { id: 'resizer', name: 'Image Resizer', icon: Maximize, description: 'Resize images for social media platforms.' },
  { id: 'instagram', name: 'Insta Grid', icon: Grid3X3, description: 'Preview how your images look in an Instagram grid.' },
  { id: 'wireframe', name: 'Wireframe Gen', icon: Layout, description: 'AI-generated UI wireframes and layouts.' },
];

export default function DesignTools() {
  const [activeToolId, setActiveToolId] = useState<DesignToolId>('palette');
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(false);
  const activeTool = DESIGN_TOOLS.find(t => t.id === activeToolId) || DESIGN_TOOLS[0];

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsToolSidebarOpen(false);
    }
  }, [activeToolId]);

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
        <div className="p-4">
          <div className="flex items-center justify-between lg:hidden mb-4 px-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Design & UI
            </h3>
            <button 
              onClick={() => setIsToolSidebarOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="hidden lg:block px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Design & UI
          </h3>
          <div className="space-y-1">
            {DESIGN_TOOLS.map(tool => (
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
      </aside>

      {/* Workspace */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{activeTool.name}</h2>
            <p className="text-sm sm:text-base text-slate-500">{activeTool.description}</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-12 shadow-sm min-h-[500px]">
            {activeToolId === 'palette' && <PaletteGeneratorView />}
            {activeToolId === 'gradient' && <GradientGeneratorView />}
            {activeToolId === 'fonts' && <FontPairingView />}
            {activeToolId === 'button' && <ButtonGeneratorView />}
            {activeToolId === 'shadow' && <BoxShadowView />}
            {activeToolId === 'favicon' && <FaviconGeneratorView />}
            {activeToolId === 'logo' && <AIGeneratorView type="logo" />}
            {activeToolId === 'resizer' && <ImageResizerView />}
            {activeToolId === 'instagram' && <InstagramGridView />}
            {activeToolId === 'wireframe' && <AIGeneratorView type="wireframe" />}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Tool Views ---

function PaletteGeneratorView() {
  const [colors, setColors] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    const newColors = Array.from({ length: 5 }, () => 
      '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase()
    );
    setColors(newColors);
  };

  useEffect(generate, []);

  const handleCopy = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-96">
        {colors.map((color, i) => (
          <div 
            key={i} 
            className="group relative rounded-2xl overflow-hidden shadow-sm transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: color }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleCopy(color, i)}
                className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                {copied === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {color}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button 
          onClick={generate}
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" /> Generate New Palette
        </button>
      </div>
    </div>
  );
}

function GradientGeneratorView() {
  const [color1, setColor1] = useState('#4f46e5');
  const [color2, setColor2] = useState('#9333ea');
  const [angle, setAngle] = useState(135);
  const [copied, setCopied] = useState(false);

  const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`background: ${gradient};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Color 1</label>
            <div className="flex gap-3">
              <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer" />
              <input type="text" value={color1} onChange={e => setColor1(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none font-mono text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Color 2</label>
            <div className="flex gap-3">
              <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer" />
              <input type="text" value={color2} onChange={e => setColor2(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none font-mono text-sm" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">Angle: {angle}°</label>
            <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
        </div>
        <button 
          onClick={handleCopy}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          Copy CSS Code
        </button>
      </div>
      <div className="space-y-4">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preview</label>
        <div 
          className="w-full h-80 rounded-3xl shadow-lg border-8 border-white"
          style={{ background: gradient }}
        />
      </div>
    </div>
  );
}

function FontPairingView() {
  const [pairings, setPairings] = useState<{ heading: string, body: string }[]>([]);

  const PAIRINGS = [
    { heading: 'Playfair Display', body: 'Source Sans Pro' },
    { heading: 'Montserrat', body: 'Open Sans' },
    { heading: 'Lato', body: 'Merriweather' },
    { heading: 'Oswald', body: 'Roboto' },
    { heading: 'Abril Fatface', body: 'Poppins' },
  ];

  useEffect(() => setPairings(PAIRINGS), []);

  return (
    <div className="space-y-12">
      <div className="grid gap-8">
        {pairings.map((p, i) => (
          <div key={i} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-indigo-200 transition-colors group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <h3 className="text-4xl font-bold text-slate-900" style={{ fontFamily: p.heading }}>{p.heading}</h3>
                <p className="text-slate-600 leading-relaxed" style={{ fontFamily: p.body }}>
                  The quick brown fox jumps over the lazy dog. This is a preview of how these two fonts look together in a real interface.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-500">H: {p.heading}</div>
                <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-500">B: {p.body}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ButtonGeneratorView() {
  const [text, setText] = useState('Get Started');
  const [bgColor, setBgColor] = useState('#4f46e5');
  const [textColor, setTextColor] = useState('#ffffff');
  const [radius, setRadius] = useState(12);
  const [paddingX, setPaddingX] = useState(24);
  const [paddingY, setPaddingY] = useState(12);
  const [copied, setCopied] = useState(false);

  const buttonStyle = {
    backgroundColor: bgColor,
    color: textColor,
    borderRadius: `${radius}px`,
    padding: `${paddingY}px ${paddingX}px`,
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-block'
  };

  const cssCode = `
.custom-button {
  background-color: ${bgColor};
  color: ${textColor};
  border-radius: ${radius}px;
  padding: ${paddingY}px ${paddingX}px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.custom-button:hover {
  opacity: 0.9;
}
  `.trim();

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Button Text</label>
          <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none font-bold" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Background</label>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Text Color</label>
            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">Radius: {radius}px</label>
            <input type="range" min="0" max="50" value={radius} onChange={e => setRadius(parseInt(e.target.value))} className="w-32 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">Padding X: {paddingX}px</label>
            <input type="range" min="8" max="64" value={paddingX} onChange={e => setPaddingX(parseInt(e.target.value))} className="w-32 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
        </div>
        <button 
          onClick={() => { navigator.clipboard.writeText(cssCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          Copy CSS Code
        </button>
      </div>
      <div className="bg-slate-50 rounded-3xl p-12 flex items-center justify-center border border-slate-100">
        <button style={buttonStyle}>{text}</button>
      </div>
    </div>
  );
}

function BoxShadowView() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(20);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('rgba(0,0,0,0.1)');
  const [copied, setCopied] = useState(false);

  const shadow = `${x}px ${y}px ${blur}px ${spread}px ${color}`;

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        {[
          { label: 'X Offset', val: x, set: setX, min: -50, max: 50 },
          { label: 'Y Offset', val: y, set: setY, min: -50, max: 50 },
          { label: 'Blur', val: blur, set: setBlur, min: 0, max: 100 },
          { label: 'Spread', val: spread, set: setSpread, min: -50, max: 50 }
        ].map(({ label, val, set, min, max }) => (
          <div key={label} className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">{label}: {val}px</label>
            <input 
              type="range" 
              min={min} 
              max={max} 
              value={val} 
              onChange={e => set(parseInt(e.target.value))} 
              className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
            />
          </div>
        ))}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shadow Color</label>
          <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none font-mono text-sm" />
        </div>
        <button 
          onClick={() => { navigator.clipboard.writeText(`box-shadow: ${shadow};`); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          Copy CSS Code
        </button>
      </div>
      <div className="bg-slate-50 rounded-3xl p-12 flex items-center justify-center border border-slate-100">
        <div className="w-48 h-48 bg-white rounded-3xl" style={{ boxShadow: shadow }} />
      </div>
    </div>
  );
}

function FaviconGeneratorView() {
  const [text, setText] = useState('TC');
  const [bgColor, setBgColor] = useState('#4f46e5');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const download = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'favicon.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.slice(0, 2), 16, 16);
      }
    }
  }, [text, bgColor]);

  return (
    <div className="max-w-md mx-auto space-y-8 text-center">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Text (Max 2)</label>
          <input type="text" maxLength={2} value={text} onChange={e => setText(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none font-bold text-center" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Background</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
        </div>
      </div>
      <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl inline-block">
        <canvas ref={canvasRef} width={32} height={32} className="w-32 h-32 rounded-lg image-pixelated" />
      </div>
      <button 
        onClick={download}
        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
      >
        <Download className="w-5 h-5" /> Download Favicon (32x32)
      </button>
    </div>
  );
}

function AIGeneratorView({ type }: { type: 'logo' | 'wireframe' }) {
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
        logo: `Generate 5 creative logo concepts and descriptions for a brand named: ${input}. Describe the colors, icons, and typography.`,
        wireframe: `Describe a detailed UI wireframe layout for a ${input} application. Include sections, components, and user flow.`
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
          {type === 'logo' ? 'What is your brand name and niche?' : 'Describe your app idea...'}
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
          Generate Concepts with AI
        </button>
      </div>

      {output && (
        <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Concepts</span>
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

function ImageResizerView() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [platform, setPlatform] = useState('instagram-post');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SIZES: Record<string, { w: number, h: number }> = {
    'instagram-post': { w: 1080, h: 1080 },
    'instagram-story': { w: 1080, h: 1920 },
    'twitter-header': { w: 1500, h: 500 },
    'facebook-cover': { w: 820, h: 312 },
    'youtube-thumbnail': { w: 1280, h: 720 }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
        >
          {selectedFile ? (
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
            </div>
          ) : (
            <div className="text-center">
              <Plus className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-400">Upload Image</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="hidden" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Platform</label>
          <select 
            value={platform} onChange={e => setPlatform(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none font-bold"
          >
            {Object.keys(SIZES).map(k => <option key={k} value={k}>{k.replace('-', ' ').toUpperCase()}</option>)}
          </select>
        </div>
        <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          Resize & Download
        </button>
      </div>
      <div className="bg-slate-50 rounded-3xl p-8 flex flex-col items-center justify-center border border-slate-100 text-center space-y-4">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <Maximize className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">Target Resolution</h4>
          <p className="text-2xl font-black text-indigo-600">{SIZES[platform].w} × {SIZES[platform].h}</p>
        </div>
      </div>
    </div>
  );
}

function InstagramGridView() {
  const [images, setImages] = useState<string[]>(Array(9).fill('https://picsum.photos/seed/placeholder/400/400'));

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="grid grid-cols-3 gap-1 bg-slate-200 p-1 rounded-lg">
        {images.map((img, i) => (
          <div key={i} className="aspect-square bg-white relative group cursor-pointer overflow-hidden">
            <img src={`${img}?sig=${i}`} alt={`Grid ${i}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-500">Click a square to upload an image and preview your grid layout.</p>
      </div>
    </div>
  );
}
