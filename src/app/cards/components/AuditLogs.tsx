import { useState } from "react";
import ReusableTable from "./ReusableTable";

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
      message: "another message log example",
      status: "success",
      reason: "-",
      date: "2/12/2026, 7:11 PM",
    },
  ]);

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const pageCount = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const paginatedLogs = logs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const columns = [
    { key: "id", label: "SI" },
    { key: "from", label: "FROM" },
    { key: "to", label: "TO" },
    { key: "message", label: "MESSAGE", width: "max" },
    { key: "status", label: "STATUS" },
    { key: "reason", label: "FAILED REASON" },
    { key: "date", label: "CREATED DATE" },
  ];

  const handleDelete = (id: number) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  return (
    <ReusableTable
      columns={columns}
      data={paginatedLogs}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
    />
  );
}