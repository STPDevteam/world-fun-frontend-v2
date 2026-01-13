import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'

interface TeamMember {
  name: string
  role: string
  avatar: string
  twitter: string
  desc: string
}

interface OurTeamProps {
  team?: TeamMember[]
}

const defaultTeam: TeamMember[] = [
  {
    name: '@Ellie Li',
    role: 'Co-founder & CEO',
    avatar: '/team1.jpg',
    twitter: 'https://x.com/carrotcakesol',
    desc: `- Serial entrepreneur with 2 exits; last startup acquired by Verve/PubNative at $50M ARR\n- Former core contributor to the Ethereum ecosystem; built an AI-powered Duolingo-style platform that onboarded 50K+ students into Web3\n- Head of Product & Operations at Roll ($10M Series A), launched 500+ social tokens for creators and celebrities, $1B+ in trading volume\n- Product leader with expertise across consumer AI, social platforms, and adtech — with products used by 10M+ users globally`,
  },
  {
    name: '@Abhinav Vishwa',
    role: 'Co-founder & CTO',
    avatar: '/team2.jpg',
    twitter: 'https://x.com/abhinavvishwa',
    desc: `- Previously, CTO at Morphic, Worked on Generative Media research for seamless image/video editing in next-gen creative workflows.\n- Former Director of Engineering at Polygon, Led Polygon POS, FDV $15B chain. Staff Engineer, Tech Lead at Uber, and a16z CSX alum\n- Built contextual video ads at Media.net (acquired for ~$1B); scaled monetization for Forbes, Bloomberg, and major publishers`,
  },
]

export default function OurTeam({ team = defaultTeam }: OurTeamProps) {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [showMore, setShowMore] = useState<{ [key: number]: boolean }>({});
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!team) return;
    team.forEach((_: TeamMember, idx: number) => {
      const el = descRefs.current[idx];
      if (el) {
        // 
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20');
        const maxHeight = lineHeight * 6;
        if (el.scrollHeight > maxHeight) {
          setShowMore(prev => ({ ...prev, [idx]: true }));
        } else {
          setShowMore(prev => ({ ...prev, [idx]: false }));
        }
      }
    });
    
  }, [team]);

  return (
    <Box w="100%" maxW="900px" fontFamily="DMMono" px={{ base: 4, md: 0 }}>
     
      <Text 
        fontSize={{ base: 'xl', md: '26px' }} 
        fontWeight="bold" 
        mb={{ base: 6, md: 8 }} 
        fontFamily="DMMono"
      >
        Our Team
      </Text>
      
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        gap={{ base: 4, md: 6 }}
        align={{ base: 'center', md: 'stretch' }}
      >
        {team && team.map((member: TeamMember, idx: number) => (
          <Box
            key={idx}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            p={{ base: 6, md: 4 }}
            flex="1"
            maxW={{ base: '100%', md: '300px' }}
            minW={{ base: '280px', md: 'auto' }}
            overflow="hidden"
            boxShadow="md"
            display="flex"
            flexDirection="column"
          >
            <Image 
              src={member.avatar} 
              alt={member.name} 
              boxSize={{ base: '60px', md: '120px' }} 
              borderRadius="full" 
              mb={{ base: 2, md: 4 }} 
            />
            <Text 
              fontWeight="bold" 
              fontSize={{ base: 'lg', md: 'xl' }} 
              mb={1}
            >
              {member.name}
            </Text>
            <Text 
              mb={3}
              fontSize={{ base: 'sm', md: 'md' }}
            >
              {member.role}
            </Text>
            <Link href={member.twitter} target="_blank" >
              <Box
                as="button"
                mb={4}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="md"
                px={{ base: 6, md: 4 }}
                py={{ base: 3, md: 2 }}
                fontFamily="monospace"
                color="white"
                cursor="not-allowed"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
                bg="transparent"
                aria-disabled="true"
                _disabled={{ opacity: 0.6 }}
                pointerEvents="none"
                fontSize={{ base: 'xs', md: 'sm' }}
                minW={{ base: '140px', md: 'auto' }}
              >
                <Image src="/x.svg" w={{ base: 5, md: 4 }} h={{ base: 5, md: 4 }} alt="twitter"/>
                 Twitter
              </Box>
            </Link>
            <Box position="relative">
              <Box
                ref={(el: HTMLDivElement | null) => (descRefs.current[idx] = el)}
                color="#838b8d"
                fontFamily="DMMono"
                fontSize={{ base: 'sm', md: 'sm' }}
                lineHeight={{ base: 1.6, md: 1.5 }}
                px={{ base: 2, md: 0 }}
                whiteSpace="pre-line"
                maxH={expanded[idx] ? 'none' : { base: '100%', md: '200px' }}
                overflowY={expanded[idx] ? 'visible' : 'auto'}
                transition="max-height 0.2s"
                style={
                  expanded[idx]
                    ? {}
                    : {
                        display: '-webkit-box',
                        WebkitLineClamp: 6,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }
                }
              >
                {member.desc}
              </Box>
              {showMore[idx] && (
                <Box mt={2}>
                  <Text
                    as="button"
                    color="#80C838"
                    fontFamily="DMMono"
                    fontSize="sm"
                    cursor="pointer"
                    onClick={() => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  >
                    {expanded[idx] ? 'Less' : 'More'}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Flex>
    </Box>
  )
}
