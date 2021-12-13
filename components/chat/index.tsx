import { useRouter } from "next/router";
import { LegacyRef, useContext, useEffect, useRef, useState } from "react";
import { useReconnect } from "../../hooks/useReconnect";
import { WebsocketContext } from "../../providers/WebSocketProvider";
import { GameMessage, ServerMessage } from "../../types";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { Layout } from "../layout";
import { FlexColumn } from "../layout/FlexColumn";
import { Input, Flex, VStack, Box, Text, Button } from "@chakra-ui/react";
import { Message } from "../Message";
import { useIsMyTurn } from "../../hooks/useIsMyTurn";
import { useTimeLeft } from "../../hooks/useTimeLeft";

export type IChat = {
  isEvaluator: boolean;
  endTime: number;
};

export const Chat = ({ isEvaluator, endTime }: IChat) => {
  const { connection, sendMsg } = useContext(WebsocketContext);
  const router = useRouter();
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [inputVal, setInputVal] = useState<string>("");

  const { isMyTurn, iMoved, theyMoved } = useIsMyTurn(isEvaluator);

  // initially null, set to false/true when the test finishes.
  const [wasPlayingWithMachine, setWasPlayingWithMachine] = useState<
    boolean | null
  >(null);
  const [isAnswerRevelead, revealAnswer] = useState<boolean>(false);
  const isFinished = wasPlayingWithMachine !== null;

  const messagesBottomRef = useRef<HTMLDivElement>();
  const timeLeft = useTimeLeft(endTime);

  const code = router.query.code as string;
  useReconnect({ code, sendMsg, isEvaluator });
  useEffect(() => {
    const sub = connection!.subscribe((msg) => {
      console.log(msg);
      const message = msg as ServerMessage;
      if (message.message === "NEW_MESSAGE") {
        theyMoved();
        setMessages((msgs) => [
          ...msgs,
          { text: message.payload.text, fromEvaluator: !isEvaluator },
        ]);
      } else if (message.message === "MESSAGE_HISTORY") {
        const messages = message.payload.messages;
        setMessages(messages);

        // readjust useIsMyTurn hook based on history
        if (messages.length > 0) {
          if (messages[messages.length - 1].fromEvaluator === isEvaluator) {
            iMoved();
          } else {
            theyMoved();
          }
        }
      } else if (message.message === "GAME_END") {
        const { wasMachine } = message.payload;
        setWasPlayingWithMachine(wasMachine);
      }
    });

    return () => sub.unsubscribe();
  }, [connection, isEvaluator]);

  // Scroll the messages container to the bottom on new message
  useEffect(() => {
    messagesBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = (text: string) => {
    const msg = {
      message: "MESSAGE",
      payload: { code, fromEvaluator: isEvaluator, text },
    };
    setMessages((msgs) => [...msgs, { text, fromEvaluator: isEvaluator }]);
    sendMsg(msg);
  };

  return (
    <Layout
      timeLeft={timeLeft}
      justify="center"
      align="flex-end"
      mt={0}
      h="calc(100vh - 8rem)"
    >
      <FlexColumn w="full" maxW="55rem" maxH="full">
        <VStack w="full" overflowY="auto" spacing={6}>
          {messages.map(({ text, fromEvaluator }, idx) => {
            const isMyMessage = isEvaluator === fromEvaluator;
            return (
              <Flex
                key={idx}
                w="full"
                justify={isMyMessage ? "flex-end" : "flex-start"}
              >
                <Message isMyMessage={isMyMessage}>{text}</Message>
              </Flex>
            );
          })}
          <Box ref={messagesBottomRef as LegacyRef<HTMLDivElement>} />
        </VStack>

        {isFinished ? (
          <Flex wrap="wrap" justify="center">
            <Text fontSize={[18, 28]} mr={2}>
              The test has ended!
            </Text>
            {isAnswerRevelead ? (
              <Text
                fontSize={[18, 28]}
                color="brand"
                fontWeight="bold"
              >{`You were talking to a ${
                wasPlayingWithMachine ? "Machine!" : "Human!"
              }`}</Text>
            ) : (
              <Button
                fontSize={[18, 28]}
                variant="link"
                color="brand"
                fontWeight="bold"
                onClick={() => revealAnswer(true)}
              >
                Click to reveal if you were talking to a machine.
              </Button>
            )}
          </Flex>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputVal !== "") {
                onSend(inputVal);
                iMoved();
              }
              setInputVal("");
            }}
          >
            <Flex w="full" justify="center">
              <Input
                disabled={!isMyTurn}
                w="full"
                boxShadow="0px 10px 30px -6px #D6D6D6"
                bg="#FAFAFA"
                value={inputVal}
                placeholder={
                  isMyTurn ? "Type a question" : "Wait for the response"
                }
                _placeholder={{
                  color: "gray",
                  opacity: isMyTurn ? 0.7 : 1,
                }}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <PrimaryButton disabled={inputVal === ""} ml={4} type="submit">
                Send
              </PrimaryButton>
            </Flex>
          </form>
        )}
      </FlexColumn>
    </Layout>
  );
};
