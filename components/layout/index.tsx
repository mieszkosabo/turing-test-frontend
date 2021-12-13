import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import React from "react";
import { FlexColumn } from "./FlexColumn";

export interface IInterface extends FlexProps {
  timeLeft?: string | null;
}

export const Layout = ({ timeLeft, ...props }: IInterface) => (
  <FlexColumn minW="100vw" minH="100vh" py={[2, 6]} px={[3, 8]} align="center">
    <Flex w="full" justify="space-between">
      <Text fontWeight="bold" fontSize={24}>
        TuringFest
      </Text>
      <Text fontWeight="bold" fontSize={24}>
        {timeLeft}
      </Text>
    </Flex>
    <Flex
      w="full"
      mt={{ base: 16, md: 0 }}
      h={{ md: "container.md" }}
      {...props}
    />
  </FlexColumn>
);
