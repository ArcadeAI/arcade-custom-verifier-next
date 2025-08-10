'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  
  // Check if there's a redirect parameter
  const redirectTo = formData.get('redirect') as string
  if (redirectTo) {
    redirect(redirectTo)
  } else {
    redirect('/')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)
  console.log("signup error", error)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  
  // Check if there's a redirect parameter
  const redirectTo = formData.get('redirect') as string
  if (redirectTo) {
    redirect(redirectTo)
  } else {
    redirect('/')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut({scope: 'local'})
  revalidatePath('/', 'layout')
  redirect('/')
}