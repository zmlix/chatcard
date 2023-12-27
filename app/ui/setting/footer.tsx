import { Button, Radio } from "antd"
import { SettingOutlined, CommentOutlined, ThunderboltOutlined, AppstoreAddOutlined } from "@ant-design/icons"
import { TSettingView } from "./setting"
import { useSystemStore } from "@/app/store/system"
import { TSystemStore } from "@/app"

export default function SettingFooter({ view, setView }: any) {

    const isShowSetting = useSystemStore((state: TSystemStore) => state.isShowSetting)
    const isShowCard = useSystemStore((state: TSystemStore) => state.isShowCard)
    const setIsShowCard = useSystemStore((state: TSystemStore) => state.setIsShowCard)
    const setIsShowSetting = useSystemStore((state: TSystemStore) => state.setIsShowSetting)
    const plugin = useSystemStore((state: TSystemStore) => state.config.plugin)

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

    const views: Array<{ name: string, view: TSettingView, show: boolean, icon: any }> = [
        {
            name: "聊天",
            view: "main",
            show: true,
            icon: <CommentOutlined />
        },
        {
            name: "设置",
            view: "config",
            show: true,
            icon: <SettingOutlined />
        },
        {
            name: "预设",
            view: "prompt",
            show: true,
            icon: <ThunderboltOutlined />
        },
        {
            name: "插件",
            view: "plugin",
            show: !!plugin,
            icon: <AppstoreAddOutlined />
        }
    ]

    return (
        <div className="flex flex-col gap-1">
            <div className="flex gap-1">
                <Button.Group className="w-full">
                    {views.filter(v => v.show).map((v, idx) => (
                        <Button key={idx} icon={v.icon} block onClick={switchViewHandler(v.view)}
                            type={v.view === view ? 'primary' : undefined}>{v.name}</Button>))}
                </Button.Group>
            </div>
            {(isShowSetting && !isShowCard) && <Button type="primary" danger onClick={OpenSettingHandler}>关闭</Button>}
            <div className="flex justify-center items-center border border-dashed rounded text-sm">
                Star on<Button type="link" size="small" href="https://github.com/zmlix/chatcard.git">GitHub</Button>@zmlix
            </div>
        </div>
    )
}