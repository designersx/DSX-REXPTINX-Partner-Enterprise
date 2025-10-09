'use client';

import { useState, useEffect, useRef } from 'react';
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
  Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Paper, Divider, Chip } from '@mui/material';
import MainCard from 'components/MainCard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import decodeToke from '../../lib/decodeToken';
import { getAvailableMinutes, validateWebsite } from '../../../Services/auth';
import { Snackbar } from '@mui/material';
import KnowledgeBase from './KnowledgeBase';
import AddressAutocomplete from 'components/AddressAutocomplete';
import PauseIcon from '@mui/icons-material/Pause';

// ---------------- Interfaces ----------------
interface User {
  id: string;
  name: string;
  email: string;
  referredBy?: string;
}

interface BusinessType {
  type: string;
  subtype: string;
  icon: string;
}

interface BusinessService {
  type: string;
  services: string[];
}

interface Language {
  name: string;
  locale: string;
  flag: string;
  percentage: string;
  stats: string;
}

interface Voice {
  voice_id: string;
  voice_name: string;
  provider: string;
  gender: string;
  accent: string;
  age: string;
  preview_audio_url: string;
}

interface Intent {
  type: string;
  name: string;
  description: string;
  files: File[] | null;
  urls: string[];
  newUrl?: string;
  verifying?: boolean;
  errorMsg?: string;
  currentUrlValid?: boolean;
}

interface KnowledgeBase {
  title: string;
  description: string;
  files: {
    brochure: File[];
    tutorial: File[];
    troubleshooting: File[];
    other: File[];
  };
  urls: string[];
  newUrl?: string;
  verifying?: boolean;
  errorMsg?: string;
  currentUrlValid?: boolean;
}

interface Address {
  officeType: string;
  addressDetails: {
    businessName: string;
    streetAddress: string;
    locality: string;
    city: string;
    district: string;
    state: string;
    country: string;
    postalCode: string;
    formattedAddress: string;
    placeId: string;
    url: string;
  };
}

interface FormData {
  userId?: string;
  agentName: string;
  corePurpose: string;
  industry: string;
  service: string[];
  customService: string;
  businessName: string;
  businessAddress: Address[];
  agentGender: string;
  agentAvatar: string;
  agentLanguage: string;
  agentLanguageCode: string;
  agentVoice: string;
  customServices: string[];
  agentAccent: string;
  assignMinutes: string | number;
  intents: Intent[];
  KnowledgeBase: KnowledgeBase[];
}

interface AgentGeneralInfoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  allUsers: User[];
}

// ---------------- Business Data ----------------
const allBusinessTypes: BusinessType[] = [
  {
    type: 'Electronics & Home Appliances',
    subtype: 'Consumer Electronics Retailer',
    icon: 'svg/Electronics-icon.svg',
  },
  {
    type: 'Banking',
    subtype: 'Financial Institution',
    icon: 'svg/Banking-icon.svg',
  },
  {
    type: 'D2C E-commerce',
    subtype: 'Direct to Consumer Online Brand',
    icon: 'svg/Ecommerce-icon.svg',
  },
  {
    type: 'B2B/B2C Marketplace',
    subtype: 'Online Wholesale/Retail Platform',
    icon: 'svg/Marketplace-icon.svg',
  },
  {
    type: 'Insurance',
    subtype: 'Risk & Coverage Services',
    icon: 'svg/Insurance-icon.svg',
  },
];

const businessServices: BusinessService[] = [
  {
    type: 'Electronics & Home Appliances',
    services: [
      'Mobile Phones',
      'Air Conditioners',
      'Refrigerators',
      'Washing Machines',
      'Smart TVs',
      'Laptops',
    ],
  },
  {
    type: 'Banking',
    services: [
      'Savings Account',
      'Credit Cards',
      'Loans',
      'Fixed Deposits',
      'Net Banking/UPI',
      'Wealth Management',
    ],
  },
  {
    type: 'D2C E-commerce',
    services: [
      'Fashion & Apparel',
      'Footwear',
      'Skincare & Beauty',
      'Electronics Accessories',
      'Home & Kitchen Essentials',
      'Nutritional Supplements',
    ],
  },
  {
    type: 'B2B/B2C Marketplace',
    services: [
      'Wholesale Electronics',
      'Industrial Equipment',
      'Office Supplies',
      'Furniture',
      'FMCG Products',
      'Agricultural Goods',
    ],
  },
  {
    type: 'Insurance',
    services: [
      'Health Insurance',
      'Life Insurance',
      'Vehicle Insurance',
      'Travel Insurance',
      'Property Insurance',
      'Business Insurance',
    ],
  },
];

