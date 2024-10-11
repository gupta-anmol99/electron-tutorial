import { appDirectory, fileEncoding } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import {
  CreateNoteType,
  DeleteNoteType,
  GetNotesType,
  ReadNoteType,
  WriteNoteType
} from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readdir, readFile, remove, stat, writeFile } from 'fs-extra'
import { homedir } from 'os'
import path from 'path'
import { isEmpty } from 'lodash'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

export const getRootDir = () => {
  return `${homedir()}/${appDirectory}`
}

export const getNotes: GetNotesType = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  if (isEmpty(notes)) {
    console.error('No notes found, creating a welcome note')

    const content = await readFile(welcomeNoteFile, { encoding: fileEncoding })

    // create a welcome note

    await writeFile(`${rootDir}/Welcome.md`, content, { encoding: fileEncoding })

    notes.push('Welcome.md')
  }

  return Promise.all(notes.map(getNoteInfoFromFileName))
}

export const getNoteInfoFromFileName = async (filename: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${filename}`)

  return {
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNoteType = async (filename) => {
  const rootDir = getRootDir()
  return readFile(`${rootDir}/${filename}.md`, { encoding: fileEncoding })
}

export const writeNote: WriteNoteType = async (filename, content) => {
  const rootDir = getRootDir()
  console.info(`Writing note ${filename} to ${rootDir}`)

  return writeFile(`${rootDir}/${filename}.md`, content, { encoding: fileEncoding })
}

export const createNote: CreateNoteType = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'Create a new note',
    defaultPath: `${rootDir}/Untitled.md`,
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    console.error('User canceled note creation')
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)

  const normalizedRootDir = path.normalize(rootDir)
  const normalizedParentDir = path.normalize(parentDir)

  if (normalizedParentDir != normalizedRootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Error',
      message: 'You can only create notes in the default directory.',
      detail: `The default directory is ${rootDir}.`
    })

    return false
  }

  console.info(`Creating note ${filename} in ${rootDir}`)

  await writeFile(filePath, '', { encoding: fileEncoding })

  return filename
}

export const deleteNote: DeleteNoteType = async (title) => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete note',
    message: `Are you sure you want to delete "${title}"?`,
    detail: 'This action cannot be undone.',
    buttons: ['Delete', 'Cancel'], // 0: Delete, 1: Cancel
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    console.info('User canceled note deletion')
    return false
  }

  const filePath = `${rootDir}/${title}.md`

  console.info(`Deleting note ${title} from ${rootDir}`)

  await remove(filePath)
  return true
}
