import { Input, Tooltip, Select, Slider, InputNumber, Switch, Button } from "antd"
import { ToolOutlined, MessageOutlined } from "@ant-design/icons"
import { useSystemStore } from "@/app/store/system"
import { TChatsStore, TSystemStore } from "@/app"
import { useState } from "react"
import { useChatsStore } from "@/app/store/chats"
import { getModelApi } from "@/app/api/api"

function SettingSystemConfig() {

    const config = useSystemStore((state: TSystemStore) => state.config)
    const setConfig = useSystemStore((state: TSystemStore) => state.setConfig)
    const modelOptions = useSystemStore((state: TSystemStore) => state.models)

    const setConfigHandler = (attr: string) => (value: any) => {
        console.log(attr, value, typeof value)
        if (typeof value === 'object') {
            if (value) {
                value = value.target.value
            }

            if (attr === 'api_url' && value === '') {
                value = 'https://api.openai.com/v1/chat/completions'
            }
        }
        setConfig(attr, value)
    }

    const [loading, setLoading] = useState(false)

    const getModelHandler = () => {
        getModelApi(setLoading)
    }

    return (
        <>
            <div className="border w-full rounded-2xl">
                <div className="flex flex-col gap-1 p-2">
                    <span>API URL</span>
                    <div><Input placeholder="默认使用OPENAI地址"
                        defaultValue={config.api_url} allowClear
                        onChange={setConfigHandler('api_url')} /></div>
                </div>
                <div className="flex flex-col gap-1 p-2">
                    <span>API KEY</span>
                    <div><Input.Password placeholder="填入API KEY后才可使用"
                        defaultValue={config.api_key} allowClear
                        onChange={setConfigHandler('api_key')} /></div>
                </div>
                <div className="flex flex-col gap-1 p-2">
                    <Button loading={loading} type="primary" onClick={getModelHandler}>获取模型</Button>
                </div>
            </div>
            <div className="border w-full rounded-2xl">
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="隐藏ChatCard标志" placement="bottomRight" arrow={false}>
                            <span className="text-sm">ChatCard标志</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Switch className='bg-zinc-400' checkedChildren="显示" unCheckedChildren="隐藏"
                            defaultChecked={config.showHeader} onChange={setConfigHandler('showHeader')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="关闭Emoji选择器,使用系统输入法输入" placement="bottomRight" arrow={false}>
                            <span className="text-sm">Emoji选择器</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Switch className='bg-zinc-400' checkedChildren="开启" unCheckedChildren="关闭"
                            defaultChecked={config.showEmoji} onChange={setConfigHandler('showEmoji')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="此功能仅对GPT-4-Vision多模态模型有效,可对上传图像进行提问" placement="bottomRight" arrow={false}>
                            <span className="text-sm">图片上传</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Switch className='bg-zinc-400' checkedChildren="开启" unCheckedChildren="关闭"
                            defaultChecked={config.showUpload} onChange={setConfigHandler('showUpload')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="可以选择不同的发送方式" placement="bottomRight" arrow={false}>
                            <span className="text-sm">发送键</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Select
                            defaultValue={config.sendMethod}
                            style={{ width: 160 }}
                            onChange={setConfigHandler('sendMethod')}
                            options={[
                                { value: 'Enter', label: 'Enter' },
                                { value: 'Ctrl', label: 'Ctrl+Enter' },
                                { value: 'Shift', label: 'Shift+Enter' },
                                { value: 'Alt', label: 'Alt+Enter' },
                                { value: 'Meta', label: 'Meta+Enter' },
                            ]}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default h-12">
                    <div>
                        <Tooltip title="选择是否启用插件功能" placement="bottomRight" arrow={false}>
                            <span className="text-sm">插件</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Switch className='bg-zinc-400' checkedChildren="开启" unCheckedChildren="关闭"
                            defaultChecked={config.plugin} onChange={setConfigHandler('plugin')} />
                    </div>
                </div>
            </div>
            <div className="border w-full rounded-2xl">
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="选择不同聊天模型" placement="bottomRight" arrow={false}>
                            <span className="text-sm">模型(model)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Select
                            defaultValue={config.model}
                            style={{ width: 160 }}
                            onChange={setConfigHandler('model')}
                            options={modelOptions}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="较高的值将使输出更加随机" placement="bottomRight" arrow={false}>
                            <span className="text-sm">温度(temperature)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Slider style={{ width: 100 }} defaultValue={config.temperature} min={0} max={2} step={0.1}
                            tooltip={{ placement: "right" }} onChange={setConfigHandler('temperature')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="建议更改此设置或温度(temperature)但不能同时更改两者" placement="bottomRight" arrow={false}>
                            <span className="text-sm">核采样(top_p)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Slider style={{ width: 100 }} defaultValue={config.top_p} min={0} max={1} step={0.1}
                            tooltip={{ placement: "right" }} onChange={setConfigHandler('top_p')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="根据目前文本中的现有频率对新Token进行惩罚,从而降低模型逐字重复同一行的可能性"
                            placement="bottomRight" arrow={false}>
                            <span className="text-sm">频率惩罚(frequency_penalty)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Slider style={{ width: 100 }} defaultValue={config.frequency_penalty} min={-2} max={2} step={0.1}
                            tooltip={{ placement: "right" }} onChange={setConfigHandler('frequency_penalty')} />

                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="根据新Token目前是否出现在文本中来对其进行惩罚,从而增加模型谈论新主题的可能性"
                            placement="bottomRight" arrow={false}>
                            <span className="text-sm">存在惩罚(presence_penalty)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Slider style={{ width: 100 }} defaultValue={config.presence_penalty} min={-2} max={2} step={0.1}
                            tooltip={{ placement: "right" }} onChange={setConfigHandler('presence_penalty')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="每次聊天完成时生成的最大Token数,0值为无限制" placement="bottomRight" arrow={false}>
                            <span className="text-sm">最大Token数(max_tokens)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <InputNumber min={0} max={512000} defaultValue={config.max_tokens}
                            value={config.max_tokens} onChange={setConfigHandler('max_tokens')} />
                    </div>
                </div>
                {/* <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="相同种子(seed)参数的重复请求尽量返回相同的结果(seed=0默认不启用此功能)" placement="bottomRight" arrow={false} >
                            <span className="text-sm">种子(seed)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <InputNumber style={{ width: 160 }} defaultValue={config.seed} min={0} max={Math.min()}
                            onChange={setConfigHandler('seed')} />
                    </div>
                </div> */}
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="默认每次对话自动打开跳过开关" placement="bottomRight" arrow={false}>
                            <span className="text-sm">默认跳过</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Switch className='bg-zinc-400' checkedChildren="开启" unCheckedChildren="关闭"
                            defaultChecked={config.autoSkip} onChange={setConfigHandler('autoSkip')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default h-12">
                    <div>
                        <Tooltip title="默认每次对话自动打开渲染开关" placement="bottomRight" arrow={false}>
                            <span className="text-sm">默认渲染</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Switch className='bg-zinc-400' checkedChildren="开启" unCheckedChildren="关闭"
                            defaultChecked={config.autoRender} onChange={setConfigHandler('autoRender')} />
                    </div>
                </div>
            </div>
        </>
    )
}

function SettingChatConfig() {

    const config = useChatsStore((state: TChatsStore) => state.getConfig())
    const setConfig = useChatsStore((state: TChatsStore) => state.setConfig)
    const modelOptions = useSystemStore((state: TSystemStore) => state.models)

    const setConfigHandler = (attr: string) => (value: any) => {
        console.log(attr, value, typeof value)
        if (typeof value === 'object') {
            if (value) {
                value = value.target.value
            } else {
                value = 0
            }
        }
        setConfig(attr, value)
    }

    return (
        <>
            <div className="border w-full rounded-2xl">
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="聊天标题" placement="bottomRight" arrow={false} >
                            <span className="text-sm">聊天标题</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Input defaultValue={config.title} value={config.title} placeholder="聊天标题"
                            onChange={setConfigHandler('title')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="选择不同聊天模型" placement="bottomRight" arrow={false} >
                            <span className="text-sm">模型(model)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Select
                            defaultValue={config.model}
                            style={{ width: 160 }}
                            onChange={setConfigHandler('model')}
                            options={modelOptions}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="较高的值将使输出更加随机" placement="bottomRight" arrow={false} >
                            <span className="text-sm">温度(temperature)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Slider style={{ width: 100 }} defaultValue={config.temperature} min={0} max={2} step={0.1}
                            tooltip={{ placement: "right" }} onChange={setConfigHandler('temperature')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="建议更改此设置或温度(temperature)但不能同时更改两者" placement="bottomRight" arrow={false} >
                            <span className="text-sm">核采样(top_p)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Slider style={{ width: 100 }} defaultValue={config.top_p} min={0} max={1} step={0.1}
                            tooltip={{ placement: "right" }} onChange={setConfigHandler('top_p')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="根据目前文本中的现有频率对新Token进行惩罚,从而降低模型逐字重复同一行的可能性"
                            placement="bottomRight" arrow={false} >
                            <span className="text-sm">频率惩罚(frequency_penalty)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Slider style={{ width: 100 }} defaultValue={config.frequency_penalty} min={-2} max={2} step={0.1}
                            tooltip={{ placement: "right" }} onChange={setConfigHandler('frequency_penalty')} />

                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="根据新Token目前是否出现在文本中来对其进行惩罚,从而增加模型谈论新主题的可能性"
                            placement="bottomRight" arrow={false} >
                            <span className="text-sm">存在惩罚(presence_penalty)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Slider style={{ width: 100 }} defaultValue={config.presence_penalty} min={-2} max={2} step={0.1}
                            tooltip={{ placement: "right" }} onChange={setConfigHandler('presence_penalty')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="每次聊天完成时生成的最大Token数,0值为无限制" placement="bottomRight" arrow={false}>
                            <span className="text-sm">最大Token数(max_tokens)</span>
                        </Tooltip>
                    </div>
                    <div>
                        <InputNumber min={0} max={512000} defaultValue={config.max_tokens}
                            value={config.max_tokens} onChange={setConfigHandler('max_tokens')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default border-b h-12">
                    <div>
                        <Tooltip title="默认每次对话自动打开跳过开关" placement="bottomRight" arrow={false} >
                            <span className="text-sm">默认跳过</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Switch className='bg-zinc-400' checkedChildren="开启" unCheckedChildren="关闭"
                            defaultChecked={config.autoSkip} onChange={setConfigHandler('autoSkip')} />
                    </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:cursor-default h-12">
                    <div>
                        <Tooltip title="默认每次对话自动打开渲染开关" placement="bottomRight" arrow={false} >
                            <span className="text-sm">默认渲染</span>
                        </Tooltip>
                    </div>
                    <div>
                        <Switch className='bg-zinc-400' checkedChildren="开启" unCheckedChildren="关闭"
                            defaultChecked={config.autoRender} onChange={setConfigHandler('autoRender')} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default function SettingConfig() {
    console.log("SettingConfig")

    type Tab = 'system' | 'chat'
    const [tab, setTab] = useState<Tab>('chat')

    return (
        <div className="flex flex-col h-full m-1 gap-2 overflow-auto">
            <Button.Group className="w-full">
                <Button icon={<MessageOutlined />} block shape="round"
                    type={tab === 'chat' ? 'primary' : undefined}
                    onClick={() => setTab('chat')}>聊天设置</Button>
                <Button icon={<ToolOutlined />} block shape="round"
                    type={tab === 'system' ? 'primary' : undefined}
                    onClick={() => setTab('system')}>系统设置</Button>
            </Button.Group>
            <div className="flex flex-col h-full m-1 gap-2 font-serif overflow-auto no-scrollbar">
                {{
                    "system": <SettingSystemConfig />,
                    "chat": <SettingChatConfig />
                }[tab]}
            </div>
        </div>
    )
}