// ---------------- Languages Data ----------------
const languages: Language[] = [
  /* English family */
  {
    name: 'English (US)',
    locale: 'en-US',
    flag: '/images/en-US.png',
    percentage: '4.76%',
    stats: '390 million native speakers',
  },
  {
    name: 'English (India)',
    locale: 'en-IN',
    flag: '/images/en-IN.png',
    percentage: '4.76%',
    stats: '390 million native speakers',
  },
  {
    name: 'English (UK)',
    locale: 'en-GB',
    flag: '/images/en-GB.png',
    percentage: '4.76%',
    stats: '390 million native speakers',
  },
  {
    name: 'English (Australia)',
    locale: 'en-AU',
    flag: '/images/en-AU.png',
    percentage: '4.76%',
    stats: '390 million native speakers',
  },
  {
    name: 'English (New Zealand)',
    locale: 'en-NZ',
    flag: '/images/en-NZ.png',
    percentage: '4.76%',
    stats: '390 million native speakers',
  },
  /* Germanic & Nordic */
  {
    name: 'German',
    locale: 'de-DE',
    flag: '/images/de-DE.png',
    percentage: '0.93%',
    stats: '76 million native speakers',
  },
  {
    name: 'Dutch',
    locale: 'nl-NL',
    flag: '/images/nl-NL.png',
    percentage: '0.30%',
    stats: '25 million native speakers',
  },
  {
    name: 'Danish',
    locale: 'da-DK',
    flag: '/images/da-DK.png',
    percentage: '0.07%',
    stats: '5.5 million native speakers',
  },
  {
    name: 'Finnish',
    locale: 'fi-FI',
    flag: '/images/fi-FI.png',
    percentage: '0.07%',
    stats: '5.4 million native speakers',
  },
  {
    name: 'Norwegian',
    locale: 'no-NO',
    flag: '/images/no-NO.png',
    percentage: '0.06%',
    stats: '5.2 million native speakers',
  },
  {
    name: 'Swedish',
    locale: 'sv-SE',
    flag: '/images/sv-SE.png',
    percentage: '0.11%',
    stats: '9.2 million native speakers',
  },
  /* Romance */
  {
    name: 'Spanish (Spain)',
    locale: 'es-ES',
    flag: '/images/es-ES.png',
    percentage: '5.90%',
    stats: '484 million native speakers',
  },
  {
    name: 'French (France)',
    locale: 'fr-FR',
    flag: '/images/fr-FR.png',
    percentage: '0.90%',
    stats: '74 million native speakers',
  },
  {
    name: 'French (Canada)',
    locale: 'fr-CA',
    flag: '/images/fr-CA.png',
    percentage: '0.90%',
    stats: '74 million native speakers',
  },
  {
    name: 'Italian',
    locale: 'it-IT',
    flag: '/images/it-IT.png',
    percentage: '0.77%',
    stats: '63 million native speakers',
  },
  {
    name: 'Portuguese (Portugal)',
    locale: 'pt-PT',
    flag: '/images/pt-PT.png',
    percentage: '3.05%',
    stats: '250 million native speakers',
  },
  {
    name: 'Portuguese (Brazil)',
    locale: 'pt-BR',
    flag: '/images/pt-BR.png',
    percentage: '3.05%',
    stats: '250 million native speakers',
  },
  {
    name: 'Catalan',
    locale: 'ca-ES',
    flag: '/images/ca-ES.png',
    percentage: '0.05%',
    stats: '4.1 million native speakers',
  },
  {
    name: 'Romanian',
    locale: 'ro-RO',
    flag: '/images/ro-RO.png',
    percentage: '0.29%',
    stats: '24 million native speakers',
  },
  /* Slavic & Baltic */
  {
    name: 'Polish',
    locale: 'pl-PL',
    flag: '/images/pl-PL.png',
    percentage: '0.49%',
    stats: '40 million native speakers',
  },
  {
    name: 'Russian',
    locale: 'ru-RU',
    flag: '/images/ru-RU.png',
    percentage: '1.77%',
    stats: '145 million native speakers',
  },
  {
    name: 'Bulgarian',
    locale: 'bg-BG',
    flag: '/images/bg-BG.png',
    percentage: '0.09%',
    stats: '7 million native speakers',
  },
  {
    name: 'Slovak',
    locale: 'sk-SK',
    flag: '/images/sk-SK.png',
    percentage: '0.06%',
    stats: '5.2 million native speakers',
  },
  /* Hellenic & Uralic */
  {
    name: 'Greek',
    locale: 'el-GR',
    flag: '/images/el-GR.png',
    percentage: '0.16%',
    stats: '13 million native speakers',
  },
  {
    name: 'Hungarian',
    locale: 'hu-HU',
    flag: '/images/hu-HU.png',
    percentage: '0.16%',
    stats: '13 million native speakers',
  },
  /* Asian */
  {
    name: 'Hindi',
    locale: 'hi-IN',
    flag: '/images/hi-IN.png',
    percentage: '4.21%',
    stats: '345 million native speakers',
  },
  {
    name: 'Japanese',
    locale: 'ja-JP',
    flag: '/images/ja-JP.png',
    percentage: '1.51%',
    stats: '124 million native speakers',
  },
  {
    name: 'Korean',
    locale: 'ko-KR',
    flag: '/images/ko-KR.png',
    percentage: '0.99%',
    stats: '81 million native speakers',
  },
  {
    name: 'Chinese (Mandarin)',
    locale: 'zh-CN',
    flag: '/images/zh-CN.png',
    percentage: '12.07%',
    stats: '990 million native speakers',
  },
  {
    name: 'Vietnamese',
    locale: 'vi-VN',
    flag: '/images/vi-VN.png',
    percentage: '1.05%',
    stats: '86 million native speakers',
  },
  {
    name: 'Indonesian',
    locale: 'id-ID',
    flag: '/images/id-ID.png',
    percentage: '0.94%',
    stats: '77 million native speakers',
  },
  /* Turkic */
  {
    name: 'Turkish',
    locale: 'tr-TR',
    flag: '/images/tr-TR.png',
    percentage: '1.04%',
    stats: '85 million native speakers',
  },
  /* Universal / Mixed set */
  {
    name: 'Multilingual',
    locale: 'multi',
    flag: '/images/multi.png',
    percentage: '—',
    stats: '—',
  },
];

// ---------------- Helper Function ----------------
function getServicesByType(type: string): string[] {
  const found = businessServices.find((b) => b.type === type);
  return found ? found.services : [];
}

const allowedFileTypes = [
  '.bmp',
  '.csv',
  '.doc',
  '.docx',
  '.eml',
  '.epub',
  '.heic',
  '.html',
  '.jpeg',
  '.jpg',
  '.png',
  '.md',
  '.msg',
  '.odt',
  '.org',
  '.p7s',
  '.pdf',
  '.ppt',
  '.pptx',
  '.rst',
  '.rtf',
  '.tiff',
  '.txt',
  '.tsv',
  '.xls',
  '.xlsx',
  '.xml',
];
const maxFilesPerKB = 25;
const maxFileSizeMB = 50;
const maxCsvRows = 1000;
const maxCsvCols = 50;

// ---------------- Avatars ----------------
const avatars = {
  Male: [
    { img: '/images/Male-01.png' },
    { img: '/images/Male-02.png' },
    { img: '/images/Male-03.png' },
    { img: '/images/Male-04.png' },
    { img: '/images/Male-05.png' },
  ],
  Female: [
    { img: '/images/Female-01.png' },
    { img: '/images/Female-02.png' },
    { img: '/images/Female-03.png' },
    { img: '/images/Female-04.png' },
    { img: '/images/Female-05.png' },
    { img: '/images/Female-06.png' },
  ],
};

