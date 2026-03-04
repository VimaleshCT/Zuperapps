import {
  EmptyState,
  Button,
  Flex,
  Text,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Modal,
  ModalBody,
  ModalFooter,
} from "@hubspot/ui-extensions";
import { useState, useMemo } from "react";
import ScheduleModal from "./ScheduleModel";

export default function ScheduleTab({ actions }: any) {
  const [scheduledList, setScheduledList] = useState<any[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1)

  const handleAddSchedule = (data: any) => {
    setScheduledList((prev) => [
      {
        id: Date.now(),
        ...data,
        createdAt: new Date().toLocaleString(),
      },
      ...prev,
    ]);
    setPage(1);
  };

  const pageCount = Math.ceil(scheduledList.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    return scheduledList.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  }, [scheduledList, page, itemsPerPage]);

  if (scheduledList.length === 0) {
    return (
      <Flex align="center" justify="center" direction="column" gap="small">
        <EmptyState
          title="No scheduled SMS yet"
          layout="vertical"
          reverseOrder
        >
          <Text>
            Schedule an SMS to automatically send messages later.
          </Text>

          <Button
            variant="primary"
            overlay={
              <ScheduleModal
                actions={actions}
                onSchedule={handleAddSchedule}
              />
            }
          >
            Schedule SMS
          </Button>
        </EmptyState>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="medium">
      <Flex justify="end" gap="small">
        <Button
          variant="secondary"
          size="small"
          overlay={
            <ScheduleModal
              actions={actions}
              onSchedule={handleAddSchedule}
            />
          }
        >
          Create Schedule
        </Button>

        <Button
          variant="secondary"
          size="small"
          onClick={() => setScheduledList([...scheduledList])}
        >
          Refresh
        </Button>
      </Flex>

  
      <Table
        bordered
        paginated
        page={page}
        pageCount={pageCount}
        onPageChange={(p) => setPage(p)}
        showButtonLabels
        showFirstLastButtons
      >
        <TableHead>
          <TableRow>
            <TableHeader width="min">FROM</TableHeader>
            <TableHeader width="min">TO</TableHeader>
            <TableHeader width="max">MESSAGE</TableHeader>
            <TableHeader width="min">CREATED DATE</TableHeader>
            <TableHeader width="min">SCHEDULED DATE</TableHeader>
            <TableHeader width="min">ACTION</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedData.map((item) => (
            <TableRow key={item.id}>
              <TableCell width="min">
                {item.number}
              </TableCell>

              <TableCell width="min">
                {item.selectedPhone}
              </TableCell>

              <TableCell width="max">
                {item.message}
              </TableCell>

              <TableCell width="min">
                {item.createdAt}
              </TableCell>

              <TableCell width="min">
                {item.date?.date}/
                {item.date?.month + 1}/
                {item.date?.year}{" "}
                {String(item.time?.hours).padStart(2, "0")}:
                {String(item.time?.minutes).padStart(2, "0")}
              </TableCell>

              <TableCell width="min">
                <Button
                  variant="transparent"
                  size="small"
                  overlay={
                    <Modal
                      id={`cancel-${item.id}`}
                      title="Cancel Schedule"
                    >
                      <ModalBody>
                        <Text>
                          Are you sure you want to cancel the schedule?
                        </Text>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          variant="primary"
                          onClick={() => {
                            setScheduledList((prev) =>
                              prev.filter(
                                (i) => i.id !== item.id
                              )
                            );
                          }}
                        >
                          Cancel Schedule
                        </Button>
                      </ModalFooter>
                    </Modal>
                  }
                >
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Flex>
  );
}