import {
  Modal, DateInput, TimeInput, Button, Flex, Box,
  Select, TextArea, Text, ModalBody, ModalFooter
} from "@hubspot/ui-extensions";
import { useCrmProperties } from "@hubspot/ui-extensions/crm";
import { useState, useEffect } from "react";

export default function ScheduleModal({ mode, activeTab, actions }: any) {

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
  const [fieldErrors, setFieldErrors] = useState<{
    number?: string;
    phone?: string;
    date?: string;
    time?: string;
    message?: string;
  }>({});

 
  useEffect(() => {
    setFieldErrors({});
  }, [activeTab]);

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

  const now = new Date();
  const today = {
    year: now.getFullYear(),
    month: now.getMonth(),
    date: now.getDate(),
  };

  const isToday =
    date?.year === today.year &&
    date?.month === today.month &&
    date?.date === today.date;

  const currentTime = isToday
    ? { hours: now.getHours(), minutes: now.getMinutes() }
    : undefined;

  const handleSchedule = () => {
    const errors: {
      number?: string;
      phone?: string;
      date?: string;
      time?: string;
      message?: string;
    } = {};
    if (!number) errors.number = "From Number is required";
    if (!contactPhone) errors.phone = "Contact Phone is required";
    if (!date) errors.date = "Date is required";
    if (!time) errors.time = "Time is required";
    if (!message) errors.message = "Message is required";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
  };

  return (
    <Modal id="schedule-modal" title="Schedule Message" width="md">

      <ModalBody>
        <Flex direction="column" gap="medium">

          <Select
            label="From Number"
            options={numbers}
            value={number}
            error={!!fieldErrors.number}
            validationMessage={fieldErrors.number}
            onChange={(v) => {
              setNumber(String(v));
              setFieldErrors((prev) => ({ ...prev, number: undefined }));
            }}
          />

          <Select
            label="Contact"
            name="contact"
            options={[
              { label: contactName || "Unknown contact", value: contactPhone },
            ]}
            value={contactPhone}
            error={!!fieldErrors.phone}
            validationMessage={fieldErrors.phone}
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
              <DateInput
                name="date"
                label="Date"
                value={date}
                min={today}
                minValidationMessage="Cannot schedule in the past"
                error={!!fieldErrors.date}
                validationMessage={fieldErrors.date}
                onChange={(v) => {
                  setDate(v);
                  setFieldErrors((prev) => ({ ...prev, date: undefined }));
                }}
              />
            </Box>

            <Box flex={1}>
              <TimeInput
                name="time"
                label="Time"
                value={time}
                min={currentTime}
                error={!!fieldErrors.time}
                validationMessage={fieldErrors.time}
                onChange={(v) => {
                  setTime(v);
                  setFieldErrors((prev) => ({ ...prev, time: undefined }));
                }}
              />
            </Box>
          </Flex>

          <TextArea
            name="msg"
            label="Write a Message"
            value={message}
            error={!!fieldErrors.message}
            validationMessage={fieldErrors.message}
            onChange={(v) => {
              setMessage(String(v));
              setFieldErrors((prev) => ({ ...prev, message: undefined }));
            }}
            maxLength={250}
          />

          <Text variant="microcopy">
            This field allows a maximum of 250 characters
          </Text>

        </Flex>
      </ModalBody>

      <ModalFooter>
       <Button
          variant="secondary"
          overlay={
            <Modal id="schedule-modal" onClose={() => {}}>
            </Modal>
          }
        >
          Cancel
        </Button>

        <Button variant="primary" onClick={handleSchedule}>
          Schedule SMS
        </Button>
      </ModalFooter>

    </Modal>
  );
}