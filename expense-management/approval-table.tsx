"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/currency-utils"
import { mockExpenses } from "@/lib/mock-data"
import type { Expense } from "@/lib/types"
import { Check, X } from "lucide-react"
import { useState } from "react"

interface ApprovalTableProps {
  expenses?: Expense[]
  onApprove?: (expenseId: string) => void
  onReject?: (expenseId: string) => void
}

export default function ApprovalTable({ expenses: propExpenses, onApprove, onReject }: ApprovalTableProps) {
  const [expenses, setExpenses] = useState<Expense[]>(
    propExpenses || mockExpenses.filter((e) => e.status === "submitted" || e.status === "waiting_approval"),
  )
  const { toast } = useToast()

  const handleApprove = (expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId))
    onApprove?.(expenseId)
    toast({
      title: "Expense approved",
      description: "The expense request has been approved successfully",
    })
  }

  const handleReject = (expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId))
    onReject?.(expenseId)
    toast({
      title: "Expense rejected",
      description: "The expense request has been rejected",
    })
  }

  return (
    <div className="border-2 border-border rounded-lg overflow-hidden">
      <div className="bg-muted/50 px-4 py-3 border-b border-border">
        <h3 className="font-semibold">Approvals to review</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead>Approval Subject</TableHead>
            <TableHead>Request Owner</TableHead>
            <TableHead>Referrer</TableHead>
            <TableHead>Request Status</TableHead>
            <TableHead>Total amount (in company's base currency)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No pending approvals
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-muted/20">
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell>{expense.employeeName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    {expense.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{expense.status === "submitted" ? "approved" : "pending"}</Badge>
                </TableCell>
                <TableCell className="font-mono">
                  {formatCurrency(expense.convertedAmount || expense.amount, expense.baseCurrency || "USD")}
                  {expense.currency !== expense.baseCurrency && (
                    <span className="text-xs text-muted-foreground block">
                      Original: {formatCurrency(expense.amount, expense.currency)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleApprove(expense.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(expense.id)}>
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {expenses.length > 0 && (
        <div className="px-4 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
          Once the expense is approved/rejected, that record should get set as readonly and the submit button should
          become invisible. Now, there should be a log history visible.
        </div>
      )}
    </div>
  )
}
