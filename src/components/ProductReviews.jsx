import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { addReview, deleteReview, getReviews, updateReview } from "../services/products.js";
import { primaryButtonClass } from "./formStyles.js";
import { Stars } from "./Rating.jsx";

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1 text-xl">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} stars`}
          className={n <= value ? "text-yellow-400" : "text-gray-300"}
        >
          <FaStar />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, onChange }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ rating: 0, review: "" });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function loadReviews() {
    try {
      const response = await getReviews(productId);
      setReviews(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const isOwner = (review) => user && review.user?._id === user.id;
  const myReview = reviews.find(isOwner);

  const total = reviews.length;
  const average = total ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : 0;
  const percentOf = (star) =>
    total ? Math.round((reviews.filter((review) => review.rating === star).length / total) * 100) : 0;

  // Runs a review request, then reloads the list and the product rating
  async function run(action) {
    setSaving(true);
    setError("");
    try {
      await action();
      await loadReviews();
      onChange();
      setEditingId(null);
      setForm({ rating: 0, review: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.rating) return setError("Please choose a rating");
    if (!form.review.trim()) return setError("Please write your review");

    const body = { review: form.review.trim(), rating: form.rating };
    run(() => (editingId ? updateReview(editingId, body) : addReview(productId, body)));
  }

  function startEdit(review) {
    setEditingId(review._id);
    setForm({ rating: review.rating, review: review.review });
    setError("");
  }

  function handleDelete(review) {
    if (window.confirm("Delete your review?")) run(() => deleteReview(review._id));
  }

  const showForm = user && (!myReview || editingId);

  return (
    <div>
      {total > 0 && (
        <div className="mb-6 grid gap-6 rounded-lg bg-slate-50 p-5 md:grid-cols-[200px_1fr]">
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-900">{average.toFixed(1)}</p>
            <div className="mt-2 flex justify-center text-sm">
              <Stars value={average} />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Based on {total} {total === 1 ? "review" : "reviews"}
            </p>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3 text-xs text-gray-600">
                <span className="w-10">{star} star</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${percentOf(star)}%` }} />
                </div>
                <span className="w-9 text-right">{percentOf(star)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-800">
            {editingId ? "Edit your review" : "Write a review"}
          </p>
          <StarPicker value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
          <textarea
            value={form.review}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
            rows={3}
            placeholder="Share your experience with this product"
            className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:border-green-600"
          />
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={`${primaryButtonClass} sm:w-auto sm:px-6`}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Submit review"}
            </button>
            {editingId && (
              <button type="button" onClick={() => setEditingId(null)} className="text-sm text-gray-500">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {!user && (
        <p className="mb-6 text-sm text-gray-600">
          <Link to="/login" className="font-medium text-green-600 hover:underline">
            Sign in
          </Link>{" "}
          to write a review.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {reviews.map((review) => (
            <li key={review._id} className="py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">{review.user?.name}</p>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-1 text-xs">
                <Stars value={review.rating} />
              </div>
              <p className="mt-2 text-sm text-gray-600">{review.review}</p>
              {isOwner(review) && (
                <div className="mt-2 flex gap-4 text-xs">
                  <button onClick={() => startEdit(review)} className="text-green-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(review)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
