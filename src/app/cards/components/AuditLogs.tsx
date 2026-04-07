import { useState, useEffect } from "react";
import ReusableTable from "./ReusableTable";
import { api } from "../utils/api";

export default function AuditLogs({ context }: any) {

  const portalId = context?.portal?.id;
  const objectId = context?.crm?.objectId;

  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  /*
  -------------------------------------------------
  FETCH LOGS FROM BACKEND
  -------------------------------------------------
  */
  useEffect(() => {
    async function fetchLogs() {
      if (!portalId || !objectId) return;

      try {
        const res = await api.getLogs({
          portalId,
          objectId,
          page,
          perPage: ITEMS_PER_PAGE,
        });

        const data = await res.json();

        const formatted = (data?.logs || []).map((log: any) => ({
          id: log.rowNo,
          from: log.from,
          to: log.sent,
          message: log.message,
          status: log.status,
          reason: log.failedReason || "-",
          date: log.createdAt
            ? new Date(log.createdAt).toLocaleString()
            : "-",
        }));

        setLogs(formatted);

      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    }

    fetchLogs();
  }, [portalId, objectId, page]);

  /*
  -------------------------------------------------
  TABLE CONFIG
  -------------------------------------------------
  */
  const columns = [
    { key: "id", label: "SI" },
    { key: "from", label: "FROM" },
    { key: "to", label: "TO" },
    { key: "message", label: "MESSAGE", width: "max" },
    { key: "status", label: "STATUS" },
    { key: "reason", label: "FAILED REASON" },
    { key: "date", label: "CREATED DATE" },
  ];

  /*
  -------------------------------------------------
  PAGINATION (FROM BACKEND)
  -------------------------------------------------
  */
  const pageCount = 10; // optional: replace later with backend totalPages

  return (
    <ReusableTable
      columns={columns}
      data={logs}
      page={page}
      pageCount={pageCount}
      onPageChange={setPage}
    />
  );
}