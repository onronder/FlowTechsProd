// This file should be split into two parts:
// 1. A server component that accepts only serializable props
// 2. A client component that handles the state and events

// Remove the "use client" directive from this file
// and create a client wrapper in a separate file

import dynamic from 'next/dynamic';

// Define the client component props interface matching the client component
interface AddSourceModalClientProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define the server component props interface
export interface AddSourceModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

// Dynamically import the client component with proper typing
const AddSourceModalClientDynamic = dynamic<AddSourceModalClientProps>(
  () => import('./add-source-modal-client').then(mod => mod.AddSourceModalClient),
  { ssr: false }
);

// Server component that renders the client component
export function AddSourceModal({ isOpen, setIsOpen }: AddSourceModalProps): JSX.Element {
  return <AddSourceModalClientDynamic isOpen={isOpen} onOpenChange={setIsOpen} />;
}