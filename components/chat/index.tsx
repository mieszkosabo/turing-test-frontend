import { useRouter } from 'next/router'
import { LegacyRef, MutableRefObject, useContext, useEffect, useRef, useState } from 'react'
import { useReconnect } from '../../hooks/useReconnect'
import { WebsocketContext } from '../../providers/WebSocketProvider'
import { GameMessage, ServerMessage } from '../../types'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { Layout } from '../layout'
import { FlexColumn } from '../layout/FlexColumn'
import { Input, Flex, VStack, Box } from '@chakra-ui/react'
import { Message } from '../Message'
import { useTimeLeft } from '../../hooks/useTImeLeft'

export type IChat = {
    isEvaluator: boolean;
    endTime: number;
}

export const Chat = ({ isEvaluator, endTime }: IChat) => {
  const { connection, sendMsg } = useContext(WebsocketContext);
  const router = useRouter();
  const code = router.query.code as string;
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const ref = useRef<HTMLDivElement>();
  const timeLeft = useTimeLeft(endTime);
  useReconnect({ code, sendMsg, isEvaluator });
  useEffect(() => {
    const sub = connection!.subscribe((msg) => {
        console.log(msg);
      const message = msg as ServerMessage;
      if (message.message === 'NEW_MESSAGE') {
        setMessages((msgs) => [...msgs, { text: message.payload.text, fromEvaluator: !isEvaluator}])
      } else if (message.message === 'MESSAGE_HISTORY') {
          setMessages(message.payload.messages);
      } else if (message.message === 'GAME_END') {
          const { wasMachine } = message.payload;
          router.push(`/finish?wasMachine=${wasMachine}&isEvaluator=${isEvaluator}`);
      }

    });

    return () => sub.unsubscribe();
  }, [router, code, connection, isEvaluator]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth'});
  }, [messages]);

  const onSend = (text: string) => {
      const msg = { message: 'MESSAGE', payload: { code, fromEvaluator: isEvaluator, text }};
      setMessages((msgs) => [...msgs, { text, fromEvaluator: isEvaluator }]);
      sendMsg(msg);
  }


  return (
    <Layout timeLeft={timeLeft} justify="center" align="flex-end" mt={0} h="calc(100vh - 8rem)" >
      <FlexColumn w="full" maxW="55rem" maxH="full">
          <VStack w="full" overflowY="auto" spacing={6} >
              { messages.map(({ text, fromEvaluator }, idx) => {
                const isMyMessage = isEvaluator === fromEvaluator;
                return (
                  <Flex key={idx} w="full" justify={isMyMessage ? "flex-end" : "flex-start"}>
                    <Message isMyMessage={isMyMessage}>{text}</Message>
                  </Flex>
                )
              })
              }
              <Box ref={ref as LegacyRef<HTMLDivElement>}  />
          </VStack>

        <form onSubmit={(e) => {
            e.preventDefault();
            if (inputVal !== '') {
              onSend(inputVal);
            }
            setInputVal('');
        }}>
            <Flex w="full" justify="center">
              <Input w="full" boxShadow="0px 10px 30px -6px #D6D6D6" bg="#FAFAFA" value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
              <PrimaryButton disabled={inputVal === ''} ml={4} type="submit">Send</PrimaryButton>
            </Flex>
        </form>
      </FlexColumn>
    </Layout>
  );
}

