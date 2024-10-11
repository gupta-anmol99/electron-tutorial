import { useRef } from 'react'
import { Content, RootLayout, SideBar } from './components'
import ActionButtonRow from './components/ActionButtonRow'
import DraggableTop from './components/DraggableTop'
import FloatingNoteTitle from './components/FloatingNoteTitle'
import { MarkdownEditor } from './components/MarkdownEditor'
import NotePreviewList from './components/NotePreviewList'

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  return (
    <>
      <DraggableTop />
      <RootLayout>
        <SideBar className="p-2">
          <ActionButtonRow className="flex justify-between mt-1" />
          <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
        </SideBar>
        <Content ref={contentContainerRef} className="border-l bg-zinc-900/50 border-l-white/20">
          <FloatingNoteTitle className="pt-2" />
          <MarkdownEditor />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
