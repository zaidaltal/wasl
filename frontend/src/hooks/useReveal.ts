'use client';

import { useEffect } from 'react';

export function useReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    // Reveal: adds 'active' class when element enters viewport
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

    // Count-up: animates data-count="5000" numbers
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const target = parseInt(el.getAttribute('data-count') || '0', 10);
        if (!target) return;
        const duration = 2000;
        const startTime = performance.now();

        const updateCount = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(progress * target);
          el.innerText = current.toLocaleString() + (target >= 15 ? '+' : '');
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.innerText = target.toLocaleString() + (target > 15 ? '+' : '');
          }
        };

        if (prefersReduced) {
          el.innerText = target.toLocaleString() + (target > 15 ? '+' : '');
        } else {
          requestAnimationFrame(updateCount);
        }
        countObs.unobserve(el);
      });
    }, observerOptions);

    document.querySelectorAll('[data-count]').forEach((el) => countObs.observe(el));

    return () => {
      revealObs.disconnect();
      countObs.disconnect();
    };
  }, []);
}
