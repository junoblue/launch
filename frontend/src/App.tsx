import { AuthProvider } from "@/lib/auth/auth-context"
import { AppRoutes } from "@/routes"
import { UILD } from "@/lib/uild"

export default function App() {
  const appUild = UILD.generate("app")

  return (
    <div data-uild={appUild}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  )
}
