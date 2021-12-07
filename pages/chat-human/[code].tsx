import { Chat } from '../../components/chat';
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

const HumanChatPage: NextPage = () => {
  return (
    <Chat isEvaluator={false} />
  )
}

export default dynamic(() => Promise.resolve(HumanChatPage), { ssr: false });
