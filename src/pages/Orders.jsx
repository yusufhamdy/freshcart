import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaCreditCard,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaShoppingBag,
  FaTruck,
} from "react-icons/fa";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getUserOrders } from "../services/orders.js";

const money = (value) => Number(value).toLocaleString("en-US");

function getStatus(order) {
  if (order.isDelivered) return { label: "Delivered", icon: FaCheckCircle, color: "bg-green-100 text-green-700" };
  if (order.isPaid) return { label: "On the way", icon: FaTruck, color: "bg-sky-100 text-sky-700" };
  return { label: "Processing", icon: FaClock, color: "bg-amber-100 text-amber-700" };
}

export default function Orders() {
  const { user } = useAuth();
  const { reloadCart } = useCart();
  const { pathname } = useLocation();
  const [orders, setOrders] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // After an online payment the API sends the user to /allorders
  useEffect(() => {
    if (pathname === "/allorders") reloadCart();
  }, [pathname]);

  useEffect(() => {
    getUserOrders(user.id)
      .then((response) => {
        const list = Array.isArray(response) ? response : response.data || [];
        const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
        if (sorted.length > 0) setOpenId(sorted[0]._id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <p className="text-xs text-gray-500">
          <Link to="/">Home</Link> / <span className="font-medium text-gray-800">My Orders</span>
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-xl text-white"><FaShoppingBag /></span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-xs text-gray-500">Track and manage your {orders.length} {orders.length === 1 ? "order" : "orders"}</p>
            </div>
          </div>
          <Link to="/products" className="text-sm text-green-600 hover:underline">Continue Shopping</Link>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-700">You have no orders yet.</p>
            <Link to="/products" className="mt-4 inline-block rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => {
              const status = getStatus(order);
              const StatusIcon = status.icon;
              const open = openId === order._id;
              const firstItem = order.cartItems[0];
              const itemCount = order.cartItems.reduce((sum, item) => sum + item.count, 0);
              const subtotal = order.cartItems.reduce((sum, item) => sum + item.price * item.count, 0);
              const PaymentIcon = order.paymentMethodType === "card" ? FaCreditCard : FaMoneyBillWave;

              return (
                <div key={order._id} className={`overflow-hidden rounded-xl bg-white shadow-sm ${open ? "ring-1 ring-green-200" : ""}`}>
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                    <div className="relative shrink-0">
                      <div className="rounded-xl border border-gray-100 p-2">
                        <img src={firstItem?.product?.imageCover} alt="" className="h-20 w-20 object-contain" />
                      </div>
                      {order.cartItems.length > 1 && (
                        <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                          +{order.cartItems.length - 1}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                            <StatusIcon /> {status.label}
                          </span>
                          <p className="mt-2 text-lg font-bold text-gray-900"># {order.id}</p>
                        </div>
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${order.paymentMethodType === "card" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"}`}>
                          <PaymentIcon />
                        </span>
                      </div>
                      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                        <span className="flex items-center gap-1"><FaMapMarkerAlt /> {order.shippingAddress?.city}</span>
                      </p>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold text-gray-900">{money(order.totalOrderPrice)}<span className="text-xs font-normal text-gray-400"> EGP</span></p>
                        <button
                          onClick={() => setOpenId(open ? null : order._id)}
                          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold ${open ? "bg-green-600 text-white" : "border border-gray-200 text-gray-700"}`}
                        >
                          {open ? "Hide" : "Details"} {open ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {open && (
                    <div className="animate-fade-in border-t border-gray-100 bg-slate-50/60 p-5">
                      <p className="mb-3 text-sm font-semibold text-gray-800">Order Items</p>
                      <div className="space-y-2">
                        {order.cartItems.map((item) => (
                          <div key={item._id} className="flex items-center gap-3 rounded-lg bg-white p-3">
                            <img src={item.product?.imageCover} alt="" className="h-12 w-12 rounded object-contain" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900">{item.product?.title}</p>
                              <p className="text-xs text-gray-500">{item.count} × {money(item.price)} EGP</p>
                            </div>
                            <p className="font-bold text-gray-900">{money(item.price * item.count)}<span className="text-xs font-normal text-gray-400"> EGP</span></p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg bg-white p-4 text-sm">
                          <p className="mb-2 flex items-center gap-2 font-semibold text-gray-800"><FaMapMarkerAlt className="text-blue-500" /> Delivery Address</p>
                          <p className="font-medium text-gray-900">{order.shippingAddress?.city}</p>
                          <p className="text-xs text-gray-500">{order.shippingAddress?.details}</p>
                          <p className="mt-2 flex items-center gap-2 text-xs text-gray-500"><FaPhoneAlt /> {order.shippingAddress?.phone}</p>
                        </div>
                        <div className="rounded-lg bg-amber-100 p-4 text-sm text-gray-700">
                          <p className="mb-2 font-semibold text-gray-800">Order Summary</p>
                          <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)} EGP</span></div>
                          <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice > 0 ? `${money(order.shippingPrice)} EGP` : "Free"}</span></div>
                          {order.taxPrice > 0 && <div className="flex justify-between"><span>Tax</span><span>{money(order.taxPrice)} EGP</span></div>}
                          <div className="mt-2 flex justify-between border-t border-amber-200 pt-2 font-bold text-gray-900">
                            <span>Total</span><span>{money(order.totalOrderPrice)} EGP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
