import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { random32BitNumber } from '../utils/utils'
import { arrayMove } from '@dnd-kit/sortable';
import { TChat, TChatConfig, TMessage, TChatsStore } from '..'
import { useSystemStore } from './system'
import { persist, createJSONStorage } from 'zustand/middleware'

const config: TChatConfig = {
  title: '新的聊天',
  ...useSystemStore.getState().config
}

const message: TMessage = {
  id: random32BitNumber(),
  message: "empty",
  type: 'text',
  status: 'success',
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
  persist(immer((set, get) => ({
    chats: Array<TChat>(chat),
    currentChat: 0,
    getCurrentChat: () => {
      if (get().currentChat >= get().chats.length) {
        set((state) => { state.currentChat = state.currentChat - 1 })
      }
      return get().chats[get().currentChat]
    },
    setCurrentChat: (idx: number | string | undefined) =>
      set((state) => {
        if (typeof idx === 'number') {
          state.currentChat = idx % state.chats.length
        }
        if (typeof idx === 'string') {
          state.currentChat = (state.currentChat + parseInt(idx) + state.chats.length) % state.chats.length
        }
        if (typeof idx === 'undefined') {
          state.currentChat = state.chats.length - 1
        }
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
    removeChat: (chatId: number | undefined = undefined) =>
      set((state) => {
        if (chatId === undefined) {
          chatId = get().currentChat
        }
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
          state.chats.splice(chatId, 1)
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
        if (state.chats[chatId].messages.length === 0) {
          if (typeof msg.message === 'string') {
            state.chats[chatId].config.title = msg.message.slice(0, 15)
          } else if (typeof msg.message === 'object') {
            state.chats[chatId].config.title = msg.message[0].text
          }
        }
        if (pos) {
          state.chats[chatId].messages.splice(pos, 0, msg)
        } else {
          state.chats[chatId].messages.push(msg)
        }
      }),
    addMessageWithOffset: (msgId: number, msg: TMessage, offset: number | undefined = 1, chatId: number | undefined = undefined) =>
      set((state) => {
        if (chatId === undefined) {
          chatId = get().currentChat
        }
        const msg1_pos = state.chats[chatId].messages.findIndex((msg) => msg.id === msgId)
        state.chats[chatId].messages.splice(msg1_pos + offset, 0, msg)
      }),
    removeMessage: (chatId: number, msgId: number) =>
      set((state) => {
        state.chats[chatId].messages = state.chats[chatId].messages.filter((msg: TMessage) => msg.id !== msgId)
      }),
    removeCallMessage: (msgId: number, chatId: number | undefined = undefined) =>
      set((state) => {
        if (chatId === undefined) {
          chatId = get().currentChat
        }
        const index = state.chats[chatId].messages.findIndex((msg) => msg.id === msgId) - 1
        state.chats[chatId].messages = state.chats[chatId].messages.filter((msg: TMessage) => msg.id !== msgId)
        var flag = true

        const del_ = (state: any, index: number, chatId: number) => {
          if (!flag) return
          flag = false
          state.chats[chatId].messages = state.chats[chatId].messages.filter((msg: TMessage, idx: number) => {
            if (idx === index && ((msg.role === 'assistant' && msg.type === 'tool') || msg.role === 'tool')) {
              flag = true
              return false
            }
            return true
          })
          del_(state, index - 1, chatId)
        }
        del_(state, index, chatId)
      }),
    setCallMessage: (msgId: number, attr: string, value: any, chatId: number | undefined = undefined) =>
      set((state) => {
        if (chatId === undefined) {
          chatId = get().currentChat
        }
        const index = state.chats[chatId].messages.findIndex((msg) => msg.id === msgId) - 1
        var flag = true

        const set_ = (state: any, index: number, chatId: number) => {
          if (!flag) return
          flag = false
          state.chats[chatId].messages = state.chats[chatId].messages.map((msg: TMessage, idx: number) => {
            if (idx === index && ((msg.role === 'assistant' && msg.type === 'tool') || msg.role === 'tool')) {
              flag = true
              return {
                ...msg,
                [attr]: value
              }
            }
            return msg
          })
          set_(state, index - 1, chatId)
        }
        set_(state, index, chatId)
      }),
    clearMessage: (chatId: number | undefined = undefined) =>
      set((state) => {
        if (chatId === undefined) {
          chatId = get().currentChat
        }
        state.chats[chatId].messages = Array<TMessage>()
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
    addToolLog: (msgId: number, log: { key: string, value: string }, chatId: number | undefined = undefined) =>
      set((state) => {
        if (chatId === undefined) {
          chatId = get().currentChat
        }
        state.chats[chatId].messages = state.chats[chatId].messages.map((msg: TMessage) => {
          if (msg.id === msgId) {
            return {
              ...msg,
              "toolLog": msg.toolLog ? [...msg.toolLog, log] : [log]
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
  })), {
    name: 'chatcard-chats',
    storage: createJSONStorage(() => localStorage),
  })
)