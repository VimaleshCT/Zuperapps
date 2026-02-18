import { useState } from "react";
import {
  Select,
  TextArea,
  Button,
  Flex,
  Text
} from "@hubspot/ui-extensions";

export default function SmsTab({ context, openModal }:any){

  const [number,setNumber] = useState("");
  const [contact,setContact] = useState("");
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

  return (
    <Flex direction="column" gap="small">

      <Select
        label="From Number"
        options={numbers}
        value={number}
        onChange={(val)=>setNumber(String(val))}
      />

      <Select
        label="Contact"
        options={contacts}
        value={contact}
        onChange={(val)=>setContact(String(val))}
      />

      <TextArea
        name="message"
        label="Write a Message"
        value={message}
        onBlur={(val)=>setMessage(String(val))}
        maxLength={250}
      />

      <Flex justify="end">
        <Button
            variant="primary"
            size="small"
            disabled={!number || !contact || !message}
            onClick={openModal}
        >
            Send SMS
        </Button>
        </Flex>


    </Flex>
  );
}
