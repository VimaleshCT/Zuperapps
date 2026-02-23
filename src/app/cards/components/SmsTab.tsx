import { useState, useEffect } from "react";
import {
  Select,
  TextArea,
  Button,
  Flex,
  Text,
  Tag
} from "@hubspot/ui-extensions";
import { useCrmProperties } from "@hubspot/ui-extensions/crm";

export default function SmsTab({ context, activeTab, openModal }: any) {

  const objectType = context?.crm?.objectTypeId;

  const propertyNames =
    objectType === "0-2"
      ? ["name", "phone"]
      : objectType === "0-3"
        ? ["dealname", "hubspot_owner_id"]
        : ["firstname", "lastname", "phone"];

  const { properties, isLoading } = useCrmProperties(propertyNames);

  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    number?: string;
    phone?: string;
    message?: string;
  }>({});

  useEffect(() => {
    setFieldErrors({});
  }, [activeTab]);

  const recordName =
    objectType === "0-2"
      ? properties?.name ?? ""
      
      : objectType === "0-3"
        ? properties?.dealname ?? ""
        : `${properties?.firstname ?? ""} ${properties?.lastname ?? ""}`.trim();

  const recordPhone = properties?.phone ?? "";

  const recordLabel =
    objectType === "0-2"
      ? "Company"
      : objectType === "0-3"
        ? "Deal"
        : "Contact";

  const handleSend = () => {
    const errors: { number?: string; phone?: string; message?: string } = {};
    if (!number) errors.number = "From Number is required";
    if (!recordPhone) errors.phone = `${recordLabel} Phone is required`;
    if (!message) errors.message = "Message is required";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    openModal();
  };

  const numbers = [
    { label: "+91 9000000000", value: "+919000000000" },
    { label: "+91 8000000000", value: "+918000000000" },
  ];

  const [messages] = useState([
    { id: 1, text: "Hello!", sender: "me", time: "10:00 AM", date: "Feb 19, 2026" },
    { id: 2, text: "Hi there!", sender: "them", time: "10:01 AM", date: "Feb 19, 2026" },
    { id: 3, text: "How are you?", sender: "me", time: "10:02 AM", date: "Feb 19, 2026" },
  ]);

  return (
    <Flex direction="column" gap="small">

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
        label={recordLabel}
        name="record"
        options={[
          { label: recordName || `Unknown ${recordLabel.toLowerCase()}`, value: recordPhone },
        ]}
        value={recordPhone}
        error={!!fieldErrors.phone}
        validationMessage={fieldErrors.phone}
        onChange={() => {}}
      />

      <Flex direction="column" gap="small">
        <Flex justify="center">
          <Tag variant="success">Feb 19, 2026</Tag>
        </Flex>

        {messages.map((msg) => (
          <Flex direction="column" gap="flush" key={msg.id}>
            <Flex justify={msg.sender === "me" ? "end" : "start"}>
              <Text variant="bodytext">{msg.text}</Text>
            </Flex>
            <Flex justify={msg.sender === "me" ? "end" : "start"}>
              <Text variant="microcopy">{msg.time}</Text>
            </Flex>
          </Flex>
        ))}
      </Flex>

      <TextArea
        name="message"
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

      <Flex justify="end">
        <Button variant="primary" size="small" onClick={handleSend}>
          Send SMS
        </Button>
      </Flex>

    </Flex>
  );
}