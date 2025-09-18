// "use client";

// import { useState } from "react";
// import {
//   Grid,
//   TextField,
//   InputLabel,
//   MenuItem,
//   Select,
//   FormHelperText,
//   Button,
//   Stack,
//   Typography,
//   Chip,
// } from "@mui/material";
// import { Paper, Divider } from "@mui/material";
// import MainCard from "components/MainCard";
// import { GRID_COMMON_SPACING } from "config";

// // ---------------- Business Data ----------------
// const allBusinessTypes = [
//   {
//     type: "Electronics & Home Appliances",
//     subtype: "Consumer Electronics Retailer",
//     icon: "svg/Electronics-icon.svg",
//   },
//   {
//     type: "Banking",
//     subtype: "Financial Institution",
//     icon: "svg/Banking-icon.svg",
//   },
//   {
//     type: "D2C E-commerce",
//     subtype: "Direct to Consumer Online Brand",
//     icon: "svg/Ecommerce-icon.svg",
//   },
//   {
//     type: "B2B/B2C Marketplace",
//     subtype: "Online Wholesale/Retail Platform",
//     icon: "svg/Marketplace-icon.svg",
//   },
//   {
//     type: "Insurance",
//     subtype: "Risk & Coverage Services",
//     icon: "svg/Insurance-icon.svg",
//   },
//   {
//     type: "Restaurant",
//     subtype: "Food Service Establishment",
//     icon: "svg/Restaurant-icon.svg",
//   },
//   {
//     type: "Real Estate Broker",
//     subtype: "Property Transaction Facilitator",
//     icon: "svg/Estate-icon.svg",
//   },
// ];

// const businessServices = [
//   {
//     type: "Electronics & Home Appliances",
//     services: [
//       "Mobile Phones",
//       "Air Conditioners",
//       "Refrigerators",
//       "Washing Machines",
//       "Smart TVs",
//       "Laptops",
//       "Other",
//     ],
//   },
//   {
//     type: "Banking",
//     services: [
//       "Savings Account",
//       "Credit Cards",
//       "Loans",
//       "Fixed Deposits",
//       "Net Banking/UPI",
//       "Wealth Management",
//       "Other",
//     ],
//   },
//   {
//     type: "D2C E-commerce",
//     services: [
//       "Fashion & Apparel",
//       "Footwear",
//       "Skincare & Beauty",
//       "Electronics Accessories",
//       "Home & Kitchen Essentials",
//       "Nutritional Supplements",
//       "Other",
//     ],
//   },
//   {
//     type: "B2B/B2C Marketplace",
//     services: [
//       "Wholesale Electronics",
//       "Industrial Equipment",
//       "Office Supplies",
//       "Furniture",
//       "FMCG Products",
//       "Agricultural Goods",
//       "Other",
//     ],
//   },
//   {
//     type: "Insurance",
//     services: [
//       "Health Insurance",
//       "Life Insurance",
//       "Vehicle Insurance",
//       "Travel Insurance",
//       "Property Insurance",
//       "Business Insurance",
//       "Other",
//     ],
//   },
//   {
//     type: "Restaurant",
//     services: [
//       "Dine-in Service",
//       "Takeaway Orders",
//       "Home Delivery",
//       "Event Catering",
//       "Online Ordering",
//       "Other",
//     ],
//   },
//   {
//     type: "Real Estate Broker",
//     services: [
//       "Property Sales",
//       "Property Rentals",
//       "Property Viewings",
//       "Price Valuation",
//       "Legal Help",
//       "Other",
//     ],
//   },
// ];

// // ---------------- Helper Function ----------------
// function getServicesByType(type) {
//   const found = businessServices.find((b) => b.type === type);
//   return found ? found.services : [];
// }

// // ---------------- Main Component ----------------
// export default function AgentGeneralInfo({ onNext }) {
//   const [formData, setFormData] = useState({
//     agentName: "",
//     corePurpose: "",
//     industry: "",
//     service: [], // Changed to an array to store multiple services
//     customService: "",
//     businessName: "",
//     agentType: "",
//     agentLanguage: "",
//   });

//   const [errors, setErrors] = useState({});

//   const purposes = [
//     "Customer Support",
//     "Lead Qualifier",
//     "Survey Agent",
//     "Technical Support",
//     "General Receptionist",
//   ];

//   const agentTypes = ["Inbound", "Outbound", "Both"];
//   const languages = ["Hindi", "English"];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleServiceChange = (e) => {
//     const { value } = e.target;
//     setFormData({
//       ...formData,
//       service: value,
//       customService: value.includes("Other") ? formData.customService : "", // Reset customService if "Other" is not selected
//     });
//   };

