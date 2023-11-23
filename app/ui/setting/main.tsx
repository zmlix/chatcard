import { DndContext } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { TChat, TChatsStore, TSystemStore } from "@/app";
import { PlusOutlined } from "@ant-design/icons"
import { Button } from "antd"
import SettingChatCard from "./card"
import { useChatsStore } from "@/app/store/chats"
import { useShallow } from 'zustand/react/shallow';

export default function SettingMain() {
    console.log("SettingMain")

    const currentChat = useChatsStore((state: TChatsStore) => state.currentChat)
    const chatsId = useChatsStore(useShallow((state: TChatsStore) => state.chats.map((chat) => chat.id)))
    const newChat = useChatsStore((state: TChatsStore) => state.newChat)
    const moveChats = useChatsStore((state: TChatsStore) => state.moveChats)
    const setCurrentChat = useChatsStore((state: TChatsStore) => state.setCurrentChat)

    function handleDragEnd(event: any) {
        const { active, over } = event
        if (!active || !over) return
        if (active.id !== over.id) {
            const oldIndex = chatsId.findIndex((id: number) => id === active.id);
            const newIndex = chatsId.findIndex((id: number) => id === over.id)
            moveChats(oldIndex, newIndex)
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
                <SortableContext items={chatsId}>
                    <div className="flex flex-col gap-1 mt-2 mb-2">
                        {chatsId.map((id: number, idx: number) =>
                            <SettingChatCard key={id} cid={id} index={idx}></SettingChatCard>)}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}