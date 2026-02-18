import { Flex, Button } from "@hubspot/ui-extensions";
import { useState } from "react";
import SmsTab from "./SmsTab";
import ScheduleTab from "./ScheduleTab";
import AuditLogs from "./AuditLogs";


export default function TabsContainer({ context }: any) {
  const [view, setView] = useState("sms");

  return (
    <Flex direction="column" gap="medium">
      <Flex gap="small">
        <Button
          variant={view === "sms" ? "primary" : "secondary"}
          onClick={() => setView("sms")}
        >
          SMS
        </Button>
        <Button
          variant={view === "schedule" ? "primary" : "secondary"}
          onClick={() => setView("schedule")}
        >
          Schedule SMS
        </Button>
        <Button
          variant={view === "audit" ? "primary" : "secondary"}
          onClick={() => setView("audit")}
        >
          Audit Log
        </Button>
      </Flex>

      {view === "sms" && <SmsTab context={context} />}
      {view === "schedule" && <ScheduleTab />}
      {view === "audit" && <AuditLogs />}
    </Flex>
  );
}
