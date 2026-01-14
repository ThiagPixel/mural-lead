'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, RefreshCw, Search, Trash2 } from 'lucide-react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import Link from 'next/link';

const supabase = createSupabaseBrowser();

interface Service {
  id: number;
  title: string;
  responsible: string;
  service: string;
  category: string;
  date: string;
  status: 'aberto' | 'pendente' | 'concluido';
  created_at: string;
}

export default function ServicesManager() {
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    title: '',
    responsible: '',
    service: '',
    category: '',
    date: getTodayDate(),
    status: 'aberto',
  });

  /* =======================
     PERMISSÃO (ADMIN)
  ======================= */
  const checkAdmin = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.user.id)
      .single();

    setIsAdmin(data?.role === 'admin');
  };

  /* =======================
      STATUS POR DATA
  ======================= */
  const getStatusByDate = (date: string, status: string) => {
    if (status === 'concluido') return 'concluido';

    const today = getTodayDate();

    if (date > today) return 'aberto';
    if (date < today) return 'pendente';

  return 'aberto';
  };

  /* =======================
     FETCH SERVICES
  ======================= */
  const fetchServices = async () => {
    setLoading(true);

    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('date', selectedDate)
      .order('created_at', { ascending: false });

    const normalized = (data || []).map(service => ({
    ...service,
    status: getStatusByDate(service.date, service.status),
    }));

    setServices(normalized);
    setLoading(false);
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [selectedDate]);

  /* =======================
     CREATE SERVICE
  ======================= */
  const handleCreate = async () => {
    if (!form.title || !form.responsible || !form.service || !form.category || !form.date) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('services')
        .insert(form);

      if (error) throw error;

      setForm({ title: '', responsible: '', service: '', category: '', date: getTodayDate(), status: 'Aberto' });
      setOpen(false);
      fetchServices();
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     STATUS BADGE
  ======================= */
  const statusBadge = (status: string) => {
  switch (status) {
    case 'aberto':
      return <Badge className="bg-yellow-500">Aberto</Badge>;
    case 'pendente':
      return <Badge className="bg-red-500">Pendente</Badge>;
    case 'concluido':
      return <Badge className="bg-green-600">Concluído</Badge>;
    }
  };

  /* =======================
     MARK AS COMPLETED
  ======================= */
  const markAsCompleted = async (id: number) => {
  await supabase
    .from('services')
    .update({ status: 'concluido' })
    .eq('id', id);

  fetchServices();
  };

  /* =======================
     FILTERS
  ======================= */
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Serviços</h1>
            <p>Gerencie os serviços realizados para os clientes.</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchServices}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            
            </Button>

            <Link href="/permissions">
              <Button
                variant="outline"
              >
                Autorizações
              </Button>
            </Link>

            {isAdmin && (
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Novo Serviço
                    </Button>
                </SheetTrigger>

                {/* SHEET — INTACTO */}
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Cadastrar Serviço</SheetTitle>
                  </SheetHeader>

                  <div className="grid flex-1 auto-rows-min gap-6 px-4 mt-4">
                    <div className="space-y-2">
                      <Label>Bloco/Sala</Label>
                      <Input
                        value={form.title}
                        onChange={e =>
                          setForm({ ...form, title: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Responsável</Label>
                      <Input
                        value={form.responsible}
                        onChange={e =>
                          setForm({ ...form, responsible: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Serviço</Label>
                      <Select
                        onValueChange={value =>
                          setForm({ ...form, service: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um Serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Recepção</SelectLabel>
                            <SelectItem value="Laser">Laser</SelectItem>
                            <SelectItem value="Correios">Correios</SelectItem>
                            <SelectItem value="Entregador">Entregador</SelectItem>
                          </SelectGroup>

                          <SelectGroup>
                            <SelectLabel>Manutenção</SelectLabel>
                            <SelectItem value="Trocar Lâmpada">Trocar Lâmpada</SelectItem>
                            <SelectItem value="Inspeção de Vazamento">Inspeção de Vazamento</SelectItem>
                            <SelectItem value="Atendimento de Segurança">Atendimento de Segurança</SelectItem>
                            <SelectItem value="Desligar Disjuntor">Desligar Disjuntor</SelectItem>
                            <SelectItem value="Religar Disjuntor">Religar Disjuntor</SelectItem>
                            <SelectItem value="Acompanhamento de Refrigeração">Acompanhamento de Refrigeração</SelectItem>
                            <SelectItem value="Acompanhamento de Internet">Acompanhamento de Internet</SelectItem>
                            <SelectItem value="Acompanhamento Manutenção">Acompanhamento Manutenção</SelectItem>
                            <SelectItem value="Abertura de Registro">Abertura de Registro</SelectItem>
                            <SelectItem value="Fechamento de Registro">Fechamento de Registro</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        onValueChange={value =>
                          setForm({ ...form, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Manutenção">Manutenção</SelectItem>
                            <SelectItem value="Recepção">Recepção</SelectItem>
                            <SelectItem value="Administração">Administração</SelectItem>
                            <SelectItem value="Sistema">Sistema</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input
                        type="date"
                        value={form.date}
                        onChange={e =>
                          setForm({ ...form, date: e.target.value })
                        }
                      />
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleCreate}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando
                        </>
                      ) : (
                        'Salvar Serviço'
                      )}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {/* Card de busca responsivo */}
        <Card className="mb-4 md:mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="w-full sm:w-auto">
                <CardTitle className="text-lg md:text-xl">Buscar Serviço</CardTitle>
                <CardDescription className="text-xs md:text-sm mt-1">
                  Pesquise por título, serviço ou categoria
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Label htmlFor="date-filter" className="text-xs md:text-sm font-medium whitespace-nowrap">
                  Data:
                </Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto text-sm"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* LISTAGEM */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 mx-auto animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map(service => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.service}</CardDescription>
                    <CardDescription>{service.responsible}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-x-2">
                    <Badge>{service.category}</Badge>
                    {statusBadge(service.status)}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Data: {service.date}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Criado em: {new Date(service.created_at).toLocaleString()}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t flex flex-col sm:flex-row justify-end gap-2">                    
                    {service.status !== 'concluido' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsCompleted(service.id)}
                    >
                      Concluir
                    </Button>
                    )}
                    {isAdmin === true && (
                    <div className='flex gap-2 w-full sm:w-auto'>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {}}
                      className="w-full sm:w-auto text-xs md:text-sm"
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {}}
                      className="w-full sm:w-auto text-xs md:text-sm"
                    >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Excluir
                    </Button>
                    </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <Card className="p-12 mt-6">
                <div className="text-center text-slate-500">
                  <p className="text-lg">Nenhum serviço encontrado</p>
                  <p className="text-sm">Tente ajustar a busca ou a data</p>
                </div>
              </Card>
            )}

            <div className="mt-6 text-center text-sm text-slate-500">
              Total de serviços encontrados: {filteredServices.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
