import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Globe, 
  Timer, 
  TimerReset as StopwatchIcon, 
  Coffee, 
  Bell, 
  ArrowLeftRight, 
  CalendarDays,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  AlignLeft,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format, differenceInDays, differenceInHours, differenceInMinutes, addMinutes, subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// --- Types ---

type TimeToolId = 
  | 'digital-clock' 
  | 'world-clock' 
  | 'countdown' 
  | 'stopwatch' 
  | 'pomodoro' 
  | 'alarm' 
  | 'tz-converter' 
  | 'date-diff';

interface TimeTool {
  id: TimeToolId;
  name: string;
  icon: React.ElementType;
  description: string;
}

const TIME_TOOLS: TimeTool[] = [
  { id: 'digital-clock', name: 'Digital Clock', icon: Clock, description: 'High-precision digital clock with date and seconds.' },
  { id: 'world-clock', name: 'World Clock', icon: Globe, description: 'Check the current time in cities around the world.' },
  { id: 'countdown', name: 'Countdown Timer', icon: Timer, description: 'Set a timer and get notified when time is up.' },
  { id: 'stopwatch', name: 'Stopwatch', icon: StopwatchIcon, description: 'Measure elapsed time with lap support.' },
  { id: 'pomodoro', name: 'Pomodoro Timer', icon: Coffee, description: 'Boost productivity with focused work intervals.' },
  { id: 'alarm', name: 'Alarm Clock', icon: Bell, description: 'Set multiple alarms with custom labels.' },
  { id: 'tz-converter', name: 'Time Zone Converter', icon: ArrowLeftRight, description: 'Convert time between different time zones.' },
  { id: 'date-diff', name: 'Date Difference', icon: CalendarDays, description: 'Calculate the duration between two dates.' },
];

const WORLD_CITIES = [
  { name: 'New York', zone: 'America/New_York' },
  { name: 'London', zone: 'Europe/London' },
  { name: 'Paris', zone: 'Europe/Paris' },
  { name: 'Tokyo', zone: 'Asia/Tokyo' },
  { name: 'Sydney', zone: 'Australia/Sydney' },
  { name: 'Dubai', zone: 'Asia/Dubai' },
  { name: 'Singapore', zone: 'Asia/Singapore' },
];

