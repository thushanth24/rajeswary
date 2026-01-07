import { useEffect, useState, useRef } from "react";

export function useLazyLoad(options: IntersectionObserverInit = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px", threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

export function useIdleCallback(callback: () => void, delay = 0) {
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => callback(), { timeout: delay + 1000 });
      return () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(callback, delay);
      return () => clearTimeout(id);
    }
  }, [callback, delay]);
}
