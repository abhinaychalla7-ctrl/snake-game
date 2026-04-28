import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { DUMMY_SONGS } from '@/src/constants';

interface MusicPlayerProps {
  songIdx: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function MusicPlayer({ songIdx, onNext, onPrev }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentSong = DUMMY_SONGS[songIdx];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            onNext();
            return 0;
          }
          return prev + (100 / currentSong.duration);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, onNext]);

  useEffect(() => {
    setProgress(0);
  }, [songIdx]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex items-center px-12 gap-12 max-w-[1400px] mx-auto">
      {/* Current Song Info */}
      <div className="flex items-center gap-4 w-64 shrink-0">
        <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden border border-white/10 relative">
          <img 
            src={currentSong.cover} 
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-cyan-600/20 animate-pulse" />
          )}
        </div>
        <div className="overflow-hidden">
          <div className="text-sm font-bold text-white truncate tracking-tight">{currentSong.title}</div>
          <div className="text-xs text-slate-500 font-medium truncate italic">{currentSong.artist}</div>
        </div>
      </div>

      {/* Controls and Progress */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button 
            onClick={onPrev}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black translate-x-0.5" />}
          </button>
          
          <button 
            onClick={onNext}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        <div className="w-full max-w-xl flex items-center gap-3 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          <span className="text-cyan-400 w-10 text-right">{formatTime((progress / 100) * currentSong.duration)}</span>
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 1 }}
            />
          </div>
          <span className="w-10">{formatTime(currentSong.duration)}</span>
        </div>
      </div>

      {/* Volume / Extra Info */}
      <div className="w-64 flex justify-end gap-6 items-center shrink-0">
        <div className="flex items-center gap-2 text-slate-500">
          <Volume2 className="w-4 h-4" />
          <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-slate-400"></div>
          </div>
        </div>
        <button className="text-slate-500 hover:text-cyan-400 transition-colors">
            <Music2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
