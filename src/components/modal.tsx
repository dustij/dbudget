import * as Dialog from "@radix-ui/react-dialog"

import type { FC } from "react"

interface ModalProps {
  isOpen: boolean
  onChange: (open: boolean) => void
  title: string
  description: string
  children: React.ReactNode
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  children,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="
          fixed
          inset-0
          bg-neutral-900/90
          backdrop-blur-sm
        "
        />
        <Dialog.Content></Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal
