import ChatHeader from "./header"
import InputBox from "./inputBox"
import CardBox from "./cardBox"

export default function ChatCard() {
  console.log("chatCard")
  return (
    <>
      <ChatHeader />
      <CardBox></CardBox>
      <InputBox></InputBox>
    </>
  )
}