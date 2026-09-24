'use client';

import React, { useEffect, useRef } from 'react';

interface DynamicScreenPatternProps {
  isActive?: boolean;
}

export default function DynamicScreenPattern({ isActive = true }: DynamicScreenPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let phase = 0;

    const renderPattern = () => {
      phase += 0.015;
      ctx.clearRect(0, 0, width, height);

      // High-frequency subtle moiré grid pattern
      const spacing = 18; // px spacing
      const shiftX = Math.sin(phase) * 6;
      const shiftY = Math.cos(phase * 0.7) * 6;

      ctx.save();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.022)'; // Very subtle indigo tint
      ctx.lineWidth = 0.5;

      // Diagonal micro lines causing optical interference on camera sensors
      ctx.beginPath();
      for (let x = -height; x < width + height; x += spacing) {
        ctx.moveTo(x + shiftX, 0);
        ctx.lineTo(x + shiftX + height, height + shiftY);
      }
      ctx.stroke();

      // Counter-diagonal micro lines
      ctx.beginPath();
      for (let x = -height; x < width + height; x += spacing) {
        ctx.moveTo(x - shiftX, height);
        ctx.lineTo(x - shiftX + height, 0 - shiftY);
      }
      ctx.stroke();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(renderPattern);
    };

    animFrameRef.current = requestAnimationFrame(renderPattern);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none opacity-80"
      aria-hidden="true"
    />
  );
}
