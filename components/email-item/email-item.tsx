"use client"

import React from "react"
import { ChevronDown, ChevronRight, Mail, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface Email {
  subject: string
  from: string
  date?: string
  body: string
}

export interface EmailItemProps {
  email: Email
  index: number
}

function EmailBody({ body }: { body: string }) {
  return (
    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed overflow-x-auto bg-transparent p-0 m-0">
      {body}
    </pre>
  )
}

export default function EmailItem({ email, index }: EmailItemProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Badge variant="secondary" className="flex-shrink-0">
                  #{index + 1}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <h3 className="font-semibold text-sm truncate">
                      {email.subject || 'No subject'}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">
                      {email.from || 'Unknown sender'}
                    </span>
                    {email.date && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(email.date).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Separator className="mb-4" />
            <EmailBody body={email.body || 'No content available'} />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
