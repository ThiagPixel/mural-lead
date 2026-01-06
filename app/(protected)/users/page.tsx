'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, RefreshCw, UserCog, Trash2 } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { resetUserPassword } from './actions'

const supabase = createSupabaseBrowser()

type Profile = {
  id: string
  username: string
  role: 'admin' | 'manutencao' | 'recepcao'
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [resetUser, setResetUser] = useState<Profile | null>(null)
  const [newPassword, setNewPassword] = useState('')

  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'manutencao',
  })

  async function fetchUsers() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  async function createUser() {
    if (!form.username || !form.password) return

    const email = `${form.username}@fake.local`

    const { data, error } = await supabase.auth.signUp({
      email,
      password: form.password,
    })

    if (error || !data.user) return

    await supabase.from('profiles').insert({
      id: data.user.id,
      username: form.username,
      role: form.role,
    })

    setForm({ username: '', password: '', role: 'manutencao' })
    setOpen(false)
    fetchUsers()
  }

  async function deleteUser(user: Profile) {
    if (!confirm(`Excluir usuário ${user.username}?`)) return

    await supabase.from('profiles').delete().eq('id', user.id)
    await fetchUsers()
  }

  return (
    <>
      {/* HEADER */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Usuários
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerenciamento de acessos ao sistema
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchUsers}
              disabled={loading}
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} />
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Usuário
                </Button>
              </SheetTrigger>

              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Novo Usuário</SheetTitle>
                  <SheetDescription>
                    Criação manual de acesso ao sistema
                  </SheetDescription>
                </SheetHeader>

                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                  <div className="space-y-2">
                    <Label>Login</Label>
                    <Input
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Perfil</Label>
                    <Select
                      value={form.role}
                      onValueChange={(value) =>
                        setForm({ ...form, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manutencao">Manutenção</SelectItem>
                        <SelectItem value="recepcao">Recepção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" onClick={createUser}>
                    Criar Usuário
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => (
              <Card key={user.id} className="flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                      <UserCog className="w-5 h-5" />
                    </div>

                    <div>
                      <CardTitle className="text-base">
                        {user.username}
                      </CardTitle>
                      <CardDescription>
                        Criado em{' '}
                        {new Date(user.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Badge variant="secondary">{user.role}</Badge>
                </CardContent>

                <CardFooter className="border-t pt-4 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteUser(user)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setResetUser(user)}
                  >
                    Resetar Senha
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {!loading && users.length === 0 && (
              <Card className="col-span-full py-16 text-center">
                <p className="text-muted-foreground">
                  Nenhum usuário cadastrado
                </p>
              </Card>
            )}
          </div>
        </div>
        <Sheet open={!!resetUser} onOpenChange={() => setResetUser(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Resetar Senha</SheetTitle>
              <SheetDescription>
                Defina uma nova senha para o usuário
              </SheetDescription>
            </SheetHeader>

            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="space-y-2">
                <Label>Usuário</Label>
                <Input value={resetUser?.username} disabled />
              </div>

              <div className="space-y-2">
                <Label>Nova Senha</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={async () => {
                  if (!resetUser) return

                  await resetUserPassword(resetUser.id, newPassword)
                  setNewPassword('')
                  setResetUser(null)
                }}
              >
                Confirmar Reset
              </Button>
            </div>
          </SheetContent>
        </Sheet>

      </main>
    </>
  )
}
