"use client";
import React, { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { useAccount, useWriteContract } from 'wagmi';
import { useMySignature } from "@/hooks/useMySignature";
import {
  Dialog,
  CloseButton,
  Text,
  Portal,
  Box,
  Input,
  Button,
  VStack,
  Link,
  HStack,
} from "@chakra-ui/react";

export default function SubmitWorld({ onClose }: { onClose: () => void }) {
  const { address, isConnected } = useAccount();
  const [agreed, setAgreed] = useState(false);
  const [worldName, setWorldName] = useState("");
  const [worldDescription, setWorldDescription] = useState("");
  const [worldXHandle, setWorldXHandle] = useState("");
  const [submitterTelegramHandle, setSubmitterTelegramHandle] = useState("");
  const { callApiWithSignature } = useMySignature();

  const submitWorld = async () => {
    const data = {
      name: worldName,
      description: worldDescription,
      x: worldXHandle,
      telegram: submitterTelegramHandle,
    };
    try {
      const result = await callApiWithSignature("/submit", {
        body: data,
        headers: {
          'Address': address || '',
        },
      });
      console.log("Result:", result);
      if (result.name) {
        onClose();
        toaster.create({
          title: "World submitted successfully",
          type: "success",
        });
      } else {
        toaster.create({
          title: "Failed to submit world",
          type: "error",
        });
      }
    } catch (error) {
      toaster.create({
        title: "Failed to submit world",
        type: "error",
      });
      console.error("Failed to submit world", error);
    }
  };

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop
          style={{
            backdropFilter: "blur(1px)",
            background: "rgba(10, 10, 10, 0.65)",
            position: "fixed",
            inset: 0,
            zIndex: 1400,
          }}
        />
        <Dialog.Positioner
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1500,
          }}
        >
          <Dialog.Content
            bg="rgba(5, 6, 9, 0.92)"
            color="white"
            className="gradient_border_3"
            rounded="2xl"
            boxShadow="2xl"
            p={0}
            width="500px"
            maxH="90vh"
            overflow="auto"
            position="relative"
          >
            <Dialog.Header
              p={4}
              fontSize="lg"
              fontWeight="bold"
              textAlign="center"
            >
              Submit a World
            </Dialog.Header>
            <CloseButton
              color="white"
              onClick={onClose}
              position="absolute"
              top={3}
              right={3}
            />
            <hr />
            <Dialog.Body p={6}>
              {/* Form */}
              <VStack gap={6} px={8} flex={1} overflow="auto">
                {/* Project Name */}
                <Box w="full">
                  <Text color="#E0E0E0" fontSize="base" mb={2}>
                    Project Name
                  </Text>
                  <Box borderRadius="full">
                    <Input
                      value={worldName}
                      onChange={(e) => setWorldName(e.target.value)}
                      placeholder="Enter project name"
                      border="1px solid #38BDF833"
                      _focus={{
                        borderColor: "#38BDF8",
                        outline: "none",
                      }}
                      fontSize="sm"
                      borderRadius="full"
                      w="full"
                      bg="transparent"
                      px={4}
                      py={3}
                      color="#E0E0E0"
                      _placeholder={{ color: "#828B8D" }}
                    />
                  </Box>
                </Box>

                {/* Project Description */}
                <Box w="full">
                  <Text color="#E0E0E0" fontSize="base" mb={2}>
                    Project Description
                  </Text>
                  <Box  borderRadius="full">
                    <Input
                      value={worldDescription}
                      onChange={(e) => setWorldDescription(e.target.value)}
                      placeholder="Enter project description"
                      border="1px solid #38BDF833"
                      _focus={{
                        borderColor: "#38BDF8",
                        outline: "none",
                      }}
                      fontSize="sm"
                      borderRadius="full"
                      w="full"
                      bg="transparent"
                      px={4}
                      py={3}
                      color="#E0E0E0"
                      _placeholder={{ color: "#828B8D" }}
                    />
                  </Box>
                </Box>

                {/* Project X Handle */}
                <Box w="full">
                  <Text color="#E0E0E0" fontSize="base" mb={2}>
                    Project X Handle (Optional)
                  </Text>
                  <Box  borderRadius="full">
                    <Input
                      value={worldXHandle}
                      onChange={(e) => setWorldXHandle(e.target.value)}
                      placeholder="Enter project X handle"
                      border="1px solid #38BDF833"
                      _focus={{
                        borderColor: "#38BDF8",
                        outline: "none",
                      }}
                      fontSize="sm"
                      borderRadius="full"
                      w="full"
                      bg="transparent"
                      px={4}
                      py={3}
                      color="#E0E0E0"
                      _placeholder={{ color: "#828B8D" }}
                    />
                  </Box>
                </Box>

                {/* Submitter Telegram Handle */}
                <Box w="full">
                  <Text color="#E0E0E0" fontSize="base" mb={2}>
                    Submitter Telegram Handle
                  </Text>
                  <Box  borderRadius="full">
                    <Input
                      value={submitterTelegramHandle}
                      onChange={(e) =>
                        setSubmitterTelegramHandle(e.target.value)
                      }
                      placeholder="Enter you Telegram handle for World.Fun team to reach you"
                      border="1px solid #38BDF833"
                      _focus={{
                        borderColor: "#38BDF8",
                        outline: "none",
                      }}
                      fontSize="sm"
                      borderRadius="full"
                      w="full"
                      bg="transparent"
                      px={4}
                      py={3}
                      color="#E0E0E0"
                      _placeholder={{ color: "#828B8D" }}
                    />
                  </Box>
                </Box>

                {/* Terms Agreement */}
                <HStack gap={2} w="full">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "4px",
                      border: "1px solid #38BDF833",
                      backgroundColor: "transparent",
                      accentColor: "#38BDF8",
                    }}
                  />
                  <Text color="#828B8D" fontSize="sm" fontWeight="extralight">
                    I agree with the{" "}
                    <Link
                      href="https://www.awenetwork.ai/terms-of-service"
                      target="_blank"
                      color="#38BDF8"
                      _hover={{ textDecoration: "underline" }}
                    >
                      Terms of service
                    </Link>
                  </Text>
                </HStack>

                {/* Submit Button */}
                <Button
                  w="full"
                  className="font_office"
                  py={3}
                  borderRadius="full"
                  fontSize="base"
                  fontWeight="medium"
                  transition="colors"
                  bg={
                    agreed &&
                    worldName &&
                    worldDescription &&
                    submitterTelegramHandle
                      ? "#B7EADF"
                      : "#1F1F2280"
                  }
                  color={
                    agreed &&
                    worldName &&
                    worldDescription &&
                    submitterTelegramHandle
                      ? "#050609"
                      : "#828B8D"
                  }
                  border={
                    agreed &&
                    worldName &&
                    worldDescription &&
                    submitterTelegramHandle
                      ? "none"
                      : "1px solid #828B8D33"
                  }
                  _hover={
                    agreed &&
                    worldName &&
                    worldDescription &&
                    submitterTelegramHandle
                      ? { bg: "#B7EADF/90" }
                      : {}
                  }
                  disabled={
                    !agreed ||
                    !worldName ||
                    !worldDescription ||
                    !submitterTelegramHandle
                  }
                  onClick={submitWorld}
                >
                  Submit World
                </Button>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
