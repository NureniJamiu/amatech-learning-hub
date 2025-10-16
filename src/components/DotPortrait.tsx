import React, { useRef, useEffect } from 'react';

interface DotPortraitProps {
    imageSrc: string;
    width?: number;
    height?: number;
    step?: number;
}

interface Dot {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    radius: number;
    color: string;
}

const DotPortrait: React.FC<DotPortraitProps> = ({
    imageSrc,
    width = 531,
    height = 750,
    step = 8,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const dotsRef = useRef<Dot[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;

            const dots: Dot[] = [];
            for (let y = 0; y < height; y += step) {
                for (let x = 0; x < width; x += step) {
                    const i = (y * width + x) * 4;
                    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    const radius = (brightness / 255) * (step / 2);
                    const color = `rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`;
                    dots.push({ x, y, baseX: x, baseY: y, radius, color });
                }
            }

            dotsRef.current = dots;
            drawDots();
        };

        const drawDots = (cursor?: { x: number; y: number }) => {
            ctx.clearRect(0, 0, width, height);

            dotsRef.current.forEach(dot => {
                let dx = 0;
                let dy = 0;

                if (cursor) {
                    const dist = Math.hypot(dot.x - cursor.x, dot.y - cursor.y);
                    if (dist < 80) {
                        const angle = Math.atan2(dot.y - cursor.y, dot.x - cursor.x);
                        const force = (80 - dist) / 80;
                        dx = Math.cos(angle) * force * 10;
                        dy = Math.sin(angle) * force * 10;
                    }
                }

                dot.x = dot.baseX + dx;
                dot.y = dot.baseY + dy;

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fillStyle = dot.color;
                ctx.fill();
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const cursor = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
            drawDots(cursor);
        };

        const handleMouseLeave = () => {
            drawDots(); // Reset to original positions
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [imageSrc, width, height, step]);

    return (
        <div className="w-full max-w-[226px] aspect-[472/667] overflow-hidden">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="w-full h-auto block bg-transparent"
            />
        </div>
    );
};

export default DotPortrait;
