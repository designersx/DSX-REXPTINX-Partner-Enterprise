'use client';
import { useState, useEffect, useRef } from 'react';
import avatars from 'lib/avatars';
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
  FormControlLabel
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Paper, Divider, Chip } from '@mui/material';
import MainCard from 'components/MainCard';
import { GRID_COMMON_SPACING } from 'config';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import decodeToke from '../../lib/decodeToken';
import { getAvailableMinutes, validateWebsite } from '../../../Services/auth';
import { Snackbar } from '@mui/material';
import KnowledgeBase from './KnowledgeBase';
import AddressAutocomplete from 'components/AddressAutocomplete';
import PauseIcon from '@mui/icons-material/Pause';

// ---------------- Business Data ----------------
const allBusinessTypes = [
  {
    type: "Real Estate Broker",
    subtype: "Property Transaction Facilitator",
    icon: "svg/Estate-icon.svg",
  },
  {
    type: "Restaurant",
    subtype: "Food Service Establishment",
    icon: "svg/Landscaping-icon.svg",
  },
  {
    type: "Interior Designer",
    subtype: "Indoor Space Beautifier",
    icon: "svg/Interior-Designer-icon.svg",
  },
  {
    type: "Saloon",
    subtype: "Hair Styling & Grooming",
    icon: "svg/Saloon-icon.svg",
  },
  {
    type: "Landscaping Company",
    subtype: "Outdoor Space Beautification",
    icon: "svg/Landscaping-icon.svg",
  },
  {
    type: "Dentist",
    subtype: "Dental Care Provider",
    icon: "svg/Dentist-Office-icon.svg",
  },
  {
    type: "Doctor's Clinic",
    subtype: "Medical Consultation & Treatment",
    icon: "svg/Doctor-clinic-icon.svg",
  },
  {
    type: "Gym & Fitness Center",
    subtype: "Exercise Facility & Training",
    icon: "svg/Gym-icon.svg",
  },

  {
    type: "Personal Trainer",
    subtype: "Individual Fitness Coaching",
    icon: "svg/Personal-Trainer-icon.svg",
  },
  {
    type: "Web Design Agency",
    subtype: "Website Creation & Development",
    icon: "svg/Web-Design-Agency-icon.svg",
  },
  {
    type: "Architect",
    subtype: "Building Design Expert",
    icon: "svg/Architect-icon.svg",
  },
  {
    type: "Property Rental & Leasing Service",
    subtype: "Property Rental Management",
    icon: "svg/Property Rental & Leasing Service.svg",
  },
  {
    type: "Construction Services",
    subtype: "Building Construction & Repair",
    icon: "svg/Construction Services.svg",
  },
  {
    type: "Insurance Agency",
    subtype: "Risk Protection Provider",
    icon: "svg/Insurance Agency.svg",
  },
  {
    type: "Old Age Home",
    subtype: "Senior Living Facility",
    icon: "svg/Old Age Home.svg",
  },
  {
    type: "Travel Agency",
    subtype: "Trip Planning & Booking",
    icon: "svg/Travel Agency.svg",
  },
  {
    type: "Ticket Booking",
    subtype: "Travel Ticket Provider",
    icon: "svg/Ticket Booking.svg",
  },
  {
    type: "Accounting Services",
    subtype: "Financial Record Management",
    icon: "svg/Accounting Services.svg",
  },
  {
    type: "Financial Planners",
    subtype: "Wealth Management Advice",
    icon: "svg/Financial Planners.svg",
  },
  {
    type: "Beauty Parlour",
    subtype: "Cosmetic Beauty Services",
    icon: "svg/Beauty Parlour.svg",
  },
  {
    type: "Nail Salon",
    subtype: "Manicure/Pedicure Services",
    icon: "svg/Nail Saloon.svg",
  },
  {
    type: "Barber Studio/Shop",
    subtype: "Men's Hair Grooming",
    icon: "svg/Barber.svg",
  },
  {
    type: "Hair Stylist",
    subtype: "Professional Hair Care",
    icon: "svg/Hair Stylist.svg",
  },
  {
    type: "Bakery",
    subtype: "Baked Goods Producer",
    icon: "svg/Bakery.svg",
  },
  {
    type: "Dry Cleaner",
    subtype: "Garment Cleaning & Care",
    icon: "svg/Dry Cleaner.svg",
  },
  {
    type: "Cleaning Janitorial Service",
    subtype: "Professional Cleaning Solutions",
    icon: "svg/Cleaning Janitorial Service.svg",
  },
  // {
  //   type: "Marketing Agency",
  //   subtype: "Your Journey Begins Here",
  //   icon: "svg/Marketing Agency.svg",
  // },

  {
    type: "Other",
    subtype: "More Ideas, More Impact",
    icon: "svg/Web-Design-Agency-icon.svg",
  },
];

