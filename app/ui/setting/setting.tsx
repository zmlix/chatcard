import dynamic from 'next/dynamic'
import { useState } from "react"
import SettingConfig from "./config"
import SettingPrompt from "./prompt"
import SettingPlugin from "./plugin"
import { useSystemStore } from "@/app/store/system"
import { TSystemStore } from '@/app'
import { Button } from "antd"
const SettingMain = dynamic(() => import('./main'), { ssr: false })
const SettingFooter = dynamic(() => import('./footer'), { ssr: false })

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

    return (
        <div className={isShowSetting ? "flex flex-col gap-1 bg-white border rounded-2xl p-2" : 'hidden'}
            style={{ width: isShowCard ? 513 : '100%' }} suppressHydrationWarning>
            <div className='hidden'> <Button></Button></div>
            {{
                "main": <SettingMain></SettingMain>,
                "config": <SettingConfig></SettingConfig>,
                "prompt": <SettingPrompt></SettingPrompt>,
                "plugin": <SettingPlugin></SettingPlugin>
            }[view]}
            <SettingFooter {...footerProps}></SettingFooter>
        </div>
    )
}