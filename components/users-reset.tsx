"use client";

import { resetUserPassword } from "@/app/protected/users/actions";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordSheet({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Resetar senha
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Resetar senha</SheetTitle>
          <SheetDescription>
            Definir nova senha para <strong>{username}</strong>
          </SheetDescription>
        </SheetHeader>

        <form action={resetUserPassword} className="space-y-4 mt-4">
          <input type="hidden" name="id" value={userId} />

          <div className="grid gap-2 px-4">
            <Label>Nova senha</Label>
            <Input
              name="password"
              type="password"
              required
              minLength={6}
            />
          </div>

          <SheetFooter>
            <Button type="submit">Salvar</Button>
            <SheetClose asChild>
              <Button variant="outline">Cancelar</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
