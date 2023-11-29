import { useEffect, useState, memo, useRef } from 'react';
import { Input, Button, message as sysMessage } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Markdown from './markdown';
import copy from "copy-to-clipboard";

export default memo(function CardMain({ message, render, edit, quitEditHandler, submitEditHandler }: any) {

    const { TextArea } = Input;
    const [text, setText] = useState(message)
    const markdownRef = useRef<HTMLDivElement>(null)

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
            </div> :
                <div className=' hover:cursor-text overflow-auto'>
                    {render ? <div ref={markdownRef}><Markdown message={message}></Markdown></div> :
                        <pre className=' whitespace-pre-line'>{message}</pre>}
                </div>
            }
        </div>
    )
})