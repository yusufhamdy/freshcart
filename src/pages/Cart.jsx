import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaLock, FaMinus, FaPlus, FaRegTrashAlt, FaShieldAlt, FaShoppingBag, FaShoppingCart, FaTag, FaTruck } from "react-icons/fa";
import Loader from "../components/Loader.jsx";
import { useCart } from "../context/CartContext.jsx";

const money = (value) => Number(value).toLocaleString("en-US");

export default function Cart() {
  const { cart, loading, updateCount, removeItem, clearCart, applyCoupon } = useCart();
  const [working, setWorking] = useState(false);
  const [leaving, setLeaving] = useState(null);
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");

  // Disables the buttons while a request is running
  async function run(action) {
    setWorking(true);
    await action();
    setWorking(false);
  }

  // Fades the item out before it is removed
  async function removeWithFade(id, action) {
    setLeaving(id);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await run(action);
    setLeaving(null);
  }

  async function handleCoupon(e) {
    e.preventDefault();
    if (!coupon.trim()) return;
    await run(() => applyCoupon(coupon.trim()));
  }

  const hasDiscount = cart.totalAfterDiscount != null && cart.totalAfterDiscount < cart.total;
  const finalTotal = hasDiscount ? cart.totalAfterDiscount : cart.total;
  const itemsText = `${cart.count} ${cart.count === 1 ? "item" : "items"}`;

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <p className="text-xs text-gray-500">
          <Link to="/">Home</Link> / <span className="font-medium text-gray-800">Shopping Cart</span>
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-xl text-white">
            <FaShoppingCart />
          </span>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
        {!loading && cart.count > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            You have <span className="font-semibold text-green-600">{itemsText}</span> in your cart
          </p>
        )}

        {loading ? (
          <Loader />
        ) : cart.count === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-700">Your cart is empty.</p>
            <Link to="/products" className="mt-4 inline-block rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div>
              <div className="space-y-4">
                {cart.products.map((item) => {
                  const { _id, title, imageCover, category, quantity } = item.product;
                  return (
                    <div key={item._id} className={`flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm transition-all duration-300 sm:flex-row ${leaving === item._id ? "scale-95 opacity-0" : ""}`}>
                      <div className="flex shrink-0 flex-col items-center gap-2">
                        <Link to={`/products/${_id}`} className="rounded-lg border border-gray-100 p-2">
                          <img src={imageCover} alt={title} className="h-24 w-24 object-contain" />
                        </Link>
                        <span className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-medium text-white">
                          <FaCheck /> {quantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col justify-between gap-3">
                        <div>
                          <Link to={`/products/${_id}`} className="font-semibold text-gray-900 hover:text-green-600">
                            {title}
                          </Link>
                          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-700">{category?.name}</span>
                            · SKU: {_id.slice(-6).toUpperCase()}
                          </p>
                          <p className="mt-2 text-lg font-bold text-green-600">
                            {money(item.price)} EGP <span className="text-xs font-normal text-gray-400">per unit</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-lg bg-gray-50 p-1">
                            <button
                              onClick={() => run(() => updateCount(_id, item.count - 1))}
                              disabled={working || item.count <= 1}
                              aria-label="Decrease quantity"
                              className="flex h-7 w-7 items-center justify-center rounded text-xs text-gray-600 disabled:opacity-40"
                            >
                              <FaMinus />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{item.count}</span>
                            <button
                              onClick={() => run(() => updateCount(_id, item.count + 1))}
                              disabled={working || item.count >= quantity}
                              aria-label="Increase quantity"
                              className="flex h-7 w-7 items-center justify-center rounded bg-green-600 text-xs text-white disabled:opacity-40"
                            >
                              <FaPlus />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <p className="text-right">
                              <span className="block text-[10px] text-gray-400">Total</span>
                              <span className="text-lg font-bold text-gray-900">{money(item.price * item.count)}</span>
                              <span className="text-xs text-gray-400"> EGP</span>
                            </p>
                            <button
                              onClick={() => removeWithFade(item._id, () => removeItem(_id))}
                              disabled={working}
                              aria-label="Remove item"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50"
                            >
                              <FaRegTrashAlt />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 text-sm">
                <Link to="/products" className="text-green-600 hover:underline">← Continue Shopping</Link>
                <button onClick={() => run(clearCart)} disabled={working} className="flex items-center gap-2 text-gray-500 hover:text-red-500">
                  <FaRegTrashAlt /> Clear all items
                </button>
              </div>
            </div>

            <aside className="h-fit overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="bg-gradient-to-r from-green-600 to-green-500 px-5 py-4 text-white">
                <p className="flex items-center gap-2 font-semibold"><FaShoppingBag /> Order Summary</p>
                <p className="mt-1 text-xs">{itemsText} in your cart</p>
              </div>
              <div className="space-y-4 p-5 text-sm">
                {cart.total >= 500 && (
                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600"><FaTruck /></span>
                    <div>
                      <p className="font-semibold text-green-700">Free Shipping!</p>
                      <p className="text-xs text-green-600">You qualify for free delivery</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{money(cart.total)} EGP</span></div>
                {hasDiscount && (
                  <div className="flex justify-between text-green-600"><span>Discount{cart.couponCode ? ` (${cart.couponCode})` : ""}</span><span>- {money(cart.total - cart.totalAfterDiscount)} EGP</span></div>
                )}
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-4 text-gray-600">
                  <span>Shipping</span><span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">{money(finalTotal)}<span className="text-xs font-normal text-gray-400"> EGP</span></span>
                </div>

                {couponOpen ? (
                  <form onSubmit={handleCoupon} className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Promo code"
                      className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-600"
                    />
                    <button type="submit" disabled={working} className="rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white disabled:opacity-60">Apply</button>
                  </form>
                ) : (
                  <button onClick={() => setCouponOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-2.5 text-gray-700 hover:border-green-600">
                    <FaTag /> Apply Promo Code
                  </button>
                )}

                <Link to="/checkout" className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700">
                  <FaLock /> Secure Checkout
                </Link>
                <p className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><FaShieldAlt className="text-green-600" /> Secure Payment</span>
                  <span className="flex items-center gap-1"><FaTruck className="text-blue-600" /> Fast Delivery</span>
                </p>
                <Link to="/products" className="block text-center text-xs text-green-600 hover:underline">← Continue Shopping</Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
