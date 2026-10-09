import { useEffect, useRef, useState } from "react";

const hiddenClasses = {
  left: "-translate-x-24 opacity-0",
  right: "translate-x-24 opacity-0",
  up: "translate-y-8 opacity-0",
};

// Slides its content in from the left, right or bottom when it enters the screen
export default function Reveal({ from = "left", children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-x-0 translate-y-0 opacity-100" : hiddenClasses[from]
      }`}
    >
      {children}
    </div>
  );
}
