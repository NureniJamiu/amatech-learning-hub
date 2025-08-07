"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedGridBackgroundProps {
  className?: string;
}

export function AnimatedGridBackground({ className = "" }: AnimatedGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gridSize = 50;
    const maxDistance = 150;

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.offsetWidth / gridSize);
      const rows = Math.ceil(canvas.offsetHeight / gridSize);

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
            const x = i * gridSize;
            const y = j * gridSize;

            const distance = Math.sqrt(
                Math.pow(mouseRef.current.x - x, 2) +
                    Math.pow(mouseRef.current.y - y, 2)
            );

            const opacity = Math.max(0.15, 1 - distance / maxDistance); // Added base opacity of 0.15
            const intensity = opacity * 0.6; // Increased from 0.3 to 0.6 for better visibility

            // Draw horizontal line
            if (j < rows) {
                ctx.strokeStyle = `rgba(34, 197, 94, ${intensity})`;
                ctx.lineWidth = 2; // Increased line width for better visibility
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + gridSize, y);
                ctx.stroke();
            }

            // Draw vertical line
            if (i < cols) {
                ctx.strokeStyle = `rgba(34, 197, 94, ${intensity})`;
                ctx.lineWidth = 2; // Increased line width for better visibility
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + gridSize);
                ctx.stroke();
            }

            // Draw intersection point
            ctx.fillStyle = `rgba(34, 197, 94, ${intensity * 2})`;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2); // Increased size from 2 to 3
            ctx.fill();
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      drawGrid();
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    drawGrid();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
