"use client";
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const TOTAL_FRAMES = 192;

export default function ProductStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameIndex = String(i).padStart(3, "0");
      img.src = `/images/ezgif-frame-${frameIndex}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES && canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx && loadedImages[0]) renderFrame(ctx, loadedImages[0]);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (latest) => {
      if (images.length === 0 || !canvasRef.current) return;
      // 3D completes in first 35% of scroll, BEFORE text appears
      const mappedProgress = Math.min(1, latest / 0.35);
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(mappedProgress * (TOTAL_FRAMES - 1)))
      );
      const ctx = canvasRef.current.getContext("2d");
      const img = images[frameIndex];
      if (ctx && img && img.complete) {
        requestAnimationFrame(() => renderFrame(ctx, img));
      }
    });
    return () => unsub();
  }, [scrollYProgress, images]);

  const renderFrame = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = canvas.width / 2 - (img.width / 2) * scale;
    const y = canvas.height / 2 - (img.height / 2) * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Title: visible 0-15%, fades out
  const op0 = useTransform(scrollYProgress, [0, 0.08, 0.15], [1, 1, 0]);
  const y0 = useTransform(scrollYProgress, [0, 0.15], [0, -40]);

  // "Track" word — appears completely AFTER 3D object fully opens (post-35%)
  const opTrack = useTransform(scrollYProgress, [0.38, 0.45], [0, 1]);
  const yTrack = useTransform(scrollYProgress, [0.38, 0.45], [150, 0]);
  const scaleTrack = useTransform(scrollYProgress, [0.38, 0.45], [0.8, 1]);

  // "Compare" word
  const opCompare = useTransform(scrollYProgress, [0.46, 0.53], [0, 1]);
  const yCompare = useTransform(scrollYProgress, [0.46, 0.53], [150, 0]);
  const scaleCompare = useTransform(scrollYProgress, [0.46, 0.53], [0.8, 1]);

  // "Grow" word
  const opGrow = useTransform(scrollYProgress, [0.54, 0.61], [0, 1]);
  const yGrow = useTransform(scrollYProgress, [0.54, 0.61], [150, 0]);
  const scaleGrow = useTransform(scrollYProgress, [0.54, 0.61], [0.8, 1]);

  // All three fade out together
  const opTCGOut = useTransform(scrollYProgress, [0.62, 0.70], [1, 0]);

  // "Pricing Intelligence" — appears at 72%
  const op70 = useTransform(scrollYProgress, [0.70, 0.78, 0.90, 0.95], [0, 1, 1, 0]);
  const x70 = useTransform(scrollYProgress, [0.70, 0.78], [50, 0]);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black/90 flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-0"></div>

        <div className="relative z-10 w-full h-full text-white px-4 md:px-8 max-w-7xl mx-auto">
          
          {/* Step 1: Title */}
          <motion.div 
            style={{ opacity: op0, y: y0 }}
            className="absolute top-[20%] left-0 right-0 flex flex-col items-center text-center space-y-4"
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tight font-inter">Bridgeloop</h1>
            <p className="text-xl md:text-3xl font-medium text-gray-300 max-w-2xl">Turn Public Data Into Your Competitive Edge.</p>
          </motion.div>

          {/* Step 2: Track. Compare. Grow. — one by one from bottom */}
          <motion.div
            style={{ opacity: opTCGOut }}
            className="absolute top-[30%] left-0 right-0 flex flex-col items-center text-center space-y-4"
          >
            <motion.div
              style={{ opacity: opTrack, y: yTrack, scale: scaleTrack }}
              className="text-5xl md:text-7xl font-black font-inter text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            >
              Track.
            </motion.div>
            <motion.div
              style={{ opacity: opCompare, y: yCompare, scale: scaleCompare }}
              className="text-5xl md:text-7xl font-black font-inter text-green-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            >
              Compare.
            </motion.div>
            <motion.div
              style={{ opacity: opGrow, y: yGrow, scale: scaleGrow }}
              className="text-5xl md:text-7xl font-black font-inter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            >
              Grow.
            </motion.div>
          </motion.div>

          {/* Step 3: Pricing Intelligence */}
          <motion.div
            style={{ opacity: op70, x: x70 }}
            className="absolute top-[55%] right-4 md:right-12 flex flex-col items-end text-right max-w-xl"
          >
            <h2 className="text-4xl md:text-6xl font-bold leading-tight font-inter">
              Pricing Intelligence, <br/>
              <span className="text-blue-500">Finally Simplified.</span>
            </h2>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
