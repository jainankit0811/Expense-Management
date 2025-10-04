export type UserRole = "admin" | "manager" | "employee"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  managerId?: string
  currency: string
}

export interface Expense {
  id: string
  employeeId: string
  employeeName: string
  description: string
  category: string
  amount: number
  currency: string
  convertedAmount?: number
  baseCurrency?: string
  date: string
  paidBy: string
  remarks: string
  receiptUrl?: string
  status: "draft" | "submitted" | "waiting_approval" | "approved" | "rejected"
  approvalHistory: ApprovalRecord[]
  createdAt: string
  updatedAt: string
}

export interface ApprovalRecord {
  approverId: string
  approverName: string
  status: "pending" | "approved" | "rejected"
  timestamp?: string
  comments?: string
}

export interface ApprovalRule {
  id: string
  userId: string
  approvers: ApproverConfig[]
  isManagerApprover: boolean
  approversSequence: boolean
  minimumApprovalPercentage?: number
}

export interface ApproverConfig {
  id: string
  name: string
  required: boolean
  order?: number
}

export const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "INR", symbol: "₹", rate: 83.12 },
  { code: "JPY", symbol: "¥", rate: 149.5 },
]

export const CATEGORIES = [
  "Food",
  "Transportation",
  "Accommodation",
  "Office Supplies",
  "Entertainment",
  "Travel",
  "Other",
]
