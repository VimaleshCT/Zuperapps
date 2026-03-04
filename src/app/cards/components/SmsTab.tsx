// import { useState, useEffect } from "react";
// import {
//   Select,
//   TextArea,
//   Button,
//   Flex,
//   Text,
//   Tag,
// } from "@hubspot/ui-extensions";
// import {
//   useCrmProperties,
//   useAssociations,
// } from "@hubspot/ui-extensions/crm";

// export default function SmsTab({ context, activeTab, hubspot }: any) {

//   const objectType = context?.crm?.objectTypeId;
//   const portalId = context?.portal?.id;

//   const isCompanyOrDeal = objectType === "0-2" || objectType === "0-3";

//   const propertyNames =
//     objectType === "0-2"
//       ? ["name", "phone"]
//       : objectType === "0-3"
//       ? ["dealname", "hubspot_owner_id"]
//       : ["firstname", "lastname", "phone"];

//   const { properties } = useCrmProperties(propertyNames);

//   const { results: associatedContacts } = useAssociations({
//     toObjectType: "0-1",
//     properties: ["firstname", "lastname", "phone"],
//   });

//   const [numbers, setNumbers] = useState<any[]>([]);
//   const [number, setNumber] = useState("");
//   const [selectedPhone, setSelectedPhone] = useState("");
//   const [message, setMessage] = useState("");
//   const [fieldErrors, setFieldErrors] = useState<any>({});

//   useEffect(() => {
//     setFieldErrors({});
//   }, [activeTab]);

//   /*
//   -------------------------------------------------
//   FETCH SENDER NUMBER FROM BACKEND
//   -------------------------------------------------
//   */

//   useEffect(() => {
//   async function fetchSenderNumbers() {
//     try {

//       if (!portalId) return;

//       const res = await hubspot.fetch({
//         method: "GET",
//         url: `http://localhost:4001/api/v1/hubspot/provider/numbers?portalId=${portalId}`,
//       });

//       const response = await res.json();

//       const senderNumbers = response?.data || [];

//       const formatted = senderNumbers.map((item: any) => ({
//         label: item.sender_number,
//         value: item.sender_number,
//       }));

//       setNumbers(formatted);

//     } catch (err) {
//       console.error("Failed to fetch sender numbers", err);
//     }
//   }

//   fetchSenderNumbers();

// }, [portalId]);

//   /*
//   -------------------------------------------------
//   CONTACT OPTIONS
//   -------------------------------------------------
//   */

//   const contactOptions = isCompanyOrDeal
//     ? (associatedContacts?.map((contact: any) => ({
//         label:
//           `${contact.properties?.firstname ?? ""} ${
//             contact.properties?.lastname ?? ""
//           }`.trim() || "Unknown contact",
//         value: contact.properties?.phone ?? "",
//       })) ?? [])
//     : [
//         {
//           label:
//             `${properties?.firstname ?? ""} ${
//               properties?.lastname ?? ""
//             }`.trim() || "Unknown contact",
//           value: properties?.phone ?? "",
//         },
//       ];

//   const selectedContactName =
//     contactOptions.find((c: any) => c.value === selectedPhone)?.label ||
//     "Contact";

//   useEffect(() => {
//     if (!isCompanyOrDeal && properties?.phone) {
//       setSelectedPhone(properties.phone);
//     }
//   }, [isCompanyOrDeal, properties?.phone]);

//   /*
//   -------------------------------------------------
//   STATIC MESSAGE HISTORY (FOR UI TESTING)
//   -------------------------------------------------
//   */

//   const [messages] = useState([
//     {
//       id: 1,
//       senderType: "system",
//       text: "Hi, this is a reminder that you have a scheduled meeting tomorrow at 10:00 AM.",
//       time: "06:03 PM",
//       date: "Thu 08 Jan 2026",
//     },
//     {
//       id: 2,
//       senderType: "contact",
//       text: "Thanks for the reminder. I’ll join on time.",
//       time: "06:05 PM",
//       date: "Thu 08 Jan 2026",
//     },
//   ]);

//   /*
//   -------------------------------------------------
//   ACTIONS
//   -------------------------------------------------
//   */

//   const handleReset = () => {
//     setNumber("");
//     setSelectedPhone("");
//     setMessage("");
//     setFieldErrors({});
//   };

//   const handleSend = () => {
//     const errors: any = {};

//     if (!number) errors.number = "From Number is required";
//     if (!selectedPhone) errors.phone = "Contact Phone is required";
//     if (!message) errors.message = "Message is required";

//     setFieldErrors(errors);

//     if (Object.keys(errors).length > 0) return;

//     console.log("Sending SMS:", {
//       from: number,
//       to: selectedPhone,
//       message,
//     });
//   };

//   /*
//   -------------------------------------------------
//   UI
//   -------------------------------------------------
//   */

//   return (
//     <Flex direction="column" gap="small">

//       <Flex justify="end">
//         <Button variant="secondary" size="extra-small" onClick={handleReset}>
//           Refresh
//         </Button>
//       </Flex>

//       <Select
//         label="From Number*"
//         placeholder="Select Phone number"
//         options={numbers}
//         value={number}
//         error={!!fieldErrors.number}
//         validationMessage={fieldErrors.number}
//         onChange={(v) => {
//           setNumber(String(v));
//           setFieldErrors((prev: any) => ({
//             ...prev,
//             number: undefined,
//           }));
//         }}
//       />

