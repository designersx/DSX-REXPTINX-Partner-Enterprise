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

