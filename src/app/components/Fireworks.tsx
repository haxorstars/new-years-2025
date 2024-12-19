'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
}

const Firework = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [mounted, setMounted] = useState(false);
  const [fireworks, setFireworks] = useState<Firework[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const newYear = new Date('January 1, 2025 00:00:00').getTime();
      const now = new Date().getTime();
      const distance = newYear - now;

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const createFirework = () => {
      const newFirework = {
        id: Date.now(),
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 0),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight / 2 : 0),
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
      };

      setFireworks(prev => [...prev, newFirework]);

      setTimeout(() => {
        setFireworks(prev => prev.filter(fw => fw.id !== newFirework.id));
      }, 1000);
    };

    const interval = setInterval(createFirework, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Countdown */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center z-10">
        <h1 className="title-gradient text-6xl font-bold mb-12 animate-gradient text-center">
          New Year 2025
        </h1>
        <div className="countdown-container">
          <div className="countdown-box">
            <div className="countdown-number">{countdown.days}</div>
            <div className="countdown-label">Days</div>
          </div>
          <div className="countdown-box">
            <div className="countdown-number">{countdown.hours}</div>
            <div className="countdown-label">Hours</div>
          </div>
          <div className="countdown-box">
            <div className="countdown-number">{countdown.minutes}</div>
            <div className="countdown-label">Minutes</div>
          </div>
          <div className="countdown-box">
            <div className="countdown-number">{countdown.seconds}</div>
            <div className="countdown-label">Seconds</div>
          </div>
        </div>
      </div>

      {/* Fireworks */}
      <AnimatePresence>
        {fireworks.map((fw) => (
          <motion.div
            key={fw.id}
            initial={{ scale: 0.1, y: window.innerHeight }}
            animate={{
              scale: [1, 2, 0],
              y: fw.y,
              opacity: [1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              position: 'absolute',
              left: fw.x,
              backgroundColor: fw.color,
            }}
            className="w-2 h-2 rounded-full shadow-lg"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: Math.cos(i * 30 * (Math.PI / 180)) * 100,
                  y: Math.sin(i * 30 * (Math.PI / 180)) * 100,
                  opacity: 0
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ backgroundColor: fw.color }}
                className="absolute w-1 h-1 rounded-full shadow-md"
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Stars */}
      <div className="fixed inset-0">
        {mounted && Array.from({ length: 100 }).map((_, index) => {
          const style = {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`
          };
          return (
            <div
              key={index}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Firework;