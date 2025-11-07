// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { updateAgent } from "@/Services/auth";
// import Swal from "sweetalert2";
// import { FadeLoader } from "react-spinners";
// import ClipLoader from "react-spinners/ClipLoader";

// const AssignNumberModal = ({
//   isOpen,
//   onClose,
//   agentId,
//   onCallApi,
//   agentDetails,
//   onAssignNumber,
//   onAgentDetailsPage,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [areaCode, setAreaCode] = useState();
//   const [popupMessage, setPopupMessage] = useState("");
//   const [popupType, setPopupType] = useState("success");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//     // console.log(agentDetails, "agentDetails");
//   const handleAssignNumber = async () => {
//     try {   
//       if (isSubmitting) return;
//       setLoading(true);
//       setIsSubmitting(true);

//       const payload = {
//         inbound_agent_id: agentId,
//         outbound_agent_id: agentId,
//         inbound_agent_version: 0,
//         outbound_agent_version: 0,
//         area_code: parseInt(areaCode) || 406,
//         number_provider: "twilio",
//       };

//        const response= await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/agent/assignNumberToAgent?agentId=${agentId}`,
//         { payload } // ⬅️ this wraps payload inside an object
//         );    //   const response = await axios.post(
//     //     "https://api.retellai.com/create-phone-number",
//     //     payload,
//     //     {
//     //       headers: {
//     //         Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
//     //         "Content-Type": "application/json",
//     //       },
//     //     }
//     //   );
//     // console.log(response);
//       if(response.data.status == true) {
//         const phoneNumber = response?.data?.phone_number;

