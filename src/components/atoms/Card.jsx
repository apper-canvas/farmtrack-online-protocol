import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, children, hover = false, ...props }, ref) => {
  const baseClasses = "bg-surface rounded-xl shadow-md border border-gray-100/50";
  const hoverClasses = hover ? "hover:shadow-lg hover:scale-[1.02] cursor-pointer" : "";

  const CardComponent = hover ? motion.div : "div";
  const motionProps = hover ? {
    whileHover: { y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      ref={ref}
      className={cn(baseClasses, hoverClasses, "transition-all duration-200", className)}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
});

Card.displayName = "Card";

export default Card;