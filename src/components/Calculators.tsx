import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Percent, 
  User, 
  CreditCard, 
  Home, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  HandCoins, 
  Calendar, 
  CalendarDays, 
  Fuel,
  ChevronRight,
  RotateCcw,
  Equal,
  AlignLeft,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format, differenceInYears, differenceInMonths, differenceInDays, addDays, subDays } from 'date-fns';

// --- Types ---

type CalculatorId = 
  | 'basic' 
  | 'percentage' 
  | 'bmi' 
  | 'loan' 
  | 'mortgage' 
  | 'compound' 
  | 'roi' 
  | 'profit' 
  | 'tip' 
  | 'age' 
  | 'date' 
  | 'fuel'
  | 'loan-payoff';

interface CalculatorTool {
  id: CalculatorId;
  name: string;
  icon: React.ElementType;
  description: string;
}

const CALCULATOR_TOOLS: CalculatorTool[] = [
  { id: 'basic', name: 'Basic Calculator', icon: Calculator, description: 'Standard arithmetic calculator for quick math.' },
  { id: 'percentage', name: 'Percentage', icon: Percent, description: 'Calculate percentages, increases, and decreases.' },
  { id: 'bmi', name: 'BMI Calculator', icon: User, description: 'Calculate Body Mass Index and health category.' },
  { id: 'loan', name: 'Loan Calculator', icon: CreditCard, description: 'Estimate monthly payments and total interest.' },
  { id: 'mortgage', name: 'Mortgage', icon: Home, description: 'Calculate mortgage payments and amortization.' },
  { id: 'compound', name: 'Compound Interest', icon: TrendingUp, description: 'Calculate investment growth over time.' },
  { id: 'roi', name: 'ROI Calculator', icon: DollarSign, description: 'Calculate Return on Investment for projects.' },
  { id: 'profit', name: 'Profit Margin', icon: PieChart, description: 'Calculate gross profit margin and markup.' },
  { id: 'tip', name: 'Tip Calculator', icon: HandCoins, description: 'Calculate tips and split bills with friends.' },
  { id: 'age', name: 'Age Calculator', icon: Calendar, description: 'Calculate exact age in years, months, and days.' },
  { id: 'date', name: 'Date Calculator', icon: CalendarDays, description: 'Add or subtract days from a specific date.' },
  { id: 'fuel', name: 'Fuel Cost', icon: Fuel, description: 'Estimate trip fuel costs and consumption.' },
  { id: 'loan-payoff', name: 'Loan Payoff', icon: HandCoins, description: 'Calculate how extra payments affect your loan payoff.' },
];

