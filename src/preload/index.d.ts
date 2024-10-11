import { ElectronAPI } from '@electron-toolkit/preload'
import {
  CreateNoteType,
  DeleteNoteType,
  GetNotesType,
  ReadNoteType,
  WriteNoteType
} from '@shared/types'

declare global {
  interface Window {
    context: {
      locale: string
      getNotes: GetNotesType
      readNote: ReadNoteType
      writeNote: WriteNoteType
      createNote: CreateNoteType
      deleteNote: DeleteNoteType
    }
  }
}
