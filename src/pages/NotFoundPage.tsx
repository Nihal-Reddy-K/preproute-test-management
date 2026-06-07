import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>

        <p className="mt-4 text-slate-500">Page Not Found</p>

        <Link
          to="/dashboard"
          className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
