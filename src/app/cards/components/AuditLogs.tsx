import {
  Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  Button, Modal, ModalBody, ModalFooter, Text, Flex
} from "@hubspot/ui-extensions";
import { useState } from "react";

export default function AuditLogs() {
  const [logs, setLogs] = useState([
    {
      id: 1,
      from: "+15313244301",
      to: "+918760725615",
      message: "Hi I have send this message for testing purpose",
      status: "success",
      reason: "-",
      date: "2/19/2026, 2:56 PM",
    },
    {
      id: 2,
      from: "+15313244301",
      to: "+918760725615",
      message: "scheduleless message",
      status: "success",
      reason: "-",
      date: "2/12/2026, 7:33 PM",
    },
    {
      id: 3,
      from: "+15313244301",
      to: "+918760725615",
      message: "This message came from scheduler",
      status: "cancelled",
      reason: "-",
      date: "2/12/2026, 7:23 PM",
    },
    {
      id: 4,
      from: "+15313244301",
      to: "+918760725615",
      message: "This message came from scheduler",
      status: "scheduled",
      reason: "-",
      date: "2/12/2026, 7:14 PM",
    },
    {
      id: 5,
      from: "+15313244301",
      to: "+918760725615",
      message: "send this message for test the logs",
      status: "-",
      reason: "-",
      date: "2/12/2026, 7:01 PM",

    },
    {
      id: 6,
      from: "+15313244301",
      to: "+918760725615",
      message: "send this message for test the logs",
      status: "-",
      reason: "-",
      date: "2/12/2026, 7:11 PM",
    },
  ]);

  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const handleDelete = () => {
    if (deleteId !== null) {
      setLogs((prev) => prev.filter((log) => log.id !== deleteId));
      setDeleteId(null);
    }
  };

  const ITEMS_PER_PAGE = 5;


  const pageCount = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const paginatedLogs = logs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <>
      <Table
        bordered
        paginated
        pageCount={pageCount}
        page={page}
        onPageChange={(p) => setPage(p)}
        showButtonLabels={true}
        showFirstLastButtons={true}
      >
        <TableHead>
          <TableRow>
            <TableHeader width="min">SI</TableHeader>
            <TableHeader width="min">FROM</TableHeader>
            <TableHeader width="min">TO</TableHeader>
            <TableHeader width="min">MESSAGE</TableHeader>
            <TableHeader width="min">STATUS</TableHeader>
            <TableHeader width="min">FAILED REASON</TableHeader>
            <TableHeader width="min">CREATED DATE</TableHeader>
            <TableHeader width="min">ACTIONS</TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell width="min">{log.id}</TableCell>
              <TableCell width="min">{log.from}</TableCell>
              <TableCell width="min">{log.to}</TableCell>
              <TableCell width="min">{log.message}</TableCell>
              <TableCell width="min">{log.status}</TableCell>
              <TableCell width="min">{log.reason}</TableCell>
              <TableCell width="min">{log.date}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="small"
                  overlay={
                    <Modal
                      id={`delete-modal-${log.id}`}
                      title="Confirm Delete"
                    >
                      <ModalBody>
                        <Text>Are you sure you want to delete this log?</Text>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          variant="secondary"
                          overlay={
                            <Modal
                              id={`delete-modal-${log.id}`}
                              onClose={() => setDeleteId(null)}
                            />
                          }
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setLogs((prev) =>
                              prev.filter((l) => l.id !== log.id)
                            );
                          }}
                          overlay={
                            <Modal
                              id={`delete-modal-${log.id}`}
                              onClose={() => { }}
                            />
                          }
                        >
                          Delete
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
    </>
  );
}