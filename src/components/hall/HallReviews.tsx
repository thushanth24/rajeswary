import { useState } from "react";
import { Star, Quote, MessageSquare, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Review {
  id: string;
  customer_name: string;
  event_type?: string;
  event_date?: string;
  rating: number;
  review_text: string;
}

interface HallReviewsProps {
  reviews: Review[];
}

export const HallReviews = ({ reviews }: HallReviewsProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  if (reviews.length === 0) return null;

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div>
      {/* Section Header */}
      <motion.div 
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 via-secondary/20 to-primary/10 flex items-center justify-center shadow-md"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <MessageSquare className="h-6 w-6 text-secondary" />
        </motion.div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Customer Reviews
          </h2>
          <p className="text-sm text-muted-foreground">
            Verified experiences from our guests
          </p>
        </div>
      </motion.div>

      {/* Summary Card */}
      <motion.div 
        className="card-traditional p-6 mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Average Rating */}
          <motion.div 
            className="text-center md:text-left"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <motion.div 
              className="text-5xl font-bold text-foreground mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {averageRating.toFixed(1)}
            </motion.div>
            <div className="flex gap-1 mb-2 justify-center md:justify-start">
              {[1, 2, 3, 4, 5].map((star, index) => (
                <motion.div
                  key={star}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                >
                  <Star
                    className={`h-5 w-5 transition-colors ${
                      star <= Math.round(averageRating)
                        ? "fill-secondary text-secondary"
                        : "text-border fill-border"
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              Based on {reviews.length} verified review{reviews.length !== 1 ? "s" : ""}
            </p>
          </motion.div>

          {/* Divider */}
          <div className="hidden md:block h-24 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

          {/* Rating Distribution with Animation */}
          <div className="flex-1 w-full md:w-auto space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }, index) => (
              <motion.div 
                key={rating} 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <span className="text-sm text-muted-foreground w-4">{rating}</span>
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-secondary to-secondary/70 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Reviews Carousel */}
      <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
        <CarouselContent className="-ml-4">
          {reviews.map((review, index) => (
            <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
              <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <motion.div
                  className="group relative bg-card border border-border/50 rounded-2xl p-6 h-full hover:shadow-xl hover:border-secondary/30 transition-all duration-500 overflow-hidden"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Background Decoration */}
                  <motion.div 
                    className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-secondary/10 to-transparent rounded-bl-full"
                    animate={{ 
                      scale: hoveredIndex === index ? 1.2 : 1,
                      opacity: hoveredIndex === index ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Animated Quote Icon */}
                  <motion.div 
                    className="absolute top-4 right-4"
                    animate={{ 
                      rotate: hoveredIndex === index ? 10 : 0,
                      scale: hoveredIndex === index ? 1.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Quote className="h-12 w-12 text-secondary/20" />
                  </motion.div>
                  
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4 relative z-10">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/40 via-secondary/20 to-primary/20 flex items-center justify-center shrink-0 shadow-inner"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="text-lg font-bold text-primary">
                        {review.customer_name.charAt(0).toUpperCase()}
                      </span>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">
                        {review.customer_name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5 flex-wrap">
                        {review.event_type && (
                          <motion.span 
                            className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-xs font-medium"
                            whileHover={{ scale: 1.05 }}
                          >
                            {review.event_type}
                          </motion.span>
                        )}
                        {review.event_date && (
                          <span>{format(new Date(review.event_date), "MMM yyyy")}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Animated Stars */}
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star, starIndex) => (
                      <motion.div
                        key={star}
                        whileHover={{ scale: 1.3, rotate: 15 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Star
                          className={`h-4 w-4 transition-all ${
                            star <= review.rating
                              ? "fill-secondary text-secondary"
                              : "text-border fill-border"
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <motion.p 
                    className={`text-muted-foreground text-sm leading-relaxed relative z-10 ${
                      expandedReview === review.id ? "" : "line-clamp-4"
                    }`}
                  >
                    "{review.review_text}"
                  </motion.p>

                  {review.review_text.length > 200 && (
                    <motion.button
                      className="text-primary text-sm font-medium mt-2"
                      onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {expandedReview === review.id ? "Show less" : "Read more"}
                    </motion.button>
                  )}

                  {/* Verified Badge */}
                  <motion.div 
                    className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </motion.div>
                    <span>Verified booking</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-6">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>

      {reviews.length > 4 && (
        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-muted-foreground text-sm bg-muted/50 inline-block px-4 py-2 rounded-full">
            Showing all {reviews.length} reviews • Swipe to explore
          </p>
        </motion.div>
      )}
    </div>
  );
};
