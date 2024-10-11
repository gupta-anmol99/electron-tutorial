import React, { ComponentProps } from 'react'
import NewNoteButton from './buttons/NewNoteButton'
import DeleteNoteButton from './buttons/DeleteNoteButton'

const ActionButtonRow = ({ ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props}>
      <NewNoteButton />
      <DeleteNoteButton />
    </div>
  )
}

export default ActionButtonRow
