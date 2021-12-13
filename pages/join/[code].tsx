import { Flex, Text } from "@chakra-ui/layout";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { Layout } from "../../components/layout";
import { FlexColumn } from "../../components/layout/FlexColumn";
import { useReconnect } from "../../hooks/useReconnect";
import { WebsocketContext } from "../../providers/WebSocketProvider";
import { ServerMessage } from "../../types";

const Join: NextPage = () => {
  const { connection, sendMsg } = useContext(WebsocketContext);
  const router = useRouter();
  const code = router.query.code as string;
  useReconnect({ code, sendMsg, isEvaluator: false });
  useEffect(() => {
    const sub = connection!.subscribe((msg) => {
      const message = msg as ServerMessage;
      if (message.message === "GAME_START") {
        const { withMachine } = message.payload;
        if (withMachine) {
          router.push(`/snake/${code}`);
        } else {
          const endTime = message.payload.endTime;
          router.push(`/chat-human/${code}?endTime=${endTime}`);
        }
      }
    });

    return () => sub.unsubscribe();
  }, [router, code, connection]);

  return (
    <Layout mt={16}>
      <FlexColumn>
        <Text mb={4} fontSize={[16, 24]} color="gray" fontWeight="bold">
          Hi!
        </Text>
        <Text mb={4} fontSize={[16, 24]}>
          You’re about to take part in a Turing Test. Blablabla
        </Text>

        <Flex mt={8}>
          <PrimaryButton
            onClick={() => sendMsg({ message: "JOIN", payload: { code } })}
          >
            Ok, i'm ready!
          </PrimaryButton>
        </Flex>
      </FlexColumn>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Join), { ssr: false });
