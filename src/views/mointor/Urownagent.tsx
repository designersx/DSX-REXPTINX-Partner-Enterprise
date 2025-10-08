// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Typography } from '@mui/material';
// // import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
// import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import Button from '@mui/material/Button';
// import { Play, Pause, MoreVertical, Edit, Trash2, Power, PhoneCall, Link } from 'lucide-react';
// import { countAgentsbyUserId, createAgent, getRetellVoices } from '../../../Services/auth';
// import { languages } from '../../lib/languageOptions';
// import Swal from 'sweetalert2';
// import { FadeLoader } from 'react-spinners';
// // import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
// // import Modal from './ui/modal';
// import CallTest from './Urownagenthelper/CallTest';
// import { RetellWebClient } from 'retell-client-js-sdk';
// import AssignNumberModal from './Urownagenthelper/AssignNumberModal';
// import PhoneInput from 'react-phone-input-2';
// import { isValidPhoneNumber, parsePhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
// import 'react-phone-input-2/lib/style.css';
// import ClipLoader from 'react-spinners/ClipLoader';

// const avatars = {
//   Male: [
//     { img: '/images/Male-01.png' },
//     { img: '/images/Male-02.png' },
//     { img: '/images/Male-03.png' },
//     { img: '/images/Male-04.png' },
//     { img: '/images/Male-05.png' }
//   ],
//   Female: [
//     { img: '/images/Female-01.png' },
//     { img: '/images/Female-02.png' },
//     { img: '/images/Female-03.png' },
//     { img: '/images/Female-04.png' },
//     { img: '/images/Female-05.png' },
//     { img: '/images/Female-06.png' }
//   ]
// };

// export default function AgentFormSetup() {
//   const [form, setForm] = useState<any>({
//     language: '',
//     agentLanguage: '',
//     agentName: '',
//     gender: '',
//     voice: '',
//     selectedVoice: null,
//     avatar: ''
//   });
//   const [voices, setVoices] = useState<any[]>([]);
//   const [playingIdx, setPlayingIdx] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [cancelLoading, setcancelLoading] = useState(false);
//   const audioRefs = useRef<HTMLAudioElement[]>([]);
//   const [agentExists, setAgentExists] = useState<null | boolean>(null);
//   const [agentData, setAgentData] = useState<any>(null);
//   const [refresh, setRefresh] = useState(false);

//   const [selectedAgent, setSelectedAgent] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showCallModal, setShowCallModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [assignPhoneModal, setAssignPhoneModal] = useState(false);
//   const [showCancelConfirm, setShowCancelConfirm] = useState(false);
//   const [showDeactivateModal, setShowDeactivateModal] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [isCallActive, setIsCallActive] = useState(false);
//   const [callLoading, setCallLoading] = useState(false);
//   const [isCallInProgress, setIsCallInProgress] = useState(false);
//   const [callId, setCallId] = useState('');
//   const isEndingRef = useRef(false);
//   const [retellWebClient, setRetellWebClient] = useState(null);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
//   const [selectedAgentDetails, setSelectedAgentDetails] = useState<any>(null);
//   const [mode, setMode] = useState<'create' | 'edit'>('create');
//   const [showCallForwardingModal, setShowCallForwardingModal] = useState(false); // State for modal
//   const [phoneError, setPhoneError] = useState('');
//   const [phone, setPhone] = useState('');
//   const phoneInputRef = useRef(null);

//   function getCallForwarding(callForwarding: string) {
//     let msg = '';
//     if (callForwarding) {
//       msg = `Transition to CallTransfer_confirmation.`;
//     } else {
//       msg = `Say: "Call forwarding is not available.`;
//     }
//     return msg;
//   }

//   const handleUpdateLLM_ForCallForwarding = async (
//     agentId: string,
//     partnerName: string,
//     llm: string,
//     phone: string,
//     callForwarding: boolean,
//     callForwardingOptions: any
//   ) => {
//     const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

//     const agentConfig = {
//       version: 0,
//       general_tools: [
//         {
//           type: 'end_call',
//           name: 'end_call',
//           description: 'End the call with user.'
//         },
//         {
//           type: 'extract_dynamic_variable',
//           name: 'extract_user_details',
//           description: "Extract the user's details like name, email, phone number, address, and reason for calling from the conversation",
//           variables: [
//             { type: 'string', name: 'email', description: "Extract the user's email address from the conversation" },
//             { type: 'number', name: 'phone', description: "Extract the user's phone number from the conversation" },
//             { type: 'string', name: 'address', description: "Extract the user's address from the conversation" },
//             { type: 'string', name: 'reason', description: "Extract the user's reason for calling from the conversation" },
//             { type: 'string', name: 'name', description: "Extract the user's name from the conversation" }
//           ]
//         }
//       ],
//       states: [
//         {
//           name: 'information_collection',
//           state_prompt: `Greet the user with the begin_message and assist with their query.

//                                 If the user wants to transfer the call:
//                                 ${getCallForwarding(callForwarding)}

//                                 If the user asks for an appointment (e.g., "appointment", "book", "schedule"),
//                                 transition to appointment_booking.

//                                 If the user is silent or unclear, say: "Sorry, I didn’t catch that. Could you please repeat?"
//                                 If the user wants to end the call transition to end_call_state`,
//           edges: [{ destination_state_name: 'CallTransfer_confirmation', description: 'User wants to transfer call.' }]
//         },
//         {
//           name: 'appointment_booking',
//           state_prompt: '## Task\nYou will now help the user book an appointment.'
//         },
//         {
//           name: 'CallTransfer_confirmation',
//           state_prompt: `
//                               Say: Would you like me to connect you with {{partner}}? Please say yes or no."
//                               Wait for their response.
//                               If the user says yes, transition to call_transfer.
//                               If the user says no, transition to information_collection.
//                               If the response is unclear, repeat the question once.
//                           `,
//           edges: [
//             { destination_state_name: 'call_transfer', description: 'User agreed to speak to Partner.' },
//             { destination_state_name: 'information_collection', description: 'User declined to speak to Partner.' }
//           ],
//           tools: []
//         },
//         {
//           name: 'call_transfer',
//           state_prompt: `Connecting you with Mr. {{partner}} now. Please hold.`,
//           tools: [
//             {
//               type: 'transfer_call',
//               name: 'transfer_to_Partner',
//               description: 'Transfer the call to the Partner.',
//               transfer_destination: { type: 'predefined', number: '{{business_Phone}}' },
//               transfer_option: { type: 'cold_transfer', public_handoff_option: { message: 'Please hold while I transfer your call.' } },
//               speak_during_execution: true,
//               speak_after_execution: true,
//               failure_message:
//                 "Sorry, I couldn't transfer your call. Please contact us at {{business_email}} or call {{business_Phone}} directly."
//             }
//           ],
//           edges: []
//         },
//         {
//           name: 'end_call_state',
//           state_prompt: `Politely end the call by saying: "Thank you for calling. Have a great day!"`,
//           tools: [{ type: 'end_call', name: 'end_call1', description: 'End the call with the user.' }],
//           edges: []
//         }
//       ],
//       starting_state: 'information_collection',
//       default_dynamic_variables: {
//         customer_name: 'John Doe',
//         timeZone: timeZone,
//         partner: partnerName,
//         business_Phone: phone || ''
//       }
//     };
//     try {
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/agent/updatePartnerAgentConfig`,
//         {
//           agentId,
//           llm,
//           callForwarding,
//           callForwardingOptions,
//           agentConfig
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       Swal.fire('Success', 'Call forwarding Settings updated!', 'success');
//     } catch (error) {
//       console.error('Error updating call forwarding:', error);
//       Swal.fire('Error', 'An error occurred while updating call forwarding', 'error');
//     }
//   };
//   const handleStopCallForwardingSubmit = async () => {
//     setcancelLoading(true);
//     const partnerName = localStorage.getItem('partnername') || 'Partner';
//     await handleUpdateLLM_ForCallForwarding(agentData.agent_id, partnerName, agentData.llmId, '', false, null);
//     setcancelLoading(false);
//     setRefresh((prev) => !prev);
//     setShowCallForwardingModal(false);
//     setPhone('');
//     setPhoneError('');
//   };

//   // }
//   const handleCallForwardingSubmit = async () => {
//     if (!phone) {
//       setPhoneError('Phone number is required.');
//       return;
//     }
//     // Validate phone number
//     const phoneNumber = parsePhoneNumberFromString('+' + phone);
//     if (!phoneNumber) {
//       setPhoneError('Invalid phone number format.');
//       return;
//     }
//     if (!phoneNumber.isValid()) {
//       setPhoneError('Invalid number for selected country.');
//       return;
//     }

//     // Log for next component
//     // console.log("Call forwarding phone number:", phoneNumber?.number,agentData);
//     const partnerName = localStorage.getItem('partnername') || 'Partner';
//     setLoading(true);
//     await handleUpdateLLM_ForCallForwarding(agentData.agent_id, partnerName, agentData.llmId, phoneNumber?.number, true, {
//       transsferType: 'Self',
//       phone: phoneNumber?.number,
//       ring_timeout: 20
//     });

//     // Swal.fire("Phone number saved! Ready for next component.");
//     setLoading(false);
//     setRefresh((prev) => !prev);
//     setShowCallForwardingModal(false);
//     setPhone('');
//     setPhoneError('');
//   };

//   // console.log('mode',mode,showCallForwardingModal,phone)
//   function extractPromptVariables(template, dataObject) {
//     const matches = [...template.matchAll(/{{(.*?)}}/g)];
//     const uniqueVars = new Set(matches.map((m) => m[1].trim()));

//     // Flatten dataObject to a key-value map
//     const flatData = {};

//     function flatten(obj) {
//       for (const key in obj) {
//         const val = obj[key];
//         if (typeof val === 'object' && val !== null && 'key' in val && 'value' in val) {
//           flatData[val.key.trim()] = val.value;
//         } else if (typeof val === 'object' && val !== null) {
//           flatten(val); // Recursively flatten nested objects
//         }
//       }
//     }

//     flatten(dataObject);

//     return Array.from(uniqueVars).map((variable) => ({
//       name: variable,
//       value: flatData[variable] ?? null,
//       status: true
//     }));
//   }
//   useEffect(() => {
//     const client = new RetellWebClient();
//     client.on('call_started', () => setIsCallActive(true));
//     client.on('call_ended', () => setIsCallActive(false));
//     client.on('update', (update) => {
//       //  Mark the update clearly as AGENT message
//       const customUpdate = {
//         ...update,
//         source: 'agent' // Add explicit source
//       };

//       // Dispatch custom event for CallTest
//       window.dispatchEvent(new CustomEvent('retellUpdate', { detail: customUpdate }));
//     });

//     setRetellWebClient(client);
//   }, []);

//   const onStartCall = async () => {
//     let micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

//     if (micPermission.state !== 'granted') {
//       try {
//         // Step 2: Ask for mic access
//         await navigator.mediaDevices.getUserMedia({ audio: true });

//         // Step 3: Recheck permission after user action
//         micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

//         if (micPermission.state !== 'granted') {
//           Swal.fire('Microphone Required', 'You must grant microphone access to start the call.', 'warning');
//           return;
//         }
//       } catch (err) {
//         // User denied mic access
//         Swal.fire('Microphone Blocked', 'Please allow microphone permission to continue.', 'error');
//         setShowCallModal(false);
//         return;
//       }
//     }
//     setCallLoading(true);
//     try {
//       const agentId = agentData?.agent_id;
//       if (!agentId) throw new Error('No agent ID found');

//       // Example: Initiate a call with Retell AI
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/agent/create-web-call`,
//         {
//           agent_id: agentId
//           // Add other required parameters, e.g., phone number or call settings
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       setCallLoading(true);

//       if (response.status == 403) {
//         Swal.fire('Error', 'Agent Plan minutes exhausted', 'error');
//         setIsCallInProgress(false);
//         setTimeout(() => {
//           setPopupMessage('');
//         }, 5000);
//         return;
//       }

//       await retellWebClient.startCall({ accessToken: response?.data?.access_token });
//       setCallId(response?.data?.call_id);
//       setIsCallActive(true);
//     } catch (error) {
//       console.error('Error starting call:', error);
//       Swal.fire('Failed to start call. Please try again.');
//     } finally {
//       setCallLoading(false);
//     }
//   };
//   const onEndCall = async () => {
//     isEndingRef.current = false;
//     setRefresh((prev) => !prev);
//     try {
//       // Example: End the call with Retell AI
//       // const callId = localStorage.getItem("currentCallId");
//       // const callId = localStorage.getItem("currentCallId");
//       // if (!callId) throw new Error("No call ID found");

//       const response = await retellWebClient.stopCall();

//       setIsCallActive(false);
//       isEndingRef.current = false;
//     } catch (error) {
//       console.error('Error ending call:', error);
//       Swal.fire('Failed to end call. Please try again.');
//     }
//   };
//   // const [loading, setLoading] = useState(false);
//   const getLeadTypeChoices = () => {
//     const fixedChoices = ['Spam Caller', 'Irrelvant Call', 'Angry Old Customer', 'Customer'];
//     // const allServices = [...customServices, ...businessServiceNames];
//     const cleanedServices = fixedChoices
//       .map((service) => service?.trim()) // remove extra whitespace
//       .filter((service) => service && service?.toLowerCase() !== 'other')
//       .map((service) => {
//         const normalized = service?.replace(/\s+/g, ' ')?.trim();
//         return `Customer for ${normalized}`;
//       });
//     const combinedChoices = Array.from(new Set([...fixedChoices, ...cleanedServices]));
//     return combinedChoices;
//   };
//   const handleAction = (action) => {
//     switch (action) {
//       case 'edit':
//         setForm({
//           language: agentData?.agentLanguage || '',
//           agentLanguage: agentData?.agentLanguage || '',
//           agentName: agentData?.agentName || '',
//           gender: agentData?.agentGender || '',
//           voice: agentData?.agentVoice || '',
//           selectedVoice: voices.find((v) => v.voice_id === agentData?.agentVoice) || null,
//           avatar: agentData?.avatar || ''
//         });
//         setMode('edit');
//         setShowEditModal(false);
//         setShowEditModal(true);
//         break;
//       case 'delete':
//         setShowDeleteConfirm(true);
//         break;
//       case 'deactivate':
//         Swal.fire('Agent Deactivated', '', 'info');
//         break;
//       case 'cancel':
//         setShowCancelConfirm(true);
//         break;
//       case 'assign':
//         Swal.fire('Phone Assigned', '', 'success');
//         break;
//       case 'test':
//         Swal.fire('Testing Agent...', '', 'info');
//         break;
//       case 'call':
//         Swal.fire('Call Link Opened', '', 'success');
//         break;
//       default:
//         break;
//     }
//   };
//   const userId = localStorage.getItem('userId');
//   useEffect(() => {
//     const fetchAgentStatus = async () => {
//       try {
//         const userId = localStorage.getItem('userId');
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/partneragent/${userId}`);
//         if (res.data.status === true) {
//           setAgentExists(true);
//           setAgentData(res?.data?.agents[0]);
//         } else {
//           setAgentExists(false);
//         }
//       } catch (error) {
//         console.error('Error fetching agent status:', error);
//         setAgentExists(false);
//       }
//     };

//     fetchAgentStatus();
//   }, [refresh]);

//   useEffect(() => {
//     fetchInitialData();
//   }, [refresh]);

//   useEffect(() => {
//     if (mode === 'edit' && agentData) {
//       setForm({
//         language: agentData?.agentLanguage || '',
//         agentLanguage: agentData?.agentLanguage || '',
//         agentName: agentData?.agentName || '',
//         gender: agentData?.agentGender || '',
//         voice: agentData?.agentVoice || '',
//         selectedVoice: voices.find((v) => v.voice_id === agentData?.agentVoice) || null,
//         avatar: agentData?.avatar || ''
//       });
//     }
//   }, []);

//   const fetchInitialData = async () => {
//     if (voices.length > 0) return;
//     try {
//       const voicesRes = await getRetellVoices();
//       setVoices(voicesRes);
//     } catch (err) {
//       console.error('Error loading voices:', err);
//     }
//   };

//   const filteredVoices = voices.filter((v) => v?.provider == 'elevenlabs' && v?.gender?.toLowerCase() === form.gender?.toLowerCase());

//   const togglePlay = (index: number) => {
//     const current = audioRefs.current[index];
//     if (!current) return;

//     if (playingIdx === index) {
//       current.pause();
//       setPlayingIdx(null);
//     } else {
//       audioRefs.current.forEach((a, i) => {
//         if (i !== index && a) a.pause();
//       });
//       current.play();
//       setPlayingIdx(index);
//     }

//     current.onended = () => setPlayingIdx(null);
//   };

//   const handleSubmit = async () => {
//     const userId = localStorage.getItem('userId');

//     if (!form.agentName || !form.language || !form.gender || !form.voice || !form.avatar) {
//       Swal.fire('Please fill all required fields: agentname, Language, Gender, Voice, Avatar.');

//       return;
//     }

//     if (mode == 'create') {
//       try {
//         setLoading(true);
//         const businessPayload = {
//           userId,
//           businessType: 'AI Virtual Receptionist',
//           businessName: 'Receptin',
//           businessSize: '50-100',
//           buisnessService: ['AI Virtual Receptionist Service'],
//           buisnessEmail: 'support@rxpt.us',
//           address1: '11210 NW 45th St #, Coral Springs, FL 33065, United States',
//           city: 'Coral Springs',
//           state: 'Florida',
//           country: 'United States',
//           webUrl: 'www.rxpt.us',
//           street_number: '11210 NW 45th St #'
//         };

//         const businessRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/businessDetails/create`, businessPayload);

