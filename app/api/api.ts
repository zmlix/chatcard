import { TChatConfig, TMessage, TSystemConfig } from "..";
import { SSE } from 'sse';
import { message } from "antd";
import { random32BitNumber } from '../utils/utils'
import { useChatsStore } from "../store/chats";
import { useSystemStore } from "../store/system";
import axios from "axios";

export function sendMessageApi(message: TMessage, resend?: boolean, fileList?: any[]) {
    const chatConfig: TChatConfig = useChatsStore.getState().getConfig()
    const systemConfig: TSystemConfig = useSystemStore.getState().config
    const setIsSending = useSystemStore.getState().setIsSending
    const setSendingMsgId = useSystemStore.getState().setSendingMsgId

    try {
        message.model = message.model === '' ? chatConfig.model : message.model
        message.skip = chatConfig.autoSkip
        message.render = chatConfig.autoRender
    } catch {
    }

    const msgId = random32BitNumber()
    const msg: TMessage = {
        id: msgId,
        message: "",
        type: 'text',
        status: 'loading',
        role: 'assistant',
        createTime: new Date(),
        updateTime: new Date(),
        model: '',
        fold: false,
        render: chatConfig.autoRender,
        skip: chatConfig.autoSkip,
        loading: true,
        token: 0
    }
    let messages: Array<TMessage> = []

    if (fileList) {
        const imgs = fileList.map((f) => ({
            type: "image_url",
            image_url: {
                "url": f.data,
                "detail": "auto"
            }
        }))

        message.message = [{
            "type": "text",
            "text": message.message
        }, ...imgs]
    }

    if (resend === undefined || resend === false) {
        useSystemStore.getState().setNeedScroll(true)
        useChatsStore.getState().addMessage(message)
        messages = useChatsStore.getState().getCurrentChat().messages
        useChatsStore.getState().addMessage(msg)
    } else {
        const index = useChatsStore.getState().getCurrentChat().messages.findIndex((msg) => msg.id === message.id)
        messages = useChatsStore.getState().getCurrentChat().messages.slice(0, index + 1)
        useChatsStore.getState().addMessage(msg, index + 1)
    }
    // console.log(resend, message)
    setIsSending(true)
    setSendingMsgId(msgId)
    let msgContent = ""
    const sse = new SSE(
        systemConfig.api_url,
        {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${systemConfig.api_key}`,
            },
            payload: JSON.stringify({
                "model": message.model,
                "messages": messages.filter((msg) => !msg.skip).map((msg) => ({
                    "role": msg.role,
                    "content": msg.message
                })),
                "stream": true,
                "top_p": chatConfig.top_p,
                "temperature": chatConfig.temperature,
                "presence_penalty": chatConfig.presence_penalty,
                "frequency_penalty": chatConfig.frequency_penalty,
                "max_tokens": chatConfig.max_tokens || undefined
            }),
            method: "POST",
        })
    sse.addEventListener('message', function (e: any) {
        console.log(e)
        if (e.data == '[DONE]' || !useSystemStore.getState().isSending) {
            useChatsStore.getState().setMessage(msgId, 'loading', false)
            if (resend === undefined || resend === false) {
                useSystemStore.getState().setNeedScroll(true)
            }
            sse.close()
            return
        }
        var payload
        try {
            payload = JSON.parse(e.data)
        } catch (error) {
            let index = e.data.indexOf('data:')
            if (index >= 0) {
                e.data = e.data.substring(index + 5)
                payload = JSON.parse(e.data)
            } else {
                useChatsStore.getState().setMessage(msgId, 'message',
                    '```json\n' +
                    JSON.stringify({ details: '解析错误' }, null, 4) +
                    '\n```'
                )
                useChatsStore.getState().setMessage(msgId, 'status', 'error')
                return
            }
        }
        if (payload.choices[0].delta.content) {
            msgContent += payload.choices[0].delta.content
            useChatsStore.getState().setMessage(msgId, 'model', payload.model)
            useChatsStore.getState().setMessage(msgId, 'message', msgContent)
        }
    })
    sse.addEventListener('readystatechange', (e: any) => {
        console.log(e)
        if (e.readyState >= 2) {
            if (!useSystemStore.getState().isSending) {
                return
            }
            useChatsStore.getState().setMessage(msgId, 'loading', false)
            if (resend === undefined || resend === false) {
                useSystemStore.getState().setNeedScroll(true)
            }
            useChatsStore.getState().setMessage(msgId, 'status', 'success')
            setIsSending(false)
            setSendingMsgId(0)
        }
    })
    sse.addEventListener('error', (e: any) => {
        console.log('error ', e)
        sse.close()
        let error_msg
        try {
            error_msg = JSON.parse(e.data)
        } catch (error: any) {
            if (error.name === 'SyntaxError') {
                const pattern = /\{[\s\S]*\}/
                const match = e.data.match(pattern)
                if (match) {
                    error_msg = JSON.parse(match[0])
                } else {
                    error_msg = { details: '未知错误' }
                    useChatsStore.getState().setMessage(msgId, 'status', 'error')

                }
            } else {
                error_msg = { details: '未知错误' }
                useChatsStore.getState().setMessage(msgId, 'status', 'error')
            }
        }
        useChatsStore.getState().setMessage(msgId, 'message',
            '```json\n' +
            JSON.stringify(error_msg, null, 4) +
            '\n```'
        )
        useChatsStore.getState().setMessage(msgId, 'status', 'error')
        useChatsStore.getState().setMessage(msgId, 'skip', true)
        useChatsStore.getState().setMessage(msgId, 'loading', false)
        if (resend === undefined || resend === false) {
            useSystemStore.getState().setNeedScroll(true)
        }
    })
    sse.stream()
}

export function getModelApi(setLoading: any) {
    const systemConfig: TSystemConfig = useSystemStore.getState().config
    const url = (new URL(systemConfig.api_url))
    const baseURL = url.hostname
    const protocol = url.protocol
    console.log(baseURL)
    setLoading(true)
    axios.get(`${protocol}//${baseURL}/v1/models`, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${systemConfig.api_key}`,
        },
    }).then((res) => {
        console.log("res", res.data)
        const setModels = useSystemStore.getState().setModels
        setModels(res.data.data
            .filter((m: any) => m.id.indexOf('gpt-') !== -1).map((m: any) => ({
                value: m.id, label: m.id
            })))
        message.success({
            content: "获取模型成功"
        })
    }).catch((err) => {
        console.log("error", err)
        message.error({
            content: "获取模型失败"
        })
    }).finally(() => {
        setLoading(false)
    })
}