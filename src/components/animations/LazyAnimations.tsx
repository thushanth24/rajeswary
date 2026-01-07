import { lazy, Suspense, useState, useEffect } from "react";

// Lazy load heavy animation components
const RangoliPattern = lazy(() => 
  import("@/components/animations/RangoliPattern").then(m => ({ default: m.RangoliPattern }))
);
const FloatingElements = lazy(() => 
  import("@/components/animations/FloatingElements").then(m => ({ default: m.FloatingElements }))
);
const DiyaLamp = lazy(() => 
  import("@/components/animations/DiyaLamp").then(m => ({ default: m.DiyaLamp }))
);

// Load animations after initial paint
export function DeferredRangoliPattern() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;
  
  return (
    <Suspense fallback={null}>
      <RangoliPattern />
    </Suspense>
  );
}

export function DeferredFloatingElements() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;
  
  return (
    <Suspense fallback={null}>
      <FloatingElements />
    </Suspense>
  );
}

interface DeferredDiyaLampProps {
  size?: "sm" | "md" | "lg";
}

export function DeferredDiyaLamp({ size = "md" }: DeferredDiyaLampProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;
  
  return (
    <Suspense fallback={null}>
      <DiyaLamp size={size} />
    </Suspense>
  );
}
