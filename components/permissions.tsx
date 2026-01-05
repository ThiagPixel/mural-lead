'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Search, User, DoorOpen, Plus, X, Users, Loader2, RefreshCw } from 'lucide-react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import Link from 'next/link';

// Criar instância do Supabase
const supabase = createSupabaseBrowser();

interface Permissions {
  id: number;
  name: string;
  cpf: string;
  rooms: string[];
  status: 'active' | 'priority';
  date: string;
  created_at?: string;
}

interface NewPermissions {
  name: string;
  cpf: string;
  rooms: string[];
}

const Permissions: React.FC = () => {
  const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [authorizedPeople, setAuthorizedPeople] = useState<Permissions[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [editingPermissions, setEditingPermissions] = useState<Permissions | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const [newPermissions, setNewPermissions] = useState<NewPermissions>({
    name: '',
    cpf: '',
    rooms: []
  });
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const [bulkText, setBulkText] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());

  // BUSCAR PESSOAS DO SUPABASE
  const fetchPeople = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await supabase
        .from('authorized_people')
        .select('*')
        .eq('date', selectedDate)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setAuthorizedPeople(data || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar dados');
      console.error('Erro ao buscar:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando o componente montar ou a data mudar
  useEffect(() => {
    fetchPeople();
  }, [selectedDate]);

  const filteredPeople = authorizedPeople.filter(Permissions =>
    Permissions.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Permissions.cpf.includes(searchTerm) ||
    Permissions.rooms.some(room => room.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: Permissions['status']): string => {
    return status === 'priority' ? 'bg-purple-500' : 'bg-green-500';
  };

  const addRoom = (): void => {
    if (currentRoom.trim() && !newPermissions.rooms.includes(currentRoom.trim())) {
      setNewPermissions({
        ...newPermissions,
        rooms: [...newPermissions.rooms, currentRoom.trim()]
      });
      setCurrentRoom('');
    }
  };

  const removeRoom = (roomToRemove: string): void => {
    setNewPermissions({
      ...newPermissions,
      rooms: newPermissions.rooms.filter(room => room !== roomToRemove)
    });
  };

  // ADICIONAR UMA PESSOA NO SUPABASE
  const handleAddPermissions = async (): Promise<void> => {
    if (!newPermissions.name || !newPermissions.cpf || newPermissions.rooms.length === 0) return;

    try {
      setSaving(true);
      setError('');

      const PermissionsData = {
        name: newPermissions.name,
        cpf: newPermissions.cpf,
        rooms: newPermissions.rooms,
        status: 'active',
        date: selectedDate
      };

      const { error: insertError } = await supabase
        .from('authorized_people')
        .insert([PermissionsData]);

      if (insertError) throw insertError;

      setNewPermissions({ name: '', cpf: '', rooms: [] });
      setIsSheetOpen(false);
      
      // Recarregar a lista
      await fetchPeople();
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar pessoa');
      console.error('Erro ao adicionar:', err);
    } finally {
      setSaving(false);
    }
  };

  // ADICIONAR VÁRIAS PESSOAS NO SUPABASE
  const handleBulkAdd = async (): Promise<void> => {
    const lines = bulkText.trim().split('\n');
    const newPeopleData: Omit<Permissions, 'id' | 'created_at'>[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      const parts = trimmedLine.split(';').map(p => p.trim());
      
      if (parts.length >= 3) {
        const [name, cpf, ...roomsParts] = parts;
        const rooms = roomsParts.join(';').split(',').map(r => r.trim()).filter(r => r);
        
        if (name && cpf && rooms.length > 0) {
          newPeopleData.push({
            name,
            cpf,
            rooms,
            status: 'active',
            date: selectedDate
          });
        }
      }
    }

    if (newPeopleData.length === 0) return;

    try {
      setSaving(true);
      setError('');

      const { error: insertError } = await supabase
        .from('authorized_people')
        .insert(newPeopleData);

      if (insertError) throw insertError;

      setBulkText('');
      setIsSheetOpen(false);
      
      // Recarregar a lista
      await fetchPeople();
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar pessoas');
      console.error('Erro ao adicionar em massa:', err);
    } finally {
      setSaving(false);
    }
  };

  // EXCLUIR PESSOA DO SUPABASE
  const handleDeletePermissions = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta autorização?')) return;

    try {
        setLoading(true);

        const { error: insertError } = await supabase
        .from('authorized_people')
        .delete()
        .eq('id', id);

        if (insertError) throw insertError;

        await fetchPeople();
    } catch (err: any) {
        setError(err.message || 'Erro ao excluir');
    } finally {
        setLoading(false);
    }
  };
  // EDITAR PESSOA NO SUPABASE
  const openEdit = (Permissions: Permissions) => {
    setEditingPermissions(Permissions);
    setIsEditSheetOpen(true);
  };
  const handleUpdatePermissions = async () => {
    if (!editingPermissions) return;

    try {
        setSaving(true);

        const { error } = await supabase
        .from('authorized_people')
        .update({
            name: editingPermissions.name,
            cpf: editingPermissions.cpf,
            rooms: editingPermissions.rooms
        })
        .eq('id', editingPermissions.id);

        if (error) throw error;

        setIsEditSheetOpen(false);
        setEditingPermissions(null);
        await fetchPeople();
    } catch (err: any) {
        setError(err.message || 'Erro ao atualizar');
    } finally {
        setSaving(false);
    }
  };



  return (
    <div className="min-h-screen from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Controle de Acesso
            </h1>
            <p>
              Gerencie as autorizações de acesso às salas
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={fetchPeople}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            <Link href="/protected/services">
              <Button
                variant="outline"
              >
                Serviços
              </Button>
            </Link>
            
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Pessoa
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Nova Autorização</SheetTitle>
                  <SheetDescription>
                    Adicione uma ou várias pessoas autorizadas ao sistema
                  </SheetDescription>
                </SheetHeader>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                
                <Tabs defaultValue="single" className="grid flex-1 auto-rows-min gap-6 px-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single">Uma Pessoa</TabsTrigger>
                    <TabsTrigger value="bulk">Várias Pessoas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="single" className="grid flex-1 auto-rows-min gap-6 px-4">
                    <div className="grid gap-3">
                      <Label htmlFor="date">Data de Autorização</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        placeholder="Digite o nome"
                        value={newPermissions.name}
                        onChange={(e) => setNewPermissions({ ...newPermissions, name: e.target.value })}
                        disabled={saving}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={newPermissions.cpf}
                        onChange={(e) => setNewPermissions({ ...newPermissions, cpf: e.target.value })}
                        disabled={saving}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="room">Salas Autorizadas</Label>
                      <div className="flex gap-2">
                        <Input
                          id="room"
                          placeholder="Digite o nome da sala"
                          value={currentRoom}
                          onChange={(e) => setCurrentRoom(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addRoom()}
                          disabled={saving}
                        />
                        <Button type="button" onClick={addRoom} size="icon" disabled={saving}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {newPermissions.rooms.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {newPermissions.rooms.map((room, idx) => (
                            <Badge 
                              key={idx} 
                              className="bg-blue-100 text-blue-700 hover:bg-blue-200 pr-1"
                            >
                              {room}
                              <button
                                onClick={() => removeRoom(room)}
                                className="ml-2 hover:bg-blue-300 rounded-full p-0.5"
                                disabled={saving}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleAddPermissions}
                      disabled={!newPermissions.name || !newPermissions.cpf || newPermissions.rooms.length === 0 || saving}
                      className="w-full"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        'Adicionar Pessoa'
                      )}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="bulk" className="space-y-6 py-6">
                    <div className="space-y-2">
                      <Label htmlFor="bulk-date">Data de Autorização</Label>
                      <Input
                        id="bulk-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bulk">Lista de Pessoas</Label>
                      <p className="text-sm text-slate-500">
                        Digite uma pessoa por linha no formato:<br />
                        <code className="px-2 py-1 rounded text-xs">
                          Nome; CPF; Sala 1, Sala 2, Sala 3
                        </code>
                      </p>
                      <Textarea
                        id="bulk"
                        placeholder="Maria Silva; 123.456.789-00; Sala A, Sala B, Sala C
João Santos; 234.567.890-11; Sala D, Sala E"
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        rows={12}
                        className="font-mono text-sm"
                        disabled={saving}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-2 text-blue-700 mb-2">
                        <Users className="w-5 h-5" />
                        <span className="font-semibold">Exemplo:</span>
                      </div>
                      <code className="text-xs text-blue-600 block whitespace-pre-wrap">
                        Ana Costa; 345.678.901-22; Sala de RH, Auditório{'\n'}
                        Carlos Oliveira; 456.789.012-33; Laboratório A, Laboratório B
                      </code>
                    </div>

                    <Button 
                      onClick={handleBulkAdd}
                      disabled={!bulkText.trim() || saving}
                      className="w-full"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        'Adicionar Todas as Pessoas'
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {error && !isSheetOpen && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Buscar Autorização</CardTitle>
                <CardDescription>
                  Pesquise por nome, CPF ou sala
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="date-filter" className="text-sm font-medium">
                  Data:
                </Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
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

        {loading ? (
          <Card className="p-12">
            <div className="text-center text-slate-500">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
              <p className="text-lg">Carregando...</p>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPeople.map((Permissions) => (
                <Card key={Permissions.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                          {Permissions.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{Permissions.name}</CardTitle>
                          <CardDescription>CPF: {Permissions.cpf}</CardDescription>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(Permissions.status)}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                  <div className="flex gap-12">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <DoorOpen className="w-4 h-4" />
                        Salas Autorizadas
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Permissions.rooms.map((room, idx) => (
                          <Badge 
                            key={idx} 
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            {room}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(Permissions)}
                        >
                        Editar
                        </Button>
                        <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePermissions(Permissions.id)}
                        >
                        Excluir
                        </Button>
                    </div>
                  </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPeople.length === 0 && !loading && (
              <Card className="p-12">
                <div className="text-center text-slate-500">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Nenhuma pessoa autorizada encontrada</p>
                  <p className="text-sm">Tente ajustar sua busca ou data</p>
                </div>
              </Card>
            )}

            <div className="mt-6 text-center text-sm text-slate-500">
              Total de pessoas autorizadas para esta data: {filteredPeople.length}
            </div>
            <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                    <SheetTitle>Editar Autorização</SheetTitle>
                    <SheetDescription>
                        Atualize os dados da pessoa autorizada
                    </SheetDescription>
                    </SheetHeader>

                    {editingPermissions && (
                    <div className="grid flex-1 auto-rows-min gap-6 px-4">
                        <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input
                            value={editingPermissions.name}
                            onChange={(e) =>
                            setEditingPermissions({ ...editingPermissions, name: e.target.value })
                            }
                        />
                        </div>

                        <div className="space-y-2">
                        <Label>CPF</Label>
                        <Input
                            value={editingPermissions.cpf}
                            onChange={(e) =>
                            setEditingPermissions({ ...editingPermissions, cpf: e.target.value })
                            }
                        />
                        </div>

                        <div className="space-y-2">
                        <Label>Salas (separadas por vírgula)</Label>
                        <Input
                            value={editingPermissions.rooms.join(', ')}
                            onChange={(e) =>
                            setEditingPermissions({
                                ...editingPermissions,
                                rooms: e.target.value.split(',').map(r => r.trim())
                            })
                            }
                        />
                        </div>
                        <Button
                        onClick={handleUpdatePermissions}
                        disabled={saving}
                        className="w-full"
                        >
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                    )}
                </SheetContent>
            </Sheet>
          </>
        )}
      </div>
    </div>
  );
};

export default Permissions;