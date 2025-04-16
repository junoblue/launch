import * as React from "react"
import { useNavigate } from "react-router-dom"
import { AuthLayout } from "@/components/templates/AuthLayout"
import { LoginForm } from "@/components/organisms/LoginForm"
import { UILD } from "@/lib/uild"

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const pageUild = UILD.generate("page")
  
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      
      // Store the admin token
      localStorage.setItem("admin_token", data.token)
      
      // Redirect to admin dashboard
      navigate("/admin/dashboard")
    } catch (error) {
      console.error("Admin login error:", error)
      throw error
    }
  }

  return (
    <AuthLayout uild={pageUild} isGlobalAdmin>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Global Administrator Login
          </h1>
          <p className="text-sm text-muted-foreground">
            Access the global administration dashboard
          </p>
        </div>
        <LoginForm
          onSubmit={handleLogin}
          uild={UILD.generate("form")}
        />
        <div className="text-center text-sm">
          <a
            href="/admin/forgot-password"
            className="text-primary hover:text-primary/90 hover:underline"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </AuthLayout>
  )
} 