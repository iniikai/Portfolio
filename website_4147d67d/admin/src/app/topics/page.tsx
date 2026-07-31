import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export default async function TopicsPage() {
  const topics: { id: string; slug: string; order_index: number; created_at: string }[] = [];
  let error: string | null = null;

  if (supabaseAdmin) {
    const { data, error: e } = await supabaseAdmin
      .from("topics")
      .select("id, slug, order_index, created_at")
      .order("order_index");
    if (e) error = e.message;
    else if (data) topics.push(...data);
  } else {
    error = "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local";
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/"
          className="text-indigo-600 hover:underline"
        >
          ← Admin home
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Topics</h1>

      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {!error && topics.length === 0 && (
        <p className="text-gray-600 mb-4">
          No topics yet. Add rows in Supabase Table Editor → <strong>topics</strong> (columns: <code>slug</code>, <code>order_index</code>). They will show here and on the Shahmaran page.
        </p>
      )}

      {!error && topics.length > 0 && (
        <ul className="space-y-2 max-w-xl">
          {topics.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-4 rounded border border-gray-200 bg-white px-4 py-3"
            >
              <span className="font-mono text-sm text-gray-500">{t.order_index}</span>
              <span className="font-medium">{t.slug}</span>
              <span className="text-xs text-gray-400">
                {new Date(t.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
