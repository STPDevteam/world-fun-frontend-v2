'use client';
import { useEffect, useState, useCallback, use } from 'react'
import Link from 'next/link';
import { readContracts, waitForTransactionReceipt } from '@wagmi/core'
import { useAccount, useWriteContract } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit';
import moment from 'moment'
import { toaster } from "@/components/ui/toaster"
import { formatUnits, parseUnits } from "ethers";
import numeral from 'numeral'
import { useRouter } from 'next/navigation';
import { Box, Heading, Text, Grid, GridItem, Image, Flex, Button, Progress, Stack, Status, Tabs, Icon, Field, NumberInput, Input, Group, HStack, useBreakpointValue } from '@chakra-ui/react';
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { useColorModeValue } from "@/components/ui/color-mode"
import { FaRegCheckCircle } from "react-icons/fa";
import { PiWarningCircle } from "react-icons/pi";
import { WorldFunABI } from '@/constants/abi/WorldFun';
import { ERC20_ABI } from '@/constants/abi/ERC20';
import { config } from '@/config/rainbow.config';
import OurTeam from '@/components/OurTeam';
import Overview from '@/components/Overview';
import { useWorldData } from '@/hooks';
import ChartSchedule from '@/components/ChartSchedule';
import ChartOverview from '@/components/ChartOverview';
import { abbrTxHash,copyToClipboard,formatNumber } from '@/utils';

const formSchema = z.object({
  amount: z.string({ message: "Amount is required" }),
})

type FormValues = z.infer<typeof formSchema>

