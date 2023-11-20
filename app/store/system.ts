import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import prompt_zh from "@/app/data/prompts_zh"

type TSystemConfig = {
    api_url: string
    api_key: string
    model: string
    temperature: number
    top_p: number
    frequency_penalty: number
    presence_penalty: number
    autoSkip: boolean
    autoRender: boolean
    seed?: number
}

type TPrompts = {
    prompt: Array<any>
    role: Array<any>
}

type TSystemStoreState = {
    config: TSystemConfig
    currentChat: number
    isSending: boolean
    isShowSetting: boolean
    isShowCard: boolean
    prompts: TPrompts
}

type TSystemStoreAction = {
    setCurrentChat: (idx: number) => void
    setIsSending: (s: boolean) => void
    setIsShowSetting: (s: boolean) => void
    setIsShowCard: (s: boolean) => void
    resetConfig: () => void
    initPrompts: () => void
    addPrompt: (p: any) => boolean
    editPrompt: (act: string, prompt: string) => void
    removePrompt: (act: string) => void
}

const config: TSystemConfig = {
    api_url: 'https://api.openai.com/v1/chat/completions',
    api_key: '',
    model: 'gpt-3.5',
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    autoSkip: false,
    autoRender: true,
    seed: 0
}

export const useSystemStore = create<TSystemStoreState & TSystemStoreAction>()(
    immer((set, get) => ({
        config: config,
        currentChat: 0,
        isSending: false,
        isShowSetting: true,
        isShowCard: true,
        prompts: {
            prompt: [],
            role: []
        },
        setConfig: (attr: string, value: any) =>
            set((state) => {
                state.config = {
                    ...state.config,
                    [attr]: value
                }
            }),
        resetConfig: () =>
            set((state) => {
                state.config = config
            }),
        setCurrentChat: (idx: number) =>
            set((state) => {
                state.currentChat = idx
            }),
        setIsSending: (s: boolean) =>
            set((state) => {
                state.isSending = s
            }),
        setIsShowSetting: (s: boolean) =>
            set((state) => {
                state.isShowSetting = s
            }),
        setIsShowCard: (s: boolean) =>
            set((state) => {
                state.isShowCard = s
            }),
        initPrompts: () =>
            set((state) => {
                state.prompts = {
                    prompt: prompt_zh(),
                    role: []
                }
            }),
        addPrompt: (prompt: any) => {
            const index = get().prompts?.prompt.findIndex((p) => p.act === prompt.act)
            if (index !== -1) return false
            set((state) => {
                state.prompts.prompt = [prompt, ...state.prompts.prompt]
            })
            return true
        },
        removePrompt: (act: string) => {
            set((state) => {
                state.prompts.prompt = state.prompts.prompt.filter((p) => p.act !== act)
            })
        },
        editPrompt: (act: string, prompt: string) => {
            set((state) => {
                state.prompts.prompt = state.prompts.prompt.map((p) => {
                    if (p.act === act) {
                        return {
                            ...p,
                            prompt: prompt
                        }
                    } else {
                        return p
                    }
                })
            })
        }
    }))
)