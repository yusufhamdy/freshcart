import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Every new page opens from its top
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
