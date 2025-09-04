import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ConnectButton,useAccountModal } from '@rainbow-me/rainbowkit';
import numeral from 'numeral';
import { useAccount } from 'wagmi';
import { Box, Text, HStack, Menu, Flex, Button, VStack, Portal } from '@chakra-ui/react';
import RulesModal from '@/components/RulesModal';
import { useUserInfo, useBaseUserInfo } from '@/hooks';

interface DropdownMenuProps {
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDropdownOpen: boolean;
}
export default function DropdownMenu({ setIsDropdownOpen, isDropdownOpen }: DropdownMenuProps) {
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const [points, setPoints] = useState(0);
  const [nickname, setNickname] = useState<string | undefined>();
  const [avatar, setAvatar] = useState<string | undefined>();
  const user = useUserInfo(address);
  const { openAccountModal } = useAccountModal();
  const shortenedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  useEffect(() => {
    setPoints((user?.points || 0));
    setNickname(user?.nickname);
    setAvatar(user?.avatar);
  }, [user?.points, user?.nickname, user?.avatar]);



  return (
    <Box position="relative">
      <RulesModal isOpen={ruleModalOpen} onClose={() => setRuleModalOpen(false)} />
      {isConnected ? (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="outline" size="sm" px={3}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transition: 'transform 0.2s' }}
              >
                <path
                  d="M8.91381 10.2667C8.45691 10.8 7.54309 10.8 7.08619 10.2667L4.23053 6.93332C3.66576 6.27409 4.20306 5.33332 5.14434 5.33332L10.8557 5.33332C11.7969 5.33332 12.3342 6.27409 11.7695 6.93332L8.91381 10.2667Z"
                  fill="#ffffff"
                />
              </svg>
              <HStack gap={2}>
                {avatar && <Image src={avatar} width={16} height={16} alt="avatar" className="rounded-full" />}
                <Text>{nickname || shortenedAddress}</Text>
              </HStack>
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                bg="rgba(5, 6, 9, 0.8)"
                backdropFilter="blur(34px)"
                border="2px solid transparent"
                borderRadius="10px"
                className="gradient_border"
                minW="52"
                zIndex={99}
                p={4}
              >
                <Flex justify="space-between" w="100%" mb={2}>
                  <Text color="#99A5A8" fontSize="13px">World Points </Text>
                  <Button
                    variant="ghost"
                    color="#99A5A8"
                    fontSize="13px"
                    p={0}
                    h="20px"
                    fontWeight={350}
                    _hover={{ bg: 'none' }}
                    onClick={() => setRuleModalOpen(true)}
                  >
                    <Image src="/assets/ruleIcon.svg" width={10} height={12} alt="Rule" />
                    Rules
                  </Button>
                </Flex>
                <HStack>
                  <Image src="/assets/coin.svg" width={16} height={16} alt="world" />
                  <Text fontWeight={800} fontSize="18px" color="white">{numeral(points).format('0,0')}</Text>
                </HStack>
                <Button
                  bg="transparent"
                  color="#828B8D"
                  fontSize="14px"
                  w="100%"
                  fontWeight={350}
                  borderRadius="full"
                  _hover={{ bg: 'rgba(183, 234, 223, 0.2)', color: 'white' }}
                  onClick={openAccountModal}
                >
                  Sign Out
                </Button>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ) : (
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus || authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        style={{
                          borderRadius: 10,
                          border: '1px solid #656565',
                          padding: '0px 20px',
                          height: 40,
                          lineHeight: '38px',
                          cursor: 'pointer',
                          background: '#373C3E66'
                        }}
                        onClick={openConnectModal}
                        type="button"
                      >
                         CONNECT
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                      >
                        Wrong network
                      </button>
                    );
                  }

                  return null;
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      )}
    </Box>
  );
}