//   const validate = () => {
//     let newErrors = {};
//     if (!formData.agentName) newErrors.agentName = "Agent Name is required";
//     if (!formData.corePurpose) newErrors.corePurpose = "Core Purpose is required";
//     if (!formData.industry) newErrors.industry = "Industry is required";
//     if (formData.service.length === 0)
//       newErrors.service = "At least one Business Service/Product is required";
//     if (!formData.agentType) newErrors.agentType = "Agent Type is required";
//     if (!formData.agentLanguage) newErrors.agentLanguage = "Agent Language is required";

//     if (formData.service.includes("Other") && !formData.customService) {
//       newErrors.customService = "Please specify your service";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (validate()) {
//       const finalData = {
//         ...formData,
//         service: formData.service.map((s) =>
//           s === "Other" ? formData.customService : s
//         ), // Replace "Other" with customService in the service array
//       };
//       onNext(finalData);
//     }
//   };

//   const selectedIndustryData = allBusinessTypes.find(
//     (i) => i.type === formData.industry
//   );

//   return (
//     <Grid container justifyContent="center" sx={{ mt: 3, mb: 5 }} style={{ width: "100%" }}>
//       <Grid item xs={12} md={8}>
//         <Paper
//           elevation={3}
//           sx={{
//             p: 4,
//             borderRadius: 3,
//             background: "#fafafa",
//           }}
//         >
//           <Typography variant="h5" fontWeight="bold" gutterBottom>
//             Step 1: Agent General Info
//           </Typography>
//           <Divider sx={{ mb: 3 }} />

//           <Stack spacing={3}>
//             {/* Agent Name */}
//             <Stack spacing={1}>
//               <InputLabel>Agent Name</InputLabel>
//               <TextField
//                 name="agentName"
//                 placeholder="E.g., Samsung Customer Service Bot"
//                 value={formData.agentName}
//                 onChange={handleChange}
//                 error={!!errors.agentName}
//                 helperText={errors.agentName}
//               />
//             </Stack>

//             {/* Core Purpose */}
//             <Stack spacing={1}>
//               <InputLabel>Core Purpose</InputLabel>
//               <Select
//                 name="corePurpose"
//                 value={formData.corePurpose}
//                 onChange={handleChange}
//                 error={!!errors.corePurpose}
//               >
//                 {purposes.map((p) => (
//                   <MenuItem key={p} value={p}>
//                     {p}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText error>{errors.corePurpose}</FormHelperText>
//             </Stack>

//             {/* Industry */}
//             <Stack spacing={1}>
//               <InputLabel>Industry</InputLabel>
//               <Select
//                 name="industry"
//                 value={formData.industry}
//                 onChange={(e) => {
//                   handleChange(e);
//                   setFormData({
//                     ...formData,
//                     industry: e.target.value,
//                     service: [], // Reset services when industry changes
//                     customService: "",
//                   });
//                 }}
//                 error={!!errors.industry}
//               >
//                 {allBusinessTypes.map((ind) => (
//                   <MenuItem key={ind.type} value={ind.type}>
//                     {ind.type}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText error>{errors.industry}</FormHelperText>

//               {/* Show icon + subtype */}
//               {selectedIndustryData && (
//                 <Stack
//                   direction="row"
//                   spacing={1}
//                   alignItems="center"
//                   mt={1}
//                   sx={{
//                     p: 1,
//                     borderRadius: 2,
//                     bgcolor: "#f1f5f9",
//                   }}
//                 >
//                   <img
//                     src={selectedIndustryData.icon}
//                     alt=""
//                     width={28}
//                     height={28}
//                   />
//                   <Typography variant="body2" color="text.secondary">
//                     {selectedIndustryData.subtype}
//                   </Typography>
//                 </Stack>
//               )}
//             </Stack>

//             {/* Business Service/Product */}
//             <Stack spacing={1}>
//               <InputLabel>Business Services/Products</InputLabel>
//               <Select
//                 multiple
//                 name="service"
//                 value={formData.service}
//                 onChange={handleServiceChange}
//                 error={!!errors.service}
//                 disabled={!formData.industry}
//                 renderValue={(selected) => (
//                   <Stack direction="row" spacing={1} flexWrap="wrap">
//                     {selected.map((value) => (
//                       <Chip key={value} label={value} />
//                     ))}
//                   </Stack>
//                 )}
//               >
//                 {getServicesByType(formData.industry).map((s) => (
//                   <MenuItem key={s} value={s}>
//                     {s}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText error>{errors.service}</FormHelperText>

