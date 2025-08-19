"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { UploadExtrato } from "@/components/upload-extrato"

export default function EnviarExtratoPage() {
  const [uploadedData, setUploadedData] = useState<any>(null)

  const handleUploadComplete = (data: any) => {
    setUploadedData(data)
    // Aqui você poderia fazer outras ações, como redirecionar para a página de análise
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Enviar Extrato</h1>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Dica</AlertTitle>
          <AlertDescription>
            Os arquivos enviados são processados usando Python (pandas) para análise de dados financeiros. Isso garante
            uma análise precisa e rápida dos seus dados.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload">Upload de Arquivo</TabsTrigger>
            <TabsTrigger value="manual">Preenchimento Manual</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <UploadExtrato onUploadComplete={handleUploadComplete} />
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preenchimento Manual</CardTitle>
                <CardDescription>Insira manualmente os dados do seu extrato bancário para análise.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Data Inicial</Label>
                      <Input id="start-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">Data Final</Label>
                      <Input id="end-date" type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="saldo-inicial">Saldo Inicial (R$)</Label>
                    <Input id="saldo-inicial" type="number" placeholder="0,00" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receitas">Receitas Totais (R$)</Label>
                    <Input id="receitas" type="number" placeholder="0,00" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="despesas">Despesas Totais (R$)</Label>
                    <Input id="despesas" type="number" placeholder="0,00" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="saldo-final">Saldo Final (R$)</Label>
                    <Input id="saldo-final" type="number" placeholder="0,00" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-santander-600 hover:bg-santander-700">Enviar Dados</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
