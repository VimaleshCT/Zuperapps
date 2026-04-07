import { useState, useEffect } from "react";
import {
  Select,
  TextArea,
  Button,
  Flex,
  Text,
  Tag,
} from "@hubspot/ui-extensions";
import {
  useCrmProperties,
  useAssociations,
} from "@hubspot/ui-extensions/crm";
import { api } from "../utils/api";

export default function SmsTab({ context, activeTab }: any) {

  const objectType = context?.crm?.objectTypeId;
  const portalId = context?.portal?.id;
  const objectId = context?.crm?.objectId;

  const isCompanyOrDeal = objectType === "0-2" || objectType === "0-3";

  const propertyNames =
    objectType === "0-2"
      ? ["name", "phone"]
      : objectType === "0-3"
      ? ["dealname", "hubspot_owner_id"]
      : ["firstname", "lastname", "phone"];

  const { properties } = useCrmProperties(propertyNames);

  const { results: associatedContacts } = useAssociations({
    toObjectType: "0-1",
    properties: ["firstname", "lastname", "phone"],
  });

  const [number, setNumber] = useState("");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [message, setMessage] = useState("");
  const [numbers, setNumbers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [fieldErrors, setFieldErrors] = useState<any>({});

  /*
  -------------------------------------------------
  RESET ERRORS WHEN TAB CHANGES
  -------------------------------------------------
  */
  useEffect(() => {
    setFieldErrors({});
  }, [activeTab]);

  /*
  -------------------------------------------------
  CONTACT OPTIONS
  -------------------------------------------------
  */
  const contactOptions = isCompanyOrDeal
    ? (associatedContacts?.map((contact: any) => ({
        label:
          `${contact.properties?.firstname ?? ""} ${
            contact.properties?.lastname ?? ""
          }`.trim() || "Unknown contact",
        value: contact.properties?.phone ?? "",
      })) ?? [])
    : [
        {
          label:
            `${properties?.firstname ?? ""} ${
              properties?.lastname ?? ""
            }`.trim() || "Unknown contact",
          value: properties?.phone ?? "",
        },
      ];

  useEffect(() => {
    if (!isCompanyOrDeal && properties?.phone) {
      setSelectedPhone(properties.phone);
    }
  }, [isCompanyOrDeal, properties?.phone]);

  /*
  -------------------------------------------------
  FETCH SENDER NUMBERS
  -------------------------------------------------
  */
  useEffect(() => {
    async function fetchNumbers() {
      if (!portalId) return;

      try {
        const res = await api.getNumbers(portalId);
        const data = await res.json();

        const formatted = (data || []).map((n: any) => ({
          label: n.sender_number,
          value: n.sender_number,
        }));

        setNumbers(formatted);
      } catch (err) {
        console.error("Error fetching numbers", err);
      }
    }

    fetchNumbers();
  }, [portalId]);

  /*
  -------------------------------------------------
  FETCH MESSAGE HISTORY
  -------------------------------------------------
  */
  useEffect(() => {
    async function fetchMessages() {
      if (!portalId || !objectId) return;

      try {
        const res = await api.getMessages({
          portalId,
          objectId,
        });

        const data = await res.json();

        const formatted = (data || []).map((msg: any, i: number) => ({
          id: i,
          sender: msg.direction === "OUTBOUND" ? "YOU" : "CONTACT",
          text: msg.message,
          time: new Date(msg.timestamp).toLocaleTimeString(),
          date: new Date(msg.timestamp).toDateString(),
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    }

    fetchMessages();
  }, [portalId, objectId]);

  /*
  -------------------------------------------------
  RESET FORM
  -------------------------------------------------
  */
  const handleReset = () => {
    setNumber("");
    setSelectedPhone("");
    setMessage("");
    setFieldErrors({});
  };

  /*
  -------------------------------------------------
  SEND SMS 
  -------------------------------------------------
  */
  const handleSend = async () => {
    const errors: any = {};

    if (!number) errors.number = "From Number is required";
    if (!selectedPhone) errors.phone = "Contact Phone is required";
    if (!message) errors.message = "Message is required";

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      await api.sendMessage({
        origin: {
          portalId,
          objectId,
          from: number,
        },
        fields: {
          "Phone Number": selectedPhone,
          Message: message,
        },
      });

      handleReset();

      // refresh messages after sending
      const res = await api.getMessages({ portalId, objectId });
      const data = await res.json();

      const formatted = (data || []).map((msg: any, i: number) => ({
        id: i,
        sender: msg.direction === "OUTBOUND" ? "YOU" : "CONTACT",
        text: msg.message,
        time: new Date(msg.timestamp).toLocaleTimeString(),
        date: new Date(msg.timestamp).toDateString(),
      }));

      setMessages(formatted);

    } catch (err) {
      console.error("Send failed", err);
    }
  };

  /*
  -------------------------------------------------
  UI
  -------------------------------------------------
  */
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
        label="From Number*"
        placeholder="Select Phone number"
        options={numbers}
        value={number}
        error={!!fieldErrors.number}
        validationMessage={fieldErrors.number}
        onChange={(v) => {
          setNumber(String(v));
          setFieldErrors((prev: any) => ({
            ...prev,
            number: undefined,
          }));
        }}
      />

      <Select
        label="Contact*"
        placeholder="Select Contact"
        options={contactOptions}
        value={selectedPhone}
        error={!!fieldErrors.phone}
        validationMessage={fieldErrors.phone}
        onChange={(v) => {
          setSelectedPhone(String(v));
          setFieldErrors((prev: any) => ({
            ...prev,
            phone: undefined,
          }));
        }}
      />

      {/* MESSAGE HISTORY */}
      <Flex direction="column" gap="small">
        {messages.map((msg, index) => {
          const showDate =
            index === 0 || messages[index - 1].date !== msg.date;

          return (
            <Flex key={msg.id} direction="column" gap="flush">

              {showDate && (
                <Flex justify="center">
                  <Tag variant="info">{msg.date}</Tag>
                </Flex>
              )}

              <Flex gap="extra-small" align="center">
                <Text variant="bodytext" format={{ fontWeight: "bold" }}>
                  {msg.sender}
                </Text>

                <Text variant="microcopy" format={{ fontWeight: "bold" }}>
                  {msg.time}
                </Text>
              </Flex>

              <Text variant="bodytext">
                {msg.text}
              </Text>

            </Flex>
          );
        })}
      </Flex>

      <TextArea
        name="message"
        placeholder="Type a message..."
        value={message}
        error={!!fieldErrors.message || message.length >= 250}
        validationMessage={
          fieldErrors.message
            ? fieldErrors.message
            : message.length >= 250
              ? "Maximum 250 characters only allowed"
              : "Max 250 characters"
        }
        onChange={(v) => {
          setMessage(String(v));
          setFieldErrors((prev: any) => ({
            ...prev,
            message: undefined,
          }));
        }}
        maxLength={250}
        label=""
      />

      <Flex justify="end">
        <Text variant="microcopy">
          {message.length}/250
        </Text>
      </Flex>

      <Flex justify="end">
        <Button
          variant="primary"
          size="small"
          onClick={handleSend}
        >
          Send SMS
        </Button>
      </Flex>

    </Flex>
  );
}