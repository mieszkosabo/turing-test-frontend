import { useClipboard } from "@chakra-ui/hooks";
import { Flex, Text } from "@chakra-ui/layout";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { Layout } from "../../components/layout";
import { FlexColumn } from "../../components/layout/FlexColumn";
import { useReconnect } from "../../hooks/useReconnect";
import { WebsocketContext } from "../../providers/WebSocketProvider";
import { ServerMessage } from "../../types";

const Invite: NextPage = () => {
  const { connection, sendMsg } = useContext(WebsocketContext);
  const router = useRouter();
  const code = router.query.code as string;
  const link = `http://localhost:3000/join/${code}`;
  const { hasCopied, onCopy } = useClipboard(link);
  useReconnect({ code, sendMsg, isEvaluator: true });
  useEffect(() => {
    const sub = connection!.subscribe((msg) => {
      console.log(msg);
      const message = msg as ServerMessage;
      if (message.message === "GAME_START") {
        const endTime = message.payload.endTime;
        router.push(`/chat/${code}?endTime=${endTime}`);
      }
    });

    return () => sub.unsubscribe();
  }, [router, code, connection]);

  return (
    <Layout mt={16}>
      <FlexColumn>
        <Text mb={4} fontSize={[16, 24]} color="gray" fontWeight="bold">
          Invite someone to the test
        </Text>
        <Text mb={4} fontSize={[16, 24]}>
          During the test, you will be chatting with either this person or a
          machine (50/50). You’ll have 7 minutes to make your guess, after that
          you’ll be shown the answer.
        </Text>

        <Text mb={16} fontSize={[16, 24]}>
          Each response to your question will be revealed after 15 seconds.
        </Text>

        <Text mb={8} fontSize={[16, 24]}>
          Invite a human player by sending them this link:
        </Text>

        <Flex w="full" flexWrap="wrap" justify="center" align="center">
          <Text fontWeight="bold" fontSize={[16, 24, 32]}>
            {link}
          </Text>
          <PrimaryButton
            size="md"
            onClick={onCopy}
            mt={[4, 4, 0]}
            ml={[0, 0, 4]}
          >
            {hasCopied ? "Copied!" : "Copy"}
          </PrimaryButton>
        </Flex>
      </FlexColumn>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Invite), { ssr: false });