//               {/* Custom service if "Other" is selected */}
//               {formData.service.includes("Other") && (
//                 <TextField
//                   fullWidth
//                   name="customService"
//                   placeholder="Enter your custom service"
//                   value={formData.customService}
//                   onChange={handleChange}
//                   error={!!errors.customService}
//                   helperText={errors.customService}
//                   sx={{ mt: 1 }}
//                 />
//               )}
//             </Stack>

//             {/* Business Name (Optional) */}
//             <Stack spacing={1}>
//               <InputLabel>Business Name (Optional)</InputLabel>
//               <TextField
//                 name="businessName"
//                 placeholder="E.g., Samsung, Amazon"
//                 value={formData.businessName}
//                 onChange={handleChange}
//               />
//             </Stack>

//             {/* Agent Type */}
//             <Stack spacing={1}>
//               <InputLabel>Agent Type</InputLabel>
//               <Select
//                 name="agentType"
//                 value={formData.agentType}
//                 onChange={handleChange}
//                 error={!!errors.agentType}
//               >
//                 {agentTypes.map((t) => (
//                   <MenuItem key={t} value={t}>
//                     {t}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText error>{errors.agentType}</FormHelperText>
//             </Stack>

//             {/* Agent Language */}
//             <Stack spacing={1}>
//               <InputLabel>Agent Language</InputLabel>
//               <Select
//                 name="agentLanguage"
//                 value={formData.agentLanguage}
//                 onChange={handleChange}
//                 error={!!errors.agentLanguage}
//               >
//                 {languages.map((lang) => (
//                   <MenuItem key={lang} value={lang}>
//                     {lang}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText error>{errors.agentLanguage}</FormHelperText>
//             </Stack>

//             {/* Next Button */}
//             <Stack direction="row" justifyContent="flex-end" mt={2}>
//               <Button
//                 variant="contained"
//                 onClick={handleNext}
//                 sx={{
//                   px: 4,
//                   py: 1,
//                   borderRadius: 2,
//                   textTransform: "none",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Proceed to Agent Details →
//               </Button>
//             </Stack>
//           </Stack>
//         </Paper>
//       </Grid>
//     </Grid>
//   );
// }



"use client";

import { useState, useEffect, useRef } from "react";
import avatars from "lib/avatars";
import {
  Grid,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Button,
  Stack,
  Typography,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Box,
  Alert,

  IconButton,
} from "@mui/material";
import { Paper, Divider } from "@mui/material";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import PauseIcon from "@mui/icons-material/Pause";
import MainCard from "components/MainCard";
import { GRID_COMMON_SPACING } from "config";
import axios from "axios";
import decodeToke from "../../lib/decodeToken"
// ---------------- Business Data ----------------
const allBusinessTypes = [
  {
    type: "Electronics & Home Appliances",
    subtype: "Consumer Electronics Retailer",
    icon: "svg/Electronics-icon.svg",
  },
  {
    type: "Banking",
    subtype: "Financial Institution",
    icon: "svg/Banking-icon.svg",
  },
  {
    type: "D2C E-commerce",
    subtype: "Direct to Consumer Online Brand",
    icon: "svg/Ecommerce-icon.svg",
  },
  {
    type: "B2B/B2C Marketplace",
    subtype: "Online Wholesale/Retail Platform",
    icon: "svg/Marketplace-icon.svg",
  },
  {
    type: "Insurance",
    subtype: "Risk & Coverage Services",
    icon: "svg/Insurance-icon.svg",
  },


];

const businessServices = [
  {
    type: "Electronics & Home Appliances",
    services: [
      "Mobile Phones",
      "Air Conditioners",
      "Refrigerators",
      "Washing Machines",
      "Smart TVs",
      "Laptops",
      "Other",
    ],
  },
  {
    type: "Banking",
    services: [
      "Savings Account",
      "Credit Cards",
      "Loans",
      "Fixed Deposits",
      "Net Banking/UPI",
      "Wealth Management",
      "Other",
    ],
  },
  {
    type: "D2C E-commerce",
    services: [
      "Fashion & Apparel",
      "Footwear",
      "Skincare & Beauty",
      "Electronics Accessories",
      "Home & Kitchen Essentials",
      "Nutritional Supplements",
      "Other",
    ],
  },
  {
    type: "B2B/B2C Marketplace",
    services: [
      "Wholesale Electronics",
      "Industrial Equipment",
      "Office Supplies",
      "Furniture",
      "FMCG Products",
      "Agricultural Goods",
      "Other",
    ],
  },
  {
    type: "Insurance",
    services: [
      "Health Insurance",
      "Life Insurance",
      "Vehicle Insurance",
      "Travel Insurance",
      "Property Insurance",
      "Business Insurance",
      "Other",
    ],
  },

];

