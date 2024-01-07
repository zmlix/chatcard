type TMessage = {
    id: number
    message: any
    type: 'text' | 'img' | 'tool'
    status: 'success' | 'loading' | 'calling' | 'error' | 'stop'
    role: 'system' | 'user' | 'assistant' | 'tool'
    createTime: Date
    updateTime: Date
    model: string
    fold: boolean
    render: boolean
    skip: boolean
    hidden?: boolean
    loading?: boolean
    token?: number
    tool_calls?: Array<Tool>
    tool_call_function_name?: string
    tool_call_id?: string
    toolLog?: string
    callStep?: number
}

type Tool = {
    index: number
    id: string
    type: string
    function: ToolFunction
}

type ToolFunction = {
    name: string
    arguments: string
}


type TTools = {
    name: string
    description: string
}

type TChatConfig = {
    model: string
    title: string
    temperature: number
    top_p: number
    frequency_penalty: number
    presence_penalty: number
    max_tokens: number
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
    addMessageWithOffset: (msgId: number, msg: TMessage, offset?: number, chatId?: number) => voud
    removeMessage: (chatId: number, msgId: number) => void
    removeCallMessage: (msgId: number, chatId?: number) => void
    setCallMessage: (msgId: number, attr: string, value: any, chatId?: number) => void
    clearMessage: (chatId?: number) => void
    setMessage: (msgId: number, attr: string, value: any, chatId?: number) => void
    addToolLog: (msgId: number, log: string, chatId?: number) => void
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
    max_tokens: number
    autoSkip: boolean
    autoRender: boolean
    seed?: number
    sendMethod?: 'Ctrl' | 'Shift' | 'Alt' | 'Meta' | 'Enter'
    showHeader?: boolean
    showEmoji?: boolean
    showUpload?: boolean
    plugin?: boolean
}

type TPrompts = {
    prompt: Array<any>
    systemPrompt: Array<any>
    role: Array<any>
}

type TSystemStoreState = {
    config: TSystemConfig
    isSending: boolean
    sendingMsgId: number
    isShowSetting: boolean
    isShowCard: boolean
    needScroll: boolean
    prompts: TPrompts
    models: Array<any>
}

type TSystemStoreAction = {
    setConfig: (attr: string, value: any) => void
    getIsSending: () => boolean
    setIsSending: (s: boolean) => void
    setSendingMsgId: (msgId: number) => void
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

type TPluginInfo = {
    type: string,
    function: {
        name: string,
        description: string,
        parameters?: any
    }
}

type TPlugin = {
    name: string
    call?: string
    display: string
    img?: string
    version: string
    info: Array<TPluginInfo>
    options?: any
    disable?: boolean
}

type DirectoryTreeNode = {
    title   : string     
    key     : string      
    children: Array<DirectoryTreeNode>
    isLeaf :  boolean
}

type TPluginStoreState = {
    url: string
    plugins: Array<TPlugin>
    directory?: DirectoryTreeNode
    fileServer?: string
}

type TPluginStoreAction = {
    setPlugin: (attr: string, value: any) => void
    setUrl: (url: string) => void
    setPlugins: (plugins: Array<TPlugin>) => void
    setPluginsAttr: (index: number, attr: string, value: any) => void
    findPluginName: (call: string) => string
    setDirectory: (directory: DirectoryTreeNode) => void
    setFileServer: (fileServer: string) => void
}

type TPluginStore = TPluginStoreState & TPluginStoreAction

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
    Tool,
    TPlugin,
    TPluginInfo,
    TPluginStoreAction,
    TPluginStoreState,
    TPluginStore,
    DirectoryTreeNode
}