//         const businessId = businessRes.data.record.businessId;
//         const agentCode = businessRes.data.agentCode;
//         localStorage.setItem('BusinessId', businessId);
//         localStorage.setItem('agentCode', agentCode);

//         const knowledgeText = [
//           {
//             title: 'Business Details',
//             text: `Name: Receptin
//           Address: 11210 NW 45th St #, Coral Springs, FL 33065, United States
//           Phone: +1 (772) 271 7966
//           Website: www.rxpt.us
//           Email: support@rxpt.us
//           About: N/A
//           Google: N/A`
//           }
//         ];

//         let agentCount = 0;
//         let knowledgeBaseName = '';
//         try {
//           agentCount = await countAgentsbyUserId(userId);
//           knowledgeBaseName = `Prtnr_${userId}_${agentCode}_#${agentCount + 1}`;
//           localStorage.setItem('knowledgebaseName', knowledgeBaseName);
//         } catch (error) {
//           console.error('Error generating knowledgeBaseName:', error);
//           return null;
//         }

//         const knowledgeFormData = new FormData();
//         knowledgeFormData.append('knowledge_base_name', knowledgeBaseName);
//         knowledgeFormData.append('enable_auto_refresh', 'true');
//         knowledgeFormData.append('knowledge_base_texts', JSON.stringify(knowledgeText));
//         knowledgeFormData.append('knowledge_base_urls', JSON.stringify(['https://www.rxpt.us']));

//         const kbRes = await axios.post('https://api.retellai.com/create-knowledge-base', knowledgeFormData, {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });

//         const knowledge_Base_ID = kbRes?.data?.knowledge_base_id;
//         knowledgeFormData.append('knowledgeBaseId', knowledge_Base_ID);
//         // knowledgeFormData.append("knowledgeBaseName",knowledgeBaseName)
//         localStorage.setItem('knowledge_Base_ID', knowledge_Base_ID);
//         localStorage.getItem('BusinessId');
//         knowledgeFormData.append('agentId', null);
//         await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/businessDetails/updateKnowledeBase/${businessId}`, knowledgeFormData, {
//           headers: {
//             Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });

//         const partnername = localStorage.getItem('partnername') || 'Receptin';
//         const partnerFirstName = partnername.split(' ')[0];
//         const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//         const currentTime = new Date().toLocaleString('en-US', { timeZone });

//  const filledPrompt = `
// You are ${form.agentName}, a ${form.gender} assistant to ${partnername},
// who helps ${partnerFirstName} in selling the services of “Receptin”. You can explain all about the Receptin application and its features based on the added knowledge base.

// ### Persona of the Receptionist
// - Role: A seasoned SDR named ${form.agentName} who answers inbound calls on behalf of  ${partnername} to help sell AI Receptionist Service named “Receptin” using which anyone can create a virtual AI receptionist for their business. The details of the service and its features can be taken from the Knowledge Base.

// - Skills: Customer service, Sales Development, communication skills, problem solving, emergency response handling, services knowledge from the knowledge base, and caller data collection.
// Greet the caller with a warm welcome directly in language the language code is this  ${form.language}. Do not repeat the greeting in another language.
// You can shift to multi language, if the caller asks you to or if you switch the language in between of the conversation.

// 1. Clarity and Simplicity: Keep responses clear, concise, and to the point. Use simple language and avoid unnecessary details to ensure the caller easily understands the information provided.
// 2. Personalization: Tailor interactions to be empathetic and polite. Please keep your response natural.
// 3. Focus on each step: Remember the steps to sell the AI Receptionist Service, and that you must stay on track with these steps.
// - Process to follow: Take all the details of the caller, like name, phone number, email address, and business name, before guiding them further.

// - Behaviour: Calm, Pleasing, and professional. Do not show too much excitement while talking. Do not say "Thanks" or "Thank you" more than twice in a call. Stay focused on more human-like behaviour. Control your excitement and talk normally. Be very concise and quick in your conversations.

// ### Rules for AI Voice Assistant:

// The agent must respect multi and converse only in that language.
// - Current Time: ${currentTime}
// - Timezone: ${timeZone}

// ### More Instructions
// You can assist callers with the following:
// - General inquiries, such as Services Information
// - Book Meetings with Technical Specialists if the caller wants the enterprise package, for which the price is not listed.
// - Assist the caller in buying the correct package for a specific business
// - Guide them on a step-by-step Process to purchase the optimum package and set up a new AI receptionist for their specific business based on the Knowledge Base.
// - Take the project details from the caller for Future Interactions
// - Take Details of the caller and the Business for which an AI Receptionist is required
// - Handle Complaints with a calm & natural voice and provide an accurate solution to the complaint.
// - If no solution is accepted by the caller and the caller is adamant to talk to a human only, then only transfer the call to a human representative.

// Keep the conversation concise and to the point.

// The user transcript might contain transcription errors. Use your best judgment to guess and respond.

//       `;

//  const rawPromptTemplate = `
// You are {{AGENT NAME}}, a {{AGENT GENDER}} assistant to {{PARTNER FULL NAME}},
// who helps {{PARTNER FIRST NAME}} in selling the services of “Receptin”. You can explain all about the Receptin application and its features based on the added knowledge base.

// ### Persona of the Receptioni {{AGENT NAME}} who answers inbound calls on behalf of  {{PARTNER FULL NAME"}} to help sell AI Receptionist Service named “Receptin” using which anyone can create a virtual AI receptionist for their business. The details of the service and its features can be taken from the Knowledge Base.

// - Skills: Customer service, Sales Development, communication skills, problem solving, emergency response handling, services knowledge from the knowledge base, and caller data collection.
// Greet the caller with a warm welcome directly in language the language code is this  {{LANGUAGE}}. Do not repeat the greeting in another language.
// You can shift to multi language, if the caller asks you to or if you switch the language in between of the conversation.

// 1. Clarity and Simplicity: Keep responses clear, concise, and to the point. Use simple language and avoid unnecessary details to ensure the caller easily understands the information provided.
// 2. Personalization: Tailor interactions to be empathetic and polite. Please keep your response natural.
// 3. Focus on each step: Remember the steps to sell the AI Receptionist Service, and that you must stay on track with these steps.
// - Process to follow: Take all the details of the caller, like name, phone number, email address, and business name, before guiding them further.

// - Behaviour: Calm, Pleasing, and professional. Do not show too much excitement while talking. Do not say "Thanks" or "Thank you" more than twice in a call. Stay focused on more human-like behaviour. Control your excitement and talk normally. Be very concise and quick in your conversations.

// ### Rules for AI Voice Assistant:

// The agent must respect multi and converse only in that language.
// - Current Time: {{CURRENT TIME}}
// - Timezone:{{TIMEZONE}}

// ### More Instructions
// You can assist callers with the following:
// - General inquiries, such as Services Information
// - Book Meetings with Technical Specialists if the caller wants the enterprise package, for which the price is not listed.
// - Assist the caller in buying the correct package for a specific business
// - Guide them on a step-by-step Process to purchase the optimum package and set up a new AI receptionist for their specific business based on the Knowledge Base.
// - Take the project details from the caller for Future Interactions
// - Take Details of the caller and the Business for which an AI Receptionist is required
// - Handle Complaints with a calm & natural voice and provide an accurate solution to the complaint.
// - If no solution is accepted by the caller and the caller is adamant to talk to a human only, then only transfer the call to a human representative.

// Keep the conversation concise and to the point.

// The user transcript might contain transcription errors. Use your best judgment to guess and respond.

//       `;

//         const promptVariablesList = extractPromptVariables(rawPromptTemplate, {
//           agentName: { key: 'AGENT NAME', value: form.agentName?.split(' ')[0] || 'Assistant' },
//           agentGender: { key: 'AGENT GENDER', value: form.gender || 'neutral' },
//           partnerNameFull: { key: 'PARTNER FULL NAME', value: partnername },
//           partnerFirstName: { key: 'PARTNER FIRST NAME', value: partnerFirstName },
//           businessName: { key: 'BUSINESS NAME', value: 'Receptin' },
//           businessEmail: { key: 'BUSINESS EMAIL ID', value: 'support@rxpt.us' },
//           aboutBusiness: { key: 'MORE ABOUT YOUR BUSINESS', value: 'We provide virtual AI receptionist services.' },
//           businessAddress: { key: 'BUSINESS ADDRESS', value: '11210 NW 45th St #, Coral Springs, FL 33065, United States' },
//           businessWebsite: { key: 'BUSINESS WEBSITE', value: 'www.rxpt.us' },
//           businessPhone: { key: 'BUSINESS PHONE', value: '+1 (772) 271 7966' },
//           businessType: { key: 'BUSINESSTYPE', value: 'AI Virtual Receptionist' },
//           commaSeparatedServices: { key: 'SERVICES', value: 'AI Virtual Receptionist Service' },
//           languageSelect: { key: 'LANGUAGE', value: form.language || 'English' },
//           timeZone: { key: 'TIMEZONE', value: timeZone },
//           current_time: { key: 'CURRENT TIME', value: currentTime },
//           [`current_time_[${timeZone}]`]: { key: `CURRENT TIME IN ${timeZone}`, value: currentTime }
//         });
//         const agentConfig = {
//           version: 0,
//           model: 'gemini-2.0-flash',
//           model_temperature: 0,
//           model_high_priority: true,
//           tool_call_strict_mode: true,
//           general_prompt: filledPrompt,

//           general_tools: [
//             {
//               type: 'end_call',
//               name: 'end_call',
//               description: 'End the call with user.'
//             },
//             {
//               type: 'extract_dynamic_variable',
//               name: 'extract_user_details',
//               description:
//                 "Extract the user's details like name, email, phone number, address, and reason for calling from the conversation",
//               variables: [
//                 {
//                   type: 'string',
//                   name: 'email',
//                   description: "Extract the user's email address from the conversation"
//                 },
//                 {
//                   type: 'number',
//                   name: 'phone',
//                   description: "Extract the user's phone number from the conversation"
//                 },
//                 {
//                   type: 'string',
//                   name: 'address',
//                   description: "Extract the user's address from the conversation"
//                 },
//                 {
//                   type: 'string',
//                   name: 'reason',
//                   description: "Extract the user's reason for calling from the conversation"
//                 },
//                 {
//                   type: 'string',
//                   name: 'name',
//                   description: 'Extract the user\'s name from the conversation"'
//                 }
//               ]
//             }
//           ],
//           states: [
//             {
//               name: 'information_collection',
//               state_prompt: `Greet the user with the begin_message and assist with their query.

//                             If the user wants to transfer the call, then say Call forwarding is not available. .

//                             If the user asks for an appointment (e.g., "appointment", "book", "schedule"),
//                             transition to appointment_booking.

//                             If the user is silent or unclear, say: "Sorry, I didn’t catch that. Could you please repeat?"
//                             If the user wants to end the call transition to end_call_state`,
//               edges: [
//                 {
//                   destination_state_name: 'CallTransfer_confirmation',
//                   description: 'User wants to tranfer call to talk .'
//                 }
//               ]
//             },

//             {
//               name: 'appointment_booking',
//               state_prompt: '## Task\nYou will now help the user book an appointment.'
//             },

//             // 🌟 State: Dissatisfaction Confirmation
//             {
//               name: 'CallTransfer_confirmation',
//               state_prompt: `
//                               Say: Would you like me to connect you with {{partner}}? Please say yes or no."
//                               Wait for their response.
//                               If the user says yes, transition to call_transfer.
//                               If the user says no, transition to information_collection.
//                               If the response is unclear, repeat the question once.
//                           `,
//               edges: [
//                 { destination_state_name: 'call_transfer', description: 'User agreed to speak to Partner.' },
//                 { destination_state_name: 'information_collection', description: 'User declined to speak to partner.' }
//               ],
//               tools: []
//             },

//             // 🌟 State: Call Transfer
//             {
//               name: 'call_transfer',
//               state_prompt: `
//                             Connecting you to a team member now. Please hold.
//                         `,
//               tools: [
//                 {
//                   type: 'transfer_call',
//                   name: 'transfer_to_Partner',
//                   description: 'Transfer the call to the team member.',
//                   transfer_destination: {
//                     type: 'predefined',
//                     number: '{{business_Phone}}'
//                   },
//                   transfer_option: {
//                     type: 'cold_transfer',
//                     public_handoff_option: {
//                       message: 'Please hold while I transfer your call.'
//                     }
//                   },
//                   speak_during_execution: true,
//                   speak_after_execution: true,
//                   failure_message:
//                     "Sorry, I couldn't transfer your call. Please contact us at {{business_email}} or call {{business_Phone}} directly."
//                 }
//               ],
//               edges: []
//             },
//             {
//               name: 'end_call_state',
//               state_prompt: `
//                             Politely end the call by saying: "Thank you for calling. Have a great day!"
//                         `,
//               tools: [
//                 {
//                   type: 'end_call',
//                   name: 'end_call1',
//                   description: 'End the call with the user.'
//                 }
//               ],
//               edges: []
//             }
//           ],
//           starting_state: 'information_collection',
//           // begin_message: `Hi I am ${agentName?.split(" ")[0]}, calling from ${getBusinessNameFromGoogleListing?.businessName || getBusinessNameFormCustom}. How may i help you`,
//           default_dynamic_variables: {
//             customer_name: 'John Doe',
//             // business_Phone: businessPhone,
//             // business_email: business.email,
//             timeZone: timeZone
//           }
//         };
//         const knowledgeBaseId = localStorage.getItem('knowledge_Base_ID');
//         if (knowledgeBaseId) {
//           agentConfig.knowledge_base_ids = [knowledgeBaseId];
//         }
//         const llmRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/createAdmin/llm`, agentConfig, {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`
//           }
//         });

//         const llmId = llmRes.data.data.llm_id;

