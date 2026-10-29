import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  FileCode, 
  Braces, 
  FileJson, 
  ShieldCheck, 
  FileType, 
  Hash, 
  Link, 
  Search, 
  Zap, 
  Copy, 
  Check,
  Trash2,
  FileText,
  Terminal,
  AlignLeft,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import * as prettier from 'prettier/standalone';
import * as parserBabel from 'prettier/parser-babel';
import * as parserHtml from 'prettier/parser-html';
import * as parserPostcss from 'prettier/parser-postcss';

// --- Types ---

type CodeToolId = 
  | 'html-format' 
  | 'css-format' 
  | 'js-format' 
  | 'json-format' 
  | 'json-validate' 
  | 'xml-format' 
  | 'base64-encode' 
  | 'base64-decode' 
  | 'url-encode' 
  | 'url-decode' 
  | 'regex-tester' 
  | 'minify-html' 
  | 'minify-css' 
  | 'minify-js' 
  | 'snippet-gen';

interface CodeTool {
  id: CodeToolId;
  name: string;
  icon: React.ElementType;
  description: string;
}

const CODE_TOOLS: CodeTool[] = [
  { id: 'html-format', name: 'HTML Formatter', icon: FileCode, description: 'Prettify your HTML code with proper indentation.' },
  { id: 'css-format', name: 'CSS Formatter', icon: FileType, description: 'Format and organize your CSS stylesheets.' },
  { id: 'js-format', name: 'JS Formatter', icon: Code2, description: 'Clean up and format JavaScript/TypeScript code.' },
  { id: 'json-format', name: 'JSON Formatter', icon: Braces, description: 'Format JSON data into a readable structure.' },
  { id: 'json-validate', name: 'JSON Validator', icon: ShieldCheck, description: 'Check if your JSON is valid and find errors.' },
  { id: 'xml-format', name: 'XML Formatter', icon: FileText, description: 'Format XML documents for better readability.' },
  { id: 'base64-encode', name: 'Base64 Encode', icon: Hash, description: 'Convert text or data into Base64 format.' },
  { id: 'base64-decode', name: 'Base64 Decode', icon: Hash, description: 'Decode Base64 strings back to plain text.' },
  { id: 'url-encode', name: 'URL Encoder', icon: Link, description: 'Safely encode characters for use in URLs.' },
  { id: 'url-decode', name: 'URL Decoder', icon: Link, description: 'Decode URL-encoded strings.' },
  { id: 'regex-tester', name: 'Regex Tester', icon: Search, description: 'Test and debug regular expressions.' },
  { id: 'minify-html', name: 'Minify HTML', icon: Zap, description: 'Compress HTML by removing whitespace and comments.' },
  { id: 'minify-css', name: 'Minify CSS', icon: Zap, description: 'Reduce CSS file size for production.' },
  { id: 'minify-js', name: 'Minify JS', icon: Zap, description: 'Minify JavaScript code to save bandwidth.' },
  { id: 'snippet-gen', name: 'Snippet Gen', icon: Terminal, description: 'Generate common code snippets quickly.' },
];

