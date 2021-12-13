import { Chat } from "../../components/chat";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const HumanChatPage: NextPage = () => {
  const router = useRouter();
  const { endTime } = router.query;
  return <Chat isEvaluator={false} endTime={Number(endTime)} />;
};

export default HumanChatPage;
