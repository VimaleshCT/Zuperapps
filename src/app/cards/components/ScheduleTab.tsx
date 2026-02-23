import {
  EmptyState,
  Button,
  Flex,
  Text
} from "@hubspot/ui-extensions";
import ScheduleModal from "./ScheduleModel";

export default function ScheduleTab({ activeTab }: any) {

  return (
    <Flex align="center" justify="center" direction="column" gap="small">

      <EmptyState title="No scheduled SMS yet">

        <Text>
          Schedule an SMS to automatically send messages later.
        </Text>

        <Button
          variant="primary"
          overlay={<ScheduleModal mode="schedule" activeTab={activeTab} />}
        >
          Schedule SMS
        </Button>

      </EmptyState>

    </Flex>
  );
}