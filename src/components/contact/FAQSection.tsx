import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I book a hall for my wedding?",
    answer: "You can book a hall by visiting our Booking page, selecting your preferred hall and date, and filling out the booking form. Alternatively, you can contact us directly by phone or WhatsApp, and our team will assist you with the booking process.",
  },
  {
    question: "What is the booking advance amount?",
    answer: "We require a 25% advance payment to confirm your booking. The remaining balance can be paid in installments or before the event date as per our flexible payment plans.",
  },
  {
    question: "Can I visit the halls before booking?",
    answer: "Absolutely! We encourage all couples to visit our mandapams before making a decision. You can schedule a visit by contacting us, and we'll arrange a guided tour of your preferred venues.",
  },
  {
    question: "Do you provide catering services?",
    answer: "Yes, we offer comprehensive catering services with multi-cuisine options. From traditional Tamil vegetarian meals to international cuisines, our expert chefs can customize menus to your preferences.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "Cancellations made 60 days before the event receive a full refund minus processing fees. Cancellations within 30-60 days receive 50% refund. Unfortunately, cancellations within 30 days are non-refundable, but we can help reschedule to another available date.",
  },
  {
    question: "Do you offer decoration services?",
    answer: "Yes! We have an in-house decoration team that specializes in traditional and contemporary themes. From mandap decoration to entrance setups, we handle everything to create your dream celebration.",
  },
  {
    question: "Is parking available at your venues?",
    answer: "All our venues have ample parking space. The Grand Ballroom accommodates 200+ vehicles, while other halls have parking for 50-100 vehicles. Valet parking can be arranged on request.",
  },
  {
    question: "Can I bring my own vendors?",
    answer: "Yes, you're welcome to bring your own photographers, decorators, or other vendors. However, we do have preferred vendor partnerships that offer special rates for our clients.",
  },
];

export const FAQSection = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <AccordionItem
              value={`item-${index}`}
              className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl px-6 overflow-hidden data-[state=open]:bg-card/70"
            >
              <AccordionTrigger className="text-left font-serif font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                <span className="flex items-center gap-3">
                  <span className="text-secondary">✦</span>
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  );
};
