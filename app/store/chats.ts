import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { random32BitNumber } from '../utils/utils'
import { arrayMove } from '@dnd-kit/sortable';
import { TChat, TChatConfig, TMessage, TChatsStore } from '..'
import { useSystemStore } from './system';

const config: TChatConfig = {
  title: '新的聊天',
  ...useSystemStore.getState().config
}

const message: TMessage = {
  id: random32BitNumber(),
  message: "empty",
  type: 'text',
  role: 'user',
  createTime: new Date(),
  updateTime: new Date(),
  model: 'gpt-3.5-turbo',
  fold: false,
  render: true,
  skip: false,
  loading: false,
  token: 0
}

const chat: TChat = {
  id: random32BitNumber(),
  messages: Array<TMessage>(),
  config: config
}

export const useChatsStore = create<TChatsStore>()(
  immer((set, get) => ({
    chats: Array<TChat>(chat),
    currentChat: 0,
    getCurrentChat: () => {
      if (get().currentChat >= get().chats.length) {
        set((state) => { state.currentChat = state.currentChat - 1 })
      }
      return get().chats[get().currentChat]
    },
    setCurrentChat: (idx: number) =>
      set((state) => {
        state.currentChat = idx
      }),
    getChats: () => {
      return get().chats
    },
    getChatsNumber: () => {
      return get().chats.length
    },
    getChatsName: () => {
      return get().chats.map((chat, idx) => ({ id: chat.id, index: idx, title: chat.config.title, number: chat.messages.length }))
    },
    moveChats: (from: number, to: number) =>
      set((state) => {
        state.chats = arrayMove(state.chats, from, to)
      }),
    changeChats: (chats: Array<TChat>) =>
      set((state) => {
        state.chats = chats
      }),
    newChat: () =>
      set((state) => {
        const chat: TChat = {
          id: random32BitNumber(),
          messages: Array<TMessage>(),
          config: {
            ...config,
            ...useSystemStore.getState().config
          }
        }

        state.chats.push(chat)
      }),
    removeChat: (idx: number) =>
      set((state) => {
        if (state.chats.length === 1) {
          const chat: TChat = {
            id: random32BitNumber(),
            messages: Array<TMessage>(),
            config: {
              ...config,
              ...useSystemStore.getState().config
            }
          }

          state.chats = Array<TChat>(chat)
        } else {
          state.chats.splice(idx, 1)
        }
      }),
    moveMessages: (from: number, to: number, chatId: number | undefined = undefined) =>
      set((state) => {
        if (chatId === undefined) {
          chatId = get().currentChat
        }
        state.chats[chatId].messages = arrayMove(state.chats[chatId].messages, from, to)
      }),
    changeMessages: (chatId: number, messages: Array<TMessage>) =>
      set((state) => {
        state.chats[chatId].messages = messages
      }),
    newMessage: (chatId: number) =>
      set((state) => {
        state.chats[chatId].messages.push(message)
      }),
    getMessage: (msgId: number, chatId: number | undefined = undefined) => {
      if (chatId === undefined) {
        chatId = get().currentChat
      }
      const msg = get().chats[chatId].messages.find((msg) => msg.id === msgId)
      return msg || message
    },
    getMessages: (chatId: number) => {
      if (get().chats.length === 0) {
        get().newChat()
        return get().chats[0].messages
      }
      return get().chats[chatId]?.messages
    },
    addMessage: (msg: TMessage, pos: number | undefined = undefined, chatId: number | undefined = undefined) =>
      set((state) => {
        if (chatId === undefined) {
          chatId = get().currentChat
        }
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
    setMessage: (msgId: number, attr: string, value: any, chatId: number | undefined = undefined) =>
      set((state: any) => {
        if (chatId === undefined) {
          chatId = get().currentChat
        }
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
    getConfig: (chatId: number | undefined = undefined) => {
      if (chatId === undefined) {
        chatId = get().currentChat
      }
      return get().chats[chatId].config
    },
    setConfig: (attr: string, value: any, chatId: number | undefined = undefined) =>
      set((state: any): any => {
        if (chatId === undefined) {
          chatId = get().currentChat
        }
        state.chats[chatId].config[attr] = value
      }),
  }))
)