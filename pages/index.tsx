import { HStack, Text } from "@chakra-ui/layout";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { SecondaryButton } from "../components/buttons/SecondaryButton";
import { Layout } from "../components/layout";
import { FlexColumn } from "../components/layout/FlexColumn";
import { WebsocketContext } from "../providers/WebSocketProvider";
import { ServerMessage } from "../types";

const Home: NextPage = () => {
  const { connection, sendMsg } = useContext(WebsocketContext);
  const router = useRouter();
  useEffect(() => {
    if (!connection) return;
    const sub = connection.subscribe((msg) => {
      const message = msg as ServerMessage;
      if (message.message === "NEW_GAME") {
        router.push(`/invite/${message.payload.code}`);
      }
    });

    return () => sub.unsubscribe();
  }, [router, connection]);

  return (
    <Layout justify="center" align="center">
      <FlexColumn maxW="4xl">
        <Text mb={8} lineHeight="100%" fontSize={[32, 64]} fontWeight="bold">
          Can Machines think?
        </Text>
        <Text mb={16} fontSize={[16, 24]} color="gray">
          Turing's paper considers the question "Can machines think?". Turing
          says that since the words "think" and "machine" cannot be clearly
          defined we should "replace the question by another, which is closely
          related to it and is expressed in relatively unambiguous words."
        </Text>

        <HStack justify="center" spacing={8}>
          <SecondaryButton
            size="lg"
            onClick={() => {
              window.open("https://github.com/mieszkosabo/turingfest-frontend");
            }}
          >
            GitHub
          </SecondaryButton>
          <PrimaryButton
            size="lg"
            onClick={() =>
              sendMsg({ message: "INIT", payload: { withHuman: false } })
            }
          >
            Click to start
          </PrimaryButton>
        </HStack>
      </FlexColumn>
    </Layout>
  );
};

export default Home;
