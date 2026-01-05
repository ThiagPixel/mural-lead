import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginAction } from "@/app/login/actions";

export function LoginForm({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  return (
    <form className={cn("flex flex-col gap-6")} action={loginAction}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Faça login!</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Preencha seus dados para acessar o sistema.
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="username">Login</FieldLabel>
          <Input name="username" type="text" placeholder="" required />
          {searchParams?.error === 'usuario' && (<p>Usuário não encontrado</p>)}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu a senha?
            </a>
          </div>
          <Input name="password" type="password" required />
          {searchParams?.error === 'senha' && (<p>Senha inválida</p>)}
        </Field>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
