'use client';

import { Box, Flex, Image, Link } from '@chakra-ui/react';
import { ColorModeButton, useColorModeValue } from "@/components/ui/color-mode"

export function Sidebar() {
    const bgColor = useColorModeValue('white', 'black');

  return (
    <Box 
      as="aside" 
      w="72px" 
      bg={bgColor} 
      h="100vh" 
      position="fixed" 
      top="0" 
      left="0" 
      p={4} 
      borderRight={'1px solid #43424A'}
      display={{ base: 'none', md: 'block' }}
      zIndex={1000}
    >
        <ColorModeButton/>
        <Flex justify="center" flexDirection="column" h="100%">
          <Link href="https://docs.google.com/document/d/12DZM9ufxZo5VvP12Fs51mTg_dqM7DVTO-8cK8EPoZgc/edit?usp=sharing" target="_blank">
            <Image src="/assets/Gitbook.svg" alt='gitbook'/>
          </Link>
          <Link href="https://x.com/awenetwork_ai" target="_blank" mt={'40px'}>
            <Image src="/assets/X.svg" alt='x'/>
          </Link>
          <Link href="https://www.awenetwork.ai/terms-of-service" target="_blank" mt={'40px'}>
            <Image width={'32px'} src="/tos.svg" alt='awenetwork'/>
          </Link>
        </Flex>
    </Box>
  );
}