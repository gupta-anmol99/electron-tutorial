import { NoteContent, NoteInfo } from '@shared/models'

import { atom } from 'jotai'
import { notesMock } from './mocks'
import { unwrap } from 'jotai/utils'

const loadNotes = async () => {
  const notes = await window.context.getNotes()

  // sort them by most recently added
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)

export const selectedNoteIndexAtom = atom<number | null>(null)

const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)

  if (selectedNoteIndex == null || !notes) {
    return null
  }
  const selectedNote = notes[selectedNoteIndex]

  const noteContent = await window.context.readNote(selectedNote.title)

  return {
    ...selectedNote,
    content: noteContent
  }
})

export const selectedNoteAtom = unwrap(
  selectedNoteAtomAsync,
  (prev) =>
    prev ?? {
      title: '',
      lastEditTime: Date.now(),
      content: ''
    }
)

export const createEmptyNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)

  if (!notes) return

  const title = await window.context.createNote()

  if (!title) return

  const newNote: NoteInfo = {
    title,
    lastEditTime: Date.now()
  }

  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== title)])

  set(selectedNoteIndexAtom, 0)
})

export const deleteNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)

  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) {
    return
  }

  const isDeleted = await window.context.deleteNote(selectedNote.title)

  if (!isDeleted) {
    return
  }

  set(
    notesAtom,
    notes.filter((notes) => notes.title !== selectedNote.title)
  )

  set(selectedNoteIndexAtom, null)
})

export const saveNoteAtom = atom(null, async (get, set, newContent: NoteContent) => {
  const notes = get(notesAtom)
  const selecteNote = get(selectedNoteAtom)

  if (!notes || !selecteNote) return

  // save the data on disk
  await window.context.writeNote(selecteNote.title, newContent)

  // update the lastEditTime for the new note

  set(
    notesAtom,
    notes.map((note) => {
      if (note.title === selecteNote.title) {
        return {
          ...note,
          lastEditTime: Date.now()
        }
      }
      return note
    })
  )
})
