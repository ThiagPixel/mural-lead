import { createSupabaseServer } from '@/lib/supabase/server';
import {
  Item,
  ItemActions,
  ItemGroup,
  ItemHeader,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const models = [
  {
    name: "Pessoas",
    description: "Gerenciar colaboradores.",
    image:
      "/team.svg",
    credit: "Undraw",
  },
  {
    name: "Serviços",
    description: "Gerenciar serviços.",
    image:
      "/to-do-list.svg",
    credit: "Undraw",
  },
  {
    name: "Autorizações",
    description: "Gerenciar autorizações.",
    image:
      "/mail-sent.svg",
    credit: "Undraw",
  },
]

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="p-16 justify-center items-center flex flex-col gap-8">
          <div>
            <h1 className="text-4xl text-center font-bold mb-2">
              Funções disponíveis
            </h1>
            <p>
              Esse sistema está em desenvolvimento, a versão atual não representa o produto final.
            </p>
          </div>
      <div className="flex w-full max-w-xl flex-col gap-6">
      <ItemGroup className="grid grid-cols-3 gap-4">
        {models.map((model) => (
          <Item key={model.name} variant="outline">
            <ItemHeader>
                <img
                  src={model.image}
                  alt={model.name}
                  width={64}
                  height={64}
                  className="aspect-square w-full rounded-sm object-contain"
              />
            </ItemHeader>
            <ItemContent>
              <ItemTitle>{model.name}</ItemTitle>
              <ItemDescription>{model.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
    </div>
  );
}
