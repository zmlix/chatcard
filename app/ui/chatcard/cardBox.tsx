import Card from "./card/card"
import { useEffect, useState, useRef } from "react";
import { TMessage } from "@/app";
import { RobotOutlined } from "@ant-design/icons";
import { Tag, Button } from "antd";
import { random32BitNumber } from "@/app/utils/utils";
import { DndContext } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

export default function CardBox({ chatsStore, systemStore }: any) {

    const boxRef = useRef(null)
    const { currentChat, setCurrentChat, setIsSending, isSending } = systemStore
    const { getChatsNumber, addMessage, changeMessages } = chatsStore

    const problem = [
        "正态分布的概率密度函数是什么?",
        "为什么陨石总能精准的砸到陨石坑里?",
        "帮我写一段计算斐波那契数列的Python代码"
    ]

    useEffect(() => {
        setCurrentChat(currentChat >= getChatsNumber() ? currentChat - 1 : currentChat)
    })

    useEffect(() => {
        //@ts-ignore
        boxRef.current.scrollTop = boxRef.current.scrollHeight
    })

    const tryHandler = (problem: string) => () => {
        console.log(problem)
        const message: TMessage = {
            id: random32BitNumber(),
            message: problem,
            type: 'text',
            role: 'user',
            createTime: new Date(),
            updateTime: new Date(),
            model: 'gpt-3.5',
            fold: false,
            render: true,
            skip: false,
            token: 0
        }
        setIsSending(true)
        addMessage(currentChat, message)
        setIsSending(false)
    }

    const cancelHandler = () => {
        setIsSending(false)
    }

    const CardProps = {
        chatsStore,
        systemStore
    }

    function handleDragEnd(event: any) {
        const { active, over } = event
        if (!active || !over) return
        if (active.id !== over.id) {
            const oldIndex = chatsStore.getMessages(currentChat).findIndex((msg: TMessage) => msg.id === active.id);
            const newIndex = chatsStore.getMessages(currentChat).findIndex((msg: TMessage) => msg.id === over.id)
            changeMessages(currentChat, arrayMove(chatsStore.getMessages(currentChat), oldIndex, newIndex))
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={chatsStore.getMessages(currentChat >= getChatsNumber() ? currentChat - 1 : currentChat)}>
                <div ref={boxRef} className="flex flex-col gap-1 h-full p-3 overflow-auto no-scrollbar items-center">
                    {chatsStore.getMessages(currentChat >= getChatsNumber() ? currentChat - 1 : currentChat).length === 0 ?
                        <div className="flex flex-wrap justify-center h-full w-full gap-2 ">
                            <RobotOutlined className="text-8xl" />
                            <div className="flex items-center text-xl">
                                <div className="p-2">
                                    <div>不知道问什么?</div>
                                    <div>试试下面的提问:</div>
                                    {problem.map((p, idx) =>
                                        <div key={idx}>
                                            <div className="hover:cursor-pointer mt-0.5 mb-0.5 border border-black bg-white rounded-md p-0.5"
                                                style={{ fontSize: 16 }} onClick={tryHandler(p)}>
                                                <span>{p}</span>
                                            </div>
                                        </div>)}
                                </div>
                            </div>
                        </div>
                        :
                        chatsStore.getMessages(currentChat >= getChatsNumber() ? currentChat - 1 : currentChat)
                            .map((msg: TMessage, idx: number) =>
                                <Card key={msg.id} mid={msg.id} msg={msg} {...CardProps}></Card>
                            )
                    }

                    {isSending && <div className='fixed bottom-20 border rounded-md w-24 h-8'>
                        <Button type="primary" onClick={cancelHandler}>
                            <div className="flex items-center gap-1">
                                <span className=" w-3 h-3 border-2 border-white"></span> 停止请求
                            </div>
                        </Button>
                    </div>}
                </div>
            </SortableContext>
        </DndContext>
    )
}