const businessServices = [
  {
    type: "Restaurant",
    subtype: "Food Service Establishment",
    icon: "svg/Restaurant-icon.svg",
    services: [
      "Dine-in Service",
      "Takeaway Orders",
      "Home Delivery",
      "Event Catering",
      "Online Ordering",
      "Other",
    ],
  },
  {
    type: "Real Estate Broker",
    subtype: "Property Transaction Facilitator",
    icon: "svg/Estate-icon.svg",
    services: [
      "Property Sales",
      "Property Rentals",
      "Property Viewings",
      "Price Valuation",
      "Legal Help",
      "Other",
    ],
  },
  {
    type: "Saloon",
    subtype: "Hair Styling & Grooming",
    icon: "svg/Saloon-icon.svg",
    services: [
      "Haircuts",
      "Hair Spa Treatments",
      "Hair Straightening",
      "Nail Extensions",
      "Facials",
      "Other",
    ],
  },
  {
    type: "Doctor's Clinic",
    subtype: "Medical Consultation & Treatment",
    icon: "svg/Doctor-clinic-icon.svg",
    services: [
      "General Checkups",
      "Specialist Consultations",
      "Vaccinations",
      "Blood Tests",
      "Health Screenings",
      "Other",
    ],
  },
  {
    type: "Dry Cleaner",
    subtype: "Garment Cleaning & Care",
    icon: "svg/Dry -Cleaner-icon.svg",
    services: [
      "Garment Cleaning",
      "Stain Removal",
      "Clothing Alterations",
      "Leather & Suede Cleaning",
      "Other",
    ],
  },
  {
    type: "Web Design Agency",
    subtype: "Website Creation & Development",
    icon: "svg/Web-Design-Agency-icon.svg",
    services: [
      "Website Creation",
      "Responsive Design",
      "SEO Services",
      "Website Maintenance",
      "E-commerce Setup",
      "Other",
    ],
  },
  {
    type: "Gym & Fitness Center",
    subtype: "Exercise Facility & Training",
    icon: "svg/Gym-icon.svg",
    services: [
      "Group Fitness Classes",
      "Weight Training Equipment",
      "Cardio Workouts",
      "Personal Training Sessions",
      "Other",
    ],
  },
  {
    type: "Marketing Agency",
    subtype: "Business Promotion Strategies",
    icon: "svg/Marketing Agency.svg",
    services: [
      "Social Media Advertising",
      "Content Creation",
      "Email Marketing",
      "PPC Ads",
      "Branding Strategy",
      "Other",
    ],
  },
  {
    type: "Personal Trainer",
    subtype: "Individual Fitness Coaching",
    icon: "images/other.png",
    services: [
      "Personalized Workout Plans",
      "One-on-One Training",
      "Nutrition Guidance",
      "Fitness Assessments",
      "Other",
    ],
  },
  {
    type: "Architect",
    subtype: "Building Design Expert",
    icon: "svg/Architect-icon.svg",
    services: [
      "Residential Building Design",
      "Commercial Building Plans",
      "Renovation Planning",
      "Permit Drawings",
      "Site Planning",
      "Project Management",
      "Other",
    ],
  },
  {
    type: "Interior Designer",
    subtype: "Indoor Space Beautifier",
    icon: "images/other.png",
    services: [
      "Space Planning",
      "Furniture Selection",
      "Color Consultation",
      "Lighting Design",
      "Home Makeovers",
      "Other",
    ],
  },
  {
    type: "Construction Services",
    subtype: "Building Construction & Repair",
    icon: "svg/Construction Services.svg",
    services: [
      "New Building Construction",
      "Home Renovations",
      "Project Supervision",
      "Structural Repairs",
      "Other",
    ],
  },
  {
    type: "Cleaning/Janitorial Service",
    subtype: "Building Construction & Repair",
    icon: "images/other.png",
    services: [
      "Office Cleaning",
      "Deep Carpet Cleaning",
      "Window Washing",
      "Floor Polishing",
      "Regular Maintenance",
      "Other",
    ],
  },
  {
    type: "Transport Company",
    subtype: "Freight Transportation Services",
    icon: "images/other.png",
    services: [
      "Freight Shipping",
      "Passenger Transport",
      "Courier Services",
      "Vehicle Rentals",
      "Logistics Management",
      "Other",
    ],
  },
  {
    type: "Landscaping Company",
    subtype: "Outdoor Space Beautification",
    icon: "images/other.png",
    services: [
      "Lawn Mowing & Maintenance",
      "Garden Design",
      "Tree Pruning & Removal",
      "Irrigation Installation",
      "Other",
    ],
  },
  {
    type: "Insurance Agency",
    subtype: "Risk Protection Provider",
    icon: "svg/Insurance Agency.svg",
    services: [
      "Life Insurance",
      "Health Insurance",
      "Car Insurance",
      "Home Insurance",
      "Business Insurance",
      "Other",
    ],
  },
  {
    type: "Financial Services",
    subtype: "Wealth Management Advice",
    icon: "images/other.png",
    services: [
      "Investment Planning",
      "Tax Preparation",
      "Retirement Planning",
      "Wealth Management",
      "Loan Consulting",
      "Other",
    ],
  },
  {
    type: "Accounting Services",
    subtype: "Financial Record Management",
    icon: "svg/Accounting Services.svg",
    services: [
      "Bookkeeping",
      "Tax Filing",
      "Payroll Services",
      "Financial Auditing",
      "Business Financial Reports",
      "Other",
    ],
  },
  {
    type: "Car Repair & Garage",
    subtype: "Vehicle Maintenance & Repair",
    icon: "images/other.png",
    services: [
      "Oil & Filter Change",
      "Brake Repairs",
      "Engine Diagnostics",
      "Tire Replacement",
      "Battery Service",
      "Other",
    ],
  },
  {
    type: "Boat Repair & Maintenance",
    subtype: "Watercraft Upkeep & Repair",
    icon: "images/other.png",
    services: [
      "Hull Repair",
      "Engine Maintenance",
      "Electrical System Repairs",
      "Boat Cleaning",
      "Winterizing Services",
      "Other",
    ],
  },
  {
    type: "Dentist",
    subtype: "Dental Care Provider",
    icon: "images/other.png",
    services: [
      "Teeth",
      "Cleaning",
      "Teeth Whitening",
      "Braces & Aligners",
      "Root Canal",
      "Tooth Extraction",
      "Other",
    ],
  },
  {
    type: "Property Rental & Leasing Service",
    subtype: "Property Rental Management",
    icon: "svg/Property Rental & Leasing Service.svg",
    services: [
      "Tenant Screening",
      "Lease Agreement Preparation",
      "Rent Collection",
      "Property Maintenance Coordination",
      "Other",
    ],
  },
  {
    type: "Old Age Home",
    subtype: "Senior Living Facility",
    icon: "svg/Old Age Home.svg",
    services: [
      "Assisted Living",
      "Meal Services",
      "Housekeeping & Laundry",
      "Recreational Activities",
      "Physiotherapy",
      "Emergency Support",
      "Other",
    ],
  },
  {
    type: "Travel Agency",
    subtype: "Trip Planning & Booking",
    icon: "svg/Travel Agency.svg",
    services: [
      "Flight Booking",
      "Hotel Reservations",
      "Holiday Packages",
      "Visa Assistance",
      "Travel Insurance",
      "Customized Itineraries",
      "Cruise Bookings",
      "Local Tours & Sightseeing",
      "Car Rentals",
      "Other",
    ],
  },
  {
    type: "Ticket Booking",
    subtype: "Travel Ticket Provider",
    icon: "svg/Ticket Booking.svg",
    services: [
      "Flight Tickets",
      "Train Tickets",
      "Bus Tickets",
      "Movie Tickets",
      "Event Tickets",
      "Amusement Park Tickets",
      "Concert & Show Tickets",
      "Sports Tickets",
      "Other",
    ],
  },
  {
    type: "Financial Planners",
    subtype: "Wealth Management Advice",
    icon: "svg/Financial Planners.svg",
    services: [
      "Retirement Planning",
      "Investment Portfolio Management",
      "Tax Planning",
      "Budgeting & Expense Management",
      "Estate Planning",
      "Insurance Planning",
      "Education Planning",
      "Debt Management",
      "Other",
    ],
  },
  {
    type: "Beauty Parlour",
    subtype: "Cosmetic Beauty Services",
    icon: "svg/Beauty Parlour.svg",
    services: [
      "Hair Cutting & Styling",
      "Facials & Cleanups",
      "Manicure & Pedicure",
      "Bridal Makeup",
      "Hair Coloring & Highlights",
      "Waxing & Threading",
      "Skin Treatments",
      "Makeup for Events",
      "Spa & Massage Services",
      "Other",
    ],
  },
  {
    type: "Nail Salon",
    subtype: "Manicure/Pedicure Services",
    icon: "svg/Nail Saloon.svg",
    services: [
      "Manicure",
      "Pedicure",
      "Nail Art",
      "Gel Nails",
      "Acrylic Nails",
      "Nail Extensions",
      "Cuticle Care",
      "Nail Repair & Removal",
      "Hand & Foot Spa",
      "Other",
    ],
  },
  {
    type: "Barber Studio/Shop",
    subtype: "Men's Hair Grooming",
    icon: "svg/Barber.svg",
    services: [
      "Haircut",
      "Beard Trimming & Styling",
      "Shaving & Grooming",
      "Hair Coloring",
      "Head Massage",
      "Facial for Men",
      "Scalp Treatment",
      "Hair Wash & Styling",
      "Kids Haircut",
      "Other",
    ],
  },
  {
    type: "Hair Stylist",
    subtype: "Professional Hair Care",
    icon: "svg/Hair Stylist.svg",
    services: [
      "Hair Cutting & Trimming",
      "Hair Styling",
      "Blow Dry & Ironing",
      "Hair Coloring & Highlights",
      "Hair Spa",
      "Keratin & Smoothening Treatments",
      "Hair Extensions",
      "Scalp Treatments",
      "Bridal & Occasion Hairstyles",
      "Other",
    ],
  },
  {
    type: "Bakery",
    subtype: "Baked Goods Producer",
    icon: "svg/Bakery.svg",
    services: [
      "Custom Cakes",
      "Birthday & Wedding Cakes",
      "Pastries & Cupcakes",
      "Cookies & Biscuits",
      "Bread & Buns",
      "Chocolates & Desserts",
      "Eggless & Sugar-Free Items",
      "Bulk & Party Orders",
      "Online Ordering & Delivery",
      "Other",
    ],
  },
  {
    type: "Cleaning Janitorial Service",
    subtype: "Professional Cleaning Solutions",
    icon: "svg/Cleaning Janitorial Service.svg",
    services: [
      "Residential Cleaning",
      "Commercial Office Cleaning",
      "Deep Cleaning Services",
      "Move-In/Move-Out Cleaning",
      "Carpet & Upholstery Cleaning",
      "Window Cleaning",
      "Disinfection & Sanitization",
      "Post-Construction Cleaning",
      "Restroom Cleaning & Maintenance",
      "Other",
    ],
  },
];
// ---------------- Languages Data ----------------
const languages = [
  /* English family */
  {
    name: 'English (US)',
    locale: 'en-US',
    flag: '/images/en-US.png',
    percentage: '4.76%',
    stats: '390 million native speakers'
  },
  {
    name: 'English (India)',
    locale: 'en-IN',
    flag: '/images/en-IN.png',
    percentage: '4.76%',
    stats: '390 million native speakers'
  },
  {
    name: 'English (UK)',
    locale: 'en-GB',
    flag: '/images/en-GB.png',
    percentage: '4.76%',
    stats: '390 million native speakers'
  },
  {
    name: 'English (Australia)',
    locale: 'en-AU',
    flag: '/images/en-AU.png',
    percentage: '4.76%',
    stats: '390 million native speakers'
  },
  {
    name: 'English (New Zealand)',
    locale: 'en-NZ',
    flag: '/images/en-NZ.png',
    percentage: '4.76%',
    stats: '390 million native speakers'
  },
  /* Germanic & Nordic */
  {
    name: 'German',
    locale: 'de-DE',
    flag: '/images/de-DE.png',
    percentage: '0.93%',
    stats: '76 million native speakers'
  },
  {
    name: 'Dutch',
    locale: 'nl-NL',
    flag: '/images/nl-NL.png',
    percentage: '0.30%',
    stats: '25 million native speakers'
  },
  {
    name: 'Danish',
    locale: 'da-DK',
    flag: '/images/da-DK.png',
    percentage: '0.07%',
    stats: '5.5 million native speakers'
  },
  {
    name: 'Finnish',
    locale: 'fi-FI',
    flag: '/images/fi-FI.png',
    percentage: '0.07%',
    stats: '5.4 million native speakers'
  },
  {
    name: 'Norwegian',
    locale: 'no-NO',
    flag: '/images/no-NO.png',
    percentage: '0.06%',
    stats: '5.2 million native speakers'
  },
  {
    name: 'Swedish',
    locale: 'sv-SE',
    flag: '/images/sv-SE.png',
    percentage: '0.11%',
    stats: '9.2 million native speakers'
  },
  /* Romance */
  {
    name: 'Spanish (Spain)',
    locale: 'es-ES',
    flag: '/images/es-ES.png',
    percentage: '5.90%',
    stats: '484 million native speakers'
  },
  {
    name: 'French (France)',
    locale: 'fr-FR',
    flag: '/images/fr-FR.png',
    percentage: '0.90%',
    stats: '74 million native speakers'
  },
  {
    name: 'French (Canada)',
    locale: 'fr-CA',
    flag: '/images/fr-CA.png',
    percentage: '0.90%',
    stats: '74 million native speakers'
  },
  {
    name: 'Italian',
    locale: 'it-IT',
    flag: '/images/it-IT.png',
    percentage: '0.77%',
    stats: '63 million native speakers'
  },
  {
    name: 'Portuguese (Portugal)',
    locale: 'pt-PT',
    flag: '/images/pt-PT.png',
    percentage: '3.05%',
    stats: '250 million native speakers'
  },
  {
    name: 'Portuguese (Brazil)',
    locale: 'pt-BR',
    flag: '/images/pt-BR.png',
    percentage: '3.05%',
    stats: '250 million native speakers'
  },
  {
    name: 'Catalan',
    locale: 'ca-ES',
    flag: '/images/ca-ES.png',
    percentage: '0.05%',
    stats: '4.1 million native speakers'
  },
  {
    name: 'Romanian',
    locale: 'ro-RO',
    flag: '/images/ro-RO.png',
    percentage: '0.29%',
    stats: '24 million native speakers'
  },
  /* Slavic & Baltic */
  {
    name: 'Polish',
    locale: 'pl-PL',
    flag: '/images/pl-PL.png',
    percentage: '0.49%',
    stats: '40 million native speakers'
  },
  {
    name: 'Russian',
    locale: 'ru-RU',
    flag: '/images/ru-RU.png',
    percentage: '1.77%',
    stats: '145 million native speakers'
  },
  {
    name: 'Bulgarian',
    locale: 'bg-BG',
    flag: '/images/bg-BG.png',
    percentage: '0.09%',
    stats: '7 million native speakers'
  },
  {
    name: 'Slovak',
    locale: 'sk-SK',
    flag: '/images/sk-SK.png',
    percentage: '0.06%',
    stats: '5.2 million native speakers'
  },
  /* Hellenic & Uralic */
  {
    name: 'Greek',
    locale: 'el-GR',
    flag: '/images/el-GR.png',
    percentage: '0.16%',
    stats: '13 million native speakers'
  },
  {
    name: 'Hungarian',
    locale: 'hu-HU',
    flag: '/images/hu-HU.png',
    percentage: '0.16%',
    stats: '13 million native speakers'
  },
  /* Asian */
  {
    name: 'Hindi',
    locale: 'hi-IN',
    flag: '/images/hi-IN.png',
    percentage: '4.21%',
    stats: '345 million native speakers'
  },
  {
    name: 'Japanese',
    locale: 'ja-JP',
    flag: '/images/ja-JP.png',
    percentage: '1.51%',
    stats: '124 million native speakers'
  },
  {
    name: 'Korean',
    locale: 'ko-KR',
    flag: '/images/ko-KR.png',
    percentage: '0.99%',
    stats: '81 million native speakers'
  },
  {
    name: 'Chinese (Mandarin)',
    locale: 'zh-CN',
    flag: '/images/zh-CN.png',
    percentage: '12.07%',
    stats: '990 million native speakers'
  },
  {
    name: 'Vietnamese',
    locale: 'vi-VN',
    flag: '/images/vi-VN.png',
    percentage: '1.05%',
    stats: '86 million native speakers'
  },
  {
    name: 'Indonesian',
    locale: 'id-ID',
    flag: '/images/id-ID.png',
    percentage: '0.94%',
    stats: '77 million native speakers'
  },
  /* Turkic */
  {
    name: 'Turkish',
    locale: 'tr-TR',
    flag: '/images/tr-TR.png',
    percentage: '1.04%',
    stats: '85 million native speakers'
  },
  /* Universal / Mixed set */
  {
    name: 'Multilingual',
    locale: 'multi',
    flag: '/images/multi.png',
    percentage: '—',
    stats: '—'
  }
];

// ---------------- Dummy User Data ----------------
const dummyUsers = [
  { id: 'RXU9LL1757509373', name: 'John Doe', email: 'john.doe@example.com' },
  { id: 'RX427L1756452824', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: 'RX2DL21756092985', name: 'Amit Sharma', email: 'amit.sharma@example.com' },
  { id: 'RX2V4R1756534484', name: 'Priya Patel', email: 'priya.patel@example.com' }
];

