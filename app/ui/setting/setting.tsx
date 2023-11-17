import SettingFooter from "./footer"
import { useState } from "react"
import { Button, Input, Space, Popconfirm } from "antd"
import { DeleteFilled, FormOutlined, CheckOutlined, QuestionCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { DndContext } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TChat } from "@/app";

function SettingChatCard({ cid, chat, setCurrentChat, currentChat, removeChat, setConfig }: any) {

    const openChatHandler = () => {
        setCurrentChat(chat.index)
    }

    const removeChatHandler = () => {
        removeChat(chat.index)
    }

    const [edit, setEdit] = useState(false)
    const [title, setTitle] = useState(chat.title)

    const editChatHandler = () => {
        setEdit(!edit)
    }

    const editChatSubmitHandler = () => {
        if (title.length === 0) {
            return
        }
        setConfig(chat.index, 'title', title)
        setEdit(!edit)
    }

    const {
        attributes,
        listeners,
        setNodeRef: preview,
        setActivatorNodeRef: drag,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: cid });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 9999 : undefined
    };

    const className = "flex items-center h-16 justify-between border hover:cursor-pointer group "
    return (
        <>
            <div ref={preview} style={style} {...attributes} className={currentChat === chat.index ? className + "bg-zinc-200" : className + "bg-white"}>
                <div className="m-2 w-full">
                    {edit ? <div>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input size="large" value={title} maxLength={20} onChange={(e) => setTitle(e.target.value)} />
                            <Button size="large" type="primary" icon={<CheckOutlined />}
                                onClick={editChatSubmitHandler} />
                        </Space.Compact>
                    </div> : <div className="flex items-center" onClick={openChatHandler}>
                        <span className="w-1.5 h-10 mr-1 transition-all ease-in-out duration-300 group-hover:h-0 group-hover:w-0 group-hover:mr-0"></span>
                        <span ref={drag} {...listeners} className="w-0 h-0 bg-zinc-400 transition-all hover:cursor-move ease-in-out duration-300 group-hover:h-10 group-hover:w-1.5 group-hover:mr-1"></span>
                        <div className="w-48">
                            <div className='flex w-48 h-6'>
                                <div className='truncate text-ellipsis'>
                                    {chat.title}
                                </div>
                            </div>
                            <div className="font-serif text-sm text-stone-600">
                                {chat.number} 条对话
                            </div>
                        </div>
                    </div>
                    }
                </div>
                {!edit && <div className="flex mr-2 gap-1">
                    <Button shape="default"
                        icon={<FormOutlined />} size="middle" onClick={editChatHandler} />
                    <Popconfirm
                        title="删除聊天?"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        cancelText="取消"
                        okText="确定"
                        onConfirm={removeChatHandler}
                        destroyTooltipOnHide
                    >
                        <Button type="primary" danger shape="default"
                            icon={<DeleteFilled />} size="middle" />
                    </Popconfirm>
                </div>}
            </div>
        </>
    )
}

function SettingMain({ chatsStore, systemStore }: any) {

    const { newChat, getChatsName, removeChat, setConfig, chats, changeChats } = chatsStore
    const { currentChat, setCurrentChat } = systemStore

    const SettingChatCardProps = {
        setCurrentChat,
        currentChat,
        removeChat,
        setConfig
    }

    function handleDragEnd(event: any) {
        const { active, over } = event
        if (!active || !over) return
        if (active.id !== over.id) {
            const oldIndex = chats.findIndex((chat: TChat) => chat.id === active.id);
            const newIndex = chats.findIndex((chat: TChat) => chat.id === over.id)
            changeChats(arrayMove(chats, oldIndex, newIndex))
            if (currentChat === oldIndex) {
                setCurrentChat(newIndex)
            } else if (currentChat >= newIndex && currentChat <= oldIndex) {
                setCurrentChat(currentChat + 1)
            } else if (currentChat >= oldIndex && currentChat <= newIndex) {
                setCurrentChat(currentChat - 1)
            }
        }
    }

    return (
        <div className="flex flex-col h-full overflow-auto no-scrollbar">
            <Button block onClick={newChat} icon={<PlusOutlined />}>New Chat</Button>
            <DndContext onDragEnd={handleDragEnd}>
                <SortableContext items={getChatsName()}>
                    <div className="flex flex-col gap-1 mt-2 mb-2">
                        {getChatsName().map((c: any) =>
                            <SettingChatCard key={c.id} cid={c.id} chat={c} {...SettingChatCardProps}></SettingChatCard>)}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}


export default function Setting({ openSettingHandler, chatsStore, systemStore }: any) {
    return (
        <>
            <SettingMain chatsStore={chatsStore} systemStore={systemStore}></SettingMain>
            <SettingFooter onOpenSetting={openSettingHandler}></SettingFooter>
        </>
    )
}