"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [testUser, setTestUser] = useState({
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    password: "password123",
  })
  const [insertStatus, setInsertStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  // Test connection to Supabase
  const testConnection = async () => {
    setConnectionStatus("loading")
    try {
      // Simple query to test connection
      const { data, error } = await supabase.from("users").select("count")

      if (error) throw error

      setConnectionStatus("success")
      console.log("Connection successful:", data)
    } catch (error) {
      console.error("Connection error:", error)
      setConnectionStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error")
    }
  }

  // Insert test user
  const insertTestUser = async () => {
    setInsertStatus("loading")
    try {
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            first_name: testUser.first_name,
            last_name: testUser.last_name,
            email: testUser.email,
            password: testUser.password,
            member_since: new Date().toISOString(),
          },
        ])
        .select()

      if (error) throw error

      setInsertStatus("success")
      console.log("User inserted:", data)
    } catch (error) {
      console.error("Insert error:", error)
      setInsertStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Supabase Connection</CardTitle>
          <CardDescription>Verify that your application can connect to your Supabase instance</CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus === "success" && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Connection Successful</AlertTitle>
              <AlertDescription>Your application is successfully connected to Supabase.</AlertDescription>
            </Alert>
          )}

          {connectionStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Failed</AlertTitle>
              <AlertDescription>
                {errorMessage || "Could not connect to Supabase. Please check your credentials."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={testConnection}
            disabled={connectionStatus === "loading"}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {connectionStatus === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Insert Test User</CardTitle>
          <CardDescription>Test inserting a record into the users table</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={testUser.first_name}
                onChange={(e) => setTestUser({ ...testUser, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={testUser.last_name}
                onChange={(e) => setTestUser({ ...testUser, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={testUser.email}
              onChange={(e) => setTestUser({ ...testUser, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={testUser.password}
              onChange={(e) => setTestUser({ ...testUser, password: e.target.value })}
            />
          </div>

          {insertStatus === "success" && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>User Created</AlertTitle>
              <AlertDescription>Test user was successfully inserted into the database.</AlertDescription>
            </Alert>
          )}

          {insertStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Insert Failed</AlertTitle>
              <AlertDescription>
                {errorMessage || "Could not insert test user. Please check your database schema."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={insertTestUser}
            disabled={insertStatus === "loading"}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {insertStatus === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inserting...
              </>
            ) : (
              "Insert Test User"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
