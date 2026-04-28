import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 100;

interface SnakeGameProps {
  onStatsUpdate: (stats: { score: number; length: number; status: 'IDLE' | 'PLAYING' | 'GAME_OVER' }) => void;
}

const SnakeGame = ({ onStatsUpdate }: SnakeGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAME_OVER'>('IDLE');
  const [speed, setSpeed] = useState(BASE_SPEED);

  const generateFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameState('PLAYING');
    setSpeed(BASE_SPEED);
    onStatsUpdate({ score: 0, length: INITIAL_SNAKE.length, status: 'PLAYING' });
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { x: prevSnake[0].x + direction.x, y: prevSnake[0].y + direction.y };

        if (
          head.x < 0 || head.x >= GRID_SIZE ||
          head.y < 0 || head.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
          setGameState('GAME_OVER');
          onStatsUpdate({ score, length: prevSnake.length, status: 'GAME_OVER' });
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          setFood(generateFood(newSnake));
          setSpeed(prev => Math.max(prev - 1, 50));
          onStatsUpdate({ score: newScore, length: newSnake.length, status: 'PLAYING' });
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [direction, food, gameState, speed, score, generateFood, onStatsUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Board background (Clear)
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle)
    ctx.strokeStyle = 'rgba(51, 51, 51, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath(); ctx.moveTo(i * cellSize, 0); ctx.lineTo(i * cellSize, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * cellSize); ctx.lineTo(canvas.width, i * cellSize); ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ec4899';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ec4899';
    ctx.beginPath();
    ctx.arc(food.x * cellSize + cellSize/2, food.y * cellSize + cellSize/2, cellSize/2.5, 0, Math.PI*2);
    ctx.fill();

    // Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#34d399' : '#10b981';
      ctx.shadowBlur = isHead ? 25 : 10;
      ctx.shadowColor = '#10b981';
      
      const padding = 1;
      const x = segment.x * cellSize + padding;
      const y = segment.y * cellSize + padding;
      const size = cellSize - padding * 2;
      
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, isHead ? 4 : 2);
      ctx.fill();
      
      if (isHead) {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, 2, 0, Math.PI*2);
        ctx.fill();
      }
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative group p-1 bg-slate-800 rounded-sm shadow-2xl">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="block"
      />
      
      <AnimatePresence>
        {gameState !== 'PLAYING' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h2 className={`text-4xl font-black italic tracking-tighter mb-6 drop-shadow-lg ${gameState === 'GAME_OVER' ? 'text-pink-500' : 'text-white'}`}>
                {gameState === 'GAME_OVER' ? 'CRITICAL FAILURE' : 'SYSTEM PAUSED'}
              </h2>
              
              <button
                onClick={resetGame}
                className="group relative px-8 py-3 bg-white text-black font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform"
              >
                <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                {gameState === 'GAME_OVER' ? 'REBOOT SESSION' : 'INITIATE LINK'}
              </button>
              
              <p className="mt-4 text-[10px] text-cyan-400 font-bold uppercase tracking-[0.4em]">
                {gameState === 'GAME_OVER' ? 'Terminal state reached' : 'Press button to play'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SnakeGame;
