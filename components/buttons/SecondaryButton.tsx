import { Button, ButtonProps } from "@chakra-ui/button";
import React from "react";

export const SecondaryButton = (props: ButtonProps) => (
  <Button
    bg="#D4D4D4"
    _hover={{
      bg: "#DEDEDE",
    }}
    color="gray"
    {...props}
  />
);
