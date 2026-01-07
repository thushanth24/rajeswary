import { useRef, useState, useEffect } from "react";

interface LazyVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  poster?: string;
}

export function LazyVideo({
  src,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  poster,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && videoRef.current && autoPlay) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked
      });
    }
  }, [isVisible, isLoaded, autoPlay]);

  return (
    <div ref={containerRef} className={className}>
      {isVisible && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          poster={poster}
          preload="none"
          onLoadedData={() => setIsLoaded(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
