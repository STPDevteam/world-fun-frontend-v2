import {
  Dialog,
  CloseButton,
  Text,
  DataList,
  Portal,
  Box,
} from '@chakra-ui/react';

const RulesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog.Root open={isOpen} size={{ base: 'sm', md: 'sm' }}>
      <Portal>
        <Dialog.Backdrop
          style={{
            backdropFilter: 'blur(1px)',
            background: 'rgba(10, 10, 10, 0.65)',
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
          }}
        />
        <Dialog.Positioner
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1500,
          }}
        >
          <Dialog.Content
            bg="rgba(5, 6, 9, 0.92)"
            color="white"
            className="gradient_border_3"
            rounded="2xl"
            boxShadow="2xl"
            p={0}
            width="380px"
            maxH="90vh"
            overflow="auto"
            position="relative"
          >
            <Dialog.Header p={4} fontSize="lg" fontWeight="bold" textAlign="center">
              Point Rules
            </Dialog.Header>
            <CloseButton color="white" onClick={onClose} position="absolute" top={3} right={3} />
            <hr />
            <Dialog.Body p={6}>
              <DataList.Root>
                <DataList.Item py={2} color="#fff" fontSize="13px">
                  <Box>
                    • Platform engagement rewards that apply across all worlds: <Text as="span" fontWeight={700} color="#B7EADF">10 World Points</Text>
                  </Box>
                </DataList.Item>
                <DataList.Item py={2} color="#fff" fontSize="13px">
                  <Box>
                    • Crowdfunding Participation: <Text as="span" fontWeight={700} color="#B7EADF">50 World Points per AWE commitment</Text>
                  </Box>
                </DataList.Item>
                <DataList.Item py={2} color="#fff" fontSize="13px">
                  <Box>
                    • Tipping Agents: <Text as="span" fontWeight={700} color="#B7EADF">40 World Points per AWE tip</Text>
                  </Box>
                </DataList.Item>
              </DataList.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default RulesModal;