// ---------------- Languages Data ----------------
const languages = [
  /* English family */
  {
    name: "English (US)",
    locale: "en-US",
    flag: "/images/en-US.png",
    percentage: "4.76%",
    stats: "390 million native speakers",
  },
  {
    name: "English (India)",
    locale: "en-IN",
    flag: "/images/en-IN.png",
    percentage: "4.76%",
    stats: "390 million native speakers",
  },
  {
    name: "English (UK)",
    locale: "en-GB",
    flag: "/images/en-GB.png",
    percentage: "4.76%",
    stats: "390 million native speakers",
  },
  {
    name: "English (Australia)",
    locale: "en-AU",
    flag: "/images/en-AU.png",
    percentage: "4.76%",
    stats: "390 million native speakers",
  },
  {
    name: "English (New Zealand)",
    locale: "en-NZ",
    flag: "/images/en-NZ.png",
    percentage: "4.76%",
    stats: "390 million native speakers",
  },
  /* Germanic & Nordic */
  {
    name: "German",
    locale: "de-DE",
    flag: "/images/de-DE.png",
    percentage: "0.93%",
    stats: "76 million native speakers",
  },
  {
    name: "Dutch",
    locale: "nl-NL",
    flag: "/images/nl-NL.png",
    percentage: "0.30%",
    stats: "25 million native speakers",
  },
  {
    name: "Danish",
    locale: "da-DK",
    flag: "/images/da-DK.png",
    percentage: "0.07%",
    stats: "5.5 million native speakers",
  },
  {
    name: "Finnish",
    locale: "fi-FI",
    flag: "/images/fi-FI.png",
    percentage: "0.07%",
    stats: "5.4 million native speakers",
  },
  {
    name: "Norwegian",
    locale: "no-NO",
    flag: "/images/no-NO.png",
    percentage: "0.06%",
    stats: "5.2 million native speakers",
  },
  {
    name: "Swedish",
    locale: "sv-SE",
    flag: "/images/sv-SE.png",
    percentage: "0.11%",
    stats: "9.2 million native speakers",
  },
  /* Romance */
  {
    name: "Spanish (Spain)",
    locale: "es-ES",
    flag: "/images/es-ES.png",
    percentage: "5.90%",
    stats: "484 million native speakers",
  },
  // {
  //   name: "Spanish (LatAm)",
  //   locale: "es-419",
  //   flag: "/images/es-ES.png",
  //   percentage: "5.90%",
  //   stats: "484 million native speakers",
  // },
  {
    name: "French (France)",
    locale: "fr-FR",
    flag: "/images/fr-FR.png",
    percentage: "0.90%",
    stats: "74 million native speakers",
  },
  {
    name: "French (Canada)",
    locale: "fr-CA",
    flag: "/images/fr-CA.png",
    percentage: "0.90%",
    stats: "74 million native speakers",
  },
  {
    name: "Italian",
    locale: "it-IT",
    flag: "/images/it-IT.png",
    percentage: "0.77%",
    stats: "63 million native speakers",
  },
  {
    name: "Portuguese (Portugal)",
    locale: "pt-PT",
    flag: "/images/pt-PT.png",
    percentage: "3.05%",
    stats: "250 million native speakers",
  },
  {
    name: "Portuguese (Brazil)",
    locale: "pt-BR",
    flag: "/images/pt-BR.png",
    percentage: "3.05%",
    stats: "250 million native speakers",
  },
  {
    name: "Catalan",
    locale: "ca-ES",
    flag: "/images/ca-ES.png",
    percentage: "0.05%",
    stats: "4.1 million native speakers",
  },
  {
    name: "Romanian",
    locale: "ro-RO",
    flag: "/images/ro-RO.png",
    percentage: "0.29%",
    stats: "24 million native speakers",
  },
  /* Slavic & Baltic */
  {
    name: "Polish",
    locale: "pl-PL",
    flag: "/images/pl-PL.png",
    percentage: "0.49%",
    stats: "40 million native speakers",
  },
  {
    name: "Russian",
    locale: "ru-RU",
    flag: "/images/ru-RU.png",
    percentage: "1.77%",
    stats: "145 million native speakers",
  },
  {
    name: "Bulgarian",
    locale: "bg-BG",
    flag: "/images/bg-BG.png",
    percentage: "0.09%",
    stats: "7 million native speakers",
  },
  {
    name: "Slovak",
    locale: "sk-SK",
    flag: "/images/sk-SK.png",
    percentage: "0.06%",
    stats: "5.2 million native speakers",
  },
  /* Hellenic & Uralic */
  {
    name: "Greek",
    locale: "el-GR",
    flag: "/images/el-GR.png",
    percentage: "0.16%",
    stats: "13 million native speakers",
  },
  {
    name: "Hungarian",
    locale: "hu-HU",
    flag: "/images/hu-HU.png",
    percentage: "0.16%",
    stats: "13 million native speakers",
  },
  /* Asian */
  {
    name: "Hindi",
    locale: "hi-IN",
    flag: "/images/hi-IN.png",
    percentage: "4.21%",
    stats: "345 million native speakers",
  },
  {
    name: "Japanese",
    locale: "ja-JP",
    flag: "/images/ja-JP.png",
    percentage: "1.51%",
    stats: "124 million native speakers",
  },
  {
    name: "Korean",
    locale: "ko-KR",
    flag: "/images/ko-KR.png",
    percentage: "0.99%",
    stats: "81 million native speakers",
  },
  {
    name: "Chinese (Mandarin)",
    locale: "zh-CN",
    flag: "/images/zh-CN.png",
    percentage: "12.07%",
    stats: "990 million native speakers",
  },
  {
    name: "Vietnamese",
    locale: "vi-VN",
    flag: "/images/vi-VN.png",
    percentage: "1.05%",
    stats: "86 million native speakers",
  },
  {
    name: "Indonesian",
    locale: "id-ID",
    flag: "/images/id-ID.png",
    percentage: "0.94%",
    stats: "77 million native speakers",
  },
  /* Turkic */
  {
    name: "Turkish",
    locale: "tr-TR",
    flag: "/images/tr-TR.png",
    percentage: "1.04%",
    stats: "85 million native speakers",
  },
  /* Universal / Mixed set */
  {
    name: "Multilingual",
    locale: "multi",
    flag: "/images/multi.png",
    percentage: "—",
    stats: "—",
  },
];

