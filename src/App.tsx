import React from 'react';
import { BrowserRouter, Routes, Route, useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  PenTool,
  Image as ImageIcon,
  FileText as FileIcon,
  Clock as ClockIcon,
  Code as CodeIcon,
  RefreshCw,
  Calculator as CalculatorIcon,
  Sparkles,
  Palette,
  Menu,
  X,
  ChevronRight,
  Share2,
  LayoutGrid
} from 'lucide-react';
import { cn } from './lib/utils';
import TextTools from './components/TextTools';
import ImageTools from './components/ImageTools';
import DocumentTools from './components/DocumentTools';
import TimeTools from './components/TimeTools';
import CodeTools from './components/CodeTools';
import Converters from './components/Converters';
import Calculators from './components/Calculators';
import Generators from './components/Generators';
import DesignTools from './components/DesignTools';
import LandingPage from './components/LandingPage';

type MainCategory = 'text' | 'image' | 'document' | 'time' | 'code' | 'converter' | 'calculator' | 'generator' | 'design';

function ToolLayout() {
  const { category } = useParams<{ category: MainCategory }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const mainCategory = category || 'text';
  const activeToolId = searchParams.get('tool') || (mainCategory === 'text' ? 'case-converter' : '');

  const setActiveToolId = (id: string) => {
    setSearchParams({ tool: id });
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Main Sidebar (Category Switcher) */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-20 bg-slate-900 flex flex-col items-center py-6 gap-6 transition-transform duration-300 lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <Link to="/" className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shrink-0">
          <PenTool className="w-6 h-6 text-white" />
        </Link>
        
        <nav className="flex flex-col gap-4 overflow-y-auto no-scrollbar pb-6">
          {[
            { id: 'text', icon: LayoutGrid, label: 'Text Tools' },
            { id: 'image', icon: ImageIcon, label: 'Image Tools' },
            { id: 'document', icon: FileIcon, label: 'Document Tools' },
            { id: 'time', icon: ClockIcon, label: 'Time Tools' },
            { id: 'code', icon: CodeIcon, label: 'Code Tools' },
            { id: 'converter', icon: RefreshCw, label: 'Converters' },
            { id: 'calculator', icon: CalculatorIcon, label: 'Calculators' },
            { id: 'generator', icon: Sparkles, label: 'Generators' },
            { id: 'design', icon: Palette, label: 'Design Tools' },
          ].map((tool) => (
            <Link 
              key={tool.id}
              to={`/tools/${tool.id}`}
              className={cn(
                "p-3 rounded-xl transition-all group relative shrink-0",
                mainCategory === tool.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
              title={tool.label}
              onClick={() => { if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
            >
              <tool.icon className="w-6 h-6" />
              <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 hidden lg:block">{tool.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto shrink-0">
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3 lg:gap-4 overflow-hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6 text-slate-500" />
            </button>
            <div className="flex items-center gap-1.5 lg:gap-2 text-slate-500 overflow-hidden">
              <span className="text-xs lg:text-sm font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap">
                {mainCategory}
              </span>
              <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" />
              <span className="text-xs lg:text-sm font-medium truncate">
                {mainCategory} Tools
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
              <img src="https://picsum.photos/seed/user/32/32" alt="User" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Tool View */}
        <div className="flex-1 overflow-y-auto p-6">
          {mainCategory === 'text' ? (
            <TextTools activeToolId={activeToolId} setActiveToolId={setActiveToolId} />
          ) : mainCategory === 'image' ? (
            <ImageTools />
          ) : mainCategory === 'document' ? (
            <DocumentTools />
          ) : mainCategory === 'time' ? (
            <TimeTools />
          ) : mainCategory === 'code' ? (
            <CodeTools />
          ) : mainCategory === 'converter' ? (
            <Converters />
          ) : mainCategory === 'calculator' ? (
            <Calculators />
          ) : mainCategory === 'generator' ? (
            <Generators />
          ) : (
            <DesignTools />
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tools/:category" element={<ToolLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
