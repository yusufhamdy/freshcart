import { useEffect, useRef, useState } from "react";

// An image that fades in once it has loaded
export default function FadeImage({ className = "", ...props }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      onLoad={() => setLoaded(true)}
      className={`${className} ${loaded ? "opacity-100" : "opacity-0"}`}
      {...props}
    />
  );
}
