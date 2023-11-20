import { DndContext } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { TChat } from "@/app";
import { PlusOutlined } from "@ant-design/icons"
import { Button } from "antd"
import SettingChatCard from "./card"

export default function SettingMain({ chatsStore, systemStore }: any) {

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
        <div className="flex flex-col h-full m-1 overflow-auto no-scrollbar">
            <Button block onClick={newChat} icon={<PlusOutlined />}>新的聊天</Button>
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