//       Swal.fire(`Number ${phoneNumber} assigned!`);
//       if (onAgentDetailsPage) onAssignNumber();
//     }
// } catch (error) {
//       console.error("Error assigning number:", error.response?.data || error.message);
//       Swal.fire("Error",error?.response?.data?.message || "Error assigning number",'error');
//     } finally {
//       setLoading(false);
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     try {
//       const businessDetails = agentDetails?.business || agentDetails;
//       setAreaCode(businessDetails.area_code);
//     } catch (err) {
//       console.error("Failed to parse phone JSON:", err);
//     }
//   }, [agentDetails]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
//         <button
//           className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
//           disabled={loading || isSubmitting}
//           onClick={onClose}
//         >
//           ×
//         </button>

//         <h2 className="text-xl font-bold text-center text-[#5a20d8] mb-2">Assign a New Number</h2>

//         <p className="text-sm text-gray-800 mb-4">
//           <strong className="text-[#5a20d8]">Disclaimer:</strong> You will not be able to change
//           this number before <strong>25 days</strong>.
//         </p>

//         <p className="text-sm font-semibold mb-2">You will be able to use this number as below:</p>

//         <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1">
//           <li>1. Provide this number as your inbound support number.</li>
//           <li>2. Forward calls from your current support number to this Rexpt.in number.</li>
//         </ul>

//         <div
//           className={`w-full ${loading || isSubmitting ? "pointer-events-none opacity-60" : ""}`}
//         >
//           <button
//             className="bg-[#5a20d8] text-white w-full py-2 rounded-lg text-sm font-semibold hover:bg-[#4a1ab3] transition flex items-center justify-center"
//             onClick={handleAssignNumber}
//             disabled={loading || isSubmitting}
//           >
//             {loading ? (
//             <div className="flex items-center gap-2">
//                 <ClipLoader size={22}  color="#ffffffff" />
//                 <span>Assigning...</span>
//                 </div>
//             ) : (
//               "Assign Number"
//             )}
//           </button>
//         </div>

//         <p className="text-xs mt-4 text-center text-gray-500">
//           ✨ <strong>Coming Soon:</strong> We will provide option to choose your custom new support
//           number.
//         </p>
//       </div>


//     </div>
//   );
// };

// export default AssignNumberModal;


"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { updateAgent } from "@/Services/auth";
import Swal from "sweetalert2";
import { FadeLoader } from "react-spinners";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Loader2, User, Building2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { createNumberOrder, fetchAvailablePhoneNumberByCountry, importPhoneToAgentFromAdmin } from "@/Services/auth";

const AssignNumberModal = ({
  isOpen,
  onClose,
  agentId,
  onCallApi,
  agentDetails,
  onAssignNumber,
  onAgentDetailsPage,
}) => {
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneData, setPhoneData] = useState({
    countryCode: "",
    stateCode: "",
    city: "",
    selectedNumber: "",
  });
  const [stateNameFull, setStateNameFull] = useState("");
  const [availableNumbers, setAvailableNumbers] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isRotating, setIsRotating] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCustomPhone, setIsCustomPhone] = useState(false);
  const [customPhoneInput, setCustomPhoneInput] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const stateInputRef = useRef<HTMLInputElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestVersion = useRef(0);
  const token = localStorage.getItem("token") || "";
  const [googlePlacesLoaded, setGooglePlacesLoaded] = useState(false);

  const languages = [
    {
      name: "English (US)",
      locale: "en-US",
      countryCode: "US",
      countryName: "United States",
      flag: "/images/en-US.png",
    },
    {
      name: "French (Canada)",
      locale: "fr-CA",
      countryCode: "CA",
      countryName: "Canada",
      flag: "/images/fr-CA.png",
    },
  ];
  console.log('agentDetails',agentDetails)
  const businessDetails = agentDetails?.business || agentDetails;
  const agentName = agentDetails?.agentName || "Unknown";
  const businessName = businessDetails?.name || "Unknown";

  useEffect(() => {
    if (window.google?.maps?.places) {
      setGooglePlacesLoaded(true);
    } else {
      console.warn("Google Maps Places API not loaded.");
    }
  }, []);

  useEffect(() => {
    try {
      const initialCountryCode = businessDetails?.countryCode || "US";
      const initialStateCode = businessDetails?.stateCode || "";
      const initialCity = businessDetails?.city || "";
      const initialStateName = businessDetails?.state || "";

      setPhoneData({
        countryCode: initialCountryCode,
        stateCode: initialStateCode,
        city: initialCity,
        selectedNumber: "",
      });
      setStateNameFull(initialStateName);
    } catch (err) {
      console.error("Failed to parse agent details:", err);
    }
  }, [agentDetails]);

  // Updated: Fetch on country changes (even if state is empty), so initial load fetches national if no state.
  useEffect(() => {
    if (phoneData.countryCode && token && !isCustomPhone) {
      fetchNumbersWithFallback();
    } else {
      setInitialLoading(false);
    }
  }, [phoneData.countryCode, phoneData.stateCode, isCustomPhone]);

  useEffect(() => {
    const initAutocomplete = (el: HTMLInputElement | null, setValue: (value: string) => void, types: string) => {
      if (!el || !window.google?.maps?.places) return;
      const ac = new window.google.maps.places.Autocomplete(el, {
        types: [types],
        fields: ["address_components"],
      });
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        (place.address_components || []).forEach((c) => {
          if (types === "(regions)" && c.types.includes("administrative_area_level_1")) {
            setPhoneData((prev) => ({ ...prev, stateCode: c.short_name }));
            setStateNameFull(c.long_name);
            setErrors((prev) => ({ ...prev, stateCode: "" }));
          } else if (types === "(regions)" && c.types.includes("locality")) {
            setPhoneData((prev) => ({ ...prev, city: c.long_name }));
            setErrors((prev) => ({ ...prev, city: "" }));
          }
        });
      });
    };
    if (googlePlacesLoaded && !isCustomPhone) {
      initAutocomplete(stateInputRef.current, (value) => setPhoneData((prev) => ({ ...prev, stateCode: value })), "(regions)");
      initAutocomplete(cityInputRef.current, (value) => setPhoneData((prev) => ({ ...prev, city: value })), "(regions)");
    }
  }, [googlePlacesLoaded, isCustomPhone]);

  // Debounced fetch on city/state changes (unchanged).
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (phoneData.countryCode && phoneData.stateCode && token && !isCustomPhone) {
      debounceTimeoutRef.current = setTimeout(() => {
        fetchNumbersWithFallback();
      }, 600);
    }
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [phoneData.city, phoneData.stateCode, phoneData.countryCode, isCustomPhone]);

  console.log('phoneData', phoneData);

  useEffect(() => {
    const validCountryCodes = languages.map((lang) => lang.countryCode);
    if (!validCountryCodes.includes(phoneData.countryCode) && phoneData.countryCode !== "") {
      setPhoneData((prev) => ({ ...prev, countryCode: "US", stateCode: "", city: "", selectedNumber: "" }));
      setStateNameFull("");
      setAvailableNumbers([]);
      setErrors((prev) => ({ ...prev, countryCode: "Country is required" }));
    }
  }, [phoneData.countryCode]);

  // Updated: Make fetchNumbersWithFallback accept optional params to avoid stale state.
  const fetchNumbersWithFallback = async (overrideCountryCode?: string, overrideStateCode?: string, overrideCity?: string) => {
    const currentVersion = ++requestVersion.current;
    setLoading(true);

    try {
      await tryWithLevels(currentVersion, overrideCountryCode || phoneData.countryCode, overrideStateCode || phoneData.stateCode, overrideCity || phoneData.city);
    } catch (err: any) {
      console.error("Error fetching numbers:", err);

      if (requestVersion.current !== currentVersion) return;

      setAvailableNumbers([]);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.error ||
          err.message ||
          "Failed to fetch available numbers. Please try again.",
        showCancelButton: true,
        confirmButtonText: "Retry",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          fetchNumbersWithFallback(overrideCountryCode, overrideStateCode, overrideCity);
        }
      });
    } finally {
      if (requestVersion.current === currentVersion) {
        setLoading(false);
        setInitialLoading(false);
      }
    }
  };

  const tryWithLevels = async (currentVersion: number, countryCode: string, stateCode: string, city: string) => {
    const levels = [
      { city, state: stateCode },
      { city: "", state: stateCode },
      { city: "", state: "" },
    ];

    let found = false;

    for (let i = 0; i < levels.length; i++) {
      const { city: levelCity, state: levelState } = levels[i];
      try {
        const res = await fetchAvailablePhoneNumberByCountry(
          token,
          countryCode,
          levelCity,
          levelState
        );

        if (requestVersion.current !== currentVersion) return;

        if (res?.success && res?.data?.length > 0) {
          if (!overrideCountryCode) setPhoneData((prev) => ({ ...prev, city: levelCity, stateCode: levelState }));
          setAvailableNumbers(res.data.map((item: any) => item.phone_number));
          found = true;
          return;
        }
      } catch (err) {
        console.error(`Error at level ${i + 1}:`, err);
      }
    }

    if (!found) {
      try {
        const res = await fetchAvailablePhoneNumberByCountry(
          token,
          countryCode,
          "",
          ""
        );

        if (requestVersion.current !== currentVersion) return;

        if (res?.success && res?.data?.length > 0) {
          setAvailableNumbers(res.data.map((item: any) => item.phone_number));
          return;
        }
      } catch (err) {
        console.error("Final fallback (country only) error:", err);
      }
    }

    setAvailableNumbers([]);
  };

  const handleRefresh = async () => {
    setIsRotating(true);
    try {
      const getRandomDigit = () => Math.floor(Math.random() * 9 + 1).toString();
      const startsWith = getRandomDigit();
      const endsWith = getRandomDigit();
      const res = await fetchAvailablePhoneNumberByCountry(token, phoneData.countryCode, phoneData.city, phoneData.stateCode, startsWith, endsWith);
      if (res?.success && res?.data?.length > 0) {
        setAvailableNumbers(res.data.map((item: any) => item.phone_number));
      } else {
        const fallbackRes = await fetchAvailablePhoneNumberByCountry(token, phoneData.countryCode, "", phoneData.stateCode);
        if (fallbackRes?.success && fallbackRes?.data?.length > 0) {
          setAvailableNumbers(fallbackRes.data.map((item: any) => item.phone_number));
        } else {
          setAvailableNumbers([]);
        }
      }
    } catch (error: any) {
      console.error("Error in handleRefresh:", error);
      setAvailableNumbers([]);
    } finally {
      setIsRotating(false);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!phoneData.selectedNumber) newErrors.selectedNumber = "Please select or enter a phone number";
    if (isCustomPhone && !customPhoneInput.match(/^\+?\d{10,15}$/)) {
      newErrors.customPhone = "Please enter a valid phone number (10-15 digits)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNumberClick = (num: string) => {
    setPhoneData((prev) => ({ ...prev, selectedNumber: num }));
    setModalOpen(true);
    setErrors((prev) => ({ ...prev, selectedNumber: "" }));
  };

  const handleCustomPhoneSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setLoading(true);

    try {
      if (!agentId) {
        throw new Error("Agent ID is missing");
      }
      const response = await importPhoneToAgentFromAdmin(token, customPhoneInput, agentId, agentId);
      if (response) {
        Swal.fire(`Number ${customPhoneInput} assigned!`);
        if (onAgentDetailsPage) onAssignNumber();
        onClose();
      } else {
        throw new Error("The phone number could not be assigned. Please check and try again.");
      }
    } catch (error: any) {
      console.error("Error assigning custom number:", error);
      Swal.fire("Error", error?.message || "Error assigning number", 'error');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleBuyNumber = async () => {
    if (!validate()) {
      setModalOpen(false);
      return;
    }
    setLoading(true);
    setIsSubmitting(true);
    try {
      if (!agentId) {
        throw new Error("Agent ID is missing");
      }
      await createNumberOrder(token, phoneData.selectedNumber, agentId);
      await updateAgent(agentId, { voip_numbers: [phoneData.selectedNumber] });
      Swal.fire(`Number ${phoneData.selectedNumber} assigned!`);
      if (onAgentDetailsPage) onAssignNumber();
      onClose();
    } catch (error: any) {
      console.error("Error assigning number:", error);
      let errorMsg = "Failed to assign number.";
      if (error?.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error?.message) {
        errorMsg = error.message;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        confirmButtonText: "Retry",
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
      setModalOpen(false);
    }
  };

  const filteredNumbers = availableNumbers.filter((num) => num.includes(search.trim()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
          disabled={loading || isSubmitting}
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-center text-[#5a20d8] mb-2">Assign Phone Number</h2>

        {/* <p className="text-sm text-gray-800 mb-4">
          <strong className="text-[#5a20d8]">Disclaimer:</strong> You will not be able to change
          this number before <strong>25 days</strong>.
        </p> */}
{/* 
        <p className="text-sm font-semibold mb-2">You will be able to use this number as below:</p>

        <ul className="list-disc list-inside text-sm text-gray-700 mb-6 space-y-1">
          <li>1. Provide this number as your inbound support number.</li>
          <li>2. Forward calls from your current support number to this Rexpt.in number.</li>
        </ul> */}

        <div
          className={`w-full ${loading || isSubmitting ? "pointer-events-none opacity-60" : ""}`}
        >
          {/* <Button
            variant="outline"
            onClick={() => {
              setIsCustomPhone(!isCustomPhone);
              setPhoneData((prev) => ({ ...prev, selectedNumber: "" }));
              setCustomPhoneInput("");
              setErrors({});
              setAvailableNumbers([]);
            }}
            className="mb-4 w-full"
          >
            {isCustomPhone ? "Select from Available Numbers" : "Use Custom Phone Number"}
          </Button> */}

          {isCustomPhone ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customPhone">Enter Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="customPhone"
                  value={customPhoneInput}
                  onChange={(e) => {
                    setCustomPhoneInput(e.target.value);
                    setErrors((prev) => ({ ...prev, customPhone: "" }));
                  }}
                  placeholder="Enter phone number (e.g., +1234567890)"
                  className="w-full"
                />
                {!/^\+\d{1,15}$/.test(customPhoneInput) && customPhoneInput && (
                  <p className="text-sm text-red-600">
                    ⚠ Please enter a valid number starting with + and country code.
                  </p>
                )}
                {errors.customPhone && <p className="text-sm text-red-600">{errors.customPhone}</p>}
              </div>
              <Button
                onClick={handleCustomPhoneSubmit}
                disabled={
                  loading || isSubmitting ||
                  !customPhoneInput ||
                  !/^\+\d{1,15}$/.test(customPhoneInput)
                }
                className={`bg-[#5a20d8] hover:bg-[#4a1ab3] w-full ${loading || isSubmitting ||
                  !customPhoneInput ||
                  !/^\+\d{1,15}$/.test(customPhoneInput)
                  ? "cursor-not-allowed opacity-50"
                  : ""
                  }`}
              >
                {loading || isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <ClipLoader size={22} color="#ffffffff" />
                    <span>Assigning...</span>
                  </div>
                ) : (
                  "Add Number"
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {initialLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="countryCode">Country <span className="text-red-500">*</span></Label>
                    <Select
                      value={phoneData.countryCode}
                      onValueChange={(v) => {
                        setPhoneData((prev) => ({ ...prev, countryCode: v, stateCode: "", city: "", selectedNumber: "" }));
                        setStateNameFull("");
                        setAvailableNumbers([]);
                        setSearch("");
                        setErrors((prev) => ({ ...prev, countryCode: "", selectedNumber: "" }));
                        if (v) {
                          fetchNumbersWithFallback(v, "", "");
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.countryCode} value={lang.countryCode}>
                            <span className="flex items-center gap-2">
                              <img
                                src={`https://flagcdn.com/w20/${lang.locale.split("-")[1]?.toLowerCase()}.png`}
                                alt={lang.countryName}
                                className="w-5 h-5"
                              />
                              {lang.countryName}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.countryCode && <p className="text-sm text-red-600">{errors.countryCode}</p>}
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province <span className="text-red-500">*</span></Label>
                      <Input
                        id="state"
                        ref={stateInputRef}
                        value={stateNameFull}
                        onChange={(e) => {
                          setStateNameFull(e.target.value);
                          setErrors((prev) => ({ ...prev, stateCode: "" }));
                          if (!googlePlacesLoaded) {
                            setPhoneData((prev) => ({ ...prev, stateCode: e.target.value }));
                          }
                        }}
                        autoComplete="off"
                        placeholder="Enter state"
                        onBlur={() => phoneData.countryCode && phoneData.stateCode && fetchNumbersWithFallback()}
                      />
                      {errors.stateCode && <p className="text-sm text-red-600">{errors.stateCode}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        ref={cityInputRef}
                        value={phoneData.city}
                        onChange={(e) => {
                          setPhoneData((prev) => ({ ...prev, city: e.target.value }));
                          setErrors((prev) => ({ ...prev, city: "" }));
                        }}
                        autoComplete="off"
                        placeholder="Enter city"
                        onBlur={() => phoneData.countryCode && phoneData.stateCode && fetchNumbersWithFallback()}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search phone number"
                      />
                      <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isRotating || loading || isSubmitting}
                        className={isRotating ? "animate-spin" : ""}
                        size="sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Available Numbers <span className="text-red-500">*</span></Label>
                    <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                      {loading || isSubmitting ? (
                        <div className="flex justify-center items-center">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      ) : filteredNumbers.length > 0 ? (
                        filteredNumbers.map((num) => (
                          <div
                            key={num}
                            className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded ${phoneData.selectedNumber === num ? "bg-[#5a20d8]/10" : ""}`}
                            onClick={() => handleNumberClick(num)}
                          >
                            <input
                              type="radio"
                              name="phoneNumber"
                              value={num}
                              checked={phoneData.selectedNumber === num}
                              onChange={() => handleNumberClick(num)}
                              className="cursor-pointer"
                            />
                            <span className="text-sm">{num}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center">No numbers available. Try refreshing or changing location.</p>
                      )}
                    </div>
                    {errors.selectedNumber && <p className="text-sm text-red-600">{errors.selectedNumber}</p>}
                  </div>
                </>
              )}
            </div>
          )}

        
        </div>

        <Dialog.Root open={isModalOpen} onOpenChange={setModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[60]" />
            <Dialog.Content className="sm:max-w-[425px] bg-white p-6 rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[70]">
              <Dialog.Title className="text-xl font-bold text-[#5a20d8]">Confirm Phone Number</Dialog.Title>
              <Dialog.Description className="text-gray-600 mb-4">
                You have chosen to assign <strong>{phoneData.selectedNumber}</strong> to your:
              </Dialog.Description>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  <span>
                    <strong>Agent :</strong> {agentName}
                  </span>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                  <span>
                    <strong>Business:</strong> {businessName}
                  </span>
                </div> */}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleBuyNumber}
                  disabled={loading || isSubmitting}
                  className="bg-[#5a20d8] hover:bg-[#4a1ab3]"
                >
                  {loading || isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Assigning...
                    </span>
                  ) : (
                    "Assign to agent"
                  )}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default AssignNumberModal;