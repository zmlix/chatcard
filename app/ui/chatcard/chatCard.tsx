import dynamic from 'next/dynamic'
import ChatHeader from "./header"
import InputBox from "./inputBox"
const CardBox = dynamic(() => import('./cardBox'), { ssr: false })

export default function ChatCard() {
  console.log("chatCard")
  return (
    <>
      <ChatHeader />
      <div className='h-full'><CardBox></CardBox></div>
      <InputBox></InputBox>
    </>
  )
}