"use server"

import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"
import { Arcade } from "@arcadeai/arcadejs"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  // Extract flow_id from query parameters
  const { searchParams } = new URL(request.url)
  const flowId = searchParams.get('flow_id')

  if (error || !data?.user) {
    // If user is not authenticated, redirect to login with flow_id as redirect parameter
    const loginUrl = new URL('/login', request.url)
    if (flowId) {
      loginUrl.searchParams.set('redirect', `/verify?flow_id=${flowId}`)
    } else {
      loginUrl.searchParams.set('redirect', '/verify')
    }
    redirect(loginUrl.toString())
  }
  // If user is authenticated and we have a flow_id, proceed with verification logic
  if (flowId) {
    const arcade = new Arcade({
      apiKey: process.env.ARCDE_API_KEY,
    })

    try{
        const response = await arcade.auth.confirmUser({
            flow_id: flowId,
            user_id: data.user.id,
        })

        let authId = response.auth_id;
        if (!authId.startsWith('ar_')) {
            authId = 'ar_' + authId;
        }

        const auth_response = await arcade.auth.waitForCompletion(authId);

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to verify flow' }, { status: 500 })
    }
    redirect('/');
  }
  // If no flow_id provided, return error or redirect
  return NextResponse.json({ error: 'flow_id parameter is required' }, { status: 400 })
}