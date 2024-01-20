'use client'
import { useEffect } from "react"
import Setting from "./ui/setting/setting"
import ChatCard from "./ui/chatcard/chatCard"
import { useSystemStore } from "./store/system"
import { TSystemStore } from "."

export default function App() {
  console.log("app")

  const initPrompts = useSystemStore((state: TSystemStore) => state.initPrompts)
  const setIsShowSetting = useSystemStore((state: TSystemStore) => state.setIsShowSetting)
  const setIsShowCard = useSystemStore((state: TSystemStore) => state.setIsShowCard)
  const isShowCard = useSystemStore((state: TSystemStore) => state.isShowCard)
  const isShowSetting = useSystemStore((state: TSystemStore) => state.isShowSetting)

  useEffect(() => {
    console.log("initPrompts")
    initPrompts()
    if (window.innerWidth <= 768) {
      setIsShowSetting(false)
    }
    setIsShowCard(true)
  }, [initPrompts, setIsShowSetting, setIsShowCard])

  return (
    <div className="m-0 p-5 w-full h-full bg-zinc-50">
      <div className="flex gap-2 w-full h-full">
        <Setting></Setting>
        <ChatCard></ChatCard>
      </div>
    </div>
  )
}
