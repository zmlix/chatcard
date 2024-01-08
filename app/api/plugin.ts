import { DirectoryTreeNode, TMessage, TPlugin, TPluginInfo, Tool } from ".."
import { useChatsStore } from "../store/chats"
import { random32BitNumber } from "../utils/utils"
import { sendMessageApi } from "./api"
import { grpc } from "@improbable-eng/grpc-web"
import { PluginService } from "./plugin_pb_service"
import { ConnectRequest, ConnectResponse, CallRequest, CallResponse, DirectoryRequest, DirectoryResponse } from "./plugin_pb"
import { usePluginStore } from "../store/plugin"
import { message as antdMessage } from "antd"
import { useSystemStore } from "../store/system"
import axios from "axios"

type Message = {
    message: string
    log: string
    finish: string
    level: number
}

export function connectPluginSystem() {
    const setPlugins = usePluginStore.getState().setPlugins
    const setDirectory = usePluginStore.getState().setDirectory
    const setFileServer = usePluginStore.getState().setFileServer
    const connectRequest = new ConnectRequest()

    grpc.unary(PluginService.Connect, {
        request: connectRequest,
        host: usePluginStore.getState().url,
        onEnd: res => {
            const { status, message } = res
            if (status === grpc.Code.OK && message) {
                //@ts-ignore
                const obj: ConnectResponse.AsObject = message.toObject()
                // console.log("ConnectResponse", obj)
                if (obj.directory === "") {
                    obj.directory = JSON.stringify({
                        title: "files",
                        key: "files",
                        children: Array<DirectoryTreeNode>(),
                        isLeaf: false
                    })
                }
                const directory: DirectoryTreeNode = JSON.parse(obj.directory)
                setDirectory(directory)
                setFileServer(obj.web)
                const pluginsList: Array<TPlugin> = []
                for (const plugin of obj.pluginsList) {
                    // console.log(plugin)
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

export function connectPlugin(msgId: number, call_func: Array<Tool> = [], index = 0, offset = 1) {
    useChatsStore.getState().setMessage(msgId, 'callStep', 1)

    // console.log(call_func)

    if (index === call_func.length) {
        const msg = useChatsStore.getState().getMessage(msgId)
        sendMessageApi(msg, true)
        return
    }

    const tool = call_func[index]

    const callRequest = new CallRequest()
    const name = usePluginStore.getState().findPluginName(tool.function.name)
    // console.log("name: ", name)
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
            // console.log("CallResponse", message_)
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
                if (response.log === "[image/png]" || response.log === "[image/jpeg]") {
                    const msg: TMessage = {
                        id: random32BitNumber(),
                        message: `![image](data:image/png;base64,${response.message})`,
                        type: 'img',
                        status: 'success',
                        role: 'tool',
                        createTime: new Date(),
                        updateTime: new Date(),
                        model: useChatsStore.getState().getMessage(msgId).model,
                        fold: false,
                        render: true,
                        skip: false,
                        loading: false,
                        tool_call_function_name: tool.function.name,
                        tool_call_id: tool.id,
                    }
                    useChatsStore.getState().addMessageWithOffset(msgId, msg)
                    offset++
                } else {
                    stream_message += response.message
                }
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
                useChatsStore.getState().addMessageWithOffset(msgId, msg, offset)
                connectPlugin(msg.id, call_func, index + 1, offset)
                return
            }
        },
        onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
            console.log(code, msg, trailers)
            useChatsStore.getState().setMessage(msgId, 'loading', false)
        }
    })
}

function downloadMultipleFiles(fileUrls: Array<string>, fileNames: Array<string>) {
    fileUrls.forEach((fileUrl, index) => {
        const link = document.createElement('a')
        link.href = fileUrl
        link.download = fileNames[index]
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    })
}

function uploadFile(fileServer: string | undefined, dirs: Array<string>, fileList: any) {
    // console.log("fileList", fileList)
    let formData = new FormData()
    fileList.forEach((file: any) => {
        formData.append('file', file.originFileObj);
    })
    // console.log(fileServer + "/upload")
    axios({
        method: 'post',
        url: fileServer + "/upload",
        data: formData,
        params: {
            "dirs": dirs
        },
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(function (response) {
        console.log("response", response)
        if (response.data["status"] === "success") {
            antdMessage.success(response.data["message"])
        }
        if (response.data["status"] === "failed") {
            antdMessage.error(response.data["message"])
        }
    }).catch(function (error) {
        console.log(error)
        antdMessage.error("上传失败")
    })
}

export function connectDirectory(event: string, paths: Array<string>, fileList: any = undefined) {
    const setDirectory = usePluginStore.getState().setDirectory
    const fileServer = usePluginStore.getState().fileServer
    const directoryRequest = new DirectoryRequest()
    directoryRequest.setEvent(event)
    directoryRequest.setPathsList(paths)

    if (event === "download") {
        downloadMultipleFiles(paths.map(path => `${fileServer}/download/${path}`), paths)
    }

    if (event === "upload") {
        uploadFile(fileServer, paths, fileList)
    }

    grpc.unary(PluginService.Directory, {
        request: directoryRequest,
        host: usePluginStore.getState().url,
        onEnd: res => {
            const { status, message } = res
            if (status === grpc.Code.OK && message) {
                //@ts-ignore
                const obj: ConnectResponse.AsObject = message.toObject()
                // console.log("ConnectResponse", obj)
                const directory: DirectoryTreeNode = JSON.parse(obj.directory)
                setDirectory(directory)
                if (event === "refresh") {
                    antdMessage.success(`刷新成功`)
                }
                if (event === "delete") {
                    antdMessage.success(`删除成功`)
                }
            } else {
                if (event === "refresh") {
                    antdMessage.error(`刷新失败`)
                }
                if (event === "delete") {
                    antdMessage.success(`删除失败`)
                }
            }
        }
    })

}