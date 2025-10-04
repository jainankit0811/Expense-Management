"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/currency-utils"
import type { Expense } from "@/lib/types"

interface ExpenseListProps {
  expenses?: Expense[]
  onEdit?: (expense: Expense) => void
  showEmployee?: boolean
}

export default function ExpenseList({ expenses = [], onEdit, showEmployee = false }: ExpenseListProps) {
  const getStatusBadge = (status: Expense["status"]) => {
    const variants: Record<Expense["status"], "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      submitted: "secondary",
      waiting_approval: "default",
      approved: "default",
      rejected: "destructive",
    }

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status.replace("_", " ")}
      </Badge>
    )
  }

  return (
    <div className="border-2 border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {showEmployee && <TableHead>Employee</TableHead>}
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Paid By</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            {onEdit && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showEmployee ? 9 : 8} className="text-center text-muted-foreground py-8">
                No expenses found
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                {showEmployee && <TableCell className="font-medium">{expense.employeeName}</TableCell>}
                <TableCell>{expense.description}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.paidBy}</TableCell>
                <TableCell className="max-w-xs truncate">{expense.remarks || "None"}</TableCell>
                <TableCell className="font-mono">
                  {formatCurrency(expense.amount, expense.currency)}
                  {expense.convertedAmount && (
                    <span className="text-xs text-muted-foreground block">
                      ≈ {formatCurrency(expense.convertedAmount, expense.baseCurrency || "USD")}
                    </span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(expense.status)}</TableCell>
                {onEdit && (
                  <TableCell>
                    {expense.status === "draft" && (
                      <Button size="sm" variant="ghost" onClick={() => onEdit(expense)}>
                        Edit
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
