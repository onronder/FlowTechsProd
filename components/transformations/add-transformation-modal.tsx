// Split this file into two parts:
// 1. A server component that accepts only serializable props
// 2. A client component that handles the state and events

import { AddTransformationModalClient } from './add-transformation-modal-client'

// Server component interface (serializable props only)
interface AddTransformationModalProps {
  isOpen: boolean
  onClose: () => void
}

// Server component that renders the client component
export function AddTransformationModal(props: AddTransformationModalProps) {
  return <AddTransformationModalClient {...props} />
}

