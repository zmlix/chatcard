import { useState } from "react"
import SettingFooter from "./footer"
import SettingMain from "./main"
import SettingConfig from "./config"
import SettingPrompt from "./prompt"
import SettingPlugin from "./plugin"

export type TSettingView = 'main' | 'config' | 'prompt' | 'plugin'

export default function Setting({ openSettingHandler, chatsStore, systemStore }: any) {

    const [view, setView] = useState<TSettingView>('main')

    const footerProps = {
        onOpenSetting: openSettingHandler,
        systemStore,
        view,
        setView
    }

    return (
        <>
            {{
                "main": <SettingMain key='main' chatsStore={chatsStore} systemStore={systemStore}></SettingMain>,
                "config": <SettingConfig key='config' systemStore={systemStore}></SettingConfig>,
                "prompt": <SettingPrompt systemStore={systemStore}></SettingPrompt>,
                "plugin": <SettingPlugin></SettingPlugin>
            }[view]}
            <SettingFooter {...footerProps}></SettingFooter>
        </>
    )
}