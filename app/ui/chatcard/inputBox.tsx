'use client'
import { Button, Mentions, Dropdown, message } from 'antd';
import { HomeOutlined, SendOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { TChatsStore, TMessage, TSystemStore } from '@/app';
import { random32BitNumber } from '@/app/utils/utils';
import { sendMessageApi } from '@/app/api/api';
import { useSystemStore } from "@/app/store/system"
import { useChatsStore } from '@/app/store/chats';

export default function InputBox() {
    console.log("InputBox")
    const [text, setText] = useState('')

    const isSending = useSystemStore((state: TSystemStore) => state.isSending)
    const isShowSetting = useSystemStore((state: TSystemStore) => state.isShowSetting)
    const setIsShowCard = useSystemStore((state: TSystemStore) => state.setIsShowCard)
    const setIsShowSetting = useSystemStore((state: TSystemStore) => state.setIsShowSetting)
    const modelOptions = useSystemStore((state: TSystemStore) => state.models)
    const defalutModel = useChatsStore((state: TChatsStore) => state.getConfig().model)

    const OpenSettingHandler = () => {
        setIsShowSetting(!isShowSetting)
        if (window.innerWidth <= 768 && !isShowSetting) {
            setIsShowCard(false)
        } else {
            setIsShowCard(true)
        }
    }

    const submitHandler = (model?: string | undefined) => () => {
        if (text.length === 0) {
            return
        }
        if (isSending) {
            message.warning({
                content: "请等待回答完成"
            })
            return
        }
        const msg: TMessage = {
            id: random32BitNumber(),
            message: text,
            type: 'text',
            role: 'user',
            createTime: new Date(),
            updateTime: new Date(),
            model: (model === undefined ? defalutModel : model),
            fold: false,
            render: true,
            skip: false,
        }
        console.log(text)
        sendMessageApi(msg)
        setText('')
    }

    const inputEnterHandler = (e: any) => {
        console.log(e, e.ctrlKey)
        if (e.ctrlKey) {
            submitHandler()()
        }
    }

    const submitWithModelHandler = ({ item }: any) => {
        console.log(item.props.value)
        submitHandler(item.props.value)()
    }

    return (
        <div className='flex gap-2 items-center'>
            <div className='flex flex-col justify-end h-full'>
                <Button shape="circle" icon={<HomeOutlined />} onClick={OpenSettingHandler}></Button>
            </div>
            <Mentions
                autoSize={{ minRows: 1, maxRows: 10 }}
                prefix='/'
                options={[]}
                value={text}
                onChange={(e) => setText(e)}
                onPressEnter={inputEnterHandler}
                placeholder='Ctrl+Enter 发送'
            />
            <div className='flex flex-col justify-end h-full'>
                <Dropdown.Button type="primary" icon={<SendOutlined />} onClick={submitHandler()} menu={{ items: modelOptions, onClick: submitWithModelHandler }}>发送</Dropdown.Button>
            </div>
        </div>
    )
}