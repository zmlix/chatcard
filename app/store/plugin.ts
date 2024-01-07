import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DirectoryTreeNode, TPlugin, TPluginStoreAction, TPluginStoreState } from '..'

export const usePluginStore = create<TPluginStoreState & TPluginStoreAction>()(
    persist(immer((set, get) => ({
        url: "",
        plugins: [],
        directory: {
            title: "files",
            key: "files",
            children: Array<DirectoryTreeNode>(),
            isLeaf: false
        },
        fileServer: "",
        setPlugin: (attr: string, value: any) =>
            set((state) => {
                state = {
                    ...state,
                    [attr]: value
                }
            }),
        setUrl: (url: string) =>
            set((state) => {
                state.url = url
            }),
        setPlugins: (plugins: Array<TPlugin>) =>
            set((state) => {
                state.plugins.forEach(plugin => {
                    const index = plugins.findIndex(p => p.call === plugin.call)
                    if (index >= 0) {
                        plugins[index].disable = plugin.disable
                    }
                })
                state.plugins = plugins
            }),
        setPluginsAttr: (index: number, attr: string, value: any) =>
            set((state) => {
                state.plugins = state.plugins.map((plugin: TPlugin, idx: number) => {
                    if (idx === index) {
                        return {
                            ...plugin,
                            [attr]: value
                        }
                    }
                    return plugin
                })
            }),
        findPluginName: (call: string) => {
            const plugin = get().plugins.find((p) => {
                if (p.call === call) {
                    return true
                }
                return false
            })
            if (plugin) {
                return plugin.name
            }
            return ""
        },
        setDirectory: (directory: DirectoryTreeNode) =>
            set((state) => {
                state.directory = directory
            }),
        setFileServer: (fileServer: string) =>
            set((state) => {
                state.fileServer = fileServer
            }),
    })), {
        name: 'chatcard-plugin',
        storage: createJSONStorage(() => localStorage),
    })
)