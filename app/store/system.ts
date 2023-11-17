import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type TSystemStoreState = {
    currentChat: number,
    isSending: boolean
}

export const useSystemStore = create<TSystemStoreState>()(
    immer((set, get) => ({
        currentChat: 0,
        isSending: false,
        setCurrentChat: (idx: number) =>
            set((state) => {
                state.currentChat = idx
            }),
        setIsSending: (s: boolean) =>
            set((state) => {
                state.isSending = s
            })
    }))
)