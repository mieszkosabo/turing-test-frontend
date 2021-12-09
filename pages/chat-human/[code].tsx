import { Chat } from '../../components/chat';
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';

const HumanChatPage: NextPage = () => {
  const router = useRouter();
  const { endTime } = router.query;
  return (
    <Chat isEvaluator={false} endTime={Number(endTime)} />
  )
}

export default dynamic(() => Promise.resolve(HumanChatPage), { ssr: false });
