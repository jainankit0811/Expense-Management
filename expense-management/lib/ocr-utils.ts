"use client"

import { createWorker } from "tesseract.js"

export interface OCRResult {
  text: string
  amount?: number
  date?: string
  merchant?: string
}

export async function extractTextFromImage(imageFile: File | string): Promise<OCRResult> {
  const worker = await createWorker("eng")

  try {
    const {
      data: { text },
    } = await worker.recognize(imageFile)

    // Parse the extracted text for common receipt patterns
    const result: OCRResult = {
      text: text.trim(),
    }

    // Extract amount (look for currency symbols and numbers)
    const amountPatterns = [
      /(?:total|amount|sum)[:\s]*[$€£¥₹]?\s*(\d+[.,]\d{2})/i,
      /[$€£¥₹]\s*(\d+[.,]\d{2})/,
      /(\d+[.,]\d{2})\s*[$€£¥₹]/,
    ]

    for (const pattern of amountPatterns) {
      const match = text.match(pattern)
      if (match) {
        result.amount = Number.parseFloat(match[1].replace(",", "."))
        break
      }
    }

    // Extract date (various date formats)
    const datePatterns = [
      /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/,
      /(\d{4}[/-]\d{1,2}[/-]\d{1,2})/,
      /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})/i,
    ]

    for (const pattern of datePatterns) {
      const match = text.match(pattern)
      if (match) {
        result.date = match[1]
        break
      }
    }

    // Extract merchant name (usually at the top of receipt)
    const lines = text.split("\n").filter((line) => line.trim().length > 0)
    if (lines.length > 0) {
      result.merchant = lines[0].trim()
    }

    return result
  } finally {
    await worker.terminate()
  }
}
