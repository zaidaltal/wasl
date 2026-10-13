'use client';

import { useEffect } from 'react';

/**
 * Observes every [data-reveal] element (including ones rendered later by
 * client-side data fetching) and adds `.is-in` once it scrolls into view.
 * Stagger with style={{ '--d': n }}. Reduced-motion users get static content via CSS.
 */
export function RevealRoot() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('reveal-ready');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const scan = (node: ParentNode) => {
      node.querySelectorAll?.('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    };
    scan(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches('[data-reveal]:not(.is-in)')) io.observe(n);
          scan(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