// ---------------- Main Component ----------------
const AgentGeneralInfo: React.FC<AgentGeneralInfoProps> = ({ open, onClose, onSubmit, allUsers }) => {
  const [formData, setFormData] = useState<FormData>({
    userId: '',
    agentName: '',
    corePurpose: '',
    industry: '',
    service: [],
    customService: '',
    businessName: '',
    businessAddress: [
      {
        officeType: 'Main Office',
        addressDetails: {
          businessName: '',
          streetAddress: '',
          locality: '',
          city: '',
          district: '',
          state: '',
          country: '',
          postalCode: '',
          formattedAddress: '',
          placeId: '',
          url: '',
        },
      },
    ],
    agentGender: '',
    agentAvatar: '',
    agentLanguage: '',
    agentLanguageCode: '',
    agentVoice: '',
    customServices: [''],
    agentAccent: '',
    assignMinutes: '',
    intents: [],
    KnowledgeBase: [
      {
        title: '',
        description: '',
        files: {
          brochure: [],
          tutorial: [],
          troubleshooting: [],
          other: [],
        },
        urls: [],
      },
    ],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData | string, string>>>({});
  const [activeStep, setActiveStep] = useState<number>(0);
  const [apiStatus, setApiStatus] = useState<{ status: AlertColor | null; message: string | null }>({
    status: null,
    message: null,
  });
  const [voices, setVoices] = useState<Voice[]>([]);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [filteredVoices, setFilteredVoices] = useState<Voice[]>([]);
  const [userSearch, setUserSearch] = useState<string>('');
  const token = localStorage.getItem('authToken');
  const userDetails = decodeToke(token);
  const [minute, setMinute] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const agentTypes = ['Inbound', 'Outbound', 'Both'];
  const genders = ['Male', 'Female'];
  const steps = ['Select User', 'Agent Details', 'Business Details', 'Knowledge Base', 'Agent Configuration', 'Agent Minutes'];

  const CustomPlayIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      style={{ fill: 'currentColor' }}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M8 5v14l11-7z" />
    </svg>
  );

  useEffect(() => {
    if (open) {
      setErrors({});
      setActiveStep(0);
      setApiStatus({ status: null, message: null });
      setVoices([]);
      setPlayingVoiceId(null);
      setFilteredVoices([]);
      setUserSearch('');
      setFormData({
        userId: '',
        agentName: '',
        corePurpose: '',
        industry: '',
        service: [],
        customService: '',
        businessName: '',
        businessAddress: [
          {
            officeType: 'Main Office',
            addressDetails: {
              businessName: '',
              streetAddress: '',
              locality: '',
              city: '',
              district: '',
              state: '',
              country: '',
              postalCode: '',
              formattedAddress: '',
              placeId: '',
              url: '',
            },
          },
        ],
        agentGender: '',
        agentAvatar: '',
        agentLanguage: '',
        agentLanguageCode: '',
        agentVoice: '',
        customServices: [''],
        agentAccent: '',
        assignMinutes: '',
        intents: [],
        KnowledgeBase: [
          {
            title: '',
            description: '',
            files: {
              brochure: [],
              tutorial: [],
              troubleshooting: [],
              other: [],
            },
            urls: [],
          },
        ],
      });
    }
  }, [open]);

  useEffect(() => {
    if (voices && formData.agentGender) {
      const filtered = voices.filter(
        (voice) =>
          voice.provider === 'elevenlabs' &&
          voice?.gender?.toLowerCase() === formData?.agentGender?.toLowerCase()
      );
      setFilteredVoices(filtered || []);
    }
  }, [formData.agentGender, voices]);

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

  const handlePlayVoice = (voiceId: string, audioUrl: string) => {
    if (playingVoiceId === voiceId) {
      audio?.pause();
      setPlayingVoiceId(null);
      setAudio(null);
    } else {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
      const newAudio = new Audio(audioUrl);
      newAudio.play().catch((err) => {
        console.error('Audio playback error:', err);
        setApiStatus({ status: 'error', message: 'Failed to play audio preview' });
      });
      setAudio(newAudio);
      setPlayingVoiceId(voiceId);
    }
  };

  const handleCustomServiceChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCustomServices = [...formData.customServices];
    newCustomServices[index] = event.target.value;
    setFormData({ ...formData, customServices: newCustomServices });
    const newErrors = [...(errors.customServices || [])];
    newErrors[index] = validateCustomService(event.target.value);
    setErrors({ ...errors, customServices: newErrors });
  };

  const handleAddCustomService = () => {
    setFormData({
      ...formData,
      customServices: [...formData.customServices, ''],
    });
    setErrors({
      ...errors,
      customServices: Array.isArray(errors.customServices)
        ? [...errors.customServices, '']
        : [''],
    });
  };

  const handleRemoveCustomService = (index: number) => {
    const newCustomServices = formData.customServices.filter((_, i) => i !== index);
    const newErrors = Array.isArray(errors.customServices)
      ? errors.customServices.filter((_, i) => i !== index)
      : new Array(formData.customServices.length - 1).fill('');
    setFormData({ ...formData, customServices: newCustomServices });
    setErrors({ ...errors, customServices: newErrors });
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'agentVoice') {
      const selectedVoice = voices.find((v) => v.voice_id === value);
      setFormData({
        ...formData,
        agentVoice: selectedVoice?.voice_id || '',
        agentAccent: selectedVoice?.accent || '',
      });
      return;
    }
    if (name === 'agentLanguage') {
      const selectedLang = languages.find((lang) => lang.locale === value);
      setFormData({
        ...formData,
        agentLanguage: selectedLang?.name || '',
        agentLanguageCode: selectedLang?.locale || '',
        agentVoice: '',
        agentAccent: '',
      });
    } else if (name === 'userId') {
      setFormData({
        ...formData,
        userId: value,
      });
      localStorage.setItem('AgentForuserId', value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
        ...(name === 'agentGender' ? { agentAvatar: '', agentVoice: '', agentAccent: '' } : {}),
      });
    }
  };

  const handleServiceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[];
    setFormData({
      ...formData,
      service: value,
      customServices: value.includes('Other') ? formData.customServices : [''],
    });
    setErrors({
      ...errors,
      service: value.length === 0 ? 'At least one service is required' : '',
      customServices: value.includes('Other') ? formData.customServices.map(validateCustomService) : [],
    });
  };

  const handleAvatarSelect = (avatarImg: string) => {
    setFormData({
      ...formData,
      agentAvatar: avatarImg,
    });
  };

  const validateCustomService = (value: string): string => {
    if (!value.trim()) return 'Custom service cannot be empty';
    return '';
  };

  const validateStep = (step: number): boolean => {
    let newErrors: Partial<Record<keyof FormData | string, string>> = {};
    if (step === 0) {
      if (!formData.userId) newErrors.userId = 'Please select a user';
    } else if (step === 1) {
      if (!formData.agentName) newErrors.agentName = 'Agent Name is required';
      if (!formData.agentGender) newErrors.agentGender = 'Agent Gender is required';
      if (!formData.agentAvatar) newErrors.agentAvatar = 'Please select an avatar';
    } else if (step === 2) {
      if (!formData.industry) newErrors.industry = 'Industry is required';
      if (formData.service.length === 0) newErrors.service = 'At least one Business Service/Product is required';
      if (formData.service.includes('Other') && formData.customServices.some((s) => !s.trim())) {
        newErrors.customServices = 'Please specify your custom service';
      }
      formData.businessAddress.forEach((address, index) => {
        if (!address.officeType) {
          newErrors[`businessAddress_${index}_officeType`] = 'Office Type is required';
        }
        if (!address.addressDetails.city) {
          newErrors[`businessAddress_${index}_city`] = 'City is required';
        }
        if (!address.addressDetails.state) {
          newErrors[`businessAddress_${index}_state`] = 'State is required';
        }
        if (!address.addressDetails.country) {
          newErrors[`businessAddress_${index}_country`] = 'Country is required';
        }
      });
    } else if (step === 3) {
      if (formData.service.length === 0) {
        newErrors.service = 'At least one Business Service/Product is required';
      } else {
        formData.service.forEach((service, idx) => {
          const kb = formData.KnowledgeBase[idx] || {};
          let serviceHasError = false;
          if (!kb.description || kb.description.trim() === '') {
            serviceHasError = true;
            newErrors[`service_${idx}_description`] = `${service} - Description is required`;
          }
          const hasFiles = kb.files && Object.values(kb.files).some((arr) => arr.length > 0);
          if (!hasFiles) {
            serviceHasError = true;
            newErrors[`service_${idx}_files`] = `${service} - At least one file is required`;
          }
          const hasUrls = kb.urls && kb.urls.length > 0;
          if (!hasUrls) {
            serviceHasError = true;
            newErrors[`service_${idx}_urls`] = `${service} - At least one URL is required`;
          }
          if (serviceHasError) {
            newErrors.generalService = 'Please complete all fields for the selected service';
          }
        });
      }
    } else if (step === 4) {
      if (!formData.agentType) newErrors.agentType = 'Agent Type is required';
      if (!formData.agentLanguage) newErrors.agentLanguage = 'Agent Language is required';
      if (!formData.agentVoice) newErrors.agentVoice = 'Agent Voice is required';
    } else if (step === 5) {
      if (!formData.assignMinutes) {
        newErrors.assignMinutes = 'Agent Minutes is required';
      } else if (minute <= 0) {
        newErrors.assignMinutes = 'You don’t have enough minutes to assign';
      } else if (Number(formData.assignMinutes) > minute) {
        newErrors.assignMinutes = `You cannot assign more than ${minute.toLocaleString()} minutes`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      const finalData = {
        ...formData,
        userId: formData.userId || userDetails?.user?.id,
        service: formData.service.map((s) => (s === 'Other' ? formData.customService : s)),
        agentAccent: formData.agentAccent,
      };
      try {
        setApiStatus({ status: null, message: null });
        setIsSubmitting(true);
        const formDataToSend = new FormData();
        formDataToSend.append('agentName', formData.agentName);
        formDataToSend.append('businessName', formData.businessName);
        formDataToSend.append('businessAddress', JSON.stringify(formData.businessAddress));
        formDataToSend.append('agentType', formData.agentType);
        formDataToSend.append('agentGender', formData.agentGender);
        formDataToSend.append('agentAvatar', formData.agentAvatar);
        formDataToSend.append('agentLanguage', formData.agentLanguage);
        formDataToSend.append('agentLanguageCode', formData.agentLanguageCode);
        formDataToSend.append('agentVoice', formData.agentVoice);
        formDataToSend.append('agentAccent', formData.agentAccent);
        formDataToSend.append('assignMinutes', formData.assignMinutes.toString());
        formDataToSend.append('industry', formData.industry);
        formDataToSend.append('service', JSON.stringify(formData.service));
        formDataToSend.append('customService', formData.customService);
        formDataToSend.append('customServices', JSON.stringify(formData.customServices));
        formDataToSend.append('corePurpose', formData.corePurpose);
        formDataToSend.append('userId', formData.userId || userDetails?.user?.id || '');

        const intentsWithoutFiles = formData.intents.map(({ files, ...rest }) => rest);
        formDataToSend.append('intents', JSON.stringify(intentsWithoutFiles));

        formData.intents.forEach((intent, idx) => {
          if (intent.files && intent.files.length > 0) {
            intent.files.forEach((file, fileIdx) => {
              formDataToSend.append(`intentFiles[${idx}]`, file);
            });
          }
        });

        const kbWithoutFiles = formData.KnowledgeBase.map(({ files, ...rest }) => rest);
        formDataToSend.append('KnowledgeBase', JSON.stringify(kbWithoutFiles));

        function sanitizeName(name: string) {
          return name.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
        }

        formData.KnowledgeBase.forEach((kbItem, kbIdx) => {
          const kbName = sanitizeName(kbItem.title);
          if (kbItem.files) {
            Object.entries(kbItem.files).forEach(([fileType, fileArray]) => {
              fileArray.forEach((file, fileIdx) => {
                const readableName = `${kbName}-${fileType}-${sanitizeName(file.name)}`;
                const renamedFile = new File([file], readableName, { type: file.type });
                formDataToSend.append(`knowledgeBaseFiles[${kbName}][${fileType}][${fileIdx}]`, renamedFile);
              });
            });
          }
        });

        for (const [key, value] of formDataToSend.entries()) {
          console.log('FormData entry:', key, value);
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/enterpriseAgent/createEnterpriseAgent`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response) {
          setSnackbar({
            open: true,
            message: response?.data?.message,
            severity: 'success',
          });
          setTimeout(() => {
            handleClose();
          }, 1500);
          setApiStatus({ status: 'success', message: response?.data?.message });
          getUserMinutes();
          setTimeout(() => {
            onClose();
            setIsSubmitting(false);
            onSubmit();
          }, 1000);
        }
      } catch (error) {
        setApiStatus({
          status: 'error',
          message: (error as Error).message || 'An error occurred during submission',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleIntentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selected = event.target.value as string[];
    const updatedIntents = selected.map((intent) => {
      if (intent === 'Other') {
        const existingOther = formData.intents.find((i) => i.type === 'Other');
        return existingOther || { type: 'Other', name: '', description: '', files: null, urls: [] };
      }
      const existing = formData.intents.find((i) => i.type === intent);
      return existing || { type: intent, name: '', description: '', files: null, urls: [] };
    });
    setFormData((prev) => ({
      ...prev,
      intents: updatedIntents,
    }));
  };

  const handleAddOther = () => {
    setFormData((prev) => ({
      ...prev,
      intents: [...prev.intents, { type: 'Other', id: Date.now(), name: '', description: '', files: null, urls: [] }],
    }));
  };

  const handleIntentFieldChange = (index: number, field: keyof Intent, value: string | File[] | null) => {
    const updatedIntents = [...formData.intents];
    updatedIntents[index][field] = value as never;
    setFormData((prev) => ({ ...prev, intents: updatedIntents }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`intent_${index}_${field}`];
      return newErrors;
    });
  };

  const handleRemoveIntent = (index: number) => {
    const updatedIntents = [...formData.intents];
    updatedIntents.splice(index, 1);
    setFormData((prev) => ({ ...prev, intents: updatedIntents }));
  };

  const handleAddUrl = async (intentIndex: number) => {
    const intent = formData.intents[intentIndex];
    const rawUrl = intent.newUrl?.trim();
    if (!rawUrl) return;
    handleIntentFieldChange(intentIndex, 'verifying', true);
    handleIntentFieldChange(intentIndex, 'errorMsg', '');
    handleIntentFieldChange(intentIndex, 'currentUrlValid', false);
    let url = rawUrl.replace(/^https?:\/\//i, '');
    url = `https://${url}`;
    try {
      const result = await validateWebsite(url);
      if (result.valid) {
        setFormData((prev) => {
          const updatedIntents = [...prev.intents];
          const currentIntent = updatedIntents[intentIndex];
          if (!currentIntent.urls) currentIntent.urls = [];
          if (!currentIntent.urls.includes(rawUrl)) {
            currentIntent.urls.push(rawUrl);
          }
          currentIntent.newUrl = '';
          currentIntent.currentUrlValid = false;
          currentIntent.errorMsg = '';
          return { ...prev, intents: updatedIntents };
        });
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`intent_${intentIndex}_urls`];
          return newErrors;
        });
      } else {
        handleIntentFieldChange(intentIndex, 'currentUrlValid', false);
        handleIntentFieldChange(intentIndex, 'errorMsg', 'Your URL is wrong');
      }
    } catch (err) {
      handleIntentFieldChange(intentIndex, 'currentUrlValid', false);
      handleIntentFieldChange(intentIndex, 'errorMsg', 'Error verifying URL');
    } finally {
      handleIntentFieldChange(intentIndex, 'verifying', false);
    }
  };

  const handleRemoveUrl = (intentIndex: number, urlIndex: number) => {
    setFormData((prev) => {
      const updatedIntents = [...prev.intents];
      updatedIntents[intentIndex].urls.splice(urlIndex, 1);
      return { ...prev, intents: updatedIntents };
    });
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

  useEffect(() => {
    const updatedIntents = formData.intents.map((intent) => {
      if (intent.type !== 'Other') {
        return { ...intent, name: intent.type };
      }
      return intent;
    });
    const isChanged = JSON.stringify(updatedIntents) !== JSON.stringify(formData.intents);
    if (isChanged) {
      setFormData((prev) => ({ ...prev, intents: updatedIntents }));
    }
  }, [formData.intents]);

  const selectedIndustryData = allBusinessTypes.find((i) => i.type === formData.industry);

  const handleIndustryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const selectedIndustry = e.target.value as string;
    if (selectedIndustry !== 'Electronics & Home Appliances') {
      setSnackbar({
        open: true,
        message: 'Coming Soon!',
        severity: 'info',
      });
      return;
    }
    setFormData({
      ...formData,
      industry: selectedIndustry,
      service: [],
      customServices: [''],
    });
  };

  const handleFileUploadServices = async (index: number, type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const kbCopy = [...formData.KnowledgeBase];
    kbCopy[index].files = kbCopy[index].files || { brochure: [], tutorial: [], troubleshooting: [], other: [] };
    kbCopy[index].files[type] = kbCopy[index].files[type] || [];
    let newErrors: Partial<Record<keyof FormData | string, string>> = { ...errors };
    newErrors[`service_${index}_files`] = '';
    for (const file of files) {
      const ext = '.' + file.name.split('.').pop()!.toLowerCase();
      if (!allowedFileTypes.includes(ext)) {
        newErrors[`service_${index}_files`] = `File type not allowed: ${file.name}`;
        continue;
      }
      if (file.size / (1024 * 1024) > maxFileSizeMB) {
        newErrors[`service_${index}_files`] = `File too large (max ${maxFileSizeMB}MB): ${file.name}`;
        continue;
      }
      if (kbCopy[index].files[type].length >= maxFilesPerKB) {
        newErrors[`service_${index}_files`] = `Cannot upload more than ${maxFilesPerKB} files for ${type}`;
        break;
      }
      if (['.csv', '.tsv', '.xls', '.xlsx'].includes(ext)) {
        try {
          if (ext === '.csv' || ext === '.tsv') {
            const text = await file.text();
            const rows = text.split(/\r?\n/).filter((r) => r.trim() !== '');
            const rowCount = rows.length;
            const colCount = rows[0]?.split(ext === '.csv' ? ',' : '\t').length || 0;
            if (rowCount > maxCsvRows || colCount > maxCsvCols) {
              newErrors[`service_${index}_files`] = `${file.name} exceeds max ${maxCsvRows} rows or ${maxCsvCols} columns`;
              continue;
            }
          }
        } catch (err) {
          newErrors[`service_${index}_files`] = `Failed to read file: ${file.name}`;
          continue;
        }
      }
      kbCopy[index].files[type].push(file);
    }
    setFormData((prev) => ({ ...prev, KnowledgeBase: kbCopy }));
    setErrors(newErrors);
  };

  const ensureKnowledgeBase = (index: number, intent: string) => {
    setFormData((prev) => {
      const kbCopy = [...prev.KnowledgeBase];
      if (!kbCopy[index]) {
        kbCopy[index] = {
          title: intent || '',
          description: '',
          files: {
            brochure: [],
            tutorial: [],
            troubleshooting: [],
            other: [],
          },
          urls: [],
          newUrl: '',
        };
      } else {
        kbCopy[index].title = intent || '';
      }
      return { ...prev, KnowledgeBase: kbCopy };
    });
  };

  const handleAddUrlServices = async (intentIndex: number, inputValue?: string) => {
    let rawUrl = (inputValue || formData.KnowledgeBase[intentIndex]?.newUrl || '').trim();
    if (!rawUrl) return;
    if (!/^https?:\/\//i.test(rawUrl)) {
      rawUrl = `https://${rawUrl.replace(/^https?:\/\//i, '')}`;
    }
    setFormData((prev) => {
      const kbCopy = [...prev.KnowledgeBase];
      kbCopy[intentIndex].verifying = true;
      kbCopy[intentIndex].errorMsg = '';
      kbCopy[intentIndex].currentUrlValid = false;
      return { ...prev, KnowledgeBase: kbCopy };
    });
    try {
      const result = await validateWebsite(rawUrl);
      if (result) {
        setFormData((prev) => {
          const kbCopy = [...prev.KnowledgeBase];
          const currentKB = kbCopy[intentIndex];
          if (result.valid) {
            if (!currentKB.urls.includes(rawUrl)) {
              currentKB.urls.push(rawUrl);
            }
            currentKB.newUrl = '';
            currentKB.errorMsg = '';
            currentKB.currentUrlValid = true;
          } else {
            currentKB.errorMsg = 'Your URL is invalid';
            currentKB.currentUrlValid = false;
          }
          kbCopy[intentIndex] = currentKB;
          return { ...prev, KnowledgeBase: kbCopy };
        });
      }
    } catch (err) {
      setFormData((prev) => {
        const kbCopy = [...prev.KnowledgeBase];
        kbCopy[intentIndex].errorMsg = 'Error verifying URL';
        kbCopy[intentIndex].currentUrlValid = false;
        return { ...prev, KnowledgeBase: kbCopy };
      });
    } finally {
      setFormData((prev) => {
        const kbCopy = [...prev.KnowledgeBase];
        kbCopy[intentIndex].verifying = false;
        return { ...prev, KnowledgeBase: kbCopy };
      });
    }
  };

  const handleRemoveUrlServices = (intentIndex: number, urlIndex: number) => {
    setFormData((prev) => {
      const kbCopy = [...prev.KnowledgeBase];
      kbCopy[intentIndex].urls.splice(urlIndex, 1);
      return { ...prev, KnowledgeBase: kbCopy };
    });
  };

  const parseAddressComponents = (data: any): Address['addressDetails'] => {
    return {
      businessName: data.business_name || '',
      streetAddress: data.street_address || '',
      locality: data.locality || '',
      city: data.locality || data.city || '',
      district: data.administrative_area_level_2 || '',
      state: data.administrative_area || '',
      country: data.country_code || '',
      postalCode: data.postal_code || '',
      formattedAddress: data.formatted_address || '',
      placeId: data.place_id || '',
      url: data.url || '',
    };
  };

  const handleAddressDataChange = (index: number, data: any) => {
    const mappedData = parseAddressComponents(data);
    setFormData((prev) => {
      const updatedAddresses = [...prev.businessAddress];
      updatedAddresses[index].addressDetails = { ...mappedData };
      return { ...prev, businessAddress: updatedAddresses };
    });
  };

  const handleAddAddress = () => {
    setFormData((prev) => ({
      ...prev,
      businessAddress: [
        ...prev.businessAddress,
        {
          officeType: '',
          addressDetails: {
            businessName: '',
            streetAddress: '',
            locality: '',
            city: '',
            district: '',
            state: '',
            country: '',
            postalCode: '',
            formattedAddress: '',
            placeId: '',
            url: '',
          },
        },
      ],
    }));
  };

  const handleRemoveAddress = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      businessAddress: prev.businessAddress.filter((_, i) => i !== index),
    }));
  };

  const handleOfficeTypeChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedAddresses = [...prev.businessAddress];
      updatedAddresses[index].officeType = value;
      return { ...prev, businessAddress: updatedAddresses };
    });
  };

  const handleAddressFieldChange = (index: number, field: keyof Address['addressDetails'], value: string) => {
    setFormData((prev) => {
      const updatedAddresses = [...prev.businessAddress];
      updatedAddresses[index].addressDetails = {
        ...updatedAddresses[index].addressDetails,
        [field]: value,
      };
      return { ...prev, businessAddress: updatedAddresses };
    });
  };

  const getUserMinutes = async () => {
    try {
      const response = await getAvailableMinutes(userDetails?.user?.id);
      if (response) {
        setMinute(response?.data?.remainingMinutes || 0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    getUserMinutes();
  }, []);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Stack spacing={1}>
              <InputLabel>Select User</InputLabel>
              <Select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                error={!!errors.userId}
                fullWidth
              >
                <MenuItem value="">
                  <em>Choose user</em>
                </MenuItem>
                <Box sx={{ p: 1 }}>
                  <TextField
                    placeholder="Search user..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    fullWidth
                    onClick={(e) => e.stopPropagation()}
                  />
                </Box>
                {allUsers
                  .filter((u) => u.referredBy === localStorage.getItem('referralCode'))
                  .filter((u) =>
                    `${u.name} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
                  )
                  .map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText error>{errors.userId}</FormHelperText>
            </Stack>
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={3}>
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
            {formData.agentGender && (
              <Stack spacing={1}>
                <InputLabel>Select Avatar</InputLabel>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {avatars[formData.agentGender].map((avatar, index) => (
                    <Box
                      key={avatar.img}
                      onClick={() => handleAvatarSelect(avatar.img)}
                      sx={{
                        cursor: 'pointer',
                        border: formData.agentAvatar === avatar.img ? '2px solid #1976d2' : '2px solid transparent',
                        borderRadius: 2,
                        p: 0.5,
                        transition: 'border 0.2s ease-in-out',
                      }}
                    >
                      <img
                        src={avatar.img}
                        alt={`Avatar ${index + 1}`}
                        width={60}
                        height={60}
                        style={{ borderRadius: 8, objectFit: 'cover' }}
                      />
                    </Box>
                  ))}
                </Stack>
                <FormHelperText error>{errors.agentAvatar}</FormHelperText>
              </Stack>
            )}
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={3}>
            <Stack spacing={1}>
              <InputLabel>Industry</InputLabel>
              <Select
                name="industry"
                value={formData.industry}
                onChange={handleIndustryChange}
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
              {selectedIndustryData && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  mt={1}
                  sx={{ p: 1, borderRadius: 2, bgcolor: '#f1f5f9' }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {selectedIndustryData.subtype}
                  </Typography>
                </Stack>
              )}
            </Stack>
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
              {formData.service.includes('Other') && (
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
            <Stack spacing={2}>
              <InputLabel>Business Addresses</InputLabel>
              {formData.businessAddress.map((address, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }} variant="outlined">
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        label="Office Type"
                        placeholder="E.g., Head Office, Regional Office"
                        value={address.officeType || ''}
                        onChange={(e) => handleOfficeTypeChange(index, e.target.value)}
                        error={!!errors[`businessAddress_${index}_officeType`]}
                        helperText={errors[`businessAddress_${index}_officeType`]}
                        fullWidth
                      />
                      {formData.businessAddress.length > 1 && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemoveAddress(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </Stack>
                    <AddressAutocomplete
                      address={address.addressDetails.formattedAddress || ''}
                      setAddress={(value) => {
                        setFormData((prev) => {
                          const updatedAddresses = [...prev.businessAddress];
                          updatedAddresses[index].addressDetails = {
                            ...updatedAddresses[index].addressDetails,
                            formattedAddress: value,
                          };
                          return { ...prev, businessAddress: updatedAddresses };
                        });
                      }}
                      onAddressDataChange={(data) => handleAddressDataChange(index, data)}
                      error={!!errors[`businessAddress_${index}_address`]}
                      helperText={errors[`businessAddress_${index}_address`]}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Location Name"
                          value={address.addressDetails.businessName || ''}
                          onChange={(e) =>
                            handleAddressFieldChange(index, 'businessName', e.target.value)
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Street Address"
                          value={address.addressDetails.streetAddress || ''}
                          onChange={(e) =>
                            handleAddressFieldChange(index, 'streetAddress', e.target.value)
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Locality"
                          value={address.addressDetails.locality || ''}
                          onChange={(e) =>
                            handleAddressFieldChange(index, 'locality', e.target.value)
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="City"
                          value={address.addressDetails.city || ''}
                          onChange={(e) =>
                            handleAddressFieldChange(index, 'city', e.target.value)
                          }
                          fullWidth
                          error={!!errors[`businessAddress_${index}_city`]}
                          helperText={errors[`businessAddress_${index}_city`]}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="District"
                          value={address.addressDetails.district || ''}
                          onChange={(e) =>
                            handleAddressFieldChange(index, 'district', e.target.value)
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="State"
                          value={address.addressDetails.state || ''}
                          onChange={(e) =>
                            handleAddressFieldChange(index, 'state', e.target.value)
                          }
                          fullWidth
                          error={!!errors[`businessAddress_${index}_state`]}
                          helperText={errors[`businessAddress_${index}_state`]}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Country"
                          value={address.addressDetails.country || ''}
                          onChange={(e) =>
                            handleAddressFieldChange(index, 'country', e.target.value)
                          }
                          fullWidth
                          error={!!errors[`businessAddress_${index}_country`]}
                          helperText={errors[`businessAddress_${index}_country`]}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Postal Code"
                          value={address.addressDetails.postalCode || ''}
                          onChange={(e) =>
                            handleAddressFieldChange(index, 'postalCode', e.target.value)
                          }
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>
              ))}
              <Button
                variant="contained"
                onClick={handleAddAddress}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Another Address
              </Button>
            </Stack>
          </Stack>
        );
      case 3:
        return (
          <>
            <Stack spacing={1}>
              <InputLabel>Knowledge Base</InputLabel>
            </Stack>
            {formData.service.map((intent, index) => (
              <Paper key={intent} sx={{ p: 2, mt: 2 }} variant="outlined">
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="subtitle1" sx={{ display: 'inline-block', mr: 2, wordBreak: 'break-word' }} gutterBottom>
                    {intent}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TextField
                    label="Description"
                    multiline
                    rows={3}
                    value={formData.KnowledgeBase[index]?.description || ''}
                    fullWidth
                    margin="normal"
                    error={!!errors[`service_${index}_description`]}
                    helperText={errors[`service_${index}_description`] || ''}
                    onChange={(e) => {
                      ensureKnowledgeBase(index, intent);
                      const value = e.target.value;
                      setFormData((prev) => {
                        const kbCopy = [...prev.KnowledgeBase];
                        kbCopy[index].description = value;
                        return { ...prev, KnowledgeBase: kbCopy };
                      });
                    }}
                  />
                  <Tooltip title="Explain in detail what this description is for." arrow>
                    <IconButton>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <br />
                {['brochure', 'tutorial', 'troubleshooting', 'other'].map((type) => (
                  <Stack key={type} direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                    <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                      Upload {type.charAt(0).toUpperCase() + type.slice(1)} File
                      <input type="file" hidden multiple onChange={(e) => handleFileUploadServices(index, type, e)} />
                    </Button>
                    <Tooltip
                      title={`Upload ${type} files (Allowed: ${allowedFileTypes.join(', ')}, Max: ${maxFilesPerKB} files, ≤ ${maxFileSizeMB}MB each${type === 'csv' || type === 'tsv' || type === 'xls' || type === 'xlsx' ? `, Max rows: ${maxCsvRows}, Max columns: ${maxCsvCols}` : ''})`}
                      arrow
                    >
                      <IconButton>
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {formData.KnowledgeBase[index]?.files[type]?.length > 0 && (
                      <Typography variant="body2">
                        Selected: {formData.KnowledgeBase[index].files[type].map((f) => f.name).join(', ')}
                      </Typography>
                    )}
                  </Stack>
                ))}
                {errors[`service_${index}_files`] && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {errors[`service_${index}_files`]}
                  </Typography>
                )}
                <br />
                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <TextField
                    label="Add URL"
                    size="small"
                    value={formData.KnowledgeBase[index]?.newUrl || ''}
                    sx={{ height: '40px', minWidth: '300px' }}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value && !/^https?:\/\//i.test(value)) {
                        value = `https://${value.replace(/^https?:\/\//i, '')}`;
                      }
                      setFormData((prev) => {
                        const kbCopy = [...prev.KnowledgeBase];
                        kbCopy[index].newUrl = value;
                        return { ...prev, KnowledgeBase: kbCopy };
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddUrlServices(index, e.currentTarget.value);
                      }
                    }}
                    error={!!formData.KnowledgeBase[index]?.errorMsg || !!errors[`service_${index}_urls`]}
                    helperText={formData.KnowledgeBase[index]?.errorMsg || errors[`service_${index}_urls`] || ''}
                  />
                  <Tooltip title="Add a URL the agent can reference." arrow>
                    <IconButton>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="contained"
                    sx={{ height: '40px', minWidth: '80px' }}
                    disabled={!formData.KnowledgeBase[index]?.newUrl?.trim()}
                    onClick={() => handleAddUrlServices(index)}
                  >
                    Add
                  </Button>
                </Stack>
                <br />
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                  {formData.KnowledgeBase[index]?.urls?.map((url, urlIndex) => (
                    <Chip
                      key={urlIndex}
                      label={url}
                      onDelete={() => handleRemoveUrlServices(index, urlIndex)}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Paper>
            ))}
            {errors.generalService && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {errors.generalService}
              </Typography>
            )}
          </>
        );
      case 4:
        return (
          <Stack spacing={3}>
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
            <InputLabel>Agent Language</InputLabel>
            <Select
              name="agentLanguage"
              value={formData.agentLanguageCode || ''}
              onChange={handleChange}
              error={!!errors.agentLanguage}
              fullWidth
            >
              {languages.map((lang) => (
                <MenuItem key={lang.locale} value={lang.locale}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <img
                      src={`https://flagcdn.com/w20/${lang.locale.split('-')[1]?.toLowerCase() || 'us'}.png`}
                      alt="flag"
                      className="w-5 h-5"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (lang.locale === 'es-419') {
                          target.src = 'https://flagcdn.com/w80/es.png';
                        }
                      }}
                    />
                    <Typography>{lang.name}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
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
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography>{voice.voice_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({voice.accent}, {voice.age})
                        </Typography>
                      </Stack>
                      {voice.preview_audio_url && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayVoice(voice.voice_id, voice.preview_audio_url);
                          }}
                        >
                          {playingVoiceId === voice.voice_id ? (
                            <PauseIcon fontSize="small" />
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
      case 5:
        return (
          <Stack spacing={3}>
            <fieldset disabled={isSubmitting} style={{ border: 'none', padding: 0, margin: 0 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" p={2} borderRadius={2} bgcolor="action.hover">
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
                  sx={{ fontSize: '1rem', px: 2, py: 1 }}
                />
              </Box>
              <br />
              <Stack spacing={1}>
                <InputLabel>Assign Minutes to Agent *</InputLabel>
                <TextField
                  type="number"
                  name="assignMinutes"
                  value={formData.assignMinutes || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setFormData({ ...formData, assignMinutes: value });
                    if (value > minute) {
                      setErrors({
                        ...errors,
                        assignMinutes: `You cannot assign more than ${minute.toLocaleString()} minutes`,
                      });
                    } else {
                      setErrors({
                        ...errors,
                        assignMinutes: '',
                      });
                    }
                  }}
                  error={!!errors.assignMinutes}
                  helperText={errors.assignMinutes}
                  fullWidth
                  placeholder="Enter minutes"
                  InputProps={{ inputProps: { min: 1, max: minute } }}
                />
              </Stack>
              <br />
              {formData.assignMinutes > 0 && formData.assignMinutes <= minute && (
                <div>
                  <Box p={2} borderRadius={2} bgcolor="primary.main" color="white">
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography fontWeight="600">Minutes Assignment</Typography>
                    </Box>
                    <Typography variant="body2">
                      Assigning <strong>{Number(formData.assignMinutes).toLocaleString()}</strong> minutes to this agent.
                      <br />
                      Remaining bulk minutes:{' '}
                      <strong>{(minute - Number(formData.assignMinutes)).toLocaleString()}</strong>
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

  return (
    <Grid justifyContent="center" sx={{ mt: 3, mb: 5 }} style={{ width: '100%' }}>
      <Grid item xs={12} sm={12} md={12} lg={10}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
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
          {apiStatus.status && (
            <Alert severity={apiStatus.status} sx={{ mb: 3 }}>
              {apiStatus.message}
            </Alert>
          )}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ minHeight: { xs: 300, sm: 350, md: 400 } }}>{getStepContent(activeStep)}</Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ textTransform: 'none' }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isSubmitting || (activeStep === steps.length - 1 && minute <= 0)}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              {isSubmitting && activeStep === steps.length - 1
                ? 'Submitting...'
                : activeStep === steps.length - 1
                ? 'Submit'
                : 'Next'}
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
};

export default AgentGeneralInfo;