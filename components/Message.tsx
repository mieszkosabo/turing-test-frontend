import { Box, BoxProps } from "@chakra-ui/layout";
import React from "react";

interface IMessage extends BoxProps {
  isMyMessage: boolean;
}

export const Message = ({ isMyMessage, ...props }: IMessage) => (
  <Box
    bg={isMyMessage ? "brand" : "#D4D4D4"}
    color={isMyMessage ? "white" : "gray"}
    fontWeight="bold"
    p={3}
    maxW="80%"
    borderRadius={8}
    boxShadow={
      isMyMessage ? "0px 10px 10px -7px #055C5C" : "0px 10px 10px -7px #B3B3B3"
    }
    {...props}
  />
);
