import React, { useState, useEffect } from 'react';
import { 
  Type, 
  Hash, 
  AlignLeft, 
  FileText, 
  Scissors, 
  Eraser, 
  Search, 
  RefreshCw, 
  SortAsc, 
  Copy, 
  Link, 
  FileCode, 
  Smile, 
  Volume2, 
  Mic, 
  BarChart2, 
  BookOpen, 
  Zap, 
  CheckCircle2, 
  Sparkles, 
  Trash2,
  Check,
  X,
  RefreshCw as RefreshIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateText } from '../services/gemini';
import Markdown from 'react-markdown';

type ToolCategory = 'Basic' | 'Advanced' | 'AI' | 'Audio';

interface Tool {
  id: string;
  name: string;
  icon: React.ElementType;
  category: ToolCategory;
  description: string;
}

const TOOLS: Tool[] = [
  { id: 'case-converter', name: 'Text Case Converter', icon: Type, category: 'Basic', description: 'Convert text to Uppercase, Lowercase, Title Case, etc.' },
  { id: 'word-counter', name: 'Word Counter', icon: AlignLeft, category: 'Basic', description: 'Count words in your text.' },
  { id: 'char-counter', name: 'Character Counter', icon: Hash, category: 'Basic', description: 'Count characters in your text.' },
  { id: 'sentence-counter', name: 'Sentence Counter', icon: FileText, category: 'Basic', description: 'Count sentences in your text.' },
  { id: 'paragraph-counter', name: 'Paragraph Counter', icon: FileText, category: 'Basic', description: 'Count paragraphs in your text.' },
  { id: 'remove-spaces', name: 'Remove Extra Spaces', icon: Scissors, category: 'Basic', description: 'Remove double spaces and leading/trailing whitespace.' },
  { id: 'remove-line-breaks', name: 'Remove Line Breaks', icon: Eraser, category: 'Basic', description: 'Convert multi-line text into a single line.' },
  { id: 'find-replace', name: 'Find & Replace Text', icon: Search, category: 'Basic', description: 'Quickly find and replace strings within your text.' },
  { id: 'text-reverser', name: 'Text Reverser', icon: RefreshCw, category: 'Basic', description: 'Flip your text backwards.' },
  { id: 'text-sorter', name: 'Text Sorter', icon: SortAsc, category: 'Basic', description: 'Sort lines alphabetically (A-Z or Z-A).' },
  { id: 'remove-duplicates', name: 'Remove Duplicate Lines', icon: Trash2, category: 'Basic', description: 'Clean up your lists by removing repeating lines.' },
  { id: 'slug-generator', name: 'Slug Generator', icon: Link, category: 'Advanced', description: 'Create URL-friendly slugs from any string.' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', icon: FileCode, category: 'Advanced', description: 'Generate placeholder text for your designs.' },
  { id: 'text-to-emoji', name: 'Text to Emoji Converter', icon: Smile, category: 'Advanced', description: 'Replace keywords with matching emojis.' },
  { id: 'emoji-remover', name: 'Emoji Remover', icon: Eraser, category: 'Advanced', description: 'Strip all emojis from your text.' },
  { id: 'text-to-speech', name: 'Text to Speech', icon: Volume2, category: 'Audio', description: 'Listen to your text being read aloud.' },
  { id: 'speech-to-text', name: 'Speech to Text', icon: Mic, category: 'Audio', description: 'Convert your voice into written text.' },
  { id: 'keyword-density', name: 'Keyword Density Checker', icon: BarChart2, category: 'Advanced', description: 'Analyze how often words appear in your text.' },
  { id: 'readability', name: 'Readability Checker', icon: BookOpen, category: 'Advanced', description: 'Check how easy your text is to read.' },
  { id: 'summarizer', name: 'Text Summarizer', icon: Zap, category: 'AI', description: 'Get a concise summary of long articles.' },
  { id: 'grammar-checker', name: 'Grammar Checker', icon: CheckCircle2, category: 'AI', description: 'Fix grammatical errors automatically.' },
  { id: 'spell-checker', name: 'Spell Checker', icon: CheckCircle2, category: 'AI', description: 'Correct spelling mistakes.' },
  { id: 'hashtag-generator', name: 'Hashtag Generator', icon: Hash, category: 'AI', description: 'Generate relevant hashtags for social media.' },
  { id: 'social-caption', name: 'Social Caption Generator', icon: Sparkles, category: 'AI', description: 'Create engaging captions for your posts.' },
  { id: 'ai-rewrite', name: 'AI Rewrite Tool', icon: Sparkles, category: 'AI', description: 'Paraphrase or rewrite your text in different styles.' },
];

export default function TextTools({ activeToolId, setActiveToolId }: { activeToolId: string, setActiveToolId: (id: string) => void }) {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(false);

  const activeTool = TOOLS.find(t => t.id === activeToolId) || TOOLS[0];

  useEffect(() => {
    setOutputText('');
    setCopied(false);
    if (window.innerWidth < 1024) setIsToolSidebarOpen(false);
  }, [activeToolId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText || inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const processTool = async () => {
    if (!inputText && activeTool.id !== 'lorem-ipsum') return;
    setIsProcessing(true);

    try {
      switch (activeTool.id) {
        case 'word-counter':
          setOutputText(`Word Count: ${inputText.trim().split(/\s+/).filter(Boolean).length}`);
          break;
        case 'char-counter':
          setOutputText(`Character Count: ${inputText.length}`);
          break;
        case 'sentence-counter':
          setOutputText(`Sentence Count: ${inputText.split(/[.!?]+/).filter(Boolean).length}`);
          break;
        case 'paragraph-counter':
          setOutputText(`Paragraph Count: ${inputText.split(/\n+/).filter(Boolean).length}`);
          break;
        case 'remove-spaces':
          setOutputText(inputText.replace(/\s+/g, ' ').trim());
          break;
        case 'remove-line-breaks':
          setOutputText(inputText.replace(/\n+/g, ' ').trim());
          break;
        case 'text-reverser':
          setOutputText(inputText.split('').reverse().join(''));
          break;
        case 'text-sorter':
          setOutputText(inputText.split('\n').sort().join('\n'));
          break;
        case 'remove-duplicates':
          setOutputText([...new Set(inputText.split('\n'))].join('\n'));
          break;
        case 'slug-generator':
          setOutputText(inputText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''));
          break;
        case 'lorem-ipsum':
          setOutputText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
          break;
        case 'text-to-emoji':
          const emojiMap: Record<string, string> = { love: '❤️', happy: '😊', sad: '😢', fire: '🔥', cool: '😎' };
          let text = inputText;
          Object.entries(emojiMap).forEach(([word, emoji]) => {
            text = text.replace(new RegExp(`\\b${word}\\b`, 'gi'), emoji);
          });
          setOutputText(text);
          break;
        case 'emoji-remover':
          setOutputText(inputText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ''));
          break;
        case 'summarizer':
          setOutputText(await generateText(inputText, "Summarize the following text concisely."));
          break;
        case 'grammar-checker':
          setOutputText(await generateText(inputText, "Correct the grammar and punctuation of the following text. Only return the corrected text."));
          break;
        case 'spell-checker':
          setOutputText(await generateText(inputText, "Correct the spelling of the following text. Only return the corrected text."));
          break;
        case 'hashtag-generator':
          setOutputText(await generateText(inputText, "Generate 10 relevant hashtags for the following content. Output only the hashtags separated by spaces."));
          break;
        case 'social-caption':
          setOutputText(await generateText(inputText, "Write 3 engaging social media captions for the following content."));
          break;
        case 'ai-rewrite':
          setOutputText(await generateText(inputText, "Rewrite the following text to be more professional and engaging."));
          break;
        case 'keyword-density':
          const words = inputText.toLowerCase().match(/\b\w+\b/g) || [];
          const counts: Record<string, number> = {};
          words.forEach(w => counts[w] = (counts[w] || 0) + 1);
          const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
          setOutputText(sorted.map(([w, c]) => `${w}: ${((c / words.length) * 100).toFixed(2)}% (${c})`).join('\n'));
          break;
        case 'readability':
          const charCount = inputText.length;
          const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
          const sentCount = inputText.split(/[.!?]+/).filter(Boolean).length;
          const score = 206.835 - 1.015 * (wordCount / sentCount) - 84.6 * (charCount / wordCount / 5);
          setOutputText(`Estimated Readability Score: ${score.toFixed(2)}\n(Higher is easier to read)`);
          break;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const convertCase = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
    let result = inputText;
    if (type === 'upper') result = inputText.toUpperCase();
    if (type === 'lower') result = inputText.toLowerCase();
    if (type === 'title') result = inputText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    if (type === 'sentence') result = inputText.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
    setOutputText(result);
  };

  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const handleReplace = () => {
    setOutputText(inputText.replaceAll(findText, replaceText));
  };

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(inputText);
    window.speechSynthesis.speak(utterance);
  };

  const [isListening, setIsListening] = useState(false);
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      setInputText(prev => prev + ' ' + event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
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

      {/* Sidebar for Text Tools */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 overflow-y-auto transition-transform duration-300 lg:relative lg:translate-x-0",
        !isToolSidebarOpen && "-translate-x-full"
      )}>
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between lg:hidden mb-2">
            <h3 className="text-sm font-bold text-slate-900">Text Tools</h3>
            <button onClick={() => setIsToolSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          {(['Basic', 'Advanced', 'Audio', 'AI'] as ToolCategory[]).map(cat => (
            <div key={cat}>
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {cat} Tools
              </h3>
              <div className="space-y-1">
                {TOOLS.filter(t => t.category === cat).map(tool => (
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
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{activeTool.name}</h2>
            <p className="text-slate-500">{activeTool.description}</p>
          </div>

          <div className="grid gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <label className="text-sm font-bold text-slate-700">Input Text</label>
                <button onClick={() => setInputText('')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or type your text here..."
                className="w-full h-64 p-6 resize-none focus:outline-none text-slate-700 leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {activeTool.id === 'case-converter' ? (
                <>
                  <button onClick={() => convertCase('upper')} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">UPPERCASE</button>
                  <button onClick={() => convertCase('lower')} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">lowercase</button>
                  <button onClick={() => convertCase('title')} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">Title Case</button>
                </>
              ) : activeTool.id === 'find-replace' ? (
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <input type="text" placeholder="Find..." value={findText} onChange={(e) => setFindText(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-32" />
                  <input type="text" placeholder="Replace..." value={replaceText} onChange={(e) => setReplaceText(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-32" />
                  <button onClick={handleReplace} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">Replace All</button>
                </div>
              ) : activeTool.id === 'text-to-speech' ? (
                <button onClick={speak} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200">
                  <Volume2 className="w-4 h-4" /> Speak Text
                </button>
              ) : activeTool.id === 'speech-to-text' ? (
                <button onClick={startListening} disabled={isListening} className={cn("px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg", isListening ? "bg-red-500 text-white animate-pulse" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200")}>
                  <Mic className="w-4 h-4" /> {isListening ? 'Listening...' : 'Start Recording'}
                </button>
              ) : (
                <button onClick={processTool} disabled={isProcessing || (!inputText && activeTool.id !== 'lorem-ipsum')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
                  {isProcessing ? <RefreshIcon className="w-4 h-4 animate-spin" /> : <activeTool.icon className="w-4 h-4" />}
                  {activeTool.category === 'AI' ? 'Generate with AI' : 'Process Text'}
                </button>
              )}
            </div>

            {(outputText || isProcessing) && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <label className="text-sm font-bold text-slate-700">Result</label>
                  <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Result'}
                  </button>
                </div>
                <div className="p-6 min-h-[100px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {isProcessing ? (
                    <div className="flex items-center gap-3 text-slate-400">
                      <RefreshIcon className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">Processing...</span>
                    </div>
                  ) : (
                    <div className="markdown-body">
                      <Markdown>{outputText}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Words" value={inputText.trim().split(/\s+/).filter(Boolean).length} />
            <StatCard label="Chars" value={inputText.length} />
            <StatCard label="Sentences" value={inputText.split(/[.!?]+/).filter(Boolean).length} />
            <StatCard label="Paragraphs" value={inputText.split(/\n+/).filter(Boolean).length} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: number }) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 text-center">
      <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg sm:text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
