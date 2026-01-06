import { createSupabaseServer } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="p-16 justify-center items-center flex flex-col gap-8">
          <div>
            <h1 className="text-4xl text-center font-bold mb-2">
              Atualizações do Sistema
            </h1>
            <p className="text-center text-muted-foreground">
              Últimas melhorias e novas funcionalidades implementadas
            </p>
            <p className="mt-6 text-center max-w-2xl mx-auto">
              Adicionado o campo de responsável nos serviços.<br/>
              Cargos só conseguem ver seus respectivos servicos.<br/>
              Novo layout mais clean e intuitivo em Pessoas.<br/>
            </p>
          </div>
          <a>Versão 1.0.0 - 06 de Janeiro de 2026</a>
    </div>
  );
}
