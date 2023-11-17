import { useEffect, useState } from 'react';
import { Input, Button } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Markdown from './markdown';


export default function CardMain({ chatsStore, systemStore, msg, edit, setEdit }: any) {
    const { TextArea } = Input;

    const { render } = msg
    const [text, setText] = useState(msg.message)
    const { setMessage } = chatsStore
    const { currentChat } = systemStore


    const submitEditHandler = () => {
        setMessage(currentChat, msg.id, 'message', text)
        setMessage(currentChat, msg.id, 'updateTime', new Date())
        setEdit(!edit)
    }

    const quitEditHandler = () => {
        setEdit(!edit)
    }

    useEffect(() => {
        if (edit) {
            setText(msg.message)
        }
    }, [edit, msg])

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
                    <Button type="primary" icon={<CheckCircleOutlined />} onClick={submitEditHandler}>修改</Button>
                </div>
            </div> :
                <>{render ? <Markdown message={msg.message}></Markdown> :
                    <pre className=' whitespace-pre-line'>{msg.message}</pre>}</>
            }
        </div>
    )
}