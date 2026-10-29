import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Type, 
  Sparkles, 
  Volume2, 
  Sliders, 
  ChevronDown, 
  LayoutGrid, 
  Image as ImageIcon, 
  FileText, 
  Clock, 
  Code, 
  RefreshCw, 
  Calculator, 
  Palette,
  ArrowRight
} from 'lucide-react';

const tools = [
  { id: 'text', name: 'Text Tools', icon: LayoutGrid, desc: 'Format, manipulate and transform text' },
  { id: 'image', name: 'Image Tools', icon: ImageIcon, desc: 'Crop, resize, filter and edit images' },
  { id: 'document', name: 'Document Tools', icon: FileText, desc: 'Convert and manage PDF and document files' },
  { id: 'time', name: 'Time Tools', icon: Clock, desc: 'World clock, stopwatch, timer and date calculators' },
  { id: 'code', name: 'Code Tools', icon: Code, desc: 'Format, minify, validate and beautify code' },
  { id: 'converter', name: 'Converters', icon: RefreshCw, desc: 'Unit, color, currency and format conversion' },
  { id: 'calculator', name: 'Calculators', icon: Calculator, desc: 'Financial, math and utility calculators' },
  { id: 'generator', name: 'Generators', icon: Sparkles, desc: 'QR codes, barcodes, UUIDs and hashes' },
  { id: 'design', name: 'Design Tools', icon: Palette, desc: 'Palettes, contrast checkers and CSS tools' },
];

const categoryButtons = [
  {
    name: 'Basic Tools',
    link: '/tools/text?tool=case-converter',
    icon: Type,
    badge: 'Essential',
  },
  {
    name: 'Advanced Tools',
    link: '/tools/text?tool=slug-generator',
    icon: Sliders,
    badge: 'Pro',
  },
  {
    name: 'Audio Tools',
    link: '/tools/text?tool=text-to-speech',
    icon: Volume2,
    badge: 'Speech & Voice',
  },
  {
    name: 'Ai Tools',
    link: '/tools/text?tool=summarizer',
    icon: Sparkles,
    badge: 'Smart AI',
  },
];

export default function LandingPage() {
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
        <Link to="/" className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            UTS
          </span>
          Ultimate Tool Suite
        </Link>

        {/* Choose A Tool Navigation */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => setIsToolsMenuOpen(prev => !prev)}
            aria-expanded={isToolsMenuOpen}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all text-sm font-medium shadow-sm hover:shadow"
          >
            <span>Choose A Tool</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Tools Navigation Dropdown */}
          {isToolsMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsToolsMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 max-h-[85vh] overflow-y-auto">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    All Tool Suites
                  </span>
                  <span className="text-xs text-indigo-600 font-medium">9 Categories</span>
                </div>
                
                <div className="p-2 space-y-1">
                  {tools.map(tool => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.id}
                        to={`/tools/${tool.id}`}
                        onClick={() => setIsToolsMenuOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 text-slate-600 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 flex items-center justify-between">
                            {tool.name}
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-indigo-600 transition-all transform group-hover:translate-x-0.5" />
                          </div>
                          <div className="text-xs text-slate-500 truncate">{tool.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 px-3">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
                    Quick Access
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pb-1">
                    {categoryButtons.map(cat => (
                      <Link
                        key={cat.name}
                        to={cat.link}
                        onClick={() => setIsToolsMenuOpen(false)}
                        className="text-xs font-medium text-slate-700 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 p-2 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <cat.icon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 pb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 tracking-tight max-w-4xl">
          All Your Tools. One Powerful Suite.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Streamline your workflow with our all-in-one tool suite designed for creators, businesses, and innovators.
        </p>

        {/* 4 Category Tool Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-3xl mx-auto">
          {categoryButtons.map(btn => {
            const Icon = btn.icon;
            return (
              <Link
                key={btn.name}
                to={btn.link}
                className="group relative bg-slate-900 text-white p-5 rounded-2xl hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 flex flex-col items-center justify-center text-center border border-slate-800"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-indigo-400 group-hover:text-white flex items-center justify-center mb-3 transition-colors shadow-inner">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-white text-base group-hover:text-indigo-200 transition-colors">
                  {btn.name}
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  {btn.badge}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-slate-100/60">
        <h2 className="text-3xl font-semibold text-center mb-12 text-slate-900">Everything You Need</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <div key={tool.id} className="bg-slate-900 text-white p-8 rounded-2xl shadow-sm text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{tool.name}</h3>
                <p className="text-slate-300 mb-6 text-sm flex-1">{tool.desc}.</p>
                <Link to={`/tools/${tool.id}`} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-colors w-full sm:w-auto font-medium">
                  Use Tool
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white py-20 text-center px-6">
        <h2 className="text-3xl font-semibold mb-6">Start Using the Ultimate Tool Suite Today</h2>
        <Link to="/tools/text" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-indigo-700 transition-colors font-medium inline-block">
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 border-t border-slate-200">
        © 2026 Ultimate Tool Suite. All rights reserved.
      </footer>
    </div>
  );
}
