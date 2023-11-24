import CardTools from './tool';
import CardMain from './main';
import CardFooter from './footer';
import { useState, memo } from 'react';
import { useChatsStore } from "@/app/store/chats"
import { TChatsStore, TMessage } from '@/app';
import type { MenuProps } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import { sendMessageApi } from '@/app/api/api';

export default memo(function Card({ mid }: any) {
    console.log("card", mid)

    const [edit, setEdit] = useState(false)
    const currentChat: number = useChatsStore((state: TChatsStore) => state.currentChat)
    const msg: TMessage = useChatsStore(useShallow((state: TChatsStore) => state.getMessage(mid)))
    const setMessage = useChatsStore((state: TChatsStore) => state.setMessage)
    const removeMessage = useChatsStore((state: TChatsStore) => state.removeMessage)

    const switchRole: MenuProps['onClick'] = ({ key }) => {
        setMessage(msg.id, 'role', key)
    }

    const foldHandler = () => {
        setEdit(false)
        setMessage(msg.id, 'fold', !msg.fold)
    }

    const editMessageHandler = () => {
        if (msg.fold) {
            return
        }
        setEdit(!edit)
    }

    const sendMessageHandler = () => {
        sendMessageApi(msg, true)
        console.log("send", msg)
    }

    const delMessageHandler = () => {
        removeMessage(currentChat, msg.id)
    }

    const renderHandler = (checked: boolean) => {
        console.log("render...", checked)
        setMessage(msg.id, 'render', checked)
    }

    const skipHandler = (checked: boolean) => {
        console.log("skip...", checked)
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
        message: msg.message,
        render: msg.render,
        edit,
        quitEditHandler,
        submitEditHandler,
    }

    const modelHandler = (value: string) => {
        console.log("model...", value)
        setMessage(msg.id, 'model', value)
    }

    const footerProps = {
        loading: msg.loading,
        role: msg.role,
        fold: msg.fold,
        message: msg.message,
        model: msg.model,
        status: msg.status,
        modelHandler
    }

    return (
        <div className='border rounded w-full' >
            <CardTools {...toolsProps}></CardTools>
            {!msg.fold && <CardMain {...mainProps}></CardMain>}
            {!edit && <CardFooter {...footerProps}></CardFooter>}
        </div>
    )
})