// ---------------- Helper Function ----------------
// function getServicesByType(type) {
//   const found = businessServices.find((b) => b.type === type);
//   return found ? found.services : [];
// }
// const allowedFileTypes = [
//   '.bmp',
//   '.csv',
//   '.doc',
//   '.docx',
//   '.eml',
//   '.epub',
//   '.heic',
//   '.html',
//   '.jpeg',
//   '.jpg',
//   '.png',
//   '.md',
//   '.msg',
//   '.odt',
//   '.org',
//   '.p7s',
//   '.pdf',
//   '.ppt',
//   '.pptx',
//   '.rst',
//   '.rtf',
//   '.tiff',
//   '.txt',
//   '.tsv',
//   '.xls',
//   '.xlsx',
//   '.xml'
// ];
// const maxFilesPerKB = 25;
// const maxFileSizeMB = 50; // 50MB
// const maxCsvRows = 1000;
// const maxCsvCols = 50;

// // ---------------- Main Component ----------------
// export default function PartnerAgentGeneralInfo({ open, onClose, onSubmit }) {
//   useEffect(() => {
//     if (open) {
//       setErrors({});
//       setActiveStep(0);
//       setApiStatus({ status: null, message: null });
//       setVoices([]);
//       setPlayingVoiceId(null);
//       setFilteredVoices([]);
//       // fetchUsers(); // Uncomment to enable API call for fetching users
//     }
//   }, [open]);

//   const [formData, setFormData] = useState({
//     selectedUser: '', // For user selection
//     agentName: '',
//     corePurpose: '',
//     industry: '',
//     service: [],
//     customService: '',
//     businessName: '',
//     businessWebsite: '',
//     businessPhone: '',
//     businessAddress: [{
//       officeType: 'Main Office',
//       addressDetails: {
//         businessName: '',
//         streetAddress: '',
//         locality: '',
//         city: '',
//         district: '',
//         state: '',
//         country: '',
//         postalCode: '',
//         formattedAddress: '',
//         placeId: '',
//         url: ''
//       }
//     }],
//     agentGender: '',
//     agentAvatar: '',
//     agentLanguage: '',
//     agentLanguageCode: '',
//     agentVoice: '',
//     customServices: [''],
//     agentAccent: '',
//     intents: [],
//     KnowledgeBase: [
//       {
//         title: '',
//         description: '',
//         files: {
//           brochure: [],
//           tutorial: [],
//           troubleshooting: [],
//           other: []
//         },
//         urls: []
//       }
//     ]
//   });

//   const [users, setUsers] = useState(dummyUsers); // Initialize with dummy users
//   const [errors, setErrors] = useState({});
//   const [activeStep, setActiveStep] = useState(0);
//   const [apiStatus, setApiStatus] = useState({ status: null, message: null });
//   const [voices, setVoices] = useState([]);
//   const [playingVoiceId, setPlayingVoiceId] = useState(null);
//   const [audio, setAudio] = useState(null);
//   const audioRef = useRef(null);
//   const [filteredVoices, setFilteredVoices] = useState([]);
//   const token = localStorage.getItem('authToken');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [snackbar, setSnackbar] = useState<{
//     open: boolean;
//     message: string;
//     severity: AlertColor;
//   }>({
//     open: false,
//     message: '',
//     severity: 'info'
//   });
//   const agentTypes = ['Inbound', 'Outbound', 'Both'];
//   const genders = ['Male', 'Female'];
//   const steps = ['Agent Details', 'Business Details', 'Agent Configuration'];

//   const CustomPlayIcon = () => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       height="24"
//       viewBox="0 0 24 24"
//       width="24"
//       style={{ fill: 'currentColor' }}
//     >
//       <path d="M0 0h24v24H0z" fill="none" />
//       <path d="M8 5v14l11-7z" />
//     </svg>
//   );

//   // Fetch users from API (kept for future use)
//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setUsers(response.data || []);
//     } catch (error) {
//       setSnackbar({
//         open: true,
//         message: 'Failed to fetch users',
//         severity: 'error'
//       });
//     }
//   };

//   useEffect(() => {
//     if (voices && formData.agentGender) {
//       const filtered = voices.filter(
//         (voice) => voice.provider === 'elevenlabs' && voice?.gender?.toLocaleLowerCase() === formData?.agentGender?.toLocaleLowerCase()
//       );
//       setFilteredVoices(filtered || []);
//     }
//   }, [formData.agentGender, voices]);

//   useEffect(() => {
//     if (formData.agentGender && formData.agentLanguage) {
//       const fetchVoices = async () => {
//         try {
//           const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/fetchAgentVoiceDetailsFromRetell2`, {
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           });
//           setVoices(response?.data || []);
//           setApiStatus({ status: 'success', message: '' });
//         } catch (error) {
//           setVoices([]);
//           setApiStatus({ status: 'error', message: 'Failed to fetch voices' });
//         }
//       };
//       fetchVoices();
//     } else {
//       setVoices([]);
//       setApiStatus({ status: null, message: '' });
//     }
//   }, [formData.agentGender, formData.agentLanguage]);

//   const handlePlayVoice = (voiceId, audioUrl) => {
//     if (playingVoiceId === voiceId) {
//       audio?.pause();
//       setPlayingVoiceId(null);
//       setAudio(null);
//     } else {
//       if (audio) {
//         audio.pause();
//         setAudio(null);
//       }
//       const newAudio = new Audio(audioUrl);
//       newAudio.play().catch((err) => {
//         console.error('Audio playback error:', err);
//         setApiStatus({ status: 'error', message: 'Failed to play audio preview' });
//       });
//       setAudio(newAudio);
//       setPlayingVoiceId(voiceId);
//     }
//   };

//   const handleCustomServiceChange = (event, index) => {
//     const newCustomServices = [...formData.customServices];
//     newCustomServices[index] = event.target.value;
//     setFormData({ ...formData, customServices: newCustomServices });

//     const newErrors = [...errors.customServices];
//     newErrors[index] = validateCustomService(event.target.value);
//     setErrors({ ...errors, customServices: newErrors });
//   };

//   const handleAddCustomService = () => {
//     setFormData({
//       ...formData,
//       customServices: [...formData.customServices, '']
//     });
//     setErrors({
//       ...errors,
//       customServices: Array.isArray(errors.customServices) ? [...errors.customServices, ''] : ['']
//     });
//   };

//   const handleRemoveCustomService = (index) => {
//     const newCustomServices = formData.customServices.filter((_, i) => i !== index);
//     const newErrors = Array.isArray(errors.customServices)
//       ? errors.customServices.filter((_, i) => i !== index)
//       : new Array(formData.customServices.length - 1).fill('');
//     setFormData({ ...formData, customServices: newCustomServices });
//     setErrors({ ...errors, dashboards: newErrors });
//   };