// ---------------- Helper Function ----------------
function getServicesByType(type) {
  const found = businessServices.find((b) => b.type === type);
  return found ? found.services : [];
}

// ---------------- Main Component ----------------
export default function AgentGeneralInfo() {
  const [formData, setFormData] = useState({
    agentName: "",
    corePurpose: "",
    industry: "",
    service: [],
    customService: "",
    businessName: "",
    agentType: "",
    agentGender: "",
    agentAvatar: "",
    agentLanguage: "",
    agentLanguageCode: "",
    agentVoice: "",
    customServices: [''],
    agentAccent: ""
  });


  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [apiStatus, setApiStatus] = useState({ status: null, message: null });
  const [voices, setVoices] = useState([]);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [audio, setAudio] = useState(null); // Track current audio instance
  const audioRef = useRef(null);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const token = localStorage.getItem("authToken")
  const userDetails = decodeToke(token)

  const purposes = [
    "Customer Support",
    "Lead Qualifier",
    "Survey Agent",
    "Technical Support",
    "General Receptionist",
  ];
  const agentTypes = ["Inbound", "Outbound", "Both"];
  const genders = ["Male", "Female"];
  const steps = ["Agent Details", "Business Details", "Agent Configuration"];

  const CustomPlayIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      style={{ fill: 'currentColor' }} // Match Material-UI icon color
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M8 5v14l11-7z" />
    </svg>
  );
  useEffect(() => {
    if (voices && formData.agentGender) {
      const filtered = voices.filter(
        (voice) =>
          voice.provider === "elevenlabs" &&
          voice?.gender?.toLocaleLowerCase() === formData?.agentGender?.toLocaleLowerCase()
      );

      setFilteredVoices(filtered || [])
    }
  }, [formData.agentGender, voices]);

  // Fetch voices when gender or language changes
  useEffect(() => {
    if (formData.agentGender && formData.agentLanguage) {
      const fetchVoices = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/fetchAgentVoiceDetailsFromRetell2`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          setVoices(response?.data || []);
          setApiStatus({ status: 'success', message: '' });

        } catch (error) {
          setVoices([]);
          setApiStatus({ status: 'error', message: 'Failed to fetch voices' });
        }
      };
      fetchVoices();
    } else {
      setVoices([]);
      setApiStatus({ status: null, message: '' });
    }
  }, [formData.agentGender, formData.agentLanguage]);

  const handlePlayVoice = (voiceId, audioUrl) => {
    if (playingVoiceId === voiceId) {
      // Pause if the same voice is playing
      audio?.pause();
      setPlayingVoiceId(null);
      setAudio(null);
    } else {
      // Stop any currently playing audio
      if (audio) {
        audio.pause();
        setAudio(null);
      }
      // Play new audio
      const newAudio = new Audio(audioUrl);
      newAudio.play().catch((err) => {
        console.error('Audio playback error:', err);
        setApiStatus({ status: 'error', message: 'Failed to play audio preview' });
      });
      setAudio(newAudio);
      setPlayingVoiceId(voiceId);
    }
  };
  // const handlePlayVoice = (voiceId, previewAudioUrl) => {
  //   if (audioRef.current) {
  //     audioRef.current.pause();
  //   }

  //   if (playingVoiceId === voiceId) {
  //     setPlayingVoiceId(null);
  //   } else {
  //     audioRef.current = new Audio(previewAudioUrl);
  //     audioRef.current.play().catch((error) => {
  //       console.error("Error playing audio:", error);
  //       setApiStatus({ status: "error", message: "Failed to play voice preview" });
  //     });
  //     setPlayingVoiceId(voiceId);
  //     audioRef.current.onended = () => setPlayingVoiceId(null);
  //   }
  // };

  // Clean up audio on component unmount
  const handleCustomServiceChange = (event, index) => {
    const newCustomServices = [...formData.customServices];
    newCustomServices[index] = event.target.value;
    setFormData({ ...formData, customServices: newCustomServices });

    // Update errors
    const newErrors = [...errors.customServices];
    newErrors[index] = validateCustomService(event.target.value);
    setErrors({ ...errors, customServices: newErrors });
  };

  const handleAddCustomService = () => {
    setFormData({
      ...formData,
      customServices: [...formData.customServices, '']
    });
    setErrors({
      ...errors,
      customServices: Array.isArray(errors.customServices)
        ? [...errors.customServices, '']
        : ['']
    });
  };

  const handleRemoveCustomService = (index) => {
    const newCustomServices = formData.customServices.filter((_, i) => i !== index);
    const newErrors = Array.isArray(errors.customServices)
      ? errors.customServices.filter((_, i) => i !== index)
      : new Array(formData.customServices.length - 1).fill('');
    setFormData({ ...formData, customServices: newCustomServices });
    setErrors({ ...errors, dashboards: newErrors });
  };

  // Example validation function (adjust as needed)
  const validatedashboard = (value) => {
    if (!value.trim()) {
      return 'Custom service is required';
    }
    return '';
  };
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === "agentVoice") {
      // Find the selected voice object
      const selectedVoice = voices.find((v) => v.voice_id === value);
      // Update formData with voice details including accent
      setFormData({
        ...formData,

        agentVoice: selectedVoice?.voice_id || "", // readable name
        agentAccent: selectedVoice?.accent || "",    // store accent
      });
      return;
    }

    if (name === "agentLanguage") {
      const selectedLang = languages.find((lang) => lang.locale === value);

      setFormData({
        ...formData,
        agentLanguage: selectedLang?.name || "",
        agentLanguageCode: selectedLang?.locale || "",
        agentVoice: "", // reset voice if language changes
        agentAccent: "", // reset accent
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
        ...(name === "agentGender" ? { agentAvatar: "", agentVoice: "", agentAccent: "" } : {}),
      });
    }
  };

  const handleServiceChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      service: value,
      // Clear custom services if "Other" is deselected
      customServices: value.includes('Other') ? formData.customServices : ['']
    });

    // Update errors
    setErrors({
      ...errors,
      service: value.length === 0 ? 'At least one service is required' : '',
      customServices: value.includes('Other') ? formData.customServices.map(validateCustomService) : []
    });
  };

  const handleAvatarSelect = (avatarImg) => {
    setFormData({
      ...formData,
      agentAvatar: avatarImg,
    });
  };

  const validateStep = (step) => {
    let newErrors = {};
    if (step === 0) {
      if (!formData.agentName) newErrors.agentName = "Agent Name is required";
      if (!formData.corePurpose) newErrors.corePurpose = "Core Purpose is required";
      if (!formData.agentGender) newErrors.agentGender = "Agent Gender is required";
      if (!formData.agentAvatar) newErrors.agentAvatar = "Please select an avatar";
    } else if (step === 1) {
      if (!formData.industry) newErrors.industry = "Industry is required";
      if (formData.service.length === 0)
        newErrors.service = "At least one Business Service/Product is required";
      if (formData.service.includes("Other") && !formData.customServices) {
        newErrors.customServices = "Please specify your service";
      }
    } else if (step === 2) {
      if (!formData.agentType) newErrors.agentType = "Agent Type is required";
      if (!formData.agentLanguage) newErrors.agentLanguage = "Agent Language is required";
      if (!formData.agentVoice) newErrors.agentVoice = "Agent Voice is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
//AGENT CREATION PROCESS
  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      const finalData = {
        ...formData,
        userId: userDetails?.user?.id,
        agentAccent: "",
        service: formData.service.map((s) =>
          s === "Other" ? formData.customService : s
        ),
        agentAccent: formData.agentAccent
      };

      try {
        setApiStatus({ status: null, message: null });
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/enterpriseAgent/createEnterpriseAgent`, finalData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );


        console.log(response, "response")
        if (response) {
          alert(response?.data?.message)
        }
        // setApiStatus({ status: "success", message: "Data submitted successfully!" });
        // onNext(finalData);
      } catch (error) {
        setApiStatus({
          status: "error",
          message: error.message || "An error occurred during submission",
        });
      }
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prev) => prev + 1);
        setErrors({});
      }
    }
  };
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setErrors({});
    setApiStatus({ status: null, message: null });
  };

  const selectedIndustryData = allBusinessTypes.find(
    (i) => i.type === formData.industry
  );
  const handleSelectAccent = (voice) => {


  }
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            {/* Agent Name */}
            <Stack spacing={1}>
              <InputLabel>Agent Name</InputLabel>
              <TextField
                name="agentName"
                placeholder="E.g., Samsung Customer Service Bot"
                value={formData.agentName}
                onChange={handleChange}
                error={!!errors.agentName}
                helperText={errors.agentName}
                fullWidth
              />
            </Stack>

            {/* Core Purpose */}
            <Stack spacing={1}>
              <InputLabel>Core Purpose</InputLabel>
              <Select
                name="corePurpose"
                value={formData.corePurpose}
                onChange={handleChange}
                error={!!errors.corePurpose}
                fullWidth
              >
                {purposes.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{errors.corePurpose}</FormHelperText>
            </Stack>

            {/* Agent Gender */}
            <Stack spacing={1}>
              <InputLabel>Agent Gender</InputLabel>
              <Select
                name="agentGender"
                value={formData.agentGender}
                onChange={handleChange}
                error={!!errors.agentGender}
                fullWidth
              >
                {genders.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{errors.agentGender}</FormHelperText>
            </Stack>

            {/* Avatar Selection */}
            {formData.agentGender && (
              <Stack spacing={1}>
                <InputLabel>Select Avatar</InputLabel>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {avatars[formData.agentGender].map((avatar, index) => (
                    <Box
                      key={avatar.img} // Use avatar.img as unique key
                      onClick={() => handleAvatarSelect(avatar.img)}
                      sx={{
                        cursor: "pointer",
                        border:
                          formData.agentAvatar === avatar.img
                            ? "2px solid #1976d2"
                            : "2px solid transparent",
                        borderRadius: 2,
                        p: 0.5,
                        transition: "border 0.2s ease-in-out",
                      }}
                    >
                      <img
                        src={avatar.img}
                        alt={`Avatar ${index + 1}`}
                        width={60}
                        height={60}
                        style={{ borderRadius: 8, objectFit: "cover" }}
                      />
                    </Box>
                  ))}
                </Stack>
                <FormHelperText error>{errors.agentAvatar}</FormHelperText>
              </Stack>
            )}
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={3}>
            {/* Industry */}
            <Stack spacing={1}>
              <InputLabel>Industry</InputLabel>
              <Select
                name="industry"
                value={formData.industry}
                onChange={(e) => {
                  handleChange(e);
                  setFormData({
                    ...formData,
                    industry: e.target.value,
                    service: [],
                    customServices: "",
                  });
                }}
                error={!!errors.industry}
                fullWidth
              >
                {allBusinessTypes.map((ind) => (
                  <MenuItem key={ind.type} value={ind.type}>
                    {ind.type}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{errors.industry}</FormHelperText>

              {/* Show icon + subtype */}
              {selectedIndustryData && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  mt={1}
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: "#f1f5f9",
                  }}
                >
                  {/* <img
                    src={selectedIndustryData.icon}
                    alt=""
                    width={28}
                    height={28}
                  /> */}
                  <Typography variant="body2" color="text.secondary">
                    {selectedIndustryData.subtype}
                  </Typography>
                </Stack>
              )}
            </Stack>

            {/* Business Service/Product */}
            <Stack spacing={1}>
              <InputLabel>Business Services/Products</InputLabel>
              <Select
                multiple
                name="service"
                value={formData.service}
                onChange={handleServiceChange}
                error={!!errors.service}
                disabled={!formData.industry}
                renderValue={(selected) => (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Stack>
                )}
                fullWidth
              >
                {getServicesByType(formData.industry).map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{errors.service}</FormHelperText>

              {/* Custom services when "Other" is selected */}
              {formData.service.includes("Other") && (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {formData.customServices.map((customService, index) => (
                    <Stack key={index} direction="row" spacing={1} alignItems="center">
                      <TextField
                        fullWidth
                        name={`customService_${index}`}
                        placeholder="Enter your custom service"
                        value={customService}
                        onChange={(e) => handleCustomServiceChange(e, index)}
                        error={!!errors.customServices?.[index]}
                        helperText={errors.customServices?.[index]}
                      />
                      {index > 0 && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemoveCustomService(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>
                  ))}
                  <Button
                    variant="contained"
                    onClick={handleAddCustomService}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add Another Service
                  </Button>
                </Stack>
              )}
            </Stack>
            {/* Business Name (Optional) */}
            <Stack spacing={1}>
              <InputLabel>Business Name</InputLabel>
              <TextField
                name="businessName"
                placeholder="E.g., Samsung, Amazon"
                value={formData.businessName}
                onChange={handleChange}
                fullWidth
              />
            </Stack>
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={3}>
            {/* Agent Type */}
            <Stack spacing={1}>
              <InputLabel>Agent Type</InputLabel>
              <Select
                name="agentType"
                value={formData.agentType}
                onChange={handleChange}
                error={!!errors.agentType}
                fullWidth
              >
                {agentTypes.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{errors.agentType}</FormHelperText>
            </Stack>

            {/* Agent Language */}
            <Select
              name="agentLanguage"
              value={formData.agentLanguageCode || ""}
              onChange={handleChange}
              error={!!errors.agentLanguage}
              fullWidth
            >
              {
                languages.map((lang) => (
                  <MenuItem key={lang.locale} value={lang.locale}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <img src={`https://flagcdn.com/w20/${lang.locale.split("-")[1]?.toLowerCase() || "us"}.png`}
                        alt="flag" className="w-5 h-5" onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (lang.locale == "es-419") { target.src = "https://flagcdn.com/w80/es.png"; }
                        }} />
                      <Typography>{lang.name}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
            </Select>


            {/* Agent Voice */}
            <Stack spacing={1}>
              <InputLabel>Agent Voice</InputLabel>
              <Select
                name="agentVoice"
                value={formData.agentVoice || ''}
                onChange={handleChange}
                error={!!errors.agentVoice}
                disabled={!formData.agentGender || !formData.agentLanguage || voices.length === 0}
                fullWidth
              >
                {filteredVoices?.map((voice) => (
                  <MenuItem key={voice.voice_id} value={voice.voice_id}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ width: '100%' }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography >{voice.voice_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({voice.accent}, {voice.age})
                        </Typography>
                      </Stack>
                      {voice.preview_audio_url && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent selecting the MenuItem
                            handlePlayVoice(voice.voice_id, voice.preview_audio_url);

                          }}
                        >
                          {playingVoiceId === voice.voice_id ? (
                            <CustomPlayIcon fontSize="small" />
                          ) : (
                            <CustomPlayIcon />
                          )}
                        </IconButton>
                      )}
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{errors.agentVoice || apiStatus.message}</FormHelperText>
            </Stack>
          </Stack>

        );
      default:
        return null;
    }
  };

  return (
    <Grid justifyContent="center" sx={{ mt: 3, mb: 5 }} style={{ width: "75%" }}>
      <Grid item xs={12} sm={12} md={12} lg={10} >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            background: "#fafafa",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Agent General Info
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* API Status Feedback */}
          {apiStatus.status && (
            <Alert severity={apiStatus.status} sx={{ mb: 3 }}>
              {apiStatus.message}
            </Alert>
          )}

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Box sx={{ minHeight: { xs: 300, sm: 350, md: 400 } }}>
            {getStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 3 }}
          >
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ textTransform: "none" }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              // disabled={}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}