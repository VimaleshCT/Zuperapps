import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@hubspot/ui-extensions";
import { useState } from "react";

export default function AuditLogs() {

  const logs = [
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
  ];
   const [page,setPage] = useState(1);

  return (
    <Table
      bordered
      paginated
      pageCount={1}
      onPageChange={(p)=>setPage(p)}
    >

      <TableHead>
        <TableRow>
          <TableHeader >SI</TableHeader>
          <TableHeader >FROM</TableHeader>
          <TableHeader >TO</TableHeader>
          <TableHeader >MESSAGE</TableHeader>
          <TableHeader width="auto">STATUS</TableHeader>
          <TableHeader >FAILED REASON</TableHeader>
          <TableHeader >CREATED DATE</TableHeader>
        </TableRow>
      </TableHead>

      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{log.id}</TableCell>
            <TableCell>{log.from}</TableCell>
            <TableCell>{log.to}</TableCell>
            <TableCell> {log.message}</TableCell>
            <TableCell width={150}>{log.status}</TableCell>
            <TableCell>{log.reason}</TableCell>
            <TableCell>{log.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>

    </Table>
  );
}
