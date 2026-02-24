import {
  EmptyState,
  Button,
  Flex,
  Text,
} from "@hubspot/ui-extensions";
import ScheduleModal from "./ScheduleModel";

export default function ScheduleTab({ mode, context, activeTab, actions }: any) {
  return (
    <Flex align="center" justify="center" direction="column" gap="small">
      <EmptyState
        title="No scheduled SMS yet"
        layout="vertical"
        reverseOrder={true}
      >
        <Text>Schedule an SMS to automatically send messages later.</Text>
        <Button
          variant="primary"
          overlay={
            <ScheduleModal
              activeTab={activeTab}
              actions={actions}
              context={context}
            />
          }
        >
          Schedule SMS
        </Button>
      </EmptyState>
    </Flex>
  );
}