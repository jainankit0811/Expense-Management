"use client"

import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  duration?: number
  onOpenChange?: (open: boolean) => void
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

type ActionType = typeof actionTypes

type Action = 
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] }

interface State {
  toasts: ToasterToast[]
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST:
      const { toastId } = action

      // ! Side effects ! - This is not beautiful, but it works.
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t, onOpenChange: (open) => {
              if (!open) {
                dispatch({ type: actionTypes.REMOVE_TOAST, toastId: t.id })
              }
            }} : t
          ),
        }
      } else {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({ ...t, onOpenChange: (open) => {
            if (!open) {
              dispatch({ type: actionTypes.REMOVE_TOAST, toastId: t.id })
            }
          }})),
        }
      }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
      return state
  }
}

const listeners: ((state: State) => void)[] = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

type Toast = Omit<ToasterToast, "id">

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast: React.useCallback((toast: Toast) => {
      const id = Math.random().toString(36).substring(2, 9)

      const update = (toast: Partial<ToasterToast>) =>
        dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...toast, id } })
      const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

      dispatch({ type: actionTypes.ADD_TOAST, toast: { ...toast, id, onOpenChange: (open) => {
        if (!open) {
          dismiss()
        }
      } } })

      return { id: id, update, dismiss }
    }, []),
  }
}

export { useToast, reducer }