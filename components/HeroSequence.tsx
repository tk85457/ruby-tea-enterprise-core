'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, useScroll } from 'framer-motion';

const frameCount = 80; // 80 frame high-res sequence
const images: HTMLImageElement[] = [];

// Preload images from the sequence directory with staggering to save bandwidth on initial load
const getAssetConfig = (isMobile: boolean) => ({
  // Using the high-fidelity sequence for all devices as requested
  path: '/images/hero-sequence/',
  prefix: 'Create_a_video_1080p_202601292134_',
  frameCount: 80,
  increment: 1 // RESTORED: Full 80 frames for "pura" smoothness
});

const preloadImages = (isMobile: boolean) => {
  if (images.length > 0) return;
  const config = getAssetConfig(isMobile);

  for (let i = 0; i < config.frameCount; i++) {
    const img = new Image();
    const formattedIndex = i.toString().padStart(3, '0');

    // Priority 1: First 25 frames (Instant Start)
    if (i < 25) {
      img.src = `${config.path}${config.prefix}${formattedIndex}.webp`;
    }

    // Store in array
    images[i] = img;
  }

  // Priority 2: Remaining frames (Background load)
  setTimeout(() => {
    for (let i = 25; i < config.frameCount; i++) {
        if (!images[i]?.src) {
             const formattedIndex = i.toString().padStart(3, '0');
             if(!images[i]) images[i] = new Image();
             images[i].src = `${config.path}${config.prefix}${formattedIndex}.webp`;
        }
    }
  }, 100); // Start sooner (100ms vs 800ms) for "jaldi load"
};

interface HeroSequenceProps {
  scrollRef: React.RefObject<HTMLElement | null>;
}

export default function HeroSequence({ scrollRef }: HeroSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Scroll Progress
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  // Smooth Scroll Physics - Adjusted for mobile vs desktop
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 150 : 200, // Slightly tighter on mobile for responsiveness
    damping: isMobile ? 35 : 30,
    mass: 0.5
  });

  // Map 0-1 scroll progress to 0-frame index
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, getAssetConfig(isMobile).frameCount - 1]);

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add listener
    window.addEventListener('resize', handleResize);

    // Trigger preload
    preloadImages(window.innerWidth < 768);

    const checkLoad = setInterval(() => {
       let loadedCount = 0;
       images.forEach(img => { if(img && img.complete && img.src) loadedCount++; });
       if (loadedCount > 5) {
           setIsLoaded(true);
           clearInterval(checkLoad);
       }
    }, 50);

    return () => {
        window.removeEventListener('resize', handleResize);
        clearInterval(checkLoad);
    };
  }, []);

  // Optimized Rendering Loop (RAF based)
  useEffect(() => {
    if (!isLoaded) return;

    let rafId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: false }); // Performance optimization
    if (!context) return;

    // Smooth scaling
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'medium'; // Balance quality/perf

    const render = () => {
      const idx = Math.round(frameIndex.get());
      const img = images[idx];

      let finalImg = img;
      // Fallback to nearest neighbor if frame not loaded yet
      if (!img?.complete) {
          for(let shift = 1; shift < 10; shift++) {
              if (images[idx-shift]?.complete) { finalImg = images[idx-shift]; break; }
              if (images[idx+shift]?.complete) { finalImg = images[idx+shift]; break; }
          }
      }

      if (finalImg && finalImg.complete) {
        // PERFORMANCE: Cap PixelRatio on mobile to save GPU bandwidth.
        // High-end phones have DPR=3 (rendering 3x pixels).
        // 1.5 is enough for a smooth "video" feel without melting the GPU.
        const maxDpr = isMobile ? 1.5 : (window.devicePixelRatio || 1);
        const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

        const cssWidth = window.innerWidth;
        const cssHeight = window.innerHeight;

        if (canvas.width !== cssWidth * dpr) {
          canvas.width = cssWidth * dpr;
          canvas.height = cssHeight * dpr;
          context.scale(dpr, dpr); // Reset scale when resizing
        } else {
             // Reset transform for this frame
             context.setTransform(dpr, 0, 0, dpr, 0, 0);
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

        // Clear canvas to prevent ghosting or trails
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.save();
        context.scale(dpr, dpr);

        // Draw image effectively centered
        context.drawImage(finalImg, Math.round(offsetX), Math.round(offsetY), Math.ceil(drawWidth), Math.ceil(drawHeight));
        context.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [isLoaded, isMobile, frameIndex]);

  // Mouse Parallax (Desktop Only)
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
    >
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        {/* Decorative Glow */}
        {!isMobile && (
          <motion.div
            style={{ x: glowX, y: glowY, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
          >
            <div className="w-[80vw] h-[80vw] rounded-full bg-gradient-radial from-[#3d1111]/20 to-transparent blur-[120px]" />
          </motion.div>
        )}

        {/* Main Canvas */}
        <div className="w-full h-full flex items-center justify-center z-20 pointer-events-none">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
        </div>

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#0a0505]">
              <div className="text-center">
                  <div className="w-12 h-12 border-2 border-[var(--accent-hover)] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                  <p className="text-sm uppercase tracking-[0.4em] text-[var(--accent-hover)] font-bold opacity-60">Mastering the Blend</p>
              </div>
          </div>
        )}

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 pointer-events-none z-30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0505] to-transparent z-40 pointer-events-none" />
      </div>
    </div>
  );
}
