import { createContext, useContext, useEffect, useState } from "react";
import { addToWishlist, getWishlist, removeFromWishlist } from "../services/wishlist.js";
import { useAuth } from "./AuthContext.jsx";
import { useToast } from "./ToastContext.jsx";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadWishlist() {
    const response = await getWishlist();
    setItems(response.data);
  }

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    loadWishlist()
      .catch((err) =>
        showToast(err instanceof TypeError ? "You appear to be offline. Please try again." : err.message, "error")
      )
      .finally(() => setLoading(false));
  }, [user?.id]);

  const isInWishlist = (productId) => items.some((product) => product._id === productId);

  async function removeItem(productId) {
    try {
      await removeFromWishlist(productId);
      setItems((current) => current.filter((product) => product._id !== productId));
      showToast("Removed from wishlist");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function clearWishlist() {
    try {
      await Promise.all(items.map((product) => removeFromWishlist(product._id)));
      setItems([]);
      showToast("Wishlist cleared");
    } catch (err) {
      showToast(err.message, "error");
      loadWishlist().catch(() => {});
    }
  }

  async function toggleWishlist(productId) {
    if (isInWishlist(productId)) return removeItem(productId);
    try {
      await addToWishlist(productId);
      await loadWishlist();
      showToast("Added to wishlist");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <WishlistContext.Provider value={{ items, loading, isInWishlist, toggleWishlist, removeItem, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
