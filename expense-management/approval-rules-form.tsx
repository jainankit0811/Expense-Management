"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { mockUsers } from "@/lib/mock-data"
import type { ApprovalRule } from "@/lib/types"
import { useState } from "react"

interface ApprovalRulesFormProps {
  onSave?: (rule: ApprovalRule) => void
  initialData?: ApprovalRule
}

export default function ApprovalRulesForm({ onSave, initialData }: ApprovalRulesFormProps) {
  const { toast } = useToast()
  const [selectedUser, setSelectedUser] = useState(initialData?.userId || "")
  const [approvers, setApprovers] = useState(
    initialData?.approvers || [
      { id: "2", name: "John", required: true, order: 1 },
      { id: "3", name: "Mitchell", required: false, order: 2 },
      { id: "4", name: "Andreas", required: false, order: 3 },
    ],
  )
  const [isManagerApprover, setIsManagerApprover] = useState(initialData?.isManagerApprover ?? true)
  const [approversSequence, setApproversSequence] = useState(initialData?.approversSequence ?? false)
  const [minApprovalPercentage, setMinApprovalPercentage] = useState(
    initialData?.minimumApprovalPercentage?.toString() || "50",
  )

  const employees = mockUsers.filter((u) => u.role === "employee")
  const managers = mockUsers.filter((u) => u.role === "manager" || u.role === "admin")

  const toggleApproverRequired = (approverId: string) => {
    setApprovers((prev) => prev.map((a) => (a.id === approverId ? { ...a, required: !a.required } : a)))
  }

  const handleSave = () => {
    const rule: ApprovalRule = {
      id: initialData?.id || Date.now().toString(),
      userId: selectedUser,
      approvers,
      isManagerApprover,
      approversSequence,
      minimumApprovalPercentage: Number.parseInt(minApprovalPercentage),
    }
    onSave?.(rule)
    toast({
      title: "Approval rule saved",
      description: "The approval rule has been configured successfully",
    })
  }

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <CardTitle>Admin (Approval rules)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="user">User</Label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger id="user">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Dynamic dropdown - Initially the manager set on user record should be set, admin can change manager for
            approval if required.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Approvers</Label>
            <div className="flex items-center gap-2">
              <Label htmlFor="isManagerApprover" className="text-sm font-normal">
                Is manager an approver?
              </Label>
              <Checkbox
                id="isManagerApprover"
                checked={isManagerApprover}
                onCheckedChange={(checked) => setIsManagerApprover(checked === true)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            If this field is checked then by default the approve request would go to his/her manager first, before going
            to other approvers.
          </p>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 bg-muted/50 px-4 py-2 text-sm font-medium">
              <div className="col-span-1">#</div>
              <div className="col-span-7">Name</div>
              <div className="col-span-4 text-right">Required</div>
            </div>
            {approvers.map((approver, index) => (
              <div key={approver.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-t border-border items-center">
                <div className="col-span-1 text-muted-foreground">{index + 1}</div>
                <div className="col-span-7 font-medium">{approver.name}</div>
                <div className="col-span-4 flex justify-end">
                  <Checkbox checked={approver.required} onCheckedChange={() => toggleApproverRequired(approver.id)} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            If this field is checked, then employee's manager, if he approves/rejects then only request goes to mitchell
            and so on. If the required approver rejects the request, then expense request is auto-rejected.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="approversSequence"
              checked={approversSequence}
              onCheckedChange={(checked) => setApproversSequence(checked === true)}
            />
            <Label htmlFor="approversSequence">Approvers Sequence</Label>
          </div>
          <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-2 text-sm">
            <p className="text-muted-foreground">
              If this field is ticked true then the mentioned sequence of approvers matters, that is first the request
              goes to John, if he approves/rejects then only request goes to Mitchell and so on.
            </p>
            <p className="text-muted-foreground">
              If the required approver rejects the request, then expense request is auto-rejected.
            </p>
            <p className="text-muted-foreground">
              If not ticked then send approver request to all approvers at the same time.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minPercentage">Minimum Approval percentage</Label>
          <div className="flex items-center gap-2">
            <Input
              id="minPercentage"
              type="number"
              min="0"
              max="100"
              value={minApprovalPercentage}
              onChange={(e) => setMinApprovalPercentage(e.target.value)}
              className="w-32"
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="w-full">
            Save Approval Rule
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
