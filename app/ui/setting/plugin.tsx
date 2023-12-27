import { Avatar, Switch, Empty, Input, Button, Typography } from "antd"
import { AppstoreAddOutlined, ReloadOutlined } from "@ant-design/icons"
import { useState } from "react"
import { usePluginStore } from "@/app/store/plugin"
import { connectPluginSystem } from "@/app/api/plugin";
import { TPlugin, TPluginStore } from "@/app";

function PluginCard({ index, plugin }: any) {

    const { display, info, disable }: TPlugin = plugin
    const [setting, setSetting] = useState(false)
    const setPluginsAttr = usePluginStore((state: TPluginStore) => state.setPluginsAttr)

    return (
        <div>
            <div className={"flex gap-1 items-center border rounded-xl p-1 " + (setting ? "rounded-b-none" : "")}>
                <div className="hover:cursor-pointer" onClick={() => setSetting(!setting)}>
                    <Avatar shape="square" size="default" icon={<AppstoreAddOutlined />} />
                </div>
                <div className="flex justify-between items-center w-full">
                    <div className="text-sm">
                        <Typography.Text>{display}-{info[0].function.name}</Typography.Text>
                    </div>
                    <div className="min-w-fit">
                        <Switch className='bg-zinc-400' checkedChildren="启用" unCheckedChildren="禁用"
                            defaultChecked={!!!disable}
                            onChange={(v) => setPluginsAttr(index, 'disable', !v)} />
                    </div>
                </div>
            </div>
            <div className={setting ? "border border-t-0 rounded-xl rounded-t-none p-1" : "hidden"}>
                <div className="p-1 text-sm border rounded">
                    {info[0].function.description}
                </div>
                {/* <div>
                    <Empty image={<span>无配置项</span>} imageStyle={{ height: 14 }} description={""} />
                </div> */}
            </div>
        </div>
    )
}

export default function SettingPlugin() {

    const setUrl = usePluginStore((state: TPluginStore) => state.setUrl)
    const url = usePluginStore((state: TPluginStore) => state.url)
    const plugins = usePluginStore((state: TPluginStore) => state.plugins)

    const connect = () => {
        connectPluginSystem()
    }

    return (
        <>
            <div className="m-1 flex gap-1">
                <Input placeholder="插件系统地址" defaultValue={url} value={url}
                    onChange={(e) => setUrl(e.target.value)} />
                <Button shape="circle" icon={<ReloadOutlined />} onClick={connect} />
            </div>
            <div className="h-full m-1 overflow-auto no-scrollbar">
                <div className="flex flex-col gap-1">
                    {
                        plugins.map((plugin, idx) =>
                            <div key={idx}>
                                <PluginCard index={idx} plugin={plugin}></PluginCard>
                            </div>)
                    }
                </div>
            </div>
        </>
    )
}