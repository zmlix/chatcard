import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { TChatsStore, TSystemStore } from "@/app";
import { RedoOutlined } from "@ant-design/icons"
import SettingChatCard from "./card"
import { useChatsStore } from "@/app/store/chats"
import { useShallow } from 'zustand/react/shallow';
import { useSystemStore } from '@/app/store/system';

export default function SettingMain() {
    console.log("SettingMain")

    const currentChat = useChatsStore((state: TChatsStore) => state.currentChat)
    const chatsId = useChatsStore(useShallow((state: TChatsStore) => state.chats.map((chat) => chat.id)))
    const moveChats = useChatsStore((state: TChatsStore) => state.moveChats)
    const setCurrentChat = useChatsStore((state: TChatsStore) => state.setCurrentChat)

    const api_url = useSystemStore((state: TSystemStore) => state.config.api_url)

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
            {/* {api_url.indexOf('api.openai.com') === -1 &&
                <div className='flex justify-between items-center font-mono text-sm text-zinc-500 border-b mb-1 pl-2 pr-2'>
                    <div className='flex gap-2 items-center'>
                        <span>剩余Token数量</span>
                        <span className='font-sans text-stone-900 text-base pb-0.5'>0</span>
                        </div>
                    <Button className='hover:animate-spin' size='small' type="link" icon={<RedoOutlined />} />
                </div>} */}
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