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
import { createApi } from "../utils/api";

export default function SmsTab({ context, activeTab, hubspot }: any) {

  const objectType = context?.crm?.objectTypeId;
  const portalId = context?.portal?.id;
  const objectId = context?.crm?.objectId;
  const api = createApi(hubspot)
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
  const [scheduleTime, setScheduleTime] = useState<string | null>(null);
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
      const response = await api.getNumbers(portalId); 

      console.log("Raw numbers response:", response);

      let formatted: any[] = [];

     
      if (Array.isArray(response)) {
        formatted = response.map((item: any) => ({
          label: item.data,
          value: item.data,
        }));
      }

      else if (typeof response?.data === "string") {
        formatted = [
          {
            label: response.data,
            value: response.data,
          },
        ];
      }

      else if (Array.isArray(response?.data)) {
        formatted = response.data.map((contact: any) => ({
          label:
            contact.senderNo ||
            contact.digits ||
            contact.sender_number ||
            "Unknown",
          value:
            contact.senderNo ||
            contact.digits ||
            contact.sender_number ||
            "",
        }));
      }

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
    setScheduleTime(null); 
    setFieldErrors({});
  };

  /*
  -------------------------------------------------
  SEND SMS (Instant + Schedule)
  -------------------------------------------------
  */
  const handleSend = async () => {
    const errors: any = {};

    if (!number) errors.number = "From Number is required";
    if (!selectedPhone) errors.phone = "Contact Phone is required";
    if (!message) errors.message = "Message is required";

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;
    const getObjectType = () => {
  switch (objectType) {
    case "0-1":
      return "CONTACT";
    case "0-2":
      return "COMPANY";
    case "0-3":
      return "DEAL";
    default:
      return "CONTACT";
  }
};

    const payload: any = {
      origin: {
        portalId,
        objectId,
        objectType: getObjectType(),
        email: context?.user?.email,
        isTimeLine: true,
        from: number,
      },
      fields: {
        "Phone Number": selectedPhone,
        Message: message,
      },
    };


    if (scheduleTime) {
      payload.origin.schedule = {
        time: new Date(scheduleTime).toISOString(),
        timezone: "Asia/Kolkata",
      };
    }

    try {
      console.log("🚀 PAYLOAD:", JSON.stringify(payload, null, 2));
      await api.sendMessage(payload);

      handleReset();

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
        onChange={(v) => setNumber(String(v))}
      />

      <Select
        label="Contact*"
        placeholder="Select Contact"
        options={contactOptions}
        value={selectedPhone}
        onChange={(v) => setSelectedPhone(String(v))}
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
                <Text format={{ fontWeight: "bold" }}>
                  {msg.sender}
                </Text>

                <Text format={{ fontWeight: "bold" }}>
                  {msg.time}
                </Text>
              </Flex>

              <Text>{msg.text}</Text>
            </Flex>
          );
        })}
      </Flex>

   
      <TextArea
        name="message"
        label=""
        placeholder="Type a message..."
        value={message}
        onChange={(v) => setMessage(String(v))}
        maxLength={250}
      />

      <Flex justify="end">
        <Text>{message.length}/250</Text>
      </Flex>

      <Flex justify="end">
        <Button onClick={handleSend}>
          Send SMS
        </Button>
      </Flex>

    </Flex>
  );
}