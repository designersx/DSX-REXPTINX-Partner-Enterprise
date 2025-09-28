import axios from "axios";
import { getUserId } from "utils/auth";

// const URL = "https://rex-bk.truet.net";
console.log(process.env.NEXT_PUBLIC_API_URL)
// admin login api

export const Login = async (email, password) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/EnterprisePartnerLogin`, { email, password });
    console.log(res)
    return res.data;
  } catch (error) {
    console.log(error)
    return error.response.data;
    if (error.response?.data?.msg) {
      throw new Error(error.response.data.msg);
    }

  }
};

export const fetchAgent = async () => {
  try {
    const userId = getUserId()
    const res = await axios.get(

      `${process.env.NEXT_PUBLIC_API_URL}/api/agent/getKnowledgeBaseBasedUser/${userId}`

    );
    return res.data; // response data
  } catch (err) {
    console.error("Error fetching agent:", err);
    throw err; // rethrow if needed
  }
}
export const listSiteMap = async (url) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/map/list-sitemap2`,
      { url },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting agent file:",
      error.response?.data || error.message
    );
    throw new Error("Error deleting agent file");
  }
};

export const validateWebsite = async (websiteUrl) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/validate-website`, { website: websiteUrl });
    return res.data;
  } catch (error) {
    console.error("Error validating website:", error);
    return { valid: false, reason: 'Error validating website' };
  }
};

export const AddKB = async (formData) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/AddEnterpriseKnowledgeBase`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (error) {
    console.error("Error validating website:", error);
    return { valid: false, reason: 'Error validating website' };
  }
};
export async function getAvailableMinutes(userId) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/enterpriseAgent/getAvailableMinutes/${userId}`,

    );
    return response.data;
  } catch (error) {
    console.error("Error fetching available minutes:", error);
    throw error;
  }
}
export const getAgentCallById = async (agentId, callId, start_timestamp) => {
  try {
    // const res = await api.get(`/agent/user/${userId}/agent/calls`, {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/callHistory/getSpecificCallData/call/${agentId}/${callId}?start_timestamp=${start_timestamp}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching agent calls:", error.response?.data || error.message);
    throw new Error("Failed to fetch agent calls");
  }
};

export const getKbListByUserId = async (userId) => {
  try {
    // const res = await api.get(`/agent/user/${userId}/agent/calls`, {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/getEnterpriseKBbyUserId/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching agent calls:", error.response?.data || error.message);
    throw new Error("Failed to fetch agent calls");
  }
};

export const assignKnowledgeBaseToAgent = async ({ userId, kbId, agentId }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/AssignKnowledgeBaseToAgent`,
      {
        userId,
        kbId,
        agentId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    return res.data; // response from the API
  } catch (error) {
    console.error(
      "Error assigning KB to agent:",
      error.response?.data || error.message
    );
    throw new Error("Failed to assign KB to agent");
  }
}

export const unassignedKnowledgeBasefromAgent = async ({  kbId, agentId }) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/UnassignKnowledgeBaseFromAgent`,
      {
        kbId,
        agentId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    return res.data; // response from the API
  } catch (error) {
    console.error(
      "Error assigning KB to agent:",
      error.response?.data || error.message
    );
    throw new Error("Failed to assign KB to agent");
  }
}

export const deleteKnowledgeBase = async ({ kbId, userId }) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/DeleteEnterpriseKnowledgeBase`, { kbId, userId });
    return response.data; // { success: true, message: "..."}
  } catch (err: any) {
    console.error("Delete KB API error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error || "Failed to delete knowledge base");
  }
};

export const updateKb = async (formData) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/UpdateEnterpriseKnowledgeBase`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (error) {
    console.error("Error validating website:", error);
    return { valid: false, reason: 'Error validating website' };
  }
};