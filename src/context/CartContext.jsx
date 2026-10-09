import { createContext, useContext, useEffect, useState } from "react";
import * as cartService from "../services/cart.js";
import { useAuth } from "./AuthContext.jsx";
import { useToast } from "./ToastContext.jsx";

const CartContext = createContext(null);

const emptyCart = { cartId: null, count: 0, products: [], total: 0, totalAfterDiscount: null };

// Converts an API response into the cart shape used by the pages
function toCart(response) {
  return {
    cartId: response.cartId,
    count: response.numOfCartItems,
    products: response.data.products,
    total: response.data.totalCartPrice,
    totalAfterDiscount: response.data.totalAfterDiscount ?? null,
  };
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setCart(emptyCart);
      return;
    }
    setLoading(true);
    cartService
      .getCart()
      .then((response) => setCart(toCart(response)))
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Runs a cart request, stores the returned cart and shows a message
  async function run(action, message) {
    try {
      const response = await action();
      setCart(toCart(response));
      if (message) showToast(message);
      return response;
    } catch (err) {
      showToast(err.message, "error");
      return null;
    }
  }

  async function addToCart(productId, quantity = 1) {
    const response = await run(() => cartService.addCartItem(productId));
    if (!response) return false;

    if (quantity > 1) {
      const item = response.data.products.find((entry) => entry.product._id === productId);
      await run(() => cartService.updateCartItem(productId, item.count + quantity - 1));
    }
    showToast("Added to cart");
    return true;
  }

  const updateCount = (productId, count) =>
    run(() => cartService.updateCartItem(productId, count));

  const removeItem = (productId) =>
    run(() => cartService.removeCartItem(productId), "Item removed from cart");

  const clearCart = () => run(() => cartService.clearCart(), "Cart cleared");

  // The API is the single source of truth for coupons. A discount is only ever
  // shown when the API accepts the code; otherwise its own error is surfaced.
  async function applyCoupon(code) {
    try {
      await cartService.applyCoupon(code);
      setCart(toCart(await cartService.getCart()));
      showToast("Coupon applied");
      return true;
    } catch (err) {
      showToast(err.message, "error");
      return false;
    }
  }

  async function reloadCart() {
    try {
      setCart(toCart(await cartService.getCart()));
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateCount, removeItem, clearCart, applyCoupon, reloadCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
