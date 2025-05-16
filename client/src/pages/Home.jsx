import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-5xl font-bold mb-6">🧠 FocusFlow</h1>
      <p className="text-lg mb-6 text-gray-700 text-center max-w-xl">
        Organize your thoughts, manage your focus, and take notes like a pro.
        Simple, clean, and efficient.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
