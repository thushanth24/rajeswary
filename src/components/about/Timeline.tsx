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
    year: "October 2012",
    title: "Raajeshwariy Wedding Hall Kondavil",
    description: "Our journey began with the opening of Raajeshwariy Wedding Hall in Kondavil on October 20, 2012.",
    icon: "🏛️",
  },
  {
    year: "October 2012",
    title: "Chelva Mahal",
    description: "Just a week later, Chelva Mahal opened its doors on October 27, 2012, expanding our presence.",
    icon: "👑",
  },
  {
    year: "September 2013",
    title: "Karpaka Raajeshwariy Wedding Hall",
    description: "Karpaka Raajeshwariy Wedding Hall in Urumpirai was inaugurated on September 7, 2013.",
    icon: "✨",
  },
  {
    year: "June 2016",
    title: "Raajeshwariy Wedding Hall Tellipalai",
    description: "Our fourth venue opened in Tellipalai on June 22, 2016, bringing elegance to the north.",
    icon: "🎊",
  },
  {
    year: "May 2017",
    title: "Chelva Palace",
    description: "The majestic Chelva Palace was unveiled on May 27, 2017, our flagship grand venue.",
    icon: "🏰",
  },
  {
    year: "November 2017",
    title: "Heritage Bungalow",
    description: "Heritage Bungalow joined our family on November 23, 2017, offering intimate celebrations.",
    icon: "🏡",
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