export default function Calculators() {
  const [activeToolId, setActiveToolId] = useState<CalculatorId>('basic');
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(false);
  const activeTool = CALCULATOR_TOOLS.find(t => t.id === activeToolId) || CALCULATOR_TOOLS[0];

  useEffect(() => {
    if (window.innerWidth < 1024) setIsToolSidebarOpen(false);
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

      {/* Tool Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 overflow-y-auto transition-transform duration-300 lg:relative lg:translate-x-0",
        !isToolSidebarOpen && "-translate-x-full"
      )}>
        <div className="p-4">
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h3 className="text-sm font-bold text-slate-900">Calculators</h3>
            <button onClick={() => setIsToolSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Financial & Math
          </h3>
          <div className="space-y-1">
            {CALCULATOR_TOOLS.map(tool => (
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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{activeTool.name}</h2>
            <p className="text-sm sm:text-base text-slate-500">{activeTool.description}</p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-8 lg:p-12 shadow-sm min-h-[400px] sm:min-h-[500px] flex flex-col items-center justify-center">
            {activeToolId === 'basic' && <BasicCalculatorView />}
            {activeToolId === 'percentage' && <PercentageCalculatorView />}
            {activeToolId === 'bmi' && <BMICalculatorView />}
            {activeToolId === 'loan' && <LoanCalculatorView />}
            {activeToolId === 'mortgage' && <MortgageCalculatorView />}
            {activeToolId === 'compound' && <CompoundInterestView />}
            {activeToolId === 'roi' && <ROICalculatorView />}
            {activeToolId === 'profit' && <ProfitMarginView />}
            {activeToolId === 'tip' && <TipCalculatorView />}
            {activeToolId === 'age' && <AgeCalculatorView />}
            {activeToolId === 'date' && <DateCalculatorView />}
            {activeToolId === 'fuel' && <FuelCostView />}
            {activeToolId === 'loan-payoff' && <LoanPayoffCalculatorView />}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Calculator Views ---

function BasicCalculatorView() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      // Simple eval for basic math (safe for this controlled input)
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="w-full max-w-xs bg-slate-900 rounded-3xl p-6 shadow-2xl">
      <div className="text-right mb-6 px-2">
        <div className="text-slate-500 text-sm h-6 font-mono">{equation}</div>
        <div className="text-white text-5xl font-mono font-bold truncate">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <button onClick={clear} className="col-span-2 p-4 bg-slate-800 text-red-400 rounded-2xl font-bold hover:bg-slate-700">AC</button>
        <button onClick={() => handleOperator('/')} className="p-4 bg-slate-800 text-indigo-400 rounded-2xl font-bold hover:bg-slate-700">/</button>
        <button onClick={() => handleOperator('*')} className="p-4 bg-slate-800 text-indigo-400 rounded-2xl font-bold hover:bg-slate-700">×</button>
        
        {[7, 8, 9].map(n => <button key={n} onClick={() => handleNumber(String(n))} className="p-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700">{n}</button>)}
        <button onClick={() => handleOperator('-')} className="p-4 bg-slate-800 text-indigo-400 rounded-2xl font-bold hover:bg-slate-700">-</button>
        
        {[4, 5, 6].map(n => <button key={n} onClick={() => handleNumber(String(n))} className="p-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700">{n}</button>)}
        <button onClick={() => handleOperator('+')} className="p-4 bg-slate-800 text-indigo-400 rounded-2xl font-bold hover:bg-slate-700">+</button>
        
        {[1, 2, 3].map(n => <button key={n} onClick={() => handleNumber(String(n))} className="p-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700">{n}</button>)}
        <button onClick={calculate} className="row-span-2 p-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 flex items-center justify-center"><Equal className="w-6 h-6" /></button>
        
        <button onClick={() => handleNumber('0')} className="col-span-2 p-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700">0</button>
        <button onClick={() => handleNumber('.')} className="p-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700">.</button>
      </div>
    </div>
  );
}

function PercentageCalculatorView() {
  const [val1, setVal1] = useState('10');
  const [val2, setVal2] = useState('100');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    if (!isNaN(v1) && !isNaN(v2)) {
      setResult((v1 / 100) * v2);
    }
  }, [val1, val2]);

  return (
    <div className="w-full max-w-md space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:flex-1 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">What is</label>
          <div className="relative">
            <input type="number" value={val1} onChange={e => setVal1(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-xl pr-12" />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
          </div>
        </div>
        <div className="hidden sm:block pt-8 text-slate-400 font-bold">of</div>
        <div className="w-full sm:flex-1 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Value</label>
          <input type="number" value={val2} onChange={e => setVal2(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-xl" />
        </div>
      </div>
      <div className="bg-indigo-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white text-center shadow-xl shadow-indigo-100">
        <div className="text-xs font-bold opacity-60 uppercase tracking-widest mb-2">Result</div>
        <div className="text-4xl sm:text-5xl font-black">{result?.toFixed(2)}</div>
      </div>
    </div>
  );
}

function BMICalculatorView() {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      setBmi(w / (h * h));
    }
  }, [weight, height]);

  const getCategory = (b: number) => {
    if (b < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (b < 25) return { label: 'Normal', color: 'text-emerald-500' };
    if (b < 30) return { label: 'Overweight', color: 'text-orange-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weight (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-xl" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Height (cm)</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-xl" />
        </div>
      </div>
      {bmi && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your BMI</div>
          <div className="text-6xl font-black text-slate-900">{bmi.toFixed(1)}</div>
          <div className={cn("text-xl font-bold", getCategory(bmi).color)}>
            {getCategory(bmi).label}
          </div>
        </div>
      )}
    </div>
  );
}

function LoanCalculatorView() {
  const [amount, setAmount] = useState('10000');
  const [rate, setRate] = useState('5');
  const [term, setTerm] = useState('24');
  const [monthly, setMonthly] = useState<number | null>(null);

  useEffect(() => {
    const p = parseFloat(amount);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(term);
    if (p > 0 && r > 0 && n > 0) {
      const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setMonthly(m);
    }
  }, [amount, rate, term]);

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loan Amount ($)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interest Rate (%)</label>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Term (Months)</label>
            <input type="number" value={term} onChange={e => setTerm(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
        </div>
      </div>
      {monthly && (
        <div className="bg-indigo-600 rounded-3xl p-8 text-white text-center shadow-xl shadow-indigo-100">
          <div className="text-xs font-bold opacity-60 uppercase tracking-widest mb-2">Monthly Payment</div>
          <div className="text-5xl font-black">${monthly.toFixed(2)}</div>
          <div className="mt-4 text-xs opacity-60">Total Interest: ${((monthly * parseFloat(term)) - parseFloat(amount)).toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}

function MortgageCalculatorView() {
  const [price, setPrice] = useState('300000');
  const [down, setDown] = useState('60000');
  const [rate, setRate] = useState('6.5');
  const [term, setTerm] = useState('30');
  const [monthly, setMonthly] = useState<number | null>(null);

  useEffect(() => {
    const p = parseFloat(price) - parseFloat(down);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(term) * 12;
    if (p > 0 && r > 0 && n > 0) {
      const m = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setMonthly(m);
    }
  }, [price, down, rate, term]);

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Home Price ($)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Down Payment ($)</label>
          <input type="number" value={down} onChange={e => setDown(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rate (%)</label>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Term (Years)</label>
          <input type="number" value={term} onChange={e => setTerm(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
      </div>
      {monthly && (
        <div className="bg-slate-900 rounded-3xl p-8 text-white text-center shadow-2xl">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Estimated Monthly</div>
          <div className="text-5xl font-black text-indigo-400">${monthly.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}

function CompoundInterestView() {
  const [principal, setPrincipal] = useState('1000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('10');
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    if (p > 0 && r > 0 && t > 0) {
      const a = p * Math.pow(1 + r, t);
      setTotal(a);
    }
  }, [principal, rate, years]);

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Initial Investment ($)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annual Rate (%)</label>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Years</label>
            <input type="number" value={years} onChange={e => setYears(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
        </div>
      </div>
      {total && (
        <div className="bg-emerald-600 rounded-3xl p-8 text-white text-center shadow-xl shadow-emerald-100">
          <div className="text-xs font-bold opacity-60 uppercase tracking-widest mb-2">Future Value</div>
          <div className="text-5xl font-black">${total.toFixed(2)}</div>
          <div className="mt-4 text-xs opacity-60">Interest Earned: ${(total - parseFloat(principal)).toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}

function ROICalculatorView() {
  const [invested, setInvested] = useState('1000');
  const [returned, setReturned] = useState('1500');
  const [roi, setRoi] = useState<number | null>(null);

  useEffect(() => {
    const i = parseFloat(invested);
    const r = parseFloat(returned);
    if (i > 0) {
      setRoi(((r - i) / i) * 100);
    }
  }, [invested, returned]);

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount Invested ($)</label>
          <input type="number" value={invested} onChange={e => setInvested(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount Returned ($)</label>
          <input type="number" value={returned} onChange={e => setReturned(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
      </div>
      {roi !== null && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Return on Investment</div>
          <div className={cn("text-7xl font-black", roi >= 0 ? "text-emerald-600" : "text-red-500")}>
            {roi.toFixed(1)}%
          </div>
          <div className="text-sm font-bold text-slate-500">
            Profit: ${(parseFloat(returned) - parseFloat(invested)).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfitMarginView() {
  const [cost, setCost] = useState('50');
  const [revenue, setRevenue] = useState('100');
  const [margin, setMargin] = useState<number | null>(null);

  useEffect(() => {
    const c = parseFloat(cost);
    const r = parseFloat(revenue);
    if (r > 0) {
      setMargin(((r - c) / r) * 100);
    }
  }, [cost, revenue]);

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cost Price ($)</label>
          <input type="number" value={cost} onChange={e => setCost(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selling Price ($)</label>
          <input type="number" value={revenue} onChange={e => setRevenue(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
      </div>
      {margin !== null && (
        <div className="bg-slate-900 rounded-3xl p-8 text-center shadow-2xl space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gross Profit Margin</div>
          <div className="text-7xl font-black text-indigo-400">{margin.toFixed(1)}%</div>
          <div className="text-sm font-bold text-slate-400">Markup: {(((parseFloat(revenue) - parseFloat(cost)) / parseFloat(cost)) * 100).toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
}

function TipCalculatorView() {
  const [bill, setBill] = useState('50');
  const [tipPercent, setTipPercent] = useState('15');
  const [people, setPeople] = useState('1');
  const [result, setResult] = useState<{ tip: number, total: number, perPerson: number } | null>(null);

  useEffect(() => {
    const b = parseFloat(bill);
    const t = parseFloat(tipPercent) / 100;
    const p = parseInt(people);
    if (b > 0 && p > 0) {
      const tip = b * t;
      const total = b + tip;
      setResult({ tip, total, perPerson: total / p });
    }
  }, [bill, tipPercent, people]);

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bill Amount ($)</label>
          <input type="number" value={bill} onChange={e => setBill(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tip (%)</label>
            <input type="number" value={tipPercent} onChange={e => setTipPercent(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">People</label>
            <input type="number" value={people} onChange={e => setPeople(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
        </div>
      </div>
      {result && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-400 uppercase">Tip Amount</span>
            <span className="text-xl font-bold text-slate-900">${result.tip.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-400 uppercase">Total Bill</span>
            <span className="text-xl font-bold text-slate-900">${result.total.toFixed(2)}</span>
          </div>
          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-bold text-indigo-600 uppercase">Per Person</span>
            <span className="text-4xl font-black text-indigo-600">${result.perPerson.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function AgeCalculatorView() {
  const [birthDate, setBirthDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [age, setAge] = useState<{ years: number, months: number, days: number } | null>(null);

  useEffect(() => {
    const birth = new Date(birthDate);
    const now = new Date();
    if (birth <= now) {
      setAge({
        years: differenceInYears(now, birth),
        months: differenceInMonths(now, birth) % 12,
        days: differenceInDays(now, birth) % 30, // Rough approximation for days
      });
    }
  }, [birthDate]);

  return (
    <div className="w-full max-w-md space-y-8 text-center">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Birth Date</label>
        <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-xl" />
      </div>
      {age && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
            <div className="text-4xl font-black">{age.years}</div>
            <div className="text-xs font-bold opacity-60 uppercase">Years</div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="text-4xl font-black text-slate-900">{age.months}</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Months</div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="text-4xl font-black text-slate-900">{age.days}</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Days</div>
          </div>
        </div>
      )}
    </div>
  );
}

function DateCalculatorView() {
  const [baseDate, setBaseDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [days, setDays] = useState('7');
  const [operation, setOperation] = useState<'add' | 'sub'>('add');
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const date = new Date(baseDate);
    const d = parseInt(days);
    if (!isNaN(d)) {
      const newDate = operation === 'add' ? addDays(date, d) : subDays(date, d);
      setResult(format(newDate, 'EEEE, MMMM do, yyyy'));
    }
  }, [baseDate, days, operation]);

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Start Date</label>
          <input type="date" value={baseDate} onChange={e => setBaseDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Days</label>
            <input type="number" value={days} onChange={e => setDays(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operation</label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setOperation('add')} className={cn("flex-1 py-3 rounded-lg text-sm font-bold transition-all", operation === 'add' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500")}>Add</button>
              <button onClick={() => setOperation('sub')} className={cn("flex-1 py-3 rounded-lg text-sm font-bold transition-all", operation === 'sub' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500")}>Subtract</button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 rounded-3xl p-8 text-center shadow-2xl">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Resulting Date</div>
        <div className="text-2xl font-bold text-white">{result}</div>
      </div>
    </div>
  );
}

function FuelCostView() {
  const [distance, setDistance] = useState('100');
  const [efficiency, setEfficiency] = useState('8');
  const [price, setPrice] = useState('1.5');
  const [cost, setCost] = useState<number | null>(null);

  useEffect(() => {
    const d = parseFloat(distance);
    const e = parseFloat(efficiency);
    const p = parseFloat(price);
    if (d > 0 && e > 0 && p > 0) {
      setCost((d / 100) * e * p);
    }
  }, [distance, efficiency, price]);

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Distance (km)</label>
          <input type="number" value={distance} onChange={e => setDistance(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fuel Consumption (L/100km)</label>
            <input type="number" value={efficiency} onChange={e => setEfficiency(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fuel Price (per L)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
        </div>
      </div>
      {cost && (
        <div className="bg-indigo-600 rounded-3xl p-8 text-white text-center shadow-xl shadow-indigo-100">
          <div className="text-xs font-bold opacity-60 uppercase tracking-widest mb-2">Estimated Trip Cost</div>
          <div className="text-5xl font-black">${cost.toFixed(2)}</div>
          <div className="mt-4 text-xs opacity-60">Total Fuel: {((parseFloat(distance) / 100) * parseFloat(efficiency)).toFixed(1)} Liters</div>
        </div>
      )}
    </div>
  );
}

function LoanPayoffCalculatorView() {
  const [balance, setBalance] = useState('10000');
  const [rate, setRate] = useState('5');
  const [monthlyPayment, setMonthlyPayment] = useState('500');
  const [extraPayment, setExtraPayment] = useState('100');
  const [result, setResult] = useState<{
    originalMonths: number;
    newMonths: number;
    monthsSaved: number;
    originalInterest: number;
    newInterest: number;
    interestSaved: number;
  } | null>(null);

  useEffect(() => {
    const b = parseFloat(balance);
    const r = parseFloat(rate) / 100 / 12;
    const m = parseFloat(monthlyPayment);
    const e = parseFloat(extraPayment);

    if (b > 0 && r >= 0 && m > 0) {
      // Original payoff simulation
      let originalBalance = b;
      let originalMonths = 0;
      let originalInterest = 0;
      
      // Safety break to prevent infinite loop if payment doesn't cover interest
      if (m <= b * r) {
        setResult(null);
        return;
      }

      while (originalBalance > 0 && originalMonths < 600) { // Max 50 years
        const interest = originalBalance * r;
        originalInterest += interest;
        originalBalance = originalBalance + interest - m;
        originalMonths++;
      }

      // New payoff simulation
      let newBalance = b;
      let newMonths = 0;
      let newInterest = 0;
      const totalPayment = m + e;

      while (newBalance > 0 && newMonths < 600) {
        const interest = newBalance * r;
        newInterest += interest;
        newBalance = newBalance + interest - totalPayment;
        newMonths++;
      }

      setResult({
        originalMonths,
        newMonths,
        monthsSaved: originalMonths - newMonths,
        originalInterest,
        newInterest,
        interestSaved: originalInterest - newInterest
      });
    }
  }, [balance, rate, monthlyPayment, extraPayment]);

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Balance ($)</label>
          <input type="number" value={balance} onChange={e => setBalance(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interest Rate (%)</label>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Payment ($)</label>
            <input type="number" value={monthlyPayment} onChange={e => setMonthlyPayment(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Extra Monthly Payment ($)</label>
          <input type="number" value={extraPayment} onChange={e => setExtraPayment(e.target.value)} className="w-full bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700" />
        </div>
      </div>

      {result ? (
        <div className="space-y-4">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white text-center shadow-xl shadow-indigo-100">
            <div className="text-xs font-bold opacity-60 uppercase tracking-widest mb-2">Interest Saved</div>
            <div className="text-5xl font-black">${result.interestSaved.toFixed(2)}</div>
            <div className="mt-4 text-xs opacity-60">Total Interest Paid: ${result.newInterest.toFixed(2)}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="text-3xl font-black text-slate-900">{result.monthsSaved}</div>
              <div className="text-xs font-bold text-slate-400 uppercase">Months Saved</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="text-3xl font-black text-slate-900">{result.newMonths}</div>
              <div className="text-xs font-bold text-slate-400 uppercase">Months Left</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <p className="text-sm font-bold text-red-600">Payment must be greater than monthly interest.</p>
        </div>
      )}
    </div>
  );
}
