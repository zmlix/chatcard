type TMessage = {
    id: number,
    message: any,
    type: 'text' | 'img',
    role: 'system' | 'user' | 'assistant',
    createTime: Date,
    updateTime: Date,
    model: string,
    fold: boolean,
    render: boolean,
    skip: boolean,
    token?: number
}

type TChatConfig = {
    model: string,
    title: string,
    autoSkip: boolean,
    temperature: number,
    top_p: number,
    frequency_penalty: number,
    presence_penalty: number
}

type TChat = {
    id: number
    messages: Array<TMessage>
    config: TChatConfig
}


type TChatsStoreState = {
    chats: Array<TChat>
}

type TChatsStoreAction = {
    getChatsNumber: () => void
    getChatsName: () => void
    newChat: () => void
    removeChat: (idx: number) => void
    changeMessages: (chatId: number, messages: Array<TMessage>) => void
    newMessage: (chatId: number) => void
    addMessage: (chatId: number, msg: TMessage, pos: number | undefined) => void
    removeMessage: (chatId: number, msgId: number) => void
    setMessage: (chatId: number, msgId: number, attr: string, value: any) => void
    setConfig: (chatId: number, attr: string, value: any) => void
    getMessages: (chatId: number) => Array<TMessage>
}

type TChatsStore = TChatsStoreState & TChatsStoreAction

export {
    TMessage,
    TChatConfig,
    TChat,
    TChatsStoreState,
    TChatsStoreAction,
    TChatsStore
}