export default function CodeTools() {
  const [activeToolId, setActiveToolId] = useState<CodeToolId>('html-format');
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeTool = CODE_TOOLS.find(t => t.id === activeToolId) || CODE_TOOLS[0];

  useEffect(() => {
    setInput('');
    setOutput('');
    setError(null);
    if (window.innerWidth < 1024) {
      setIsToolSidebarOpen(false);
    }
  }, [activeToolId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const processCode = async () => {
    setError(null);
    try {
      let result = '';
      switch (activeToolId) {
        case 'html-format':
          result = await prettier.format(input, { parser: 'html', plugins: [parserHtml] });
          break;
        case 'css-format':
          result = await prettier.format(input, { parser: 'css', plugins: [parserPostcss] });
          break;
        case 'js-format':
          result = await prettier.format(input, { parser: 'babel', plugins: [parserBabel] });
          break;
        case 'json-format':
          result = JSON.stringify(JSON.parse(input), null, 2);
          break;
        case 'json-validate':
          JSON.parse(input);
          result = 'Valid JSON ✅';
          break;
        case 'xml-format':
          // Simple XML formatter using regex
          let formatted = '';
          let reg = /(>)(<)(\/*)/g;
          let xml = input.replace(reg, '$1\r\n$2$3');
          let pad = 0;
          xml.split('\r\n').forEach((node) => {
            let indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) indent = 0;
            else if (node.match(/^<\/\w/)) { if (pad !== 0) pad -= 1; }
            else if (node.match(/^<\w[^>]*[^\/]>.*$/)) indent = 1;
            else indent = 0;
            formatted += '  '.repeat(pad) + node + '\r\n';
            pad += indent;
          });
          result = formatted.trim();
          break;
        case 'base64-encode':
          result = btoa(input);
          break;
        case 'base64-decode':
          result = atob(input);
          break;
        case 'url-encode':
          result = encodeURIComponent(input);
          break;
        case 'url-decode':
          result = decodeURIComponent(input);
          break;
        case 'minify-html':
          result = input.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
          break;
        case 'minify-css':
          result = input.replace(/\s+/g, ' ').replace(/\/\*.*?\*\//g, '').replace(/:\s+/g, ':').replace(/;\s+/g, ';').trim();
          break;
        case 'minify-js':
          result = input.replace(/\s+/g, ' ').replace(/\/\/.*?\n/g, '').replace(/\/\*.*?\*\//g, '').trim();
          break;
        case 'regex-tester':
          // Handled in a separate component or logic
          result = 'Use the Regex Tester UI below';
          break;
        case 'snippet-gen':
          result = 'Select a template below';
          break;
      }
      setOutput(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during processing.');
      setOutput('');
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
        <div className="p-4">
          <div className="flex items-center justify-between lg:hidden mb-4 px-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Code Utilities
            </h3>
            <button 
              onClick={() => setIsToolSidebarOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="hidden lg:block px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Code Utilities
          </h3>
          <div className="space-y-1">
            {CODE_TOOLS.map(tool => (
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
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{activeTool.name}</h2>
              <p className="text-slate-500 text-sm">{activeTool.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setInput(''); setOutput(''); setError(null); }}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Clear All"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button 
                onClick={processCode}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Zap className="w-4 h-4" /> Run Tool
              </button>
            </div>
          </div>

          {activeToolId === 'regex-tester' ? (
            <RegexTester />
          ) : activeToolId === 'snippet-gen' ? (
            <SnippetGenerator setOutput={setOutput} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Input</label>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Paste your ${activeTool.name.split(' ')[0]} here...`}
                  className="w-full h-[500px] bg-white border border-slate-200 rounded-2xl p-6 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm resize-none"
                />
              </div>

              {/* Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Output</label>
                  {output && (
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy Result'}
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <textarea
                    readOnly
                    value={output}
                    placeholder="Result will appear here..."
                    className={cn(
                      "w-full h-[500px] bg-slate-900 border border-slate-800 rounded-2xl p-6 font-mono text-sm text-slate-300 outline-none shadow-xl resize-none",
                      error && "border-red-500/50 text-red-400"
                    )}
                  />
                  {error && (
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-red-500/10 backdrop-blur-sm border-t border-red-500/20 rounded-b-2xl text-xs text-red-400 font-medium">
                      Error: {error}
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

// --- Specialized Tool Components ---

function RegexTester() {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!regex) {
      setMatches([]);
      setError(null);
      return;
    }
    try {
      const re = new RegExp(regex, flags);
      const allMatches = Array.from(testString.matchAll(re));
      setMatches(allMatches);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setMatches([]);
    }
  }, [regex, flags, testString]);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Regular Expression</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <span className="text-slate-400 font-mono">/</span>
              <input 
                type="text" 
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                placeholder="[a-z0-9]+"
                className="flex-1 bg-transparent outline-none font-mono text-indigo-600"
              />
              <span className="text-slate-400 font-mono">/</span>
              <input 
                type="text" 
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="g"
                className="w-12 bg-transparent outline-none font-mono text-slate-600"
              />
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Test String</label>
          <textarea 
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Type text here to test your regex..."
            className="w-full h-40 bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest">Matches ({matches.length})</h4>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {matches.length === 0 ? (
            <p className="text-slate-500 text-sm italic">No matches found</p>
          ) : (
            matches.map((match, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center justify-between">
                <span className="text-indigo-400 font-mono text-sm">"{match[0]}"</span>
                <span className="text-slate-500 text-xs font-mono">Index: {match.index}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SnippetGenerator({ setOutput }: { setOutput: (val: string) => void }) {
  const SNIPPETS = [
    { name: 'React Component', lang: 'tsx', code: `import React from 'react';\n\ninterface Props {\n  title: string;\n}\n\nexport const MyComponent: React.FC<Props> = ({ title }) => {\n  return (\n    <div className="p-4 bg-white rounded-xl shadow-sm">\n      <h2 className="text-xl font-bold">{title}</h2>\n    </div>\n  );\n};` },
    { name: 'Express Server', lang: 'ts', code: `import express from 'express';\n\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.use(express.json());\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'ok' });\n});\n\napp.listen(PORT, () => {\n  console.log(\`Server running on port \${PORT}\`);\n});` },
    { name: 'Tailwind Config', lang: 'js', code: `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: [\n    "./index.html",\n    "./src/**/*.{js,ts,jsx,tsx}",\n  ],\n  theme: {\n    extend: {\n      colors: {\n        primary: '#4f46e5',\n      },\n    },\n  },\n  plugins: [],\n}` },
    { name: 'Fetch API', lang: 'js', code: `const fetchData = async (url) => {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) throw new Error('Network response was not ok');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Fetch error:', error);\n  }\n};` },
    { name: 'CSS Reset', lang: 'css', code: `* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: system-ui, -apple-system, sans-serif;\n  line-height: 1.5;\n  -webkit-font-smoothing: antialiased;\n}` },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {SNIPPETS.map((snippet) => (
        <button
          key={snippet.name}
          onClick={() => setOutput(snippet.code)}
          className="bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-indigo-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-900">{snippet.name}</h4>
            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{snippet.lang}</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Click to generate template</p>
          <div className="bg-slate-50 rounded-lg p-3 font-mono text-[10px] text-slate-400 overflow-hidden h-20 group-hover:bg-indigo-50 transition-colors">
            {snippet.code.substring(0, 100)}...
          </div>
        </button>
      ))}
    </div>
  );
}
