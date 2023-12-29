import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ChatMessage } from '@/types/messages'
import { Note } from '@/types/notes'

interface AppState {
  // speech recognition states
  transcript: string
  displayTranscript: string
  topic: string
  isListening: boolean
  setTranscript: (transcript: string) => void
  setDisplayTranscript: (displayTranscript: string) => void
  setTopic: (topic: string) => void
  setIsListening: (isListening: boolean) => void
  toggleIsListening: () => void
  // chat states
  model: string
  apikey: string
  messages: ChatMessage[]
  setModel: (model: string) => void
  setApikey: (apikey: string) => void
  addMessage: (message: ChatMessage) => void
  clearMessages: () => void
  // note states
  notes: Note[]
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  deleteNote: (noteId: string) => void
}

const useAppStore = create<AppState>()((set) => ({
  transcript: '',
  displayTranscript: '',
  isListening: false,
  topic: '',
  setTranscript: (transcript: string) => set((state) => ({ transcript })),
  setDisplayTranscript: (displayTranscript: string) => set((state) => ({ displayTranscript })),
  setTopic: (topic: string) => set((state) => ({ topic })),
  setIsListening: (isListening: boolean) => set((state) => ({ isListening })),
  toggleIsListening: () => set((state) => ({ isListening: !state.isListening })),
  //
  model: 'gpt-4-1106-preview',
  apikey: '',
  messages: [],
  setModel: (model: string) => {
    set((state) => ({ model }))
  },
  setApikey: (apikey: string) => {
    set((state) => ({ apikey }))
  },
  addMessage: (message: ChatMessage) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set((state) => ({ messages: [] })),
  //
  notes: [],
  setNotes: (notes: Note[]) => set((state) => ({ notes })),
  addNote: (note: Note) => set((state) => ({ notes: [...state.notes, note] })),
  deleteNote: (noteId: string) => set((state) => ({ notes: state.notes.filter((n) => n.id !== noteId) })),
}))

export default useAppStore