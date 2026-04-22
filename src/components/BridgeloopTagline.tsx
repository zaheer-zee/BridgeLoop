'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TAGLINE =
  'BridgeLoop automatically monitors your competitors across the web, uses AI to parse sentiments and pricing shifts, and delivers actionable alerts directly to your dashboard.';

export default function BridgeloopTagline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll('.bl-word');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0, y: 30, rotateX: 5, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.tagline-section',
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
            once: true,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="tagline-section py-16 flex items-center justify-center px-6 relative">
      <div ref={containerRef} className="max-w-4xl mx-auto text-center">
        <p
          className="text-xl md:text-3xl lg:text-4xl font-semibold italic leading-relaxed"
          style={{ textShadow: '0 0 30px rgba(34,211,238,0.25)' }}
        >
          {TAGLINE.split(' ').map((word, i) => (
            <span
              key={i}
              className="bl-word inline-block mr-[0.3em] text-gray-900 dark:text-white"
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
