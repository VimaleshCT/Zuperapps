const translations: Record<string, Record<string, string>> = {
  en: {
    sms: "SMS",
    scheduleSms: "Schedule SMS",
    auditLog: "Audit Log",
    fromNumber: "From Number",
    writeMessage: "Write a Message",
    sendSms: "Send SMS",
    schedule: "Schedule SMS",
    cancel: "Cancel",
    contact: "Contact",
    timezone: "Timezone",
    date: "Date",
    time: "Time",
  },
  es: {
    sms: "SMS",
    scheduleSms: "Programar SMS",
    auditLog: "Registro",
    fromNumber: "Número de origen",
    writeMessage: "Escribe un mensaje",
    sendSms: "Enviar SMS",
    schedule: "Programar SMS",
    cancel: "Cancelar",
    contact: "Contacto",
    timezone: "Zona horaria",
    date: "Fecha",
    time: "Hora",
  },
};

export const getTranslation = (locale: string, key: string): string => {
  return translations[locale]?.[key] || translations["en"][key];
};