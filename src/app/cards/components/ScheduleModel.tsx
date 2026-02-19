import {
  Modal, DateInput, TimeInput, Button, Flex, Box,
  Select, TextArea, Text, ModalBody, ModalFooter
} from "@hubspot/ui-extensions";
import { useCrmProperties } from "@hubspot/ui-extensions/crm";
import { useState } from "react";

export default function ScheduleModal({ mode }: any) {


  const { properties, isLoading } = useCrmProperties([
    "firstname",
    "lastname",
    "phone",
  ]);

  const [number, setNumber] = useState("");
  const [timezone, setTimezone] = useState("sydney");
  const [date, setDate] = useState<any>();
  const [time, setTime] = useState<any>();
  const [message, setMessage] = useState("");

  if (isLoading) return <Text>Loading...</Text>;

  const contactName =
    `${properties?.firstname ?? ""} ${properties?.lastname ?? ""}`.trim();

  const contactPhone = properties?.phone ?? "";

  const numbers = [
    { label: "+91 9000000000", value: "+919000000000" },
    { label: "+91 8000000000", value: "+918000000000" },
  ];

  const zones = [
    { label: "(GMT+10:00) Sydney", value: "sydney" },
    { label: "(GMT+05:30) India", value: "india" },
    { label: "(GMT+00:00) London", value: "uk" },
  ];

  return (
    <Modal id="schedule-modal" title="Schedule Message" width="md">

      <ModalBody>
        <Flex direction="column" gap="medium">

          <Select
            label="From Number"
            options={numbers}
            value={number}
            onChange={(v) => setNumber(String(v))}
          />

           <Select
            label="Contact"
            name="contact"
            options={[
              { label: contactName || "Unknown contact", value: contactPhone },
            ]}
            value={contactPhone}
            onChange={() => {}}
          />

          <Select
            label="Timezone"
            options={zones}
            value={timezone}
            onChange={(v) => setTimezone(String(v))}
          />

          <Flex gap="medium">
            <Box flex={1}>
              <DateInput name="date" label="Date" value={date} onChange={setDate}/>
            </Box>

            <Box flex={1}>
              <TimeInput name="time" label="Time" value={time} onChange={setTime}/>
            </Box>
          </Flex>

          <TextArea
            name="msg"
            label="Write a Message"
            value={message}
            onChange={(v)=>setMessage(String(v))}
            maxLength={250}
          />

          <Text variant="microcopy">
            This field allows a maximum of 250 characters
          </Text>

        </Flex>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary">Cancel</Button>

        <Button
          variant="primary"
          disabled={!number || !contactPhone || !date || !time || !message}
        > 
          Schedule SMS
        </Button>
      </ModalFooter>

    </Modal>
  );
}
