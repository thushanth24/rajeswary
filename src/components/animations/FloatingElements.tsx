import { useEffect, useState } from "react";

interface FloatingElement {
  id: number;
  left: number;
  delay: number;
  duration: number;
  type: "flower" | "diya" | "sparkle";
  size: number;
}

interface FloatingElementsProps {
  type?: "petals" | "diyas" | "mixed";
  density?: "low" | "medium" | "high";
}

export function FloatingElements({ type = "mixed", density = "medium" }: FloatingElementsProps) {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  const counts = { low: 8, medium: 15, high: 25 };

  useEffect(() => {
    const newElements: FloatingElement[] = [];
    const types: ("flower" | "diya" | "sparkle")[] = 
      type === "petals" ? ["flower", "flower", "sparkle"] :
      type === "diyas" ? ["diya", "sparkle", "diya"] :
      ["flower", "flower", "sparkle", "diya"];
    
    for (let i = 0; i < counts[density]; i++) {
      newElements.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 6,
        type: types[Math.floor(Math.random() * types.length)],
        size: 0.8 + Math.random() * 0.6,
      });
    }
    setElements(newElements);
  }, [type, density]);

  const getEmoji = (t: string) => {
    switch (t) {
      case "flower": return "🌸";
      case "diya": return "✨";
      case "sparkle": return "⭐";
      default: return "🌸";
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
      {elements.map((el) => (
        <div
          key={el.id}
          className={`absolute text-2xl ${el.type === "flower" ? "animate-flower-fall" : "animate-flower-fall-reverse"}`}
          style={{
            left: `${el.left}%`,
            animationDelay: `${el.delay}s`,
            animationDuration: `${el.duration}s`,
            fontSize: `${el.size}rem`,
            opacity: 0.7,
          }}
        >
          {getEmoji(el.type)}
        </div>
      ))}
    </div>
  );
}