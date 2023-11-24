type TMessage = {
    id: number
    message: any
    type: 'text' | 'img' | 'error'
    role: 'system' | 'user' | 'assistant'
    createTime: Date
    updateTime: Date
    model: string
    fold: boolean
    render: boolean
    skip: boolean
    loading?: boolean
    token?: number
}

type TChatConfig = {
    model: string
    title: string
    temperature: number
    top_p: number
    frequency_penalty: number
    presence_penalty: number
    autoSkip: boolean
    autoRender: boolean
}

type TChat = {
    id: number
    messages: Array<TMessage>
    config: TChatConfig
}


type TChatsStoreState = {
    chats: Array<TChat>
    currentChat: number
}

type TChatsStoreAction = {
    getCurrentChat: () => TChat
    setCurrentChat: (idx?: number | string) => void
    getChatsNumber: () => number
    getChats: () => Array<TChat>
    getChatsName: () => Array<any>
    newChat: () => void
    changeChats: (chats: Array<TChat>) => void
    removeChat: (chatId?: number) => void
    moveChats: (from: number, to: number) => void
    moveMessages: (from: number, to: number, chatId?: number) => void
    changeMessages: (chatId: number, messages: Array<TMessage>) => void
    newMessage: (chatId: number) => void
    addMessage: (msg: TMessage, pos?: number, chatId?: number) => void
    removeMessage: (chatId: number, msgId: number) => void
    clearMessage: (chatId?: number) => void
    setMessage: (msgId: number, attr: string, value: any, chatId?: number) => void
    getConfig: (chatId?: number) => TChatConfig
    setConfig: (attr: string, value: any, chatId?: number) => void
    getMessage: (msgId: number, chatId?: number) => TMessage
    getMessages: (chatId: number) => Array<TMessage>
}

type TChatsStore = TChatsStoreState & TChatsStoreAction

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
    isSending: boolean
    isShowSetting: boolean
    isShowCard: boolean
    needScroll: boolean
    prompts: TPrompts
    models: Array<any>
}

type TSystemStoreAction = {
    setConfig: (attr: string, value: any) => void
    setIsSending: (s: boolean) => void
    setIsShowSetting: (s: boolean) => void
    setIsShowCard: (s: boolean) => void
    resetConfig: () => void
    initPrompts: () => void
    addPrompt: (p: any) => boolean
    removePrompt: (act: string) => void
    editPrompt: (act: string, prompt: string) => void
    setModels: (models: Array<any>) => void
    setNeedScroll: (scroll: boolean) => void
}

type TSystemStore = TSystemStoreState & TSystemStoreAction


type TChatStoreState = {
    id: number
    messages: Array<TMessage>
    config: TChatConfig
}

type TChatStoreAction = {
    changeMessages: (messages: Array<TMessage>) => void
    getMessage: (idx: number) => void
    getMessages: () => void
    addMessage: (msg: TMessage, pos: number | undefined) => void
    removeMessage: (msgId: number) => void
    setConfig: (attr: string, value: any) => void
    get: () => TChatStore
}

type TChatStore = TChatStoreState & TChatStoreAction

type TMessageStoreState = {
    message: TMessage
}

type TMessageStoreAction = {
    setMessage: (msgId: number, attr: string, value: any) => void
    newMessage: () => void
    getMessage: () => TMessage
}

type TMessageStore = TMessageStoreState & TMessageStoreState

export {
    TMessage,
    TChatConfig,
    TChat,
    TChatsStoreState,
    TChatsStoreAction,
    TChatsStore,
    TSystemConfig,
    TPrompts,
    TSystemStoreState,
    TSystemStoreAction,
    TSystemStore,
    TChatStoreState,
    TChatStoreAction,
    TChatStore,
    TMessageStoreState,
    TMessageStoreAction,
    TMessageStore
}