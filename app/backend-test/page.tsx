import BackendTest from "@/components/backend-test"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function BackendTestPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 container py-10">
        <h1 className="text-2xl font-bold mb-6">Backend Connection Test</h1>
        <BackendTest />
      </main>

      <SiteFooter />
    </div>
  )
}
