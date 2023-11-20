import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { random32BitNumber } from '../utils/utils'
import { TChat, TChatConfig, TMessage, TChatsStore } from '..'

const config: TChatConfig = {
  model: 'gpt-4',
  title: '新的聊天',
  temperature: 0.5,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  autoSkip: false,
  autoRender: true,
}

const message: TMessage = {
  id: random32BitNumber(),
  message: "empty",
  type: 'text',
  role: 'user',
  createTime: new Date(),
  updateTime: new Date(),
  model: 'gpt-3.5',
  fold: false,
  render: true,
  skip: false,
  token: 0
}

export const useChatsStore = create<TChatsStore>()(
  immer((set, get) => ({
    chats: [],
    getChatsNumber: () => {
      return get().chats.length
    },
    getChatsName: () => {
      return get().chats.map((chat, idx) => ({ id: chat.id, index: idx, title: chat.config.title, number: chat.messages.length }))
    },
    changeChats: (chats: Array<TChat>) =>
      set((state) => {
        state.chats = chats
      }),
    newChat: () =>
      set((state) => {
        const chat: TChat = {
          id: random32BitNumber(),
          messages: Array<TMessage>(),
          config: config
        }

        state.chats.push(chat)
      }),
    removeChat: (idx: number) =>
      set((state) => {
        if (state.chats.length === 1) {
          const chat: TChat = {
            id: random32BitNumber(),
            messages: Array<TMessage>(),
            config: config
          }

          state.chats = Array<TChat>(chat)
        } else {
          state.chats.splice(idx, 1)
        }
      }),
    changeMessages: (chatId: number, messages: Array<TMessage>) =>
      set((state) => {
        state.chats[chatId].messages = messages
      }),
    newMessage: (chatId: number) =>
      set((state) => {
        state.chats[chatId].messages.push(message)
      }),
    getMessages: (chatId: number) => {
      if (get().chats.length === 0) {
        get().newChat()
        return get().chats[0].messages
      }
      return get().chats[chatId]?.messages
    },
    addMessage: (chatId: number, msg: TMessage, pos: number | undefined = undefined) =>
      set((state) => {
        if (pos) {
          state.chats[chatId].messages.splice(pos, 0, msg)
        } else {
          state.chats[chatId].messages.push(msg)
        }
      }),
    removeMessage: (chatId: number, msgId: number) =>
      set((state) => {
        state.chats[chatId].messages = state.chats[chatId].messages.filter((msg: TMessage) => msg.id !== msgId)
      }),
    setMessage: (chatId: number, msgId: number, attr: string, value: any) =>
      set((state: any) => {
        state.chats[chatId].messages = state.chats[chatId].messages.map((msg: TMessage) => {
          if (msg.id === msgId) {
            return {
              ...msg,
              [attr]: value
            }
          } else {
            return msg
          }
        })
      }),
    setConfig: (chatId: number, attr: string, value: any) =>
      set((state: any): any => {
        state.chats[chatId].config[attr] = value
      }),
  }))
)