//   useEffect(() => {
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current = null;
//       }
//     };
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'agentVoice') {
//       const selectedVoice = voices.find((v) => v.voice_id === value);
//       setFormData({
//         ...formData,
//         agentVoice: selectedVoice?.voice_id || '',
//         agentAccent: selectedVoice?.accent || ''
//       });
//       return;
//     }

//     if (name === 'agentLanguage') {
//       const selectedLang = languages.find((lang) => lang.locale === value);
//       setFormData({
//         ...formData,
//         agentLanguage: selectedLang?.name || '',
//         agentLanguageCode: selectedLang?.locale || '',
//         agentVoice: '',
//         agentAccent: ''
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//         ...(name === 'agentGender' ? { agentAvatar: '', agentVoice: '', agentAccent: '' } : {})
//       });
//     }
//   };

//   const handleServiceChange = (event) => {
//     const value = event.target.value;
//     setFormData({
//       ...formData,
//       service: value,
//       customServices: value.includes('Other') ? formData.customServices : ['']
//     });

//     setErrors({
//       ...errors,
//       service: value.length === 0 ? 'At least one service is required' : '',
//       customServices: value.includes('Other') ? formData.customServices.map(validateCustomService) : []
//     });
//   };

//   const handleAvatarSelect = (avatarImg) => {
//     setFormData({
//       ...formData,
//       agentAvatar: avatarImg
//     });
//   };

//   const validateCustomService = (value) => {
//     return value.trim() === '' ? 'Custom service cannot be empty' : '';
//   };

//   const validateStep = (step) => {
//     let newErrors = {};
//     if (step === 0) {
//       if (!formData.selectedUser) newErrors.selectedUser = 'Please select a user';
//       if (!formData.agentName) newErrors.agentName = 'Agent Name is required';
//       if (!formData.agentGender) newErrors.agentGender = 'Agent Gender is required';
//       if (!formData.agentAvatar) newErrors.agentAvatar = 'Please select an avatar';
//     } else if (step === 1) {
//       if (!formData.industry) newErrors.industry = 'Industry is required';
//       if (formData.service.length === 0) newErrors.service = 'At least one Business Service/Product is required';
//       if (formData.service.includes('Other') && !formData.customServices) newErrors.customServices = 'Please specify your service';
//       if (!formData.businessWebsite) newErrors.businessWebsite = 'Website is required';
//       if (!formData.businessPhone) newErrors.businessPhone = 'Phone number is required';
//     } else if (step === 2332) {
//       if (formData.service.length === 0) {
//         newErrors.service = 'At least one Business Service/Product is required';
//       } else {
//         const idx = 0;
//         const service = formData.service[idx];
//         const kb = formData.KnowledgeBase[idx] || {};

//         let serviceHasError = false;

//         if (!kb.description || kb.description.trim() === '') {
//           serviceHasError = true;
//           newErrors[`service_${idx}_description`] = `${service} - Description is required`;
//         }

//         const hasFiles = kb.files && Object.values(kb.files).some((arr) => arr.length > 0);
//         if (!hasFiles) {
//           serviceHasError = true;
//           newErrors[`service_${idx}_files`] = `${service} - At least one file is required`;
//         }

//         const hasUrls = kb.urls && kb.urls.length > 0;
//         if (!hasUrls) {
//           serviceHasError = true;
//           newErrors[`service_${idx}_urls`] = `${service} - At least one URL is required`;
//         }

//         if (serviceHasError) {
//           newErrors.generalService = 'Please complete all fields for the selected service';
//         }
//       }
//     } else if (step === 2) {
//       // if (!formData.agentType) newErrors.agentType = 'Agent Type is required';
//       if (!formData.agentLanguage) newErrors.agentLanguage = 'Agent Language is required';
//       if (!formData.agentVoice) newErrors.agentVoice = 'Agent Voice is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   // AGENT CREATION PROCESS
//   const handleSubmit = async () => {
//     if (validateStep(activeStep)) {
//       const finalData = {
//         ...formData,
//         userId: formData.selectedUser,
//         agentAccent: formData.agentAccent,
//         service: formData.service.map((s) => (s === 'Other' ? formData.customService : s)),
//       };
//       try {
//         setApiStatus({ status: null, message: null });
//         setIsSubmitting(true);
//         const formDataToSend = new FormData();

//         // Normal fields
//         formDataToSend.append('selectedUser', formData.selectedUser);
//         formDataToSend.append('agentName', formData.agentName);
//         formDataToSend.append('businessName', formData.businessName);
//         formDataToSend.append('businessWebsite', formData.businessWebsite);
//         formDataToSend.append('businessPhone', formData.businessPhone);
//         formDataToSend.append('businessAddress', JSON.stringify(formData.businessAddress));
//         formDataToSend.append('agentType', formData.agentType);
//         formDataToSend.append('agentGender', formData.agentGender);
//         formDataToSend.append('agentAvatar', formData.agentAvatar);
//         formDataToSend.append('agentLanguage', formData.agentLanguage);
//         formDataToSend.append('agentLanguageCode', formData.agentLanguageCode);
//         formDataToSend.append('agentVoice', formData.agentVoice);
//         formDataToSend.append('agentAccent', formData.agentAccent);
//         formDataToSend.append('industry', formData.industry);
//         formDataToSend.append('service', JSON.stringify(formData.service));
//         formDataToSend.append('customService', formData.customService);
//         formDataToSend.append('customServices', JSON.stringify(formData.customServices));
//         formDataToSend.append('corePurpose', formData.corePurpose);
//         formDataToSend.append('userId', formData.selectedUser);

//         // Intents (without files)
//         const intentsWithoutFiles = formData.intents.map(({ file, ...rest }) => rest);
//         formDataToSend.append('intents', JSON.stringify(intentsWithoutFiles));

//         // Intent files
//         formData.intents.forEach((intent, idx) => {
//           if (intent.files && intent.files.length > 0) {
//             intent.files.forEach((file, fileIdx) => {
//               formDataToSend.append(`intentFiles[${idx}]`, file);
//             });
//           }
//         });

//         // KnowledgeBase metadata
//         const kbWithoutFiles = formData.KnowledgeBase.map(({ files, ...rest }) => rest);
//         formDataToSend.append('KnowledgeBase', JSON.stringify(kbWithoutFiles));

//         // KnowledgeBase files with readable names
//         function sanitizeName(name: string) {
//           return name.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
//         }

//         formData.KnowledgeBase.forEach((kbItem, kbIdx) => {
//           const kbName = sanitizeName(kbItem.title);

//           if (kbItem.files) {
//             Object.entries(kbItem.files).forEach(([fileType, fileArray]) => {
//               fileArray.forEach((file, fileIdx) => {
//                 const readableName = `${kbName}-${fileType}-${sanitizeName(file.name)}`;
//                 const renamedFile = new File([file], readableName, { type: file.type });
//                 formDataToSend.append(`knowledgeBaseFiles[${kbName}][${fileType}][${fileIdx}]`, renamedFile);
//               });
//             });
//           }
//         });

//         for (let [key, value] of formDataToSend.entries()) {
//           console.log('FormData entry:', key, value);
//         }

//         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/enterpriseAgent/createEnterpriseAgent`, formDataToSend, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });

//         if (response) {
//           setSnackbar({
//             open: true,
//             message: response?.data?.message,
//             severity: 'success'
//           });
//           setTimeout(() => {
//             handleClose();
//           }, 1500);
//           setApiStatus({ status: 'success', message: response?.data?.message });
//           setTimeout(() => {
//             onClose();
//             setIsSubmitting(false);
//             onSubmit();
//           }, 1000);
//         }
//       } catch (error) {
//         setApiStatus({
//           status: 'error',
//           message: error.message || 'An error occurred during submission'
//         });
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   const handleIntentChange = (event) => {
//     const selected = event.target.value;

//     const updatedIntents = selected.map((intent) => {
//       if (intent === 'Other') {
//         const existingOther = formData.intents.find((i) => i.type === 'Other');
//         return existingOther || { type: 'Other', name: '', description: '', file: null, urls: [] };
//       }
//       const existing = formData.intents.find((i) => i.type === intent);
//       return existing || { type: intent, name: '', description: '', file: null, urls: [] };
//     });

//     setFormData((prev) => ({
//       ...prev,
//       intents: updatedIntents
//     }));
//   };

//   const handleAddOther = () => {
//     setFormData((prev) => ({
//       ...prev,
//       intents: [...prev.intents, { type: 'Other', id: Date.now(), name: '', description: '', file: null, urls: [] }]
//     }));
//   };

//   const handleIntentFieldChange = (index, field, value) => {
//     const updatedIntents = [...formData.intents];
//     updatedIntents[index][field] = value;
//     setFormData((prev) => ({ ...prev, intents: updatedIntents }));
//     setErrors((prevErrors) => {
//       const newErrors = { ...prevErrors };
//       delete newErrors[`intent_${index}_${field}`];
//       return newErrors;
//     });
//   };

//   const handleRemoveIntent = (index) => {
//     const updatedIntents = [...formData.intents];
//     updatedIntents.splice(index, 1);
//     setFormData((prev) => ({ ...prev, intents: updatedIntents }));
//   };

//   const handleAddUrl = async (intentIndex) => {
//     const intent = formData.intents[intentIndex];
//     const rawUrl = intent.newUrl?.trim();
//     if (!rawUrl) return;

//     handleIntentFieldChange(intentIndex, 'verifying', true);
//     handleIntentFieldChange(intentIndex, 'errorMsg', '');
//     handleIntentFieldChange(intentIndex, 'currentUrlValid', false);

//     let url = rawUrl.replace(/^https?:\/\//i, '');
//     url = `https://${url}`;

//     try {
//       const result = await validateWebsite(url);
//       if (result.valid) {
//         setFormData((prev) => {
//           const updatedIntents = [...prev.intents];
//           const currentIntent = updatedIntents[intentIndex];
//           if (!currentIntent.urls) currentIntent.urls = [];
//           if (!currentIntent.urls.includes(rawUrl)) {
//             currentIntent.urls.push(rawUrl);
//           }
//           currentIntent.newUrl = '';
//           currentIntent.currentUrlValid = false;
//           currentIntent.errorMsg = '';
//           return { ...prev, intents: updatedIntents };
//         });
//         setErrors((prev) => {
//           const newErrors = { ...prev };
//           delete newErrors[`intent_${intentIndex}_urls`];
//           return newErrors;
//         });
//       } else {
//         handleIntentFieldChange(intentIndex, 'currentUrlValid', false);
//         handleIntentFieldChange(intentIndex, 'errorMsg', 'Your URL is wrong');
//       }
//     } catch (err) {
//       handleIntentFieldChange(intentIndex, 'currentUrlValid', false);
//       handleIntentFieldChange(intentIndex, 'errorMsg', 'Error verifying URL');
//     } finally {
//       handleIntentFieldChange(intentIndex, 'verifying', false);
//     }
//   };

//   const handleRemoveUrl = (intentIndex, urlIndex) => {
//     setFormData((prev) => {
//       const updatedIntents = [...prev.intents];
//       updatedIntents[intentIndex].urls.splice(urlIndex, 1);
//       return { ...prev, intents: updatedIntents };
//     });
//   };

//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       if (activeStep === steps.length - 1) {
//         handleSubmit();
//       } else {
//         setActiveStep((prev) => prev + 1);
//         setErrors({});
//       }
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//     setErrors({});
//     setApiStatus({ status: null, message: null });
//   };

//   useEffect(() => {
//     const updatedIntents = formData.intents.map((intent) => {
//       if (intent.type !== 'Other') {
//         return { ...intent, name: intent.type };
//       }
//       return intent;
//     });

//     const isChanged = JSON.stringify(updatedIntents) !== JSON.stringify(formData.intents);
//     if (isChanged) {
//       setFormData((prev) => ({ ...prev, intents: updatedIntents }));
//     }
//   }, [formData.intents]);

//   const selectedIndustryData = allBusinessTypes.find((i) => i.type === formData.industry);
//   const handleIndustryChange = (e) => {
//     const selectedIndustry = e.target.value;
//     // if (selectedIndustry !== 'Electronics & Home Appliances') {
//     //   setSnackbar({
//     //     open: true,
//     //     message: 'Coming Soon!',
//     //     severity: 'info'
//     //   });
//     //   return;
//     // }
//     handleChange(e);
//     setFormData({
//       ...formData,
//       industry: selectedIndustry,
//       service: [],
//       customServices: ''
//     });
//   };

//   const handleFileUploadServices = async (index, type, e) => {
//     const files = Array.from(e.target.files);
//     const kbCopy = [...formData.KnowledgeBase];
//     kbCopy[index].files = kbCopy[index].files || {};
//     kbCopy[index].files[type] = kbCopy[index].files[type] || [];

//     let newErrors = { ...errors };
//     newErrors[`service_${index}_files`] = '';

//     for (let file of files) {
//       const ext = '.' + file.name.split('.').pop().toLowerCase();
//       if (!allowedFileTypes.includes(ext)) {
//         newErrors[`service_${index}_files`] = `File type not allowed: ${file.name}`;
//         continue;
//       }
//       if (file.size / (1024 * 1024) > maxFileSizeMB) {
//         newErrors[`service_${index}_files`] = `File too large (max ${maxFileSizeMB}MB): ${file.name}`;
//         continue;
//       }
//       if (kbCopy[index].files[type].length >= maxFilesPerKB) {
//         newErrors[`service_${index}_files`] = `Cannot upload more than ${maxFilesPerKB} files for ${type}`;
//         break;
//       }
//       if (['.csv', '.tsv', '.xls', '.xlsx'].includes(ext)) {
//         try {
//           if (ext === '.csv' || ext === '.tsv') {
//             const text = await file.text();
//             const rows = text.split(/\r?\n/).filter((r) => r.trim() !== '');
//             const rowCount = rows.length;
//             const colCount = rows[0]?.split(ext === '.csv' ? ',' : '\t').length || 0;
//             if (rowCount > maxCsvRows || colCount > maxCsvCols) {
//               newErrors[`service_${index}_files`] = `${file.name} exceeds max ${maxCsvRows} rows or ${maxCsvCols} columns`;
//               continue;
//             }
//           }
//         } catch (err) {
//           newErrors[`service_${index}_files`] = `Failed to read file: ${file.name}`;
//           continue;
//         }
//       }
//       kbCopy[index].files[type].push(file);
//     }

//     setFormData((prev) => ({ ...prev, KnowledgeBase: kbCopy }));
//     setErrors(newErrors);
//   };

//   const ensureKnowledgeBase = (index, intent) => {
//     setFormData((prev) => {
//       const kbCopy = [...prev.KnowledgeBase];
//       if (!kbCopy[index]) {
//         kbCopy[index] = {
//           title: intent || '',
//           description: '',
//           files: {
//             brochure: [],
//             tutorial: [],
//             troubleshooting: [],
//             other: []
//           },
//           urls: [],
//           newUrl: ''
//         };
//       } else {
//         kbCopy[index].title = intent || '';
//       }
//       return { ...prev, KnowledgeBase: kbCopy };
//     });
//   };

//   const handleAddUrlServices = async (intentIndex, inputValue) => {
//     let rawUrl = (inputValue || formData.KnowledgeBase[intentIndex]?.newUrl || '').trim();
//     if (!rawUrl) return;
//     if (!/^https?:\/\//i.test(rawUrl)) {
//       rawUrl = `https://${rawUrl.replace(/^https?:\/\//i, '')}`;
//     }

//     setFormData((prev) => {
//       const kbCopy = [...prev.KnowledgeBase];
//       kbCopy[intentIndex].verifying = true;
//       kbCopy[intentIndex].errorMsg = '';
//       kbCopy[intentIndex].currentUrlValid = false;
//       return { ...prev, KnowledgeBase: kbCopy };
//     });

//     try {
//       const result = await validateWebsite(rawUrl);
//       if (result) {
//         setFormData((prev) => {
//           const kbCopy = [...prev.KnowledgeBase];
//           const currentKB = kbCopy[intentIndex];
//           if (result.valid) {
//             if (!currentKB.urls.includes(rawUrl)) {
//               currentKB.urls.push(rawUrl);
//             }
//             currentKB.newUrl = '';
//             currentKB.errorMsg = '';
//             currentKB.currentUrlValid = true;
//           } else {
//             currentKB.errorMsg = 'Your URL is invalid';
//             currentKB.currentUrlValid = false;
//           }
//           kbCopy[intentIndex] = currentKB;
//           return { ...prev, KnowledgeBase: kbCopy };
//         });
//       }
//     } catch (err) {
//       setFormData((prev) => {
//         const kbCopy = [...prev.KnowledgeBase];
//         kbCopy[intentIndex].errorMsg = 'Error verifying URL';
//         kbCopy[intentIndex].currentUrlValid = false;
//         return { ...prev, KnowledgeBase: kbCopy };
//       });
//     } finally {
//       setFormData((prev) => {
//         const kbCopy = [...prev.KnowledgeBase];
//         kbCopy[intentIndex].verifying = false;
//         return { ...prev, KnowledgeBase: kbCopy };
//       });
//     }
//   };

//   const handleRemoveUrlServices = (intentIndex, urlIndex) => {
//     setFormData((prev) => {
//       const kbCopy = [...prev.KnowledgeBase];
//       kbCopy[intentIndex].urls.splice(urlIndex, 1);
//       return { ...prev, KnowledgeBase: kbCopy };
//     });
//   };

//   const parseAddressComponents = (data) => {
//     return {
//       businessName: data.business_name || '',
//       streetAddress: data.street_address || '',
//       locality: data.locality || '',
//       city: data.locality || data.city || '',
//       district: data.administrative_area_level_2 || '',
//       state: data.administrative_area || '',
//       country: data.country_code || '',
//       postalCode: data.postal_code || '',
//       formattedAddress: data.formatted_address || '',
//       placeId: data.place_id || '',
//       url: data.url || '',
//     };
//   };

//   const handleAddressDataChange = (index, data) => {
//     const mappedData = parseAddressComponents(data);
//     setFormData((prev) => {
//       const updatedAddresses = [...prev.businessAddress];
//       updatedAddresses[index].addressDetails = { ...mappedData };
//       return { ...prev, businessAddress: updatedAddresses };
//     });
//   };

//   const handleAddAddress = () => {
//     setFormData((prev) => ({
//       ...prev,
//       businessAddress: [
//         ...prev.businessAddress,
//         {
//           officeType: '',
//           addressDetails: {
//             businessName: '',
//             streetAddress: '',
//             locality: '',
//             city: '',
//             district: '',
//             state: '',
//             country: '',
//             postalCode: '',
//             formattedAddress: '',
//             placeId: '',
//             url: '',
//           },
//         },
//       ],
//     }));
//   };

//   const handleRemoveAddress = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       businessAddress: prev.businessAddress.filter((_, i) => i !== index),
//     }));
//   };

//   const handleOfficeTypeChange = (index, value) => {
//     setFormData((prev) => {
//       const updatedAddresses = [...prev.businessAddress];
//       updatedAddresses[index].officeType = value;
//       return { ...prev, businessAddress: updatedAddresses };
//     });
//   };

//   const handleAddressFieldChange = (index, field, value) => {
//     setFormData((prev) => {
//       const updatedAddresses = [...prev.businessAddress];
//       updatedAddresses[index].addressDetails = {
//         ...updatedAddresses[index].addressDetails,
//         [field]: value,
//       };
//       return { ...prev, businessAddress: updatedAddresses };
//     });
//   };

//   const getStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <Stack spacing={3}>
//             {/* User Selection */}
//             <Stack spacing={1}>
//               <InputLabel>Select User</InputLabel>
//               <Select
//                 name="selectedUser"
//                 value={formData.selectedUser}
//                 onChange={handleChange}
//                 error={!!errors.selectedUser}
//                 fullWidth
//               >
//                 {users.map((user) => (
//                   <MenuItem key={user.id} value={user.id}>
//                     {user.name || user.email}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText error>{errors.selectedUser}</FormHelperText>
//             </Stack>

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
//                 fullWidth
//               />
//             </Stack>

//             {/* Agent Gender */}
//             <Stack spacing={1}>
//               <InputLabel>Agent Gender</InputLabel>
//               <Select name="agentGender" value={formData.agentGender} onChange={handleChange} error={!!errors.agentGender} fullWidth>
//                 {genders.map((g) => (
//                   <MenuItem key={g} value={g}>
//                     {g}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText error>{errors.agentGender}</FormHelperText>
//             </Stack>

//             {/* Avatar Selection */}
//             {formData.agentGender && (
//               <Stack spacing={1}>
//                 <InputLabel>Select Avatar</InputLabel>
//                 <Stack direction="row" spacing={2} flexWrap="wrap">
//                   {avatars[formData.agentGender].map((avatar, index) => (
//                     <Box
//                       key={avatar.img}
//                       onClick={() => handleAvatarSelect(avatar.img)}
//                       sx={{
//                         cursor: 'pointer',
//                         border: formData.agentAvatar === avatar.img ? '2px solid #1976d2' : '2px solid transparent',
//                         borderRadius: 2,
//                         p: 0.5,
//                         transition: 'border 0.2s ease-in-out'
//                       }}
//                     >
//                       <img
//                         src={avatar.img}
//                         alt={`Avatar ${index + 1}`}
//                         width={60}
//                         height={60}
//                         style={{ borderRadius: 8, objectFit: 'cover' }}
//                       />
//                     </Box>
//                   ))}
//                 </Stack>
//                 <FormHelperText error>{errors.agentAvatar}</FormHelperText>
//               </Stack>
//             )}
//           </Stack>
//         );
//       case 1:
//         return (
//           <Stack spacing={3}>
//             {/* Industry */}
//             <Stack spacing={1}>
//               <InputLabel>Industry</InputLabel>
//               <Select name="industry" value={formData.industry} onChange={handleIndustryChange} error={!!errors.industry} fullWidth>
//                 {allBusinessTypes.map((ind) => (
//                   <MenuItem key={ind.type} value={ind.type}>
//                     {ind.type}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText error>{errors.industry}</FormHelperText>
//               {selectedIndustryData && (
//                 <Stack direction="row" spacing={1} alignItems="center" mt={1} sx={{ p: 1, borderRadius: 2, bgcolor: '#f1f5f9' }}>
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
//                 fullWidth
//               >
//                 {getServicesByType(formData.industry).map((s) => (
//                   <MenuItem key={s} value={s}>
//                     {s}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText error>{errors.service}</FormHelperText>
//               {formData.service.includes('Other') && (
//                 <Stack spacing={1} sx={{ mt: 1 }}>
//                   {formData.customServices.map((customService, index) => (
//                     <Stack key={index} direction="row" spacing={1} alignItems="center">
//                       <TextField
//                         fullWidth
//                         name={`customService_${index}`}
//                         placeholder="Enter your custom service"
//                         value={customService}
//                         onChange={(e) => handleCustomServiceChange(e, index)}
//                         error={!!errors.customServices?.[index]}
//                         helperText={errors.customServices?.[index]}
//                       />
//                       {index > 1 && (
//                         <Button variant="outlined" color="error" onClick={() => handleRemoveCustomService(index)}>
//                           Remove
//                         </Button>
//                       )}
//                     </Stack>
//                   ))}
//                   <Button variant="contained" onClick={handleAddCustomService} sx={{ alignSelf: 'flex-start' }}>
//                     Add Another Service
//                   </Button>
//                 </Stack>
//               )}
//             </Stack>

//             {/* Business Name */}
//             <Stack spacing={1}>
//               <InputLabel>Business Name</InputLabel>
//               <TextField
//                 name="businessName"
//                 placeholder="E.g., Samsung, Amazon"
//                 value={formData.businessName}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Stack>

//             {/* Business Website */}
//             <Stack spacing={1}>
//               <InputLabel>Business Website</InputLabel>
//               <TextField
//                 name="businessWebsite"
//                 placeholder="E.g., https://www.example.com"
//                 value={formData.businessWebsite}
//                 onChange={handleChange}
//                 error={!!errors.businessWebsite}
//                 helperText={errors.businessWebsite}
//                 fullWidth
//               />
//             </Stack>

//             {/* Business Phone Number */}
//             <Stack spacing={1}>
//               <InputLabel>Business Phone Number</InputLabel>
//               <TextField
//                 name="businessPhone"
//                 placeholder="E.g., +1234567890"
//                 value={formData.businessPhone}
//                 onChange={handleChange}
//                 error={!!errors.businessPhone}
//                 helperText={errors.businessPhone}
//                 fullWidth
//               />
//             </Stack>

//             {/* Business Addresses */}
//             <Stack spacing={2}>
//               <InputLabel>Business Addresses</InputLabel>
//               {formData.businessAddress.map((address, index) => (
//                 <Paper key={index} sx={{ p: 2, mb: 2 }} variant="outlined">
//                   <Stack spacing={2}>
//                     <Stack direction="row" spacing={1} alignItems="center">
//                       <TextField
//                         label="Office Type"
//                         placeholder="E.g., Head Office, Regional Office"
//                         value={address.officeType || ''}
//                         onChange={(e) => handleOfficeTypeChange(index, e.target.value)}
//                         error={!!errors[`businessAddress_${index}_officeType`]}
//                         helperText={errors[`businessAddress_${index}_officeType`]}
//                         fullWidth
//                       />
//                       {formData.businessAddress.length > 1 && (
//                         <Button
//                           variant="outlined"
//                           color="error"
//                           onClick={() => handleRemoveAddress(index)}
//                         >
//                           Remove
//                         </Button>
//                       )}
//                     </Stack>
//                     <AddressAutocomplete
//                       address={address.addressDetails.formattedAddress || ''}
//                       setAddress={(value) => {
//                         setFormData((prev) => {
//                           const updatedAddresses = [...prev.businessAddress];
//                           updatedAddresses[index].addressDetails = {
//                             ...updatedAddresses[index].addressDetails,
//                             formattedAddress: value,
//                           };
//                           return { ...prev, businessAddress: updatedAddresses };
//                         });
//                       }}
//                       onAddressDataChange={(data) => handleAddressDataChange(index, data)}
//                       error={!!errors[`businessAddress_${index}_address`]}
//                       helperText={errors[`businessAddress_${index}_address`]}
//                     />
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} md={6}>
//                         <TextField
//                           label="Location Name"
//                           value={address.addressDetails.businessName || ''}
//                           onChange={(e) =>
//                             handleAddressFieldChange(index, 'businessName', e.target.value)
//                           }
//                           fullWidth
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <TextField
//                           label="Street Address"
//                           value={address.addressDetails.streetAddress || ''}
//                           onChange={(e) =>
//                             handleAddressFieldChange(index, 'streetAddress', e.target.value)
//                           }
//                           fullWidth
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <TextField
//                           label="Locality"
//                           value={address.addressDetails.locality || ''}
//                           onChange={(e) =>
//                             handleAddressFieldChange(index, 'locality', e.target.value)
//                           }
//                           fullWidth
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <TextField
//                           label="City"
//                           value={address.addressDetails.city || ''}
//                           onChange={(e) =>
//                             handleAddressFieldChange(index, 'city', e.target.value)
//                           }
//                           fullWidth
//                           error={!!errors[`businessAddress_${index}_city`]}
//                           helperText={errors[`businessAddress_${index}_city`]}
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <TextField
//                           label="District"
//                           value={address.addressDetails.district || ''}
//                           onChange={(e) =>
//                             handleAddressFieldChange(index, 'district', e.target.value)
//                           }
//                           fullWidth
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <TextField
//                           label="State"
//                           value={address.addressDetails.state || ''}
//                           onChange={(e) =>
//                             handleAddressFieldChange(index, 'state', e.target.value)
//                           }
//                           fullWidth
//                           error={!!errors[`businessAddress_${index}_state`]}
//                           helperText={errors[`businessAddress_${index}_state`]}
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <TextField
//                           label="Country"
//                           value={address.addressDetails.country || ''}
//                           onChange={(e) =>
//                             handleAddressFieldChange(index, 'country', e.target.value)
//                           }
//                           fullWidth
//                           error={!!errors[`businessAddress_${index}_country`]}
//                           helperText={errors[`businessAddress_${index}_country`]}
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={6}>
//                         <TextField
//                           label="Postal Code"
//                           value={address.addressDetails.postalCode || ''}
//                           onChange={(e) =>
//                             handleAddressFieldChange(index, 'postalCode', e.target.value)
//                           }
//                           fullWidth
//                         />
//                       </Grid>
//                     </Grid>
//                   </Stack>
//                 </Paper>
//               ))}
//             </Stack>
//           </Stack>
//         );
//       case 2:
//       //   return (
//       //     <>
//       //       <Stack spacing={1}>
//       //         <InputLabel>Knowledge Base</InputLabel>
//       //       </Stack>
//       //       {formData.service.map((intent, index) => (
//       //         <Paper key={intent} sx={{ p: 2, mt: 2 }} variant="outlined">
//       //           <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
//       //             <Typography variant="subtitle1" sx={{ display: 'inline-block', mr: 2, wordBreak: 'break-word' }} gutterBottom>
//       //               {intent}
//       //             </Typography>
//       //           </Stack>
//       //           <Stack direction="row" alignItems="center" spacing={1}>
//       //             <TextField
//       //               label="Description"
//       //               multiline
//       //               rows={3}
//       //               value={formData.KnowledgeBase[index]?.description || ''}
//       //               fullWidth
//       //               margin="normal"
//       //               error={!!errors[`service_${index}_description`]}
//       //               helperText={errors[`service_${index}_description`] || ''}
//       //               onChange={(e) => {
//       //                 ensureKnowledgeBase(index, intent);
//       //                 const value = e.target.value;
//       //                 setFormData((prev) => {
//       //                   const kbCopy = [...prev.KnowledgeBase];
//       //                   kbCopy[index].description = value;
//       //                   return { ...prev, KnowledgeBase: kbCopy };
//       //                 });
//       //               }}
//       //             />
//       //             <Tooltip title="Explain in detail what this description is for." arrow>
//       //               <IconButton>
//       //                 <InfoOutlinedIcon fontSize="small" />
//       //               </IconButton>
//       //             </Tooltip>
//       //           </Stack>
//       //           <br />
//       //           {['brochure', 'tutorial', 'troubleshooting', 'other'].map((type) => (
//       //             <Stack key={type} direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
//       //               <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
//       //                 Upload {type.charAt(0).toUpperCase() + type.slice(1)} File
//       //                 <input type="file" hidden multiple onChange={(e) => handleFileUploadServices(index, type, e)} />
//       //               </Button>
//       //               <Tooltip
//       //                 title={`Upload ${type} files (Allowed: ${allowedFileTypes.join(', ')}, Max: ${maxFilesPerKB} files, ≤ ${maxFileSizeMB}MB each${type === 'csv' || type === 'tsv' || type === 'xls' || type === 'xlsx' ? `, Max rows: ${maxCsvRows}, Max columns: ${maxCsvCols}` : ''})`}
//       //                 arrow
//       //               >
//       //                 <IconButton>
//       //                   <InfoOutlinedIcon fontSize="small" />
//       //                 </IconButton>
//       //               </Tooltip>
//       //               {formData.KnowledgeBase[index]?.files[type]?.length > 0 && (
//       //                 <Typography variant="body2">
//       //                   Selected: {formData.KnowledgeBase[index].files[type].map((f) => f.name).join(', ')}
//       //                 </Typography>
//       //               )}
//       //             </Stack>
//       //           ))}
//       //           {errors[`service_${index}_files`] && (
//       //             <Typography variant="body2" color="error" sx={{ mt: 1 }}>
//       //               {errors[`service_${index}_files`]}
//       //             </Typography>
//       //           )}
//       //           <br />
//       //           <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
//       //             <TextField
//       //               label="Add URL"
//       //               size="small"
//       //               value={formData.KnowledgeBase[index]?.newUrl || ''}
//       //               sx={{ height: '40px', minWidth: '300px' }}
//       //               onChange={(e) => {
//       //                 let value = e.target.value;
//       //                 if (value && !/^https?:\/\//i.test(value)) {
//       //                   value = `https://${value.replace(/^https?:\/\//i, '')}`;
//       //                 }
//       //                 setFormData((prev) => {
//       //                   const kbCopy = [...prev.KnowledgeBase];
//       //                   kbCopy[index].newUrl = value;
//       //                   return { ...prev, KnowledgeBase: kbCopy };
//       //                 });
//       //               }}
//       //               onKeyDown={(e) => {
//       //                 if (e.key === 'Enter') {
//       //                   e.preventDefault();
//       //                   handleAddUrlServices(index, e.currentTarget.value);
//       //                 }
//       //               }}
//       //               error={!!formData.KnowledgeBase[index]?.errorMsg || !!errors[`service_${index}_urls`]}
//       //               helperText={formData.KnowledgeBase[index]?.errorMsg || errors[`service_${index}_urls`] || ''}
//       //             />
//       //             <Tooltip title="Add a URL the agent can reference." arrow>
//       //               <IconButton>
//       //                 <InfoOutlinedIcon fontSize="small" />
//       //               </IconButton>
//       //             </Tooltip>
//       //             <Button
//       //               variant="contained"
//       //               sx={{ height: '40px', minWidth: '80px' }}
//       //               disabled={!formData.KnowledgeBase[index]?.newUrl?.trim()}
//       //               onClick={() => handleAddUrlServices(index)}
//       //             >
//       //               Add
//       //             </Button>
//       //           </Stack>
//       //           <br />
//       //           <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
//       //             {formData.KnowledgeBase[index]?.urls?.map((url, urlIndex) => (
//       //               <Chip key={urlIndex} label={url} onDelete={() => handleRemoveUrlServices(index, urlIndex)} sx={{ mb: 1 }} />
//       //             ))}
//       //           </Stack>
//       //         </Paper>
//       //       ))}
//       //       {errors.generalService && (
//       //         <Typography variant="body2" color="error" sx={{ mt: 2 }}>
//       //           {errors.generalService}
//       //         </Typography>
//       //       )}
//       //     </>
//       //   );
//       // case 3:
//         return (
//           <Stack spacing={3}>
//             {/* <Stack spacing={1}>
//               <InputLabel>Agent Type</InputLabel>
//               <Select name="agentType" value={formData.agentType} onChange={handleChange} error={!!errors.agentType} fullWidth>
//                 {agentTypes.map((t) => (
//                   <MenuItem key={t} value={t}>
//                     {t}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText error>{errors.agentType}</FormHelperText>
//             </Stack> */}
//             <InputLabel>Agent Language</InputLabel> 
//             <Select
//               name="agentLanguage"
//               value={formData.agentLanguageCode || ''}
//               onChange={handleChange}
//               error={!!errors.agentLanguage}
//               fullWidth
//             >
//               {languages.map((lang) => (
//                 <MenuItem key={lang.locale} value={lang.locale}>
//                   <Stack direction="row" alignItems="center" spacing={1}>
//                     <img
//                       src={`https://flagcdn.com/w20/${lang.locale.split('-')[1]?.toLowerCase() || 'us'}.png`}
//                       alt="flag"
//                       className="w-5 h-5"
//                       onError={(e) => {
//                         const target = e.target as HTMLImageElement;
//                         if (lang.locale == 'es-419') {
//                           target.src = 'https://flagcdn.com/w80/es.png';
//                         }
//                       }}
//                     />
//                     <Typography>{lang.name}</Typography>
//                   </Stack>
//                 </MenuItem>
//               ))}
//             </Select>
//             <Stack spacing={1}>
//               <InputLabel>Agent Voice</InputLabel>
//               <Select
//                 name="agentVoice"
//                 value={formData.agentVoice || ''}
//                 onChange={handleChange}
//                 error={!!errors.agentVoice}
//                 disabled={!formData.agentGender || !formData.agentLanguage || voices.length === 0}
//                 fullWidth
//               >
//                 {filteredVoices?.map((voice) => (
//                   <MenuItem key={voice.voice_id} value={voice.voice_id}>
//                     <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
//                       <Stack direction="row" alignItems="center" spacing={1}>
//                         <Typography>{voice.voice_name}</Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           ({voice.accent}, {voice.age})
//                         </Typography>
//                       </Stack>
//                       {voice.preview_audio_url && (
//                         <IconButton
//                           size="small"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handlePlayVoice(voice.voice_id, voice.preview_audio_url);
//                           }}
//                         >
//                           {playingVoiceId === voice.voice_id ? <PauseIcon fontSize="small" /> : <CustomPlayIcon fontSize="small" />}
//                         </IconButton>
//                       )}
//                     </Stack>
//                   </MenuItem>
//                 ))}
//               </Select>
//               <FormHelperText error>{errors.agentVoice || apiStatus.message}</FormHelperText>
//             </Stack>
//           </Stack>
//         );
//       default:
//         return null;
//     }
//   };

//   const handleClose = () => {
//     onClose();
//   };

//   return (
//     <Grid justifyContent="center" sx={{ mt: 3, mb: 5 }} style={{ width: '100%' }}>
//       <Grid item xs={12} sm={12} md={12} lg={10}>
//         <Paper
//           elevation={3}
//           sx={{
//             p: { xs: 2, sm: 3, md: 4 },
//             borderRadius: 3,
//             backgroundColor: 'transparent',
//             boxShadow: 'none'
//           }}
//         >
//           <IconButton
//             aria-label="close"
//             onClick={handleClose}
//             sx={{
//               position: 'absolute',
//               top: 8,
//               right: 8,
//               color: (theme) => theme.palette.grey[600]
//             }}
//           >
//             <CloseIcon />
//           </IconButton>

//           <Typography variant="h5" fontWeight="bold" gutterBottom>
//             Agent General Info
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//             Fill in the details to create a new agent
//           </Typography>
//           <Divider sx={{ mb: 3 }} />

//           {apiStatus.status && (
//             <Alert severity={apiStatus.status} sx={{ mb: 3 }}>
//               {apiStatus.message}
//             </Alert>
//           )}

//           <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>

//           <Box sx={{ minHeight: { xs: 300, sm: 350, md: 400 } }}>{getStepContent(activeStep)}</Box>

//           <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
//             <Button disabled={activeStep === 0} onClick={handleBack} sx={{ textTransform: 'none' }}>
//               Back
//             </Button>
//             <Button
//               variant="contained"
//               onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
//               disabled={isSubmitting}
//               sx={{
//                 px: 4,
//                 py: 1,
//                 borderRadius: 2,
//                 textTransform: 'none',
//                 fontWeight: 'bold'
//               }}
//             >
//               {isSubmitting && activeStep === steps.length - 1 ? 'Submitting...' : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
//             </Button>
//           </Stack>
//           <Snackbar
//             open={snackbar.open}
//             autoHideDuration={6000}
//             onClose={handleCloseSnackbar}
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//           >
//             <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
//               {snackbar.message}
//             </Alert>
//           </Snackbar>
//         </Paper>
//       </Grid>
//     </Grid>
//   );
// }
function getServicesByType(type) {
  const found = businessServices.find((b) => b.type === type);
  return found ? found.services : [];
}

const allowedFileTypes = [ /* same as before */ ];
const maxFilesPerKB = 25;
const maxFileSizeMB = 50;
const maxCsvRows = 1000;
const maxCsvCols = 50;

const CustomPlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" style={{ fill: 'currentColor' }}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M8 5v14l11-7z" />
  </svg>
);

