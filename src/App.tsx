import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Cpu, Layout, Activity, ListMusic, Gamepad2 } from 'lucide-react';
import { DUMMY_SONGS } from './constants';

export default function App() {
  const [gameState, setGameState] = useState({
    score: 0,
    highScore: 1240,
    length: 3,
    status: 'IDLE' as 'IDLE' | 'PLAYING' | 'GAME_OVER'
  });

  const [currentSongIdx, setCurrentSongIdx] = useState(0);

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0c] text-slate-300 overflow-hidden font-sans border-4 border-[#1a1a20]">
      {/* Header */}
      <header className="h-16 border-b border-cyan-500/20 bg-black/40 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm rotate-45 animate-pulse"></div>
          </div>
          <span className="text-xl font-bold tracking-tighter text-white uppercase">
            Synth<span className="text-cyan-400">Snake</span> v2.0
          </span>
        </div>

        <div className="flex items-center gap-8 font-mono text-sm">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-cyan-400/60 uppercase font-bold tracking-widest">High Score</span>
            <span className="text-white text-lg leading-none font-black tracking-tight">{gameState.highScore.toLocaleString().padStart(6, '0')}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-pink-400/60 uppercase font-bold tracking-widest">Current Score</span>
            <span className="text-pink-400 text-lg leading-none font-black tracking-tight">{gameState.score.toLocaleString().padStart(6, '0')}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Queue */}
        <aside className="w-72 border-r border-white/5 bg-black/20 p-6 flex flex-col gap-6 shrink-0">
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black flex items-center gap-2">
              <ListMusic className="w-3 h-3" /> Queue
            </h3>
            <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {DUMMY_SONGS.map((song, idx) => (
                <div 
                  key={song.id}
                  onClick={() => setCurrentSongIdx(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    currentSongIdx === idx 
                    ? "bg-cyan-500/10 border-cyan-500/30" 
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    <div className={`w-10 h-10 rounded flex-shrink-0 flex items-center justify-center ${
                      currentSongIdx === idx ? "bg-cyan-900/50" : "bg-slate-800"
                    }`}>
                      {currentSongIdx === idx ? (
                        <div className="w-2 h-4 bg-cyan-400 rounded-full animate-bounce" />
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-slate-500">{(idx + 1).toString().padStart(2, '0')}</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className={`text-xs font-bold truncate ${currentSongIdx === idx ? "text-white" : "text-slate-400"}`}>
                        {song.title}
                      </div>
                      <div className={`text-[10px] italic truncate ${currentSongIdx === idx ? "text-cyan-400/70" : "text-slate-600"}`}>
                        {song.artist}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-center">
            <div className="text-[10px] text-pink-400 uppercase tracking-widest font-black mb-1">Game Mode</div>
            <div className="text-lg font-black text-white italic tracking-tighter">NIGHTMARE</div>
            <div className="text-[10px] text-slate-500 mt-2 italic font-mono uppercase tracking-tighter">Speed multiplier: 1.5x</div>
          </div>
        </aside>

        {/* Center: Game Area */}
        <section className="flex-1 bg-carbon relative flex items-center justify-center p-8 overflow-hidden">
          <div className="absolute inset-0 bg-radial-glow" />
          <div className="absolute inset-0 grid-overlay opacity-20" />
          
          <div className="relative z-10 w-full flex justify-center">
             <SnakeGame onStatsUpdate={(stats) => setGameState(prev => ({...prev, ...stats}))} />
          </div>
        </section>

        {/* Right Side: Stats */}
        <aside className="w-64 border-l border-white/5 bg-black/20 p-6 flex flex-col gap-8 shrink-0">
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black flex items-center gap-2">
              <Activity className="w-3 h-3" /> Game Stats
            </h3>
            <div className="grid grid-cols-1 gap-3 font-mono">
              <div className="p-4 bg-white/5 rounded-lg border border-white/5 flex flex-col gap-1">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Snake Length</div>
                <div className="text-2xl text-white font-black tracking-tighter">{gameState.length} <span className="text-[10px] text-slate-500 uppercase ml-1">Units</span></div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/5 flex flex-col gap-1">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Apples Eaten</div>
                <div className="text-2xl text-white font-black tracking-tighter">{Math.floor(gameState.score / 10)}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/5 flex flex-col gap-1">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Precision</div>
                <div className="text-2xl text-white font-black tracking-tighter">94.2<span className="text-[10px] text-slate-500 ml-1">%</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-4">
             <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black flex items-center gap-2">
              <Gamepad2 className="w-3 h-3" /> Controls
            </h3>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
               <div className="px-3 py-2 bg-white/5 rounded border border-white/5 flex justify-between items-center">
                  <span className="text-slate-500">MOVE</span>
                  <span className="text-cyan-400">ARROWS</span>
               </div>
               <div className="px-3 py-2 bg-white/5 rounded border border-white/5 flex justify-between items-center">
                  <span className="text-slate-500">PAUSE</span>
                  <span className="text-cyan-400">SPACE</span>
               </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer: Music Player */}
      <footer className="h-24 bg-black border-t border-white/10 shrink-0">
        <MusicPlayer 
          songIdx={currentSongIdx} 
          onNext={() => setCurrentSongIdx(prev => (prev + 1) % DUMMY_SONGS.length)}
          onPrev={() => setCurrentSongIdx(prev => (prev - 1 + DUMMY_SONGS.length) % DUMMY_SONGS.length)}
        />
      </footer>
    </div>
  );
}