export default function TimeTools() {
  const [activeToolId, setActiveToolId] = useState<TimeToolId>('digital-clock');
  const [isToolSidebarOpen, setIsToolSidebarOpen] = useState(false);
  const activeTool = TIME_TOOLS.find(t => t.id === activeToolId) || TIME_TOOLS[0];

  // Close sidebar on mobile when a tool is selected
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
              Time Utilities
            </h3>
            <button 
              onClick={() => setIsToolSidebarOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="hidden lg:block px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Time Utilities
          </h3>
          <div className="space-y-1">
            {TIME_TOOLS.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveToolId(tool.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                  activeToolId === tool.id 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <tool.icon className={cn("w-5 h-5", activeToolId === tool.id ? "text-white" : "text-slate-400")} />
                {tool.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Workspace */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{activeTool.name}</h2>
            <p className="text-sm sm:text-base text-slate-500">{activeTool.description}</p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-8 lg:p-12 shadow-sm min-h-[350px] sm:min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
            {activeToolId === 'digital-clock' && <DigitalClockView />}
            {activeToolId === 'world-clock' && <WorldClockView />}
            {activeToolId === 'countdown' && <CountdownView />}
            {activeToolId === 'stopwatch' && <StopwatchView />}
            {activeToolId === 'pomodoro' && <PomodoroView />}
            {activeToolId === 'alarm' && <AlarmView />}
            {activeToolId === 'tz-converter' && <TimeZoneConverterView />}
            {activeToolId === 'date-diff' && <DateDifferenceView />}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Tool Views ---

function DigitalClockView() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center space-y-6">
      <div className="text-7xl lg:text-9xl font-black tracking-tighter text-slate-900 font-mono">
        {format(time, 'HH:mm:ss')}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-indigo-600">
          {format(time, 'EEEE, MMMM do')}
        </div>
        <div className="text-slate-400 font-medium uppercase tracking-widest text-sm">
          {format(time, 'yyyy')} • {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
      </div>
    </div>
  );
}

function WorldClockView() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {WORLD_CITIES.map(city => (
        <div key={city.name} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between hover:border-indigo-200 transition-colors">
          <div>
            <h4 className="text-lg font-bold text-slate-900">{city.name}</h4>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{city.zone.split('/')[1].replace('_', ' ')}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-indigo-600">
              {formatInTimeZone(time, city.zone, 'HH:mm:ss')}
            </div>
            <div className="text-xs text-slate-400">
              {formatInTimeZone(time, city.zone, 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CountdownView() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(5);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      // Visual alert
      document.body.classList.add('bg-red-50');
      setTimeout(() => document.body.classList.remove('bg-red-50'), 2000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const startTimer = () => {
    if (seconds === 0) setSeconds(inputMinutes * 60);
    setIsActive(true);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center space-y-8 w-full max-w-md">
      <div className="text-8xl font-mono font-black text-slate-900">
        {formatTime(seconds || inputMinutes * 60)}
      </div>

      {!isActive && seconds === 0 && (
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setInputMinutes(m => Math.max(1, m - 1))} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">-</button>
          <div className="text-xl font-bold w-20">{inputMinutes} min</div>
          <button onClick={() => setInputMinutes(m => m + 1)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">+</button>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!isActive ? (
          <button onClick={startTimer} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
            <Play className="w-5 h-5" /> Start
          </button>
        ) : (
          <button onClick={() => setIsActive(false)} className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
            <Pause className="w-5 h-5" /> Pause
          </button>
        )}
        <button onClick={() => { setIsActive(false); setSeconds(0); }} className="flex items-center gap-2 px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">
          <RotateCcw className="w-5 h-5" /> Reset
        </button>
      </div>
    </div>
  );
}

function StopwatchView() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(t => t + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const msec = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${msec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center space-y-8 w-full max-w-md">
      <div className="text-8xl font-mono font-black text-slate-900">
        {formatTime(time)}
      </div>

      <div className="flex justify-center gap-4">
        {!isActive ? (
          <button onClick={() => setIsActive(true)} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
            <Play className="w-5 h-5" /> Start
          </button>
        ) : (
          <button onClick={() => setIsActive(false)} className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
            <Pause className="w-5 h-5" /> Stop
          </button>
        )}
        <button onClick={() => setLaps([time, ...laps])} disabled={!isActive} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 disabled:opacity-50">
          Lap
        </button>
        <button onClick={() => { setIsActive(false); setTime(0); setLaps([]); }} className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {laps.length > 0 && (
        <div className="mt-8 space-y-2 max-h-48 overflow-y-auto pr-2">
          {laps.map((lap, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase">Lap {laps.length - i}</span>
              <span className="font-mono font-bold text-slate-700">{formatTime(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PomodoroView() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      setTimeLeft(nextMode === 'work' ? 25 * 60 : 5 * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center space-y-8 w-full max-w-md">
      <div className="flex justify-center gap-2">
        <button 
          onClick={() => { setMode('work'); setTimeLeft(25 * 60); setIsActive(false); }}
          className={cn("px-4 py-2 rounded-full text-sm font-bold transition-all", mode === 'work' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500")}
        >
          Work (25m)
        </button>
        <button 
          onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}
          className={cn("px-4 py-2 rounded-full text-sm font-bold transition-all", mode === 'break' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500")}
        >
          Break (5m)
        </button>
      </div>

      <div className={cn("text-9xl font-mono font-black transition-colors", mode === 'work' ? "text-slate-900" : "text-emerald-600")}>
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={() => setIsActive(!isActive)} className="flex items-center gap-2 px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl">
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button onClick={() => { setIsActive(false); setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60); }} className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200">
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function AlarmView() {
  const [alarms, setAlarms] = useState<{ id: string, time: string, label: string, enabled: boolean }[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState('08:00');
  const [newAlarmLabel, setNewAlarmLabel] = useState('Wake Up');

  const addAlarm = () => {
    setAlarms([...alarms, { id: Date.now().toString(), time: newAlarmTime, label: newAlarmLabel, enabled: true }]);
    setNewAlarmLabel('');
  };

  const deleteAlarm = (id: string) => setAlarms(alarms.filter(a => a.id !== id));
  const toggleAlarm = (id: string) => setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));

  return (
    <div className="w-full max-w-lg space-y-8">
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Set New Alarm</h4>
        <div className="flex gap-3">
          <input 
            type="time" 
            value={newAlarmTime} 
            onChange={e => setNewAlarmTime(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input 
            type="text" 
            placeholder="Label (e.g. Gym)" 
            value={newAlarmLabel}
            onChange={e => setNewAlarmLabel(e.target.value)}
            className="flex-[2] bg-white border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button onClick={addAlarm} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {alarms.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No alarms set</p>
          </div>
        ) : (
          alarms.map(alarm => (
            <div key={alarm.id} className={cn("flex items-center justify-between p-6 rounded-2xl border transition-all", alarm.enabled ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50 border-transparent opacity-60")}>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-mono font-bold text-slate-900">{alarm.time}</div>
                <div>
                  <div className="font-bold text-slate-700">{alarm.label || 'Alarm'}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest">Daily</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleAlarm(alarm.id)}
                  className={cn("w-12 h-6 rounded-full transition-all relative", alarm.enabled ? "bg-indigo-600" : "bg-slate-300")}
                >
                  <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 transition-all", alarm.enabled ? "right-1" : "left-1")} />
                </button>
                <button onClick={() => deleteAlarm(alarm.id)} className="p-2 text-slate-300 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TimeZoneConverterView() {
  const [sourceTime, setSourceTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [sourceZone, setSourceZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [targetZone, setTargetZone] = useState('UTC');

  const convertedTime = formatInTimeZone(new Date(sourceTime), targetZone, "yyyy-MM-dd HH:mm:ss");

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source Time & Zone</label>
          <input 
            type="datetime-local" 
            value={sourceTime}
            onChange={e => setSourceTime(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
          />
          <select 
            value={sourceZone}
            onChange={e => setSourceZone(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>Local Time ({Intl.DateTimeFormat().resolvedOptions().timeZone})</option>
            {WORLD_CITIES.map(c => <option key={c.zone} value={c.zone}>{c.name} ({c.zone})</option>)}
            <option value="UTC">UTC</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Zone</label>
          <select 
            value={targetZone}
            onChange={e => setTargetZone(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="UTC">UTC</option>
            {WORLD_CITIES.map(c => <option key={c.zone} value={c.zone}>{c.name} ({c.zone})</option>)}
            <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
            <option value="Asia/Hong_Kong">Hong Kong</option>
          </select>

          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
            <div className="text-xs font-bold opacity-60 uppercase tracking-widest mb-2">Converted Time</div>
            <div className="text-2xl font-mono font-bold">{convertedTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateDifferenceView() {
  const [date1, setDate1] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [date2, setDate2] = useState(format(new Date(), 'yyyy-MM-dd'));

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const days = Math.abs(differenceInDays(d2, d1));
  const hours = Math.abs(differenceInHours(d2, d1));
  const minutes = Math.abs(differenceInMinutes(d2, d1));

  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Start Date</label>
          <input 
            type="date" 
            value={date1}
            onChange={e => setDate1(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">End Date</label>
          <input 
            type="date" 
            value={date2}
            onChange={e => setDate2(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
          <div className="text-3xl font-black text-indigo-600">{days}</div>
          <div className="text-xs font-bold text-slate-400 uppercase">Days</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
          <div className="text-3xl font-black text-indigo-600">{hours}</div>
          <div className="text-xs font-bold text-slate-400 uppercase">Hours</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm">
          <div className="text-3xl font-black text-indigo-600">{minutes}</div>
          <div className="text-xs font-bold text-slate-400 uppercase">Minutes</div>
        </div>
      </div>
    </div>
  );
}
