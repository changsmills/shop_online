// src/components/LazySection.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function LazySection({ children, height = "300px" }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Ikishaonekana, acha kusikiliza
        }
      },
      { rootMargin: "200px" } // Inaanza kupakia 200px kabla ya kufika kabisa
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div ref={sectionRef} style={{ minHeight: isVisible ? 'auto' : height }}>
      {isVisible ? children : null}
    </div>
  );
}