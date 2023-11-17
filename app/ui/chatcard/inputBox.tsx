'use client'
import { Button, Mentions, Dropdown } from 'antd';
import { HomeOutlined, SendOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { TMessage } from '@/app';
import { random32BitNumber } from '@/app/utils/utils';
import type { MenuProps } from 'antd';

export default function InputBox({ onOpenSetting, chatsStore, systemStore }: any) {

    const [text, setText] = useState('')
    const { addMessage, } = chatsStore
    const { currentChat, setIsSending } = systemStore

    const submitHandler = () => {
        if (text.length === 0) {
            return
        }
        const message: TMessage = {
            id: random32BitNumber(),
            message: text,
            type: 'text',
            role: 'user',
            createTime: new Date(),
            updateTime: new Date(),
            model: 'gpt-4',
            fold: false,
            render: true,
            skip: false,
        }
        console.log(text)
        setIsSending(true)
        // setTimeout(() => {
        // }, 3000)
        addMessage(currentChat, message)
        setIsSending(false)
        setText('')
    }

    const inputEnterHandler = (e: any) => {
        console.log(e, e.ctrlKey)
        if (e.ctrlKey) {
            submitHandler()
        }
    }

    const models = [
        {
            key: '1',
            label: '1st item',
        },
        {
            key: '2',
            label: '2nd item',
        },
        {
            key: '3',
            label: '3rd item',
        },
    ];

    return (
        <div className='flex gap-2 items-center'>
            <div className='flex flex-col justify-end h-full'>
                <Button shape="circle" icon={<HomeOutlined />} onClick={onOpenSetting}></Button>
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
                <Dropdown.Button type="primary" icon={<SendOutlined />} onClick={submitHandler} menu={{ items: models, onClick: submitHandler }}>发送</Dropdown.Button>
            </div>
        </div>
    )
}