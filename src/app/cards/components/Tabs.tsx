import { useState } from "react";
import { Flex, Tabs, Tab } from "@hubspot/ui-extensions";
import SmsTab from "./SmsTab";
import ScheduleTab from "./ScheduleTab";
import AuditLogs from "./AuditLogs";

export default function TabsContainer({ context,t }: any) {
  const [activeTab, setActiveTab] = useState<string | number>("first");

  return (
    <Flex direction="column" gap="medium">
      <Tabs
        defaultSelected="first"
        selected={activeTab}
        onSelectedChange={(selectedId: string | number) => setActiveTab(selectedId)}
      >
        <Tab tabId="first" title="SMS">
          <SmsTab context={context} activeTab={activeTab} t={t} />
        </Tab>

        <Tab tabId="second" title="Schedule SMS">
          <ScheduleTab activeTab={activeTab}  t={t}/>
        </Tab>

        <Tab tabId="third" title="Audit Log">
          <AuditLogs />
        </Tab>
      </Tabs>
    </Flex>
  );
}