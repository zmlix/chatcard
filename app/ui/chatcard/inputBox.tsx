'use client'
import { Button, Select, Dropdown, message, Input, Upload, UploadFile, Badge } from 'antd';
import { HomeOutlined, SendOutlined, SmileOutlined, UploadOutlined } from '@ant-design/icons';
import { ChangeEvent, memo, useEffect, useRef, useState } from 'react';
import { TChatsStore, TMessage, TSystemStore } from '@/app';
import { random32BitNumber } from '@/app/utils/utils';
import { sendMessageApi } from '@/app/api/api';
import { useSystemStore } from "@/app/store/system"
import { useChatsStore } from '@/app/store/chats';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { BaseSelectRef } from 'rc-select/lib/BaseSelect'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { UploadChangeParam } from 'antd/es/upload';
import { UploadListType } from 'antd/es/upload/interface';

const cmdList = [
    {
        label: '清空聊天',
        value: ':clear'
    },
    {
        label: '删除聊天',
        value: ':del'
    },
    {
        label: '新建聊天',
        value: ':new'
    },
    {
        label: '上一个聊天',
        value: ':prev'
    },
    {
        label: '下一个聊天',
        value: ':next'
    },
]

export default memo(function InputBox() {
    console.log("InputBox")
    const { TextArea } = Input;
    const [text, setText] = useState('')

    const isSending = useSystemStore((state: TSystemStore) => state.isSending)
    const isShowSetting = useSystemStore((state: TSystemStore) => state.isShowSetting)
    const modelOptions = useSystemStore((state: TSystemStore) => state.models)
    const defalutModel = useChatsStore((state: TChatsStore) => state.getConfig().model)
    const promptList = useSystemStore((state: TSystemStore) => state.prompts.prompt)
    const sendingMsgId = useSystemStore((state: TSystemStore) => state.sendingMsgId)
    const setIsShowCard = useSystemStore((state: TSystemStore) => state.setIsShowCard)
    const setIsShowSetting = useSystemStore((state: TSystemStore) => state.setIsShowSetting)
    const clearMessage = useChatsStore((state: TChatsStore) => state.clearMessage)
    const removeChat = useChatsStore((state: TChatsStore) => state.removeChat)
    const setCurrentChat = useChatsStore((state: TChatsStore) => state.setCurrentChat)
    const newChat = useChatsStore((state: TChatsStore) => state.newChat)
    const setMessage = useChatsStore((state: TChatsStore) => state.setMessage)

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
            status: 'success',
            role: 'user',
            createTime: new Date(),
            updateTime: new Date(),
            model: (model === undefined ? defalutModel : model),
            fold: false,
            render: true,
            skip: false,
        }
        console.log(msg)
        if (fileList.length !== 0) {
            sendMessageApi(msg, false, fileList.map((f) => ({
                type: 'img',
                data: f.thumbUrl
            })))
        } else {
            sendMessageApi(msg)
        }
        setEmoji(false)
        setUpload(false)
        setFileList([])
        setText('')
    }

    const inputEnterHandler = (e: any) => {
        if (mention) {
            console.log(mentionOptions)
        }
        if (e.ctrlKey) {
            submitHandler()()
        }
    }

    const submitWithModelHandler = ({ item }: any) => {
        console.log(item.props.value)
        submitHandler(item.props.value)()
    }

    const mentionOptions = {
        '/': promptList.map(p => ({
            label: p.act,
            value: p.prompt,
        })),
        ':': cmdList
    }

    const selectRef = useRef<BaseSelectRef>(null)
    const textRef = useRef<TextAreaRef>(null)

    type prefixType = '/' | ':'
    const [prefix, setPrefix] = useState<prefixType>('/')
    const [mention, setMention] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
        if (mention) {
            if (e.target.value[0] === '/' || e.target.value[0] === ':') {
                const searchStr: string = e.target.value.slice(1)
                setSearchValue(searchStr)
                return
            }
            setMention(false)
            return
        }
        if (e.target.value === '/' || e.target.value === ':') {
            setPrefix(e.target.value)
            setMention(true)
        } else {
            setMention(false)
        }
    }

    const selectHandler = (value: string, option: any) => {
        if (prefix === '/') {
            setText(value)
        } else if (prefix === ':') {
            switch (value) {
                case ':clear':
                    clearMessage()
                    break;
                case ':del':
                    removeChat()
                    break
                case ':new':
                    newChat()
                    setCurrentChat()
                    break
                case ':prev':
                    setCurrentChat('-1')
                    break
                case ':next':
                    setCurrentChat('+1')
                    break
                default:
                    break;
            }
            setText('')
        }
        setSearchValue('')
        setMention(false)
        textRef.current?.focus()
    }

    const onInputKeyDownHandler = (e: KeyboardEvent) => {
        if (!(e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
            selectRef.current?.blur()
            textRef.current?.focus()
        }
    }

    useEffect(() => {
        textRef.current?.resizableTextArea?.textArea.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
                selectRef.current?.focus()
                textRef.current?.blur()
            }
        })
    }, [])

    useEffect(() => {
        if (!isSending) {
            setMessage(sendingMsgId, 'loading', false)
            if (sendingMsgId !== 0) {
                setMessage(sendingMsgId, 'status', 'stop')
            }
        }
    }, [isSending, setMessage, sendingMsgId])

    const [emoji, setEmoji] = useState(false)

    const onEmojiSelectHandler = (option: any, e: PointerEvent) => {
        console.log(option, e)
        const start = textRef.current?.resizableTextArea?.textArea.selectionStart
        const end = textRef.current?.resizableTextArea?.textArea.selectionEnd
        const emojiLen = option.native.length
        const newText = text.slice(0, start) + option.native + text.slice(start)
        setText(newText)
        setTimeout(() => {
            textRef.current?.focus()
            if (textRef.current?.resizableTextArea?.textArea.selectionStart && start) {
                textRef.current.resizableTextArea.textArea.selectionStart = start + emojiLen
            }
            if (textRef.current?.resizableTextArea?.textArea.selectionEnd && end) {
                textRef.current.resizableTextArea.textArea.selectionEnd = end + emojiLen
            }
        }, 100)
    }

    const [upload, setUpload] = useState(false)
    const [fileList, setFileList] = useState<UploadFile[]>([])

    const uploadAction = (option: any) => {
        return option.onSuccess()
    }

    const uploadFileHandler = (info: UploadChangeParam<UploadFile<any>>) => {
        console.log(info)
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-5);
        setFileList(newFileList)
    }

    return (
        <>
            {mention && <Select
                ref={selectRef}
                allowClear
                bordered={false}
                open={true}
                defaultActiveFirstOption={false}
                popupMatchSelectWidth={true}
                className='w-full opacity-0 select-none hover:cursor-default relative top-8'
                options={mentionOptions[prefix]}
                notFoundContent={''}
                optionLabelProp="label"
                searchValue={searchValue}
                onSelect={selectHandler}
                //@ts-ignore
                onInputKeyDown={onInputKeyDownHandler}
                optionRender={(option) => (
                    <div className=''>
                        <div>{option.label}</div>
                        <div className='text-xs font-thin truncate text-ellipsis pt-0.5'>{option.value}</div>
                    </div>
                )}
            />}
            <div className={upload ? 'absolute right-8 bottom-16 w-64 min-h-36 bg-white mb-2 border rounded-2xl p-2 z-50' : 'hidden'}>
                <Upload
                    customRequest={uploadAction}
                    accept='image/*'
                    listType="picture"
                    multiple
                    fileList={fileList}
                    onChange={uploadFileHandler}
                >
                    <div className='flex gap-2 items-center'>
                        <Button icon={<UploadOutlined />}>上传</Button>
                        <span>请选择文件</span>
                    </div>
                </Upload>
            </div>
            <div className='flex gap-1 items-center group'>
                <div className='flex flex-col justify-end h-full'>
                    <Button shape="circle" icon={<HomeOutlined />} onClick={OpenSettingHandler}></Button>
                </div>
                <TextArea
                    className='w-full'
                    ref={textRef}
                    value={text}
                    autoSize={{ minRows: 1, maxRows: 10 }}
                    placeholder='Ctrl+Enter发送 /触发补全 :触发命令'
                    onChange={onChangeHandler}
                    onPressEnter={inputEnterHandler}
                />
                <div className='flex items-end gap-1 h-full'>
                    <div className='hidden group-hover:flex' >
                        <Button.Group>
                            <Button style={{ width: 30 }} shape="circle"
                                icon={<SmileOutlined />} block onClick={() => setEmoji(!emoji)} />
                            <Badge count={fileList.length} size="small" offset={[-3, 3]} styles={{ indicator: { zIndex: 9999 } }}>
                                <Button style={{ width: 30 }} shape="circle"
                                    icon={<UploadOutlined />} block onClick={() => setUpload(!upload)} />
                            </Badge>
                        </Button.Group>
                    </div>
                    <Dropdown.Button type="primary" icon={<SendOutlined />} onClick={submitHandler()} menu={{ items: modelOptions, onClick: submitWithModelHandler }}>发送</Dropdown.Button>
                </div>
                <div className={emoji ? 'absolute right-8 bottom-16 flex flex-row-reverse mb-2 z-50' : 'hidden'}>
                    <Picker data={data} perLine={9} maxFrequentRows={1} emojiSize={16}
                        emojiButtonSize={24} locale={'zh'} previewPosition={'none'}
                        theme={'light'} onEmojiSelect={onEmojiSelectHandler} />
                </div>
            </div>
        </>
    )
})