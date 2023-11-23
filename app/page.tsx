'use client'
import { useEffect, useState } from "react"
import Setting from "./ui/setting/setting"
import ChatCard from "./ui/chatcard/chatCard"
import { useSystemStore } from "./store/system"
import { TSystemStore } from "."

export default function App() {
  console.log("app")

  const isShowSetting = useSystemStore((state: TSystemStore) => state.isShowSetting)
  const isShowCard = useSystemStore((state: TSystemStore) => state.isShowCard)
  const initPrompts = useSystemStore((state: TSystemStore) => state.initPrompts)

  useEffect(() => {
    console.log("initPrompts")
    initPrompts()
  }, [initPrompts])

  const settingClass = "flex flex-col gap-1 bg-white border rounded-2xl p-2 "
  const chatCardClass = "flex flex-col bg-white border rounded-2xl p-2"

  return (
    <div className="flex gap-2 w-full">
      <div id='chatsetting' className={isShowSetting ? settingClass : 'hidden'}>
        <Setting></Setting>
      </div>
      <div id='chatcard' className={isShowCard ? chatCardClass : 'hidden'}>
        <ChatCard></ChatCard>
      </div>
    </div>
  )
}
