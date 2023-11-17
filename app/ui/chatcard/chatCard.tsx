import ChatHeader from "./header"
import InputBox from "./inputBox"
import CardBox from "./cardBox"

export default function ChatCard({ openSettingHandler, chatsStore, systemStore }: any) {



  return (
    <>
      <ChatHeader />
      <CardBox chatsStore={chatsStore} systemStore={systemStore}></CardBox>
      <InputBox onOpenSetting={openSettingHandler} chatsStore={chatsStore} systemStore={systemStore}></InputBox>
    </>
  )
}