"use client"

import { useEffect, useRef } from "react"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Mail, Loader2, AlertCircle, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false)

  const emailInputRef = useRef<HTMLInputElement>(null)

  // Validação de email em tempo real
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("O email é obrigatório")
      return false
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Email inválido")
      return false
    } else {
      setEmailError("")
      return true
    }
  }

  // Validação de senha em tempo real
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("A senha é obrigatória")
      return false
    } else if (value.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres")
      return false
    } else {
      setPasswordError("")
      return true
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validar campos antes de enviar
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setIsLoading(true)

    try {
      // Simulando autenticação
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulando erro de autenticação para demonstração
      if (email === "erro@teste.com") {
        setError("Credenciais inválidas. Verifique seu email e senha.")
        setIsLoading(false)
        return
      }

      // Armazenar informações do usuário no localStorage se "lembrar de mim" estiver marcado
      if (rememberMe) {
        localStorage.setItem("userEmail", email)
      } else {
        localStorage.removeItem("userEmail")
      }

      // Redirecionar para o dashboard após login bem-sucedido
      router.push("/dashboard")
    } catch (err) {
      console.error("Erro ao fazer login:", err)
      setError("Ocorreu um erro ao fazer login. Por favor, tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar se há um email salvo no localStorage ao carregar a página
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail")
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }

    // Auto-focus no campo de email
    if (emailInputRef.current) {
      emailInputRef.current.focus()
    }
  }, [])

  // Lidar com navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Implementar atalhos de teclado se necessário
    if (e.key === "Enter" && !isLoading) {
      handleLogin(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-muted p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-santander-600 text-white font-bold">
              SP
            </div>
            <span>STRATOPJ</span>
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-center">Entre com suas credenciais para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex justify-between">
                  <span>E-mail</span>
                  {emailError && <span className="text-xs text-red-500">{emailError}</span>}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className={`pl-10 ${emailError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (e.target.value) validateEmail(e.target.value)
                    }}
                    onBlur={(e) => validateEmail(e.target.value)}
                    ref={emailInputRef}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                    required
                  />
                </div>
                {emailError && (
                  <div id="email-error" className="sr-only">
                    {emailError}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <span>Senha</span>
                    {passwordError && <span className="text-xs text-red-500">{passwordError}</span>}
                  </Label>
                  <button
                    type="button"
                    className="text-xs text-santander-600 hover:underline"
                    onClick={() => setShowRecoveryInfo(!showRecoveryInfo)}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`pl-10 ${passwordError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (e.target.value) validatePassword(e.target.value)
                    }}
                    onBlur={(e) => validatePassword(e.target.value)}
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "password-error" : undefined}
                    required
                  />
                </div>
                {passwordError && (
                  <div id="password-error" className="sr-only">
                    {passwordError}
                  </div>
                )}
              </div>

              <AnimatePresence>
                {showRecoveryInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert className="mt-2">
                      <Info className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        Para recuperar sua senha, entre em contato com o administrador do sistema ou clique em
                        "Solicitar acesso" abaixo.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Lembrar de mim
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-santander-600 hover:bg-santander-700"
                disabled={isLoading}
                onKeyDown={handleKeyDown}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <span>Não tem uma conta? </span>
              <a href="#" className="text-santander-600 hover:underline">
                Solicite acesso
              </a>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
