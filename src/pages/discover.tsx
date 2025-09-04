'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Box, Heading, Text, Switch, Tabs, Stack, Skeleton, Separator, Clipboard, IconButton, VStack, Image, Flex, Button, Progress, Status, Icon, HStack, SkeletonCircle } from '@chakra-ui/react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { useColorModeValue } from "@/components/ui/color-mode"
import { useState } from 'react';
import { abbrTxHash, formatNumber } from '@/utils';
import { get } from '@/utils/request';
import { API_URL } from '@/constants'

export default function Worlds() {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenized, setTokenized] = useState(false);
  const [tab, setTab] = useState('ALL');
  const [worlds, setWorlds] = useState([]);
  const [filterWorlds, setFilterWorlds] = useState([])
  const [fdvLoading, setFdvLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'black');
  const color = useColorModeValue('black', 'white');

  const tabChange = (details: any) => {
    setTab(details.value);
    if (details.value === 'ALL') {
      setFilterWorlds(worlds)
    } else {
      setTokenized(false);
      setFilterWorlds(worlds.filter((world: any) => world.launch_status.toLocaleLowerCase() === details.value.toLocaleLowerCase()))
    }
  }

  const tokenizedChange = (details: any) => {
    setTokenized(details.checked);
    if (details.checked) {
      setTab('ALL');
      setFilterWorlds(worlds.filter((world: any) => world.tokenized))
    } else {
      setFilterWorlds(worlds)
    }
  }
  const getGeckoTerminalData = async (contractAddress: string) => {
    try {
      const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/base/tokens/${contractAddress}`, {
        headers: {
          'Accept': 'application/json;version=20230302'
        }
      })
      const data = await response.json()
      if (data.data?.attributes?.fdv_usd) {
        return data.data.attributes.fdv_usd
      }
    } catch (error) {
      console.error('Error fetching GeckoTerminal data:', error)
    }
  }

  useEffect(() => {
    get(`${API_URL}/home`).then(async (res) => {
      const newWorlds: any[] = [];

      res?.worlds.forEach((world: any) => {
        if (world.symbol === 'SHARKTANK') {
          world.link = '/aisharktank';
          newWorlds[1] = world;
        } else if (world.symbol === 'AITOWN') {
          world.link = 'https://app.world.fun/aitown';
          world.link_target = '_blank';
          newWorlds[2] = world;
        } else if (world.symbol === 'MARSX') {
          world.link = 'https://app.world.fun/marsx';
          world.link_target = '_blank';
          newWorlds[3] = world;
        } else if (world.symbol === 'TRADECLASH') {
          world.link = '/tradeclash';
          world.link_target = '_self';
          newWorlds[0] = world;
        } else if (world.symbol === 'SURVIVOR') {
          newWorlds[4] = world;
        } 
      });
      
      res?.worlds.forEach((world: any) => {
        if (!(world.symbol === 'SHARKTANK' || world.symbol === 'AITOWN' || world.symbol === 'MARSX' || world.symbol === 'SURVIVOR' || world.symbol === 'TRADECLASH')) {
          newWorlds.push(world);
        }
      });

      // bas
      setWorlds(newWorlds as any);
      setFilterWorlds(newWorlds as any);
      setIsLoading(false);

      // get
      setFdvLoading(true);
      const fdvPromises: Promise<any>[] = newWorlds.map(async (world: any) => {
        if (world.tokenized && world.token_address) {
          try {
            const fdv = await getGeckoTerminalData(world.token_address);
            return { ...world, fdv, fdvShow: true };
          } catch (error) {
            console.error('Error fetching FDV for', world.symbol, error);
            return { ...world, fdvShow: true };
          }
        }
        return world;
      });

      const worldsWithFdv = await Promise.all(fdvPromises);
      setWorlds(worldsWithFdv as any);
      setFilterWorlds(worldsWithFdv as any);
      setFdvLoading(false);
      
    }).catch((error) => {
      console.error('Error fetching worlds:', error);
      setIsLoading(false);
    });
  }, [])

  return (
    <Box>
      <Header />
      <Sidebar />
      <Box as="main" fontSize={14} fontFamily="DMMono" ml={{ base: 0, md: "72px" }} px={{ base: 4, md: "60px" }} py={{ base: 4, md: 8 }} bg={bgColor} color={color} minH="calc(100vh - 60px)">
        <Flex align="center" justify="space-between" wrap="wrap" gap={3} mt={{ base: 2, md: 8 }}>
          <Flex align="center" gap={4}>
            <Text>Tokenized</Text>
            <Switch.Root style={{ border: '1px solid #fff', borderRadius: '100px' }} checked={tokenized} onCheckedChange={tokenizedChange}>
              <Switch.Control />
              <Switch.HiddenInput />
            </Switch.Root>
          </Flex>
          <Flex align="center" gap={3} w={{ base: '100%', md: 'calc(20% + 162px)' }} wrap="wrap">
            <Text>SHOW:</Text>
            <Tabs.Root value={tab} onValueChange={tabChange} variant="plain">
              <Tabs.List as={Flex} gap={3}>
                {
                  ['ALL', 'LIVE', 'UPCOMING'].map((val, index) => (
                    <Tabs.Trigger
                      value={val}
                      key={index}
                      as={Text}
                      p={0}
                      style={{
                        minWidth: 'auto',
                        color: tab === val ? '' : '#646E71',
                        textDecoration: tab === val ? 'underline' : 'none',
                      }}
                    >
                      {val}
                    </Tabs.Trigger>
                  ))
                }
              </Tabs.List>
            </Tabs.Root>
          </Flex>
        </Flex>

        {isLoading ? (
          <FeaturedWorldSkeleton />
        ) : (
          filterWorlds.length > 0 ? (
            filterWorlds.map((world: any) => (
              world.link ? (
                <Link href={world.link} target={world.link_target} key={world.symbol}>
                  <WorldCard world={world} />
                </Link>
              ) : (
                <WorldCard world={world} key={world.symbol} />
              )
            ))
          ) : (
            <Box textAlign="center" py={10}>
              <Text color="#646E71">No matching results, explore these worlds instead</Text>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}

function WorldCard({ world }: { world: any }) {
  return (
    <VStack key={world.symbol} borderTop="1px solid #646E71" py={4}>
      <Flex gap={8} align="stretch" w="100%" direction={{ base: 'column', md: 'row' }}>
        <Box w="330px">
          <Flex align="center" gap={4} mb={1}>
            <Box fontSize="md" letterSpacing="2px" className='uppercase'>{world.name}</Box>
            <Box
              style={{
                backgroundColor: world.name==='Trade Clash'? '#ffcf3d33' : world.launch_status.toLocaleLowerCase() === 'live' ? '#6632DE87' : '#7E7B9133',
                color: world.name==='Trade Clash'? '#ffcf3d' : world.launch_status.toLocaleLowerCase() === 'live' ? '#949494' : '#949494',
              }}
              px={3} py={1} borderRadius="100px" fontSize="xs"
            >{world.launch_status==='Upcoming' && world.name==='Trade Clash' ? 'Up Next':world.launch_status?.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}</Box>
          </Flex>
          {/* <Text fontSize="xs" color="#646E71" mb={2}>{new Date(world.start_time * 1000).toLocaleDateString()}</Text> */}
        </Box>
        <Box flex="1">
          <Text mb={4} lineClamp="3">{world.about}</Text>
          <Flex gap={2} align="center">
            {
              world?.token_address && (
                <Clipboard.Root value={world.token_address} onClick={e => { e.stopPropagation(); e.preventDefault(); }}>
                <Clipboard.Trigger asChild>
                  <IconButton variant="surface" px={2} h={8}>
                    <Text>World <span style={{ color: '#646E71' }}>{abbrTxHash(world.token_address)}</span></Text>
                    <Clipboard.Indicator />
                  </IconButton>
                </Clipboard.Trigger>
              </Clipboard.Root>
            )
          }
          {
            world.tokenized && world.token_address && (
              <IconButton variant="surface" px={2} h={8}>
                <Text>FDV <span style={{ color: '#646E71' }}>{world.fdv?'$' + formatNumber(Number(world.fdv), 2):'--'}</span></Text>
              </IconButton>
            )
          }
          </Flex>
        </Box>
        <Box w={{ base: "100%", md: "20%" }}>
          <Text fontWeight="bold" fontSize="sm" color="gray.300">Categories</Text>
          {
            world?.categories?.split(',').map((item: string, index: number) => (
              <>
                {
                  index != 0 && <Text as="span" color="#646E71" fontWeight="normal" key={index}>,</Text>
                }
                <Text as="span" color="#646E71" _hover={{ textDecoration: 'underline' }} fontWeight="normal" key={index}>{item}</Text>
              </>
            ))
          }
        </Box>
        <Image src={world.symbol==='TRADECLASH' ? '/tradeclash.jpg' : world.banner_url} alt={world.name} boxSize={{ base: "100%", md: "130px" }} objectFit="cover" borderRadius="md" />
      </Flex>
    </VStack>
  )
}

function FeaturedWorldSkeleton() {
  return (
    <Box>
      {
        Array.from({ length: 4 }).map((_, index) => (
          <Box key={index}>
            <Separator />
            <HStack gap={4} my={4} align="stretch">
              <Stack flex="1" gap={2}>
                <Skeleton height="5" />
                <Skeleton height="5" width="80%" />
              </Stack>
              <Skeleton w="130px" h="130px" />
            </HStack>
          </Box>
        ))
      }
    </Box>
  );
}