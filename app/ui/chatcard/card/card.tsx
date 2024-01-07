import CardTools from './tool';
import CardMain from './main';
import CardFooter from './footer';
import { useState, memo } from 'react';
import { useChatsStore } from "@/app/store/chats"
import { TChatsStore, TMessage, TSystemStore } from '@/app';
import { message, type MenuProps } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import { sendMessageApi } from '@/app/api/api';
import { useSystemStore } from '@/app/store/system';

export default memo(function Card({ mid }: any) {
    console.log("card", mid)

    const [edit, setEdit] = useState(false)
    const currentChat: number = useChatsStore((state: TChatsStore) => state.currentChat)
    const msg: TMessage = useChatsStore(useShallow((state: TChatsStore) => state.getMessage(mid)))
    const setMessage = useChatsStore((state: TChatsStore) => state.setMessage)
    const setCallMessage = useChatsStore((state: TChatsStore) => state.setCallMessage)
    const removeMessage = useChatsStore((state: TChatsStore) => state.removeMessage)
    const removeCallMessage = useChatsStore((state: TChatsStore) => state.removeCallMessage)
    const getIsSending = useSystemStore((state: TSystemStore) => state.getIsSending)

    const renderMsg = (typeof msg.message === 'string' ? msg.message :
        (msg.message[0].text + '\n' + (msg.message.slice(1).map((m: any, idx: number) => `![image ${idx}](${m.image_url.url})`)).join('\n')))

    const switchRole: MenuProps['onClick'] = ({ key }) => {
        setMessage(msg.id, 'role', key)
    }

    const foldHandler = () => {
        setEdit(false)
        setCallMessage(msg.id, 'hidden', !msg.fold)
        setMessage(msg.id, 'fold', !msg.fold)
    }

    const editMessageHandler = () => {
        if (msg.fold || getIsSending()) {
            message.warning({
                content: "请等待回答完成"
            })
            return
        }
        setEdit(!edit)
    }

    const sendMessageHandler = () => {
        if (getIsSending()) {
            message.warning({
                content: "请等待回答完成"
            })
            return
        }
        sendMessageApi(msg, true)
        console.log("send", msg)
    }

    const delMessageHandler = () => {
        if (getIsSending()) {
            message.warning({
                content: "请等待回答完成"
            })
            return
        }
        // removeMessage(currentChat, msg.id)
        removeCallMessage(msg.id, currentChat)
    }

    const renderHandler = (checked: boolean) => {
        console.log("render...", checked)
        setMessage(msg.id, 'render', checked)
    }

    const skipHandler = (checked: boolean) => {
        console.log("skip...", checked)
        setCallMessage(msg.id, 'skip', checked)
        setMessage(msg.id, 'skip', checked)
    }

    const toolsProps = {
        updateTime: msg.updateTime,
        role: msg.role,
        fold: msg.fold,
        foldHandler,
        editMessageHandler,
        sendMessageHandler,
        delMessageHandler,
        switchRole,
        render: msg.render,
        skip: msg.skip,
        renderHandler,
        skipHandler,
    }

    const submitEditHandler = (text: string) => () => {
        setMessage(msg.id, 'message', text)
        setMessage(msg.id, 'updateTime', new Date())
        setEdit(!edit)
    }

    const quitEditHandler = () => {
        setEdit(!edit)
    }

    const mainProps = {
        msg,
        message: renderMsg,
        edit,
        quitEditHandler,
        submitEditHandler,
    }

    const modelHandler = (value: string) => {
        console.log("model...", value)
        setMessage(msg.id, 'model', value)
    }

    const footerProps = {
        msg,
        message: renderMsg,
        modelHandler
    }

    return (
        <>
            <div className={!!msg.hidden ? 'hidden' : 'border rounded w-full mb-0.5'}>
                {(msg.type === 'tool' || msg.role === 'tool')
                    ? <>
                        <CardMain {...mainProps}></CardMain>
                        <CardFooter {...footerProps}></CardFooter>
                    </>
                    :
                    <>
                        <CardTools {...toolsProps}></CardTools>
                        {!msg.fold && <CardMain {...mainProps}></CardMain>}
                        {!edit && <CardFooter {...footerProps}></CardFooter>}
                    </>
                }
            </div>
            {!!msg.hidden && <div className='h-0.5'></div>}
        </>
    )
})