import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import prompt_zh from "@/app/data/prompts_zh"
import { TSystemConfig, TSystemStoreAction, TSystemStoreState } from '..'

const config: TSystemConfig = {
    api_url: 'https://api.openai.com/v1/chat/completions',
    api_key: '',
    model: 'gpt-3.5-turbo',
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
        isSending: false,
        sendingMsgId: 0,
        isShowSetting: true,
        isShowCard: true,
        needScroll: false,
        prompts: {
            prompt: [],
            role: []
        },
        models: [
            { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
            { value: 'gpt-4', label: 'gpt-4' },
        ],
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
        setIsSending: (s: boolean) =>
            set((state) => {
                state.isSending = s
            }),
        setSendingMsgId: (msgId: number) =>
            set((state) => {
                state.sendingMsgId = msgId
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
        },
        setModels: (models: Array<any>) =>
            set((state) => {
                state.models = models
            }),
        setNeedScroll: (scroll: boolean) =>
            set((state) => {
                state.needScroll = scroll
            })
    }))
)