import { Switch, Select } from 'antd';


export default function CardFooter({ msg, chatsStore, systemStore }: any) {

    const { fold } = msg
    const { setMessage } = chatsStore
    const { currentChat } = systemStore

    const renderHandler = (checked: boolean) => {
        console.log("render...", checked)
        setMessage(currentChat, msg.id, 'render', checked)
    }

    const skipHandler = (checked: boolean) => {
        console.log("skip...", checked)
        setMessage(currentChat, msg.id, 'skip', checked)
    }

    const modelHandler = (value: string) => {
        console.log("model...", value)
        setMessage(currentChat, msg.id, 'model', value)
    }

    return (
        <>
            {fold && <div className='flex w-80'>
                <div className='truncate text-ellipsis p-2'>
                    {msg.message}
                </div>
            </div>}
            <div className='flex justify-between border-t pl-1 pr-1'>
                <div className='font-mono w-max mt-0.5 mb-0.5 h-6'>
                    {msg.role === 'user' && <Select
                        defaultValue="gpt-3.5"
                        size="small"
                        style={{ width: 120 }}
                        onChange={modelHandler}
                        options={[
                            { value: 'gpt-3.5', label: 'gpt-3.5' },
                            { value: 'gpt-3.5-turbo-16k-0613', label: 'gpt-3.5-turbo-16k-0613' },
                            { value: 'gpt-4', label: 'gpt-4' },
                        ]}
                    />}
                </div>
                <div className='flex gap-1 items-center justify-end'>
                    <Switch size="small" className='bg-zinc-400' checkedChildren="渲染"
                        unCheckedChildren="渲染" checked={msg.render} onChange={renderHandler} />
                    <Switch size="small" className='bg-zinc-400' checkedChildren="跳过"
                        unCheckedChildren="跳过" checked={msg.skip} onChange={skipHandler} />
                </div>
            </div>
        </>
    )
}