import { NoteContent, NoteInfo } from './models'

export type GetNotesType = () => Promise<NoteInfo[]>
export type ReadNoteType = (title: NoteInfo['title']) => Promise<NoteContent>
export type WriteNoteType = (title: NoteInfo['title'], content: NoteContent) => Promise<void>

export type CreateNoteType = () => Promise<NoteInfo['title'] | false>

export type DeleteNoteType = (title: NoteInfo['title']) => Promise<boolean>
