import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBookmark,
  FaCcMastercard,
  FaCcVisa,
  FaCheck,
  FaCreditCard,
  FaHome,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaPlus,
  FaReceipt,
  FaShieldAlt,
  FaShoppingBag,
} from "react-icons/fa";
import AddressFields from "../components/AddressFields.jsx";
import Loader from "../components/Loader.jsx";
import { primaryButtonClass } from "../components/formStyles.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { getAddresses } from "../services/addresses.js";
import { createCashOrder, createCheckoutSession } from "../services/orders.js";
import { validateAddress } from "../utils/validation.js";

const money = (value) => Number(value).toLocaleString("en-US");
const sectionHeader = "bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 text-white";

export default function Checkout() {
  const { cart, loading, reloadCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState("new");
  const [form, setForm] = useState({ city: "", details: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState("cash");
  const [placing, setPlacing] = useState(false);

  // Mirrors the cart page: only a discount the API actually returned is shown
  const hasDiscount = cart.totalAfterDiscount != null && cart.totalAfterDiscount < cart.total;
  const finalTotal = hasDiscount ? cart.totalAfterDiscount : cart.total;

  useEffect(() => {
    getAddresses()
      .then((response) => {
        setAddresses(response.data);
        if (response.data.length > 0) setSelected(response.data[0]._id);
      })
      .catch(() => {});
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePlaceOrder() {
    let shippingAddress;
    if (selected === "new") {
      const found = validateAddress(form);
      setErrors(found);
      if (Object.keys(found).length > 0) return;
      shippingAddress = { details: form.details.trim(), phone: form.phone, city: form.city.trim() };
    } else {
      const saved = addresses.find((address) => address._id === selected);
      shippingAddress = { details: saved.details, phone: saved.phone, city: saved.city };
    }

    setPlacing(true);
    try {
      if (payment === "cash") {
        await createCashOrder(cart.cartId, shippingAddress);
        await reloadCart();
        showToast("Your order was placed");
        navigate("/orders");
      } else {
        const response = await createCheckoutSession(cart.cartId, shippingAddress);
        window.location.href = response.session.url;
      }
    } catch (err) {
      showToast(err.message, "error");
      setPlacing(false);
    }
  }

  if (loading) return <Loader />;

  if (cart.count === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg text-gray-700">Your cart is empty.</p>
        <Link to="/products" className="mt-4 inline-block rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  const paymentOption = (id, title, text, icon) => (
    <button
      type="button"
      onClick={() => setPayment(id)}
      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left ${
        payment === id ? "border-green-500 bg-slate-50" : "border-gray-200"
      }`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg ${payment === id ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"}`}>
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-gray-900">{title}</span>
        <span className="block text-xs text-gray-500">{text}</span>
        {id === "online" && (
          <span className="mt-1 flex gap-1 text-2xl text-gray-500"><FaCcVisa /><FaCcMastercard /></span>
        )}
      </span>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${payment === id ? "border-green-600 bg-green-600 text-white" : "border-gray-300"}`}>
        {payment === id && <FaCheck />}
      </span>
    </button>
  );

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <p className="text-xs text-gray-500">
          <Link to="/">Home</Link> / <Link to="/cart">Cart</Link> / <span className="font-medium text-gray-800">Checkout</span>
        </p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-xl text-white"><FaReceipt /></span>
              <h1 className="text-3xl font-bold text-gray-900">Complete Your Order</h1>
            </div>
            <p className="mt-2 text-sm text-gray-600">Review your items and complete your purchase</p>
          </div>
          <Link to="/cart" className="text-sm text-green-600 hover:underline">← Back to Cart</Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className={sectionHeader}>
                <p className="flex items-center gap-2 font-semibold"><FaHome /> Shipping Address</p>
                <p className="mt-1 text-xs">Where should we deliver your order?</p>
              </div>
              <div className="space-y-4 p-6">
                {addresses.length > 0 && (
                  <>
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-gray-800"><FaBookmark className="text-green-600" /> Saved Addresses</p>
                      <p className="text-xs text-gray-500">Select a saved address or enter a new one below</p>
                    </div>
                    {addresses.map((address) => (
                      <button
                        key={address._id}
                        type="button"
                        onClick={() => setSelected(address._id)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left ${selected === address._id ? "border-green-500 bg-green-50" : "border-gray-200"}`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500"><FaMapMarkerAlt /></span>
                        <span className="text-sm">
                          <span className="block font-semibold text-gray-900">{address.name}</span>
                          <span className="block text-gray-600">{address.details}</span>
                          <span className="mt-1 flex gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><FaPhoneAlt /> {address.phone}</span>
                            <span>{address.city}</span>
                          </span>
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelected("new")}
                      className={`flex w-full items-center gap-3 rounded-xl border-2 border-dashed p-4 text-left ${selected === "new" ? "border-green-500 bg-green-50" : "border-gray-300"}`}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500 text-white"><FaPlus /></span>
                      <span className="text-sm">
                        <span className="block font-semibold text-green-700">Use a different address</span>
                        <span className="block text-xs text-gray-500">Enter a new shipping address manually</span>
                      </span>
                    </button>
                  </>
                )}

                {selected === "new" && (
                  <>
                    <div className="rounded-lg bg-green-50 p-3 text-xs">
                      <p className="font-semibold text-blue-700">Delivery Information</p>
                      <p className="text-blue-600">Please ensure your address is accurate for smooth delivery</p>
                    </div>
                    <AddressFields values={form} errors={errors} onChange={handleChange} />
                  </>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className={sectionHeader}>
                <p className="flex items-center gap-2 font-semibold"><FaCreditCard /> Payment Method</p>
                <p className="mt-1 text-xs">Choose how you'd like to pay</p>
              </div>
              <div className="space-y-3 p-6">
                {paymentOption("cash", "Cash on Delivery", "Pay when your order arrives at your doorstep", <FaMoneyBillWave />)}
                {paymentOption("online", "Pay Online", "Secure payment with Credit/Debit Card via Stripe", <FaCreditCard />)}
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-xs">
                  <FaShieldAlt className="text-green-600" />
                  <div>
                    <p className="font-semibold text-green-700">Secure & Encrypted</p>
                    <p className="text-green-600">Your payment info is protected with 256-bit SSL encryption</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit overflow-hidden rounded-xl bg-white shadow-sm lg:sticky lg:top-24">
            <div className={sectionHeader}>
              <p className="flex items-center gap-2 font-semibold"><FaShoppingBag /> Order Summary</p>
              <p className="mt-1 text-xs">{cart.count} {cart.count === 1 ? "item" : "items"}</p>
            </div>
            <div className="p-5 text-sm">
              <div className="max-h-56 space-y-3 overflow-y-auto">
                {cart.products.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-2">
                    <img src={item.product.imageCover} alt="" className="h-10 w-10 rounded object-contain" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-800">{item.product.title}</p>
                      <p className="text-xs text-gray-500">{item.count} × {money(item.price)} EGP</p>
                    </div>
                    <span className="font-bold text-gray-900">{money(item.price * item.count)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-gray-600">
                <div className="flex justify-between"><span>Subtotal</span><span>{money(cart.total)} EGP</span></div>
                {hasDiscount && (
                  <div className="flex justify-between text-green-600"><span>Discount</span><span>− {money(cart.total - cart.totalAfterDiscount)} EGP</span></div>
                )}
                <div className="flex justify-between"><span>Shipping & tax</span><span className="text-xs text-gray-400">Added when you order</span></div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">{money(finalTotal)}<span className="text-xs font-normal text-gray-400"> EGP</span></span>
                </div>
              </div>
              <button onClick={handlePlaceOrder} disabled={placing} className={`${primaryButtonClass} mt-5`}>
                <FaShoppingBag /> {placing ? "Placing order..." : "Place Order"}
              </button>
              <p className="mt-3 text-center text-xs text-gray-400">Your total is confirmed on the order page</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
