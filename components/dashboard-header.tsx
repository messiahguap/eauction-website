import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
  user: any
}

export function DashboardHeader({ heading, text, children, user }: DashboardHeaderProps) {
  const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()

  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      <div className="flex items-center gap-4">
        {children}
        <ModeToggle />
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.avatar || ""} alt={`${user.first_name} ${user.last_name}`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{`${user.first_name} ${user.last_name}`}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/profile">Profile</Link>
        </Button>
      </div>
    </div>
  )
}
