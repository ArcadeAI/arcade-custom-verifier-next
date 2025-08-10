"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Arcade } from "@arcadeai/arcadejs"
import { NextRequest, NextResponse } from "next/server"

export async function loadEmails(emailCount: number, user_id: string) {
  const arcade = new Arcade({
    apiKey: process.env.ARCDE_API_KEY,
  })

  const toolName = "Gmail.ListEmails"

  const auth_response = await arcade.tools.authorize({
    tool_name: toolName,
    user_id: user_id,
  })

  if (auth_response.status !== "completed") {
    return {
      authorization_required: true,
      url: auth_response.url,
      message: `Authorization required to invoke ${toolName}`,
    }
  }

  // if we're here, the user has authorized the tool


  const list_emails_response = await arcade.tools.execute({
    tool_name: toolName,
    user_id: user_id,
    input: {
      n_emails: emailCount,
    },
  })
  return {
    emails: (list_emails_response.output?.value as any)?.emails
  }
}

export async function GET(request: NextRequest) {

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const { searchParams } = new URL(request.url)
  const emailCount = searchParams.get('emailCount')
  if (!emailCount) {
    return new Response('Email count is required', { status: 400 })
  }
  const response = await loadEmails(parseInt(emailCount), data.user.id)

  return NextResponse.json(response)
}