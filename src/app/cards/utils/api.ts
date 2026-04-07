const BASE_URL = "http://localhost:4001/api/v1/hubspot";

export const api = {
  getNumbers: (portalId: string) =>
    fetch(`${BASE_URL}/provider/numbers?portalId=${portalId}`),

  getMessages: (params: any) =>
    fetch(
      `${BASE_URL}/messages?portalId=${params.portalId}&objectId=${params.objectId}&toNumber=${params.toNumber || ""}`
    ),

  getLogs: (params: any) =>
    fetch(
      `${BASE_URL}/message-logs?portalId=${params.portalId}&objectId=${params.objectId}&page=${params.page}&perPage=${params.perPage}`
    ),

  sendMessage: (body: any) =>
    fetch(`${BASE_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  cancelSchedule: (messageId: string) =>
    fetch(`${BASE_URL}/schedule/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId }),
    }),
};