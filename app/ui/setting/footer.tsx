import { Button, Radio } from "antd"
import { SettingOutlined, CommentOutlined, ThunderboltOutlined, AppstoreAddOutlined } from "@ant-design/icons"
import { TSettingView } from "./setting"
import { useSystemStore } from "@/app/store/system"

export default function SettingFooter({ view, setView }: any) {

    const systemStore = useSystemStore()
    const { isShowSetting, isShowCard, setIsShowCard, setIsShowSetting } = systemStore

    const OpenSettingHandler = () => {
        setIsShowSetting(!isShowSetting)
        if (window.innerWidth <= 768 && !isShowSetting) {
            setIsShowCard(false)
        } else {
            setIsShowCard(true)
        }
    }


    const switchViewHandler = (view: TSettingView) => () => {
        setView(view)
    }

    const views: Array<{ name: string, view: TSettingView, icon: any }> = [
        {
            name: "聊天",
            view: "main",
            icon: <CommentOutlined />
        },
        {
            name: "设置",
            view: "config",
            icon: <SettingOutlined />
        },
        {
            name: "预设",
            view: "prompt",
            icon: <ThunderboltOutlined />
        },
        {
            name: "插件",
            view: "plugin",
            icon: <AppstoreAddOutlined />
        }
    ]

    return (
        <div className="flex flex-col gap-1">
            <div className="flex gap-1">
                <Button.Group className="w-full">
                    {views.map((v, idx) => (
                        <Button key={idx} icon={v.icon} block onClick={switchViewHandler(v.view)}
                            disabled={v.view === 'plugin'}
                            type={v.view === view ? 'primary' : undefined}>{v.name}</Button>))}
                </Button.Group>
            </div>
            {(isShowSetting && !isShowCard) && <Button type="primary" danger onClick={OpenSettingHandler}>关闭</Button>}
            <div className="flex justify-center items-center border border-dashed rounded text-sm">
                Star on<Button type="link" size="small">GitHub</Button>@zmlix
            </div>
        </div>
    )
}