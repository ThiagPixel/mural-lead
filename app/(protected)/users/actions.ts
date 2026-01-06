'use server'

import { createSupabaseServer } from '@/lib/supabase/server'

export async function resetUserPassword(
  userId: string,
  newPassword: string
) {
  const supabase = await createSupabaseServer()

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  })

  if (error) {
    throw new Error(error.message)
  }
}
