import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from 'next/image';

const MotionNextImage = motion(Image);

export const WorldFunMapLoading = ({ onCompleted }: { onCompleted: (progress: number) => void }) => {
  const [dimensions, setDimensions] = useState({ h: 0, maxW: 0 });
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Calculate dimensions client-side
    const calculateDimensions = () => {
      const h = 0.351595 * window.innerWidth > 661 ? 661 : 0.351595 * window.innerWidth;
      const maxW = h / 0.56933;
      setDimensions({ h, maxW });
    };

    calculateDimensions(); // Initial calculation
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  useEffect(() => {
    let start = 0;
    const duration = 15000;
    const interval = 100;
    const step = interval / duration;
    const timer = setInterval(() => {
      start += step;
      setLoadingProgress(start);
      if (start >= 1) {
        clearInterval(timer);
        setLoadingProgress(1);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    onCompleted(loadingProgress);
  }, [loadingProgress, onCompleted]);

  const welcomeText = () => (
    <Box maxW="700px" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <Text
        fontWeight={400}
        color="#838B8D"
        fontSize={['20px', '20px', '20px', '24px', '28px', '32px']}
      >
        Genesis AI Town
      </Text>
      <Box
        my={['30px', '30px', '30px', '42px', '48px', '60px']}
        fontWeight={350}
        fontSize={['14px', '14px', '14px', '14px', '14px', '16px']}
        color="#838B8D"
      >
        <p>
          <span>
            Welcome to Genesis AI Town, the first multi-agent simulation launching on World.Fun
            autonomous world launchpad, featuring 100 live agents living, evolving and socializing in a
            world of endless possibilities.
          </span>
        </p>
      </Box>
    </Box>
  );

  // Show loading state if dimensions are not yet calculated
  if (dimensions.h === 0) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box className="w-full h-full flex-row justify-end" bgColor="#000">
      <Box
        className="h-full"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
        ml="60px"
      >
        {loadingProgress === 1 ? null : (
          <Box
            className=""
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
          >
            {welcomeText()}
            <Box px={['20px', '20px', '30px', '40px', '80px']} className="flex items-center justify-center w-full">
              <Box w={dimensions.maxW}>
                <MotionNextImage
                  src="/AITown/running.gif"
                  width={37}
                  height={50}
                  alt="running"
                  animate={{ x: `${loadingProgress * dimensions.maxW}px` }}
                  transition={{ duration: 0.5, ease: 'linear' }}
                />
                <Box h="10px" mt="10px" borderRadius="12px" bgColor="rgba(217, 217, 217, 0.15)" w={dimensions.maxW}>
                  <Box
                    w={`${loadingProgress * 100}%`}
                    h="10px"
                    bgColor="#838B8D"
                    borderRadius="12px"
                    transition="width 0.1s linear"
                  />
                </Box>
                <Box className="flex-row items-center justify-between" mt="8px">
                  <Text className="text-[#E0E0E0]" fontSize="20px">
                    Loading...
                  </Text>
                  <Text className="text-[#E0E0E0]" fontSize="20px">{`${Math.round(loadingProgress * 100)} %`}</Text>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};