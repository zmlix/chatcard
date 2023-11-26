import dynamic from 'next/dynamic'
import { useState } from "react"
import SettingFooter from "./footer"
import SettingConfig from "./config"
import SettingPrompt from "./prompt"
import SettingPlugin from "./plugin"
const SettingMain = dynamic(() => import('./main'), { ssr: false })

export type TSettingView = 'main' | 'config' | 'prompt' | 'plugin'

export default function Setting() {
    console.log("Setting")
    const [view, setView] = useState<TSettingView>('main')

    const footerProps = {
        view,
        setView
    }

    return (
        <>
            {{
                "main": <div className='h-full'><SettingMain></SettingMain></div>,
                "config": <SettingConfig></SettingConfig>,
                "prompt": <SettingPrompt></SettingPrompt>,
                "plugin": <SettingPlugin></SettingPlugin>
            }[view]}
            <SettingFooter {...footerProps}></SettingFooter>
        </>
    )
}