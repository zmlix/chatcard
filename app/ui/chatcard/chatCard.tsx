import dynamic from 'next/dynamic'
import { Spin } from 'antd'
import { useSystemStore } from "../../store/system"
import { TSystemStore } from '@/app'
import { useState } from 'react'

const ChatHeader = dynamic(() => import('./header'), { ssr: false })
const CardBox = dynamic(() => import('./cardBox'), { ssr: false })
const InputBox = dynamic(() => import('./inputBox'), { ssr: false })

export default function ChatCard() {
  console.log("chatCard")

  const isShowCard = useSystemStore((state: TSystemStore) => state.isShowCard)

  const [spinning, setSpinning] = useState(true);

  return (
    <div className={isShowCard ?
      'flex flex-col bg-white border rounded-2xl p-2 w-full' : 'hidden'}>
      <Spin spinning={spinning} size='large' fullscreen />
      <ChatHeader />
      <div className='h-full'><CardBox></CardBox></div>
      <InputBox setSpinning={setSpinning}></InputBox>
    </div>
  )
}