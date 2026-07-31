import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Curious Paisley – Admin</h1>
      <p className="text-gray-600 mb-6">
        Manage topics and Shahmaran content. Connect Supabase in .env.local to load data.
      </p>
      <nav className="flex gap-4">
        <Link
          href="/topics"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Topics
        </Link>
      </nav>
    </main>
  );
}
