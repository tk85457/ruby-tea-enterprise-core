'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, useScroll } from 'framer-motion';

const frameCount = 80; // 80 frame high-res sequence
const images: HTMLImageElement[] = [];

// Preload images from the sequence directory
// Preload images from the sequence directory with staggering to save bandwidth on initial load
const preloadImages = (onProgress?: (count: number) => void) => {
  if (images.length > 0) return;

  // 1. Initial Priority Batch (First 15 frames for immediate visual)
  const priorityBatch = 15;
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    const formattedIndex = i.toString().padStart(3, '0');
    // Only set src for the full sequence if we want to preload all,
    // but we'll prioritize the first few.
    if (i < priorityBatch) {
      img.src = `/images/hero-new-sequence/Create_a_video_1080p_202601292134_${formattedIndex}.jpg`;
    }
    images.push(img);
  }

  // 2. Secondary Batch Loading (The rest)
  setTimeout(() => {
    for (let i = priorityBatch; i < frameCount; i++) {
      const formattedIndex = i.toString().padStart(3, '0');
      images[i].src = `/images/hero-new-sequence/Create_a_video_1080p_202601292134_${formattedIndex}.jpg`;
    }
  }, 1500); // Wait for initial render to load more
};

interface HeroSequenceProps {
  scrollRef: React.RefObject<HTMLElement | null>;
}

export default function HeroSequence({ scrollRef }: HeroSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Scroll Progress
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  // Smooth Scroll Physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200, // Responsive but smooth
    damping: 30,
    mass: 0.5
  });

  // Map 0-1 scroll progress to 0-79 frame index
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, frameCount - 1]);

  // Create a state to trigger re-renders when the transform changes
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    return frameIndex.on("change", (latest) => {
      setCurrentFrame(Math.round(latest));
    });
  }, [frameIndex]);

  // Mouse Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowX = useTransform(mouseX, [-0.5, 0.5], [-50, 50]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], [-50, 50]);

  const packetXMove = useSpring(0, { stiffness: 100, damping: 30 });
  const packetYMove = useSpring(0, { stiffness: 100, damping: 30 });
  const packetScale = useSpring(1, { stiffness: 100, damping: 30 }); // Start at full scale

  useEffect(() => {
    const unsubX = mouseX.on("change", (v) => packetXMove.set(v * 40));
    const unsubY = mouseY.on("change", (v) => packetYMove.set(v * 40));
    return () => {
        unsubX();
        unsubY();
    };
  }, [mouseX, mouseY, packetXMove, packetYMove]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    packetScale.set(1 + Math.abs(x + y) * 0.05); // Dynamic zoom starting from 1.0
  };

  useEffect(() => {
    preloadImages();
    // Load check logic
    const checkLoad = setInterval(() => {
       // Check if at least first few and middle images are loaded for smoother start
       let loadedCount = 0;
       images.forEach(img => { if(img.complete) loadedCount++; });

       if (loadedCount > 10) { // Start when decent chunk is ready
           setIsLoaded(true);
           clearInterval(checkLoad);
       }
    }, 100);
    return () => clearInterval(checkLoad);
  }, []);

  // Canvas Rendering Logic
  useEffect(() => {
    if (!isLoaded) return;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;

      const idx = Math.min(frameCount - 1, Math.max(0, currentFrame));
      const img = images[idx];

      if (!img || !img.complete) return;

      const dpr = window.devicePixelRatio || 1;
      const cssWidth = window.innerWidth;
      const cssHeight = window.innerHeight;

      // Update canvas dimensions for high-DPI
      if (canvas.width !== cssWidth * dpr || canvas.height !== cssHeight * dpr) {
        canvas.width = cssWidth * dpr;
        canvas.height = cssHeight * dpr;
      }

      const imgRatio = img.width / img.height;
      const canvasRatio = cssWidth / cssHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      // Cinematic "Object-Fit: Cover" algorithm
      if (canvasRatio > imgRatio) {
          drawWidth = cssWidth;
          drawHeight = cssWidth / imgRatio;
      } else {
          drawHeight = cssHeight;
          drawWidth = cssHeight * imgRatio;
      }

      offsetX = (cssWidth - drawWidth) / 2;
      offsetY = (cssHeight - drawHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.save();
      context.scale(dpr, dpr);

      // Dynamic Bloom
      if (idx > 15 && idx < 45) {
        context.shadowBlur = 50;
        context.shadowColor = "rgba(50, 8, 8, 0.6)";
      } else {
        context.shadowBlur = 0;
      }

      context.drawImage(img, Math.floor(offsetX), Math.floor(offsetY), Math.ceil(drawWidth), Math.ceil(drawHeight));

      context.restore();
    };

    render();

    const handleResize = () => {
        if (canvasRef.current) {
            const dpr = window.devicePixelRatio || 1;
            canvasRef.current.width = window.innerWidth * dpr;
            canvasRef.current.height = window.innerHeight * dpr;
            render();
        }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrame, isLoaded]); // Re-render when currentFrame changes

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-dvh bg-[var(--coffee-dark)] overflow-hidden z-0 transition-[height] duration-300"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        {/* Background Decorative Glow */}
        <motion.div
          style={{
            x: glowX,
            y: glowY,
            scale: 1.5
          }}
          className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
        >
          <div className="w-[80vw] h-[80vw] rounded-full bg-gradient-radial from-[var(--reddish-brown)]/20 to-transparent blur-[120px]" />
        </motion.div>

        {/* Main Canvas Context */}
        <motion.div
          style={{
            x: packetXMove,
            y: packetYMove,
            scale: packetScale
          }}
          className="w-full h-full flex items-center justify-center z-20 pointer-events-none"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
        </motion.div>

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-[var(--deep-bg)]">
              <div className="text-center">
                  <div className="w-16 h-16 border-4 border-[var(--reddish-brown)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-xl font-serif text-[var(--reddish-brown)]">Mastering the blend...</p>
              </div>
          </div>
        )}

        {/* Scroll Indicator hint */}
        <div className="absolute bottom-12 left-0 right-0 z-40 text-center pointer-events-none animate-bounce opacity-50">
           <svg className="w-6 h-6 mx-auto text-[var(--accent-hover)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
           </svg>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--deep-bg)]/80 to-transparent z-30 pointer-events-none" />
      </div>
    </div>
  );
}
