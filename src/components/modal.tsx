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
          z-50
          bg-neutral-900/60
          backdrop-blur-sm
        "
        />
        <Dialog.Content className="sm:max-w-[425px]">{children}</Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal
