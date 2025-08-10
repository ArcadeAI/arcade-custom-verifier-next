import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import EmailViewer from '@/components/email-viewer/email-viewer'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/login/actions'

export default async function Home() {

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="border-b bg-white shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Email Verifier</h1>
              <span className="text-sm text-gray-600">Hello, {data.user.email}</span>
            </div>
            <form action={logout}>
              <Button variant="outline" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        <EmailViewer />
      </main>
    </div>
  )
}
