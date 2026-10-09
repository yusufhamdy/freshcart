import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { getCategories } from "../services/catalog.js";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  const [categories, setCategories] = useState([]);
  const { pathname } = useLocation();

  // The Navbar menu and the Footer links share the same categories
  useEffect(() => {
    getCategories()
      .then((response) => setCategories(response.data))
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={categories} />
      <main key={pathname} className="flex-1 animate-fade-in">
        <Outlet />
      </main>
      <Footer categories={categories} />
    </div>
  );
}
