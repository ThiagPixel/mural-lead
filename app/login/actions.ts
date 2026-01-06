'use server';

import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData): Promise<void> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const supabase = await createSupabaseServer();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('username', username)
    .single();

  if (!profile) {
    redirect('/login?error=usuario');
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: `${username}@fake.local`,
    password,
  });

  if (error) {
    redirect('/login?error=senha');
  }
  
  if (profile.role === 'admin') {
    redirect('/admin');
  } else {
  redirect('/services');
  }
}