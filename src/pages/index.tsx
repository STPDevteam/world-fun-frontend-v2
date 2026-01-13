
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoCloseOutline } from "react-icons/io5";
import numeral from 'numeral';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import CountUpDisplay from '@/components/CountUpDisplay';
import { Box, Heading, Text, Image, Flex, Button } from '@chakra-ui/react';
import { useColorModeValue } from "@/components/ui/color-mode"
import Link from 'next/link';
import moment from 'moment';
import Crosshair from '@/components/Crosshair';
import NetworkGraph from '@/components/NetworkGraph';
import styles from './index.module.css';
import { get } from '@/utils/request';
import { API_URL } from '@/constants';
import { formatUnits, parseUnits } from "ethers";
import { A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


export default function Home() {
  const bgColor = useColorModeValue('white', 'black');
  const color = useColorModeValue('black', 'white');
  const router = useRouter();
  const mainColor = useColorModeValue('#F5F3FF', '#F5F3FF');
  const [dashboardData, setDashboardData] = useState<{ total_agents: number, total_marketcap: number, total_participants: number, total_live_tokens: number }>({ total_agents: 0, total_marketcap: 0, total_participants: 0, total_live_tokens: 0 });
  const [projectList, setProjectList] = useState<any[]>([]);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [currentAgent, setCurrentAgent] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiper, setSwiper] = useState<any>(null);
  const [showProjectInfo, setShowProjectInfo] = useState(false);


  const handleClickProject = (project: any) => {
    if (!project.tokenName) {
      setCurrentProject(null);
      setCurrentAgent(project);
    } else {
      setCurrentAgent(null);
      setCurrentProject(project);
    }
    setShowProjectInfo(true);
  }


  useEffect(() => {
    get(`${API_URL}/dashboard`).then((res) => {
      setDashboardData(res);
    });
    get(`https://awe-be-production.up.railway.app/tokens/search?page=1&limit=3`).then((res) => {
      setProjectList(res.tokens ? res.tokens : []);
    });
  }, []);



  return (
    <Box bg={bgColor} minH="100vh" color={color}>
      {/* <Crosshair color='rgba(255,255,255,0.4)' /> */}
      <Header showSidebar={false} />
      <div className={styles.r_line1}></div>
      <div className={styles.c_line1}></div>
      <div className={styles.c_line2}></div>
      <div className={styles.dot1}></div>
      <div className={styles.dot2}></div>
      <Box
        mx={{ base: 2, md: '36px' }}
        pt={{ base: 2, md: '30px' }}
        mb={{ base: 2, md: '30px' }}
        borderLeft="1px solid rgba(255,255,255,0.4)"
        borderRight="1px solid rgba(255,255,255,0.4)"
      >
        {/* Main Content Section */}
        <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 10, md: 5, xl: 10 }} mb={10} mx={{ base: 2, md: '20px', xl: '50px' }}>
          {/* Left Side - NEW PROJECT Card */}
          <Flex direction="column" justify="space-between" flex="none" width={{ base: '100%', md: '480px', xl: '580px' }}>

            <Box display={showProjectInfo ? 'none' : 'block'}>
              <Flex justify="space-between" mb={4} align="center">
                <Text
                  fontSize="sm"
                  letterSpacing="0.1rem"
                  fontFamily="DMMono"
                  textTransform="uppercase"
                  color={color}
                >
                  NEW PROJECTS
                </Text>
                <Flex gap={2}>
                  {projectList.map((_, index) => (
                    <Box
                      key={index}
                      as="button"
                      onClick={() => swiper?.slideToLoop(index)}
                      w={currentSlide === index ? '47px' : '28px'}
                      h="2px"
                      bg={currentSlide === index ? '#FFFFFF' : '#FFFFFF66'}
                      transition="all 0.3s"
                      _hover={{ bg: currentSlide === index ? '#FFFFFF' : '#FFFFFF66' }}
                      cursor="pointer"
                    />
                  ))}
                </Flex>
              </Flex>

              <Swiper
                modules={[A11y, Autoplay]}
                spaceBetween={50}
                loop={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                onSlideChange={(swiper) => {
                  setCurrentSlide(swiper.realIndex);
                }}
                onSwiper={(swiperInstance) => {
                  if (swiperInstance && !swiper) {
                    setSwiper(swiperInstance);
                  }
                }}
              >
                {
                  projectList.map((item) => (
                    <SwiperSlide key={item.id}>
                      <Box
                        border="1px solid #353535"
                        borderRadius="4px"
                        p={2}
                        bg={'#080808'}
                      >
                        <Box p={2}>
                          <Flex gap={4} mb={3}>
                            <Image src={item.bannerUrl || item.tokenImage} width={100} height={100} />
                            <Box flex="1" height={100}>
                              <Text fontSize="md" lineHeight={1} fontWeight="bold" mb={2} fontFamily="BDO Grotesk">
                                {item.tokenName}
                              </Text>
                              <Text visibility={'hidden'} fontSize="xs" lineHeight={1} mb={2} fontFamily="DMMono">
                                Created {moment(item.createdAt).format('DD/MM/YYYY')}
                              </Text>
                              <Text
                                fontSize="xs"
                                color={'#FFFFFF73'}
                                lineHeight="1.5"
                                fontFamily="DMMono"
                                lineClamp="3"
                              >
                                {item.description}
                              </Text>
                            </Box>
                          </Flex>

                          <Flex py={4} gap={10} direction={{ base: 'column', md: 'row' }}>
                            <Flex direction="column" gap={2}>
                              <Text fontSize="xs" mb={4} fontFamily="DMMono">
                                {numeral(Number(formatUnits(item.totalAweRaised, 18)).toFixed(2)).format('0,0.00')} / {numeral(item.targetFundRaise).format('0,0')} {item.fundType ? item.fundType : 'AWE'}
                              </Text>
                              <Flex gap={'2px'} mb={4}>
                                {Array.from({ length: 30 }).map((_, i) => (
                                  <Box
                                    key={i}
                                    flex="none"
                                    w="8px"
                                    h="48px"
                                    bg={(i === 0 && item.totalAweRaised > 0) ? '#B38045' : Number(formatUnits(item.totalAweRaised, 18)) > (item.targetFundRaise / 30) * (i + 0.5) ? '#B38045' : 'rgb(52, 53, 53)'}
                                  />
                                ))}
                              </Flex>
                              <Text fontSize="xs" fontFamily="DMMono">
                                {numeral((Number(formatUnits(item.totalAweRaised, 18)) / Number(item.targetFundRaise) * 100).toFixed(2)).format('0,0.00')}%
                              </Text>
                            </Flex>

                            <Flex fontSize="xs" justify="space-between" direction={{ base: 'row', sm: 'column' }}>
                              <Box>
                                <Text mb={'10px'} color={'#FFFFFF'}>
                                  Status
                                </Text>
                                <Text color={'#FFFFFF73'}>{item.status === 'ON_GOING' ? 'In Progress' : 'Ended'}</Text>
                              </Box>
                              <Box>
                                <Text mb={'10px'} color={'#FFFFFF'}>
                                  Launch at
                                </Text>
                                <Text color={'#FFFFFF73'}>{moment(item.createdAt).format('DD MMM YYYY')}</Text>
                              </Box>
                            </Flex>
                          </Flex>
                        </Box>

                        <a
                          href={item.link ? item.link : `https://alpha.world.fun/world/${item.id}`}
                          style={{
                            height: '32px',
                            lineHeight: '32px',
                            background: '#BABABA2E',
                            color: 'white',
                            borderRadius: '2px',
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'block',
                          }}
                          target="_blank"
                        >
                          View World/Agent
                        </a>
                      </Box>
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </Box>


            <Box display={showProjectInfo ? 'block' : 'none'}>
              <Flex justify="space-between" mb={4} align="center">
                <Text
                  fontSize="sm"
                  letterSpacing="0.1rem"
                  fontFamily="DMMono"
                  textTransform="uppercase"
                  color={color}
                >
                  {currentAgent ? 'Agent' : 'Project'} info
                </Text>
                <Flex fontSize="24px" onClick={() => setShowProjectInfo(false)}>
                  <IoCloseOutline cursor="pointer" />
                </Flex>
              </Flex>

              {currentProject && (
                <Box
                  border="1px solid #353535"
                  borderRadius="4px"
                  p={2}
                  bg={'#080808'}
                >
                  <Box p={2}>
                    <Flex gap={4} mb={3}>
                      <Image src={currentProject.bannerUrl || currentProject.tokenImage} width={100} height={100} />
                      <Box flex="1" height={100}>
                        <Text fontSize="md" lineHeight={1} fontWeight="bold" mb={2} fontFamily="BDO Grotesk">
                          {currentProject.tokenName}
                        </Text>
                        <Text visibility={'hidden'} fontSize="xs" lineHeight={1} mb={2} fontFamily="DMMono">
                          Created {moment(currentProject.createdAt).format('DD/MM/YYYY')}
                        </Text>
                        <Text
                          fontSize="xs"
                          color={'#FFFFFF73'}
                          lineHeight="1.5"
                          fontFamily="DMMono"
                          lineClamp="3"
                        >
                          {currentProject.description}
                        </Text>
                      </Box>
                    </Flex>

                    {
                      currentProject.targetFundRaise ? (
                        <Flex py={4} gap={10} direction={{ base: 'column', md: 'row' }}>
                          <Flex direction="column" gap={2}>
                            <Text fontSize="xs" mb={4} fontFamily="DMMono">
                              {numeral(Number(formatUnits(currentProject.totalAweRaised, 18)).toFixed(2)).format('0,0.00')} / {numeral(currentProject.targetFundRaise).format('0,0')} {currentProject.fundType ? currentProject.fundType : 'AWE'}
                            </Text>
                            <Flex gap={'2px'} mb={4}>
                              {Array.from({ length: 30 }).map((_, i) => (
                                <Box
                                  key={i}
                                  flex="none"
                                  w="8px"
                                  h="48px"
                                  bg={(i === 0 && currentProject.totalAweRaised > 0) ? '#B38045' : Number(formatUnits(currentProject.totalAweRaised, 18)) > (currentProject.targetFundRaise / 30) * (i + 0.5) ? '#B38045' : 'rgb(52, 53, 53)'}
                                />
                              ))}
                            </Flex>
                            <Text fontSize="xs" fontFamily="DMMono">
                              {numeral((Number(formatUnits(currentProject.totalAweRaised, 18)) / Number(currentProject.targetFundRaise) * 100).toFixed(2)).format('0,0.00')}%
                            </Text>
                          </Flex>
                          <Flex fontSize="xs" justify="space-between" direction={{ base: 'row', md: 'column' }}>
                            <Box>
                              <Text mb={'10px'} color={'#FFFFFF'}>
                                Status
                              </Text>
                              <Text color={'#FFFFFF73'}>{currentProject.status === 'ON_GOING' ? 'In Progress' : 'Ended'}</Text>
                            </Box>
                            <Box>
                              <Text mb={'10px'} color={'#FFFFFF'}>
                                Launch at
                              </Text>
                              <Text color={'#FFFFFF73'}>{moment(currentProject.createdAt).format('DD MMM YYYY')}</Text>
                            </Box>
                          </Flex>
                        </Flex>
                      ) : (
                        <Flex py={4} ml={'116px'} fontSize="xs">
                          <Box w={'50%'}>
                            <Text mb={'10px'} color={'#FFFFFF'}>
                              Status
                            </Text>
                            <Text color={'#FFFFFF73'}>{currentProject.status === 'ON_GOING' ? 'In Progress' : 'Ended'}</Text>
                          </Box>
                          <Box>
                            <Text mb={'10px'} color={'#FFFFFF'}>
                              Launch at
                            </Text>
                            <Text color={'#FFFFFF73'}>{moment(currentProject.createdAt).format('DD MMM YYYY')}</Text>
                          </Box>
                        </Flex>
                      )
                    }
                  </Box>

                  <a
                    href={currentProject.link ? currentProject.link : `https://alpha.world.fun/world/${currentProject.id}`}
                    style={{
                      height: '32px',
                      lineHeight: '32px',
                      background: '#BABABA2E',
                      color: 'white',
                      borderRadius: '2px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'block',
                    }}
                    target="_blank"
                  >
                    View World/Agent
                  </a>
                </Box>
              )}
              {currentAgent && (
                <Box
                  border="1px solid #353535"
                  borderRadius="4px"
                  p={2}
                  bg={'#080808'}
                >
                  <Box p={2}>
                    <Flex gap={'30px'} mb={3}>
                      <Image src={currentAgent.avatar_url} width={248} height={248} />
                      <Box flex="1" height={100}>
                        <Text fontSize="md" lineHeight={1} fontWeight="bold" mb={2} fontFamily="BDO Grotesk">
                          {currentAgent.name}
                        </Text>
                        <Text fontSize="xs" lineHeight={1} fontFamily="DMMono">
                          Created {moment(currentAgent.created_at * 1000).format('DD/MM/YYYY')}
                        </Text>
                        <Text fontSize="xs" mt={'22px'} mb={'10px'} fontFamily="DMMono">World</Text>
                        <Text
                          fontSize="xs"
                          color={'#FFFFFF73'}
                          lineHeight="1.5"
                          fontFamily="DMMono"
                          lineClamp="3"
                        >
                          {currentAgent.world}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>

                  <Button
                    w="100%"
                    height="32px"
                    lineHeight="32px"
                    bg={'#BABABA2E'}
                    color="white"
                    borderRadius="2px"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    View World/Agent
                  </Button>
                </Box>
              )}
            </Box>
            <Box
              fontSize={{ base: '3xl', md: '46px', xl: '60px' }}
              fontFamily="BDO Grotesk"
              fontWeight="300"
              lineHeight={'75px'}
              letterSpacing={'-2px'}
            >
              Discover<br />Autonomous Worlds.
            </Box>
          </Flex>

          {/* Right Side - Network Graph */}
          <Box flex="1">
            <NetworkGraph onClickProject={handleClickProject} />

            <Flex mb="-14px" mt={{ base: '28px', md: '0' }} gap={{ base: 7, md: 3, xl: 7 }} justifyContent="center" direction={{ base: 'column', sm: 'row' }} textAlign="center">
              <Box minW={160}>
                <Text 
                  fontSize="3xl" 
                  lineHeight={1.3} 
                  fontWeight="bold" 
                  mb={2} 
                  fontFamily="BDO Grotesk"
                  transition="all 0.3s ease"
                  _hover={{
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.5)'
                  }}
                >
                  $<CountUpDisplay value={dashboardData.total_marketcap} />
                </Text>
                <Text fontSize="xs" color={'#e0e0e0'} fontFamily="DMMono" textTransform="uppercase">
                  TOTAL MARKET CAP
                </Text>
              </Box>
              <Image className={styles.line10} src="/assets/line10.svg" />
              <Box minW={160}>
                <Text 
                  fontSize="3xl" 
                  lineHeight={1.3} 
                  fontWeight="bold" 
                  mb={2} 
                  fontFamily="BDO Grotesk"
                  transition="all 0.3s ease"
                  _hover={{
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <CountUpDisplay value={dashboardData.total_participants} />
                </Text>
                <Text fontSize="xs" color={'#e0e0e0'} fontFamily="DMMono" textTransform="uppercase">
                  TOTAL PARTICIPANTS
                </Text>
              </Box>
              <Image className={styles.line10} src="/assets/line10.svg" />
              <Box minW={160}>
                <Text 
                  fontSize="3xl" 
                  lineHeight={1.3} 
                  fontWeight="bold" 
                  mb={2} 
                  fontFamily="BDO Grotesk"
                  transition="all 0.3s ease"
                  _hover={{
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <CountUpDisplay value={dashboardData.total_agents} />
                </Text>
                <Text fontSize="xs" color={'#e0e0e0'} fontFamily="DMMono" textTransform="uppercase">
                  TOTAL AGENTS
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>

        {/* Footer */}
        <Box
          borderTop="1px solid rgba(255,255,255,0.4)"
          borderBottom="1px solid rgba(255,255,255,0.4)"
          py={6}
          px={4}
          position="relative"
          color={'#e0e0e0'}
        >
          <Flex gap={14} fontFamily="DMMono" fontSize="sm" justify="flex-end">
            <Link href="https://docs.google.com/document/d/12DZM9ufxZo5VvP12Fs51mTg_dqM7DVTO-8cK8EPoZgc/edit?usp=sharing" target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text _hover={{ textDecoration: 'underline' }}>DOCS</Text>
            </Link>
            <Link href="https://x.com/awenetwork_ai" target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text _hover={{ textDecoration: 'underline' }}>X</Text>
            </Link>
            <Link href="https://www.awenetwork.ai/terms-of-service" target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text _hover={{ textDecoration: 'underline' }}>TERMS & SERVICES</Text>
            </Link>
          </Flex>
          <div className={styles.dot3}></div>
          <div className={styles.dot4}></div>
          <div className={styles.dot5}></div>
          <div className={styles.dot6}></div>
        </Box>
      </Box>
    </Box>
  );
}