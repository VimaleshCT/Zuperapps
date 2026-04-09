import { useState, useEffect } from "react";
import ReusableTable from "./ReusableTable";
import { createApi } from "../utils/api";

export default function AuditLogs({ context, hubspot }: any) {

  const api = createApi(hubspot);

  const portalId = context?.portal?.id;
  const objectId = context?.crm?.objectId;

  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchLogs() {
      if (!portalId || !objectId) return;

      try {
        const data = await api.getLogs({
          portalId,
          objectId,
          page,
          perPage: 5,
        });
   
        setLogs(
          (data?.logs || []).map((log: any) => ({
            id: log.rowNo,
            from: log.from,
            to: log.sent,
            message: log.message,
            status: log.status,
            reason: log.failedReason || "-",
            date: log.createdAt
              ? new Date(log.createdAt).toLocaleString()
              : "-",
          }))
        );

      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    }

    fetchLogs();
  }, [portalId, objectId, page]);

  return (
    <ReusableTable
      columns={[
        { key: "id", label: "SI" },
        { key: "from", label: "FROM" },
        { key: "to", label: "TO" },
        { key: "message", label: "MESSAGE", width: "max" },
        { key: "status", label: "STATUS" },
        { key: "reason", label: "FAILED REASON" },
        { key: "date", label: "CREATED DATE" },
      ]}
      data={logs}
      page={page}
      pageCount={10}
      onPageChange={setPage}
    />
  );
}