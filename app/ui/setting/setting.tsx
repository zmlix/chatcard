import dynamic from 'next/dynamic'
import { useState } from "react"
import SettingFooter from "./footer"
import SettingConfig from "./config"
import SettingPrompt from "./prompt"
import SettingPlugin from "./plugin"
import { useSystemStore } from "@/app/store/system"
import { useChatsStore } from "@/app/store/chats"
import { TSystemStore, TChatsStore } from '@/app'
import { PlusOutlined } from "@ant-design/icons"
import { Button } from "antd"
const SettingMain = dynamic(() => import('./main'), { ssr: false })

export type TSettingView = 'main' | 'config' | 'prompt' | 'plugin'

export default function Setting() {
    console.log("Setting")

    const isShowSetting = useSystemStore((state: TSystemStore) => state.isShowSetting)
    const isShowCard = useSystemStore((state: TSystemStore) => state.isShowCard)
    const newChat = useChatsStore((state: TChatsStore) => state.newChat)
    const [view, setView] = useState<TSettingView>('main')

    const footerProps = {
        view,
        setView
    }

    const settingClass = "flex flex-col gap-1 bg-white border rounded-2xl p-2 "

    return (
        <div className={isShowSetting ? (settingClass + (isShowCard ? "max-w-lg w-96" : "w-full")) : 'hidden'} suppressHydrationWarning>
            {{
                "main": <>
                    <Button block onClick={newChat} icon={<PlusOutlined />}>新的聊天</Button>
                    <div className='h-full overflow-auto no-scrollbar'>
                        <SettingMain></SettingMain>
                    </div>
                </>,
                "config": <SettingConfig></SettingConfig>,
                "prompt": <SettingPrompt></SettingPrompt>,
                "plugin": <SettingPlugin></SettingPlugin>
            }[view]}
            <SettingFooter {...footerProps}></SettingFooter>
        </div>
    )
}