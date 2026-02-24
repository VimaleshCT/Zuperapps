import {
  Modal,
  DateInput,
  TimeInput,
  Button,
  Flex,
  Box,
  Select,
  TextArea,
  Text,
  ModalBody,
  ModalFooter,
} from "@hubspot/ui-extensions";
import {
  useCrmProperties,
  useAssociations,
} from "@hubspot/ui-extensions/crm";
import { useState, useEffect } from "react";


const IANA_ZONES: Record<string, string> = {
  sydney: "Australia/Sydney",
  india: "Asia/Kolkata",
  uk: "Europe/London",
};

const getDateTimeForTimezone = (tz: string) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: IANA_ZONES[tz],
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);

  return {
    date: { year: get("year"), month: get("month") - 1, date: get("day") },
    time: { hours: get("hour"), minutes: get("minute") },
  };
};


export default function ScheduleModal({ actions, onSchedule }: any) {


  const { properties, isLoading } = useCrmProperties([
    "firstname",
    "lastname",
    "phone",
  ]);

  const {
    results: associatedContacts,
    isLoading: assocLoading,
  } = useAssociations({
    toObjectType: "0-1",
    properties: ["firstname", "lastname", "phone"],
  });


  const contactOptions =
    associatedContacts && associatedContacts.length > 0
      ? associatedContacts.map((contact: any) => ({
        label:
          `${contact.properties?.firstname ?? ""} ${contact.properties?.lastname ?? ""
            }`.trim() || "Unnamed contact",
        value: contact.properties?.phone ?? "",
      }))
      : [
        {
          label:
            `${properties?.firstname ?? ""} ${properties?.lastname ?? ""
              }`.trim() || "Unnamed contact",
          value: properties?.phone ?? "",
        },
      ];

  const [number, setNumber] = useState("");
  const [selectedPhone, setSelectedPhone] = useState(
    contactOptions[0]?.value || ""
  );
  const [timezone, setTimezone] = useState("india");
  const [date, setDate] = useState<any>();
  const [time, setTime] = useState<any>();
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<any>({});

  
    useEffect(() => {
      setDate(undefined);
      setTime(undefined);
    }, [timezone]);

  if (isLoading || assocLoading) {
    return <Text>Loading...</Text>;
  }


  const tzNow = getDateTimeForTimezone(timezone);
  const minDate = tzNow.date;

  const isToday =
    date?.year === minDate.year &&
    date?.month === minDate.month &&
    date?.date === minDate.date;

  const minTime = isToday ? tzNow.time : undefined;


  const numbers = [
    { label: "+91 9000000000", value: "+919000000000" },
    { label: "+91 8000000000", value: "+918000000000" },
  ];

  const zones = [
    { label: "(GMT+10:00) Sydney", value: "sydney" },
    { label: "(GMT+05:30) India", value: "india" },
    { label: "(GMT+00:00) London", value: "uk" },
  ];



  const handleSchedule = () => {
    const newErrors: any = {};

    if (!number) newErrors.number = "From number required";
    if (!selectedPhone) newErrors.phone = "Contact required";
    if (!date) newErrors.date = "Date required";
    if (!time) newErrors.time = "Time required";
    if (!message) newErrors.message = "Message required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSchedule({
      number,
      selectedPhone,
      date,
      time,
      timezone,
      message,
    });

    actions.closeOverlay("schedule-modal");
  };


  return (
    <Modal
      id="schedule-modal"
      title="Schedule Message"
      width="md"
    >
      <ModalBody>
        <Flex direction="column" gap="medium">
          <Select
            label="From Number*"
            placeholder="Select Phone Number"
            options={numbers}
            value={number}
            error={!!errors.number}
            validationMessage={errors.number}
            onChange={(v) => {
              setNumber(String(v));
              setErrors({ ...errors, number: undefined });
            }}
          />

          <Select
            label="Contact*"
            placeholder="Select Contact"
            options={contactOptions}
            value={selectedPhone}
            error={!!errors.phone}
            validationMessage={errors.phone}
            onChange={(v) => {
              setSelectedPhone(String(v));
              setErrors({ ...errors, phone: undefined });
            }}
          />

          <Select
            label="Timezone*"
            options={zones}
            value={timezone}
            onChange={(v) => setTimezone(String(v))}
          />

          <Flex gap="medium">
            <Box flex={1}>
              <DateInput
                label="Date*"
                value={date}
                min={minDate}
                minValidationMessage="Cannot schedule in past"
                error={!!errors.date}
                validationMessage={errors.date}
                onChange={setDate} name={""} />
            </Box>

            <Box flex={1}>
              <TimeInput
                label="Time"
                value={time}
                min={minTime}
                error={!!errors.time}
                validationMessage={errors.time}
                onChange={setTime} name={""} />
            </Box>
          </Flex>

          <TextArea
            label="Write a message"
            placeholder="Type a message..."
            name=""
            value={message}
            maxLength={250}
            error={!!errors.message || message.length >= 250}
            validationMessage={
              errors.message
                ? errors.message
                : message.length >= 250
                  ? "Maximum 250 characters only allowed"
                  : "This field allows a Maximum of 250 characters"
            }
            onChange={(v) => {
              setMessage(String(v));
              setErrors({ ...errors, message: undefined });
            }}
          />
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Button
          variant="secondary"
          onClick={() => actions.closeOverlay("schedule-modal")}
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