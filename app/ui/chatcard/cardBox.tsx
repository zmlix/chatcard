import Card from "./card/card"
import { useEffect, useRef, memo } from "react";
import { TChatsStore, TMessage, TSystemStore } from "@/app";
import { RobotOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { random32BitNumber } from "@/app/utils/utils";
import { useChatsStore } from "@/app/store/chats"
import { useSystemStore } from "@/app/store/system"
import { useShallow } from "zustand/react/shallow";
import { sendMessageApi } from "@/app/api/api";
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'

export default memo(function CardBox() {
    console.log("cardBox")

    const boxRef = useRef<VirtuosoHandle>(null)

    const isSending = useSystemStore((state: TSystemStore) => state.isSending)
    const needScroll = useSystemStore((state: TSystemStore) => state.needScroll)
    const currentChat = useChatsStore((state: TChatsStore) => state.currentChat)
    const messages = useChatsStore(useShallow((state: TChatsStore) =>
        state.getCurrentChat().messages.map((msg) => msg.id)))
    const setIsSending = useSystemStore((state: TSystemStore) => state.setIsSending)
    const setNeedScroll = useSystemStore((state: TSystemStore) => state.setNeedScroll)

    const problem = [
        "正态分布的概率密度函数是什么?",
        "为什么陨石总能精准的砸到陨石坑里?",
        "帮我写一段计算斐波那契数列的Python代码"
    ]

    useEffect(() => {
        console.log("set scrollTop")
        if (needScroll) {
            setTimeout(() => {
                if (boxRef.current) {
                    console.log("message length", messages.length)
                    boxRef.current.scrollToIndex({
                        index: messages.length - 1,
                        align: 'end',
                        behavior: 'auto'
                    })
                }
                setNeedScroll(false)
            }, 300)
        }
    }, [needScroll, setNeedScroll, messages])

    const tryHandler = (problem: string) => () => {
        console.log(problem)
        const msg: TMessage = {
            id: random32BitNumber(),
            message: problem,
            type: 'text',
            status: 'success',
            role: 'user',
            createTime: new Date(),
            updateTime: new Date(),
            model: '',
            fold: false,
            render: true,
            skip: false,
            loading: false,
            token: 0
        }
        sendMessageApi(msg)
    }

    const cancelHandler = () => {
        setIsSending(false)
    }

    return (
        <div className="grid overflow-auto no-scrollbar" style={{ height: "inherit" }}>
            <div className="flex flex-col gap-1 h-full p-3 overflow-auto no-scrollbar items-center">
                {messages.length === 0 ?
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
                    <div className="h-full w-full">
                        <Virtuoso
                            ref={boxRef}
                            data={messages}
                            className="no-scrollbar"
                            totalCount={messages.length}
                            itemContent={(index, id) => <Card key={id} mid={id}></Card>} />
                    </div>
                }

                {isSending && <div className='rounded-md z-50'>
                    <Button type="primary" onClick={cancelHandler}>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 border-2"></span> 停止请求
                        </div>
                    </Button>
                </div>}
            </div>

        </div>
    )
})