//         const agentRes = await axios.post(
//           'https://api.retellai.com/create-agent',
//           {
//             response_engine: { type: 'retell-llm', llm_id: llmId },
//             voice_id: form.voice,
//             agent_name: form.selectedVoice?.voice_name || 'Virtual Assistant',
//             language: 'multi',
//             post_call_analysis_model: 'gpt-4o-mini',
//             responsiveness: 1,
//             enable_backchannel: true,
//             interruption_sensitivity: 0.91,
//             backchannel_frequency: 0.7,
//             backchannel_words: ['Got it', 'Yeah', 'Uh-huh', 'Understand', 'Ok', 'hmmm'],
//             post_call_analysis_data: [
//               {
//                 type: 'enum',
//                 name: 'lead_type',
//                 description: 'Feedback given by the customer about the call.',
//                 choices: getLeadTypeChoices()
//               },
//               {
//                 type: 'string',
//                 name: 'name',
//                 description: "Extract the user's name from the conversation",
//                 examples: ['Ajay Sood', 'John Wick', 'Adam Zampa', 'Jane Doe', 'Nitish Kumar', 'Ravi Shukla']
//               },
//               {
//                 type: 'string',
//                 name: 'email',
//                 description: "Extract the user's email from the conversation",
//                 examples: ['john.doe@example.com', 'nitish@company.in', '12@gmail.com']
//               },
//               {
//                 type: 'string',
//                 name: 'reason',
//                 description:
//                   "The reason the user is calling or their inquiry. If provided in Hindi, translate to English. Summarize if it's long.",
//                 examples: ['Schedule an appointment', 'Ask about services', 'Request for accounting help']
//               },
//               {
//                 type: 'string',
//                 name: 'address',
//                 description:
//                   "The user's address or business location. If spoken in Hindi, translate to English. Format it for use in CRM or contact forms.",
//                 examples: ['123 Main St, Delhi', '42 Wallaby Way, Sydney', '1490 Aandhar Eleven']
//               },
//               {
//                 type: 'number',
//                 name: 'phone_number',
//                 description:
//                   "The user's phone number in numeric format. If digits are spoken in words (e.g., 'seven eight seven six one two'), convert them to digits (e.g., '787612'). Ensure it's a valid number when possible."
//               }
//             ],
//             end_call_after_silence_ms: 30000,
//             normalize_for_speech: true,
//             webhook_url: `${process.env.NEXT_PUBLIC_API_URL}/api/agent/updateAgentCall_And_Mins_WebHook`
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`
//             }
//           }
//         );

//         const agentId = agentRes.data.agent_id;

//         const dbPayload = {
//           userId,
//           agent_id: agentId,
//           llmId,
//           avatar: form.avatar,
//           agentVoice: form.voice,
//           knowledgeBaseId: knowledge_Base_ID,
//           agentAccent: form.selectedVoice?.voice_accent || 'American',
//           agentRole: 'Partner Assistant',
//           agentName: form.agentName || 'Virtual Assistant',
//           agentLanguageCode: form.language,
//           agentLanguage: form.agentLanguage,
//           dynamicPromptTemplate: filledPrompt,
//           rawPromptTemplate: filledPrompt,
//           promptVariablesList: JSON.stringify(promptVariablesList),
//           agentGender: form.gender,
//           agentPlan: 'free',
//           agentStatus: true,
//           businessId,
//           additionalNote: '',
//           agentCreatedBy: 'partner'
//         };

//         const saveRes = await createAgent(dbPayload);
//         if (saveRes.status === 200 || saveRes.status === 201) {
//           setLoading(false);
//           setRefresh((prev) => !prev);
//           Swal.fire('Agent created successfully!');
//           localStorage.removeItem('agentCode');
//           localStorage.removeItem('businessType');
//         } else {
//           throw new Error('Agent creation failed.');
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error('Error during full setup:', err);
//         Swal.fire('Something went wrong during setup.');
//         setLoading(false);
//       } finally {
//         setLoading(false);
//       }
//     } else if (mode == 'edit') {
//       setLoading(true);
//       try {
//         const agentId = agentData?.agent_id;
//         const llmId = agentData?.llmId;
//         const knowledgeBaseId = agentData?.knowledgeBaseId;
//         const businessId = agentData?.businessId;

//         if (!agentId || !llmId || !knowledgeBaseId || !businessId) {
//           throw new Error('Missing required agent data for update.');
//         }

//         const partnername = localStorage.getItem('partnername') || 'Receptin';
//         const partnerFirstName = partnername.split(' ')[0];
//         const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//         const currentTime = new Date().toLocaleString('en-US', { timeZone });

//         const filledPrompt = `
//   You are ${form.agentName}, a ${form.gender} assistant to ${partnername},
//   who helps ${partnerFirstName} in selling the services of “Receptin”. You can explain all about the Receptin application and its features based on the added knowledge base.

//   ### Persona of the Receptionist
//   - Role: A seasoned SDR named ${form.agentName} who answers inbound calls on behalf of ${partnername} to help sell AI Receptionist Service named “Receptin” using which anyone can create a virtual AI receptionist for their business. The details of the service and its features can be taken from the Knowledge Base.

//   - Skills: Customer service, Sales Development, communication skills, problem solving, emergency response handling, services knowledge from the knowledge base, and caller data collection.
//   Greet the caller with a warm welcome directly in language the language code is this ${form.language}. Do not repeat the greeting in another language.
//   You can shift to multi language, if the caller asks you to or if you switch the language in between of the conversation.

//   1. Clarity and Simplicity: Keep responses clear, concise, and to the point. Use simple language and avoid unnecessary details to ensure the caller easily understands the information provided.
//   2. Personalization: Tailor interactions to be empathetic and polite. Please keep your response natural.
//   3. Focus on each step: Remember the steps to sell the AI Receptionist Service, and that you must stay on track with these steps.
//   - Process to follow: Take all the details of the caller, like name, phone number, email address, and business name, before guiding them further.

//   - Behaviour: Calm, Pleasing, and professional. Do not show too much excitement while talking. Do not say "Thanks" or "Thank you" more than twice in a call. Stay focused on more human-like behaviour. Control your excitement and talk normally. Be very concise and quick in your conversations.

//   ### Rules for AI Voice Assistant:
//   The agent must respect multi and converse only in that language.
//   - Current Time: ${currentTime}
//   - Timezone: ${timeZone}

//   ### More Instructions
//   You can assist callers with the following:
//   - General inquiries, such as Services Information
//   - Book Meetings with Technical Specialists if the caller wants the enterprise package, for which the price is not listed.
//   - Assist the caller in buying the correct package for a specific business
//   - Guide them on a step-by-step Process to purchase the optimum package and set up a new AI receptionist for their specific business based on the Knowledge Base.
//   - Take the project details from the caller for Future Interactions
//   - Take Details of the caller and the Business for which an AI Receptionist is required
//   - Handle Complaints with a calm & natural voice and provide an accurate solution to the complaint.
//   - If no solution is accepted by the caller and the caller is adamant to talk to a human only, then only transfer the call to a human representative.

//   Keep the conversation concise and to the point.
//   The user transcript might contain transcription errors. Use your best judgment to guess and respond.
//   `;

//         const rawPromptTemplate = `
// You are {{AGENT NAME}}, a {{AGENT GENDER}} assistant to {{PARTNER FULL NAME}},
// who helps {{PARTNER FIRST NAME}} in selling the services of “Receptin”. You can explain all about the Receptin application and its features based on the added knowledge base.

// ### Persona of the Receptioni {{AGENT NAME}} who answers inbound calls on behalf of  {{PARTNER FULL NAME"}} to help sell AI Receptionist Service named “Receptin” using which anyone can create a virtual AI receptionist for their business. The details of the service and its features can be taken from the Knowledge Base.

// - Skills: Customer service, Sales Development, communication skills, problem solving, emergency response handling, services knowledge from the knowledge base, and caller data collection.
// Greet the caller with a warm welcome directly in language the language code is this  {{LANGUAGE}}. Do not repeat the greeting in another language.
// You can shift to multi language, if the caller asks you to or if you switch the language in between of the conversation.

// 1. Clarity and Simplicity: Keep responses clear, concise, and to the point. Use simple language and avoid unnecessary details to ensure the caller easily understands the information provided.
// 2. Personalization: Tailor interactions to be empathetic and polite. Please keep your response natural.
// 3. Focus on each step: Remember the steps to sell the AI Receptionist Service, and that you must stay on track with these steps.
// - Process to follow: Take all the details of the caller, like name, phone number, email address, and business name, before guiding them further.

// - Behaviour: Calm, Pleasing, and professional. Do not show too much excitement while talking. Do not say "Thanks" or "Thank you" more than twice in a call. Stay focused on more human-like behaviour. Control your excitement and talk normally. Be very concise and quick in your conversations.

// ### Rules for AI Voice Assistant:

// The agent must respect multi and converse only in that language.
// - Current Time: {{CURRENT TIME}}
// - Timezone:{{TIMEZONE}}

// ### More Instructions
// You can assist callers with the following:
// - General inquiries, such as Services Information
// - Book Meetings with Technical Specialists if the caller wants the enterprise package, for which the price is not listed.
// - Assist the caller in buying the correct package for a specific business
// - Guide them on a step-by-step Process to purchase the optimum package and set up a new AI receptionist for their specific business based on the Knowledge Base.
// - Take the project details from the caller for Future Interactions
// - Take Details of the caller and the Business for which an AI Receptionist is required
// - Handle Complaints with a calm & natural voice and provide an accurate solution to the complaint.
// - If no solution is accepted by the caller and the caller is adamant to talk to a human only, then only transfer the call to a human representative.

// Keep the conversation concise and to the point.

// The user transcript might contain transcription errors. Use your best judgment to guess and respond.

//       `;

//         const promptVariablesList = extractPromptVariables(rawPromptTemplate, {
//           agentName: { key: 'AGENT NAME', value: form.agentName?.split(' ')[0] || 'Assistant' },
//           agentGender: { key: 'AGENT GENDER', value: form.gender || 'neutral' },
//           partnerNameFull: { key: 'PARTNER FULL NAME', value: partnername },
//           partnerFirstName: { key: 'PARTNER FIRST NAME', value: partnerFirstName },
//           businessName: { key: 'BUSINESS NAME', value: 'Receptin' },
//           businessEmail: { key: 'BUSINESS EMAIL ID', value: 'support@rxpt.us' },
//           aboutBusiness: { key: 'MORE ABOUT YOUR BUSINESS', value: 'We provide virtual AI receptionist services.' },
//           businessAddress: { key: 'BUSINESS ADDRESS', value: '11210 NW 45th St #, Coral Springs, FL 33065, United States' },
//           businessWebsite: { key: 'BUSINESS WEBSITE', value: 'www.rxpt.us' },
//           businessPhone: { key: 'BUSINESS PHONE', value: '+1 (772) 271 7966' },
//           businessType: { key: 'BUSINESSTYPE', value: 'AI Virtual Receptionist' },
//           commaSeparatedServices: { key: 'SERVICES', value: 'AI Virtual Receptionist Service' },
//           languageSelect: { key: 'LANGUAGE', value: form.language || 'English' },
//           timeZone: { key: 'TIMEZONE', value: timeZone },
//           current_time: { key: 'CURRENT TIME', value: currentTime },
//           [`current_time_[${timeZone}]`]: { key: `CURRENT TIME IN ${timeZone}`, value: currentTime }
//         });

//         const callForwarding = agentData.callForwarding;

//         const agentConfig = {
//           version: 0,
//           model: 'gemini-2.0-flash',
//           model_temperature: 0,
//           model_high_priority: true,
//           tool_call_strict_mode: true,
//           general_prompt: filledPrompt,
//           general_tools: [
//             {
//               type: 'end_call',
//               name: 'end_call',
//               description: 'End the call with user.'
//             },
//             {
//               type: 'extract_dynamic_variable',
//               name: 'extract_user_details',
//               description:
//                 "Extract the user's details like name, email, phone number, address, and reason for calling from the conversation",
//               variables: [
//                 { type: 'string', name: 'email', description: "Extract the user's email address from the conversation" },
//                 { type: 'number', name: 'phone', description: "Extract the user's phone number from the conversation" },
//                 { type: 'string', name: 'address', description: "Extract the user's address from the conversation" },
//                 { type: 'string', name: 'reason', description: "Extract the user's reason for calling from the conversation" },
//                 { type: 'string', name: 'name', description: "Extract the user's name from the conversation" }
//               ]
//             }
//           ],
//           states: [
//             {
//               name: 'information_collection',
//               state_prompt: `Greet the user with the begin_message and assist with their query.
//                               If the user wants to transfer the call:
//                               ${getCallForwarding(callForwarding)}

//                               If the user asks for an appointment (e.g., "appointment", "book", "schedule"),transition to appointment_booking.

//                                 If the user is silent or unclear, say: "Sorry, I didn’t catch that. Could you please repeat?"
//                                 If the user wants to end the call transition to end_call_state`,
//               edges: [{ destination_state_name: 'CallTransfer_confirmation', description: 'User wants to transfer call.' }]
//             },
//             {
//               name: 'appointment_booking',
//               state_prompt: '## Task\nYou will now help the user book an appointment.'
//             },
//             {
//               name: 'CallTransfer_confirmation',
//               state_prompt: `
//                               Say: Would you like me to connect you with {{partner}}? Please say yes or no."
//                               Wait for their response.
//                               If the user says yes, transition to call_transfer.
//                               If the user says no, transition to information_collection.
//                               If the response is unclear, repeat the question once.
//                           `,
//               edges: [
//                 { destination_state_name: 'call_transfer', description: 'User agreed to speak to Partner.' },
//                 { destination_state_name: 'information_collection', description: 'User declined to speak to Partner.' }
//               ],
//               tools: []
//             },
//             {
//               name: 'call_transfer',
//               state_prompt: `Connecting you to a team member now. Please hold.`,
//               tools: [
//                 {
//                   type: 'transfer_call',
//                   name: 'transfer_to_Partner',
//                   description: 'Transfer the call to the team member.',
//                   transfer_destination: { type: 'predefined', number: '{{business_Phone}}' },
//                   transfer_option: { type: 'cold_transfer', public_handoff_option: { message: 'Please hold while I transfer your call.' } },
//                   speak_during_execution: true,
//                   speak_after_execution: true,
//                   failure_message:
//                     "Sorry, I couldn't transfer your call. Please contact us at {{business_email}} or call {{business_Phone}} directly."
//                 }
//               ],
//               edges: []
//             },
//             {
//               name: 'end_call_state',
//               state_prompt: `Politely end the call by saying: "Thank you for calling. Have a great day!"`,
//               tools: [{ type: 'end_call', name: 'end_call1', description: 'End the call with the user.' }],
//               edges: []
//             }
//           ],
//           starting_state: 'information_collection',
//           default_dynamic_variables: {
//             customer_name: 'John Doe',
//             timeZone: timeZone
//           }
//         };

//         // Update LLM configuration
//         await axios.patch(`https://api.retellai.com/update-retell-llm/${llmId} `, agentConfig, {
//           headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}` }
//         });

//         // Update agent in Retell AI
//         await axios.patch(
//           `https://api.retellai.com/update-agent/${agentId}`,
//           {
//             response_engine: { type: 'retell-llm', llm_id: llmId },
//             voice_id: form.voice,
//             agent_name: form.selectedVoice?.voice_name || form.agentName || 'Virtual Assistant',
//             language: 'multi',
//             post_call_analysis_model: 'gpt-4o-mini',
//             responsiveness: 1,
//             enable_backchannel: true,
//             interruption_sensitivity: 0.91,
//             backchannel_frequency: 0.7,
//             backchannel_words: ['Got it', 'Yeah', 'Uh-huh', 'Understand', 'Ok', 'hmmm'],
//             post_call_analysis_data: [
//               {
//                 type: 'enum',
//                 name: 'lead_type',
//                 description: 'Feedback given by the customer about the call.',
//                 choices: getLeadTypeChoices()
//               },
//               {
//                 type: 'string',
//                 name: 'name',
//                 description: "Extract the user's name from the conversation",
//                 examples: ['Ajay Sood', 'John Wick', 'Adam Zampa', 'Jane Doe', 'Nitish Kumar', 'Ravi Shukla']
//               },
//               {
//                 type: 'string',
//                 name: 'email',
//                 description: "Extract the user's email from the conversation",
//                 examples: ['john.doe@example.com', 'nitish@company.in', '12@gmail.com']
//               },
//               {
//                 type: 'string',
//                 name: 'reason',
//                 description:
//                   "The reason the user is calling or their inquiry. If provided in Hindi, translate to English. Summarize if it's long.",
//                 examples: ['Schedule an appointment', 'Ask about services', 'Request for accounting help']
//               },
//               {
//                 type: 'string',
//                 name: 'address',
//                 description:
//                   "The user's address or business location. If spoken in Hindi, translate to English. Format it for use in CRM or contact forms.",
//                 examples: ['123 Main St, Delhi', '42 Wallaby Way, Sydney', '1490 Aandhar Eleven']
//               },
//               {
//                 type: 'number',
//                 name: 'phone_number',
//                 description:
//                   "The user's phone number in numeric format. If digits are spoken in words (e.g., 'seven eight seven six one two'), convert them to digits (e.g., '787612'). Ensure it's a valid number when possible."
//               }
//             ],
//             end_call_after_silence_ms: 30000,
//             normalize_for_speech: true,
//             webhook_url: `${process.env.NEXT_PUBLIC_API_URL}/api/agent/updateAgentCall_And_Mins_WebHook`
//           },
//           { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}` } }
//         );

//         // Update agent in the database
//         const dbPayload = {
//           userId,
//           agent_id: agentId,
//           llmId,
//           avatar: form.avatar,
//           agentVoice: form.voice,
//           knowledgeBaseId,
//           agentAccent: form.selectedVoice?.voice_accent || 'American',
//           agentRole: 'Partner Assistant',
//           agentName: form.agentName || 'Virtual Assistant',
//           agentLanguageCode: form.language,
//           agentLanguage: form.agentLanguage,
//           dynamicPromptTemplate: filledPrompt,
//           rawPromptTemplate: filledPrompt,
//           promptVariablesList: JSON.stringify(promptVariablesList),
//           agentGender: form.gender,
//           agentPlan: agentData?.agentPlan || 'free',
//           agentStatus: agentData?.agentStatus || true,
//           businessId,
//           additionalNote: '',
//           agentCreatedBy: 'partner'
//         };

