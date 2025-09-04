import {
  Dialog,
  Table,
  Text,
  Box,
  HStack,
} from '@chakra-ui/react';
import moment from 'moment';

const ActionDetailModal = ({ isOpen, onClose, owner, actions }: any) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()} size={{ md: 'md', base: 'sm' }}>
      <Dialog.Backdrop />
      <Dialog.Content
        bg="linear-gradient(154.57deg, rgba(23, 33, 42, 0.5) 10.36%, rgba(142, 99, 55, 0.15) 51.14%, rgba(16, 42, 65, 0.5) 102.91%)"
        backdropFilter="blur(54px)"
        className="gradient_border_4"
        borderRadius="lg"
        color="white"
      >
        <Dialog.Header>
          <HStack gap={1} alignItems="center">
            <Text as="span" color="rgba(255, 255, 255, 0.5)" fontFamily="Office Times Round" fontSize="14px">
              Owner &gt;&gt;&gt;
            </Text>
            <Text as="span" color="#fff" fontSize="14px" fontWeight={700}>
              {owner}
            </Text>
          </HStack>
        </Dialog.Header>
        <Dialog.CloseTrigger color="white" />
        <Dialog.Body p={0}>
          <Table.Root>
            <Table.Header bg="rgba(0, 0, 0, 0.4)">
              <Table.Row>
                <Table.ColumnHeader fontFamily="Office Times Round" color="rgba(255, 255, 255, 0.6)" fontSize="12px" fontWeight={400} border="none">
                  Time
                </Table.ColumnHeader>
                <Table.ColumnHeader fontFamily="Office Times Round" color="rgba(255, 255, 255, 0.6)" fontSize="12px" fontWeight={400} border="none">
                  Location
                </Table.ColumnHeader>
                <Table.ColumnHeader fontFamily="Office Times Round" color="rgba(255, 255, 255, 0.6)" fontSize="12px" fontWeight={400} border="none">
                  Outcome
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {actions &&
                actions.map((log: any, index: number) => (
                  <Table.Row
                    key={index}
                    backdropFilter={index % 2 === 0 ? 'blur(80px)' : 'none'}
                    bg={index % 2 === 0 ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
                  >
                    <Table.Cell border="none" fontSize="12px" color="white">
                      {moment(log.timestamp * 1000).format('YYYY-MM-DD HH:mm')}
                    </Table.Cell>
                    <Table.Cell border="none" fontSize="12px" color="white">
                      {log.location}
                    </Table.Cell>
                    <Table.Cell border="none" fontSize="12px" color="white">
                      {log.outcome}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ActionDetailModal;