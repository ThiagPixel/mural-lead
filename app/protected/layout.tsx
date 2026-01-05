import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import '../globals.css';
import Navbar from '@/components/navbar';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = await createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
    <div className="w-full">
      <Navbar/>
        {children}
    </div>
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Thiago Rezende de Oliveira
            </a>
          </p>
        </footer>
    </main>
  );
}
