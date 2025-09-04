import React from 'react'
import { Box,Text, Image } from '@chakra-ui/react'

export default function Overview() {
  return (
    <Box>
      <Text fontSize={{ base: 'base', md: 'lg' }} fontWeight="light" mb={0} fontFamily="DMMono">
        Overview
      </Text>
      <Text color="#838b8d" fontSize={{ base: 'sm', md: 'md' }} fontWeight="light" fontFamily="DMMono">
        Trade Clash is a News-driven AI economy simulation where real news triggers AI world leaders to overreact, creating chaos that players profit from by predicting which countries thrive or crash.
      </Text>
      
      <Text mt={4} fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" mb={0} fontFamily="DMMono">
        What happens inside your world:  
      </Text>
      <Text color="#838b8d" mb={4} fontSize={{ base: 'sm', md: 'md' }} fontWeight="light" fontFamily="DMMono">
      Players join one of 6 nations in free-to-play tournaments. Every hour, real headlines from news sources like Bloomberg, CNN, RT trigger reactions from AI world leaders. Players recruit friends to boost their nation's economy. Top nations and top recruiters win real prize pool weekly.
      </Text>
      <Text mt={4} fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" mb={0} fontFamily="DMMono">
        What's autonomous or agent-driven: 
        </Text>
      <Text color="#838b8d" mb={4} fontSize={{ base: 'sm', md: 'md' }} fontWeight="light" fontFamily="DMMono">
        6 autonomous AI world leaders run their economies using an Agent-Based Model powered by real economic theory — gravity models for trade, game theory for tariffs, and supply chain dynamics. Each leader has unique goals and exaggerated reactions: oil news sends PumpFederation's Gazpumpsky annexing Norway while Fed meetings trigger AmeriCorp's CEO to pivot to asteroid mining. These predictable overreactions to real headlines create the patterns players exploit.
      </Text>
      <Text mt={4} fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" mb={0} fontFamily="DMMono">
        Whitelist criteria: 
      </Text>
      <Text color="#838b8d" fontSize={{ base: 'sm', md: 'md' }} fontWeight="light" fontFamily="DMMono">
      - Early alpha/beta testers
      </Text>
      <Text color="#838b8d"  fontSize={{ base: 'sm', md: 'md' }} fontWeight="light" fontFamily="DMMono">
      - Active tournament participants 
      </Text>
      <Text color="#838b8d"  fontSize={{ base: 'sm', md: 'md' }} fontWeight="light" fontFamily="DMMono">
      - Community contributors and partners
      </Text>
      <Text color="#838b8d"  fontSize={{ base: 'sm', md: 'md' }} fontWeight="light" fontFamily="DMMono">
      - Top leaderboard performers from previous seasons
      </Text>
    </Box>
  )
}
