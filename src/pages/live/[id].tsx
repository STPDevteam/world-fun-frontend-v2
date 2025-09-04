import { useState, useEffect} from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import PcModal from '@/components/PcModal';
import WorldSidebar from '@/components/WorldSidebar';
import { WorldFunMapLoading } from '@/components/WorldFunMapLoading'
import { useWorldDetail } from '@/hooks';

interface LivePageProps {
  id: string;
  // Add other static data as needed
}

export default function Live({ id }: LivePageProps) {
  const router = useRouter();

  // If id is not defined in getStaticPaths, fallback to router.query
  const world = id || (typeof router.query.id === 'string' ? router.query.id : 'unknown');
  const isMobile = useBreakpointValue({  md: false, base: true }); // Mobile is true, desktop is false
  const [isPcModalOpen, setIsPcModalOpen] = useState(false); // Control modal display
  const [isIframeReady, setIsIframeReady] = useState(false); // Control if iframe is ready
  const worldDetail = useWorldDetail(world)    

  // Preload iframe content
  useEffect(() => {
    if(world){
      // Use link tag to preload iframe src
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = world === 'SHARKTANK' ? 'https://aisharktank.fun/app?section=simulation&episode=latest':'https://test.world.fun';
      link.as = 'document';
      document.head.appendChild(link);
      if(world === 'SHARKTANK'){
        setIsIframeReady(true);
      }

      // Timeout mechanism: consider iframe ready after 5 seconds
      const timeout = setTimeout(() => {
        console.log('iframe preload timeout, force display');
        setIsIframeReady(true);
      }, 10000); // 5 second timeout
      return () => {
        clearTimeout(timeout);
        document.head.removeChild(link);
      };
    }
  }, [world]);

  useEffect(() => {
    if(isMobile){
      setIsPcModalOpen(true)
    }
  }, [isMobile])

  return (
    <Box
      minH="100vh"
      w="100%"
      h="100%"
      bgImage={world === 'AITOWN' ? "url(/liveBg.png)" :'none'}
      position="relative"
      bgSize="cover"
      py={{md: 6, base: 0}}
      pl='70px'
    >
      {world === 'AITOWN' && 
        <PcModal isOpen={isPcModalOpen} onClose={() => {setIsPcModalOpen(false)}}/>
      }
      <WorldSidebar worldDetail={worldDetail} />
      {/* Main iframe */}

      <Box
         position="absolute"
         top="0"
         left="0"
         zIndex={9}
         width="100%"
         height="100%"
      >
        { !isIframeReady && world === 'AITOWN' && <WorldFunMapLoading onCompleted={(p: any) => setIsIframeReady(p === 1)}/>}
      
        <iframe
          src={world === 'SHARKTANK' ? 'https://aisharktank.fun/app?section=simulation&episode=latest':'https://test.world.fun' }
          data-paused="false"
          width="100%"
          height="100%"
          // sandbox="allow-scripts allow-same-origin"
          style={{opacity: isIframeReady ? 1 : 0, border: 'none', transition: 'opacity 0.3s ease' }}// Show when ready
        />
      
      </Box>
    </Box>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = ['AITOWN','SHARKTANK', 'MARSX'];

  const paths = ids.map((id) => ({
    params: { id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<LivePageProps> = async ({ params }) => {
  const id = params?.id as string;

  const data = {
    id,
  };

  return {
    props: {
      id,
    },
  };
};