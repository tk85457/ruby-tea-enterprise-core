'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, useScroll } from 'framer-motion';

// -----------------------------------------------------------------------------
// ⚙️ DEVICE DETECTION & ASSET CONFIG
// -----------------------------------------------------------------------------

type DeviceType = 'mobile-small' | 'mobile-large' | 'video' | 'desktop';

interface AssetConfig {
  path: string;
  frameCount: number;
}

const getDeviceType = (width: number): DeviceType => {
  if (width <= 480) return 'mobile-small';
  if (width <= 768) return 'mobile-large';
  if (width <= 1024) return 'video'; // Tablet uses 'video' folder OR 'tablet' depending on generation?
  // Wait, my script generated 'tablet'. Let's match the script.
  return 'desktop';
};

// CORRECTED SCRIPT MAPPING:
// Script generated: 'mobile-small', 'mobile-large', 'tablet'
// Desktop is root.

const getAssetConfig = (width: number): AssetConfig => {
  const basePrefix = 'Create_a_video_1080p_202601292134_';
  // Desktop Default
  let path = '/images/hero-sequence/';

  if (width <= 480) {
      path = '/images/hero-sequence/mobile-small/';
  } else if (width <= 768) {
      path = '/images/hero-sequence/mobile-large/';
  } else if (width <= 1024) {
      path = '/images/hero-sequence/tablet/';
  }

  return {
    path,
    frameCount: 80 // All variants have 80 frames now
  };
};

interface HeroSequenceProps {
  scrollRef: React.RefObject<HTMLElement | null>;
}

export default function HeroSequence({ scrollRef }: HeroSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0); // Track width for re-renders
  const lastRenderedIndex = useRef<number>(-1);

  // ---------------------------------------------------------------------------
  // 🖱️ SCROLL & PHYSICS
  // ---------------------------------------------------------------------------
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const isMobile = windowWidth > 0 && windowWidth < 768;

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 150 : 200,
    damping: isMobile ? 35 : 30,
    mass: 0.5
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [0, 79]);

  // ---------------------------------------------------------------------------
  // 🚀 INIT & PRELOADER
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // 1. Initial Config
    const width = window.innerWidth;
    setWindowWidth(width);
    const config = getAssetConfig(width);
    const prefix = 'Create_a_video_1080p_202601292134_';

    // Reset if needed (though usually we stick to one set per session to avoid complexity)
    if (imagesRef.current.length === 0) {
      let loadedCount = 0;

      for (let i = 0; i < config.frameCount; i++) {
        const img = new Image();
        const formattedIndex = i.toString().padStart(3, '0');
        const src = `${config.path}${prefix}${formattedIndex}.webp`;

        img.onload = () => {
          loadedCount++;
          if (i <= 1) setIsLoaded(true); // Show ASAP
        };

        // Tier 1: Immediate
        if (i < 15) {
           img.src = src;
        }

        imagesRef.current[i] = img;
      }

      // Tier 2: High Priority
      setTimeout(() => {
        for (let i = 15; i < 40; i++) {
            const img = imagesRef.current[i];
            if (img && !img.src) img.src = `${config.path}${prefix}${i.toString().padStart(3, '0')}.webp`;
        }
      }, 200);

      // Tier 3: Idle
      setTimeout(() => {
         const loadRest = () => {
             for (let i = 40; i < config.frameCount; i++) {
                 const img = imagesRef.current[i];
                 if (img && !img.src) img.src = `${config.path}${prefix}${i.toString().padStart(3, '0')}.webp`;
             }
         };
         if ('requestIdleCallback' in window) (window as any).requestIdleCallback(loadRest);
         else setTimeout(loadRest, 100);
      }, 600);
    } else {
        if(imagesRef.current[0]?.complete) setIsLoaded(true);
    }

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ---------------------------------------------------------------------------
  // 🎥 RENDER LOOP
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = isMobile ? 'low' : 'medium';

    let rafId: number;
    let lastFrameTime = 0;
    // 30fps lock for mobile to save battery and reduce heating
    const fpsInterval = isMobile ? 1000 / 30 : 1000 / 60;

    const render = (timestamp: number) => {
      rafId = requestAnimationFrame(render);

      const elapsed = timestamp - lastFrameTime;
      if (elapsed < fpsInterval) return;

      lastFrameTime = timestamp - (elapsed % fpsInterval);

      const idx = Math.round(frameIndex.get());

      // Only draw if frame changed or canvas was cleared/resized (tracked via index for now)
      if (idx !== lastRenderedIndex.current) {
        lastRenderedIndex.current = idx;
        const img = imagesRef.current[idx];

        // Simple fallback
        const finalImg = img?.complete ? img : imagesRef.current.find((im, i) => Math.abs(i - idx) < 5 && im.complete);

        if (finalImg) {
            const maxDpr = isMobile ? 1.5 : (window.devicePixelRatio || 1);
            const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
            const cssWidth = window.innerWidth;
            const cssHeight = window.innerHeight;

            if (canvas.width !== cssWidth * dpr || canvas.height !== cssHeight * dpr) {
                canvas.width = cssWidth * dpr;
                canvas.height = cssHeight * dpr;
            }

            context.setTransform(dpr, 0, 0, dpr, 0, 0);

            const imgRatio = finalImg.width / finalImg.height;
            const canvasRatio = cssWidth / cssHeight;
            let drawWidth, drawHeight;

            if (canvasRatio > imgRatio) {
                drawWidth = cssWidth;
                drawHeight = cssWidth / imgRatio;
            } else {
                drawHeight = cssHeight;
                drawWidth = cssHeight * imgRatio;
            }

            const offsetX = (cssWidth - drawWidth) / 2;
            const offsetY = (cssHeight - drawHeight) / 2;

            context.clearRect(0, 0, cssWidth, cssHeight);
            context.drawImage(finalImg, Math.floor(offsetX), Math.floor(offsetY), Math.ceil(drawWidth), Math.ceil(drawHeight));
        }
      }
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [isLoaded, isMobile, frameIndex]);

  // Desktop Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useTransform(mouseX, [-0.5, 0.5], [-50, 50]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], [-50, 50]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-dvh bg-[#0a0505] overflow-hidden z-0"
      onMouseMove={handleMouseMove}
      style={{ contain: 'layout style paint' }}
    >
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        {!isMobile && (
          <motion.div style={{ x: glowX, y: glowY, scale: 1.5 }} className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            <div className="w-[80vw] h-[80vw] rounded-full bg-gradient-radial from-[#3d1111]/20 to-transparent blur-[120px]" />
          </motion.div>
        )}
        <div className="w-full h-full flex items-center justify-center z-20 pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#0a0505]">
              <div className="w-12 h-12 border-2 text-[var(--accent-hover)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 pointer-events-none z-30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0505] to-transparent z-40 pointer-events-none" />
      </div>
    </div>
  );
}
