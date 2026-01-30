'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, useScroll } from 'framer-motion';

const frameCount = 80;
const images: HTMLImageElement[] = [];

// Resolution Tiering: Use smaller assets for mobile to save bandwidth/memory
const getAssetConfig = (isMobile: boolean) => ({
  path: isMobile ? '/images/hero-sequence/' : '/images/hero-new-sequence/',
  prefix: isMobile ? 'Exploding_Tea_Packet_Animation_' : 'Create_a_video_1080p_202601292134_',
  increment: isMobile ? 2 : 1 // Mobile skips frames to stay fluid
});

const preloadImages = (isMobile: boolean) => {
  if (images.length > 0) return;
  const config = getAssetConfig(isMobile);

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    const formattedIndex = i.toString().padStart(3, '0');

    // Priority: Only set SRC for frames we will actually render
    if (!isMobile || i % config.increment === 0) {
      if (i < 12) { // Immediate Priority Batch
        img.src = `${config.path}${config.prefix}${formattedIndex}.jpg`;
      }
    }
    images.push(img);
  }

  // Secondary Batch
  setTimeout(() => {
    for (let i = 0; i < frameCount; i++) {
        if (!isMobile || i % config.increment === 0) {
            if (!images[i].src) {
                const formattedIndex = i.toString().padStart(3, '0');
                images[i].src = `${config.path}${config.prefix}${formattedIndex}.jpg`;
            }
        }
    }
  }, 800);
};

interface HeroSequenceProps {
  scrollRef: React.RefObject<HTMLElement | null>;
}

export default function HeroSequence({ scrollRef }: HeroSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 120 : 200,
    damping: isMobile ? 45 : 30, // Higher damping on mobile for stability
    mass: 0.5
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [0, frameCount - 1]);

  useEffect(() => {
    const mobileCheck = window.innerWidth < 768;
    setIsMobile(mobileCheck);
    preloadImages(mobileCheck);

    const checkLoad = setInterval(() => {
       let loadedCount = 0;
       images.forEach(img => { if(img.complete && img.src) loadedCount++; });
       // Logic Gate: Start as soon as we have enough for the intro
       if (loadedCount > 8) {
           setIsLoaded(true);
           clearInterval(checkLoad);
       }
    }, 100);
    return () => clearInterval(checkLoad);
  }, []);

  // Performance Optimized Rendering Loop (RAF)
  useEffect(() => {
    if (!isLoaded) return;

    let rafId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!context) return;

    const render = () => {
      const idx = Math.round(frameIndex.get());
      const img = images[idx];

      // Adaptive Recovery: Find the closest loaded frame if desired frame is missing
      let finalImg = img;
      if (!img?.complete) {
          for(let shift = 1; shift < 4; shift++) {
              if (images[idx-shift]?.complete) { finalImg = images[idx-shift]; break; }
              if (images[idx+shift]?.complete) { finalImg = images[idx+shift]; break; }
          }
      }

      if (finalImg && finalImg.complete) {
        // DPI Capping: Avoid 3x+ rendering on mobile which chokes GPUs
        const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
        const cssWidth = window.innerWidth;
        const cssHeight = window.innerHeight;

        if (canvas.width !== cssWidth * dpr) {
          canvas.width = cssWidth * dpr;
          canvas.height = cssHeight * dpr;
        }

        const imgRatio = finalImg.width / finalImg.height;
        const canvasRatio = cssWidth / cssHeight;

        let drawWidth, drawHeight, offsetX, offsetY;
        if (canvasRatio > imgRatio) {
            drawWidth = cssWidth;
            drawHeight = cssWidth / imgRatio;
        } else {
            drawHeight = cssHeight;
            drawWidth = cssHeight * imgRatio;
        }
        offsetX = (cssWidth - drawWidth) / 2;
        offsetY = (cssHeight - drawHeight) / 2;

        context.save();
        context.scale(dpr, dpr);

        // GPU Shortcut: No heavy shadows on mobile
        if (!isMobile && idx > 15 && idx < 45) {
          context.shadowBlur = 40;
          context.shadowColor = "rgba(50, 8, 8, 0.4)";
        }

        context.drawImage(finalImg, Math.floor(offsetX), Math.floor(offsetY), Math.ceil(drawWidth), Math.ceil(drawHeight));
        context.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [isLoaded, isMobile, frameIndex]);

  // Mouse Parallax (Optimized for desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useTransform(mouseX, [-0.5, 0.5], [-50, 50]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], [-50, 50]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-dvh bg-[#0a0505] overflow-hidden z-0"
      onMouseMove={handleMouseMove}
      style={{ willChange: 'transform' }} // Promoting to Compositor Layer
    >
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        {/* Ambient Glow */}
        {!isMobile && (
          <motion.div
            style={{ x: glowX, y: glowY, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
          >
            <div className="w-[80vw] h-[80vw] rounded-full bg-gradient-radial from-[#3d1111]/20 to-transparent blur-[120px]" />
          </motion.div>
        )}

        {/* Core Canvas */}
        <div className="w-full h-full flex items-center justify-center z-20 pointer-events-none">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
        </div>

        {/* Performance Preloader */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#0a0505]">
              <div className="text-center">
                  <div className="w-10 h-10 border-2 border-[var(--accent-hover)] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                  <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--accent-hover)] font-bold opacity-40">Mastering the Blend</p>
              </div>
          </div>
        )}

        {/* Global Post-Processing */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 pointer-events-none z-30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0505] to-transparent z-40 pointer-events-none" />
      </div>
    </div>
  );
}
