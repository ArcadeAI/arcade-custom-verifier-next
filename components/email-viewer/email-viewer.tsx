"use client"

import React from "react"

import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import EmailItem, { type Email } from "@/components/email-item/email-item"

export type EmailViewerProps = {
  initialCount?: number
  onLoadEmails?: (emailCount: number) => Promise<string>
  className?: string
}

export default function EmailViewer({
  initialCount = 5,
  className,
}: EmailViewerProps) {
  const [count, setCount] = React.useState<number>(initialCount)
  const [emails, setEmails] = React.useState<Email[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [authorizationUrl, setAuthorizationUrl] = React.useState<string>("")
  const [error, setError] = React.useState<string>("")

  async function handleLoadEmails() {
    try {
      setIsLoading(true)
      setError("")
      setAuthorizationUrl("")
      setEmails([])

      const response = await fetch(`/api/emails?emailCount=${count}`, {
        method: "GET",
      })
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      const data = await response.json()
      
      // Handle authorization required response
      if (data.authorization_required) {
        setAuthorizationUrl(data.url)
        setError(data.message)
      } 
      // Handle successful response with emails
      else if (data.emails) {
        if (Array.isArray(data.emails) && data.emails.length > 0) {
          setEmails(data.emails)
        } else {
          setEmails([])
          setError("No emails found")
        }
      }
      // Handle legacy response format (fallback)
      else {
        setError("No data received from the API.")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle>Email Viewer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-count">Number of emails</Label>
            <div className="text-sm text-muted-foreground">{count}</div>
          </div>
          <Slider
            id="email-count"
            min={1}
            max={50}
            step={1}
            value={[count]}
            onValueChange={(values: number[]) => setCount(values[0] ?? 1)}
            aria-label="Number of emails to load"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleLoadEmails} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load emails"}
          </Button>
        </CardFooter>
      </Card>

      <div className="flex-1 mt-6 min-h-0">
        {error && (
          <Alert className="mb-4">
            <AlertDescription>
              {error}
              {authorizationUrl && (
                <div className="mt-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={authorizationUrl} target="_blank" rel="noopener noreferrer">
                      Authorize Gmail Access
                    </a>
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {emails.length > 0 ? (
          <ScrollArea className="h-full">
            <div className="space-y-4 pr-4">
              {emails.map((email, index) => (
                <EmailItem key={index} email={email} index={index} />
              ))}
            </div>
          </ScrollArea>
        ) : !error && !isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No emails loaded yet</p>
              <p className="text-sm">Click "Load emails" to get started</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}


