import { useState } from "react"
import { Button, Input, Space, Popconfirm } from "antd"
import { DeleteFilled, FormOutlined, CheckOutlined, QuestionCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useChatsStore } from "@/app/store/chats"
import { TChatsStore } from "@/app";

export default function SettingChatCard({ cid, index }: any) {
    console.log("SettingChatCard")

    const currentChat = useChatsStore((state: TChatsStore) => state.currentChat)
    const setCurrentChat = useChatsStore((state: TChatsStore) => state.setCurrentChat)
    const removeChat = useChatsStore((state: TChatsStore) => state.removeChat)
    const setConfig = useChatsStore((state: TChatsStore) => state.setConfig)

    const chatTitle = useChatsStore((state: TChatsStore) => state.chats[index].config.title)
    const messageNumber = useChatsStore((state: TChatsStore) => state.chats[index].messages.length)

    const openChatHandler = () => {
        setCurrentChat(index)
    }

    const removeChatHandler = () => {
        removeChat(index)
    }

    const [edit, setEdit] = useState(false)
    const [title, setTitle] = useState(chatTitle)

    const editChatHandler = () => {
        setEdit(!edit)
    }

    const editChatSubmitHandler = () => {
        if (title.length === 0) {
            return
        }
        setConfig('title', title)
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
            <div ref={preview} style={style} {...attributes} className={currentChat === index ? className + "bg-zinc-200" : className + "bg-white"}>
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
                                <div className='truncate text-ellipsis hover:cursor-text'>
                                    {chatTitle}
                                </div>
                            </div>
                            <div className="font-serif text-sm text-stone-600">
                                {messageNumber} 条对话
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