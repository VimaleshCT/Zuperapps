import { Flex, Tabs, Tab } from "@hubspot/ui-extensions";
import SmsTab from "./SmsTab";
import ScheduleTab from "./ScheduleTab";
import AuditLogs from "./AuditLogs";

export default function TabsContainer({ context }: any) {
  return (
    <Flex direction="column" gap="medium">

      <Tabs defaultSelected = "first">

        <Tab tabId="first" title ="SMS">
          <SmsTab context={context} />
        </Tab>

        <Tab tabId="second" title="Schedule SMS">
          <ScheduleTab />
        </Tab>

        <Tab  tabId="third" title="Audit Log">
          <AuditLogs />
        </Tab>

      </Tabs>

    </Flex>
  );
}
