
import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Box, Heading, Text, Image,Flex } from '@chakra-ui/react';
import { useColorModeValue } from "@/components/ui/color-mode"
import Link from 'next/link';
import moment from 'moment';


export default function Home() {
  const bgColor = useColorModeValue('white', 'black');
  const color = useColorModeValue('black', 'white');
  const router = useRouter();
  const mainColor = useColorModeValue('#F5F3FF','#F5F3FF')

  const [worldList, setWorldList] = React.useState([
    {
      name: 'Trade Clash',
      image: '/tradeClash.jpg',
      // link: 'https://tradeclash.xyz/',
      link: '/tradeclash',
      website: false,
      description: 'Trade Clash is a news-driven AI economy simulation. It offers a dynamic simulation of the global economy, where twelve AI-controlled Country Agents react to real time news events and users speculate on outcomes.',
      launchDate: '29 AUG 2025',
      targetDate: 1756429200000,
      status: 'Completed',
      // status: 'Live',
      // status: 'Coming Soon',
      // bgColor: '#ffcf3d',
      // bgColor: '#85CC3E',
      bgColor: '#03a9f4'
    },
    {
      name: 'AI Shark Tank',
      image: '/aisharktank.jpg',
      link: '/aisharktank',
      website: false,
      description: 'AI Shark Tank is an AI-native pitch show where real founders present to AI judges trained on top Web3 investors. Judges evaluate pitches in real time and post onchain verdicts.',
      launchDate: '01 JULY 2025',
      targetDate: 1751374800000,
      status: 'Completed',
      bgColor: '#03a9f4'
    }    
  ]);
  
  const calculateTimeLeft = (targetDate: number) => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance > 0) {
      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  const [timeLeft, setTimeLeft] = React.useState(() => {
    const targetDate = 1756429200000;
    return calculateTimeLeft(targetDate);
  });

  // React.useEffect(() => {
  //   const targetDate = 1756429200000;
    
  //   const timer = setInterval(() => {
  //     const newTimeLeft = calculateTimeLeft(targetDate);
  //     setTimeLeft(newTimeLeft);
  //     // console.log(newTimeLeft);
      
  //     // check if the countdown is over
  //     if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
  //         newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
  //       clearInterval(timer);
        
  //       // update
  //       setWorldList(prevList => prevList.map(world => {
  //         if (world.name === 'Trade Clash') {
  //           return {
  //             ...world,
  //             status: 'Live',
  //             bgColor: '#85CC3E'
  //           };
  //         }
  //         return world;
  //       }));
  //     }
  //   }, 1000);

  // }, []);



  return (
      <Box>
        <Header />
        <Box display={{ base: 'none', md: 'block' }}>
          <Sidebar />
        </Box>
        <Flex 
          direction={'column'} 
          justify="space-between" 
          as="main" 
          ml={{ base: 0, md: "72px" }} 
          px={{ base: 4, md: "60px" }} 
          py={{ base: 4, md: 8 }} 
          pb={{ base: 4, md: 8 }} 
          pl={{ base: 4, md: 14 }} 
          pr={{ base: 4, md: 14 }} 
          bg={bgColor} 
          color={color} 
          minH="calc(100vh - 60px)"
        >
          {worldList.map((world, index) => (    
            <Flex key={index} alignItems={'self-start'} gap={{ base: 3, md: 5 }} direction={{ base: 'column', md: 'row' }}>
              <Flex alignItems={'center'} width={'130px'}>
                <Box width={'12px'} height={'12px'} bg={world.bgColor} borderRadius={'50%'} filter={'blur(2px)'}></Box>
                <Text pl={4} fontSize={{ base: '14px', md: '16px' }} fontFamily={'BDO Grotesk'} letterSpacing={'-0.03em'} color={world.bgColor}>{world.status}</Text>
              </Flex>
              <Box
                flex={1}
                position="relative"
                borderTop={'1px solid #43424A'} 
                marginTop={3}
              >
                  <Link href={world.link} target={world.website ? '_blank' : '_self'}>
                    <Flex 
                      justify="space-between" 
                      h={{ base: 'auto', md: '286px' }} 
                      direction={{ base: 'column', md: 'row' }}
                      gap={{ base: 4, md: 0 }}
                      _hover={{
                        '& .shark-tank-image': {
                          filter: 'blur(4px)',
                          transition: 'filter 0.3s ease'
                        },
                        '& .enter-button': {
                          opacity: 1,
                          transition: 'opacity 0.3s ease'
                        }
                      }}
                    >
                      <Flex direction={'column'} pt={{ base: 4, md: 8 }} pb={{ base: 4, md: 8 }} pl={{ base: 2, md: 5 }} justifyContent={'space-between'} flex={1}>
                        <Box>
                          <Heading as="h2"  fontSize={{ base: "xl", md: "2xl" }} fontFamily={'BDO Grotesk'} fontWeight={400} letterSpacing={'-0.03rem'} mb={{ base: 2, md: 2 }} color={mainColor}>
                          {world.name}
                          </Heading>
                          <Text fontSize={{ base: "md", md: "md" }} textAlign={{ base: "left", md: "left" }} maxW="600px" fontFamily={'DMMono'} letterSpacing={'-0.03rem'} mb={{ base: 2, md: 0 }} color={mainColor}>
                          {world.description}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize={{ base: "sm", md: "md" }} color={mainColor} fontFamily={'DMMono'} letterSpacing={'0.08rem'} mb={{ base: 2, md: 0 }} >
                            LAUNCH: {world.launchDate?world.launchDate:'TBD'}
                          </Text>
                          {
                            world.status !== 'Completed' && (timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) && (
                              <Text textStyle={{ base: "sm", md: "md" }} color="#80C838" fontFamily={'DMMono'} letterSpacing={'0.08rem'} fontWeight={500}>
                                {timeLeft.days} DAY: {timeLeft.hours} HOURS: {timeLeft.minutes} MINUTES: {timeLeft.seconds} SECONDS
                              </Text>
                            )
                          }
                        </Box>
                      </Flex>
                      <Box position="relative" pt={{ base: 4, md: 8 }} pb={{ base: 4, md: 8 }} alignSelf={{ base: 'center', md: 'auto' }} w={{ base: '100%', md: 'auto' }}>
                        <Image
                          className="shark-tank-image"
                          src={world.image} 
                          alt="AI Shark Tank Scene"
                          maxW={{ base: "100%", md: "346px" }}
                          minW={{ base: "100%", md: "346px" }}
                          maxH={{ base: "100%", md: "222px" }}
                          w={{ base: "100%", md: "346px" }}
                          borderRadius="10px"
                          transition="filter 0.3s ease"
                          objectFit="cover"
                        />
                        <Box
                          className="enter-button"
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          opacity={{ base: 1, md: 0 }}
                          transition="opacity 0.3s ease"
                          cursor="pointer"
                          bg={{ base: "rgba(0, 0, 0, 0.7)", md: "rgba(0, 0, 0, 0.8)" }}
                          color="#8C8C8C"
                          px={{ base: 4, md: 6 }}
                          py={{ base: 2, md: 3 }}
                          borderRadius="md"
                          fontFamily="DMMOno"
                          fontSize={{ base: "md", md: "lg" }}
                          fontWeight={500}
                          minH={{ base: "44px", md: "auto" }}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          _hover={{
                            bg: "rgba(0, 0, 0, 0.9)"
                          }}
                          _active={{
                            bg: "rgba(0, 0, 0, 0.95)"
                          }}
                          onClick={() => {router.push(world.link)}}
                        >
                          Enter World
                        </Box>
                      </Box>
                    </Flex>
                  </Link>
              
              </Box>
            </Flex>
          ))}
          <Box mt={{ base: 10, md: 24 }} pb={{ base: '20px', md: '40px' }} maxW={'1280px'}>
            <Heading 
              as="h1" 
              fontSize={{ base: "4xl", md: "90px" }} 
              lineHeight={'1.2'} 
              color={mainColor}
              fontFamily={'BDO Grotesk'}
              textAlign={{ base: "center", md: "left" }}
              mt={{ base: 6, md: 0 }}
            >
              Discover Autonomous Worlds.
            </Heading>
          </Box>
        </Flex>
      </Box>
  );
}