import React, { useState } from 'react'
import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
// import AITownDrawer from '@/components/AITownDrawer';
import styles from './styles.module.css'

export default function Sidebar({worldDetail}: any) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Control modal display
    const router = useRouter();
    
    return (
        <>
            {/* <AITownDrawer world={worldDetail} isOpen={isDrawerOpen} onClose={() => {setIsDrawerOpen(false)}}/> */}
            <Flex justify="space-between" py="40px" direction="column" alignItems="center" onClick={() => {setIsDrawerOpen(true)}} cursor="pointer" bg="#050609" borderRadius="0 14px 14px 0" w="60px" height="100%" position="fixed" top="0" left="0" zIndex={1000}>
                <Image src="/assets/logo.svg" alt="point" width={29} height={29} onClick={(e) => {router.push('/'); e.stopPropagation()}}/>
                <Box className={styles.vBar}><Image src="/arrow.svg" alt="arrow" width={10} height={10} style={{ transform: isDrawerOpen ? 'rotate(270deg)' : 'rotate(90deg)'}}/></Box>
                <Image src="/wallet.svg" alt="wallet" width={24} height={24}/>
            </Flex>
        </>
    )
}
