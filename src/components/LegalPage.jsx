import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

// A policy page: a notice, numbered articles and a link to the other policy
export default function LegalPage({ title, updated, notice, articles, other }) {
  return (
    <>
      <section className="bg-gradient-to-r from-green-500 to-green-400 text-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-xs">
            <Link to="/">Home</Link> / <span className="font-medium">{title}</span>
          </p>
          <h1 className="mt-4 text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-sm">Last updated: {updated}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
        <div className="rounded-xl border-l-4 border-green-600 bg-green-50 p-6">
          <h2 className="text-lg font-bold text-gray-900">{notice.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{notice.text}</p>
        </div>

        {articles.map((article, index) => (
          <section key={article.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-600">Article {index + 1}</p>
            <h2 className="mt-1 text-xl font-bold text-gray-900">{article.title}</h2>

            {article.items && (
              <ul className="mt-4 space-y-3">
                {article.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-3 text-sm text-gray-600">
                    <span className="mt-0.5 h-fit shrink-0 rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      {index + 1}.{itemIndex + 1}
                    </span>
                    <span>
                      {item.label && <b className="text-gray-900">{item.label} </b>}
                      {item.text || item}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {article.text && (
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {article.text}{" "}
                {article.email && (
                  <a href={`mailto:${article.email}`} className="font-medium text-green-600 hover:underline">
                    {article.email}
                  </a>
                )}
              </p>
            )}
          </section>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link to="/" className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-green-600">
            Back to Home
          </Link>
          <Link to={other.to} className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700">
            {other.label} <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </>
  );
}
