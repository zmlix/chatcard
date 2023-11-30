import dynamic from 'next/dynamic'
import { useState } from "react"
import SettingFooter from "./footer"
import SettingConfig from "./config"
import SettingPrompt from "./prompt"
import SettingPlugin from "./plugin"
import { useSystemStore } from "../../store/system"
import { TSystemStore } from '@/app'
const SettingMain = dynamic(() => import('./main'), { ssr: false })

export type TSettingView = 'main' | 'config' | 'prompt' | 'plugin'

export default function Setting() {
    console.log("Setting")

    const isShowSetting = useSystemStore((state: TSystemStore) => state.isShowSetting)
    const isShowCard = useSystemStore((state: TSystemStore) => state.isShowCard)
    const [view, setView] = useState<TSettingView>('main')

    const footerProps = {
        view,
        setView
    }

    const settingClass = "flex flex-col gap-1 bg-white border rounded-2xl p-2 "

    return (
        <div className={isShowSetting ? (settingClass + (isShowCard ? "max-w-lg w-96" : "w-full")) : 'hidden'} suppressHydrationWarning>
            {{
                "main": <div className='h-full'><SettingMain></SettingMain></div>,
                "config": <SettingConfig></SettingConfig>,
                "prompt": <SettingPrompt></SettingPrompt>,
                "plugin": <SettingPlugin></SettingPlugin>
            }[view]}
            <SettingFooter {...footerProps}></SettingFooter>
        </div>
    )
}