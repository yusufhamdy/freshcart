import { Link } from "react-router-dom";

export default function NotFound({ message = "This page does not exist." }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 text-center">
      <h1 className="text-5xl font-bold text-gray-800">404</h1>
      <p className="mt-2 text-gray-500">{message}</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700"
      >
        Back to Home
      </Link>
    </section>
  );
}
