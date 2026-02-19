import { useState } from "react";
import {
  Select,
  TextArea,
  Button,
  Flex,
  Text
} from "@hubspot/ui-extensions";
import { useCrmProperties } from "@hubspot/ui-extensions/crm";

export default function SmsTab({ openModal }: any){

  const { properties, isLoading } = useCrmProperties([
    "firstname",
    "lastname",
    "phone",
  ]);

  const [number,setNumber] = useState("");
  const [message,setMessage] = useState("");

  const contactName =
 `${properties?.firstname ?? ""} ${properties?.lastname ?? ""}`.trim();

  const contactPhone = properties?.phone ?? "";

  const numbers = [
    { label:"+91 9000000000", value:"+919000000000"},
    { label:"+91 8000000000", value:"+918000000000"}
  ];


  return (
    <Flex direction="column" gap="small">

      <Select
        label="From Number"
        options={numbers}
        value={number}
        onChange={(val)=>setNumber(String(val))}
      />

       <Flex direction="column" gap="xs">
            <Text variant="bodytext">Contact</Text>
            <Text>{contactName || "Unknown contact"}</Text>
            <Text>{contactPhone || "Unknown phone"}</Text>
        </Flex>


      <TextArea
        name="message"
        label="Write a Message"
        value={message}
        onChange={(val)=>setMessage(String(val))}
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