//         const updateRes = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/updateAgent/${agentId}`, dbPayload);

//         if (updateRes.status === 200 || updateRes.status === 201) {
//           setRefresh((prev) => !prev);
//           setMode('create');
//           setShowEditModal(false);
//           setForm({ language: '', agentName: '', gender: '', voice: '', selectedVoice: null, avatar: '', agentLanguage: '' });
//           Swal.fire('Agent updated successfully!');
//         } else {
//           throw new Error('Agent update failed.');
//         }
//       } catch (error) {
//         console.error('Error during edit:', error);
//         Swal.fire('Something went wrong while editing.');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   if (agentExists === null) {
//     return (
//       <div className="text-center mt-10" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
//         <FadeLoader color="#6524EB" />
//       </div>
//     );
//   }

//   // Agent Already Exists View
//   if (agentExists && agentData && mode != 'edit') {
//     return (
//       <div className="max-w-4xl mx-auto mt-10 bg-white shadow-2xl rounded-2xl p-6 border border-gray-200">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-[#6524EB]">Your Partner Agent</h2>

//           {/* More Options Dropdown */}
//           <div className="relative">
//             <Button variant="ghost" className="text-gray-500 hover:bg-gray-100" onClick={() => setShowDropdown(!showDropdown)}>
//               <span className="text-2xl">⋮</span>
//             </Button>

//             {showDropdown && (
//               <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-xl border z-50">
//                 <ul className="py-2 text-sm text-gray-800">
//                   {!agentData.isDeactivated && (
//                     <>
//                       <li>
//                         <button
//                           className="w-full px-5 py-2 hover:bg-gray-100 text-left"
//                           onClick={() => {
//                             setShowCallModal(true);
//                             setShowDropdown(false);
//                           }}
//                         >
//                           📞 Test Call
//                         </button>
//                       </li>
//                     </>
//                   )}
//                   {!agentData?.voip_numbers && !agentData.isDeactivated && (
//                     <>
//                       <li>
//                         <button
//                           className="w-full px-5 py-2 hover:bg-gray-100 text-left"
//                           onClick={() => {
//                             setAssignPhoneModal(true);
//                             setShowAssignModal(true);
//                             setShowDropdown(false);
//                           }}
//                         >
//                           📱 Assign Phone Number
//                         </button>
//                       </li>
//                     </>
//                   )}
//                   {!agentData.isDeactivated && (
//                     <>
//                       <li>
//                         <button
//                           className="w-full px-5 py-2 hover:bg-gray-100 text-left"
//                           onClick={() => {
//                             setShowEditModal(true);
//                             setShowDropdown(false);
//                             setForm({
//                               language: agentData?.agentLanguageCode || '',
//                               agentLanguage: agentData?.agentLanguage || '',
//                               agentName: agentData?.agentName || '',
//                               gender: agentData?.agentGender == 'male' ? 'Male' : 'Female' || '',
//                               voice: agentData?.agentVoice || '',
//                               selectedVoice: voices.find((v) => v.voice_id == agentData?.agentVoice) || null,
//                               avatar: agentData?.avatar || ''
//                             });
//                             setMode('edit');
//                           }}
//                         >
//                           ✏️ Edit Agent
//                         </button>
//                       </li>
//                     </>
//                   )}

//                   {!agentData.isDeactivated && (
//                     <>
//                       <li>
//                         <button
//                           className="w-full px-5 py-2 hover:bg-gray-100 text-left"
//                           onClick={() => {
//                             setShowCallForwardingModal(true);
//                             setShowDropdown(false);
//                           }}
//                         >
//                           <span className="text-green-600"> 📲</span> Call Forwarding
//                         </button>
//                       </li>
//                     </>
//                   )}
//                   {!agentData.isDeactivated && (
//                     <>
//                       {' '}
//                       <li>
//                         <button
//                           className="w-full px-4 py-2 hover:bg-gray-100 text-left"
//                           onClick={async () => {
//                             setShowDropdown(false); // Hide dropdown first

//                             const result = await Swal.fire({
//                               title: 'Are you sure?',
//                               html: 'You are about to deactivate this agent.<br><strong>This may lead to the deletion of the assigned phone number, if any.</strong>',
//                               icon: 'warning',
//                               showCancelButton: true,
//                               confirmButtonColor: '#3085d6',
//                               cancelButtonColor: '#d33',
//                               confirmButtonText: 'Yes, deactivate it!'
//                             });

//                             if (result.isConfirmed) {
//                               Swal.fire({
//                                 title: 'Deactivating...',
//                                 html: 'Please wait while we deactivate the agent.',
//                                 allowOutsideClick: false,
//                                 didOpen: () => {
//                                   Swal.showLoading();
//                                 }
//                               });
//                               try {
//                                 const response = await axios.post(
//                                   `${process.env.NEXT_PUBLIC_API_URL}/api/agent/deactivateAgentbyAgentId/${agentData?.agent_id}`
//                                 );
//                                 Swal.close();
//                                 if (response.data.status == true) {
//                                   Swal.fire('Deactivated!', 'Agent has been deactivated.', 'success');
//                                   setShowDeactivateModal(false); // close modal if needed
//                                   setRefresh((prev) => !prev); // update agent list
//                                 }
//                               } catch (error) {
//                                 console.error(error);
//                                 Swal.fire('Error', 'Failed to deactivate agent.', 'error');
//                               }
//                             }
//                           }}
//                         >
//                           🚫 Deactivate Agent
//                         </button>
//                       </li>
//                     </>
//                   )}
//                   {agentData.isDeactivated && (
//                     <>
//                       <li>
//                         <button
//                           className="w-full px-5 py-2 hover:bg-gray-100 text-left flex items-center gap-2"
//                           onClick={() => {
//                             setShowCancelConfirm(true);
//                             setShowDropdown(false);
//                             Swal.fire('Agent Deactivated', 'Please contact support to activate your agent.', 'info');
//                           }}
//                         >
//                           ✅ Activate Agent
//                         </button>
//                       </li>
//                     </>
//                   )}
//                 </ul>
//               </div>
//             )}
//             {/* {showCallModal && (
//               <Modal
//                 isOpen={showCallModal}
//                 onClose={() => {
//                   setShowCallModal(false);
//                   onEndCall();
//                 }}
//                 title="Test Call"
//                 width="max-w-lg"
//               >
//                 <CallTest
//                   isCallActive={isCallActive}
//                   onStartCall={onStartCall}
//                   onEndCall={onEndCall}
//                   callLoading={callLoading}
//                   setCallLoading={setCallLoading}
//                   isliveTranscript={false}
//                   agentName={agentData?.agentName || 'Your Agent'}
//                   agentAvatar={agentData?.avatar || '/images/rex.png'}
//                   businessName="Receptin"
//                   isEndingRef={isEndingRef}
//                 />
//               </Modal>
//             )}
//             {assignPhoneModal && (
//               <AssignNumberModal
//                 isOpen={showAssignModal}
//                 onClose={() => {
//                   setShowAssignModal(false);
//                   setAssignPhoneModal(false);
//                 }}
//                 agentId={agentData.agent_id}
//                 agentDetails={agentData}
//                 onAssignNumber={() => {
//                   setRefresh((prev) => !prev);
//                   setShowAssignModal(false);
//                   setAssignPhoneModal(false);
//                 }}
//                 onAgentDetailsPage={true}
//               />
//             )}
//             {showCallForwardingModal && (
//               <Modal
//                 isOpen={showCallForwardingModal}
//                 onClose={() => {
//                   if (loading) return;
//                   setShowCallForwardingModal(false);
//                   setPhone('');
//                   setPhoneError('');
//                 }}
//                 title="Call Forwarding"
//                 width="max-w-md"
//               >
//                 <div className="space-y-4">
//                   <div>
//                     <label htmlFor="contactNumber">Contact Number</label>
//                     <PhoneInput
//                       country={'in'} // Default country: India
//                       value={phone || agentData.callForwardingOptions}
//                       onChange={(phone) => {
//                         setPhone(phone);
//                         setPhoneError(''); // Clear error on change
//                       }}
//                       inputClass="!w-full !text-sm !rounded !border !border-gray-300"
//                       containerClass="!w-full"
//                       inputProps={{
//                         name: 'phone',
//                         required: true,
//                         id: 'contactNumber'
//                       }}
//                       specialLabel={''}
//                       inputComponentRef={phoneInputRef} // Attach ref to PhoneInput
//                     />
//                     {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
//                   </div>
//                   <div className="flex gap-4">
//                     {agentData?.callForwarding && (
//                       <Button
//                         disabled={cancelLoading || loading}
//                         className="w-full"
//                         style={{ background: 'red' }}
//                         onClick={handleStopCallForwardingSubmit}
//                       >
//                         {cancelLoading ? <ClipLoader color="#6524EB" size={18} /> : 'Stop Forwarding'}
//                       </Button>
//                     )}
//                     <Button className="w-full" onClick={handleCallForwardingSubmit} disabled={loading}>
//                       {loading ? <ClipLoader color="#6524EB" size={18} /> : agentData?.callForwarding ? 'Edit' : 'Save'}
//                     </Button>
//                     <Button
//                       variant="outline"
//                       className="w-full"
//                       onClick={() => {
//                         setShowCallForwardingModal(false);
//                         setPhone('');
//                         setPhoneError('');
//                       }}
//                       disabled={loading}
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               </Modal>
//             )} */}
//             <Dialog
//               open={showCallModal}
//               onClose={() => {
//                 setShowCallModal(false);
//                 onEndCall();
//               }}
//               maxWidth="md"
//               fullWidth
//             >
//               <DialogTitle>Test Call</DialogTitle>
//               <DialogContent dividers>
//                 <CallTest
//                   isCallActive={isCallActive}
//                   onStartCall={onStartCall}
//                   onEndCall={onEndCall}
//                   callLoading={callLoading}
//                   setCallLoading={setCallLoading}
//                   isliveTranscript={false}
//                   agentName={agentData?.agentName || 'Your Agent'}
//                   agentAvatar={agentData?.avatar || '/images/rex.png'}
//                   businessName="Receptin"
//                   isEndingRef={isEndingRef}
//                 />
//               </DialogContent>
//             </Dialog>

//             {/* 🟣 ASSIGN PHONE MODAL */}
//             <Dialog
//               open={assignPhoneModal}
//               onClose={() => {
//                 setShowAssignModal(false);
//                 setAssignPhoneModal(false);
//               }}
//               maxWidth="sm"
//               fullWidth
//             >
//               <DialogTitle>Assign Number</DialogTitle>
//               <DialogContent dividers>
//                 <AssignNumberModal
//                   isOpen={true}
//                   onClose={() => {
//                     setShowAssignModal(false);
//                     setAssignPhoneModal(false);
//                   }}
//                   agentId={agentData.agent_id}
//                   agentDetails={agentData}
//                   onAssignNumber={() => {
//                     setRefresh((prev) => !prev);
//                     setShowAssignModal(false);
//                     setAssignPhoneModal(false);
//                   }}
//                   onAgentDetailsPage={true}
//                 />
//               </DialogContent>
//             </Dialog>

//             {/* 🟡 CALL FORWARDING MODAL */}
//             <Dialog
//               open={showCallForwardingModal}
//               onClose={() => {
//                 if (loading) return;
//                 setShowCallForwardingModal(false);
//                 setPhone('');
//                 setPhoneError('');
//               }}
//               maxWidth="sm"
//               fullWidth
//             >
//               <DialogTitle>Call Forwarding</DialogTitle>
//               <DialogContent dividers>
//                 <Box display="flex" flexDirection="column" gap={2}>
//                   <Box>
//                     <Typography variant="body2" mb={1}>
//                       Contact Number
//                     </Typography>
//                     <PhoneInput
//                       country={'in'}
//                       value={phone || agentData.callForwardingOptions}
//                       onChange={(phone) => {
//                         setPhone(phone);
//                         setPhoneError('');
//                       }}
//                       inputClass="w-full text-sm rounded border border-gray-300"
//                       containerClass="w-full"
//                       inputProps={{
//                         name: 'phone',
//                         required: true,
//                         id: 'contactNumber'
//                       }}
//                       specialLabel={''}
//                       inputComponentRef={phoneInputRef}
//                     />
//                     {phoneError && (
//                       <Typography color="error" variant="body2" mt={1}>
//                         {phoneError}
//                       </Typography>
//                     )}
//                   </Box>

//                   <Box display="flex" gap={2} mt={2}>
//                     {agentData?.callForwarding && (
//                       <Button
//                         fullWidth
//                         variant="contained"
//                         color="error"
//                         onClick={handleStopCallForwardingSubmit}
//                         disabled={cancelLoading || loading}
//                       >
//                         {cancelLoading ? <ClipLoader color="#fff" size={18} /> : 'Stop Forwarding'}
//                       </Button>
//                     )}

//                     <Button fullWidth variant="contained" color="primary" onClick={handleCallForwardingSubmit} disabled={loading}>
//                       {loading ? <ClipLoader color="#fff" size={18} /> : agentData?.callForwarding ? 'Edit' : 'Save'}
//                     </Button>

//                     <Button
//                       fullWidth
//                       variant="outlined"
//                       onClick={() => {
//                         setShowCallForwardingModal(false);
//                         setPhone('');
//                         setPhoneError('');
//                       }}
//                       disabled={loading}
//                     >
//                       Cancel
//                     </Button>
//                   </Box>
//                 </Box>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </div>

//         {/* Agent Details */}
//         <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 px-2">
//           {/* Avatar */}
//           <div className="flex-shrink-0">
//             {agentData.avatar ? (
//               <img
//                 src={agentData.avatar}
//                 alt="Agent Avatar"
//                 className="rounded-full border-4 border-[#6524EB] shadow-md"
//                 style={{ width: '150px', height: '150px', objectFit: 'cover' }}
//               />
//             ) : (
//               <div className="w-36 h-36 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 text-sm">No Avatar</div>
//             )}
//           </div>

//           {/* Info */}
//           <div className="flex-1 text-gray-800 space-y-2 text-lg md:text-xl">
//             <p>
//               <strong className="text-[]">Name:</strong> {agentData?.agentName}
//             </p>
//             <p>
//               <strong className="text-[]">Gender:</strong>{' '}
//               {agentData?.agentGender
//                 ? agentData.agentGender.charAt(0).toUpperCase() + agentData.agentGender.slice(1).toLowerCase()
//                 : 'N/A'}
//             </p>
//             <p>
//               <strong className="text-[]">Language:</strong>
//               {languages?.find((lang) => lang?.locale == agentData?.agentLanguage)?.name || agentData?.agentLanguage}
//             </p>
//             <p>
//               <strong className="text-[]">Voice:</strong> {agentData?.agentVoice?.split('-')[1]}
//             </p>
//             <p>
//               <strong className="text-[]">Minutes Left:</strong> {Math.floor(agentData?.mins_left / 60)}
//             </p>
//             <p>
//               <strong className="text-[]">Status:</strong>{' '}
//               {agentData.isDeactivated ? (
//                 <span className="text-red-500 font-semibold">Deactivated</span>
//               ) : (
//                 <span className="text-green-600 font-semibold">Active</span>
//               )}
//             </p>
//             {agentData?.voip_numbers && (
//               <p>
//                 <strong className="text-[#6524EB]">Phone Number:</strong> +{agentData?.voip_numbers?.replace(/\D/g, '')}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
//       <div className="flex justify-between">
//         <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
//           {mode === 'create' ? 'Create Your Own Agent' : 'Edit Agent'}
//         </h2>
//       </div>
//       {/* Language */}

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//         <input
//           type="text"
//           maxLength={20}
//           value={form.agentName}
//           onChange={(e) => {
//             const value = e.target.value;
//             const isValid = /^[A-Za-z\s]*$/.test(value); // letters and spaces only
//             if (isValid || value === '') {
//               setForm({ ...form, agentName: value });
//             }
//           }}
//           placeholder="Enter your name"
//           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Select Language</label>
//         <FormControl>
//           <Select
//             onValueChange={(v) => setForm({ ...form, language: v, agentLanguage: languages?.find((lang) => lang?.locale == v)?.name || v })}
//             value={form.language}
//           >
//             <InputLabel id="demo-select-label">Choose language</InputLabel>

