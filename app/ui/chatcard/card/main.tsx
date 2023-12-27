import { useEffect, useState, memo, useRef } from 'react';
import { Input, Button, Typography, Steps, message as sysMessage } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Markdown from './markdown';
import copy from "copy-to-clipboard";
import { useChatsStore } from '@/app/store/chats';
import { TChatsStore } from '@/app';


function CardCall({ log, step, fold, foldHandler }: any) {

    const status = (step / Math.abs(step))
    const current = Math.abs(step) - 1

    const steps = [
        {
            title: '查找插件',
        },
        {
            title: '执行插件',
        },
        {
            title: '完成',
        },
    ]

    const items = steps.map((item) => ({ key: item.title, title: item.title }))

    return (
        <div className='border p-1 hover:cursor-auto mb-1'>
            <span onClick={foldHandler}>
                <Steps size='small' status={status < 0 ? 'error' : 'process'} current={current} items={items} />
            </span>
            {!fold && <pre className='border mt-1 p-1 max-h-32 overflow-auto no-scrollbar bg-zinc-800 hover:cursor-text whitespace-pre-line'>
                <Typography.Paragraph copyable className='text-xs text-white'>
                    {log}
                </Typography.Paragraph>
            </pre>}
        </div>
    )
}

export default memo(function CardMain({ msg, message, edit, quitEditHandler, submitEditHandler }: any) {

    const { render, type, toolLog, callStep, fold } = msg
    const setMessage = useChatsStore((state: TChatsStore) => state.setMessage)

    // const message = (typeof msg.message === 'string' ? msg.message :
    //     (msg.message[0].text + '\n' + (msg.message.slice(1).map((m: any, idx: number) => `![image ${idx}](${m.image_url.url})`)).join('\n')))

    const { TextArea } = Input;
    const [text, setText] = useState(message)
    const markdownRef = useRef<HTMLDivElement>(null)

    const foldHandler = () => {
        setMessage(msg.id, 'fold', !msg.fold)
    }

    useEffect(() => {
        if (edit) {
            setText(message)
        }
    }, [edit, message])

    useEffect(() => {
        const preList = markdownRef.current?.getElementsByTagName('pre')
        if (preList) {
            for (let index = 0; index < preList.length; index++) {
                const pre = preList[index]
                if (pre.classList.contains('has-copy-button')) {
                    continue
                }
                pre.classList.add('has-copy-button')
                const copyElement = document.createElement('div')
                copyElement.classList.add('flex', 'justify-end', 'w-full', 'h-0', 'relative', 'right-7', 'top-8')
                copyElement.innerHTML = '<button type="button" class="ant-btn css-dev-only-do-not-override-2i2tap css-2i2tap ant-btn-default ant-btn-sm"><span>复 制</span></button>'
                copyElement.addEventListener('mouseover', () => {
                    copyElement.style.display = ''
                })
                copyElement.addEventListener('click', async () => {
                    if (pre.textContent) {
                        copy(pre.textContent)
                        sysMessage.success({
                            content: '复制成功'
                        })
                    }
                })
                pre.insertAdjacentElement('beforebegin', copyElement)
                pre.addEventListener('mouseover', () => {
                    copyElement.style.display = ''
                })
                pre.addEventListener('mouseout', () => {
                    copyElement.style.display = 'none'
                })
            }
        }
    })

    return (
        <div className='p-2 font-mono text-sm'>
            <div className=' hover:cursor-text overflow-auto'>
                {type === 'tool' && <CardCall log={toolLog} step={callStep} fold={fold} foldHandler={foldHandler}></CardCall>}
                {edit ? <div className='flex flex-col gap-1 items-end'>
                    <TextArea
                        value={text}
                        autoSize={{ minRows: 3, maxRows: 15 }}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className='flex gap-1'>
                        <Button icon={<CloseCircleOutlined />} onClick={quitEditHandler}>放弃</Button>
                        <Button type="primary" icon={<CheckCircleOutlined />}
                            onClick={submitEditHandler(text)}>修改</Button>
                    </div>
                </div> : <>
                    {render ? <div ref={markdownRef}><Markdown message={message}></Markdown></div> :
                        <pre className=' whitespace-pre-line'>
                            <Typography.Paragraph copyable={{ tooltips: ['复制', '复制成功'], }}>{message}</Typography.Paragraph>
                        </pre>}
                </>
                }
            </div>
        </div>
    )
})