import React, { ComponentProps } from 'react'
import ActionButton from './ActionButton'
import { FaRegTrashCan } from 'react-icons/fa6'
import { useSetAtom } from 'jotai'
import { deleteNoteAtom } from '@renderer/store'

const DeleteNoteButton = ({ ...props }: ComponentProps<'button'>) => {
  const delteNote = useSetAtom(deleteNoteAtom)

  const handleDeleteButton = async () => {
    await delteNote()
  }

  return (
    <ActionButton onClick={handleDeleteButton} {...props}>
      <FaRegTrashCan className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}

export default DeleteNoteButton