//             {languages.map((lang) => (
//               <MenuItem key={lang.locale} value={lang.locale}>
//                 <span className="inline-flex items-center gap-2">
//                   <img
//                     src={`https://flagcdn.com/w20/${lang?.locale?.split('-')[1]?.toLowerCase() || 'us'}.png`}
//                     alt="flag"
//                     className="w-5 h-4"
//                   />
//                   {lang.name}
//                 </span>
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </div>

//       {/* Gender */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//         <FormControl>
//           <Select
//             value={form.gender}
//             onValueChange={(v) =>
//               setForm((prev: any) => ({
//                 ...prev,
//                 gender: v,
//                 avatar: '',
//                 voice: '',
//                 selectedVoice: null
//               }))
//             }
//           >
//             <InputLabel id="demo-select-label">Choose gender</InputLabel>

//             <MenuItem value="Male">Male</MenuItem>
//             <MenuItem value="Female">Female</MenuItem>
//           </Select>
//         </FormControl>
//       </div>

//       {/* Voice */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Voice</label>

//         {filteredVoices.length === 0 ? (
//           <p className="text-sm text-gray-500"> Select gender first.</p>
//         ) : (
//           <FormControl>
//             <Select
//               value={form.voice}
//               onValueChange={(v) => {
//                 const selectedVoice = filteredVoices.find((voice) => voice.voice_id === v);
//                 setForm({ ...form, voice: v, selectedVoice });
//                 // console.log('selectedVoice',selectedVoice,v)
//               }}
//             >
//               <InputLabel id="demo-select-label">Choose voice</InputLabel>

//               {filteredVoices.map((voice, index) => (
//                 <MenuItem key={index} value={voice.voice_id} className="py-2">
//                   <div className="flex items-center justify-between gap-2">
//                     <div>
//                       <p className="text-sm font-semibold">{voice?.voice_name?.replace(/\s*\(.*?\)/, '')}</p>
//                       <p className="text-xs text-muted-foreground">{voice?.accent || voice?.provider}</p>
//                     </div>
//                     <Button
//                       type="button"
//                       size="icon"
//                       style={{ zIndex: '99999', height: '45px', width: '53px' }}
//                       variant="ghost"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         togglePlay(index);
//                       }}
//                     >
//                       {playingIdx === index ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//                     </Button>
//                     <audio ref={(el) => (audioRefs.current[index] = el)} style={{ display: 'none' }}>
//                       <source src={voice.preview_audio_url} type="audio/mpeg" />
//                     </audio>
//                   </div>
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}
//       </div>

//       {/* Avatar */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
//         {form.gender ? (
//           <Select onValueChange={(v) => setForm({ ...form, avatar: v })} value={form.avatar}>
//             <InputLabel id="demo-select-label">Choose an avatar</InputLabel>
//             {avatars[form.gender]?.map((av, index) => (
//               <MenuItem key={index} value={av.img}>
//                 <div className="flex items-center gap-2">
//                   <img src={av.img} alt={`Avatar ${index + 1}`} className="w-6 h-6 rounded-full" />
//                   Avatar {index + 1}
//                 </div>
//               </MenuItem>
//             ))}
//           </Select>
//         ) : (
//           <p className="text-sm text-gray-500">Select gender to choose avatar</p>
//         )}
//       </div>

//       <Button className="w-full bg-purple-600 text-white hover:bg-purple-700" onClick={handleSubmit} disabled={loading}>
//         {loading ? (mode === 'create' ? 'Creating...' : 'Updating...') : mode === 'create' ? 'Create' : 'Update'}{' '}
//       </Button>
//       <br />
//       <br />

//       {mode === 'edit' && (
//         <Button
//           variant="outline"
//           className="w-full mt-2 bg-purple-600 text-white hover:bg-purple-700"
//           onClick={() => {
//             setMode('create');
//             setForm({ language: '', agentName: '', gender: '', voice: '', selectedVoice: null, avatar: '' });
//           }}
//         >
//           Cancel
//         </Button>
//       )}
//     </div>
//   );
// }

'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  CircularProgress,
  Modal,
  TextField,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { PlayArrow, Pause, MoreVert, Edit, Delete, PowerSettingsNew, Phone, Link } from '@mui/icons-material';
import { FadeLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import CallTest from './Urownagenthelper/CallTest';
import { RetellWebClient } from 'retell-client-js-sdk';
import AssignNumberModal from './Urownagenthelper/AssignNumberModal';
import PhoneInput from 'react-phone-input-2';
import { isValidPhoneNumber, parsePhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
import 'react-phone-input-2/lib/style.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { countAgentsbyUserId, createAgent, getRetellVoices } from '../../../Services/auth';
import { languages } from '../../lib/languageOptions';

import avatars from 'lib/avatars';

export default function AgentFormSetup() {
  const [form, setForm] = useState({
    language: '',
    agentLanguage: '',
    agentName: '',
    gender: '',
    voice: '',
    selectedVoice: null,
    avatar: ''
  });
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [voices, setVoices] = useState([]);
  const [playingIdx, setPlayingIdx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const audioRefs = useRef([]);
  const [agentExists, setAgentExists] = useState(null);
  const [agentData, setAgentData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [assignPhoneModal, setAssignPhoneModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const [callId, setCallId] = useState('');
  const isEndingRef = useRef(false);
  const [retellWebClient, setRetellWebClient] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [selectedAgentDetails, setSelectedAgentDetails] = useState(null);
  const [mode, setMode] = useState('create');
  const [showCallForwardingModal, setShowCallForwardingModal] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phone, setPhone] = useState('');
  const phoneInputRef = useRef(null);

  function getCallForwarding(callForwarding) {
    let msg = '';
    if (callForwarding) {
      msg = `Transition to CallTransfer_confirmation.`;
    } else {
      msg = `Say: "Call forwarding is not available.`;
    }
    return msg;
  }

  const handleUpdateLLM_ForCallForwarding = async (agentId, partnerName, llm, phone, callForwarding, callForwardingOptions) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const agentConfig = {
      version: 0,
      general_tools: [
        {
          type: 'end_call',
          name: 'end_call',
          description: 'End the call with user.'
        },
        {
          type: 'extract_dynamic_variable',
          name: 'extract_user_details',
          description: "Extract the user's details like name, email, phone number, address, and reason for calling from the conversation",
          variables: [
            { type: 'string', name: 'email', description: "Extract the user's email address from the conversation" },
            { type: 'number', name: 'phone', description: "Extract the user's phone number from the conversation" },
            { type: 'string', name: 'address', description: "Extract the user's address from the conversation" },
            { type: 'string', name: 'reason', description: "Extract the user's reason for calling from the conversation" },
            { type: 'string', name: 'name', description: "Extract the user's name from the conversation" }
          ]
        }
      ],
      states: [
        {
          name: 'information_collection',
          state_prompt: `Greet the user with the begin_message and assist with their query.
                          If the user wants to transfer the call:
                          ${getCallForwarding(callForwarding)}
                          If the user asks for an appointment (e.g., "appointment", "book", "schedule"),
                          transition to appointment_booking.
                          If the user is silent or unclear, say: "Sorry, I didn’t catch that. Could you please repeat?"
                          If the user wants to end the call transition to end_call_state`,
          edges: [{ destination_state_name: 'CallTransfer_confirmation', description: 'User wants to transfer call.' }]
        },
        {
          name: 'appointment_booking',
          state_prompt: '## Task\nYou will now help the user book an appointment.'
        },
        {
          name: 'CallTransfer_confirmation',
          state_prompt: `
                          Say: Would you like me to connect you with {{partner}}? Please say yes or no."
                          Wait for their response.
                          If the user says yes, transition to call_transfer.
                          If the user says no, transition to information_collection.
                          If the response is unclear, repeat the question once.
                      `,
          edges: [
            { destination_state_name: 'call_transfer', description: 'User agreed to speak to Partner.' },
            { destination_state_name: 'information_collection', description: 'User declined to speak to Partner.' }
          ],
          tools: []
        },
        {
          name: 'call_transfer',
          state_prompt: `Connecting you with Mr. {{partner}} now. Please hold.`,
          tools: [
            {
              type: 'transfer_call',
              name: 'transfer_to_Partner',
              description: 'Transfer the call to the Partner.',
              transfer_destination: { type: 'predefined', number: '{{business_Phone}}' },
              transfer_option: { type: 'cold_transfer', public_handoff_option: { message: 'Please hold while I transfer your call.' } },
              speak_during_execution: true,
              speak_after_execution: true,
              failure_message:
                "Sorry, I couldn't transfer your call. Please contact us at {{business_email}} or call {{business_Phone}} directly."
            }
          ],
          edges: []
        },
        {
          name: 'end_call_state',
          state_prompt: `Politely end the call by saying: "Thank you for calling. Have a great day!"`,
          tools: [{ type: 'end_call', name: 'end_call1', description: 'End the call with the user.' }],
          edges: []
        }
      ],
      starting_state: 'information_collection',
      default_dynamic_variables: {
        customer_name: 'John Doe',
        timeZone: timeZone,
        partner: partnerName,
        business_Phone: phone || ''
      }
    };
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/agent/updatePartnerAgentConfig`,
        {
          agentId,
          llm,
          callForwarding,
          callForwardingOptions,
          agentConfig
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      Swal.fire('Success', 'Call forwarding Settings updated!', 'success');
    } catch (error) {
      console.error('Error updating call forwarding:', error);
      Swal.fire('Error', 'An error occurred while updating call forwarding', 'error');
    }
  };

  const handleStopCallForwardingSubmit = async () => {
    setCancelLoading(true);
    const partnerName = localStorage.getItem('partnername') || 'Partner';
    await handleUpdateLLM_ForCallForwarding(agentData.agent_id, partnerName, agentData.llmId, '', false, null);
    setCancelLoading(false);
    setRefresh((prev) => !prev);
    setShowCallForwardingModal(false);
    setPhone('');
    setPhoneError('');
  };

  const handleCallForwardingSubmit = async () => {
    if (!phone) {
      setPhoneError('Phone number is required.');
      return;
    }
    const phoneNumber = parsePhoneNumberFromString('+' + phone);
    if (!phoneNumber) {
      setPhoneError('Invalid phone number format.');
      return;
    }
    if (!phoneNumber.isValid()) {
      setPhoneError('Invalid number for selected country.');
      return;
    }

    const partnerName = localStorage.getItem('partnername') || 'Partner';
    setLoading(true);
    await handleUpdateLLM_ForCallForwarding(agentData.agent_id, partnerName, agentData.llmId, phoneNumber?.number, true, {
      transsferType: 'Self',
      phone: phoneNumber?.number,
      ring_timeout: 20
    });
    setLoading(false);
    setRefresh((prev) => !prev);
    setShowCallForwardingModal(false);
    setPhone('');
    setPhoneError('');
  };

  function extractPromptVariables(template, dataObject) {
    const matches = [...template.matchAll(/{{(.*?)}}/g)];
    const uniqueVars = new Set(matches.map((m) => m[1].trim()));
    const flatData = {};

    function flatten(obj) {
      for (const key in obj) {
        const val = obj[key];
        if (typeof val === 'object' && val !== null && 'key' in val && 'value' in val) {
          flatData[val.key.trim()] = val.value;
        } else if (typeof val === 'object' && val !== null) {
          flatten(val);
        }
      }
    }

    flatten(dataObject);

    return Array.from(uniqueVars).map((variable) => ({
      name: variable,
      value: flatData[variable] ?? null,
      status: true
    }));
  }

  useEffect(() => {
    const client = new RetellWebClient();
    client.on('call_started', () => setIsCallActive(true));
    client.on('call_ended', () => setIsCallActive(false));
    client.on('update', (update) => {
      const customUpdate = { ...update, source: 'agent' };
      window.dispatchEvent(new CustomEvent('retellUpdate', { detail: customUpdate }));
    });
    setRetellWebClient(client);
  }, []);

  const onStartCall = async () => {
    let micPermission = await navigator.permissions.query({ name: 'microphone' });
    if (micPermission.state !== 'granted') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        micPermission = await navigator.permissions.query({ name: 'microphone' });
        if (micPermission.state !== 'granted') {
          Swal.fire('Microphone Required', 'You must grant microphone access to start the call.', 'warning');
          return;
        }
      } catch (err) {
        Swal.fire('Microphone Blocked', 'Please allow microphone permission to continue.', 'error');
        setShowCallModal(false);
        return;
      }
    }
    setCallLoading(true);
    try {
      const agentId = agentData?.agent_id;
      if (!agentId) throw new Error('No agent ID found');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/agent/create-web-call`,
        { agent_id: agentId },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setCallLoading(true);
      if (response.status == 403) {
        Swal.fire('Error', 'Agent Plan minutes exhausted', 'error');
        setIsCallInProgress(false);
        return;
      }
      await retellWebClient.startCall({ accessToken: response?.data?.access_token });
      setCallId(response?.data?.call_id);
      setIsCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);
      Swal.fire('Failed to start call. Please try again.');
    } finally {
      setCallLoading(false);
    }
  };

  const onEndCall = async () => {
    isEndingRef.current = false;
    setRefresh((prev) => !prev);
    try {
      await retellWebClient.stopCall();
      setIsCallActive(false);
      isEndingRef.current = false;
    } catch (error) {
      console.error('Error ending call:', error);
      Swal.fire('Failed to end call. Please try again.');
    }
  };

  const getLeadTypeChoices = () => {
    const fixedChoices = ['Spam Caller', 'Irrelvant Call', 'Angry Old Customer', 'Customer'];
    const cleanedServices = fixedChoices
      .map((service) => service?.trim())
      .filter((service) => service && service?.toLowerCase() !== 'other')
      .map((service) => {
        const normalized = service?.replace(/\s+/g, ' ')?.trim();
        return `Customer for ${normalized}`;
      });
    return Array.from(new Set([...fixedChoices, ...cleanedServices]));
  };

  const handleAction = (action) => {
    switch (action) {
      case 'edit':
        setForm({
          language: agentData?.agentLanguage || '',
          agentLanguage: agentData?.agentLanguage || '',
          agentName: agentData?.agentName || '',
          gender: agentData?.agentGender || '',
          voice: agentData?.agentVoice || '',
          selectedVoice: voices.find((v) => v.voice_id === agentData?.agentVoice) || null,
          avatar: agentData?.avatar || ''
        });
        setMode('edit');
        setShowEditModal(false);
        setShowEditModal(true);
        break;
      case 'delete':
        setShowDeleteConfirm(true);
        break;
      case 'deactivate':
        Swal.fire('Agent Deactivated', '', 'info');
        break;
      case 'cancel':
        setShowCancelConfirm(true);
        break;
      case 'assign':
        Swal.fire('Phone Assigned', '', 'success');
        break;
      case 'test':
        Swal.fire('Testing Agent...', '', 'info');
        break;
      case 'call':
        Swal.fire('Call Link Opened', '', 'success');
        break;
      default:
        break;
    }
  };

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchAgentStatus = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/partneragent/${userId}`);
        if (res.data.status === true) {
          setAgentExists(true);
          setAgentData(res?.data?.agents[0]);
        } else {
          setAgentExists(false);
        }
      } catch (error) {
        console.error('Error fetching agent status:', error);
        setAgentExists(false);
      }
    };
    fetchAgentStatus();
  }, [refresh]);

  useEffect(() => {
    fetchInitialData();
  }, [refresh]);

  useEffect(() => {
    if (mode === 'edit' && agentData) {
      setForm({
        language: agentData?.agentLanguageCode || '',
        agentLanguage: agentData?.agentLanguage || '',
        agentName: agentData?.agentName || '',
        gender: agentData?.agentGender == 'male' ? 'Male' : 'Female' || '',
        voice: agentData?.agentVoice || '',
        selectedVoice: voices.find((v) => v.voice_id == agentData?.agentVoice) || null,
        avatar: agentData?.avatar || ''
      });
    }
  }, []);

  const fetchInitialData = async () => {
    if (voices.length > 0) return;
    try {
      const voicesRes = await getRetellVoices();
      setVoices(voicesRes);
    } catch (err) {
      console.error('Error loading voices:', err);
    }
  };

  const filteredVoices = voices.filter((v) => v?.provider == 'elevenlabs' && v?.gender?.toLowerCase() === form.gender?.toLowerCase());

  const togglePlay = (index) => {
    const current = audioRefs.current[index];
    if (!current) return;
    if (playingIdx === index) {
      current.pause();
      setPlayingIdx(null);
    } else {
      audioRefs.current.forEach((a, i) => {
        if (i !== index && a) a.pause();
      });
      current.play();
      setPlayingIdx(index);
    }
    current.onended = () => setPlayingIdx(null);
  };

//   const handleSubmit = async () => {
//     const userId = localStorage.getItem('userId');
//     if (!form.agentName || !form.language || !form.gender || !form.voice || !form.avatar) {
//       Swal.fire('Please fill all required fields: agentname, Language, Gender, Voice, Avatar.');
//       return;
//     }
//     if (mode == 'create') {
//       try {
//         setLoading(true);
//         const businessPayload = {
//           userId,
//           businessType: 'AI Virtual Receptionist',
//           businessName: 'Receptin',
//           businessSize: '50-100',
//           buisnessService: ['AI Virtual Receptionist Service'],
//           buisnessEmail: 'support@rxpt.us',
//           address1: '11210 NW 45th St #, Coral Springs, FL 33065, United States',
//           city: 'Coral Springs',
//           state: 'Florida',
//           country: 'United States',
//           webUrl: 'www.rxpt.us',
//           street_number: '11210 NW 45th St #'
//         };
//         const businessRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/businessDetails/create`, businessPayload);
//         const businessId = businessRes.data.record.businessId;
//         const agentCode = businessRes.data.agentCode;
//         localStorage.setItem('BusinessId', businessId);
//         localStorage.setItem('agentCode', agentCode);
//         const knowledgeText = [
//           {
//             title: 'Business Details',
//             text: `Name: Receptin
//             Address: 11210 NW 45th St #, Coral Springs, FL 33065, United States
//             Phone: +1 (772) 271 7966
//             Website: www.rxpt.us
//             Email: support@rxpt.us
//             About: N/A
//             Google: N/A`
//           }
//         ];
//         let agentCount = 0;
//         let knowledgeBaseName = '';
//         try {
//           agentCount = await countAgentsbyUserId(userId);
//           knowledgeBaseName = `Prtnr_${userId}_${agentCode}_#${agentCount + 1}`;
//           localStorage.setItem('knowledgebaseName', knowledgeBaseName);
//         } catch (error) {
//           console.error('Error generating knowledgeBaseName:', error);
//           return null;
//         }
//         const knowledgeFormData = new FormData();
//         knowledgeFormData.append('knowledge_base_name', knowledgeBaseName);
//         knowledgeFormData.append('enable_auto_refresh', 'true');
//         knowledgeFormData.append('knowledge_base_texts', JSON.stringify(knowledgeText));
//         knowledgeFormData.append('knowledge_base_urls', JSON.stringify(['https://www.rxpt.us']));
//         const kbRes = await axios.post('https://api.retellai.com/create-knowledge-base', knowledgeFormData, {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//         const knowledge_Base_ID = kbRes?.data?.knowledge_base_id;
//         knowledgeFormData.append('knowledgeBaseId', knowledge_Base_ID);
//         localStorage.setItem('knowledge_Base_ID', knowledge_Base_ID);
//         localStorage.getItem('BusinessId');
//         knowledgeFormData.append('agentId', null);
//         await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/businessDetails/updateKnowledeBase/${businessId}`, knowledgeFormData, {
//           headers: {
//             Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//         const partnername = localStorage.getItem('partnername') || 'Receptin';
//         const partnerFirstName = partnername.split(' ')[0];
//         const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//         const currentTime = new Date().toLocaleString('en-US', { timeZone });
//         const filledPrompt = `
// You are ${form.agentName}, a ${form.gender} assistant to ${partnername}, 
// who helps ${partnerFirstName} in selling the services of “Receptin”. You can explain all about the Receptin application and its features based on the added knowledge base.
// ### Persona of the Receptionist
// - Role: A seasoned SDR named ${form.agentName} who answers inbound calls on behalf of ${partnername} to help sell AI Receptionist Service named “Receptin” using which anyone can create a virtual AI receptionist for their business. The details of the service and its features can be taken from the Knowledge Base.
// - Skills: Customer service, Sales Development, communication skills, problem solving, emergency response handling, services knowledge from the knowledge base, and caller data collection.
// Greet the caller with a warm welcome directly in language the language code is this ${form.language}. Do not repeat the greeting in another language.
// You can shift to multi language, if the caller asks you to or if you switch the language in between of the conversation.
// 1. Clarity and Simplicity: Keep responses clear, concise, and to the point. Use simple language and avoid unnecessary details to ensure the caller easily understands the information provided.
// 2. Personalization: Tailor interactions to be empathetic and polite. Please keep your response natural.
// 3. Focus on each step: Remember the steps to sell the AI Receptionist Service, and that you must stay on track with these steps.
// - Process to follow: Take all the details of the caller, like name, phone number, email address, and business name, before guiding them further.
// - Behaviour: Calm, Pleasing, and professional. Do not show too much excitement while talking. Do not say "Thanks" or "Thank you" more than twice in a call. Stay focused on more human-like behaviour. Control your excitement and talk normally. Be very concise and quick in your conversations.
// ### Rules for AI Voice Assistant:
// The agent must respect multi and converse only in that language.
// - Current Time: ${currentTime}
// - Timezone: ${timeZone}
// ### More Instructions
// You can assist callers with the following:
// - General inquiries, such as Services Information
// - Book Meetings with Technical Specialists if the caller wants the enterprise package, for which the price is not listed.
// - Assist the caller in buying the correct package for a specific business
// - Guide them on a step-by-step Process to purchase the optimum package and set up a new AI receptionist for their specific business based on the Knowledge Base.
// - Take the project details from the caller for Future Interactions
// - Take Details of the caller and the Business for which an AI Receptionist is required
// - Handle Complaints with a calm & natural voice and provide an accurate solution to the complaint.
// - If no solution is accepted by the caller and the caller is adamant to talk to a human only, then only transfer the call to a human representative.
// Keep the conversation concise and to the point.
// The user transcript might contain transcription errors. Use your best judgment to guess and respond.
// `;
//         const rawPromptTemplate = `
// You are {{AGENT NAME}}, a {{AGENT GENDER}} assistant to {{PARTNER FULL NAME}}, 
// who helps {{PARTNER FIRST NAME}} in selling the services of “Receptin”. You can explain all about the Receptin application and its features based on the added knowledge base.
// ### Persona of the Receptioni {{AGENT NAME}} who answers inbound calls on behalf of {{PARTNER FULL NAME}} to help sell AI Receptionist Service named “Receptin” using which anyone can create a virtual AI receptionist for their business. The details of the service and its features can be taken from the Knowledge Base.
// - Skills: Customer service, Sales Development, communication skills, problem solving, emergency response handling, services knowledge from the knowledge base, and caller data collection.
// Greet the caller with a warm welcome directly in language the language code is this {{LANGUAGE}}. Do not repeat the greeting in another language.
// You can shift to multi language, if the caller asks you to or if you switch the language in between of the conversation.
// 1. Clarity and Simplicity: Keep responses clear, concise, and to the point. Use simple language and avoid unnecessary details to ensure the caller easily understands the information provided.
// 2. Personalization: Tailor interactions to be empathetic and polite. Please keep your response natural.
// 3. Focus on each step: Remember the steps to sell the AI Receptionist Service, and that you must stay on track with these steps.
// - Process to follow: Take all the details of the caller, like name, phone number, email address, and business name, before guiding them further.
// - Behaviour: Calm, Pleasing, and professional. Do not show too much excitement while talking. Do not say "Thanks" or "Thank you" more than twice in a call. Stay focused on more human-like behaviour. Control your excitement and talk normally. Be very concise and quick in your conversations.
// ### Rules for AI Voice Assistant:
// The agent must respect multi and converse only in that language.
// - Current Time: {{CURRENT TIME}}
// - Timezone:{{TIMEZONE}}
// ### More Instructions
// You can assist callers with the following:
// - General inquiries, such as Services Information
// - Book Meetings with Technical Specialists if the caller wants the enterprise package, for which the price is not listed.
// - Assist the caller in buying the correct package for a specific business
// - Guide them on a step-by-step Process to purchase the optimum package and set up a new AI receptionist for their specific business based on the Knowledge Base.
// - Take the project details from the caller for Future Interactions
// - Take Details of the caller and the Business for which an AI Receptionist is required
// - Handle Complaints with a calm & natural voice and provide an accurate solution to the complaint.
// - If no solution is accepted by the caller and the caller is adamant to talk to a human only, then only transfer the call to a human representative.
// Keep the conversation concise and to the point.
// The user transcript might contain transcription errors. Use your best judgment to guess and respond.
// `;
//         const promptVariablesList = extractPromptVariables(rawPromptTemplate, {
//           agentName: { key: 'AGENT NAME', value: form.agentName?.split(' ')[0] || 'Assistant' },
//           agentGender: { key: 'AGENT GENDER', value: form.gender || 'neutral' },
//           partnerNameFull: { key: 'PARTNER FULL NAME', value: partnername },
//           partnerFirstName: { key: 'PARTNER FIRST NAME', value: partnerFirstName },
//           businessName: { key: 'BUSINESS NAME', value: 'Receptin' },
//           businessEmail: { key: 'BUSINESS EMAIL ID', value: 'support@rxpt.us' },
//           aboutBusiness: { key: 'MORE ABOUT YOUR BUSINESS', value: 'We provide virtual AI receptionist services.' },
//           businessAddress: { key: 'BUSINESS ADDRESS', value: '11210 NW 45th St #, Coral Springs, FL 33065, United States' },
//           businessWebsite: { key: 'BUSINESS WEBSITE', value: 'www.rxpt.us' },
//           businessPhone: { key: 'BUSINESS PHONE', value: '+1 (772) 271 7966' },
//           businessType: { key: 'BUSINESSTYPE', value: 'AI Virtual Receptionist' },
//           commaSeparatedServices: { key: 'SERVICES', value: 'AI Virtual Receptionist Service' },
//           languageSelect: { key: 'LANGUAGE', value: form.language || 'English' },
//           timeZone: { key: 'TIMEZONE', value: timeZone },
//           current_time: { key: 'CURRENT TIME', value: currentTime },
//           [`current_time_[${timeZone}]`]: { key: `CURRENT TIME IN ${timeZone}`, value: currentTime }
//         });
//         const agentConfig = {
//           version: 0,
//           model: 'gemini-2.0-flash',
//           model_temperature: 0,
//           model_high_priority: true,
//           tool_call_strict_mode: true,
//           general_prompt: filledPrompt,
//           general_tools: [
//             {
//               type: 'end_call',
//               name: 'end_call',
//               description: 'End the call with user.'
//             },
//             {
//               type: 'extract_dynamic_variable',
//               name: 'extract_user_details',
//               description:
//                 "Extract the user's details like name, email, phone number, address, and reason for calling from the conversation",
//               variables: [
//                 { type: 'string', name: 'email', description: "Extract the user's email address from the conversation" },
//                 { type: 'number', name: 'phone', description: "Extract the user's phone number from the conversation" },
//                 { type: 'string', name: 'address', description: "Extract the user's address from the conversation" },
//                 { type: 'string', name: 'reason', description: "Extract the user's reason for calling from the conversation" },
//                 { type: 'string', name: 'name', description: "Extract the user's name from the conversation" }
//               ]
//             }
//           ],
//           states: [
//             {
//               name: 'information_collection',
//               state_prompt: `Greet the user with the begin_message and assist with their query.
//                               If the user wants to transfer the call, then say Call forwarding is not available.
//                               If the user asks for an appointment (e.g., "appointment", "book", "schedule"), transition to appointment_booking.
//                               If the user is silent or unclear, say: "Sorry, I didn’t catch that. Could you please repeat?"
//                               If the user wants to end the call transition to end_call_state`,
//               edges: [{ destination_state_name: 'CallTransfer_confirmation', description: 'User wants to tranfer call to talk.' }]
//             },
//             {
//               name: 'appointment_booking',
//               state_prompt: '## Task\nYou will now help the user book an appointment.'
//             },
//             {
//               name: 'CallTransfer_confirmation',
//               state_prompt: `
//                               Say: Would you like me to connect you with {{partner}}? Please say yes or no."
//                               Wait for their response.
//                               If the user says yes, transition to call_transfer.
//                               If the user says no, transition to information_collection.
//                               If the response is unclear, repeat the question once.
//                           `,
//               edges: [
//                 { destination_state_name: 'call_transfer', description: 'User agreed to speak to Partner.' },
//                 { destination_state_name: 'information_collection', description: 'User declined to speak to partner.' }
//               ],
//               tools: []
//             },
//             {
//               name: 'call_transfer',
//               state_prompt: `Connecting you to a team member now. Please hold.`,
//               tools: [
//                 {
//                   type: 'transfer_call',
//                   name: 'transfer_to_Partner',
//                   description: 'Transfer the call to the team member.',
//                   transfer_destination: { type: 'predefined', number: '{{business_Phone}}' },
//                   transfer_option: { type: 'cold_transfer', public_handoff_option: { message: 'Please hold while I transfer your call.' } },
//                   speak_during_execution: true,
//                   speak_after_execution: true,
//                   failure_message:
//                     "Sorry, I couldn't transfer your call. Please contact us at {{business_email}} or call {{business_Phone}} directly."
//                 }
//               ],
//               edges: []
//             },
//             {
//               name: 'end_call_state',
//               state_prompt: `Politely end the call by saying: "Thank you for calling. Have a great day!"`,
//               tools: [{ type: 'end_call', name: 'end_call1', description: 'End the call with the user.' }],
//               edges: []
//             }
//           ],
//           starting_state: 'information_collection',
//           default_dynamic_variables: {
//             customer_name: 'John Doe',
//             timeZone: timeZone
//           }
//         };
//         const knowledgeBaseId = localStorage.getItem('knowledge_Base_ID');
//         if (knowledgeBaseId) {
//           agentConfig.knowledge_base_ids = [knowledgeBaseId];
//         }
//         const llmRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/createAdmin/llm`, agentConfig, {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`
//           }
//         });
//         const llmId = llmRes.data.data.llm_id;
//         const agentRes = await axios.post(
//           'https://api.retellai.com/create-agent',
//           {
//             response_engine: { type: 'retell-llm', llm_id: llmId },
//             voice_id: form.voice,
//             agent_name: form.selectedVoice?.voice_name || 'Virtual Assistant',
//             language: 'multi',
//             post_call_analysis_model: 'gpt-4o-mini',
//             responsiveness: 1,
//             enable_backchannel: true,
//             interruption_sensitivity: 0.91,
//             backchannel_frequency: 0.7,
//             backchannel_words: ['Got it', 'Yeah', 'Uh-huh', 'Understand', 'Ok', 'hmmm'],
//             post_call_analysis_data: [
//               {
//                 type: 'enum',
//                 name: 'lead_type',
//                 description: 'Feedback given by the customer about the call.',
//                 choices: getLeadTypeChoices()
//               },
//               {
//                 type: 'string',
//                 name: 'name',
//                 description: "Extract the user's name from the conversation",
//                 examples: ['Ajay Sood', 'John Wick', 'Adam Zampa', 'Jane Doe', 'Nitish Kumar', 'Ravi Shukla']
//               },
//               {
//                 type: 'string',
//                 name: 'email',
//                 description: "Extract the user's email from the conversation",
//                 examples: ['john.doe@example.com', 'nitish@company.in', '12@gmail.com']
//               },
//               {
//                 type: 'string',
//                 name: 'reason',
//                 description:
//                   "The reason the user is calling or their inquiry. If provided in Hindi, translate to English. Summarize if it's long.",
//                 examples: ['Schedule an appointment', 'Ask about services', 'Request for accounting help']
//               },
//               {
//                 type: 'string',
//                 name: 'address',
//                 description:
//                   "The user's address or business location. If spoken in Hindi, translate to English. Format it for use in CRM or contact forms.",
//                 examples: ['123 Main St, Delhi', '42 Wallaby Way, Sydney', '1490 Aandhar Eleven']
//               },
//               {
//                 type: 'number',
//                 name: 'phone_number',
//                 description:
//                   "The user's phone number in numeric format. If digits are spoken in words (e.g., 'seven eight seven six one two'), convert them to digits (e.g., '787612'). Ensure it's a valid number when possible."
//               }
//             ],
//             end_call_after_silence_ms: 30000,
//             normalize_for_speech: true,
//             webhook_url: `${process.env.NEXT_PUBLIC_API_URL}/api/agent/updateAgentCall_And_Mins_WebHook`
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`
//             }
//           }
//         );
//         const agentId = agentRes.data.agent_id;
//         const dbPayload = {
//           userId,
//           agent_id: agentId,
//           llmId,
//           avatar: form.avatar,
//           agentVoice: form.voice,
//           knowledgeBaseId: knowledge_Base_ID,
//           agentAccent: form.selectedVoice?.voice_accent || 'American',
//           agentRole: 'Partner Assistant',
//           agentName: form.agentName || 'Virtual Assistant',
//           agentLanguageCode: form.language,
//           agentLanguage: form.agentLanguage,
//           dynamicPromptTemplate: filledPrompt,
//           rawPromptTemplate: filledPrompt,
//           promptVariablesList: JSON.stringify(promptVariablesList),
//           agentGender: form.gender,
//           agentPlan: 'free',
//           agentStatus: true,
//           businessId,
//           additionalNote: '',
//           agentCreatedBy: 'partner'
//         };
//         const saveRes = await createAgent(dbPayload);
//         if (saveRes.status === 200 || saveRes.status === 201) {
//           setLoading(false);
//           setRefresh((prev) => !prev);
//           Swal.fire('Agent created successfully!');
//           localStorage.removeItem('agentCode');
//           localStorage.removeItem('businessType');
//         } else {
//           throw new Error('Agent creation failed.');
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error('Error during full setup:', err);
//         Swal.fire('Something went wrong during setup.');
//         setLoading(false);
//       } finally {
//         setLoading(false);
//       }
//     } else if (mode == 'edit') {
//       setLoading(true);
//       try {
//         const agentId = agentData?.agent_id;
//         const llmId = agentData?.llmId;
//         const knowledgeBaseId = agentData?.knowledgeBaseId;
//         const businessId = agentData?.businessId;
//         if (!agentId || !llmId || !knowledgeBaseId || !businessId) {
//           throw new Error('Missing required agent data for update.');
//         }
//         const partnername = localStorage.getItem('partnername') || 'Receptin';
//         const partnerFirstName = partnername.split(' ')[0];
//         const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//         const currentTime = new Date().toLocaleString('en-US', { timeZone });
//         const filledPrompt = `
//   You are ${form.agentName}, a ${form.gender} assistant to ${partnername}, 
//   who helps ${partnerFirstName} in selling the services of “Receptin”. You can explain all about the Receptin application and its features based on the added knowledge base.
//   ### Persona of the Receptionist
//   - Role: A seasoned SDR named ${form.agentName} who answers inbound calls on behalf of ${partnername} to help sell AI Receptionist Service named “Receptin” using which anyone can create a virtual AI receptionist for their business. The details of the service and its features can be taken from the Knowledge Base.
//   - Skills: Customer service, Sales Development, communication skills, problem solving, emergency response handling, services knowledge from the knowledge base, and caller data collection.
//   Greet the caller with a warm welcome directly in language the language code is this ${form.language}. Do not repeat the greeting in another language.
//   You can shift to multi language, if the caller asks you to or if you switch the language in between of the conversation.
//   1. Clarity and Simplicity: Keep responses clear, concise, and to the point. Use simple language and avoid unnecessary details to ensure the caller easily understands the information provided.
//   2. Personalization: Tailor interactions to be empathetic and polite. Please keep your response natural.
//   3. Focus on each step: Remember the steps to sell the AI Receptionist Service, and that you must stay on track with these steps.
//   - Process to follow: Take all the details of the caller, like name, phone number, email address, and business name, before guiding them further.
//   - Behaviour: Calm, Pleasing, and professional. Do not show too much excitement while talking. Do not say "Thanks" or "Thank you" more than twice in a call. Stay focused on more human-like behaviour. Control your excitement and talk normally. Be very concise and quick in your conversations.
//   ### Rules for AI Voice Assistant:
//   The agent must respect multi and converse only in that language.
//   - Current Time: ${currentTime}
//   - Timezone: ${timeZone}
//   ### More Instructions
//   You can assist callers with the following:
//   - General inquiries, such as Services Information
//   - Book Meetings with Technical Specialists if the caller wants the enterprise package, for which the price is not listed.
//   - Assist the caller in buying the correct package for a specific business
//   - Guide them on a step-by-step Process to purchase the optimum package and set up a new AI receptionist for their specific business based on the Knowledge Base.
//   - Take the project details from the caller for Future Interactions
//   - Take Details of the caller and the Business for which an AI Receptionist is required
//   - Handle Complaints with a calm & natural voice and provide an accurate solution to the complaint.
//   - If no solution is accepted by the caller and the caller is adamant to talk to a human only, then only transfer the call to a human representative.
//   Keep the conversation concise and to the point.
//   The user transcript might contain transcription errors. Use your best judgment to guess and respond.
//   `;
//         const rawPromptTemplate = `
// You are {{AGENT NAME}}, a {{AGENT GENDER}} assistant to {{PARTNER FULL NAME}}, 
// who helps {{PARTNER FIRST NAME}} in selling the services of “Receptin”. You can explain all about the Receptin application and its features based on the added knowledge base.
// ### Persona of the Receptioni {{AGENT NAME}} who answers inbound calls on behalf of {{PARTNER FULL NAME}} to help sell AI Receptionist Service named “Receptin” using which anyone can create a virtual AI receptionist for their business. The details of the service and its features can be taken from the Knowledge Base.
// - Skills: Customer service, Sales Development, communication skills, problem solving, emergency response handling, services knowledge from the knowledge base, and caller data collection.
// Greet the caller with a warm welcome directly in language the language code is this {{LANGUAGE}}. Do not repeat the greeting in another language.
// You can shift to multi language, if the caller asks you to or if you switch the language in between of the conversation.
// 1. Clarity and Simplicity: Keep responses clear, concise, and to the point. Use simple language and avoid unnecessary details to ensure the caller easily understands the information provided.
// 2. Personalization: Tailor interactions to be empathetic and polite. Please keep your response natural.
// 3. Focus on each step: Remember the steps to sell the AI Receptionist Service, and that you must stay on track with these steps.
// - Process to follow: Take all the details of the caller, like name, phone number, email address, and business name, before guiding them further.
// - Behaviour: Calm, Pleasing, and professional. Do not show too much excitement while talking. Do not say "Thanks" or "Thank you" more than twice in a call. Stay focused on more human-like behaviour. Control your excitement and talk normally. Be very concise and quick in your conversations.
// ### Rules for AI Voice Assistant:
// The agent must respect multi and converse only in that language.
// - Current Time: {{CURRENT TIME}}
// - Timezone:{{TIMEZONE}}
// ### More Instructions
// You can assist callers with the following:
// - General inquiries, such as Services Information
// - Book Meetings with Technical Specialists if the caller wants the enterprise package, for which the price is not listed.
// - Assist the caller in buying the correct package for a specific business
// - Guide them on a step-by-step Process to purchase the optimum package and set up a new AI receptionist for their specific business based on the Knowledge Base.
// - Take the project details from the caller for Future Interactions
// - Take Details of the caller and the Business for which an AI Receptionist is required
// - Handle Complaints with a calm & natural voice and provide an accurate solution to the complaint.
// - If no solution is accepted by the caller and the caller is adamant to talk to a human only, then only transfer the call to a human representative.
// Keep the conversation concise and to the point.
// The user transcript might contain transcription errors. Use your best judgment to guess and respond.
// `;
//         const promptVariablesList = extractPromptVariables(rawPromptTemplate, {
//           agentName: { key: 'AGENT NAME', value: form.agentName?.split(' ')[0] || 'Assistant' },
//           agentGender: { key: 'AGENT GENDER', value: form.gender || 'neutral' },
//           partnerNameFull: { key: 'PARTNER FULL NAME', value: partnername },
//           partnerFirstName: { key: 'PARTNER FIRST NAME', value: partnerFirstName },
//           businessName: { key: 'BUSINESS NAME', value: 'Receptin' },
//           businessEmail: { key: 'BUSINESS EMAIL ID', value: 'support@rxpt.us' },
//           aboutBusiness: { key: 'MORE ABOUT YOUR BUSINESS', value: 'We provide virtual AI receptionist services.' },
//           businessAddress: { key: 'BUSINESS ADDRESS', value: '11210 NW 45th St #, Coral Springs, FL 33065, United States' },
//           businessWebsite: { key: 'BUSINESS WEBSITE', value: 'www.rxpt.us' },
//           businessPhone: { key: 'BUSINESS PHONE', value: '+1 (772) 271 7966' },
//           businessType: { key: 'BUSINESSTYPE', value: 'AI Virtual Receptionist' },
//           commaSeparatedServices: { key: 'SERVICES', value: 'AI Virtual Receptionist Service' },
//           languageSelect: { key: 'LANGUAGE', value: form.language || 'English' },
//           timeZone: { key: 'TIMEZONE', value: timeZone },
//           current_time: { key: 'CURRENT TIME', value: currentTime },
//           [`current_time_[${timeZone}]`]: { key: `CURRENT TIME IN ${timeZone}`, value: currentTime }
//         });
//         const callForwarding = agentData.callForwarding;
//         const agentConfig = {
//           version: 0,
//           model: 'gemini-2.0-flash',
//           model_temperature: 0,
//           model_high_priority: true,
//           tool_call_strict_mode: true,
//           general_prompt: filledPrompt,
//           general_tools: [
//             {
//               type: 'end_call',
//               name: 'end_call',
//               description: 'End the call with user.'
//             },
//             {
//               type: 'extract_dynamic_variable',
//               name: 'extract_user_details',
//               description:
//                 "Extract the user's details like name, email, phone number, address, and reason for calling from the conversation",
//               variables: [
//                 { type: 'string', name: 'email', description: "Extract the user's email address from the conversation" },
//                 { type: 'number', name: 'phone', description: "Extract the user's phone number from the conversation" },
//                 { type: 'string', name: 'address', description: "Extract the user's address from the conversation" },
//                 { type: 'string', name: 'reason', description: "Extract the user's reason for calling from the conversation" },
//                 { type: 'string', name: 'name', description: "Extract the user's name from the conversation" }
//               ]
//             }
//           ],
//           states: [
//             {
//               name: 'information_collection',
//               state_prompt: `Greet the user with the begin_message and assist with their query.
//                               If the user wants to transfer the call:
//                               ${getCallForwarding(callForwarding)}
//                               If the user asks for an appointment (e.g., "appointment", "book", "schedule"),transition to appointment_booking.
//                               If the user is silent or unclear, say: "Sorry, I didn’t catch that. Could you please repeat?"
//                               If the user wants to end the call transition to end_call_state`,
//               edges: [{ destination_state_name: 'CallTransfer_confirmation', description: 'User wants to transfer call.' }]
//             },
//             {
//               name: 'appointment_booking',
//               state_prompt: '## Task\nYou will now help the user book an appointment.'
//             },
//             {
//               name: 'CallTransfer_confirmation',
//               state_prompt: `
//                               Say: Would you like me to connect you with {{partner}}? Please say yes or no."
//                               Wait for their response.
//                               If the user says yes, transition to call_transfer.
//                               If the user says no, transition to information_collection.
//                               If the response is unclear, repeat the question once.
//                           `,
//               edges: [
//                 { destination_state_name: 'call_transfer', description: 'User agreed to speak to Partner.' },
//                 { destination_state_name: 'information_collection', description: 'User declined to speak to Partner.' }
//               ],
//               tools: []
//             },
//             {
//               name: 'call_transfer',
//               state_prompt: `Connecting you to a team member now. Please hold.`,
//               tools: [
//                 {
//                   type: 'transfer_call',
//                   name: 'transfer_to_Partner',
//                   description: 'Transfer the call to the team member.',
//                   transfer_destination: { type: 'predefined', number: '{{business_Phone}}' },
//                   transfer_option: { type: 'cold_transfer', public_handoff_option: { message: 'Please hold while I transfer your call.' } },
//                   speak_during_execution: true,
//                   speak_after_execution: true,
//                   failure_message:
//                     "Sorry, I couldn't transfer your call. Please contact us at {{business_email}} or call {{business_Phone}} directly."
//                 }
//               ],
//               edges: []
//             },
//             {
//               name: 'end_call_state',
//               state_prompt: `Politely end the call by saying: "Thank you for calling. Have a great day!"`,
//               tools: [{ type: 'end_call', name: 'end_call1', description: 'End the call with the user.' }],
//               edges: []
//             }
//           ],
//           starting_state: 'information_collection',
//           default_dynamic_variables: {
//             customer_name: 'John Doe',
//             timeZone: timeZone
//           }
//         };
//         await axios.patch(`https://api.retellai.com/update-retell-llm/${llmId}`, agentConfig, {
//           headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}` }
//         });
//         await axios.patch(
//           `https://api.retellai.com/update-agent/${agentId}`,
//           {
//             response_engine: { type: 'retell-llm', llm_id: llmId },
//             voice_id: form.voice,
//             agent_name: form.selectedVoice?.voice_name || form.agentName || 'Virtual Assistant',
//             language: 'multi',
//             post_call_analysis_model: 'gpt-4o-mini',
//             responsiveness: 1,
//             enable_backchannel: true,
//             interruption_sensitivity: 0.91,
//             backchannel_frequency: 0.7,
//             backchannel_words: ['Got it', 'Yeah', 'Uh-huh', 'Understand', 'Ok', 'hmmm'],
//             post_call_analysis_data: [
//               {
//                 type: 'enum',
//                 name: 'lead_type',
//                 description: 'Feedback given by the customer about the call.',
//                 choices: getLeadTypeChoices()
//               },
//               {
//                 type: 'string',
//                 name: 'name',
//                 description: "Extract the user's name from the conversation",
//                 examples: ['Ajay Sood', 'John Wick', 'Adam Zampa', 'Jane Doe', 'Nitish Kumar', 'Ravi Shukla']
//               },
//               {
//                 type: 'string',
//                 name: 'email',
//                 description: "Extract the user's email from the conversation",
//                 examples: ['john.doe@example.com', 'nitish@company.in', '12@gmail.com']
//               },
//               {
//                 type: 'string',
//                 name: 'reason',
//                 description:
//                   "The reason the user is calling or their inquiry. If provided in Hindi, translate to English. Summarize if it's long.",
//                 examples: ['Schedule an appointment', 'Ask about services', 'Request for accounting help']
//               },
//               {
//                 type: 'string',
//                 name: 'address',
//                 description:
//                   "The user's address or business location. If spoken in Hindi, translate to English. Format it for use in CRM or contact forms.",
//                 examples: ['123 Main St, Delhi', '42 Wallaby Way, Sydney', '1490 Aandhar Eleven']
//               },
//               {
//                 type: 'number',
//                 name: 'phone_number',
//                 description:
//                   "The user's phone number in numeric format. If digits are spoken in words (e.g., 'seven eight seven six one two'), convert them to digits (e.g., '787612'). Ensure it's a valid number when possible."
//               }
//             ],
//             end_call_after_silence_ms: 30000,
//             normalize_for_speech: true,
//             webhook_url: `${process.env.NEXT_PUBLIC_API_URL}/api/agent/updateAgentCall_And_Mins_WebHook`
//           },
//           { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}` } }
//         );
//         const dbPayload = {
//           userId,
//           agent_id: agentId,
//           llmId,
//           avatar: form.avatar,
//           agentVoice: form.voice,
//           knowledgeBaseId,
//           agentAccent: form.selectedVoice?.voice_accent || 'American',
//           agentRole: 'Partner Assistant',
//           agentName: form.agentName || 'Virtual Assistant',
//           agentLanguageCode: form.language,
//           agentLanguage: form.agentLanguage,
//           dynamicPromptTemplate: filledPrompt,
//           rawPromptTemplate: filledPrompt,
//           promptVariablesList: JSON.stringify(promptVariablesList),
//           agentGender: form.gender,
//           agentPlan: agentData?.agentPlan || 'free',
//           agentStatus: agentData?.agentStatus || true,
//           businessId,
//           additionalNote: '',
//           agentCreatedBy: 'partner'
//         };
//         const updateRes = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/updateAgent/${agentId}`, dbPayload);
//         if (updateRes.status === 200 || updateRes.status === 201) {
//           setRefresh((prev) => !prev);
//           setMode('create');
//           setShowEditModal(false);
//           setForm({ language: '', agentName: '', gender: '', voice: '', selectedVoice: null, avatar: '', agentLanguage: '' });
//           Swal.fire('Agent updated successfully!');
//         } else {
//           throw new Error('Agent update failed.');
//         }
//       } catch (error) {
//         console.error('Error during edit:', error);
//         Swal.fire('Something went wrong while editing.');
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');
    if (!form.agentName || !form.language || !form.gender || !form.voice || !form.avatar) {
      Swal.fire('Please fill all required fields: agentname, Language, Gender, Voice, Avatar.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'create') {
        // Package all data into one object for create
        const createPayload = {
          userId,
          timeZone,
          business: {
            businessType: 'AI Virtual Receptionist',
            businessName: 'Receptin',
            businessSize: '50-100',
            buisnessService: ['AI Virtual Receptionist Service'],
            buisnessEmail: 'support@rxpt.us',
            address1: '11210 NW 45th St #, Coral Springs, FL 33065, United States',
            city: 'Coral Springs',
            state: 'Florida',
            country: 'United States',
            webUrl: 'www.rxpt.us',
            street_number: '11210 NW 45th St #'
          },
          knowledge: {
            texts: [
              {
                title: 'Business Details',
                text: `Name: Receptin
Address: 11210 NW 45th St #, Coral Springs, FL 33065, United States
Phone: +1 (772) 271 7966
Website: www.rxpt.us
Email: support@rxpt.us
About: N/A
Google: N/A`
              }
            ],
            urls: ['https://www.rxpt.us'],
            enable_auto_refresh: true
          },
          agent: {
            agentName: form.agentName,
            agentLanguageCode: form.language,
            agentLanguage: form.agentLanguage,
            agentGender: form.gender.toLowerCase(),
            agentVoice: form.voice,
            agentAccent: form.selectedVoice?.voice_accent || 'American',
            avatar: form.avatar,
            agentPlan: 'free',
            agentRole: 'Partner Assistant',
            agentStatus: true,
            agentCreatedBy: 'partner',
            additionalNote: ''
          },
          // Include any other static configs if needed (e.g., model: 'gemini-2.0-flash', etc.)
          // Backend will generate prompts, variables, agentConfig, etc., based on this data
        };

        // Send to single backend API for creation
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/enterpriseAgent/createPartnerOwnAgent`, createPayload, {
          headers: {
            'Content-Type': 'application/json',
            // Add auth if needed
          }
        });

        if (response.data.status === true) {
          setRefresh((prev) => !prev);
          Swal.fire('Agent created successfully!');
          localStorage.removeItem('agentCode');
          localStorage.removeItem('businessType');
        } else {
          throw new Error('Agent creation failed.');
        }
      } else if (mode === 'edit') {
        // Package all data into one object for edit
        const editPayload = {
          userId,
          agentId: agentData?.agent_id,
          llmId: agentData?.llmId,
          knowledgeBaseId: agentData?.knowledgeBaseId,
          businessId: agentData?.businessId,
          agent: {
            agentName: form.agentName,
            agentLanguageCode: form.language,
            agentLanguage: form.agentLanguage,
            agentGender: form.gender.toLowerCase(),
            agentVoice: form.voice,
            agentAccent: form.selectedVoice?.voice_accent || 'American',
            avatar: form.avatar,
            agentPlan: agentData?.agentPlan || 'free',
            agentStatus: agentData?.agentStatus || true,
            agentRole: 'Partner Assistant',
            agentCreatedBy: 'partner',
            additionalNote: ''
          },
          callForwarding: agentData.callForwarding // If needed
          // Backend will generate updated prompts, variables, agentConfig, etc.
        };

        // Send to single backend API for update
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/updatePartnerAgent`, editPayload, {
          headers: {
            'Content-Type': 'application/json',
            // Add auth if needed
          }
        });

        if (response.data.status === true) {
          setRefresh((prev) => !prev);
          setMode('create');
          setShowEditModal(false);
          setForm({ language: '', agentName: '', gender: '', voice: '', selectedVoice: null, avatar: '', agentLanguage: '' });
          Swal.fire('Agent updated successfully!');
        } else {
          throw new Error('Agent update failed.');
        }
      }
    } catch (err) {
      console.error('Error during submit:', err);
      Swal.fire('Something went wrong.', err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (agentExists === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <FadeLoader color="#6524EB" />
      </Box>
    );
  }

  if (agentExists && agentData && mode !== 'edit') {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 10, bgcolor: 'white', boxShadow: 3, borderRadius: 4, p: 4, border: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#6524EB' }}>
            Your Partner Agent
          </Typography>
          <Box>
            <IconButton onClick={(e) => setShowDropdown(e.currentTarget)}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={showDropdown}
              open={Boolean(showDropdown)}
              onClose={() => setShowDropdown(null)}
              PaperProps={{ sx: { width: 240, boxShadow: 3, borderRadius: 4, mt: 1 } }}
            >
              {!agentData.isDeactivated && (
                <MenuItem
                  onClick={() => {
                    setShowCallModal(true);
                    setShowDropdown(null);
                  }}
                >
                  <ListItemIcon>
                    <Phone fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Test Call</ListItemText>
                </MenuItem>
              )}
              {!agentData?.voip_numbers && !agentData.isDeactivated && (
                <MenuItem
                  onClick={() => {
                    setAssignPhoneModal(true);
                    setShowAssignModal(true);
                    setShowDropdown(null);
                  }}
                >
                  <ListItemIcon>
                    <Phone fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Assign Phone Number</ListItemText>
                </MenuItem>
              )}
              {!agentData.isDeactivated && (
                <MenuItem
                  onClick={() => {
                    setShowEditModal(true);
                    setShowDropdown(null);
                    setForm({
                      language: agentData?.agentLanguageCode || '',
                      agentLanguage: agentData?.agentLanguage || '',
                      agentName: agentData?.agentName || '',
                      gender: agentData?.agentGender == 'male' ? 'Male' : 'Female' || '',
                      voice: agentData?.agentVoice || '',
                      selectedVoice: voices.find((v) => v.voice_id == agentData?.agentVoice) || null,
                      avatar: agentData?.avatar || ''
                    });
                    setMode('edit');
                  }}
                >
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit Agent</ListItemText>
                </MenuItem>
              )}
              {!agentData.isDeactivated && (
                <MenuItem
                  onClick={() => {
                    setShowCallForwardingModal(true);
                    setShowDropdown(null);
                  }}
                >
                  <ListItemIcon>
                    <Phone fontSize="small" sx={{ color: '#16a34a' }} />
                  </ListItemIcon>
                  <ListItemText>Call Forwarding</ListItemText>
                </MenuItem>
              )}
              {!agentData.isDeactivated && (
                <MenuItem
                  onClick={async () => {
                    setShowDropdown(null);
                    const result = await Swal.fire({
                      title: 'Are you sure?',
                      html: 'You are about to deactivate this agent.<br><strong>This may lead to the deletion of the assigned phone number, if any.</strong>',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes, deactivate it!'
                    });
                    if (result.isConfirmed) {
                      Swal.fire({
                        title: 'Deactivating...',
                        html: 'Please wait while we deactivate the agent.',
                        allowOutsideClick: false,
                        didOpen: () => {
                          Swal.showLoading();
                        }
                      });
                      try {
                        const response = await axios.post(
                          `${process.env.NEXT_PUBLIC_API_URL}/api/agent/deactivateAgentbyAgentId/${agentData?.agent_id}`
                        );
                        Swal.close();
                        if (response.data.status == true) {
                          Swal.fire('Deactivated!', 'Agent has been deactivated.', 'success');
                          setShowDeactivateModal(false);
                          setRefresh((prev) => !prev);
                        }
                      } catch (error) {
                        console.error(error);
                        Swal.fire('Error', 'Failed to deactivate agent.', 'error');
                      }
                    }
                  }}
                >
                  <ListItemIcon>
                    <PowerSettingsNew fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Deactivate Agent</ListItemText>
                </MenuItem>
              )}
              {agentData.isDeactivated && (
                <MenuItem
                  onClick={() => {
                    setShowCancelConfirm(true);
                    setShowDropdown(null);
                    Swal.fire('Agent Deactivated', 'Please contact support to activate your agent.', 'info');
                  }}
                >
                  <ListItemIcon>
                    <PowerSettingsNew fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Activate Agent</ListItemText>
                </MenuItem>
              )}
            </Menu>
            {showCallModal && (
              <Modal
                open={showCallModal}
                onClose={() => {
                  setShowCallModal(false);
                  onEndCall();
                }}
              >
                <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, width: 400, mx: 'auto', mt: '10%' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Test Call
                  </Typography>
                  <CallTest
                    isCallActive={isCallActive}
                    onStartCall={onStartCall}
                    onEndCall={onEndCall}
                    callLoading={callLoading}
                    setCallLoading={setCallLoading}
                    isliveTranscript={false}
                    agentName={agentData?.agentName || 'Your Agent'}
                    agentAvatar={agentData?.avatar || '/images/rex.png'}
                    businessName="Receptin"
                    isEndingRef={isEndingRef}
                  />
                </Box>
              </Modal>
            )}
            {assignPhoneModal && (
              <AssignNumberModal
                isOpen={showAssignModal}
                onClose={() => {
                  setShowAssignModal(false);
                  setAssignPhoneModal(false);
                }}
                agentId={agentData.agent_id}
                agentDetails={agentData}
                onAssignNumber={() => {
                  setRefresh((prev) => !prev);
                  setShowAssignModal(false);
                  setAssignPhoneModal(false);
                }}
                onAgentDetailsPage={true}
              />
            )}
            {showCallForwardingModal && (
              <Modal
                open={showCallForwardingModal}
                onClose={() => {
                  if (loading) return;
                  setShowCallForwardingModal(false);
                  setPhone('');
                  setPhoneError('');
                }}
              >
                <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, width: 400, mx: 'auto', mt: '10%' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Call Forwarding
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Contact Number
                    </Typography>
                    <PhoneInput
                      country={'in'}
                      value={phone || agentData.callForwardingOptions}
                      onChange={(phone) => {
                        setPhone(phone);
                        setPhoneError('');
                      }}
                      inputClass="!w-full !text-sm !rounded !border !border-gray-300"
                      containerClass="!w-full"
                      inputProps={{
                        name: 'phone',
                        required: true,
                        id: 'contactNumber'
                      }}
                      specialLabel={''}
                      inputComponentRef={phoneInputRef}
                    />
                    {phoneError && (
                      <Typography color="error" sx={{ mt: 1 }}>
                        {phoneError}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {agentData?.callForwarding && (
                      <Button
                        variant="contained"
                        color="error"
                        disabled={cancelLoading || loading}
                        onClick={handleStopCallForwardingSubmit}
                        sx={{ flex: 1 }}
                      >
                        {cancelLoading ? <CircularProgress size={18} /> : 'Stop Forwarding'}
                      </Button>
                    )}
                    <Button variant="contained" color="primary" onClick={handleCallForwardingSubmit} disabled={loading} sx={{ flex: 1 }}>
                      {loading ? <CircularProgress size={18} /> : agentData?.callForwarding ? 'Edit' : 'Save'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setShowCallForwardingModal(false);
                        setPhone('');
                        setPhoneError('');
                      }}
                      disabled={loading}
                      sx={{ flex: 1 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Modal>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4, px: 2 }}>
          <Box sx={{ flexShrink: 0 }}>
            {agentData.avatar ? (
              <img
                src={agentData.avatar}
                alt="Agent Avatar"
                style={{
                  width: 150,
                  height: 150,
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '4px solid #6524EB',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  bgcolor: '#f5f5f5',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666'
                }}
              >
                No Avatar
              </Box>
            )}
          </Box>
          <Box sx={{ flex: 1, color: '#333', '& > p': { mb: 1, fontSize: '1.125rem' } }}>
            <Typography>
              <strong>Name:</strong> {agentData?.agentName}
            </Typography>
            <Typography>
              <strong>Gender:</strong>{' '}
              {agentData?.agentGender
                ? agentData.agentGender.charAt(0).toUpperCase() + agentData.agentGender.slice(1).toLowerCase()
                : 'N/A'}
            </Typography>
            <Typography>
              <strong>Language:</strong>{' '}
              {languages?.find((lang) => lang?.locale == agentData?.agentLanguage)?.name || agentData?.agentLanguage}
            </Typography>
            <Typography>
              <strong>Voice:</strong> {agentData?.agentVoice?.split('-')[1]}
            </Typography>
            <Typography>
              <strong>Minutes Left:</strong> {Math.floor(agentData?.mins_left / 60)}
            </Typography>
            <Typography>
              <strong>Status:</strong>{' '}
              {agentData.isDeactivated ? (
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Deactivated</span>
              ) : (
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Active</span>
              )}
            </Typography>
            {agentData?.voip_numbers && (
              <Typography>
                <strong style={{ color: '#6524EB' }}>Phone Number:</strong> +{agentData?.voip_numbers?.replace(/\D/g, '')}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: 750, mx: 'auto', mt: 1, bgcolor: 'white', boxShadow: 3, borderRadius: 4, p: 4, border: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center', flex: 1 }}>
          {mode === 'create' ? 'Create Your Own Agent' : 'Edit Agent'}
        </Typography>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#666', mb: 1 }}>
          Name
        </Typography>
        <TextField
          fullWidth
          value={form.agentName}
          onChange={(e) => {
            const value = e.target.value;
            const isValid = /^[A-Za-z\s]*$/.test(value);
            if (isValid || value === '') {
              setForm({ ...form, agentName: value });
            }
          }}
          placeholder="Enter agent name"
          inputProps={{ maxLength: 20 }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': { borderColor: '#6524EB' },
              '&.Mui-focused fieldset': { borderColor: '#6524EB' }
            }
          }}
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#666', mb: 1 }}>
          Select Language
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Choose language</InputLabel>
          <Select
            value={form.language}
            onChange={(e) =>
              setForm({
                ...form,
                language: e.target.value,
                agentLanguage: languages?.find((lang) => lang?.locale == e.target.value)?.name || e.target.value
              })
            }
            sx={{ borderRadius: 2 }}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.locale} value={lang.locale}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img
                    src={`https://flagcdn.com/w20/${lang?.locale?.split('-')[1]?.toLowerCase() || 'us'}.png`}
                    alt="flag"
                    style={{ width: 20, height: 15 }}
                  />
                  {lang.name}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#666', mb: 1 }}>
          Gender
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Choose gender</InputLabel>
          <Select
            value={form.gender}
            onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value, avatar: '', voice: '', selectedVoice: null }))}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#666', mb: 1 }}>
          Voice
        </Typography>
        {filteredVoices.length === 0 ? (
          <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>Select gender first.</Typography>
        ) : (
          <FormControl fullWidth>
            <InputLabel>Choose voice</InputLabel>
            <Select
              value={form.voice}
              onChange={(e) => {
                const selectedVoice = filteredVoices.find((voice) => voice.voice_id === e.target.value);
                setForm({ ...form, voice: e.target.value, selectedVoice });
              }}
              sx={{ borderRadius: 2 }}
            >
              {filteredVoices.map((voice, index) => (
                <MenuItem key={index} value={voice.voice_id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 'medium' }}>{voice?.voice_name?.replace(/\s*\(.*?\)/, '')}</Typography>
                      <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>{voice?.accent || voice?.provider}</Typography>
                    </Box>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(index);
                      }}
                      sx={{ zIndex: 99999, width: 45, height: 45 }}
                    >
                      {playingIdx === index ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
                    </IconButton>
                    <audio ref={(el) => (audioRefs.current[index] = el)} style={{ display: 'none' }}>
                      <source src={voice.preview_audio_url} type="audio/mpeg" />
                    </audio>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#666', mb: 1 }}>
          Avatar
        </Typography>
        {form.gender ? (
          <FormControl fullWidth>
            <InputLabel>Choose avatar</InputLabel>
            <Select value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} sx={{ borderRadius: 2 }}>
              {avatars[form.gender]?.map((av, index) => (
                <MenuItem key={index} value={av.img}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img src={av.img} alt={`Avatar ${index + 1}`} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                    Avatar {index + 1}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>Select gender to choose avatar</Typography>
        )}
      </Box>
      <Button
        fullWidth
        variant="contained"
        sx={{ bgcolor: '#6524EB', '&:hover': { bgcolor: '#7c3aed' }, borderRadius: 2 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (mode === 'create' ? 'Creating...' : 'Updating...') : mode === 'create' ? 'Create' : 'Update'}
      </Button>
      {mode === 'edit' && (
        <Button
          fullWidth
          variant="outlined"
          sx={{
            mt: 2,
            borderColor: '#6524EB',
            color: '#6524EB',
            '&:hover': { borderColor: '#7c3aed', bgcolor: '#f5f5f5' },
            borderRadius: 2
          }}
          onClick={() => {
            setMode('create');
            setForm({ language: '', agentName: '', gender: '', voice: '', selectedVoice: null, avatar: '', agentLanguage: '' });
          }}
        >
          Cancel
        </Button>
      )}
    </Box>
  );
}
