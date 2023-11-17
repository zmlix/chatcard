'use client'
import { useState } from "react"
import Setting from "./ui/setting/setting"
import ChatCard from "./ui/chatcard/chatCard"
import { useChatsStore } from "./store/chats"
import { useSystemStore } from "./store/system"

export default function App() {

  const [settingShow, setSettingShow] = useState(false)
  const [cardShow, setcardShow] = useState(true)

  function openSettingHandler() {
    setSettingShow(!settingShow)
    if (window.innerWidth <= 768 && !settingShow) {
      setcardShow(false)
    } else {
      setcardShow(true)
    }
  }

  const chatsStore = useChatsStore()
  const systemStore = useSystemStore()

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
      <div id='chatsetting'
        className={settingShow ? settingClass : 'hidden'}>
        <Setting {...SettingProps}></Setting>
      </div>
      <div id='chatcard' className={cardShow ? chatCardClass : 'hidden'}>
        <ChatCard {...ChatCardProps}></ChatCard>
      </div>
    </div>
  )
}
