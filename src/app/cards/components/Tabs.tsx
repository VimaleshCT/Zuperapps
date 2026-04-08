import { useState } from "react";
import { Flex, Tabs, Tab } from "@hubspot/ui-extensions";
import SmsTab from "./SmsTab";
import ScheduleTab from "./ScheduleTab";
import AuditLogs from "./AuditLogs";

export default function TabsContainer({ context, actions, hubspot }: any) {
  const [activeTab, setActiveTab] = useState("first");

  return (
    <Flex direction="column" gap="medium">
      <Tabs selected={activeTab} onSelectedChange={setActiveTab}>
        
        <Tab tabId="first" title="SMS">
          <SmsTab context={context} hubspot={hubspot} activeTab={activeTab} />
        </Tab>

        <Tab tabId="second" title="Schedule SMS">
          <ScheduleTab context={context} actions={actions} hubspot={hubspot} />
        </Tab>

        <Tab tabId="third" title="Audit Log">
          <AuditLogs context={context} hubspot={hubspot} />
        </Tab>

      </Tabs>
    </Flex>
  );
}