import { createSupabaseServer } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="p-8">
      <h1>Dashboard</h1>
      <p>Usuário logado: {session?.user.id}</p>
    </div>
  );
}
