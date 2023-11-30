import dynamic from 'next/dynamic'
import InputBox from "./inputBox"
import { useSystemStore } from "../../store/system"
import { TSystemStore } from '@/app'

const ChatHeader = dynamic(() => import('./header'), { ssr: false })
const CardBox = dynamic(() => import('./cardBox'), { ssr: false })

export default function ChatCard() {
  console.log("chatCard")

  const isShowCard = useSystemStore((state: TSystemStore) => state.isShowCard)
  const chatCardClass = "flex flex-col bg-white border rounded-2xl p-2 w-full"

  return (
    <div className={isShowCard ? chatCardClass : 'hidden'}>
      <ChatHeader />
      <div className='h-full'><CardBox></CardBox></div>
      <InputBox></InputBox>
    </div>
  )
}