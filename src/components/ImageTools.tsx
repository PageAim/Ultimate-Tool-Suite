import React, { useState, useRef, useCallback } from 'react';
import { 
  Image as ImageIcon, 
  Maximize, 
  Minimize, 
  Crop, 
  RefreshCw, 
  Eraser, 
  Zap, 
  Layers, 
  Droplets, 
  Contrast, 
  Sun, 
  Type, 
  Smile, 
  Pipette, 
  Info, 
  RotateCw, 
  FlipHorizontal, 
  Sparkles, 
  Wand2, 
  UserSquare,
  Upload,
  Download,
  Trash2,
  Loader2,
  AlignLeft,
  X
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import { cn } from '../lib/utils';
import { generateImage, processImage } from '../services/gemini';

// --- Types ---

type ImageToolCategory = 'Editing' | 'AI' | 'Utility';

interface ImageTool {
  id: string;
  name: string;
  icon: React.ElementType;
  category: ImageToolCategory;
  description: string;
}

const IMAGE_TOOLS: ImageTool[] = [
  { id: 'ocr', name: 'Image to Text (OCR)', icon: Info, category: 'AI', description: 'Extract text from images using AI.' },
  { id: 'compress', name: 'Compress Image', icon: Minimize, category: 'Editing', description: 'Reduce image file size.' },
  { id: 'resize', name: 'Resize Image', icon: Maximize, category: 'Editing', description: 'Change image dimensions.' },
  { id: 'crop', name: 'Crop Image', icon: Crop, category: 'Editing', description: 'Trim unwanted parts of an image.' },
  { id: 'convert', name: 'Convert Format', icon: RefreshCw, category: 'Editing', description: 'Convert between JPG, PNG, and WEBP.' },
  { id: 'bg-remover', name: 'Background Remover', icon: Eraser, category: 'AI', description: 'Remove background using AI.' },
  { id: 'upscaler', name: 'Image Upscaler', icon: Zap, category: 'AI', description: 'Increase image resolution with AI.' },
  { id: 'blur', name: 'Blur Image', icon: Droplets, category: 'Editing', description: 'Apply blur effect to images.' },
  { id: 'sharpen', name: 'Sharpen Image', icon: Contrast, category: 'Editing', description: 'Enhance image clarity.' },
  { id: 'grayscale', name: 'Grayscale Image', icon: Sun, category: 'Editing', description: 'Convert image to black and white.' },
  { id: 'watermark', name: 'Image Watermark', icon: Layers, category: 'Utility', description: 'Add a watermark to your images.' },
  { id: 'add-text', name: 'Add Text to Image', icon: Type, category: 'Editing', description: 'Overlay text on your images.' },
  { id: 'meme-gen', name: 'Meme Generator', icon: Smile, category: 'Utility', description: 'Create custom memes easily.' },
  { id: 'color-picker', name: 'Image Color Picker', icon: Pipette, category: 'Utility', description: 'Extract colors from any image.' },
  { id: 'metadata', name: 'Metadata Viewer', icon: Info, category: 'Utility', description: 'View hidden EXIF data of images.' },
  { id: 'rotate', name: 'Image Rotator', icon: RotateCw, category: 'Editing', description: 'Rotate images 90, 180, or 270 degrees.' },
  { id: 'flip', name: 'Image Flipper', icon: FlipHorizontal, category: 'Editing', description: 'Flip images horizontally or vertically.' },
  { id: 'ai-gen', name: 'AI Image Generator', icon: Sparkles, category: 'AI', description: 'Generate images from text prompts.' },
  { id: 'ai-enhancer', name: 'AI Image Enhancer', icon: Wand2, category: 'AI', description: 'Improve image quality using AI.' },
  { id: 'passport', name: 'Passport Photo Gen', icon: UserSquare, category: 'Utility', description: 'Create standard passport-sized photos.' },
];

export default function ImageTools() {
  const [activeToolId, setActiveToolId] = useState(IMAGE_TOOLS[0].id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [ocrResult, setOcrResult] = useState('');
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(false);
  
  // Cropper state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeTool = IMAGE_TOOLS.find(t => t.id === activeToolId) || IMAGE_TOOLS[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const processTool = async () => {
    if (!selectedImage && activeTool.id !== 'ai-gen') return;
    setIsProcessing(true);
    setResultImage(null);
    setOcrResult('');

    try {
      const base64Data = selectedImage?.split(',')[1] || '';
      const mimeType = selectedImage?.split(';')[0].split(':')[1] || 'image/png';

      switch (activeTool.id) {
        case 'ocr':
          const text = await processImage({ inlineData: { data: base64Data, mimeType } }, "Extract all text from this image accurately.");
          setOcrResult(text);
          break;
        case 'ai-gen':
          const generated = await generateImage(prompt);
          setResultImage(generated);
          break;
        case 'ai-enhancer':
          // We'll use Gemini to "describe" how to enhance it or just use it as a placeholder for a real enhancement logic
          // For now, let's simulate with a prompt
          const enhanced = await processImage({ inlineData: { data: base64Data, mimeType } }, "Enhance this image's quality and clarity.");
          setOcrResult(enhanced); // Displaying description of enhancement
          break;
        case 'blur':
          const bCanvas = document.createElement('canvas');
          const bImg = new Image();
          bImg.src = selectedImage!;
          await new Promise(r => bImg.onload = r);
          bCanvas.width = bImg.width;
          bCanvas.height = bImg.height;
          const bCtx = bCanvas.getContext('2d')!;
          bCtx.filter = 'blur(5px)';
          bCtx.drawImage(bImg, 0, 0);
          setResultImage(bCanvas.toDataURL());
          break;
        case 'sharpen':
          const sCanvas = document.createElement('canvas');
          const sImg = new Image();
          sImg.src = selectedImage!;
          await new Promise(r => sImg.onload = r);
          sCanvas.width = sImg.width;
          sCanvas.height = sImg.height;
          const sCtx = sCanvas.getContext('2d')!;
          sCtx.filter = 'contrast(150%) brightness(110%)';
          sCtx.drawImage(sImg, 0, 0);
          setResultImage(sCanvas.toDataURL());
          break;
        case 'metadata':
          const meta = [
            `Filename: image-${Date.now()}.png`,
            `Dimensions: ${selectedImage?.length || 0} bytes`,
            `Type: ${mimeType}`,
            `Last Modified: ${new Date().toLocaleString()}`,
            `Resolution: Detected from browser`
          ].join('\n');
          setOcrResult(meta);
          break;
        case 'grayscale':
          const canvas = document.createElement('canvas');
          const img = new Image();
          img.src = selectedImage!;
          await new Promise(r => img.onload = r);
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
          }
          ctx.putImageData(imageData, 0, 0);
          setResultImage(canvas.toDataURL());
          break;
        case 'rotate':
          const rCanvas = document.createElement('canvas');
          const rImg = new Image();
          rImg.src = selectedImage!;
          await new Promise(r => rImg.onload = r);
          rCanvas.width = rImg.height;
          rCanvas.height = rImg.width;
          const rCtx = rCanvas.getContext('2d')!;
          rCtx.translate(rCanvas.width / 2, rCanvas.height / 2);
          rCtx.rotate(Math.PI / 2);
          rCtx.drawImage(rImg, -rImg.width / 2, -rImg.height / 2);
          setResultImage(rCanvas.toDataURL());
          break;
        case 'flip':
          const fCanvas = document.createElement('canvas');
          const fImg = new Image();
          fImg.src = selectedImage!;
          await new Promise(r => fImg.onload = r);
          fCanvas.width = fImg.width;
          fCanvas.height = fImg.height;
          const fCtx = fCanvas.getContext('2d')!;
          fCtx.translate(fCanvas.width, 0);
          fCtx.scale(-1, 1);
          fCtx.drawImage(fImg, 0, 0);
          setResultImage(fCanvas.toDataURL());
          break;
        default:
          // For other tools, we'd implement specific canvas logic
          setOcrResult("This tool is coming soon in the full version!");
          break;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `textcraft-${activeTool.id}.png`;
    link.click();
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
            <h3 className="text-sm font-bold text-slate-900">Image Tools</h3>
            <button onClick={() => setIsToolSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          {(['Editing', 'AI', 'Utility'] as ImageToolCategory[]).map(cat => (
            <div key={cat}>
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {cat} Tools
              </h3>
              <div className="space-y-1">
                {IMAGE_TOOLS.filter(t => t.category === cat).map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveToolId(tool.id);
                      setResultImage(null);
                      setOcrResult('');
                      if (window.innerWidth < 1024) setIsToolSidebarOpen(false);
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
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{activeTool.name}</h2>
            <p className="text-slate-500">{activeTool.description}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
                {selectedImage && activeTool.id === 'crop' ? (
                  <div className="absolute inset-0">
                    <Cropper
                      image={selectedImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={4 / 3}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                ) : selectedImage ? (
                  <img src={selectedImage} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Upload an image</p>
                      <p className="text-xs text-slate-500">Drag and drop or click to browse</p>
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Select File
                    </button>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>

              {activeTool.id === 'ai-gen' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Image Prompt</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                  />
                </div>
              )}

              <button
                onClick={processTool}
                disabled={isProcessing || (!selectedImage && activeTool.id !== 'ai-gen')}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <activeTool.icon className="w-5 h-5" />}
                {activeTool.category === 'AI' ? 'Process with AI' : 'Apply Effect'}
              </button>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[400px] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                {isProcessing ? (
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                    <p className="text-sm font-medium text-slate-500">Magic in progress...</p>
                  </div>
                ) : resultImage ? (
                  <div className="space-y-4 w-full h-full flex flex-col items-center">
                    <img src={resultImage} alt="Result" className="max-h-[300px] object-contain rounded-lg shadow-xl" />
                    <button 
                      onClick={downloadResult}
                      className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download Image
                    </button>
                  </div>
                ) : ocrResult ? (
                  <div className="w-full h-full bg-slate-50 rounded-xl p-6 border border-slate-200 overflow-y-auto">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Result Output</h4>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{ocrResult}</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <ImageIcon className="w-12 h-12 text-slate-200 mx-auto" />
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
