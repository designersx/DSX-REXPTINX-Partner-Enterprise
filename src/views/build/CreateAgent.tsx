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
  Stepper,
  Step,
  StepLabel,
  Box,
  Alert,

  IconButton,
  Checkbox,
  ListItemText,
  CircularProgress,
  AlertColor,
  Tooltip
} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Paper, Divider, Chip } from "@mui/material";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import PauseIcon from "@mui/icons-material/Pause";
import MainCard from "components/MainCard";
import { GRID_COMMON_SPACING } from "config";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import decodeToke from "../../lib/decodeToken"
import { getAvailableMinutes, validateWebsite } from "../../../Services/auth";
import { Snackbar } from "@mui/material";
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
// --- INTENT OPTIONS ---
const intentOptions = [
  "Billing and Invoice",
  "Complaint Feedback",
  "Customer Support and General",
  "Other",
]

// ---------------- Main Component ----------------
export default function AgentGeneralInfo({ open, onClose, onSubmit }) {
  useEffect(() => {
    if (open) {
      setErrors({});
      setActiveStep(0);
      setApiStatus({ status: null, message: null });
      setVoices([]);
      setPlayingVoiceId(null);
      setFilteredVoices([]);
    }
  }, [open]);
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
    agentAccent: "",
    assignMinutes: "",
    intents: [] // [{ type: "Billing and Invoice", name: "", description: "", file: null }]

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
  const [minute, setMinute] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const purposes = [
    "Customer Support",
    "Lead Qualifier",
    "Survey Agent",
    "Technical Support",
    "General Receptionist",
  ];
  const agentTypes = ["Inbound", "Outbound", "Both"];
  const genders = ["Male", "Female"];
  const steps = ["Agent Details", "Business Details", "Intents", "Agent Configuration", "Agent Minutes"];

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
      // if (!formData.corePurpose) newErrors.corePurpose = "Core Purpose is required";
      if (!formData.agentGender) newErrors.agentGender = "Agent Gender is required";
      if (!formData.agentAvatar) newErrors.agentAvatar = "Please select an avatar";
    } else if (step === 1) {
      if (!formData.industry) newErrors.industry = "Industry is required";
      if (formData.service.length === 0)
        newErrors.service = "At least one Business Service/Product is required";
      if (formData.service.includes("Other") && !formData.customServices) {
        newErrors.customServices = "Please specify your service";
      }
    }
    // else if (step === 2) {
    //   if (formData.intents.length === 0) {
    //     newErrors.intents = "At least one intent is required";
    //   } else {
    //     formData.intents.forEach((intent, idx) => {
    //       if (!intent.name) newErrors[`intent_${idx}_name`] = `${intent.type} - Name is required`;
    //       if (!intent.description) newErrors[`intent_${idx}_description`] = `${intent.type} - Description is required`;
    //       if (!intent.file) newErrors[`intent_${idx}_file`] = `${intent.type} - File is required`;
    //       if (!intent.urls || intent.urls.length === 0) {
    //         newErrors[`intent_${idx}_urls`] = `${intent.type} - At least one URL is required`;
    //       }
    //     });
    //   }
    // }
    else if (step === 2) {
      if (formData.intents.length === 0) {
        newErrors.intents = "At least one intent is required";
      } else {
        formData.intents.forEach((intent, idx) => {
          if (!intent.name) newErrors[`intent_${idx}_name`] = `${intent.type} - Name is required`;
          if (!intent.description) newErrors[`intent_${idx}_description`] = `${intent.type} - Description is required`;

          // ✅ Multiple file validation
          if (!intent.files || intent.files.length === 0) {
            newErrors[`intent_${idx}_files`] = `${intent.type} - At least one file is required`;
          } else {
            if (intent.files.length > 5) {
              newErrors[`intent_${idx}_files`] = `${intent.type} - Max 5 files allowed`;
            }
            intent.files.forEach((file) => {
              if (file.size > 10 * 1024 * 1024) {
                newErrors[`intent_${idx}_files`] = `${intent.type} - File "${file.name}" exceeds 10MB`;
              }
            });
          }

          if (!intent.urls || intent.urls.length === 0) {
            newErrors[`intent_${idx}_urls`] = `${intent.type} - At least one URL is required`;
          }
        });
      }
    }


    else if (step === 3) {
      if (!formData.agentType) newErrors.agentType = "Agent Type is required";
      if (!formData.agentLanguage) newErrors.agentLanguage = "Agent Language is required";
      if (!formData.agentVoice) newErrors.agentVoice = "Agent Voice is required";
    }
    else if (step === 4) {
      if (!formData.assignMinutes) {
        newErrors.assignMinutes = "Agent Minutes is required";
      } else if (minute <= 0) {
        newErrors.assignMinutes = "You don’t have enough minutes to assign";
      } else if (formData.assignMinutes > minute) {
        newErrors.assignMinutes = `You cannot assign more than ${minute.toLocaleString()} minutes`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
      console.log(finalData, "HELO")
      // return
      try {
        setApiStatus({ status: null, message: null });
        setIsSubmitting(true);
        const formDataToSend = new FormData();

        // Normal fields (direct req.body me milenge)
        formDataToSend.append("agentName", formData.agentName);
        formDataToSend.append("businessName", formData.businessName);
        formDataToSend.append("agentType", formData.agentType);
        formDataToSend.append("agentGender", formData.agentGender);
        formDataToSend.append("agentAvatar", formData.agentAvatar);
        formDataToSend.append("agentLanguage", formData.agentLanguage);
        formDataToSend.append("agentLanguageCode", formData.agentLanguageCode);
        formDataToSend.append("agentVoice", formData.agentVoice);
        formDataToSend.append("agentAccent", formData.agentAccent);
        formDataToSend.append("assignMinutes", formData.assignMinutes);
        formDataToSend.append("industry", formData.industry);
        formDataToSend.append("service", JSON.stringify(formData.service));
        formDataToSend.append("customService", formData.customService);
        formDataToSend.append("customServices", formData.customServices);
        formDataToSend.append("corePurpose", formData.corePurpose);
        formDataToSend.append("userId", userDetails?.user?.id);

        //Intents (without files)
        const intentsWithoutFiles = formData.intents.map(({ file, ...rest }) => rest);
        formDataToSend.append("intents", JSON.stringify(intentsWithoutFiles));

        //  Intent files
        formData.intents.forEach((intent, idx) => {
          if (intent.files && intent.files.length > 0) {
            intent.files.forEach((file, fileIdx) => {
              formDataToSend.append(`intentFiles[${idx}]`, file);
            });
          }
        });

        for (let [key, value] of formDataToSend.entries()) {
          console.log("FormData entry:", key, value);
        }
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/enterpriseAgent/createEnterpriseAgent`, formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response) {
          setSnackbar({
            open: true,
            message: response?.data?.message,
            severity: 'success'
          });
          setTimeout(() => {
            handleClose();
          }, 1500);
          setApiStatus({ status: "success", message: response?.data?.message });
          getUserMinutes()
          setTimeout(() => {
            onClose()
            setIsSubmitting(false);
            onSubmit()
          }, 1000);

        }
        console.log(response, "response")
        // setApiStatus({ status: "success", message: "Data submitted successfully!" });
        // onNext(finalData);
      } catch (error) {
        setApiStatus({
          status: "error",
          message: error.message || "An error occurred during submission",
        });
      }
      finally {
        //  Re-enable button
        setIsSubmitting(false);
      }
    }
  };
  // --- HANDLERS ---
  const handleIntentChange = (event) => {
    const selected = event.target.value;

    const updatedIntents = selected.map((intent) => {
      // Prevent adding "Other" from dropdown if it already exists
      if (intent === "Other") {
        const existingOther = formData.intents.find(i => i.type === "Other");
        return existingOther || { type: "Other", name: "", description: "", file: null, urls: [] };
      }

      // For normal intents
      const existing = formData.intents.find((i) => i.type === intent);
      return existing || { type: intent, name: "", description: "", file: null, urls: [] };
    });

    setFormData((prev) => ({
      ...prev,
      intents: updatedIntents,
    }));
  };
  const handleAddOther = () => {
    setFormData(prev => ({
      ...prev,
      intents: [
        ...prev.intents,
        { type: "Other", id: Date.now(), name: "", description: "", file: null, urls: [] }
      ]
    }));
  };
  const handleIntentFieldChange = (index, field, value) => {
    const updatedIntents = [...formData.intents];
    updatedIntents[index][field] = value;
    setFormData((prev) => ({ ...prev, intents: updatedIntents }));
    // Clear the error for this field
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`intent_${index}_${field}`]; // remove error key for this field
      return newErrors;
    });
  };
  // --- Handler ---
  const handleRemoveIntent = (index) => {
    const updatedIntents = [...formData.intents];
    updatedIntents.splice(index, 1); // remove 1 item at index
    setFormData((prev) => ({ ...prev, intents: updatedIntents }));
  };
  // --- Handlers ---
  const handleAddUrl = async (intentIndex) => {
    const intent = formData.intents[intentIndex];
    const rawUrl = intent.newUrl?.trim();
    if (!rawUrl) return;

    // Start verification
    handleIntentFieldChange(intentIndex, "verifying", true);
    handleIntentFieldChange(intentIndex, "errorMsg", "");
    handleIntentFieldChange(intentIndex, "currentUrlValid", false);

    let url = rawUrl.replace(/^https?:\/\//i, "");
    url = `https://${url}`;

    try {
      const result = await validateWebsite(url); // API call

      if (result.valid) {
        // URL valid → Add to list automatically
        setFormData((prev) => {
          const updatedIntents = [...prev.intents];
          const currentIntent = updatedIntents[intentIndex];
          if (!currentIntent.urls) currentIntent.urls = [];
          if (!currentIntent.urls.includes(rawUrl)) {
            currentIntent.urls.push(rawUrl);
          }
          currentIntent.newUrl = "";
          currentIntent.currentUrlValid = false;
          currentIntent.errorMsg = "";
          return { ...prev, intents: updatedIntents };
        });

        // Clear URL error
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`intent_${intentIndex}_urls`];
          return newErrors;
        });
      } else {
        // URL invalid → Show error
        handleIntentFieldChange(intentIndex, "currentUrlValid", false);
        handleIntentFieldChange(intentIndex, "errorMsg", "Your URL is wrong");
      }
    } catch (err) {
      handleIntentFieldChange(intentIndex, "currentUrlValid", false);
      handleIntentFieldChange(intentIndex, "errorMsg", "Error verifying URL");
    } finally {
      handleIntentFieldChange(intentIndex, "verifying", false);
    }
  };

  const handleRemoveUrl = (intentIndex, urlIndex) => {
    setFormData((prev) => {
      const updatedIntents = [...prev.intents];
      updatedIntents[intentIndex].urls.splice(urlIndex, 1);
      return { ...prev, intents: updatedIntents };
    });
  }
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
  useEffect(() => {
    const updatedIntents = formData.intents.map((intent) => {
      if (intent.type !== "Other") {
        return { ...intent, name: intent.type };
      }
      return intent;
    });

    // ✅ Only update if something actually changed
    const isChanged = JSON.stringify(updatedIntents) !== JSON.stringify(formData.intents);

    if (isChanged) {
      setFormData((prev) => ({ ...prev, intents: updatedIntents }));
    }
  }, [formData.intents]);

  const selectedIndustryData = allBusinessTypes.find(
    (i) => i.type === formData.industry
  );
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
            {/* <Stack spacing={1}>
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
            </Stack> */}

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
          <>
            {/* Intents */}
            <Stack spacing={1}>
              <InputLabel>Intents</InputLabel>
              <Select
                multiple
                name="intents"
                value={formData.intents.map((intent) => intent.type)}
                onChange={handleIntentChange}
                fullWidth
                error={!!errors.intents}
                renderValue={(selected) => selected.join(", ")}
              >
                {intentOptions.map((intent) => (
                  <MenuItem key={intent} value={intent}>
                    <Checkbox checked={formData.intents.some((i) => i.type === intent)} />
                    <ListItemText primary={intent} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{errors.intents}</FormHelperText>
            </Stack>

            {/* Extra fields for each selected intent */}
            {formData.intents.map((intent, index) => (
              <Paper key={intent.type} sx={{ p: 2, mt: 2 }} variant="outlined">
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="subtitle1" sx={{ display: 'inline-block', mr: 2, wordBreak: 'break-word' }} gutterBottom>
                    {intent.type}

                  </Typography>

                  {intent.type === "Other" && (
                    <Button
                      variant="text"
                      sx={{ mt: 1 }}
                      onClick={handleAddOther}
                    >
                      Add Another
                    </Button>
                  )}

                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TextField
                    label="Name"
                    value={intent.type === "Other" ? intent.name : intent.type}
                    onChange={(e) => handleIntentFieldChange(index, "name", e.target.value)}
                    fullWidth
                    margin="normal"
                    error={!!errors[`intent_${index}_name`]}  // ✅ show red border
                    helperText={errors[`intent_${index}_name`]} // ✅ show error text
                    InputProps={{ readOnly: intent.type !== "Other" }} // Only editable for Other
                  />
                  <Tooltip
                    title={
                      <>
                        <div><strong>Purpose:</strong> Short, meaningful name summarizing the intent.</div>
                        <div><strong>Example:</strong> Describe the transition condition, Provide billing info</div>
                      </>
                    }
                    arrow
                  >
                    <IconButton>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                </Stack>
                <br />
                <Stack direction="row" alignItems="center" spacing={1}>

                  <TextField
                    label="Description"
                    multiline
                    rows={3}
                    value={intent.description}
                    error={!!errors[`intent_${index}_description`]}  // ✅ red border
                    helperText={errors[`intent_${index}_description`]} // ✅ error text
                    onChange={(e) =>
                      handleIntentFieldChange(index, "description", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                  />
                  <Tooltip
                    title={
                      <>
                        <div><strong>Purpose:</strong> Explain in detail what this intent is for.</div>
                        <div><strong>Example:</strong> This intent explains how to handle state transitions in workflow.</div>
                      </>
                    }
                    arrow
                  >
                    <IconButton>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                {/* <Button

                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  sx={{ mt: 1 }}
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      handleIntentFieldChange(index, "file", e.target.files?.[0] || null)
                    }
                  />
                </Button> */}
                <br />
                {/* File Upload */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                  >
                    Upload Knowledge Files
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);

                        // validation: max 5 files, each ≤ 10MB
                        let errorMsg = "";
                        if (files.length > 5) {
                          errorMsg = "You can upload a maximum of 5 files.";
                        } else {
                          files.forEach((file) => {
                            if (file.size > 10 * 1024 * 1024) {
                              errorMsg = `File "${file.name}" exceeds 10MB limit.`;
                            }
                          });
                        }

                        if (errorMsg) {
                          // alert(errorMsg); // ya snackbar show kar do
                          setSnackbar({
                            open: true,
                            message: errorMsg,
                            severity: 'error'
                          });
                          return;
                        }

                        handleIntentFieldChange(index, "files", files);
                      }}
                    />
                  </Button>

                  <Tooltip
                    title={
                      <>
                        <div><strong>Purpose:</strong> Upload PDFs/DOCs with detailed knowledge for the agent.</div>
                        <div><strong>Example:</strong> Training manuals, product guides, workflow docs</div>
                        <div><strong>Limit:</strong> Max 5 files, each ≤ 10MB</div>
                      </>
                    }
                    arrow
                  >
                    <IconButton>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                {intent.files?.length > 0 && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {intent.files.map((f) => f.name).join(", ")}
                  </Typography>
                )}
                {errors[`intent_${index}_files`] && (
                  <FormHelperText error>{errors[`intent_${index}_files`]}</FormHelperText>
                )}
                <br />
                {/* URLs Input & Add */}
                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", alignItems: "center" }}>
                  <TextField
                    label="Add URL"
                    size="small"
                    value={intent.newUrl || ""}
                    sx={{ height: "40px", minWidth: "300px" }}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value && !/^https?:\/\//i.test(value)) {
                        value = `https://${value.replace(/^https?:\/\//i, "")}`;
                      }
                      handleIntentFieldChange(index, "newUrl", value);
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && intent.newUrl) {
                        e.preventDefault();
                        await handleAddUrl(index);
                      }
                    }}
                    InputProps={{
                      endAdornment: intent.verifying ? <CircularProgress size={20} /> : null
                    }}
                    error={!!intent.errorMsg}
                    helperText={intent.errorMsg}
                  />
                  <Tooltip
                    title={
                      <>
                        <div><strong>Purpose:</strong> Add a URL to your knowledge base or FAQ that the agent can reference.</div>
                        <div><strong>Example:</strong> https://yourwebsite.com/knowledgebase/transition-conditions</div>
                      </>
                    }
                    arrow
                  >
                    <IconButton>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="contained"
                    onClick={() => handleAddUrl(index)}
                    sx={{ height: "40px", minWidth: "80px" }}
                    disabled={intent.verifying || !intent.newUrl?.trim()}
                  >
                    Add
                  </Button>
                </Stack>
                <br />
                {errors[`intent_${index}_urls`] && (
                  <FormHelperText error>{errors[`intent_${index}_urls`]}</FormHelperText>
                )}


                {/* Display URLs as Chips */}
                <br />
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                  {intent.urls?.map((url, urlIndex) => (
                    <Chip
                      key={urlIndex}
                      label={url}
                      onDelete={() => handleRemoveUrl(index, urlIndex)}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
                <Button
                  variant="text"
                  color="error"
                  sx={{ mt: 1 }}
                  onClick={() => handleRemoveIntent(index)}
                >
                  Remove
                </Button>
              </Paper>
            ))}
          </>

        );
      case 3:
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
            <InputLabel>Agent Language</InputLabel>
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
      case 4:
        return (

          <Stack spacing={3}>
            <fieldset disabled={isSubmitting} style={{ border: "none", padding: 0, margin: 0 }}>
              {/* Available Bulk Minutes */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={2}
                borderRadius={2}
                bgcolor="action.hover"
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">
                    Available Minutes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total minutes in your account
                  </Typography>
                </Box>
                <Chip
                  label={`${minute?.toLocaleString() || 0} minutes`}
                  variant="outlined"
                  sx={{ fontSize: "1rem", px: 2, py: 1 }}
                />
              </Box>
              <br />
              {/* Assign Minutes Input */}
              <Stack spacing={1}>
                <InputLabel>Assign Minutes to Agent *</InputLabel>
                <TextField
                  type="number"
                  name="assignMinutes"
                  value={formData.assignMinutes || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setFormData({ ...formData, assignMinutes: value });

                    // ✅ Validation check
                    if (value > minute) {
                      setErrors({
                        ...errors,
                        assignMinutes: `You cannot assign more than ${minute.toLocaleString()} minutes`,
                      });
                    } else {
                      setErrors({
                        ...errors,
                        assignMinutes: "",
                      });
                    }
                  }}
                  error={!!errors.assignMinutes}
                  helperText={
                    errors.assignMinutes
                  }
                  fullWidth
                  placeholder="Enter minutes"
                  InputProps={{ inputProps: { min: 1, max: minute } }}
                />
              </Stack>
              <br />
              {/* Minutes Assignment Info */}
              {formData.assignMinutes > 0 && formData.assignMinutes <= minute && (
                <div>
                  <Box p={2} borderRadius={2} bgcolor="primary.main" color="white">
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography fontWeight="600">Minutes Assignment</Typography>
                    </Box>
                    <Typography variant="body2">
                      Assigning{" "}
                      <strong>{formData.assignMinutes.toLocaleString()}</strong> minutes to
                      this agent.
                      <br />
                      Remaining bulk minutes:{" "}
                      <strong>
                        {(minute - formData.assignMinutes).toLocaleString()}
                      </strong>
                    </Typography>
                  </Box>
                </div>
              )}
            </fieldset>
          </Stack>

        );
      default:
        return null;
    }
  };
  const getUserMinutes = async () => {
    try {
      const response = await getAvailableMinutes(userDetails?.user?.id)
      console.log(response, "responseresponse")
      if (response) {
        setMinute(response?.data?.remainingMinutes)
      }

    } catch (error) {
      console.log(error)
    }
  }
  const handleClose = () => {
    onClose()
  }
  useEffect(() => {
    getUserMinutes()
  }, [])
  return (

    <Grid justifyContent="center" sx={{ mt: 3, mb: 5 }} style={{ width: "100%" }}>
      <Grid item xs={12} sm={12} md={12} lg={10}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            backgroundColor: "transparent", // 👈 background remove
            boxShadow: "none" // 👈 optional: shadow bhi remove karne ke liye
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: (theme) => theme.palette.grey[600],
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Agent General Info
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Fill in the details to create a new agent
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
            sx={{ mt: 1 }}
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
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isSubmitting || minute <= 0}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              {isSubmitting && activeStep === steps.length - 1
                ? "Submitting..."
                : activeStep === steps.length - 1
                  ? "Submit"
                  : "Next"}
            </Button>
          </Stack>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Grid>
    </Grid>

  );
}