import * as React from "react"

const TOAST_LIMIT = 1


type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  duration?: number
}

type State = {
  toasts: Toast[]
}

enum ActionType {
  ADD_TOAST,
  UPDATE_TOAST,
  DISMISS_TOAST,
  REMOVE_TOAST,
}

type Action = 
  | { type: ActionType.ADD_TOAST; toast: Toast }
  | { type: ActionType.UPDATE_TOAST; toast: Partial<Toast> }
  | { type: ActionType.DISMISS_TOAST; toastId?: Toast["id"] }
  | { type: ActionType.REMOVE_TOAST; toastId?: Toast["id"] }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case ActionType.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case ActionType.DISMISS_TOAST:
      const { toastId } = action

      // ! Side effects ! Clear timeouts
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t, open: false } : t
          ),
        }
      } else {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({ ...t, open: false })),
        }
      }

    case ActionType.REMOVE_TOAST:
      if (action.toastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== action.toastId),
        }
      }
      return state
  }
}



function useToast() {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] })

  const addToast = React.useCallback(
    (toast: Toast) => {
      dispatch({ type: ActionType.ADD_TOAST, toast })
    },
    [dispatch]
  )

  const updateToast = React.useCallback(
    (toast: Partial<Toast>) => {
      dispatch({ type: ActionType.UPDATE_TOAST, toast })
    },
    [dispatch]
  )

  const dismissToast = React.useCallback(
    (toastId?: Toast["id"]) => {
      dispatch({ type: ActionType.DISMISS_TOAST, toastId })
    },
    [dispatch]
  )

  const removeToast = React.useCallback(
    (toastId?: Toast["id"]) => {
      dispatch({ type: ActionType.REMOVE_TOAST, toastId })
    },
    [dispatch]
  )

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          dismissToast(toast.id)
        }, toast.duration)

        return () => clearTimeout(timer)
      }
    })
  }, [state.toasts, dismissToast])

  return {
    toasts: state.toasts,
    addToast,
    updateToast,
    dismissToast,
    removeToast,
  }
}

export { useToast, ActionType }
