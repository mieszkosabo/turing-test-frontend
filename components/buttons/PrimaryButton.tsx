import { Button, ButtonProps } from "@chakra-ui/button";
import React from "react";

export const PrimaryButton = (props: ButtonProps) => (
  <Button
    bg="brand"
    color="white"
    _hover={{
      bg: "#067575",
    }}
    {...props}
  />
);
