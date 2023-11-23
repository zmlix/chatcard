import { useEffect, useState, memo } from 'react';
import { Input, Button } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Markdown from './markdown';
import { useChatsStore } from "@/app/store/chats"
import { TChatsStore } from '@/app';


export default memo(function CardMain({ message, render, edit, quitEditHandler, submitEditHandler }: any) {

    const { TextArea } = Input;
    const [text, setText] = useState(message)

    useEffect(() => {
        if (edit) {
            setText(message)
        }
    }, [edit, message])

    return (
        <div className='p-2 font-mono'>
            {edit ? <div className='flex flex-col gap-1 items-end'>
                <TextArea
                    value={text}
                    autoSize={{ minRows: 3, maxRows: 15 }}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className='flex gap-1'>
                    <Button icon={<CloseCircleOutlined />} onClick={quitEditHandler}>放弃</Button>
                    <Button type="primary" icon={<CheckCircleOutlined />} onClick={submitEditHandler(text)}>修改</Button>
                </div>
            </div> :
                <div className=' hover:cursor-text'>
                    {render ? <Markdown message={message}></Markdown> :
                        <pre className=' whitespace-pre-line'>{message}</pre>}
                </div>
            }
        </div>
    )
})