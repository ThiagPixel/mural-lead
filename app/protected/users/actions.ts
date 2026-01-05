'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* =====================
   CREATE USER
===================== */
export async function createUser(formData: FormData): Promise<void> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  const email = `${username}@fake.local`;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) throw new Error(error.message);

  await supabaseAdmin.from('profiles').insert({
    id: data.user.id,
    username,
    role,
  });

  revalidatePath('/admin/users');
}

/* =====================
   DELETE USER
===================== */
export async function deleteUser(formData: FormData): Promise<void> {
  const id = formData.get('id') as string;

  await supabaseAdmin.auth.admin.deleteUser(id);
  await supabaseAdmin.from('profiles').delete().eq('id', id);

  revalidatePath('/admin/users');
}

/* =====================
   RESET PASSWORD
===================== */
export async function resetUserPassword(formData: FormData): Promise<void> {
  const id = formData.get('id') as string;
  const password = formData.get('password') as string;

  await supabaseAdmin.auth.admin.updateUserById(id, {
    password,
  });
}
