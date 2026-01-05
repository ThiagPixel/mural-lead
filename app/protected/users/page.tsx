import { CreateUserSheet } from "@/components/users-create";
import { DeleteUserButton } from "@/components/users-delete";
import { ResetPasswordSheet } from "@/components/users-reset";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function UsersPage() {
  const supabase = await createSupabaseServer();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, username, role")
    .order("username");

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-6">
        <h1 className="text-xl font-bold text-center">Usuários</h1>
        <div className="flex justify-center">
          <CreateUserSheet />
        </div>

      {users?.map((u) => (
        <div
          key={u.id}
          className="flex items-center justify-between border p-4 rounded-lg"
        >
          <span>{u.username}</span>
          <span className="text-muted-foreground">{u.role}</span>

          <div className="flex gap-2">
            <ResetPasswordSheet
              userId={u.id}
              username={u.username}
            />
          </div>

          <DeleteUserButton id={u.id} />
        </div>
      ))}
    </div>
  );
}

