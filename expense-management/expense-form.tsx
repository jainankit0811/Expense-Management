"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { convertCurrency } from "@/lib/currency-utils"
import { extractTextFromImage } from "@/lib/ocr-utils"
import { CATEGORIES, CURRENCIES, type Expense } from "@/lib/types"
import { Loader2, Upload, X } from "lucide-react"
import type React from "react"
import { useState } from "react"

interface ExpenseFormProps {
  onSubmit?: (expense: Partial<Expense>, isDraft: boolean) => void
  initialData?: Partial<Expense>
}

export default function ExpenseForm({ onSubmit, initialData }: ExpenseFormProps) {
  const { toast } = useToast()
  const [description, setDescription] = useState(initialData?.description || "")
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0])
  const [category, setCategory] = useState(initialData?.category || "")
  const [paidBy, setPaidBy] = useState(initialData?.paidBy || "")
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "")
  const [currency, setCurrency] = useState(initialData?.currency || "USD")
  const [remarks, setRemarks] = useState(initialData?.remarks || "")
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(initialData?.receiptUrl || null)
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      const reader = new FileReader()
      reader.onloadend = async () => {
        const preview = reader.result as string
        setReceiptPreview(preview)

        // Process OCR
        setIsProcessingOCR(true)
        try {
          const ocrResult = await extractTextFromImage(file)

          // Auto-fill form fields from OCR results
          if (ocrResult.amount) {
            setAmount(ocrResult.amount.toString())
          }
          if (ocrResult.merchant) {
            setDescription(ocrResult.merchant)
          }
          if (ocrResult.date) {
            // Try to parse and format the date
            try {
              const parsedDate = new Date(ocrResult.date)
              if (!isNaN(parsedDate.getTime())) {
                setDate(parsedDate.toISOString().split("T")[0])
              }
            } catch {
              // If date parsing fails, keep current date
            }
          }

          toast({
            title: "Receipt processed",
            description: "Expense details extracted from receipt",
          })
        } catch (error) {
          console.error("[v0] OCR processing error:", error)
          toast({
            title: "OCR processing failed",
            description: "Please enter expense details manually"
          })
        } finally {
          setIsProcessingOCR(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeReceipt = () => {
    setReceiptFile(null)
    setReceiptPreview(null)
  }

  const handleSubmit = (isDraft: boolean) => {
    const baseCurrency = "USD"
    const numAmount = Number.parseFloat(amount)
    const convertedAmount = convertCurrency(numAmount, currency, baseCurrency)

    const expenseData: Partial<Expense> = {
      description,
      date,
      category,
      paidBy,
      amount: numAmount,
      currency,
      convertedAmount,
      baseCurrency,
      remarks,
      receiptUrl: receiptPreview || undefined,
      status: isDraft ? "draft" : "submitted",
    }

    onSubmit?.(expenseData, isDraft)

    // Show success toast
    toast({
      title: isDraft ? "Draft saved" : "Expense submitted",
      description: isDraft ? "Your expense has been saved as draft" : "Your expense has been submitted for approval",
    })
  }

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Expense Details</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-muted">Draft</span>
            <span>→</span>
            <span className="px-3 py-1 rounded-full bg-muted">Waiting approval</span>
            <span>→</span>
            <span className="px-3 py-1 rounded-full bg-muted">Approved</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Restaurant bill"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Expense Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid by</Label>
            <Input id="paidBy" placeholder="Name" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Total amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
              />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Employee can submit expense in any currency (currency in which they spent the money in receipt)
            </p>
            {amount && currency !== "USD" && (
              <p className="text-xs text-emerald-600">
                ≈ ${convertCurrency(Number.parseFloat(amount), currency, "USD").toFixed(2)} USD
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              placeholder="Additional notes"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Attach Receipt</Label>
          {receiptPreview ? (
            <div className="relative inline-block">
              <img
                src={receiptPreview || "/placeholder.svg"}
                alt="Receipt preview"
                className="max-w-xs rounded-lg border"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2"
                onClick={removeReceipt}
                type="button"
                disabled={isProcessingOCR}
              >
                <X className="h-4 w-4" />
              </Button>
              {isProcessingOCR && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm font-medium">Processing receipt...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Input
                id="receipt"
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="hidden"
                disabled={isProcessingOCR}
              />
              <Label htmlFor="receipt" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload receipt or take a photo</p>
                <p className="text-xs text-emerald-600 mt-1">OCR enabled - details will be auto-extracted</p>
              </Label>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            User should be able to upload a receipt from their computer or take a photo of the receipt, using OCR a new
            expense should get created with total amount and other necessary details.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => handleSubmit(true)} className="flex-1" disabled={isProcessingOCR}>
            Save as Draft
          </Button>
          <Button onClick={() => handleSubmit(false)} className="flex-1" disabled={isProcessingOCR}>
            Submit for Approval
          </Button>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p>
            Once submitted the record should become readonly for employee and the submit button should be invisible and
            the submit button should be invisible and state should change to pending approval. Now, there should be a
            log history visible showing at what time which user approved/rejected your request at what time.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
