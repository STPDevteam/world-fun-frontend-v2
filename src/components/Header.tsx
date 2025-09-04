'use client';

import { useEffect, useState } from 'react';
import { Box, Flex, Text, Button, Image, IconButton } from '@chakra-ui/react';
import { Toaster } from "@/components/ui/toaster"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useColorModeValue } from "@/components/ui/color-mode"
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCopy } from "react-icons/io";
import { ColorModeButton } from "@/components/ui/color-mode"
import DropdownMenu from "@/components/DropdownMenu"
import LaunchWorld from '@/components/LaunchWorld';
import { useAccount } from 'wagmi';
import { ConnectButton, useConnectModal, useAccountModal } from '@rainbow-me/rainbowkit';

export function Header() {
  const bgColor = useColorModeValue('white', 'black');
  const color = useColorModeValue('black', '#E0E0E0');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLaunchWorldOpen, setIsLaunchWorldOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const menuItems = [
    { label: 'DISCOVER WORLDS', href: '/discover' },
    { label: 'HOW IT WORKS', href: '/about' },
    { label: 'LAUNCH NEW WORLD', href: '' },
  ];

  useEffect(() => {
    if(localStorage.getItem('Address') !== address){
      localStorage.setItem('Address', address ? address : '')
    }
  }, [address])

  const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
      setIsMenuOpen(false);
  };

  const handleLaunchWorld = () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    setIsLaunchWorldOpen(true);
  };

  return (
    <Box 
      ml={{ base: 0, md: "72px" }} 
      as="header" 
      bg={bgColor} 
      p={4} 
      px={{ base: 4, md: '60px' }} 
      color={color} 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center"
      position="relative"
    >
      {isLaunchWorldOpen && <LaunchWorld onClose={() => {setIsLaunchWorldOpen(false)}} />}
      <Toaster/>
      <Link href="/" style={{height: '40px', display:'flex', justifyContent:'center', alignItems: 'center'}}>
        <Image src="/assets/logo.svg" height={{base: '18px', md: '20px'}} alt="Logo"/>
      </Link>
      {/* Desktop menu */}
      <Flex gap={6} display={{ base: 'none', md: 'flex' }} fontFamily={'DMMono'} height={'40px'} alignItems={'center'}>
        {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const content = (
              <Text 
                  key={item.label} 
                  color={color}
                  borderBottom={isActive ? '1px solid' : 'none'}
                  borderBottomColor={color}
                  borderRadius="0"
                  mx={2}
                  p={0}
                  fontSize={'13px'}
                  letterSpacing={'0.08rem'}
                  _hover={{
                      borderBottom: '1px solid',
                      borderBottomColor: '#E0E0E0'
                  }}
              >
                  {item.label}
              </Text>
            );

            return item.href ? (
              <Link href={item.href} key={item.label}>
                {content}
              </Link>
            ) : (
              <Button
                key={item.label}
                variant="ghost"
                p={0}
                h="auto"
                minW="auto"
                onClick={handleLaunchWorld}
              >
                {content}
              </Button>
            );
        })}
        <DropdownMenu
          setIsDropdownOpen={setIsDropdownOpen}
          isDropdownOpen={isDropdownOpen}
        />
      </Flex>
      {/* Mobile menu icon */}
        <Flex display={{ base: 'flex', md: 'none' }}>
        <DropdownMenu
          setIsDropdownOpen={setIsDropdownOpen}
          isDropdownOpen={isDropdownOpen}
        />
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          height={'30px'}
          variant="ghost"
          color={color}
          onClick={toggleMenu}
          aria-label="Open menu"
        >
          <GiHamburgerMenu/>
        </IconButton>
      </Flex>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
          <Box
              position="fixed"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="rgba(0, 0, 0, 0.5)"
              zIndex={1000}
              onClick={closeMenu}
          />
      )}

      {/* Mobile side menu */}
      <Box
          position="fixed"
          top="0"
          right="0"
          bottom="0"
          width="280px"
          bg={bgColor}
          color={color}
          zIndex={1001}
          transform={isMenuOpen ? 'translateX(0)' : 'translateX(100%)'}
          transition="transform 0.3s ease-in-out"
          boxShadow="lg"
          p={6}
      >
          <Flex direction="column" h="100%">
              <Flex justify="space-between" align="center" mb={8}>
                  <Box fontSize="lg" fontWeight="bold" fontFamily={'DMMono'}></Box>
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeMenu}
                      color={color}
                  >
                      ✕
                  </Button>
              </Flex>
              
              <Flex direction="column" gap={4} flex={1}>
                  {menuItems.map((item) => {
                      const isActive = pathname === item.href;
                      return  item.href ? (
                        <Link href={item.href} key={item.label}>
                          <Button 
                              key={item.label} 
                              variant="ghost" 
                              color={color}
                              justifyContent="flex-start"
                              onClick={closeMenu}
                              size="sm"
                              fontFamily={'DMMono'}
                              fontWeight={400}
                              letterSpacing={'-0.03rem'}
                              borderBottom={isActive ? '1px solid' : 'none'}
                              borderBottomColor={color}
                              borderRadius="0"
                              p={0}
                              _hover={{
                                  borderBottom: '1px solid',
                                  borderBottomColor: '#E0E0E0'
                              }}
                          >
                              {item.label}
                          </Button>
                        </Link>
                      ):(
                        <Button 
                              key={item.label} 
                              variant="ghost" 
                              color={color}
                              justifyContent="flex-start"
                              onClick={() => { setIsLaunchWorldOpen(true) }}
                              size="sm"
                              fontFamily={'DMMono'}
                              fontWeight={400}
                              letterSpacing={'-0.03rem'}
                              borderBottom={isActive ? '1px solid' : 'none'}
                              borderBottomColor={color}
                              borderRadius="0"
                              p={0}
                              _hover={{
                                  borderBottom: '1px solid',
                                  borderBottomColor: '#E0E0E0'
                              }}
                          >
                              {item.label}
                          </Button>
                      );
                  })}
              </Flex>


              <Box width={'100%'}>
                <Flex justifyContent={'space-between'}>
                    <ColorModeButton/>
                    <Link href="https://docs.google.com/document/d/12DZM9ufxZo5VvP12Fs51mTg_dqM7DVTO-8cK8EPoZgc/edit?usp=sharing" target="_blank">
                      <Image src="/assets/Gitbook.svg" alt=''/>
                    </Link>
                    <Link href="https://x.com/awenetwork_ai" target="_blank">
                      <Image src="/assets/X.svg"  alt=''/>
                    </Link>
                    <Link href="https://www.awenetwork.ai/terms-of-service" target="_blank">
                      <Image width={'32px'} src="/tos.svg" alt=''/>
                    </Link>
                </Flex>
                {/* <Button
                  variant="outline"
                  width={'100%'}
                  mt={5}
                  color="white"
                  _hover={{ bg: 'gray.700' }}
                  onClick={handleWalletClick}
                  disabled={!ready}
                  fontFamily={'DMMono'}
                  textTransform={'uppercase'}
                  fontSize={'13px'}
                >
                  {authenticated ? shortenedAddress : 'Connect'}
                </Button> */}
              </Box>
              
          </Flex>
      </Box>
    </Box>
  );
}