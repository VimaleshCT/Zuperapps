const BASE_URL = "https://nondeciduously-supratemporal-eleonor.ngrok-free.dev/api/v1/hubspot";

export const createApi = (hubspot: any) => ({

  getNumbers: async (portalId: string) => {
    const res = await hubspot.fetch(
      `${BASE_URL}/provider/numbers?portalId=${portalId}`,
      { method: "GET" }
    );
    return res.json(); 
  },

  getMessages: async (params: any) => {
    const res = await hubspot.fetch(
      `${BASE_URL}/messages?portalId=${params.portalId}&objectId=${params.objectId}`,
      { method: "GET" }
    );
    return res.json(); 
  },

  getLogs: async (params: any) => {
    const res = await hubspot.fetch(
      `${BASE_URL}/message-logs?portalId=${params.portalId}&objectId=${params.objectId}&page=${params.page}&perPage=${params.perPage}`,
      { method: "GET" }
    );
    return res.json(); 
  },


  sendMessage: async (body: any) => {
    const res = await hubspot.fetch(`${BASE_URL}/messages`, {
      method: "POST",
      body: body, 
      timeout: 50000,
    });
    return res.json();
  },

  cancelSchedule: async (messageId: string) => {
    const res = await hubspot.fetch(`${BASE_URL}/schedule/cancel`, {
      method: "POST",
      body: { messageId }, 
    });
    return res.json();
  },
});