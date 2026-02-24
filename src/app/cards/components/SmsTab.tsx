import { useState, useEffect } from "react";
import {
  Select,
  TextArea,
  Button,
  Flex,
  Text,
  Tag,
} from "@hubspot/ui-extensions";
import { useCrmProperties, useAssociations } from "@hubspot/ui-extensions/crm";

export default function SmsTab({ context, activeTab, openModal }: any) {
  const objectType = context?.crm?.objectTypeId;
  const isCompanyOrDeal = objectType === "0-2" || objectType === "0-3";

  const propertyNames =
    objectType === "0-2"
      ? ["name", "phone"]
      : objectType === "0-3"
        ? ["dealname", "hubspot_owner_id"]
        : ["firstname", "lastname", "phone"];

  const { properties, isLoading } = useCrmProperties(propertyNames);

  const { results: associatedContacts, isLoading: assocLoading } = useAssociations({
    toObjectType: "0-1",
    properties: ["firstname", "lastname", "phone"],
  });

  const [number, setNumber] = useState("");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    number?: string;
    phone?: string;
    message?: string;
  }>({});

  useEffect(() => {
    setFieldErrors({});
  }, [activeTab]);

  const contactOptions = isCompanyOrDeal
    ? (associatedContacts?.map((contact: any) => ({
      label:
        `${contact.properties?.firstname ?? ""} ${contact.properties?.lastname ?? ""}`.trim() ||
        "Unknown contact",
      value: contact.properties?.phone ?? "",
    })) ?? [])
    : [
      {
        label:
          `${properties?.firstname ?? ""} ${properties?.lastname ?? ""}`.trim() ||
          "Unknown contact",
        value: properties?.phone ?? "",
      },
    ];

  useEffect(() => {
    if (!isCompanyOrDeal && properties?.phone) {
      setSelectedPhone(properties.phone);
    }
  }, [isCompanyOrDeal, properties?.phone]);

  const handleReset = () => {
    setNumber("");
    setSelectedPhone("");
    setMessage("");
    setFieldErrors({});
  };

  const handleSend = () => {
    const errors: { number?: string; phone?: string; message?: string } = {};
    if (!number) errors.number = "From Number is required";
    if (!selectedPhone) errors.phone = "Contact Phone is required";
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
      <Flex justify="end">
        <Button
          variant="secondary"
          size="extra-small"
          onClick={handleReset}
        >
          Refresh
        </Button>
      </Flex>

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
        name="record"
        options={contactOptions}
        value={selectedPhone}
        error={!!fieldErrors.phone}
        validationMessage={fieldErrors.phone}
        onChange={(v) => {
          setSelectedPhone(String(v));
          setFieldErrors((prev) => ({ ...prev, phone: undefined }));
        }}
      />

      <Flex direction="column" gap="small">
        <Flex justify="center">
          <Tag variant="info">Wed Feb 19, 2026</Tag>
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
        error={message.length >= 250}
        validationMessage={
          fieldErrors.message
            ? fieldErrors.message
            : message.length >= 250
              ? "Error"
              : "Maximum allowed 250 characters"
        }
        onChange={(v) => {
          setMessage(String(v));
          setFieldErrors((prev) => ({ ...prev, message: undefined }));
        }}
        maxLength={250}
      />
      {/* <Text variant="microcopy" format={{ fontWeight: "bold" }}>
        Maximum 250 characters
      </Text> */}
      <Flex justify="end">
        <Button variant="primary" size="small" onClick={handleSend}>
          Send SMS
        </Button>
      </Flex>
    </Flex>
  );
}