"use client";

import React, { useRef, useEffect, useState } from "react";

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number; // Define the delay prop
}

const FadeInSection: React.FC<FadeInSectionProps> = ({
  children,
  delay = 0, // Default value for delay
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            const currentRef = domRef.current;
            if (currentRef) {
              observer.unobserve(currentRef);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }} // Use the delay here
      className={`transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"}
      `}
    >
      {children}
    </div>
  );
};

export default FadeInSection;