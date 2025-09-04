import { Dialog, Box, Text, Image } from '@chakra-ui/react';

interface PcModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PcModal = ({ isOpen, onClose }: PcModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Content
        bg="rgba(5, 6, 9, 0.8)"
        color="white"
        className="gradient_border_3"
        borderRadius="lg"
        backdropFilter="blur(30px)"
        p={0}
        maxW={{ base: 'xs', md: 'xs' }}
      >
        <Box p={0}>
          <Image src="/pc.png" width="full" alt="PC" />
          <Text color="#fff" p={6} fontSize="14px" textAlign="center">
            Please access on PC for better user experience.
          </Text>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default PcModal;