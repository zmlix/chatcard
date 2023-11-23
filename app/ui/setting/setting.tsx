import { useState } from "react"
import SettingFooter from "./footer"
import SettingMain from "./main"
import SettingConfig from "./config"
import SettingPrompt from "./prompt"
import SettingPlugin from "./plugin"

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
                "main": <SettingMain></SettingMain>,
                "config": <SettingConfig></SettingConfig>,
                "prompt": <SettingPrompt></SettingPrompt>,
                "plugin": <SettingPlugin></SettingPlugin>
            }[view]}
            <SettingFooter {...footerProps}></SettingFooter>
        </>
    )
}