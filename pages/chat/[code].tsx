import { Chat } from '../../components/chat';
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

const ChatPage: NextPage = () => {
  return (
    <Chat isEvaluator />
  )
}

export default dynamic(() => Promise.resolve(ChatPage), { ssr: false });
