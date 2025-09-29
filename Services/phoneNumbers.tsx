// /getPhoneNumbersFromEnterPrise/:id
import axios from "axios";
console.log(process.env.NEXT_PUBLIC_API_URL)
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export const fetchAvailablePhoneNumberByCountry = async (token, country_code, locality, administrative_area, startsWith, endsWith, phone_number_type) => {
    let t = token
    try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/telnyx/available-numbers`, {
            params: {
                country_code,
                locality,
                administrative_area,
                starts_with: startsWith,
                ends_with: endsWith,
                phone_number_type: phone_number_type
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${t}`,
            }
        });

        return res.data;
    } catch (error) {
        return error.response?.data

    }
}

export const buyNumberFromEnterPrise = async (token, userId, phoneNumber, phone_number_type,
    agent_id, sip_termination_uri, sip_connection_id,
    sip_trunk_auth_username, sip_trunk_auth_password, import_type) => {
    let t = token
    try {
        const res = await axios.post(`${NEXT_PUBLIC_API_URL}/api/telnyx/buyNumberFromEnterPrise`,
            { token, userId, phoneNumber, phone_number_type, import_type }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${t}`,
            }
        });
        console.log(res, "res")
        return res.data;
    } catch (error) {
        console.log(error)
        return error.response?.data

    }
}
export const getPhoneNumbersWithUserId = async (token, userId) => {
    try {
        const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/telnyx/getPhoneNumbersFromEnterPrise/${userId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            }
        )
        return res
    } catch (error) {
        console.log(error)
    }
}
export const assignNumberToAgent = async (token, inbound_agent_id, outbound_agent_id, phoneNumber, importStatus1) => {
    try {
        const res = await axios.post(`${NEXT_PUBLIC_API_URL}/api/telnyx/assignNumberFromEnterPrise`, {
            inbound_agent_id: inbound_agent_id,
            outbound_agent_id: outbound_agent_id,
            phoneNumber: phoneNumber,
            importStatus: importStatus1
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        })
        return res
    } catch (error) {
        console.log(error)
    }
}
export const numberRequirementsToBuyNumber = async (
    token, userId, country_code,
    phone_number_type, phoneNumber, data, import_type

) => {

    try {
        // Create FormData instance
        const formData = new FormData();

        // Append simple text fields
        formData.append("userId", userId);
        formData.append("phone_number_type", phone_number_type);
        formData.append("phoneNumber", phoneNumber);
        formData.append("import_type", import_type)
        // Append other fields from `data`
        if (data.companyRegNumber) formData.append("companyRegNumber", data.companyRegNumber);
        if (data.companyWebsite) formData.append("companyWebsite", data.companyWebsite);
        if (data.businessUseCase) formData.append("businessUseCase", data.businessUseCase);
        if (data.contactInfo) formData.append("contactInfo", data.contactInfo);
        if (data.address) formData.append("address", data.address);
        //new fildes
        if (data.business_name) formData.append("business_name", data.business_name);
        if (data.country_code) formData.append("country_code", data.country_code);
        if (data.first_name) formData.append("first_name", data.first_name);
        if (data.last_name) formData.append("last_name", data.last_name);
        if (data.locality) formData.append("locality", data.locality);
        if (data.phone_number) formData.append("phone_number", data.phone_number);
        if (data.postal_code) formData.append("postal_code", data.postal_code);
        if (data.street_address) formData.append("street_address", data.street_address);
        if (data.administrative_area) formData.append("administrative_area", data.administrative_area);
        // Append files if present
        if (data.passportOrCert) formData.append("passportOrCert", data.passportOrCert); // File object
        if (data.proofOfAddress) formData.append("proofOfAddress", data.proofOfAddress); // File object


        const res = await axios.post(`${NEXT_PUBLIC_API_URL}/api/telnyx/numberRequirementsToBuyNumber`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        })
        return res
        console.log(res, "RESPONSE")
    } catch (error) {

    }
}