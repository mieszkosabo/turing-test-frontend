import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useReconnect } from "../../hooks/useReconnect";
import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../../providers/WebSocketProvider";
import { Layout } from "../../components/layout";
import { FlexColumn } from "../../components/layout/FlexColumn";
import { Text } from "@chakra-ui/layout";
import { ServerMessage } from "../../types";
import { useTimeLeft } from "../../hooks/useTimeLeft";

const WaitPage: NextPage = () => {
  const router = useRouter();
  const { connection, sendMsg } = useContext(WebsocketContext);
  const { endTime, code } = router.query;
  const timeLeft = useTimeLeft(Number(endTime));
  useReconnect({ code: code as string, sendMsg, isEvaluator: false });
  const [isFinished, setIsFinished] = useState<boolean>(false);
  useEffect(() => {
    const sub = connection!.subscribe((msg) => {
      const message = msg as ServerMessage;
      if (message.message === "GAME_END") {
        setIsFinished(true);
      }
    });

    return () => sub.unsubscribe();
  }, [connection]);
  return (
    <Layout timeLeft={timeLeft} mt={16}>
      <FlexColumn>
        <Text mb={4} fontSize={[16, 24]} color="gray" fontWeight="bold">
          The evaluator is chatting with a machine!
        </Text>
        <Text mb={4} fontSize={[16, 24]}>
          You have 7 minutes for yourself.
        </Text>

        <Text mb={16} fontSize={[16, 24]}>
          For the sake of the test, don’t let the evaluator know that they are
          not chatting with you!
        </Text>

        {isFinished && (
          <Text fontSize={[18, 28]} fontWeight="bold" color="brand" mr={2}>
            The test has ended!
          </Text>
        )}
      </FlexColumn>
    </Layout>
  );
};

export default WaitPage;
