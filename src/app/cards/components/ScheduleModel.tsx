import { Modal, DateInput, TimeInput, Button, Flex, Box, Select, TextArea, Text, ModalBody, ModalFooter } from "@hubspot/ui-extensions";
import { useState } from "react";

export default function ScheduleModal(){

  const [number,setNumber] = useState("");
  const [contact,setContact] = useState("");
  const [timezone,setTimezone] = useState("sydney");
  const [date,setDate] = useState<any>();
  const [time,setTime] = useState<any>();
  const [message,setMessage] = useState("");

  const numbers = [
    { label:"+91 9000000000", value:"1"},
    { label:"+91 8000000000", value:"2"}
  ];

  const contacts = [
    { label:"Karthik Sarav", value:"c1"},
    { label:"Rahul Kumar", value:"c2"},
    { label:"Anjali", value:"c3"}
  ];

  const zones = [
    { label:"(GMT+10:00) Sydney", value:"sydney"},
    { label:"(GMT+05:30) India", value:"india"},
    { label:"(GMT+00:00) London", value:"uk"}
  ];

  return(
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
        options={contacts}
        value={contact}
        onChange={(v) => setContact(String(v))}
      />

      <Select
        label="Timezone"
        options={zones}
        value={timezone}
        onChange={(v) => setTimezone(String(v))}
      />

      <Flex direction="row" gap="medium" align="end">
        <Box flex={1}>
          <DateInput name="date" label="Date" value={date} onChange={setDate} />
        </Box>
        <Box flex={1}>
          <TimeInput name="time" label="Time" value={time} onChange={setTime} />
        </Box>
      </Flex>

      <TextArea
        name="msg"
        label="Write a Message"
        value={message}
        onBlur={(v) => setMessage(String(v))}
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
      disabled={!number || !contact || !date || !time || !message}
    >
      Schedule SMS
    </Button>
  </ModalFooter>
</Modal>
  );
}