export default function WorldPage() {
  const id = 'sharktank';
  const bgColor = useColorModeValue('white', 'black');
  const color = useColorModeValue('black', 'white');
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [refresh, setRefresh] = useState(1);
  const [contributionsAmount, setContributionsAmount] = useState('')
  const [aweBalance, setAWEBalance] = useState('')
  const [amountToApprove, setAmountToApprove] = useState('')
  const [maxAmountPerAddress, setMaxAmountPerAddress] = useState('')
  const [fundingGoal, setFundingGoal] = useState('')
  const [totalRaised, setTotalRaised] = useState('')
  const [endTime, setEndTime] = useState('')
  const [startTime, setStartTime] = useState('')
  const [aweAddress, setAWEAddress] = useState('')
  const [activeTab, setActiveTab] = useState('team');
  const [amount, setAmount] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<string>('');
  const [isTradable, setIsTradable] = useState<boolean>(true);
  const [contributeLoading, setContributeLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const { writeContract } = useWriteContract()
  const worldData = useWorldData(address, id, refresh)
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })
  const worldInfo = {
    'sharktank': {
      'id': 'aisharktank',
      'name': 'AI Shark Tank',
      'logo': '/logo_shark.svg',
      'description': 'AI Shark Tank is a platform for AI projects to raise funds from the community.',
      'token': '0xb69938B92ba1ab2a4078DDb3d5c3472faa13C162',
      'type': 'On-Chain',
      'x': 'https://x.com/aisharktank',
      'doc': 'https://ai-sharktank.gitbook.io/shark/',
      'createdOn': '01/07/2025',
      'status':'Ended'
    }
  }

  const [mobileTab, setMobileTab] = useState<'info' | 'fundraise'>('info')
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleReadContracts = useCallback(async () => {
    if (worldData.launch_contract) {
      const World_Fun_Contract: any = {
        address: worldData.launch_contract,
        abi: WorldFunABI,
      }
      const result: any = await readContracts(config, {
        contracts: [
          {
            ...World_Fun_Contract,
            functionName: 'contributions',
            args: [address],
          },
          {
            ...World_Fun_Contract,
            functionName: 'maxPerAddress',
            args: []
          },
          {
            ...World_Fun_Contract,
            functionName: 'fundingGoal',
            args: []
          },
          {
            ...World_Fun_Contract,
            functionName: 'totalRaised',
            args: []
          },
          {
            ...World_Fun_Contract,
            functionName: 'endTime',
            args: []
          },
          {
            ...World_Fun_Contract,
            functionName: 'startTime',
            args: []
          },
          {
            ...World_Fun_Contract,
            functionName: 'awe',
            args: []
          }
        ],
      })
      if (result[0] && result[0]?.status === 'success') {
        setContributionsAmount(formatUnits(result[0].result, 18))
      }
      if (result[1] && result[1]?.status === 'success') {
        setMaxAmountPerAddress(formatUnits(result[1].result, 18))
      }
      if (result[2] && result[2]?.status === 'success') {
        setFundingGoal(formatUnits(result[2].result, 18))
      }
      if (result[3] && result[3]?.status === 'success') {
        setTotalRaised(formatUnits(result[3].result, 18))
      }
      if (result[4] && result[4]?.status === 'success') {
        setEndTime(formatUnits(result[4].result, 0))
      }
      if (result[5] && result[5]?.status === 'success') {
        setStartTime(formatUnits(result[5].result, 0))
      }
      if (result[6] && result[6]?.status === 'success') {
        setAWEAddress(result[6].result)
      }
    }
  }, [address, worldData?.launch_contract])

  const handleReadERCContracts = useCallback(async () => {
    if (aweAddress) {
      const AWE_ERC20Contract: any = {
        address: aweAddress,
        abi: ERC20_ABI,
      }
      const result: any = await readContracts(config, {
        contracts: [
          {
            ...AWE_ERC20Contract,
            functionName: 'balanceOf',
            args: [address]
          },
          {
            ...AWE_ERC20Contract,
            functionName: 'allowance',
            args: [address, worldData.launch_contract]
          }
        ],
      })
      if (result[0] && result[0]?.status === 'success') {
        setAWEBalance(formatUnits(result[0].result, 18))
      }
      if (result[1] && result[1]?.status === 'success') {
        setAmountToApprove(formatUnits(result[1].result, 18))
      }
    }
  }, [address, aweAddress])

  useEffect(() => {
    handleReadContracts()
  }, [address, refresh, worldData.launch_contract, handleReadContracts])

  useEffect(() => {
    handleReadERCContracts()
  }, [address, refresh, aweAddress, handleReadERCContracts])

  useEffect(() => {
    if (endTime && startTime) {
      setInterval(() => {
        const now = new Date().getTime();
        let left: number = Number(startTime)*1000;
        if(now < Number(startTime)*1000) {
            left = Number(startTime)*1000;
            setIsTradable(false)
        }
        if(now > Number(startTime)*1000 && now < Number(endTime)*1000) {
            left = Number(endTime)*1000;
            setIsTradable(true)
        }
        if(now > Number(endTime)*1000) {
            setRemainingTime('')
            setIsTradable(false)
            return;
        }

        const distance = Number(left) - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setRemainingTime(`${days} d ${hours} h ${minutes} m ${seconds} s`)
      }, 1000)
    }
  }, [endTime, startTime])

  const handleApprove = useCallback(() => {
    if (!aweAddress) {
      return
    }
    const AWE_ERC20Contract: any = {
      address: aweAddress,
      abi: ERC20_ABI,
    }
    setApproveLoading(true)
    const approvePromise = new Promise((resolve, reject) => {
      writeContract({
        ...AWE_ERC20Contract,
        functionName: 'approve',
        args: [worldData.launch_contract, parseUnits(getValues('amount'), 18)]
      }, {
        onSuccess: async (txHash) => {
          console.log("Transaction submitted successfully, txHash:", txHash);
          try {
            const receipt = await waitForTransactionReceipt(config, {
              hash: txHash,
            });
            setApproveLoading(false)
            setRefresh(refresh + 1)
            setAmountToApprove(getValues('amount'))
            resolve({
              txHash: receipt.transactionHash,
              blockNumber: receipt.blockNumber,
            });
          } catch (receiptError) {
            setApproveLoading(false)
            console.error("Failed to get transaction receipt:", receiptError);
            reject(receiptError);
          }
        },
        onError: (error) => {
          console.error('err', error)
          reject(error)
          setApproveLoading(false)
        }
      })
    })

    toaster.promise(approvePromise, {
      success: { title: 'Approve Success', description: '' },
      error: { title: 'Approve Failed', description: 'Something wrong' },
      loading: { title: 'Confirm wallet pending', description: 'Please wait' },
    })
  }, [address, amount, aweAddress, refresh])

  const handleContribute = handleSubmit((data: any) => {
    console.log(getValues('amount'))
    if (!worldData.launch_contract) {
      return
    }
    setContributeLoading(true)
    const World_Fun_Contract: any = {
      address: worldData.launch_contract,
      abi: WorldFunABI,
    }
    const promise = new Promise((resolve, reject) => {
      try {
        writeContract({
          ...World_Fun_Contract,
          functionName: 'contribute',
          args: [parseUnits(data.amount, 18)]
        }, {
          onSuccess: async (txHash: any) => {
            console.log("Transaction submitted successfully, txHash:", txHash);
            try {
              const receipt = await waitForTransactionReceipt(config, {
                hash: txHash,
              });
              console.log("Transaction receipt:", receipt);
              setContributeLoading(false)
              setRefresh(refresh + 1)
              resolve({
                txHash: receipt.transactionHash,
                blockNumber: receipt.blockNumber,
              });
            } catch (receiptError) {
              setContributeLoading(false)
              console.error("Failed to get transaction receipt:", receiptError);
              reject(receiptError);
            }
          },
          onError: (error: any) => {
            console.error('err', error)
            setContributeLoading(false)
            reject(error)
          }
        })
      } catch (err: any) {
        console.error("Caught error:", err);
        setContributeLoading(false)
        toaster.create({
          title: "Error",
          description: err.message.includes('User rejected the') ? 'User rejected the request.' : 'Something went wrong, please try again.',
          type: "error",
        });
      }
    })
    toaster.promise(promise, {
      loading: {
        title: "Transaction in Progress",
        description: "Submitting transaction to the network...",
      },
      success: () => ({
        title: "Transaction Confirmed",
        description: ``,
        isClosable: true,
      }),
      error: (err: any) => ({
        title: "Transaction Failed",
        description: err.message.includes('User rejected the') ? 'User rejected the request.' : 'Something went wrong, please try again.',
        isClosable: true,
      }),
    });
  })

  const renderFundraiseSection = () => (
    <Box width={{base:'100%',md:'446px'}}>
      <Flex justifyContent="flex-end" display={{base:'none',md:'flex'}} height={{base:'auto',md: 'auto'}} position="relative" mt={{ base: 6, md: 0 }} >
        <Image
          className="shark-tank-image"
          src="/aisharktank.jpg"
          alt="AI Shark Tank Scene"
          maxW="100%"
          w="100%"
          maxH={'309px'}
          borderRadius="10px"
          transition="filter 0.3s ease"
        />
        <Box
          className="enter-button"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
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
          onClick={() => {window.open('https://aishark.fun/', '_blank')}}
        >
          Enter World
        </Box>
      </Flex>
      <Box
        border="1px solid rgba(224, 224, 224, 0.2)"
        fontWeight={'light'}
        fontFamily={'DMMono'}
        px={{ base: 3, md: 6 }}
        py={{ base: 3, md: 8 }}
        borderRadius={'10px'}
        mt="30px"
        bg="#111"
      >
        <a 
          href="https://aerodrome.finance/swap?from=0x1b4617734c43f6159f3a70b7e06d883647512778&to=0xb69938b92ba1ab2a4078ddb3d5c3472faa13c162&chain0=8453&chain1=8453"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'inline-block', width: '100%' }}
        >
          <Flex alignItems={'center'} justify="space-between" gap={{ base: 1, md: 0 }}>
            <Box>
              <Heading
                display={'flex'}
                alignItems={'center'}
                gap={'4px'}
                as="h3"
                fontSize={{ base: "md", md: "xl" }}
                mb={1}
                fontWeight={'medium'}
                fontFamily={'DMMono'}
                color="#fff"
              >
                Swap for $SHARK
                <Image width={'34px'} h={'34px'} src="/logo_shark.svg" alt="token" />
              </Heading>
              <Text
                  fontFamily="DMMono"
                  fontSize="md"
                  color="#fff"
                  bg="transparent"
                  fontWeight={'light'}
                >
                  Buy more $SHARK through Aerodrome
              </Text>
            </Box>
            <Image width={'24px'} h={'24px'} src="/arrow_forward.svg" alt="token" />
          </Flex>
        </a>
        
      </Box>
      <Box border="1px solid rgba(224, 224, 224, 0.2)" fontWeight={'light'} fontFamily={'DMMono'} p={{ base: 3, md: 6 }} borderRadius={'10px'} mt='30px'>
        <Heading as="h3" fontSize={{ base: "md", md: "lg" }} mb={'32px'} fontWeight={'light'} fontFamily={'DMMono'}>
          {
            worldInfo[id].status === 'Ended' ? 'Launch Complete' : 'Fund This World'
          }
        </Heading>
        <Flex justify="space-between" gap={{ base: 1, md: 0 }}>
          <Text fontSize={{ base: "xs", md: "sm" }}>{numeral(totalRaised).format('0,0')} / {numeral(fundingGoal).format('0,0')} AWE</Text>
          <Text fontSize={{ base: "xs", md: "sm" }}>{totalRaised ? numeral(Number(totalRaised) / Number(fundingGoal) * 100).format('0,0') : 0}% </Text>
        </Flex>
        <Progress.Root size="xl" variant="subtle" mt={2} mb={'32px'} value={totalRaised ? Number(totalRaised) / Number(fundingGoal) * 100 : 0}>
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
        {remainingTime && <Flex mt={4} justify="space-between" gap={{ base: 2, md: 0 }} mb={'32px'}>
          <Text fontSize={{ base: "xs", md: "sm" }}>Whitelist Status</Text>
          <Status.Root size={{ base: "sm", md: "lg" }} colorPalette="green">
            {isConnected && worldData?.whitelisted ? <Icon size="sm" color="green"><FaRegCheckCircle /></Icon> : <Icon size="sm" color="white"><PiWarningCircle/></Icon> }
            {isConnected && worldData?.whitelisted ? <Text fontSize={{ base: "xs", md: "sm" }}>Approved</Text>: <Text fontSize={{ base: "xs", md: "sm" }}>Public</Text>}
          </Status.Root>
        </Flex>}
        <form onSubmit={handleContribute}>
          {remainingTime && <Box my={4} border="1px solid rgba(224, 224, 224, 0.2)" p={{ base: 3, md: 4 }} mb={'32px'} borderRadius={'10px'}>
            <Flex justify="space-between" gap={{ base: 1, md: 0 }}>
              <Text fontSize={{ base: "xs", md: "sm" }}>Commit AWE</Text>
              <Text fontSize={{ base: "xs", md: "sm" }}><span style={{ color: '#666' }}>Balance:</span> {numeral(aweBalance).format('0,0')}</Text>
            </Flex>
            <Flex justify="space-between">
              <Group >
                <Field.Root invalid={!!errors.amount}>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }: any) => (
                      <NumberInput.Root
                        disabled={field.disabled}
                        name={field.name}
                        max={Number(maxAmountPerAddress) - Number(contributionsAmount)}
                        value={field.value}
                        onValueChange={({ value }) => {
                          field.onChange(value)
                          setAmount(value)
                        }}
                      >
                        <NumberInput.Input border={'none!important'} outlineWidth={0} pl={0} maxW={'100px'} fontSize={'18px'} placeholder='0' onBlur={field.onBlur} />
                      </NumberInput.Root>
                    )}
                  />
                  <Field.ErrorText>{errors.amount?.message}</Field.ErrorText>
                </Field.Root>
                <Button borderRadius={'10px!important'} variant="ghost" fontSize={'18px'} color="#666" 
                  onClick={() => { 
                    setValue('amount', Number(aweBalance) > (Number(maxAmountPerAddress) - Number(contributionsAmount)) ? (Number(maxAmountPerAddress) - Number(contributionsAmount)).toString(): aweBalance) 
                    setAmount(Number(aweBalance) > (Number(maxAmountPerAddress) - Number(contributionsAmount)) ? (Number(maxAmountPerAddress) - Number(contributionsAmount)).toString(): aweBalance) 
                  }}>
                  Max
                </Button>
              </Group>
              <HStack>
                <Image src="/assets/awe.svg" alt="token" />
                <Text fontSize={{ base: "xs", md: "sm" }}>AWE</Text>
              </HStack>
            </Flex>
          </Box>}
          {
            worldInfo[id].status === 'Ended' ? <Box></Box> :
            <>
            <Flex justify="space-between" gap={{ base: 1, md: 0 }}>
              <Text fontSize={{ base: "xs", md: "sm" }}>Your Contribution</Text>
              <Text fontSize={{ base: "xs", md: "sm" }}>{numeral(Number(contributionsAmount)).format('0,0')}/{numeral(Number(maxAmountPerAddress)).format('0,0')}</Text>
            </Flex>
            <Flex justify="space-between" gap={{ base: 1, md: 0 }} mt={1} mb={!remainingTime && !isTradable ? 0 : '32px'}>
              <Text fontSize={{ base: "xs", md: "sm" }}>Estimated Allocation</Text>
                <Text fontSize={{ base: "xs", md: "sm" }}>{numeral(Number(worldData.estimated_allocation)).format('0,0')} SHARK</Text>
              </Flex>
            </>
          }
          {remainingTime && 
            <>{isConnected ? (
              Number(amountToApprove) < Number(amount) ?
                <Button
                  bg="rgba(55, 60, 62, 0.4)" color="#fff" size={{ base: "sm", md: "sm" }} w="full" fontSize={{ base: "xs", md: "sm" }}
                  loading={approveLoading}
                  loadingText="Approving"
                  className="approve-btn"
                  onClick={handleApprove}
                  disabled={!isTradable}
                >
                  Approve
                </Button>
                :
                <Button
                  bg="rgba(55, 60, 62, 0.4)" color="#fff" size={{ base: "sm", md: "sm" }} w="full" fontSize={{ base: "xs", md: "sm" }}
                  loading={contributeLoading}
                  type="submit"
                  disabled={!amount || Number(amount) > Number(maxAmountPerAddress) || !isTradable}
                >
                  {Number(amount) > Number(maxAmountPerAddress) ? 'Over max contribute' : 'Contribute'}
                </Button>
              ) :
                <Button bg="rgba(55, 60, 62, 0.4)" color="#fff" size={{ base: "sm", md: "sm" }} w="full" fontSize={{ base: "xs", md: "sm" }}
                  onClick={openConnectModal}
                >
                  Connect Wallet
                </Button>
            }</>
          }
        </form>
      </Box>
      <Box border="1px solid rgba(224, 224, 224, 0.2)" p={{ base: 3, md: 4 }} borderRadius={'10px'} mt={'30px'} fontWeight={'light'} fontFamily={'DMMono'}>
        <Stack gap={{ base: '8px', md: '8px' }}>
          {
            worldInfo[id].status === 'Ended' ? tokenPoolInfo() : renderContributeInfo()
          }
          {remainingTime && <Flex justify="space-between" border="1px solid rgba(224, 224, 224, 0.2)" borderRadius="8px" p={'20px 40px'} gap={{ base: 1, md: 0 }}>
            <Text fontSize={{ base: "xs", md: "sm" }}>Time Remaining</Text>
            <Text fontSize={{ base: "xs", md: "sm" }} color="#646E71">{remainingTime}</Text>
          </Flex>}
          {
            worldInfo[id].status === 'Ended' ?
            <Box></Box>:
            <Flex justify="space-between" border="1px solid rgba(224, 224, 224, 0.2)" borderRadius="8px" p={'20px 40px'} gap={{ base: 1, md: 0 }}>
              <Text fontSize={{ base: "xs", md: "sm" }}>AWE Remaining</Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color="#646E71">{Number(fundingGoal) - Number(totalRaised) > 0 ? numeral(Number(fundingGoal) - Number(totalRaised)).format('0,0') : 0}</Text>
            </Flex>
          }
        </Stack>
      </Box>
    </Box>
  );

  const renderContributeInfo = () => {
    return (
    <Grid display={'grid'} gridTemplateColumns="repeat(2, 1fr)" gap='8px'>
      <Flex flexDirection="column" border="1px solid rgba(224, 224, 224, 0.2)" borderRadius="8px" p={'20px 40px'} gap={{ base: 1, md: 0 }}>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center">Raised</Text>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center" color="#646E71">{numeral(totalRaised).format('0,0')} AWE</Text>
      </Flex>
      <Flex flexDirection="column" border="1px solid rgba(224, 224, 224, 0.2)" borderRadius="8px" p={'20px 40px'} gap={{ base: 1, md: 0 }}>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center">Team</Text>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center" color="#646E71">{worldData?.awe_for_team}</Text>
      </Flex>
      <Flex flexDirection="column" border="1px solid rgba(224, 224, 224, 0.2)" borderRadius="8px" p={'20px 40px'} gap={{ base: 1, md: 0 }}>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center">Launch MC</Text>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center" color="#646E71">{worldData?.launched_mc}</Text>
      </Flex>
      <Flex flexDirection="column" border="1px solid rgba(224, 224, 224, 0.2)" borderRadius="8px" p={'20px 40px'} gap={{ base: 1, md: 0 }}>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center">Presale MC</Text>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center" color="#646E71">{worldData?.presale_mc}</Text>
      </Flex>
      <Flex flexDirection="column" border="1px solid rgba(224, 224, 224, 0.2)" borderRadius="8px" p={'20px 40px'} gap={{ base: 1, md: 0 }}>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center">LP</Text>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center" color="#646E71">{worldData?.awe_for_lp}</Text>
      </Flex>
      <Flex flexDirection="column" border="1px solid rgba(224, 224, 224, 0.2)" borderRadius="8px" p={'20px 40px'} gap={{ base: 1, md: 0 }}>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center">Max Buy</Text>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center" color="#646E71">{numeral(maxAmountPerAddress).format('0,0')} AWE</Text>
      </Flex>
    </Grid>)
  }
  const tokenPoolInfo = () => {
    return (
      <Grid display={'grid'} gridTemplateColumns="repeat(2, 1fr)" gap='8px'>
      <Flex flexDirection="column" border="1px solid rgba(224, 224, 224, 0.2)" borderRadius="8px" p={'20px 40px'} gap={{ base: 1, md: 0 }}>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center">FDV</Text>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center" color="#646E71">${formatNumber(fdv,2)}</Text>
      </Flex>
      <Flex flexDirection="column" border="1px solid rgba(224, 224, 224, 0.2)" borderRadius="8px" p={'20px 40px'} gap={{ base: 1, md: 0 }}>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center">Liquidity</Text>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center" color="#646E71">${formatNumber(liquidity,1)}</Text>
      </Flex>
      <Flex flexDirection="column" border="1px solid rgba(224, 224, 224, 0.2)" borderRadius="8px" p={'20px 40px'} gap={{ base: 1, md: 0 }}>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center">Holders</Text>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center" color="#646E71">{holders > 0 ? formatNumber(holders, 0) : '--'}</Text>
      </Flex>
      <Flex flexDirection="column" border="1px solid rgba(224, 224, 224, 0.2)" borderRadius="8px" p={'20px 40px'} gap={{ base: 1, md: 0 }}>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center">24h Volume</Text>
        <Text fontSize={{ base: "xs", md: "sm" }} textAlign="center" color="#646E71">${formatNumber(volume24h,2)}</Text>
      </Flex>
      
    </Grid>
    )
  }
  const copyContract = (address: string) => {
    copyToClipboard(address)
    toaster.success({
      title: 'Copied to clipboard',
    })
  }
  const [fdv, setFdv] = useState(0)
  const [liquidity, setLiquidity] = useState(0)
  const [holders, setHolders] = useState(0)
  const [volume24h, setVolume24h] = useState(0)
  // 
  const getGeckoTerminalData = async () => {
    try {
      const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/base/tokens/0xb69938B92ba1ab2a4078DDb3d5c3472faa13C162`, {
        headers: {
          'Accept': 'application/json;version=20230302'
        }
      })
      const data = await response.json()
      if (data.data?.attributes?.fdv_usd) {
        setFdv(data.data.attributes.fdv_usd)
      }
    } catch (error) {
      console.error('Error fetching GeckoTerminal data:', error)
    }
  }
  const getPoolData = async () => {
    try {
      const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/base/pools/0x05b1d072fff9e8f9b3ac55cf7367bb1526aa0e0a?include=base_token,token_info,quote_token,dex`, {
        headers: {
          'Accept': 'application/json;version=20230302'
        }
      })
      const data = await response.json()
      setLiquidity(data.data.attributes.reserve_in_usd)
      setVolume24h(data.data.attributes.volume_usd.h24)
    } catch (error) {
      console.error('Error fetching pool data:', error)
    }
  }
  const getTokenData = async () => {
    try {
      const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/base/tokens/0xb69938B92ba1ab2a4078DDb3d5c3472faa13C162/info`, {
        headers: {
          'Accept': 'application/json;version=20230302'
        }
      })
      const data = await response.json()
      if (data.data?.attributes?.holders?.count) {
        setHolders(data.data.attributes.holders.count)
        console.log('Holders count:', data.data.attributes.holders.count)
      } else {
        console.log('No holders data found in response:', data)
      }
    } catch (error) {
      console.error('Error fetching token data:', error)
    }
  }
  
  useEffect(() => {
    getTokenData()
    getPoolData()
    getGeckoTerminalData()
  }, [])

  return (
    <Box pb={{ base: 12, md: 0 }} >
      <Header />
      <Box display={{ base: 'none', md: 'block' }}>
        <Sidebar />
      </Box>
      <Box as="main" ml={{ base: 0, md: '72px' }} px={{ base: 3, md: '60px' }} py={{ base: 5, md: 8 }} bg={bgColor} color={color} minH="calc(100vh - 60px)">
        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: 'repeat(3, 1fr)' }} gap={{ base: 4, md: 6 }}>
          {
            ((isMobile && mobileTab === 'info') || !isMobile) &&
            <GridItem colSpan={{ base: 1, md: 2 }} minW={{base:'100%', md:'740px'}}>
              <Flex
                justifyContent={{ base: 'flex-start', md: 'space-between' }}
                flexDirection={{ base: 'column', md: 'row' }}
                gap={{ base: 4, md: 0 }}
                alignItems={{ base: 'flex-start', md: 'center' }}
              >
                <Flex
                  gap={{ base: 3, md: 4 }}
                  flexDirection={{ base: 'row', md: 'row' }}
                  alignItems={{ base: 'flex-start', md: 'center' }}
                  width={{ base: '100%', md: 'auto' }}
                >
                  <Image
                    width={{ base: '56px', md: '80px' }}
                    height={{ base: '56px', md: '80px' }}
                    src={worldInfo[id].logo}
                    alt="AI Shark Tank Scene"
                  />
                  <Box>
                    <Heading
                      as="h2"
                      fontSize={{ base: "lg", md: "3xl" }}
                      fontFamily={'BDO Grotesk'}
                      lineHeight={{ base: "1.2", md: "1.3" }}
                    >
                      AI Shark Tank
                    </Heading>
                    <Flex
                      gap={{ base: 2, md: 3 }}
                      alignItems={'center'}
                      mt={2}
                      flexWrap={{ base: 'wrap', md: 'nowrap' }}
                    >
                      <Box
                        as="button"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        border="1px solid #646E71"
                        borderRadius="6px"
                        px={2}
                        py={1}
                        fontFamily="DMMono"
                        fontSize="xs"
                        color="#646E71"
                        bg="transparent"
                        transition="border 0.2s"
                        cursor="pointer"
                        minW={{ base: "120px", md: "165px" }}
                        maxW={{ base: "180px", md: "320px" }}
                        mb={{ base: 1, md: 0 }}
                      >
                        {worldInfo[id].token?abbrTxHash(worldInfo[id].token):'--'}
                        <Image src="/copy.svg" alt="token" onClick={() => copyContract(worldInfo[id].token)} />
                      </Box>
                      <Box
                        as="button"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        border="1px solid #646E71"
                        borderRadius="6px"
                        px={2}
                        py={1}
                        fontFamily="DMMono"
                        fontSize="xs"
                        color="#646E71"
                        bg="transparent"
                        transition="border 0.2s"
                        cursor="pointer"
                        mb={{ base: 1, md: 0 }}
                      >
                        {worldInfo[id].type}
                      </Box>
                      <Box
                        width={{ base: '22px', md: '26px' }}
                        height={{ base: '22px', md: '26px' }}
                        border="1px solid #646E71"
                        borderRadius="50%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mr={{ base: 0, md: 0 }}
                        mb={{ base: 1, md: 0 }}
                      >
                        <Link href={worldInfo[id].x} target="_blank">
                          <Image src="/assets/X.svg" alt='x' width="100%" height="100%" />
                        </Link>
                      </Box>
                      <Box
                        border="1px solid #646E71"
                        borderRadius="50%"
                        width={{ base: '22px', md: '26px' }}
                        height={{ base: '22px', md: '26px' }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Link href={worldInfo[id].doc} target="_blank">
                          <Image width="100%" height="100%" src="/assets/Gitbook.svg" alt='gitbook' />
                        </Link>
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
                <Flex
                  gap={{ base: 4, md: 6 }}
                  flexDirection={{ base: 'row', md: 'row' }}
                  width={{ base: '100%', md: 'auto' }}
                  justifyContent={{ base: 'space-between', md: 'flex-end' }}
                >
                  <Box textAlign={'center'}>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="#646E71">FDV</Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="#80C838">${formatNumber(fdv,2)}</Text>
                  </Box>
                  <Box>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="#646E71">Created On</Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="#80C838">{worldInfo[id].createdOn}</Text>
                  </Box>
                </Flex>
              </Flex>
              <Box width={'100%'} height={'470px'} mt={{base: 2, md: 10}}>
                <iframe height="100%" width="100%" id="geckoterminal-embed" title="GeckoTerminal Embed" src="https://www.geckoterminal.com/base/pools/0x05b1d072fff9e8f9b3ac55cf7367bb1526aa0e0a?embed=1&info=0&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=15m" frameBorder="0" allow="clipboard-write" allowFullScreen></iframe>
              </Box>
              <Box height={{base:'auto',md:'309px'}} mt={16}  mb={4}>
                <Heading as="h2" fontSize={{ base: "xl", md: "3xl" }} fontFamily={'DMMono'} lineHeight={{ base: "1.2", md: "1.3" }} mb={6}>
                World Overview
                </Heading>
                {/* <Text fontSize={{ base: "xs", md: "sm" }} color="#80C838" fontFamily={'DMMono'} mt={{ base: 1, md: 2 }} mb={{ base: 3, md: 4 }}>
                Launch Date: {moment(Number('1751374800')*1000).format('YYYY-MM-DD HH:mm:ss')}
                </Text> */}
                {
                  isMobile && <Flex justifyContent="flex-end" height={{base:'auto',md:'309px'}} position="relative" my="4">
                    <Image
                      className="shark-tank-image"
                      src="/aisharktank.jpg"
                      alt="AI Shark Tank Scene"
                      maxW="100%"
                      w="100%"
                      maxH={'309px'}
                      borderRadius="md"
                      transition="filter 0.3s ease"
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
                      onClick={() => {window.open('https://aishark.fun/', '_blank')}}
                    >
                      Enter World
                    </Box>
                  </Flex>
                }
                <Text fontSize={{ base: "xs", md: "md" }} fontWeight={'light'} fontFamily={'DMMono'} mt={{ base: 1, md: 2 }} mb={{ base: 3, md: 4 }} lineHeight={{ base: "1.4", md: "1.5" }}>
                  AI Shark Tank is a livestreamed, AI-native pitch show where real founders present to AI judges trained on top Web3 investors. Judges evaluate pitches in real time and post onchain verdicts.
                </Text>
                <Text fontSize={{ base: "xs", md: "md" }} fontWeight={'light'} fontFamily={'DMMono'} lineHeight={{ base: "1.4", md: "1.5" }}>
                  The AI Shark Tank app lets users talk to judges, submit ideas, vote on projects, and predict outcomes. The $SHARK token powers participation, rewards, and influence across the experience.
                </Text>
              </Box>
              {isMobile &&
                (worldInfo[id].status === 'Ended' ? tokenPoolInfo():renderContributeInfo())
              }
              <Tabs.Root value={activeTab} onValueChange={(details) => setActiveTab(details.value)} variant="plain" mt='30px'>
                <Tabs.List
                  fontFamily="DMMono"
                  rounded="l3"
                  gap={{ base: 0, md: 2 }}
                  display={{base:'inline-flex', md:'flex'}}
                  width={{base:'auto',md:'100%'}}
                  overflowX={{base:'auto',md:'inherit'}}
                  overflowY={{base:'hidden', md:'inherit'}}
                  borderRadius={'none'}
                  css={{
                    '&::-webkit-scrollbar': {
                      height: '0px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#646E71',
                      borderRadius: '0px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#80C838',
                    },
                  }}
                >
                  <Tabs.Trigger flex={{base:'',md:'1'}} flexShrink={'0'} justifyContent={'space-between'} bg={activeTab === 'team' ? "" : "#373C3E66"} value="team" border={'1px solid #413e3e'} borderLeft={{base:'none',md:'1px solid #413e3e'}} borderRadius={{base:'0px',md:'8px'}} fontSize={{ base: "2xs", md: "sm" }} p={{ base: 3, md: 3 }} textAlign={{ base: "center", md: "left" }}>
                    TEAM OVERVIEW <Text display={{base:'none',md:'block'}}>{activeTab === 'team' ? '-' : '+'}</Text>
                  </Tabs.Trigger>
                  <Tabs.Trigger flex={{base:'',md:'1'}} flexShrink={'0'} justifyContent={'space-between'} bg={activeTab === 'projects' ? "" : "#373C3E66"} value="projects" border={'1px solid #413e3e'} borderLeft={{base:'none',md:'1px solid #413e3e'}} borderRadius={{base:'0px',md:'8px'}} fontSize={{ base: "2xs", md: "sm" }} p={{ base: 3, md: 3 }} textAlign={{ base: "center", md: "left" }}>
                    PROJECT DETAILS <Text display={{base:'none',md:'block'}}>{activeTab === 'projects' ? '-' : '+'}</Text>
                  </Tabs.Trigger>
                  <Tabs.Trigger flex={{base:'',md:'1'}} flexShrink={'0'} justifyContent={'space-between'} bg={activeTab === 'tokennomics' ? "" : "#373C3E66"} value="tokennomics" border={'1px solid #413e3e'} borderLeft={{base:'none',md:'1px solid #413e3e'}} borderRadius={{base:'0px',md:'8px'}} fontSize={{ base: "2xs", md: "sm" }} p={{ base: 3, md: 3 }} textAlign={{ base: "center", md: "left" }}>
                    TOKENOMICS <Text display={{base:'none',md:'block'}}>{activeTab === 'tokennomics' ? '-' : '+'}</Text>
                  </Tabs.Trigger>
                  <Tabs.Trigger flex={{base:'',md:'1'}} flexShrink={'0'} justifyContent={'space-between'} bg={activeTab === 'schedule' ? "" : "#373C3E66"} value="schedule" border={'1px solid #413e3e'} borderLeft={{base:'none',md:'1px solid #413e3e'}} borderRadius={{base:'0px',md:'8px'}} fontSize={{ base: "2xs", md: "sm" }} p={{ base: 3, md: 3 }} textAlign={{ base: "center", md: "left" }}>
                    VESTING SCHEDULE <Text display={{base:'none',md:'block'}}>{activeTab === 'schedule' ? '-' : '+'}</Text>
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="team" border={'1px solid #413e3e'} px={{ base: 2, md: 6 }} py={{ base: 3, md: 7 }} mt={3} borderRadius={'lg'}>
                  <OurTeam />
                </Tabs.Content>
                <Tabs.Content value="projects" border={'1px solid #413e3e'} px={{ base: 2, md: 6 }} py={{ base: 3, md: 7 }} mt={3} borderRadius={'lg'}>
                  <Overview />
                </Tabs.Content>
                <Tabs.Content value="tokennomics" border={'1px solid #413e3e'} px={{ base: 2, md: 6 }} py={{ base: 3, md: 7 }} mt={3} borderRadius={'lg'}>
                  <ChartOverview data={worldData?.tokenomics} />
                </Tabs.Content>
                <Tabs.Content value="schedule" border={'1px solid #413e3e'} px={{ base: 2, md: 6 }} py={{ base: 3, md: 7 }} mt={3} borderRadius={'lg'}>
                  <ChartSchedule data={worldData} />
                </Tabs.Content>
              </Tabs.Root>
            </GridItem>
          }
          {
            ((isMobile && mobileTab === 'fundraise') || !isMobile) &&
            <GridItem colSpan={1}>
              {renderFundraiseSection()}
            </GridItem>
          }
        </Grid>
      </Box>
      <Box display={{ base: 'block', md: 'none' }} position="fixed" left={0} bottom={0} width="100%" zIndex={1000} bg="#232323" overflow="hidden">
        <Flex fontFamily={'BDO Grotesk'}>
          <Button
            height={'48px'}
            borderRadius={0}
            bg={mobileTab === 'info' ? '#4B5E2E' : 'transparent'}
            color={mobileTab === 'info' ? '#FCFCFC' : '#fff'}
            fontWeight={mobileTab === 'info' ? 400 : 400}
            onClick={() => setMobileTab('info')}
            flex={1}
          >
            Info
          </Button>
          <Button
            height={'48px'}
            borderRadius={0}
            bg={mobileTab === 'fundraise' ? '#80C8385C' : 'transparent'}
            color={mobileTab === 'fundraise' ? '#FCFCFC' : '#fff'}
            fontWeight={mobileTab === 'fundraise' ? 400 : 400}
            onClick={() => setMobileTab('fundraise')}
            flex={1}
          >
            Fundraise
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