const companyKeywords = [
  "about", "our-story", "our-company", "who-we-are",
  "contact", "products", "services", "solutions", "what-we-do", "offerings",
  "blog", "news", "resources", "insights", "faq", "help",
  "pricing", "plans", "privacy", "terms-and-conditions", "terms-of-use",
  "case-studies", "projects", "portfolio", "testimonials", "reviews"
];

const filterCompanyPages = (urls: string[]) =>
  urls.filter(url =>
    companyKeywords.some(k => url.toLowerCase().includes(k))
  );

export default function PartnerAgentGeneralInfo({ open, onClose, onSubmit }: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  // -------------------------------------------------------------------------
  // Reset everything when the modal opens
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (open) {
      setErrors({});
      setActiveStep(0);
      setApiStatus({ status: null, message: null });
      setVoices([]);
      setPlayingVoiceId(null);
      setFilteredVoices([]);
      setDisableGmb(false);
      setWebsiteVerified('none');
      setVerifying(false);
      setSitemapUrls([]);
      fetchUsers();
    }
  }, [open]);

  // -------------------------------------------------------------------------
  // Form state – address is now a **single** object
  // -------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    selectedUser: '',
    agentName: '',
    corePurpose: '',
    industry: '',
    service: [],
    customServices: [''],
    businessName: '',
    businessWebsite: '',
    businessPhone: '',
    businessEmail: '',
  googleBusinessName: '',
  googleListing: '',
    businessAddress: {
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
        url: ''
      }
    },
    agentGender: '',
    agentAvatar: '',
    agentLanguage: '',
    agentLanguageCode: '',
    agentVoice: '',
    agentAccent: '',
    KnowledgeBase: []
  });

  // -------------------------------------------------------------------------
  // UI / API states
  // -------------------------------------------------------------------------
  const [users, setUsers] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeStep, setActiveStep] = useState(0);
  const [apiStatus, setApiStatus] = useState<{ status: 'error' | 'success' | null; message: string | null }>({ status: null, message: null });
  const [voices, setVoices] = useState<any[]>([]);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [filteredVoices, setFilteredVoices] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'info' | 'success' | 'error' });
  const [disableGmb, setDisableGmb] = useState(false);
  const [websiteVerified, setWebsiteVerified] = useState<'none' | 'valid' | 'invalid'>('none');
  const [verifying, setVerifying] = useState(false);
  const [sitemapUrls, setSitemapUrls] = useState<string[]>([]);
  // console.log('sitemapUrls',sitemapUrls)
  const genders = ['Male', 'Female'];
  const steps = ['User & Business', 'Agent Configuration'];
  const token = localStorage.getItem('authToken');

  // -------------------------------------------------------------------------
  // Fetch users
  // -------------------------------------------------------------------------
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data || dummyUsers);
    } catch {
      setUsers(dummyUsers);
      setSnackbar({ open: true, message: 'Using dummy users', severity: 'info' });
    }
  };

  // -------------------------------------------------------------------------
  // Voice filtering
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (voices.length && formData.agentGender) {
      const filtered = voices.filter(v => v.provider === 'elevenlabs' && v.gender?.toLowerCase() === formData.agentGender.toLowerCase());
      setFilteredVoices(filtered);
    } else {
      setFilteredVoices([]);
    }
  }, [formData.agentGender, voices]);

  // -------------------------------------------------------------------------
  // Fetch voices
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (formData.agentGender && formData.agentLanguageCode) {
      const fetchVoices = async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/fetchAgentVoiceDetailsFromRetell2`);
          setVoices(res.data || []);
        } catch {
          setVoices([]);
          setApiStatus({ status: 'error', message: 'Failed to load voices' });
        }
      };
      fetchVoices();
    } else {
      setVoices([]);
    }
  }, [formData.agentGender, formData.agentLanguageCode]);

  // -------------------------------------------------------------------------
  // Audio playback
  // -------------------------------------------------------------------------
  const handlePlayVoice = (voiceId: string, url: string) => {
    if (playingVoiceId === voiceId) {
      audio?.pause();
      setPlayingVoiceId(null);
      setAudio(null);
    } else {
      audio?.pause();
      const newAudio = new Audio(url);
      newAudio.play().catch(() => setApiStatus({ status: 'error', message: 'Playback failed' }));
      setAudio(newAudio);
      setPlayingVoiceId(voiceId);
    }
  };

  // -------------------------------------------------------------------------
  // Generic change handler
  // -------------------------------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as any;
    if (name === 'agentVoice') {
      const v = voices.find(v => v.voice_id === value);
      setFormData(prev => ({ ...prev, agentVoice: v?.voice_id || '', agentAccent: v?.accent || '' }));
    } else if (name === 'agentLanguage') {
      const lang = languages.find(l => l.locale === value);
      setFormData(prev => ({
        ...prev,
        agentLanguage: lang?.name || '',
        agentLanguageCode: lang?.locale || '',
        agentVoice: '',
        agentAccent: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(name === 'agentGender' ? { agentAvatar: '', agentVoice: '', agentAccent: '' } : {})
      }));
    }
  };

  // -------------------------------------------------------------------------
  // Service handling
  // -------------------------------------------------------------------------
  const handleServiceChange = (e: any) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      service: value,
      customServices: value.includes('Other') ? prev.customServices : ['']
    }));
  };

  const handleAvatarSelect = (img: string) => setFormData(prev => ({ ...prev, agentAvatar: img }));

  const handleIndustryChange = (e: any) => {
    const ind = e.target.value;
    setFormData(prev => ({ ...prev, industry: ind, service: [], customServices: [''] }));
  };

  const handleCustomServiceChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const newServices = [...formData.customServices];
    newServices[idx] = e.target.value;
    setFormData(prev => ({ ...prev, customServices: newServices }));
  };

  const addCustomService = () => {
    setFormData(prev => ({ ...prev, customServices: [...prev.customServices, ''] }));
  };

  const removeCustomService = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      customServices: prev.customServices.filter((_, i) => i !== idx)
    }));
  };

  // -------------------------------------------------------------------------
  // Address parsing (Google Places → auto-fill phone & email)
  // -------------------------------------------------------------------------
  const parseAddress = (data: any) => ({
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
    phone: data.international_phone_number || data.phone_number ||'',
    email: data.email || ''
  });

  const handleAddressDataChange = (data: any) => {
    const mapped = parseAddress(data);
        console.log('google',data)
        console.log('google2',mapped)

    setFormData(prev => ({
      ...prev,
      businessAddress: { officeType: 'Main Office', addressDetails: mapped },
      businessName: mapped.businessName || prev.businessName,
      businessWebsite: mapped.website || prev.businessWebsite,
      businessPhone: mapped.phone || prev.businessPhone,
      businessEmail: mapped.email || prev.businessEmail,
      googleBusinessName: mapped.businessName || prev.businessName,
      googleListing: mapped.url || prev.googleListing, // GMB URL
    }));
  };

  // -------------------------------------------------------------------------
  // Website verification & sitemap
  // -------------------------------------------------------------------------
  const validateWebsite = async (url: string) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/validate-website`, { website: url });
      return res.data;
    } catch {
      return { valid: false, reason: 'Network error' };
    }
  };

  const listSiteMap = async (url: string) => {
    const token = localStorage.getItem('authToken');
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/map/list-sitemap`,
      { url },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  };

  const handleWebsiteBlur = async () => {
    let raw = (formData.businessWebsite || '').trim();
    if (!raw) {
      setWebsiteVerified('none');
      return;
    }

    raw = raw.replace(/^https?:\/\//i, '');
    const url = `https://${raw}`;
    setFormData(p => ({ ...p, businessWebsite: url }));
    setVerifying(true);

    try {
      const { valid, reason } = await validateWebsite(url);
      const isValid = !!valid;

      setWebsiteVerified(isValid ? 'valid' : 'invalid');
      localStorage.setItem('isVerified', isValid ? 'true' : 'false');

      if (isValid) {
        const res = await listSiteMap(url);
        if (res?.success && Array.isArray(res.urls)) {
          const filtered = filterCompanyPages(res.urls);
          if (!filtered.includes(url)) filtered.unshift(url);
          setSitemapUrls(filtered);

          const formatted = filtered.map(link => ({ url: link, checkedStatus: true }));
          localStorage.setItem('selectedSitemapUrls', JSON.stringify(formatted));
          localStorage.setItem('sitemapUrls', JSON.stringify(filtered));
        } else {
          setSitemapUrls([]);
        }
      } else {
        setSitemapUrls([]);
        setApiStatus({ status: 'error', message: reason || 'Website not verified' });
      }
    } catch (e) {
      setWebsiteVerified('invalid');
      setApiStatus({ status: 'error', message: 'Verification failed' });
    } finally {
      setVerifying(false);
    }
  };

  // -------------------------------------------------------------------------
  // Validation per step
  // -------------------------------------------------------------------------
  const validateStep = (step: number) => {
    const err: Record<string, string> = {};

    if (step === 0) {
      if (!formData.selectedUser) err.selectedUser = 'Select a user';
      if (!formData.industry) err.industry = 'Industry required';
      if (formData.service.length === 0) err.service = 'Select at least one service';
      if (formData.service.includes('Other') && formData.customServices.some(s => !s.trim())) err.customServices = 'Custom service required';

      // address required unless GMB is disabled
      if (!disableGmb && !formData.businessAddress.addressDetails.formattedAddress)
        err.address = 'Main address required';

      // website must be verified if entered
      if (formData.businessWebsite && websiteVerified !== 'valid')
        err.businessWebsite = 'Website must be verified before proceeding';
    } else if (step === 1) {
      if (!formData.agentName) err.agentName = 'Agent name required';
      if (!formData.agentGender) err.agentGender = 'Gender required';
      if (!formData.agentAvatar) err.agentAvatar = 'Select avatar';
      if (!formData.agentLanguageCode) err.agentLanguage = 'Language required';
      if (!formData.agentVoice) err.agentVoice = 'Voice required';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) handleSubmit();
      else setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append('userId', formData.selectedUser);
    fd.append('agentName', formData.agentName);
    fd.append('corePurpose', formData.corePurpose || '');
    fd.append('industry', formData.industry);
    fd.append('service', JSON.stringify(formData.service));
    fd.append('customServices', JSON.stringify(formData.customServices.filter(s => s.trim())));
    fd.append('businessName', formData.businessName);
    fd.append('businessWebsite', formData.businessWebsite);
    fd.append('businessPhone', formData.businessPhone);
    fd.append('businessEmail', formData.businessEmail || '');
    fd.append('agentGender', formData.agentGender);
    fd.append('agentAvatar', formData.agentAvatar);
    fd.append('agentLanguage', formData.agentLanguage);
    fd.append('agentLanguageCode', formData.agentLanguageCode);
    fd.append('agentVoice', formData.agentVoice);
    fd.append('agentAccent', formData.agentAccent || '');

    // === Address (Single Object) ===
    fd.append('businessAddress', JSON.stringify(formData.businessAddress));

    // === Google Business Data ===
    fd.append('googleBusinessName', formData.googleBusinessName || '');
    fd.append('googleListing', formData.googleListing || '');

    // === Sitemap URLs (Selected & Verified) ===
    const selectedSitemap = JSON.parse(localStorage.getItem('selectedSitemapUrls') || '[]');
    fd.append('sitemapUrls', JSON.stringify(sitemapUrls));
    fd.append('selectedSitemapUrls', JSON.stringify(selectedSitemap));

    // === KnowledgeBase (if any) ===
    if (formData.KnowledgeBase && formData.KnowledgeBase.length > 0) {
      fd.append('KnowledgeBase', JSON.stringify(formData.KnowledgeBase.map(kb => ({
        title: kb.title,
        description: kb.description,
        urls: kb.urls || []
      }))));
    }
    console.log('=== FormData Contents ===');
    for (const [key, value] of fd.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
      } else if (typeof value === 'string' && value.length > 200) {
        console.log(`${key}: ${value.substring(0, 200)}... (truncated)`);
      } else {
        console.log(`${key}:`, value);
      }
    }
    return;
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/agentV2/createAgent`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSnackbar({ open: true, message: res.data.message, severity: 'success' });
      setTimeout(() => { onClose(); onSubmit(); localStorage.removeItem('selectedSitemapUrls');
localStorage.removeItem('sitemapUrls');
localStorage.removeItem('isVerified');}, 1500);
    } catch (err: any) {
      setApiStatus({ status: 'error', message: err.response?.data?.message || 'Submission failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------------------
  // Step content
  // -------------------------------------------------------------------------
  const getStepContent = (step: number) => {
    if (step === 0) {
      return (
        <Stack spacing={3}>
          {/* ---------- USER ---------- */}
          <Stack spacing={1}>
            <InputLabel>Select User</InputLabel>
            <Select name="selectedUser" value={formData.selectedUser} onChange={handleChange} error={!!errors.selectedUser} fullWidth>
              {users.map(u => <MenuItem key={u.id} value={u.id}>{u.name} ({u.email})</MenuItem>)}
            </Select>
            <FormHelperText error>{errors.selectedUser}</FormHelperText>
          </Stack>

          {/* ---------- INDUSTRY ---------- */}
          <Stack spacing={1}>
            <InputLabel>Industry</InputLabel>
            <Select name="industry" value={formData.industry} onChange={handleIndustryChange} error={!!errors.industry} fullWidth>
              {allBusinessTypes.map(i => <MenuItem key={i.type} value={i.type}>{i.type}</MenuItem>)}
            </Select>
            <FormHelperText error>{errors.industry}</FormHelperText>
          </Stack>

          {/* ---------- SERVICES ---------- */}
          <Stack spacing={1}>
            <InputLabel>Business Services/Products</InputLabel>
            <Select
              multiple
              name="service"
              value={formData.service}
              onChange={handleServiceChange}
              disabled={!formData.industry}
              renderValue={sel => (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {sel.map(v => <Chip key={v} label={v} />)}
                </Stack>
              )}
              fullWidth
            >
              {(() => {
                const found = businessServices.find(b => b.type === formData.industry);
                return (found ? found.services : []).map(s => (
                  <MenuItem key={s} value={s}>
                    <Checkbox checked={formData.service.includes(s)} />
                    <ListItemText primary={s} />
                  </MenuItem>
                ));
              })()}
            </Select>
            <FormHelperText error>{errors.service}</FormHelperText>

            {formData.service.includes('Other') && (
              <Stack spacing={1} mt={1}>
                {formData.customServices.map((cs, i) => (
                  <Stack direction="row" spacing={1} key={i}>
                    <TextField
                      fullWidth
                      placeholder="Custom service"
                      value={cs}
                      onChange={e => handleCustomServiceChange(e as any, i)}
                    />
                    {i > 0 && <Button color="error" onClick={() => removeCustomService(i)}>Remove</Button>}
                  </Stack>
                ))}
                <Button onClick={addCustomService}>Add Service</Button>
              </Stack>
            )}
          </Stack>

          {/* ---------- ADDRESS ---------- */}
          <Stack spacing={2}>
            <InputLabel>Search Business (Google Places)</InputLabel>

            {!disableGmb && (
              <AddressAutocomplete
                address={formData.businessAddress.addressDetails.formattedAddress}
                setAddress={val => {
                  setFormData(prev => ({
                    ...prev,
                    businessAddress: {
                      ...prev.businessAddress,
                      addressDetails: { ...prev.businessAddress.addressDetails, formattedAddress: val }
                    }
                  }));
                }}
                onAddressDataChange={handleAddressDataChange}
              />
            )}
            <FormHelperText error={!!errors.address}>{errors.address}</FormHelperText>
              <FormControlLabel
              control={<Checkbox checked={disableGmb} onChange={e => setDisableGmb(e.target.checked)} />}
              label="I don’t have a Google My Business listing"
            />
          </Stack>

          {/* ---------- AUTO-FILLED FIELDS ---------- */}
          <Stack spacing={1}>
            <InputLabel>Business Name</InputLabel>
            <TextField
              fullWidth
              value={formData.businessName}
              onChange={e => setFormData(p => ({ ...p, businessName: e.target.value }))}
            />
          </Stack>

          <Stack spacing={1}>
            <InputLabel>Website</InputLabel>
            <TextField
              fullWidth
              value={formData.businessWebsite}
              onChange={e => setFormData(p => ({ ...p, businessWebsite: e.target.value }))}
              onBlur={handleWebsiteBlur}
              disabled={verifying}
              placeholder="https://example.com"
              error={!!errors.businessWebsite}
              helperText={errors.businessWebsite}
              InputProps={{
                endAdornment: verifying ? (
                  <CircularProgress size={20} />
                ) : websiteVerified === 'valid' ? (
                  <Tooltip title="Verified"><InfoOutlinedIcon color="success" /></Tooltip>
                ) : websiteVerified === 'invalid' ? (
                  <Tooltip title="Not verified"><InfoOutlinedIcon color="error" /></Tooltip>
                ) : null
              }}
            />
          </Stack>

          <Stack spacing={1}>
            <InputLabel>Phone </InputLabel>
            <TextField
              fullWidth
              value={formData.businessPhone}
              onChange={e => setFormData(p => ({ ...p, businessPhone: e.target.value }))}
            />
          </Stack>

          <Stack spacing={1}>
            <InputLabel>Business Email</InputLabel>
            <TextField
              fullWidth
              value={formData.businessEmail}
              onChange={e => setFormData(p => ({ ...p, businessEmail: e.target.value }))}
            />
          </Stack>
        </Stack>
      );
    }

    // -----------------------------------------------------------------
    // STEP 1 – Agent configuration
    // -----------------------------------------------------------------
    return (
      <Stack spacing={3}>
        <Stack spacing={1}>
          <InputLabel>Agent Name</InputLabel>
          <TextField name="agentName" value={formData.agentName} onChange={handleChange} error={!!errors.agentName} helperText={errors.agentName} />
        </Stack>

        <Stack spacing={1}>
          <InputLabel>Agent Gender</InputLabel>
          <Select name="agentGender" value={formData.agentGender} onChange={handleChange} error={!!errors.agentGender}>
            {genders.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
          </Select>
        </Stack>

        {formData.agentGender && (
          <Stack spacing={1}>
            <InputLabel>Select Avatar</InputLabel>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {avatars[formData.agentGender].map(av => (
                <Box
                  key={av.img}
                  onClick={() => handleAvatarSelect(av.img)}
                  sx={{
                    cursor: 'pointer',
                    border: formData.agentAvatar === av.img ? '2px solid #1976d2' : '2px solid transparent',
                    borderRadius: 2,
                    p: 0.5
                  }}
                >
                  <img src={av.img} width={60} height={60} style={{ borderRadius: 8 }} />
                </Box>
              ))}
            </Stack>
            <FormHelperText error>{errors.agentAvatar}</FormHelperText>
          </Stack>
        )}

        <Stack spacing={1}>
          <InputLabel>Agent Language</InputLabel>
          <Select name="agentLanguage" value={formData.agentLanguageCode} onChange={handleChange} error={!!errors.agentLanguage}>
            {languages.map(l => (
              <MenuItem key={l.locale} value={l.locale}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <img src={`https://flagcdn.com/w20/${l.locale.split('-')[1]?.toLowerCase() || 'us'}.png`} width={20} />
                  {l.name}
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack spacing={1}>
          <InputLabel>Agent Voice</InputLabel>
          <Select
            name="agentVoice"
            value={formData.agentVoice}
            onChange={handleChange}
            disabled={!formData.agentGender || !formData.agentLanguageCode}
            error={!!errors.agentVoice}
          >
            {filteredVoices.map(v => (
              <MenuItem key={v.voice_id} value={v.voice_id}>
                <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                  <Stack direction="row" spacing={1}>
                    <Typography>{v.voice_name}</Typography>
                    <Typography variant="body2" color="text.secondary">({v.accent}, {v.age})</Typography>
                  </Stack>
                  {v.preview_audio_url && (
                    <IconButton
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        handlePlayVoice(v.voice_id, v.preview_audio_url);
                      }}
                    >
                      {playingVoiceId === v.voice_id ? <PauseIcon /> : <CustomPlayIcon />}
                    </IconButton>
                  )}
                </Stack>
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error>{errors.agentVoice}</FormHelperText>
        </Stack>
      </Stack>
    );
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
     <Grid justifyContent="center" sx={{ mt: 3, mb: 5 }} style={{ width: '100%' }}>
         <Grid item xs={12} sm={12} md={12} lg={10}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, position: 'relative' }}>
          <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Agent General Info
          </Typography>
          <Divider sx={{ my: 2 }} />

          {apiStatus.status && (
            <Alert severity={apiStatus.status} sx={{ mb: 2 }}>
              {apiStatus.message}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map(l => (
              <Step key={l}>
                <StepLabel>{l}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 400 }}>{getStepContent(activeStep)}</Box>

          <Stack direction="row" justifyContent="space-between" mt={3}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {activeStep === steps.length - 1
                ? isSubmitting
                  ? 'Submitting...'
                  : 'Submit'
                : 'Next'}
            </Button>
          </Stack>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          >
            <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
          </Snackbar>
        </Paper>
      </Grid>
    </Grid>
  );
}