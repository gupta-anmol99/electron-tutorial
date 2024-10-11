import {
  CreateNoteType,
  DeleteNoteType,
  GetNotesType,
  ReadNoteType,
  WriteNoteType
} from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error(
    'contextIsolation must be enabled in the renderer process for @electron-toolkit/preload to work'
  )
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotesType>) => ipcRenderer.invoke('getNotes', ...args),
    readNote: (...args: Parameters<ReadNoteType>) => ipcRenderer.invoke('readNote', ...args),
    writeNote: (...args: Parameters<WriteNoteType>) => ipcRenderer.invoke('writeNote', ...args),
    createNote: (...args: Parameters<CreateNoteType>) => ipcRenderer.invoke('createNote', ...args),
    deleteNote: (...args: Parameters<DeleteNoteType>) => ipcRenderer.invoke('deleteNote', ...args)
  })
} catch (e) {
  console.error(e)
}
