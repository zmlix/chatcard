import { TMessage, TPlugin, TPluginInfo, Tool } from ".."
import { useChatsStore } from "../store/chats"
import { random32BitNumber } from "../utils/utils"
import { sendMessageApi } from "./api"
import { grpc } from "@improbable-eng/grpc-web"
import { PluginService } from "./plugin_pb_service"
import { ConnectRequest, ConnectResponse, CallRequest, CallResponse } from "./plugin_pb"
import { usePluginStore } from "../store/plugin"
import { message as antdMessage } from "antd"
import { useSystemStore } from "../store/system"

type Message = {
    message: string
    log: string
    finish: string
    level: number
}

export function connectPluginSystem() {
    const setPlugins = usePluginStore.getState().setPlugins
    const connectRequest = new ConnectRequest()

    grpc.unary(PluginService.Connect, {
        request: connectRequest,
        host: usePluginStore.getState().url,
        onEnd: res => {
            const { status, message } = res
            if (status === grpc.Code.OK && message) {
                //@ts-ignore
                const plugins: ConnectResponse.AsObject = message.toObject()
                console.log("ConnectResponse", plugins)
                const pluginsList: Array<TPlugin> = []
                for (const plugin of plugins.pluginsList) {
                    console.log(plugin)
                    const pluginInfos: Array<TPluginInfo> = JSON.parse(plugin.info)
                    for (const pi of pluginInfos) {
                        const p: TPlugin = {
                            name: plugin.name,
                            call: pi.function.name,
                            display: plugin.display,
                            img: plugin.img,
                            version: plugin.version,
                            info: [pi],
                            options: plugin.optionsList
                        }
                        pluginsList.push(p)
                    }
                }
                setPlugins(pluginsList)
                antdMessage.success(`找到${pluginsList.length}个插件`)
                return
            }
            antdMessage.error(`连接失败`)
        }
    })

}

export function connectPlugin(msgId: number, call_func: Array<Tool> = [], index = 0) {
    useChatsStore.getState().setMessage(msgId, 'callStep', 1)

    console.log(call_func)

    if (index === call_func.length) {
        const msg = useChatsStore.getState().getMessage(msgId)
        sendMessageApi(msg, true)
        return
    }

    const tool = call_func[index]

    const callRequest = new CallRequest()
    const name = usePluginStore.getState().findPluginName(tool.function.name)
    console.log("name: ", name)
    callRequest.setName(name)
    callRequest.setCall(tool.function.name)
    callRequest.setArguments(JSON.stringify(tool))
    let stream_message = ""
    grpc.invoke(PluginService.Call, {
        request: callRequest,
        host: usePluginStore.getState().url,
        onMessage: (message) => {
            //@ts-ignore
            const message_: CallResponse.AsObject = message.toObject()
            console.log("CallResponse", message_)
            const response: Message = JSON.parse(message_.response)
            useChatsStore.getState().setMessage(msgId, 'callStep', response.level)
            if (response.log !== "") {
                useChatsStore.getState().addToolLog(msgId, `系统日志: ${response.log}`)
            }
            if (response.level < 0) {
                useSystemStore.getState().setIsSending(false)
                return
            }
            if (response.level === 3) {
                stream_message += response.message
            } else if (response.level === 4) {
                const msg: TMessage = {
                    id: random32BitNumber(),
                    message: stream_message,
                    type: 'tool',
                    status: 'success',
                    role: 'tool',
                    createTime: new Date(),
                    updateTime: new Date(),
                    model: useChatsStore.getState().getMessage(msgId).model,
                    fold: false,
                    render: false,
                    skip: false,
                    loading: false,
                    tool_call_function_name: tool.function.name,
                    tool_call_id: tool.id,
                }
                useChatsStore.getState().addToolLog(msgId, `调用结果: ${stream_message}`)
                useChatsStore.getState().setMessage(msgId, 'callStep', 4)
                useChatsStore.getState().setMessage(msgId, 'loading', false)
                useChatsStore.getState().addMessageWithOffset(msgId, msg)
                connectPlugin(msg.id, call_func, index + 1)
                return
            }
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => { 
            console.log(code, msg, trailers)
            useChatsStore.getState().setMessage(msgId, 'loading', false)
        }
    })
}