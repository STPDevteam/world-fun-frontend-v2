'use client';
import React from 'react'
import { Header } from '@/components/Header'
import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import { useColorModeValue } from "@/components/ui/color-mode"

export default function Page() {
  const bgColor = useColorModeValue('white', 'black');
  const color = useColorModeValue('black', 'white');
  return (
    <Box bg={bgColor} color={color} minH="100vh">
        <Header />
        <Flex direction={"column"} justify="space-between" as="main"
          py={{ base: 6, md: 16 }}
          pl={{ base: 4, md: 10 }}
          pr={{ base: 4, md: 14 }}
          bg={'#101010'}
          color={color}
          minH={{ base: 'auto', md: 'calc(100vh - 60px)' }}
          borderRadius={{ base: 'none', md: 'lg' }}
          boxShadow={{ base: 'none', md: 'lg' }}
          maxW={{ base: '100%', md: '1150px' }}
          mx="auto"
          mt={{ base: 0, md: 8 }}
        >
          <Heading
            as="h1"
            fontSize={{ base: '2xl', sm: '3xl', md: '6xl' }}
            fontWeight="normal"
            fontFamily={'BDO Grotesk'}
            pb={{ base: 6, md: 20 }}
            mb={{ base: 6, md: 20 }}
            lineHeight={1.1}
            letterSpacing={'-0.03em'}
          >
            World.fun is a discovery platform and launchpad for Autonomous Worlds.
          </Heading>
          <Box mb={8}>
            <Heading as="h2" fontSize={{ base: 'lg', md: '2xl' }} mb={2} fontFamily={'DMMono'} color={'#E0E0E0'} fontWeight="semibold">How it Works</Heading>
            <Text color="#838b8d" fontSize={{ base: 'sm', md: 'md' }} className={'gradient-font'} fontFamily={'DMMono'} pr={6}>
              Each World is a live, interactive experience or application where AI isn’t just a feature but the foundation of the experience. Whether it’s a game, simulation, or intelligent application, users engage with the world before the token goes live.
            </Text>
          </Box>
          <Box mb={8} fontFamily={'DMMono'}>
            <Heading as="h2" fontSize={{ base: 'lg', md: '2xl' }} mb={2} color={'#E0E0E0'} fontWeight="semibold">How to Participate</Heading>
            <Flex gap={4} flexWrap={{ base: 'wrap', md: 'nowrap' }} direction={{ base: 'column', md: 'row' }}>
              <Box flex={1} minW={{ base: '0', md: '220px' }} minH={{ base: '120px', md: '220px' }} borderWidth="1px" borderRadius="md" p={4} borderColor={'#838b8d'} mb={{ base: 3, md: 0 }}>
                <Text fontWeight="bold" mb={2} fontSize={{ base: 'md', md: 'lg' }}>Step 1: Discover</Text>
                <Text color="#838b8d" lineHeight={'18px'} fontSize={{ base: 'xs', md: 'sm' }}>Discover a World you like. Explore onchain, AI-native experiences. Each World is unique, interactive, and built for fun.</Text>
              </Box>
              <Box flex={1} minW={{ base: '0', md: '220px' }} minH={{ base: '120px', md: '220px' }} borderWidth="1px" borderRadius="md" p={4} borderColor={'#838b8d'} mb={{ base: 3, md: 0 }}>
                <Text fontWeight="bold" mb={2} fontSize={{ base: 'md', md: 'lg' }}>Step 2: Experience</Text>
                <Text color="#838b8d" lineHeight={'18px'} fontSize={{ base: 'xs', md: 'sm' }}>Experience the World before token launch. Engage, interact with agents and use the product to enable further interaction in the world.</Text>
              </Box>
              <Box flex={1} minW={{ base: '0', md: '220px' }} minH={{ base: '120px', md: '220px' }} borderWidth="1px" borderRadius="md" p={4} borderColor={'#838b8d'} mb={{ base: 3, md: 0 }}>
                <Text fontWeight="bold" mb={2} fontSize={{ base: 'md', md: 'lg' }}>Step 3: Contribute</Text>
                <Text color="#838b8d" lineHeight={'18px'} fontSize={{ base: 'xs', md: 'sm' }}>Contribute $USDC to the launch. All Worlds are paired with $AWE. Your contribution lets you take part and truly own the worlds you believe in.</Text>
              </Box>
              <Box flex={1} minW={{ base: '0', md: '220px' }} minH={{ base: '120px', md: '220px' }} borderWidth="1px" borderRadius="md" p={4} borderColor={'#838b8d'}>
                <Text fontWeight="bold" mb={2} fontSize={{ base: 'md', md: 'lg' }}>Step 4: Own</Text>
                <Text color="#838b8d" lineHeight={'18px'} fontSize={{ base: 'xs', md: 'sm' }}>Tokens are airdropped after the sale ends and a portion of the World's tokens is added into a liquidity pool with $AWE. Stay engaged as the World evolves and new features are unlocked.</Text>
              </Box>
            </Flex>
          </Box>
          <Box mb={8} fontFamily={'DMMono'}>
            <Heading as="h2" fontSize={{ base: 'md', md: 'xl' }} mb={2} fontWeight="semibold">About Us</Heading>
            <Text color="#838b8d" fontWeight={'light'} fontSize={{ base: 'sm', md: 'md' }} lineHeight={'20px'} mb={4}>
            World.Fun is a discovery platform and launchpad for Autonomous Worlds. Every world will feature an interactive crypto x AI experience whether it be multi-agent simulation, AI Gaming or AI Entertainment.
            </Text>
            <Text color="#838b8d" fontWeight={'light'} fontSize={{ base: 'sm', md: 'md' }} lineHeight={'20px'} mb={4}>
            Users explore and interact with these AI-driven worlds and get World Points to gain early access and unlock exclusive features before world launch.
            </Text>
            <Text color="#838b8d" fontWeight={'light'} fontSize={{ base: 'sm', md: 'md' }} lineHeight={'20px'}>
            We're not just launching tokens. We're launching onchain AI-native experiences that you've never seen before.
            </Text>
          </Box>
          <Box fontFamily={'DMMono'}>
            <Heading as="h2" fontSize={{ base: 'md', md: 'xl' }} mb={2} fontWeight="semibold">Disclaimer</Heading>
            <Text color="#838b8d" fontWeight={'light'} fontSize={{ base: 'sm', md: 'md' }} lineHeight={'20px'} mb={4}>
            Participation in world launches involves high risk and may result in total loss. Tokens are not securities, investments, or promises of profit. Do your own research and comply with local laws. This platform does not guarantee any financial returns or endorse any project. Use at your own risk and see the Terms of Service for more information.
            </Text>
          </Box>
        </Flex>
    </Box>
  )
}
