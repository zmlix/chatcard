'use client'
import { useEffect, useState } from "react"
import Setting from "./ui/setting/setting"
import ChatCard from "./ui/chatcard/chatCard"
import { useChatsStore } from "./store/chats"
import { useSystemStore } from "./store/system"

export default function App() {

  const chatsStore = useChatsStore()
  const systemStore = useSystemStore()

  const { isShowSetting, isShowCard, setIsShowSetting, setIsShowCard, initPrompts } = systemStore

  useEffect(() => {
    console.log("initPrompts")
    initPrompts()
  }, [initPrompts])

  function openSettingHandler() {
    setIsShowSetting(!isShowSetting)
    if (window.innerWidth <= 768 && !isShowSetting) {
      setIsShowCard(false)
    } else {
      setIsShowCard(true)
    }
  }

  const SettingProps = {
    openSettingHandler,
    chatsStore,
    systemStore
  }

  const ChatCardProps = {
    openSettingHandler,
    chatsStore,
    systemStore
  }

  const settingClass = "flex flex-col gap-1 bg-white border rounded-2xl p-2 "
  const chatCardClass = "flex flex-col bg-white border rounded-2xl p-2"

  return (
    <div className="flex gap-2">
      <div id='chatsetting' className={isShowSetting ? settingClass : 'hidden'}>
        <Setting {...SettingProps}></Setting>
      </div>
      <div id='chatcard' className={isShowCard ? chatCardClass : 'hidden'}>
        <ChatCard {...ChatCardProps}></ChatCard>
      </div>
    </div>
  )
}
