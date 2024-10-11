import React, { ComponentProps } from 'react'
import ActionButton from './ActionButton'
import { LuFileSignature } from 'react-icons/lu'
import { useSetAtom } from 'jotai'
import { createEmptyNoteAtom } from '@renderer/store'

const NewNoteButton = ({ ...props }: ComponentProps<'button'>) => {
  const createNewNote = useSetAtom(createEmptyNoteAtom)

  const handleCreateButton = async () => {
    await createNewNote()
  }

  return (
    <ActionButton onClick={handleCreateButton} {...props}>
      <LuFileSignature className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}

export default NewNoteButton
