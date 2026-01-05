"use client";

import { useState } from "react";
import { createUser } from "@/app/protected/users/actions";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateUserSheet() {
  const [role, setRole] = useState("");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Novo usuário
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Criar usuário</SheetTitle>
          <SheetDescription>
            O login será feito usando o username.
          </SheetDescription>
        </SheetHeader>

        <form action={createUser} className="space-y-4 mt-4">
          {/* role precisa ir no FormData */}
          <input type="hidden" name="role" value={role} />

          <div className="grid gap-4 px-4">
            <div className="grid gap-2">
              <Label>Username</Label>
              <Input
                name="username"
                placeholder="ex: joao"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Senha</Label>
              <Input
                name="password"
                placeholder="******"
                type="password"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Perfil</Label>
              <Select onValueChange={setRole} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="recepcao">Recepção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter>
            <Button type="submit">Criar</Button>
            <SheetClose asChild>
              <Button variant="outline">Cancelar</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
