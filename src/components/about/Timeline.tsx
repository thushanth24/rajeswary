import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: "October 2012",
    title: "Raajeshwariy Wedding Hall Kondavil",
    description: "Our journey began with the opening of Raajeshwariy Wedding Hall in Kondavil on October 20, 2012.",
  },
  {
    year: "October 2012",
    title: "Chelva Mahal",
    description: "Just a week later, Chelva Mahal opened its doors on October 27, 2012, expanding our presence.",
  },
  {
    year: "September 2013",
    title: "Karpaka Raajeshwariy Wedding Hall",
    description: "Karpaka Raajeshwariy Wedding Hall in Urumpirai was inaugurated on September 7, 2013.",
  },
  {
    year: "June 2016",
    title: "Raajeshwariy Wedding Hall Tellipalai",
    description: "Our fourth venue opened in Tellipalai on June 22, 2016, bringing elegance to the north.",
  },
  {
    year: "May 2017",
    title: "Chelva Palace",
    description: "The majestic Chelva Palace was unveiled on May 27, 2017, our flagship grand venue.",
  },
  {
    year: "November 2017",
    title: "Heritage Bungalow",
    description: "Heritage Bungalow joined our family on November 23, 2017, offering intimate celebrations.",
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
  const variant = index % 3;
  const accent =
    variant === 0
      ? "from-secondary/25 via-primary/10 to-transparent"
      : variant === 1
      ? "from-accent/25 via-secondary/10 to-transparent"
      : "from-primary/25 via-accent/10 to-transparent";
  const badge =
    variant === 0
      ? "bg-secondary/20 text-secondary border-secondary/30"
      : variant === 1
      ? "bg-accent/20 text-accent border-accent/30"
      : "bg-primary/20 text-primary border-primary/30";
  const ring =
    variant === 0
      ? "ring-secondary/30"
      : variant === 1
      ? "ring-accent/30"
      : "ring-primary/30";
  const ribbon =
    variant === 0
      ? "bg-gradient-to-r from-secondary/20 to-transparent"
      : variant === 1
      ? "bg-gradient-to-r from-accent/20 to-transparent"
      : "bg-gradient-to-r from-primary/20 to-transparent";

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
      <div className={`flex-1 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"} pl-10 md:pl-0`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`bg-card/80 backdrop-blur-xl border border-primary/20 p-6 relative group shadow-lg shadow-primary/10 overflow-hidden ${
            isEven ? "rounded-2xl rounded-tr-[2.5rem]" : "rounded-2xl rounded-tl-[2.5rem]"
          }`}
        >
          <div className={`absolute inset-0 ${isEven ? "rounded-tr-[2.5rem]" : "rounded-tl-[2.5rem]"} bg-gradient-to-br ${accent} opacity-60`} />
          <div className={`absolute top-0 ${isEven ? "right-0" : "left-0"} h-12 w-52 ${ribbon}`} />
          <div
            className={`absolute top-0 ${isEven ? "right-0" : "left-0"} h-12 w-12 ${
              isEven
                ? "bg-card/80 border-l border-b border-border/50 rounded-bl-xl"
                : "bg-card/80 border-r border-b border-border/50 rounded-br-xl"
            }`}
          />
          {/* Gradient border on hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-primary rounded-2xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-bold rounded-full mb-3 border ${badge}`}>
              <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full bg-card/80 ring-1 ${ring}`}>
                {index + 1}
              </span>
              {event.year}
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">{event.title}</h3>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
        </motion.div>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
};

