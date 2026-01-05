import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "2009",
    title: "The Beginning",
    description: "Started with a single mandapam and a vision to create perfect wedding celebrations.",
    icon: "🪔",
  },
  {
    year: "2012",
    title: "Grand Ballroom Opens",
    description: "Expanded with our flagship venue, accommodating up to 1000 guests in royal elegance.",
    icon: "🏛️",
  },
  {
    year: "2015",
    title: "Complete Services Launch",
    description: "Introduced catering, decoration, and photography services under one roof.",
    icon: "✨",
  },
  {
    year: "2018",
    title: "500+ Weddings Milestone",
    description: "Celebrated hosting over 500 blessed unions with our growing family of happy couples.",
    icon: "💑",
  },
  {
    year: "2022",
    title: "Modern Renovations",
    description: "Upgraded all venues with state-of-the-art facilities while preserving traditional charm.",
    icon: "🎊",
  },
  {
    year: "2024",
    title: "Excellence Award",
    description: "Recognized as the region's premier wedding destination with multiple industry awards.",
    icon: "🏆",
  },
];

export const Timeline = () => {
  return (
    <div className="relative">
      {/* Center Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-primary to-secondary transform -translate-x-1/2 hidden md:block" />
      
      {/* Mobile Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-primary to-secondary md:hidden" />

      <div className="space-y-8 md:space-y-12">
        {timelineEvents.map((event, index) => (
          <TimelineItem key={event.year} event={event} index={index} />
        ))}
      </div>
    </div>
  );
};

const TimelineItem = ({ event, index }: { event: TimelineEvent; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`relative flex items-center ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      } flex-row`}
    >
      {/* Content Card */}
      <div className={`flex-1 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"} pl-16 md:pl-0`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 relative group"
        >
          {/* Gradient border on hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-primary rounded-2xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500" />
          
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary text-sm font-bold rounded-full mb-3">
              {event.year}
            </span>
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">{event.title}</h3>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
        </motion.div>
      </div>

      {/* Center Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
        className="absolute left-6 md:left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center shadow-lg shadow-secondary/30">
          <span className="text-xl">{event.icon}</span>
        </div>
      </motion.div>

      {/* Spacer for desktop */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
};