//       <Select
//         label="Contact*"
//         placeholder="Select Contact"
//         options={contactOptions}
//         value={selectedPhone}
//         error={!!fieldErrors.phone}
//         validationMessage={fieldErrors.phone}
//         onChange={(v) => {
//           setSelectedPhone(String(v));
//           setFieldErrors((prev: any) => ({
//             ...prev,
//             phone: undefined,
//           }));
//         }}
//       />

//       <Flex direction="column" gap="small">
//         {messages.map((msg, index) => {

//           const showDate =
//             index === 0 || messages[index - 1].date !== msg.date;

//           return (
//             <Flex key={msg.id} direction="column" gap="flush">

//               {showDate && (
//                 <Flex justify="center">
//                   <Tag variant="info">{msg.date}</Tag>
//                 </Flex>
//               )}

//               <Flex gap="extra-small" align="center">
//                 <Text variant="bodytext" format={{ fontWeight: "bold" }}>
//                   {msg.senderType === "system"
//                     ? number || "Sender Number"
//                     : selectedContactName}
//                 </Text>

//                 <Text variant="microcopy">
//                   {msg.time}
//                 </Text>
//               </Flex>

//               <Text variant="bodytext">
//                 {msg.text}
//               </Text>

//             </Flex>
//           );
//         })}
//       </Flex>

//       <TextArea
//         name="message"
//         placeholder="Type a message..."
//         value={message}
//         error={!!fieldErrors.message || message.length >= 250}
//         validationMessage={
//           fieldErrors.message
//             ? fieldErrors.message
//             : message.length >= 250
//             ? "Maximum 250 characters only allowed"
//             : "Maximum 250 characters"
//         }
//         onChange={(v) => {
//           setMessage(String(v));
//           setFieldErrors((prev: any) => ({
//             ...prev,
//             message: undefined,
//           }));
//         }}
//         maxLength={250}
//         label=""
//       />

//       <Flex justify="end">
//         <Text variant="microcopy">{message.length}/250</Text>
//       </Flex>

//       <Flex justify="end">
//         <Button variant="primary" size="small" onClick={handleSend}>
//           Send SMS
//         </Button>
//       </Flex>

//     </Flex>
//   );
// }


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

export default function SmsTab({ context, activeTab, openModal }: any) {

  const objectType = context?.crm?.objectTypeId;
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

  const [fieldErrors, setFieldErrors] = useState<any>({});

  useEffect(() => {
    setFieldErrors({});
  }, [activeTab]);



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

  

  const handleReset = () => {
    setNumber("");
    setSelectedPhone("");
    setMessage("");
    setFieldErrors({});
  };


  const handleSend = () => {
    const errors: any = {};

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
  {
    id: 1,
    sender: "AUTOMATION NUMBER",
    text: "Hi Brian, this is a friendly reminder that you have a scheduled meeting with our team tomorrow at 10:00 AM. The meeting will cover the project requirements, timeline, and next steps for implementation. Please let us know if you need to reschedule or if there is anything specific you would like us to prepare before the meeting.",
    time: "06:03 PM",
    date: "Thu 08 Jan 2026",
  },
  {
    id: 2,
    sender: "Brian",
    text: "Thanks for the reminder. I’ve noted the meeting time and will make sure to join on time. I’m looking forward to discussing the project details and understanding how we can move forward with the implementation.",
    time: "06:05 PM",
    date: "Thu 08 Jan 2026",
  },
  {
    id: 3,
    sender: "AUTOMATION NUMBER",
    text: "Great! In preparation for the meeting, we recommend reviewing the documents we shared earlier regarding the system architecture and feature roadmap. This will help ensure the discussion is more productive and that we can address any questions you might have.",
    time: "06:07 PM",
    date: "Thu 08 Jan 2026",
  },
  {
    id: 4,
    sender: "Brian",
    text: "Sure, I’ll go through the documents today and note down any questions or suggestions I might have. If anything needs clarification, I’ll bring it up during the meeting tomorrow.",
    time: "06:10 PM",
    date: "Thu 08 Jan 2026",
  },
  {
    id: 5,
    sender: "AUTOMATION NUMBER",
    text: "Hello Brian, we just wanted to follow up and check whether you had a chance to review the documents we shared earlier. They include details about the proposed workflow, integration plan, and the expected delivery milestones for the project.",
    time: "09:30 AM",
    date: "Sun 11 Jan 2026",
  },
  {
    id: 6,
    sender: "Brian",
    text: "Yes, I received the documents and have started reviewing them. Everything looks good so far, but I will need some clarification on the integration section. I’ll review the rest and get back to you with my feedback shortly.",
    time: "09:34 AM",
    date: "Sun 11 Jan 2026",
  },
  {
    id: 7,
    sender: "AUTOMATION NUMBER",
    text: "Perfect. Please feel free to reply here if you have any questions while reviewing the documents. Our team will be happy to assist and provide any additional details required so we can proceed smoothly with the next phase of the project.",
    time: "09:36 AM",
    date: "Sun 11 Jan 2026",
  },
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

              <Text variant="microcopy"  format={{ fontWeight: "bold"}}>
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

      
      <>
        <TextArea
          name="message"
          placeholder="Type a message..."
          value={message}
          error={!!fieldErrors.message || message.length >= 250}
          validationMessage={fieldErrors.message
            ? fieldErrors.message
            : message.length >= 250
              ? "Maximum 250 characters only allowed"
              : "This field allows a Maximum of 250 characters"}
          onChange={(v) => {
            setMessage(String(v));
            setFieldErrors((prev: any) => ({
              ...prev,
              message: undefined,
            }));
          } }
          maxLength={250} label={""}        />

        <Flex justify="end">
          <Text variant="microcopy">
            {message.length}/250
          </Text>
        </Flex>
      </>

      

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
