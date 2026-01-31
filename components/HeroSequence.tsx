'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, useScroll } from 'framer-motion';

const getAssetConfig = (isMobile: boolean) => ({
  path: '/images/hero-sequence/',
  prefix: 'Create_a_video_1080p_202601292134_',
  frameCount: 80,
  increment: 1
});

interface HeroSequenceProps {
  scrollRef: React.RefObject<HTMLElement | null>;
}

export default function HeroSequence({ scrollRef }: HeroSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]); // 🟠 2. Memory Safety: Global array removed
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lastRenderedIndex = useRef<number>(-1); // 🟢 4. Optimization: Track last frame

  // Scroll Progress
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  // Smooth Scroll Physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 150 : 200,
    damping: isMobile ? 35 : 30,
    mass: 0.5
  });

  // 🟡 3. Dynamic Frame Range: Config extracted for cleaner architecture
  const config = getAssetConfig(isMobile);
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, config.frameCount - 1]);

  // Initialization & Preload
  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize); // 🟣 5. Resize Listener

    // Use local config for effect to ensure freshness
    const effectConfig = getAssetConfig(window.innerWidth < 768);
    let loadedCount = 0;
    const totalImages = effectConfig.frameCount;

    // Initialize array if empty
    if (imagesRef.current.length === 0) {
        for (let i = 0; i < totalImages; i++) {
            const img = new Image();
            const formattedIndex = i.toString().padStart(3, '0');

            // 🟡 3. Efficient Load Checker: Use onload for critical frames
            img.onload = () => {
                loadedCount++;
                // 🟡 2. Edge Case Fix: Start if frame 0 OR 1 is loaded (Safer)
                if (i <= 1) setIsLoaded(true);
            };

            // Priority Loading Strategy
            if (i < 25) {
                img.src = `${effectConfig.path}${effectConfig.prefix}${formattedIndex}.webp`;
            }
            imagesRef.current[i] = img;
        }

        // Lazy load the rest
        setTimeout(() => {
             for (let i = 25; i < totalImages; i++) {
                 const img = imagesRef.current[i];
                 if (img && !img.src) {
                    const formattedIndex = i.toString().padStart(3, '0');
                    img.src = `${effectConfig.path}${effectConfig.prefix}${formattedIndex}.webp`;
                 }
             }
        }, 100);
    } else {
        // If already populated (hot reload/remount), check readiness
        if(imagesRef.current.some(img => img.complete)) {
            setIsLoaded(true);
        }
    }

    return () => {
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Optimized Render Loop
  useEffect(() => {
    if (!isLoaded) return;

    let rafId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 🟡 6. Mobile Optimization: Lower quality for pure performance if needed
    // But 'medium' is a good balance.
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = isMobile ? 'low' : 'medium';

    const render = () => {
      const idx = Math.round(frameIndex.get());

      // 🟢 4. Render only on change
      if (idx !== lastRenderedIndex.current) {
        lastRenderedIndex.current = idx;

        const img = imagesRef.current[idx];

        // Fallback search
        let finalImg = img;
        if (!img?.complete) {
            for(let shift = 1; shift < 5; shift++) {
                if (imagesRef.current[idx-shift]?.complete) { finalImg = imagesRef.current[idx-shift]; break; }
                if (imagesRef.current[idx+shift]?.complete) { finalImg = imagesRef.current[idx+shift]; break; }
            }
        }

        if (finalImg && finalImg.complete) {
            // 🗺️ Dimensions & Scaling
            const maxDpr = isMobile ? 1.5 : (window.devicePixelRatio || 1);
            const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
            const cssWidth = window.innerWidth;
            const cssHeight = window.innerHeight;

            // 🔴 1. Fix: Handle Resize & Scale Correctly using setTransform
            if (canvas.width !== cssWidth * dpr || canvas.height !== cssHeight * dpr) {
                canvas.width = cssWidth * dpr;
                canvas.height = cssHeight * dpr;
            }

            // Reset transform to identity * DPR, effectively replacing context.scale(dpr, dpr)
            context.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Calculation
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

            // Clear & Draw
            context.clearRect(0, 0, cssWidth, cssHeight); // Clear logic uses CSS units because of setTransform
            context.drawImage(finalImg, Math.round(offsetX), Math.round(offsetY), Math.ceil(drawWidth), Math.ceil(drawHeight));
        }
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
