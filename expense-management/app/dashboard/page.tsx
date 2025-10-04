"use client"

import ApprovalRulesForm from "@/approval-rules-form"
import ApprovalTable from "@/approval-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExpenseForm from "@/expense-form"
import ExpenseList from "@/expense-list"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DashboardPage() {
  const router = useRouter()
  const [activeView, setActiveView] = useState<"employee" | "manager" | "admin">("employee")

  const handleLogout = () => {
    router.push("/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Expense Management System</h1>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                  <TabsTrigger value="employee">Employee</TabsTrigger>
                  <TabsTrigger value="manager">Manager</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeView === "employee" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Expense</CardTitle>
                <CardDescription>Upload receipts and create expense requests</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseForm />
              </CardContent>
            </Card>
            <ExpenseList />
          </div>
        )}

        {activeView === "manager" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Manager's View</h2>
              <p className="text-muted-foreground">Review and approve expense requests</p>
            </div>
            <ApprovalTable />
          </div>
        )}

        {activeView === "admin" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin (Approval rules)</CardTitle>
                <CardDescription>Configure approval workflows and rules</CardDescription>
              </CardHeader>
              <CardContent>
                <ApprovalRulesForm />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
