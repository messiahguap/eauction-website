"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function BackendTest() {
  const [apiTestStatus, setApiTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [apiTestResult, setApiTestResult] = useState<any>(null)
  const [apiTestError, setApiTestError] = useState<string | null>(null)

  const [signUpStatus, setSignUpStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [signUpResult, setSignUpResult] = useState<any>(null)
  const [signUpError, setSignUpError] = useState<string | null>(null)

  const [signInStatus, setSignInStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [signInResult, setSignInResult] = useState<any>(null)
  const [signInError, setSignInError] = useState<string | null>(null)

  const { signUp, signIn } = useAuth();

  const [testUser, setTestUser] = useState({
    firstName: "Test",
    lastName: "User",
    email: `test-${Date.now()}@example.com`,
    password: "password123",
  })

  // Test API endpoint
  const testApi = async () => {
    setApiTestStatus("loading")
    
    try {
      // Simulate API response with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockResponse = {
        success: true,
        connection: {
          success: true,
          data: { count: 5 }
        },
        mocked: true,
        timestamp: new Date().toISOString()
      }
      
      setApiTestResult(mockResponse)
      setApiTestStatus("success")
    } catch (error) {
      console.error("API test error:", error)
      setApiTestStatus("error")
      setApiTestError(error instanceof Error ? error.message : "Unknown error")
    }
  }

  // Test sign up
  const testSignUp = async () => {
    setSignUpStatus("loading")
    try {
      // Generate a unique email
      const uniqueEmail = `test-${Date.now()}@example.com`
      setTestUser((prev) => ({ ...prev, email: uniqueEmail }))

      const result = await signUp(uniqueEmail, testUser.password, `${testUser.firstName} ${testUser.lastName}`)

      if (result.error) {
        setSignUpStatus("error")
        setSignUpError(result.error.message)
        return
      }

      setSignUpResult({
        success: true,
        user: {
          email: uniqueEmail,
          name: `${testUser.firstName} ${testUser.lastName}`,
          created: new Date().toISOString()
        }
      })
      setSignUpStatus("success")
    } catch (error) {
      console.error("Sign up test error:", error)
      setSignUpStatus("error")
      setSignUpError(error instanceof Error ? error.message : "Unknown error")
    }
  }

  // Test sign in
  const testSignIn = async () => {
    setSignInStatus("loading")
    try {
      const result = await signIn(testUser.email, testUser.password)

      if (result.error) {
        setSignInStatus("error")
        setSignInError(result.error.message)
        return
      }

      setSignInResult({
        success: true,
        user: {
          email: testUser.email,
          name: `${testUser.firstName} ${testUser.lastName}`
        }
      })
      setSignInStatus("success")
    } catch (error) {
      console.error("Sign in test error:", error)
      setSignInStatus("error")
      setSignInError(error instanceof Error ? error.message : "Unknown error")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test API Endpoint</CardTitle>
          <CardDescription>Test the backend API connection (mock)</CardDescription>
        </CardHeader>
        <CardContent>
          {apiTestStatus === "success" && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>API Test Successful</AlertTitle>
              <AlertDescription>The API endpoint is responding correctly (mocked).</AlertDescription>
            </Alert>
          )}

          {apiTestStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>API Test Failed</AlertTitle>
              <AlertDescription>{apiTestError || "Could not connect to the API endpoint."}</AlertDescription>
            </Alert>
          )}

          {apiTestStatus === "success" && apiTestResult && (
            <div className="mt-4 border rounded-md p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">API Response:</h3>
              <pre className="text-xs overflow-auto p-2 bg-white border rounded max-h-60">
                {JSON.stringify(apiTestResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={testApi}
            disabled={apiTestStatus === "loading"}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {apiTestStatus === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test API Endpoint"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Sign Up</CardTitle>
          <CardDescription>Test the sign up functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={testUser.firstName}
                onChange={(e) => setTestUser({ ...testUser, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={testUser.lastName}
                onChange={(e) => setTestUser({ ...testUser, lastName: e.target.value })}
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
            <p className="text-xs text-gray-500">This will be auto-generated with a timestamp to ensure uniqueness</p>
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

          {signUpStatus === "success" && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Sign Up Successful</AlertTitle>
              <AlertDescription>Test user was successfully created.</AlertDescription>
            </Alert>
          )}

          {signUpStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sign Up Failed</AlertTitle>
              <AlertDescription>{signUpError || "Could not create test user."}</AlertDescription>
            </Alert>
          )}

          {signUpStatus === "success" && signUpResult && (
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">Created User:</h3>
              <pre className="text-xs overflow-auto p-2 bg-white border rounded">
                {JSON.stringify(signUpResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={testSignUp}
            disabled={signUpStatus === "loading"}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {signUpStatus === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating User...
              </>
            ) : (
              "Test Sign Up"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Sign In</CardTitle>
          <CardDescription>Test the sign in functionality</CardDescription>
        </CardHeader>
        <CardContent>
          {signInStatus === "success" && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Sign In Successful</AlertTitle>
              <AlertDescription>Test user was successfully signed in.</AlertDescription>
            </Alert>
          )}

          {signInStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sign In Failed</AlertTitle>
              <AlertDescription>{signInError || "Could not sign in test user."}</AlertDescription>
            </Alert>
          )}

          {signInStatus === "success" && signInResult && (
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">Signed In User:</h3>
              <pre className="text-xs overflow-auto p-2 bg-white border rounded">
                {JSON.stringify(signInResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={testSignIn}
            disabled={signInStatus === "loading"}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {signInStatus === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Test Sign In"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
