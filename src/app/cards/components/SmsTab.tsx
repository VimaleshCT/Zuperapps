import { useState } from "react";
import {
  Select,
  TextArea,
  Button,
  Flex,
  Tile, Text, Divider,
  Tag
} from "@hubspot/ui-extensions";
import { useCrmProperties } from "@hubspot/ui-extensions/crm";

export default function SmsTab({ openModal }: any) {

  const { properties, isLoading } = useCrmProperties([
    "firstname",
    "lastname",
    "phone",
  ]);

  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");

  const contactName =
    `${properties?.firstname ?? ""} ${properties?.lastname ?? ""}`.trim();
  const contactPhone = properties?.phone ?? "";

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
        onChange={(val) => setNumber(String(val))}
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

      <Flex direction="column" gap="small">
      <Flex justify="center">
      <Tag variant="success">Feb 19, 2026</Tag>
      </Flex>
        <Divider size="extra-small" />

        {messages.map((msg) => (
         <Flex
          key={msg.id}
          justify={msg.sender === "me" ? "end" : "start"}
        >
          <Tag variant={msg.sender === "me" ? "info" : "default"}>
            {msg.text} · {msg.time}
          </Tag>
        </Flex>
        ))}
      </Flex>

      <TextArea
        name="message"
        label="Write a Message"
        value={message}
        onChange={(val) => setMessage(String(val))}
        maxLength={250}
      />

      <Flex justify="end">
        <Button
          variant="primary"
          size="small"
          disabled={!number || !contactPhone || !message}
          onClick={openModal}
        >
          Send SMS
        </Button>
      </Flex>

    </Flex>
  );
}