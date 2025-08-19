"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileUp, Upload, FileText, AlertCircle, Download, CheckCircle, X, Eye, FileType } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { TooltipInfo } from "@/components/ui/tooltip-info"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UploadExtratoProps {
  onUploadComplete?: (data: any) => void
  className?: string
}

interface FilePreviewData {
  totalReceitas: string
  totalDespesas: string
  transacoes: number
  amostraDados?: Array<{
    data: string
    descricao: string
    valor: number
    tipo: "receita" | "despesa"
  }>
}

export function UploadExtrato({ onUploadComplete, className }: UploadExtratoProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [filePreview, setFilePreview] = useState<FilePreviewData | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewTab, setPreviewTab] = useState("resumo")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Validar formato do arquivo
  const validateFileFormat = (file: File) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    const validExtensions = ["csv", "json", "xlsx", "xls"]

    if (!validExtensions.includes(fileExtension || "")) {
      setFileError(
        `Formato de arquivo não suportado. Por favor, envie um arquivo ${validExtensions.join(", ").toUpperCase()}.`,
      )
      return false
    }

    // Validar tamanho do arquivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError("O arquivo é muito grande. O tamanho máximo permitido é 10MB.")
      return false
    }

    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (!validateFileFormat(file)) {
        setSelectedFile(null)
        return
      }

      setFileError(null)
      setSelectedFile(file)
      setUploadSuccess(false)
      generatePreview(file)
    }
  }

  const generatePreview = (file: File) => {
    // Simulando leitura do arquivo para preview
    const reader = new FileReader()

    reader.onload = () => {
      // Simulando dados de preview
      setTimeout(() => {
        setFilePreview({
          totalReceitas: "R$ 64.000,00",
          totalDespesas: "R$ 42.000,00",
          transacoes: 127,
          amostraDados: [
            { data: "01/05/2025", descricao: "Venda de Produtos", valor: 5200, tipo: "receita" },
            { data: "03/05/2025", descricao: "Pagamento Fornecedor", valor: 1800, tipo: "despesa" },
            { data: "05/05/2025", descricao: "Serviços Prestados", valor: 3500, tipo: "receita" },
            { data: "10/05/2025", descricao: "Aluguel", valor: 4500, tipo: "despesa" },
            { data: "15/05/2025", descricao: "Venda de Produtos", valor: 6800, tipo: "receita" },
          ],
        })
      }, 1000)
    }

    reader.readAsText(file)
  }

  const handleUpload = () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulando upload com progresso
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadSuccess(true)

          // Notificar o componente pai que o upload foi concluído
          if (onUploadComplete && filePreview) {
            onUploadComplete(filePreview)
          }

          return 100
        }
        return prev + 5
      })
    }, 150)
  }

  const downloadExample = () => {
    // Simulação de download de arquivo de exemplo
    const link = document.createElement("a")
    link.href = "#"
    link.download = "exemplo_extrato.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]

      if (!validateFileFormat(file)) {
        setSelectedFile(null)
        return
      }

      setFileError(null)
      setSelectedFile(file)
      setUploadSuccess(false)
      generatePreview(file)
    }
  }

  const resetFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    setFileError(null)
    setUploadSuccess(false)
    setUploadProgress(0)
    setShowPreview(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Adicionar eventos de teclado para acessibilidade
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (dropZoneRef.current === document.activeElement) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          fileInputRef.current?.click()
        }
      }
    }

    const dropZone = dropZoneRef.current
    if (dropZone) {
      dropZone.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      if (dropZone) {
        dropZone.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [])

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <CardTitle>Upload de Extrato Bancário</CardTitle>
          <CardDescription>
            Envie seu extrato bancário para análise. Aceitamos arquivos CSV, JSON, XLS e XLSX.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            ref={dropZoneRef}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging ? "border-santander-600 bg-santander-50 dark:bg-santander-950/10" : ""
            } ${selectedFile ? "bg-muted/30" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            tabIndex={0}
            role="button"
            aria-label="Arraste e solte seu arquivo aqui ou clique para selecionar"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={`rounded-full p-4 ${isDragging ? "bg-santander-100" : "bg-muted"}`}>
                <FileUp className={`h-8 w-8 ${isDragging ? "text-santander-600" : "text-muted-foreground"}`} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Arraste e solte seu arquivo aqui ou clique para selecionar</p>
                <p className="text-xs text-muted-foreground">Suportamos arquivos CSV, JSON, XLS e XLSX até 10MB</p>
              </div>
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv,.xls,.xlsx,.json"
                onChange={handleFileChange}
                aria-label="Selecionar arquivo"
              />
              <div className="flex gap-2">
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Selecionar Arquivo
                  </label>
                </Button>
                <Button variant="outline" onClick={downloadExample}>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Exemplo
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {fileError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center p-3 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg"
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="text-sm">{fileError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedFile && !fileError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col space-y-4"
              >
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-muted/50 p-2 rounded-md">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB •{" "}
                        {selectedFile.type || "Arquivo " + selectedFile.name.split(".").pop()?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {filePreview && !uploadSuccess && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                        className="gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        {showPreview ? "Ocultar" : "Visualizar"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={resetFile}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remover arquivo</span>
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading || uploadSuccess}
                      className="bg-santander-600 hover:bg-santander-700"
                    >
                      {isUploading ? (
                        <>Enviando...</>
                      ) : uploadSuccess ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Enviado
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Enviar
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progresso</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <AnimatePresence>
                  {showPreview && filePreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border rounded-lg p-4"
                    >
                      <Tabs value={previewTab} onValueChange={setPreviewTab}>
                        <TabsList className="mb-4">
                          <TabsTrigger value="resumo">Resumo</TabsTrigger>
                          <TabsTrigger value="amostra">Amostra de Dados</TabsTrigger>
                        </TabsList>

                        <TabsContent value="resumo">
                          <h3 className="font-medium mb-3">Resumo do Arquivo</h3>
                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="bg-muted/30 p-3 rounded-md">
                              <p className="text-xs text-muted-foreground">Total de Receitas</p>
                              <p className="text-lg font-bold text-green-600">{filePreview.totalReceitas}</p>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-md">
                              <p className="text-xs text-muted-foreground">Total de Despesas</p>
                              <p className="text-lg font-bold text-red-600">{filePreview.totalDespesas}</p>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-md">
                              <p className="text-xs text-muted-foreground">Transações</p>
                              <p className="text-lg font-bold">{filePreview.transacoes}</p>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="amostra">
                          <h3 className="font-medium mb-3">Amostra de Dados</h3>
                          <div className="rounded-md border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Data</TableHead>
                                  <TableHead>Descrição</TableHead>
                                  <TableHead>Valor</TableHead>
                                  <TableHead>Tipo</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filePreview.amostraDados?.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.data}</TableCell>
                                    <TableCell>{item.descricao}</TableCell>
                                    <TableCell>
                                      R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          item.tipo === "receita"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                        }`}
                                      >
                                        {item.tipo === "receita" ? "Receita" : "Despesa"}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Mostrando 5 de {filePreview.transacoes} transações
                          </p>
                        </TabsContent>
                      </Tabs>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center p-4 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg"
              >
                <CheckCircle className="h-6 w-6 mr-3" />
                <div>
                  <p className="font-medium">Arquivo enviado com sucesso!</p>
                  <p className="text-sm">
                    Sua análise será processada em breve. Você receberá uma notificação quando estiver pronta.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Alert variant="outline" className="bg-muted/30 mt-4">
            <FileType className="h-4 w-4" />
            <AlertTitle>Formatos suportados</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                <li>
                  <strong>CSV</strong>: Valores separados por vírgula, formato padrão para extratos bancários
                </li>
                <li>
                  <strong>XLS/XLSX</strong>: Planilhas do Microsoft Excel
                </li>
                <li>
                  <strong>JSON</strong>: Formato estruturado para dados financeiros
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <TooltipInfo
              content="Seus dados são criptografados e seguros. Não compartilhamos suas informações com terceiros."
              side="right"
            />
            <span className="ml-2">Seus dados estão seguros</span>
          </div>
          <Button variant="outline">Cancelar</Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
