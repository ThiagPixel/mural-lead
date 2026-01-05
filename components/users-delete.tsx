"use client";

import { deleteUser } from "@/app/protected/users/actions";
import { Button } from "@/components/ui/button";

export function DeleteUserButton({ id }: { id: string }) {
  return (
    <form
      action={deleteUser}
      onSubmit={(e) => {
        if (!confirm("Tem certeza que deseja excluir este usuário?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button variant="destructive" size="sm">
        Excluir
      </Button>
    </form>
  );
}
