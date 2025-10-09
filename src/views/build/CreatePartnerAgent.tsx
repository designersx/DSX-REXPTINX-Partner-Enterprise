// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Box, Checkbox, FormControlLabel, Typography, CircularProgress, IconButton, Radio, RadioGroup, FormLabel } from "@mui/material";
// // import { TextareaAutosize } from "@mui/base";
// import { CheckCircle, PlayArrow, Pause } from "@mui/icons-material";
// // import { languages } from "./languageOptions";
// import { createAgent, getRetellVoices, validateWebsite } from "@/Services/auth";
// import axios from "axios";
// import { getAgentPrompt } from "@/lib/getAgentPrompt";
// import { getKnowledgeBaseName } from "@/lib/getKnowledgeBaseName";
// import Swal from "sweetalert2";

// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// declare global {
//   interface Window {
//     google: any;
//   }
// }

// interface AddAgentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   allUsers: User[];
//   onSubmit: (data: any) => void;
// }

// interface BusinessType {
//   type: string;
//   subtype: string;
//   icon: string;
// }

// const HTTPS_PREFIX = "https://";
// const PREFIX_LEN = HTTPS_PREFIX.length;

// const allBusinessTypes = [
//   {
//     type: "Real Estate Broker",
//     subtype: "Property Transaction Facilitator",
//     icon: "svg/Estate-icon.svg",
//   },
//   {
//     type: "Restaurant",
//     subtype: "Food Service Establishment",
//     icon: "svg/Landscaping-icon.svg",
//   },
//   {
//     type: "Interior Designer",
//     subtype: "Indoor Space Beautifier",
//     icon: "svg/Interior-Designer-icon.svg",
//   },
//   {
//     type: "Saloon",
//     subtype: "Hair Styling & Grooming",
//     icon: "svg/Saloon-icon.svg",
//   },
//   {
//     type: "Landscaping Company",
//     subtype: "Outdoor Space Beautification",
//     icon: "svg/Landscaping-icon.svg",
//   },
//   {
//     type: "Dentist",
//     subtype: "Dental Care Provider",
//     icon: "svg/Dentist-Office-icon.svg",
//   },
//   {
//     type: "Doctor's Clinic",
//     subtype: "Medical Consultation & Treatment",
//     icon: "svg/Doctor-clinic-icon.svg",
//   },
//   {
//     type: "Gym & Fitness Center",
//     subtype: "Exercise Facility & Training",
//     icon: "svg/Gym-icon.svg",
//   },
//   {
//     type: "Personal Trainer",
//     subtype: "Individual Fitness Coaching",
//     icon: "svg/Personal-Trainer-icon.svg",
//   },
//   {
//     type: "Web Design Agency",
//     subtype: "Website Creation & Development",
//     icon: "svg/Web-Design-Agency-icon.svg",
//   },
//   {
//     type: "Architect",
//     subtype: "Building Design Expert",
//     icon: "svg/Architect-icon.svg",
//   },
//   {
//     type: "Property Rental & Leasing Service",
//     subtype: "Property Rental Management",
//     icon: "svg/Property Rental & Leasing Service.svg",
//   },
//   {
//     type: "Construction Services",
//     subtype: "Building Construction & Repair",
//     icon: "svg/Construction Services.svg",
//   },
//   {
//     type: "Insurance Agency",
//     subtype: "Risk Protection Provider",
//     icon: "svg/Insurance Agency.svg",
//   },
//   {
//     type: "Old Age Home",
//     subtype: "Senior Living Facility",
//     icon: "svg/Old Age Home.svg",
//   },
//   {
//     type: "Travel Agency",
//     subtype: "Trip Planning & Booking",
//     icon: "svg/Travel Agency.svg",
//   },
//   {
//     type: "Ticket Booking",
//     subtype: "Travel Ticket Provider",
//     icon: "svg/Ticket Booking.svg",
//   },
//   {
//     type: "Accounting Services",
//     subtype: "Financial Record Management",
//     icon: "svg/Accounting Services.svg",
//   },
//   {
//     type: "Financial Planners",
//     subtype: "Wealth Management Advice",
//     icon: "svg/Financial Planners.svg",
//   },
//   {
//     type: "Beauty Parlour",
//     subtype: "Cosmetic Beauty Services",
//     icon: "svg/Beauty Parlour.svg",
//   },
//   {
//     type: "Nail Salon",
//     subtype: "Manicure/Pedicure Services",
//     icon: "svg/Nail Saloon.svg",
//   },
//   {
//     type: "Barber Studio/Shop",
//     subtype: "Men's Hair Grooming",
//     icon: "svg/Barber.svg",
//   },
//   {
//     type: "Hair Stylist",
//     subtype: "Professional Hair Care",
//     icon: "svg/Hair Stylist.svg",
//   },
//   {
//     type: "Bakery",
//     subtype: "Baked Goods Producer",
//     icon: "svg/Bakery.svg",
//   },
//   {
//     type: "Dry Cleaner",
//     subtype: "Garment Cleaning & Care",
//     icon: "svg/Dry Cleaner.svg",
//   },
//   {
//     type: "Cleaning Janitorial Service",
//     subtype: "Professional Cleaning Solutions",
//     icon: "svg/Cleaning Janitorial Service.svg",
//   },
//   {
//     type: "Other",
//     subtype: "More Ideas, More Impact",
//     icon: "svg/Web-Design-Agency-icon.svg",
//   },
// ];

// const avatars = {
//   Male: [
//     { img: "/images/Male-01.png" },
//     { img: "/images/Male-02.png" },
//     { img: "/images/Male-03.png" },
//     { img: "/images/Male-04.png" },
//     { img: "/images/Male-05.png" },
//   ],
//   Female: [
//     { img: "/images/Female-01.png" },
//     { img: "/images/Female-02.png" },
//     { img: "/images/Female-03.png" },
//     { img: "/images/Female-04.png" },
//     { img: "/images/Female-05.png" },
//     { img: "/images/Female-06.png" },
//   ],
// };

// const businessServices = [
//   {
//     type: "Restaurant",
//     subtype: "Food Service Establishment",
//     icon: "svg/Restaurant-icon.svg",
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
//     subtype: "Property Transaction Facilitator",
//     icon: "svg/Estate-icon.svg",
//     services: [
//       "Property Sales",
//       "Property Rentals",
//       "Property Viewings",
//       "Price Valuation",
//       "Legal Help",
//       "Other",
//     ],
//   },
//   {
//     type: "Saloon",
//     subtype: "Hair Styling & Grooming",
//     icon: "svg/Saloon-icon.svg",
//     services: [
//       "Haircuts",
//       "Hair Spa Treatments",
//       "Hair Straightening",
//       "Nail Extensions",
//       "Facials",
//       "Other",
//     ],
//   },
//   {
//     type: "Doctor's Clinic",
//     subtype: "Medical Consultation & Treatment",
//     icon: "svg/Doctor-clinic-icon.svg",
//     services: [
//       "General Checkups",
//       "Specialist Consultations",
//       "Vaccinations",
//       "Blood Tests",
//       "Health Screenings",
//       "Other",
//     ],
//   },
//   {
//     type: "Dry Cleaner",
//     subtype: "Garment Cleaning & Care",
//     icon: "svg/Dry -Cleaner-icon.svg",
//     services: [
//       "Garment Cleaning",
//       "Stain Removal",
//       "Clothing Alterations",
//       "Leather & Suede Cleaning",
//       "Other",
//     ],
//   },
//   {
//     type: "Web Design Agency",
//     subtype: "Website Creation & Development",
//     icon: "svg/Web-Design-Agency-icon.svg",
//     services: [
//       "Website Creation",
//       "Responsive Design",
//       "SEO Services",
//       "Website Maintenance",
//       "E-commerce Setup",
//       "Other",
//     ],
//   },
//   {
//     type: "Gym & Fitness Center",
//     subtype: "Exercise Facility & Training",
//     icon: "svg/Gym-icon.svg",
//     services: [
//       "Group Fitness Classes",
//       "Weight Training Equipment",
//       "Cardio Workouts",
//       "Personal Training Sessions",
//       "Other",
//     ],
//   },
//   {
//     type: "Marketing Agency",
//     subtype: "Business Promotion Strategies",
//     icon: "svg/Marketing Agency.svg",
//     services: [
//       "Social Media Advertising",
//       "Content Creation",
//       "Email Marketing",
//       "PPC Ads",
//       "Branding Strategy",
//       "Other",
//     ],
//   },
//   {
//     type: "Personal Trainer",
//     subtype: "Individual Fitness Coaching",
//     icon: "images/other.png",
//     services: [
//       "Personalized Workout Plans",
//       "One-on-One Training",
//       "Nutrition Guidance",
//       "Fitness Assessments",
//       "Other",
//     ],
//   },
//   {
//     type: "Architect",
//     subtype: "Building Design Expert",
//     icon: "svg/Architect-icon.svg",
//     services: [
//       "Residential Building Design",
//       "Commercial Building Plans",
//       "Renovation Planning",
//       "Permit Drawings",
//       "Site Planning",
//       "Project Management",
//       "Other",
//     ],
//   },
//   {
//     type: "Interior Designer",
//     subtype: "Indoor Space Beautifier",
//     icon: "images/other.png",
//     services: [
//       "Space Planning",
//       "Furniture Selection",
//       "Color Consultation",
//       "Lighting Design",
//       "Home Makeovers",
//       "Other",
//     ],
//   },
//   {
//     type: "Construction Services",
//     subtype: "Building Construction & Repair",
//     icon: "svg/Construction Services.svg",
//     services: [
//       "New Building Construction",
//       "Home Renovations",
//       "Project Supervision",
//       "Structural Repairs",
//       "Other",
//     ],
//   },
//   {
//     type: "Cleaning/Janitorial Service",
//     subtype: "Building Construction & Repair",
//     icon: "images/other.png",
//     services: [
//       "Office Cleaning",
//       "Deep Carpet Cleaning",
//       "Window Washing",
//       "Floor Polishing",
//       "Regular Maintenance",
//       "Other",
//     ],
//   },
//   {
//     type: "Transport Company",
//     subtype: "Freight Transportation Services",
//     icon: "images/other.png",
//     services: [
//       "Freight Shipping",
//       "Passenger Transport",
//       "Courier Services",
//       "Vehicle Rentals",
//       "Logistics Management",
//       "Other",
//     ],
//   },
//   {
//     type: "Landscaping Company",
//     subtype: "Outdoor Space Beautification",
//     icon: "images/other.png",
//     services: [
//       "Lawn Mowing & Maintenance",
//       "Garden Design",
//       "Tree Pruning & Removal",
//       "Irrigation Installation",
//       "Other",
//     ],
//   },
//   {
//     type: "Insurance Agency",
//     subtype: "Risk Protection Provider",
//     icon: "svg/Insurance Agency.svg",
//     services: [
//       "Life Insurance",
//       "Health Insurance",
//       "Car Insurance",
//       "Home Insurance",
//       "Business Insurance",
//       "Other",
//     ],
//   },
//   {
//     type: "Financial Services",
//     subtype: "Wealth Management Advice",
//     icon: "images/other.png",
//     services: [
//       "Investment Planning",
//       "Tax Preparation",
//       "Retirement Planning",
//       "Wealth Management",
//       "Loan Consulting",
//       "Other",
//     ],
//   },
//   {
//     type: "Accounting Services",
//     subtype: "Financial Record Management",
//     icon: "svg/Accounting Services.svg",
//     services: [
//       "Bookkeeping",
//       "Tax Filing",
//       "Payroll Services",
//       "Financial Auditing",
//       "Business Financial Reports",
//       "Other",
//     ],
//   },
//   {
//     type: "Car Repair & Garage",
//     subtype: "Vehicle Maintenance & Repair",
//     icon: "images/other.png",
//     services: [
//       "Oil & Filter Change",
//       "Brake Repairs",
//       "Engine Diagnostics",
//       "Tire Replacement",
//       "Battery Service",
//       "Other",
//     ],
//   },
//   {
//     type: "Boat Repair & Maintenance",
//     subtype: "Watercraft Upkeep & Repair",
//     icon: "images/other.png",
//     services: [
//       "Hull Repair",
//       "Engine Maintenance",
//       "Electrical System Repairs",
//       "Boat Cleaning",
//       "Winterizing Services",
//       "Other",
//     ],
//   },
//   {
//     type: "Dentist",
//     subtype: "Dental Care Provider",
//     icon: "images/other.png",
//     services: [
//       "Teeth",
//       "Cleaning",
//       "Teeth Whitening",
//       "Braces & Aligners",
//       "Root Canal",
//       "Tooth Extraction",
//       "Other",
//     ],
//   },
//   {
//     type: "Property Rental & Leasing Service",
//     subtype: "Property Rental Management",
//     icon: "svg/Property Rental & Leasing Service.svg",
//     services: [
//       "Tenant Screening",
//       "Lease Agreement Preparation",
//       "Rent Collection",
//       "Property Maintenance Coordination",
//       "Other",
//     ],
//   },
//   {
//     type: "Old Age Home",
//     subtype: "Senior Living Facility",
//     icon: "svg/Old Age Home.svg",
//     services: [
//       "Assisted Living",
//       "Meal Services",
//       "Housekeeping & Laundry",
//       "Recreational Activities",
//       "Physiotherapy",
//       "Emergency Support",
//       "Other",
//     ],
//   },
//   {
//     type: "Travel Agency",
//     subtype: "Trip Planning & Booking",
//     icon: "svg/Travel Agency.svg",
//     services: [
//       "Flight Booking",
//       "Hotel Reservations",
//       "Holiday Packages",
//       "Visa Assistance",
//       "Travel Insurance",
//       "Customized Itineraries",
//       "Cruise Bookings",
//       "Local Tours & Sightseeing",
//       "Car Rentals",
//       "Other",
//     ],
//   },
//   {
//     type: "Ticket Booking",
//     subtype: "Travel Ticket Provider",
//     icon: "svg/Ticket Booking.svg",
//     services: [
//       "Flight Tickets",
//       "Train Tickets",
//       "Bus Tickets",
//       "Movie Tickets",
//       "Event Tickets",
//       "Amusement Park Tickets",
//       "Concert & Show Tickets",
//       "Sports Tickets",
//       "Other",
//     ],
//   },
//   {
//     type: "Financial Planners",
//     subtype: "Wealth Management Advice",
//     icon: "svg/Financial Planners.svg",
//     services: [
//       "Retirement Planning",
//       "Investment Portfolio Management",
//       "Tax Planning",
//       "Budgeting & Expense Management",
//       "Estate Planning",
//       "Insurance Planning",
//       "Education Planning",
//       "Debt Management",
//       "Other",
//     ],
//   },
//   {
//     type: "Beauty Parlour",
//     subtype: "Cosmetic Beauty Services",
//     icon: "svg/Beauty Parlour.svg",
//     services: [
//       "Hair Cutting & Styling",
//       "Facials & Cleanups",
//       "Manicure & Pedicure",
//       "Bridal Makeup",
//       "Hair Coloring & Highlights",
//       "Waxing & Threading",
//       "Skin Treatments",
//       "Makeup for Events",
//       "Spa & Massage Services",
//       "Other",
//     ],
//   },
//   {
//     type: "Nail Salon",
//     subtype: "Manicure/Pedicure Services",
//     icon: "svg/Nail Saloon.svg",
//     services: [
//       "Manicure",
//       "Pedicure",
//       "Nail Art",
//       "Gel Nails",
//       "Acrylic Nails",
//       "Nail Extensions",
//       "Cuticle Care",
//       "Nail Repair & Removal",
//       "Hand & Foot Spa",
//       "Other",
//     ],
//   },
//   {
//     type: "Barber Studio/Shop",
//     subtype: "Men's Hair Grooming",
//     icon: "svg/Barber.svg",
//     services: [
//       "Haircut",
//       "Beard Trimming & Styling",
//       "Shaving & Grooming",
//       "Hair Coloring",
//       "Head Massage",
//       "Facial for Men",
//       "Scalp Treatment",
//       "Hair Wash & Styling",
//       "Kids Haircut",
//       "Other",
//     ],
//   },
//   {
//     type: "Hair Stylist",
//     subtype: "Professional Hair Care",
//     icon: "svg/Hair Stylist.svg",
//     services: [
//       "Hair Cutting & Trimming",
//       "Hair Styling",
//       "Blow Dry & Ironing",
//       "Hair Coloring & Highlights",
//       "Hair Spa",
//       "Keratin & Smoothening Treatments",
//       "Hair Extensions",
//       "Scalp Treatments",
//       "Bridal & Occasion Hairstyles",
//       "Other",
//     ],
//   },
//   {
//     type: "Bakery",
//     subtype: "Baked Goods Producer",
//     icon: "svg/Bakery.svg",
//     services: [
//       "Custom Cakes",
//       "Birthday & Wedding Cakes",
//       "Pastries & Cupcakes",
//       "Cookies & Biscuits",
//       "Bread & Buns",
//       "Chocolates & Desserts",
//       "Eggless & Sugar-Free Items",
//       "Bulk & Party Orders",
//       "Online Ordering & Delivery",
//       "Other",
//     ],
//   },
//   {
//     type: "Cleaning Janitorial Service",
//     subtype: "Professional Cleaning Solutions",
//     icon: "svg/Cleaning Janitorial Service.svg",
//     services: [
//       "Residential Cleaning",
//       "Commercial Office Cleaning",
//       "Deep Cleaning Services",
//       "Move-In/Move-Out Cleaning",
//       "Carpet & Upholstery Cleaning",
//       "Window Cleaning",
//       "Disinfection & Sanitization",
//       "Post-Construction Cleaning",
//       "Restroom Cleaning & Maintenance",
//       "Other",
//     ],
//   },
// ];

// const roles = [
//   {
//     title: "General Receptionist",
//     description:
//       "A general receptionist will pick calls, provide information on your services and products, take appointments and guide callers.",
//   },
//   {
//     title: "LEAD Qualifier",
//     description:
//       "A LEAD Qualifier handles inbound sales queries and helps identify potential leads for your business.",
//   },
// ];

// const AddAgentModal = ({
//   isOpen,
//   onClose,
//   allUsers,
//   onSubmit,
// }: AddAgentModalProps) => {
//   const [step, setStep] = useState(1);
//   const [userSearch, setUserSearch] = useState("");
//   const [businessSearch, setBusinessSearch] = useState("");
//   const [businessTypes, setBusinessTypes] = useState<BusinessType[]>(allBusinessTypes);
//   const [allServices, setAllServices] = useState<{ [key: string]: string[] }>({});
//   const [selectedType, setSelectedType] = useState("");
//   const [newBusinessType, setNewBusinessType] = useState("");
//   const [newService, setNewService] = useState("");
//   const [useWebsite, setUseWebsite] = useState(false);
//   const [listVoices, setListVoices] = useState([]);
//   const [form, setForm] = useState<any>({});
//   const [retellVoices, setRetellVoices] = useState<
//     { name: string; language: string }[]
//   >([]);
//   const [loadingVoices, setLoadingVoices] = useState(false);
//   const [voiceError, setVoiceError] = useState("");
//   const [filteredVoices, setFilteredVoices] = useState([]);
//   const audioRefs = useRef([]);
//   const [playingIdx, setPlayingIdx] = useState(null);
//   const [businessSize, setBusinessSize] = useState("");
//   const [agentNote, setAgentNote] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isWebsiteValid, setIsWebsiteValid] = useState<boolean | null>(null);
//   const [hasNoGoogleOrWebsite, setHasNoGoogleOrWebsite] = useState(false);

//   useEffect(() => {
//     const storedAgentRole = sessionStorage.getItem("agentRole");
//     const storedNote = sessionStorage.getItem("agentNote");

//     if (storedAgentRole) {
//       setSelectedRole(storedAgentRole);
//     }
//     if (storedNote) {
//       setAgentNote(storedNote);
//     }
//   }, []);

//   const URL = process.env.NEXT_PUBLIC_API_URL;

//   const fetchKnowledgeBaseName = async () => {
//     const name = await getKnowledgeBaseName();
//     console.log("Knowledge base name:", name);
//     localStorage.setItem("knowledgebaseName", name);
//   };

//   useEffect(() => {
//     fetchKnowledgeBaseName();
//   }, [localStorage.getItem("BusinessId")]);

//   const handleBusinessSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
//     const selectedSize = event.target.value as string;
//     setBusinessSize(selectedSize);
//     setForm({ ...form, businessSize: selectedSize });
//   };

//   const handleWebsiteBlur = async () => {
//     const url = form.businessUrl;
//     if (!url) return;

//     setIsVerifying(true);
//     try {
//       const result = await validateWebsite(url);
//       setIsWebsiteValid(result.valid);
//     } catch (err) {
//       console.error("Website verification error:", err);
//       setIsWebsiteValid(false);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   function extractPromptVariables(template, dataObject) {
//     const matches = [...template.matchAll(/{{(.*?)}}/g)];
//     const uniqueVars = new Set(matches.map(m => m[1].trim()));

//     const flatData = {};

//     function flatten(obj) {
//       for (const key in obj) {
//         const val = obj[key];
//         if (typeof val === "object" && val !== null && 'key' in val && 'value' in val) {
//           flatData[val.key.trim()] = val.value;
//         } else if (typeof val === "object" && val !== null) {
//           flatten(val);
//         }
//       }
//     }

//     flatten(dataObject);

//     return Array.from(uniqueVars).map(variable => ({
//       name: variable,
//       value: flatData[variable] ?? null,
//       status: true
//     }));
//   }

//   useEffect(() => {
//     const serviceMap: { [key: string]: string[] } = {};
//     businessServices.forEach((b) => {
//       serviceMap[b.type] = b.services;
//     });
//     setAllServices(serviceMap);
//   }, []);

//   useEffect(() => {
//     if (step === 4) {
//       const fetchVoices = async () => {
//         setLoadingVoices(true);
//         setVoiceError("");
//         try {
//           const data = await getRetellVoices();
//           setRetellVoices(data);
//         } catch (err) {
//           setVoiceError("Failed to load voices");
//           console.error("Error fetching voices:", err);
//         } finally {
//           setLoadingVoices(false);
//         }
//       };

//       fetchVoices();
//     }
//   }, [step]);

//   useEffect(() => {
//     if (!isOpen) {
//       setStep(1);
//       setForm({});
//       setSelectedType("");
//       setUserSearch("");
//       setBusinessSearch("");
//     }
//   }, [isOpen]);

//   const handleNext = async () => {
//     if (step === 1) {
//       if (!form.userId) return alert("Select a user");

//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/agent/check_user_free_agent/${form.userId}`
//         );

//         if (res.data.hasFreeAgent) {
//           return Swal.fire("This user already has a free agent.");
//         }
//       } catch (err) {
//         console.error("Error checking free agent:", err);
//         Swal.fire("Error", "Something went wrong while checking agent status.", "error");
//       }
//     }

//     if (step === 2 && !form.businessType)
//       return alert("Select at least one business type");
//     if (step === 3 && !form.businessName && !form.businessUrl)
//       return alert("Please fill one of the fields");
//     if (step === 4 && !form.language) return alert("Business name is required");

//     setStep((prev) => prev + 1);
//   };

//   const knowledgebaseName = localStorage.getItem("knowledgebaseName");
//   const handlePrevious = () => setStep(step - 1);

//   const handleSubmit = async () => {
//     try {
//       const {
//         language,
//         gender,
//         voice,
//         agentName,
//         avatar,
//         userId,
//         agentLanguage,
//         businessName,
//         address,
//         email,
//         about,
//         businessType,
//         services,
//         customBuisness,
//         role,
//       } = form;

//       const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//       const currentTime = new Date().toLocaleString("en-US", { timeZone });
//       const aboutBusinessForm = localStorage.getItem("businessonline") || form.about || "";

//       const filledPrompt = getAgentPrompt({
//         industryKey: businessType === "Other" ? customBuisness : businessType,
//         roleTitle: selectedRole,
//         agentName: form.selectedVoice?.voice_name,
//         agentGender: gender,
//         business: {
//           businessName: businessName || "Your Business",
//           email: email || "",
//           aboutBusiness: about || "",
//           address: address || "",
//         },
//         languageSelect: "Multi",
//         businessType,
//         aboutBusinessForm,
//         commaSeparatedServices: services?.join(", ") || "",
//         agentNote: "",
//         timeZone,
//         currentTime
//       });

//       const filledPrompt2 = getAgentPrompt({
//         industryKey: businessType === "Other" ? customBuisness : businessType,
//         roleTitle: selectedRole,
//         agentName: "{{AGENT NAME}}",
//         agentGender: "{{AGENT GENDER}}",
//         business: {
//           businessName: "{{BUSINESS NAME}}",
//           email: "{{BUSINESS EMAIL ID}}",
//           aboutBusiness: "{{MORE ABOUT YOUR BUSINESS}}",
//           address: "{{BUSINESS ADDRESS}}"
//         },
//         languageSelect: "{{LANGUAGE}}",
//         businessType: "{{BUSINESSTYPE}}",
//         aboutBusinessForm: {
//           businessUrl: "{{BUSINESS WEBSITE URL}}",
//           about: "{{MORE ABOUT YOUR BUSINESS}}"
//         },
//         commaSeparatedServices: "{{SERVICES}}",
//         agentNote: "{{AGENTNOTE}}",
//         timeZone: "{{TIMEZONE}}"
//       });

//       const promptVariablesList = extractPromptVariables(filledPrompt2, {
//         industryKey: businessType === "Other" ? customBuisness : businessType,
//         roleTitle: sessionStorage.getItem("agentRole"),
//         agentName: { key: "AGENT NAME", value: form.selectedVoice?.voice_name.split(" ")[0] || "" },
//         agentGender: { key: "AGENT GENDER", value: gender || "" },
//         business: {
//           businessName: { key: "BUSINESS NAME", value: form.businessName || "" },
//           email: { key: "BUSINESS EMAIL ID", value: form.email || "" },
//           aboutBusiness: {
//             key: "MORE ABOUT YOUR BUSINESS",
//             value: form.aboutBusiness || ""
//           },
//           address: { key: "BUSINESS ADDRESS", value: form.address || "" }
//         },
//         languageSelect: { key: "LANGUAGE", value: agentLanguage || "" },
//         businessType: { key: "BUSINESSTYPE", value: businessType || "" },
//         commaSeparatedServices: {
//           key: "SERVICES",
//           value: services?.join(", ") || ""
//         },
//         timeZone: {
//           key: "TIMEZONE",
//           value: timeZone || ""
//         },
//         aboutBusinessForm: {
//           businessUrl: {
//             key: "BUSINESS WEBSITE URL",
//             value: form.businessUrl || ""
//           }
//         },
//         currentTime: {
//           key: "current_time_[timezone]",
//           value: currentTime || ""
//         },
//         agentNote: {
//           key: "AGENTNOTE",
//           value: form.agentNote || ""
//         }
//       });

//       const agentConfig = {
//         version: 0,
//         model: "gemini-2.0-flash-lite",
//         model_temperature: 0,
//         model_high_priority: true,
//         tool_call_strict_mode: true,
//         general_prompt: filledPrompt,
//         general_tools: [
//           {
//             type: "end_call",
//             name: "end_call",
//             description: "End the call with user.",
//           },
//           {
//             type: "extract_dynamic_variable",
//             name: "extract_user_details",
//             description: "Extract the user's details like name, email, phone number, address, and reason for calling from the conversation",
//             variables: [
//               {
//                 type: "string",
//                 name: "email",
//                 description: "Extract the user's email address from the conversation"
//               },
//               {
//                 type: "number",
//                 name: "phone",
//                 description: "Extract the user's phone number from the conversation"
//               },
//               {
//                 type: "string",
//                 name: "address",
//                 description: "Extract the user's address from the conversation"
//               },
//               {
//                 type: "string",
//                 name: "reason",
//                 description: "Extract the user's reason for calling from the conversation"
//               },
//               {
//                 type: "string",
//                 name: "name",
//                 description: "Extract the user's name from the conversation"
//               },
//             ]
//           }
//         ],
//         states: [
//           {
//             name: "information_collection",
//             state_prompt: `Greet the user with the begin_message and assist with their query.

//                             If the user sounds dissatisfied (angry, frustrated, upset) or uses negative words (like "bad service", "unhappy", "terrible","waste of time"),
//                             ask them: "I'm sorry to hear that. Could you please tell me about your concern?"
//                             Analyze their response. 

//                             If the concern contains **spam, irrelevant or abusive content**
//                             (e.g., random questions, profanity, jokes), say:
//                             "I’m here to assist with service-related concerns. Could you please share your issue regarding our service?"
//                             and stay in this state.

//                             If the concern is **service-related** or **business** (e.g., staff, delay, poor support),
//                             transition to dissatisfaction_confirmation.

//                             If the user asks for an appointment (e.g., "appointment", "book", "schedule"),
//                             transition to appointment_booking.

//                             If the user is silent or unclear, say: "Sorry, I didn’t catch that. Could you please repeat?"
//                             If the user wants to end the call transition to end_call_state`,
//             edges: [
//               {
//                 destination_state_name: "dissatisfaction_confirmation",
//                 description: "User sounds angry or expresses dissatisfaction."
//               }
//             ]
//           },
//           {
//             name: "appointment_booking",
//             state_prompt: "## Task\nYou will now help the user book an appointment."
//           },
//           {
//             name: "dissatisfaction_confirmation",
//             state_prompt: `
//                           Say: "I'm sorry you're not satisfied. Would you like me to connect you to a team member? Please say yes or no."
//                           Wait for their response.

//                           If the user says yes, transition to call_transfer.
//                           If the user says no, transition to end_call_state.
//                           If the response is unclear, repeat the question once.
//                       `,
//             edges: [
//               {
//                 destination_state_name: "call_transfer",
//                 description: "User agreed to speak to team member."
//               },
//               {
//                 destination_state_name: "end_call_state",
//                 description: "User declined to speak to team member."
//               }
//             ],
//             tools: []
//           },
//           {
//             name: "call_transfer",
//             state_prompt: `
//                           Connecting you to a team member now. Please hold.
//                       `,
//             tools: [
//               {
//                 type: "transfer_call",
//                 name: "transfer_to_team",
//                 description: "Transfer the call to the team member.",
//                 transfer_destination: {
//                   type: "predefined",
//                   number: "{{business_Phone}}"
//                 },
//                 transfer_option: {
//                   type: "cold_transfer",
//                   public_handoff_option: {
//                     message: "Please hold while I transfer your call."
//                   }
//                 },
//                 speak_during_execution: true,
//                 speak_after_execution: true,
//                 failure_message: "Sorry, I couldn't transfer your call. Please contact us at {{business_email}} or call {{business_Phone}} directly."
//               }
//             ],
//             edges: []
//           },
//           {
//             name: "end_call_state",
//             state_prompt: `
//                           Politely end the call by saying: "Thank you for calling. Have a great day!"
//                       `,
//             tools: [
//               {
//                 type: "end_call",
//                 name: "end_call1",
//                 description: "End the call with the user."
//               }
//             ],
//             edges: []
//           }
//         ],
//         starting_state: "information_collection",
//         default_dynamic_variables: {
//           customer_name: "John Doe",
//           timeZone: timeZone,
//         },
//       };

//       const knowledgeBaseId = localStorage.getItem("knowledgeBaseId");
//       agentConfig.knowledge_base_ids = [knowledgeBaseId];

//       const llmRes = await axios.post(
//         `${URL}/api/agent/createAdmin/llm`,
//         agentConfig,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const llmId = llmRes.data.data.llm_id;

//       const finalAgentData = {
//         response_engine: { type: "retell-llm", llm_id: llmId },
//         voice_id: voice,
//         agent_name: form.selectedVoice?.voice_name || "Virtual Assistant",
//         language: "multi",
//         post_call_analysis_model: "gpt-4o-mini",
//         responsiveness: 1,
//         enable_backchannel: true,
//         interruption_sensitivity: 0.91,
//         normalize_for_speech: true,
//         webhook_url: `${process.env.NEXT_PUBLIC_API_URL}/api/agent/updateAgentCall_And_Mins_WebHook`,
//         backchannel_frequency: 0.7,
//         backchannel_words: [
//           "Got it",
//           "Yeah",
//           "Uh-huh",
//           "Understand",
//           "Ok",
//           "hmmm",
//         ],
//         post_call_analysis_data: [
//           {
//             type: "string",
//             name: "Detailed Call Summary",
//             description: "Summary of the customer call",
//           },
//           {
//             type: "enum",
//             name: "lead_type",
//             description: "Customer feedback",
//             choices: ["positive", "neutral", "negative"],
//           },
//         ],
//       };

//       const agentRes = await axios.post(
//         "https://api.retellai.com/create-agent",
//         finalAgentData,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
//           },
//         }
//       );

//       const agentId = agentRes.data.agent_id;

//       const dbPayload = {
//         userId: localStorage.getItem("AgentForuserId"),
//         agent_id: agentId,
//         llmId,
//         avatar,
//         agentVoice: voice,
//         knowledgeBaseId: localStorage.getItem("knowledgeBaseId"),
//         agentAccent: form.selectedVoice?.voice_accent || "American",
//         agentRole: selectedRole,
//         agentName: form.selectedVoice?.voice_name || "Virtual Assistant",
//         agentLanguageCode: language,
//         agentLanguage: agentLanguage,
//         dynamicPromptTemplate: filledPrompt,
//         rawPromptTemplate: filledPrompt2,
//         promptVariablesList: JSON.stringify(promptVariablesList),
//         agentGender: gender,
//         agentPlan: "free",
//         agentStatus: true,
//         businessId: localStorage.getItem("BusinessId"),
//         additionalNote: "",
//       };

//       const saveRes = await createAgent(dbPayload);
//       if (saveRes.status === 200 || saveRes.status === 201) {
//         alert("Agent created successfully!");
//         localStorage.removeItem("businessType");
//         localStorage.removeItem("agentCode");
//         onClose();
//       } else {
//         throw new Error("Agent creation failed.");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert("Agent creation failed. Please check console for details.");
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (
//         window.google?.maps?.places &&
//         document.getElementById("google-autocomplete")
//       ) {
//         const autocomplete = new window.google.maps.places.Autocomplete(
//           document.getElementById("google-autocomplete") as HTMLInputElement,
//           {
//             types: ["establishment"],
//             fields: [
//               "place_id",
//               "name",
//               "url",
//               "formatted_address",
//               "formatted_phone_number",
//             ],
//           }
//         );

//         autocomplete.addListener("place_changed", () => {
//           const place = autocomplete.getPlace();
//           setForm({
//             ...form,
//             businessName: place.name,
//             address: place.formatted_address,
//             phone: place.formatted_phone_number,
//           });
//         });

//         clearInterval(interval);
//       }
//     }, 300);
//   }, [form]);

//   const voiceAvatar = (provider: string) => {
//     switch (provider?.toLowerCase()) {
//       case "elevenlabs":
//         return "/avatars/11labs.png";
//       default:
//         return "/avatars/default-voice.png";
//     }
//   };

//   useEffect(() => {
//     if (retellVoices && form.gender) {
//       const filtered = retellVoices.filter(
//         (v) =>
//           v.provider === "elevenlabs" &&
//           v.gender?.toLowerCase() === form.gender.toLowerCase()
//       );
//       setFilteredVoices(filtered);
//     }
//   }, [retellVoices, form.gender]);

//   const togglePlay = (idx) => {
//     const thisAudio = audioRefs.current[idx];
//     if (!thisAudio) return;

//     if (playingIdx === idx) {
//       thisAudio.pause();
//       setPlayingIdx(null);
//       return;
//     }

//     if (playingIdx !== null) {
//       const prev = audioRefs.current[playingIdx];
//       prev?.pause();
//       prev.currentTime = 0;
//     }

//     thisAudio.play();
//     setPlayingIdx(idx);
//     thisAudio.onended = () => setPlayingIdx(null);
//   };

//   return (
//     <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Add Agent</DialogTitle>
//       <DialogContent>
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
//           {step === 1 && (
//             <Box>
//               <FormControl fullWidth>
//                 <InputLabel>Select User</InputLabel>
//                 <Select
//                   value={form.userId || ""}
//                   onChange={(e) => {
//                     setForm({ ...form, userId: e.target.value });
//                     localStorage.setItem("AgentForuserId", e.target.value);
//                   }}
//                 >
//                   <MenuItem disabled value="">
//                     Choose user
//                   </MenuItem>
//                   <Box sx={{ p: 1 }}>
//                     <TextField
//                       fullWidth
//                       placeholder="Search user..."
//                       value={userSearch}
//                       onChange={(e) => setUserSearch(e.target.value)}
//                       sx={{ mb: 1 }}
//                     />
//                   </Box>
//                   {allUsers
//                     .filter((u) => u.referredBy === localStorage.getItem("referralCode"))
//                     .filter((u) =>
//                       `${u.name} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
//                     )
//                     .map((u) => (
//                       <MenuItem key={u.id} value={u.id}>
//                         {u.name} ({u.email})
//                       </MenuItem>
//                     ))}
//                 </Select>
//               </FormControl>
//             </Box>
//           )}

//           {step === 2 && (
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               {/* BUSINESS TYPE */}
//               <FormControl fullWidth>
//                 <InputLabel>Business Type</InputLabel>
//                 <Select
//                   value={selectedType}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     if (val === "Other") {
//                       setSelectedType("Other");
//                       setForm((prev) => ({
//                         ...prev,
//                         businessType: "",
//                         businessSubtype: "",
//                         businessIcon: "",
//                         services: [],
//                         customBuisness: "",
//                       }));
//                       localStorage.setItem("businessType", "");
//                     } else {
//                       const selected = businessTypes.find((b) => b.type === val);
//                       setSelectedType(val);
//                       setForm((prev) => ({
//                         ...prev,
//                         businessType: val,
//                         businessSubtype: selected?.subtype || "",
//                         businessIcon: selected?.icon || "",
//                         services: [],
//                         customBuisness: "",
//                       }));
//                       localStorage.setItem("businessType", val);
//                     }
//                   }}
//                 >
//                   <MenuItem disabled value="">
//                     Select type
//                   </MenuItem>
//                   <Box sx={{ p: 1 }}>
//                     <TextField
//                       fullWidth
//                       placeholder="Search business..."
//                       value={businessSearch}
//                       onChange={(e) => setBusinessSearch(e.target.value)}
//                       sx={{ mb: 1 }}
//                     />
//                   </Box>
//                   {businessTypes
//                     .filter((b) =>
//                       `${b.type} ${b.subtype}`.toLowerCase().includes(businessSearch.toLowerCase())
//                     )
//                     .map((b) => (
//                       <MenuItem key={b.type} value={b.type}>
//                         {b.type} - {b.subtype}
//                       </MenuItem>
//                     ))}
//                   {!businessTypes.some((b) => b.type.toLowerCase() === "other") && (
//                     <MenuItem value="Other">Other</MenuItem>
//                   )}
//                 </Select>
//               </FormControl>

//               {selectedType === "Other" && (
//                 <TextField
//                   fullWidth
//                   placeholder="Add new business type"
//                   value={newBusinessType}
//                   onChange={(e) => setNewBusinessType(e.target.value)}
//                   onBlur={() => {
//                     const trimmed = newBusinessType.trim();
//                     if (
//                       trimmed &&
//                       !businessTypes.some((b) => b.type.toLowerCase() === trimmed.toLowerCase())
//                     ) {
//                       const newBusiness = {
//                         type: trimmed,
//                         subtype: "Custom",
//                         icon: "svg/Web-Design-Agency-icon.svg",
//                       };
//                       setBusinessTypes((prev) => [...prev, newBusiness]);
//                       setAllServices((prev) => ({
//                         ...prev,
//                         [trimmed]: [],
//                       }));
//                       setSelectedType(trimmed);
//                       localStorage.setItem("businessType", trimmed);
//                       setForm((prev) => ({
//                         ...prev,
//                         businessType: trimmed,
//                         businessSubtype: "Custom",
//                         businessIcon: newBusiness.icon,
//                         services: [],
//                         customBuisness: trimmed,
//                       }));
//                     }
//                     setNewBusinessType("");
//                   }}
//                 />
//               )}

//               {/* BUSINESS SIZE */}
//               <FormControl fullWidth>
//                 <InputLabel>Business Size</InputLabel>
//                 <Select
//                   value={businessSize}
//                   onChange={handleBusinessSizeChange}
//                 >
//                   <MenuItem disabled value="">
//                     Select Business Size
//                   </MenuItem>
//                   <MenuItem value="1 to 10 employees">1 to 10 employees</MenuItem>
//                   <MenuItem value="10 to 50 employees">10 to 50 employees</MenuItem>
//                   <MenuItem value="50 to 100 employees">50 to 100 employees</MenuItem>
//                   <MenuItem value="100 to 250 employees">100 to 250 employees</MenuItem>
//                   <MenuItem value="250 to 500 employees">250 to 500 employees</MenuItem>
//                   <MenuItem value="500 to 1000 employees">500 to 1000 employees</MenuItem>
//                   <MenuItem value="1000+ employees">1000+ employees</MenuItem>
//                 </Select>
//               </FormControl>

//               {/* SERVICES */}
//               <Box>
//                 <Typography variant="subtitle2">Select Services</Typography>
//                 {(allServices[selectedType] || []).map((service) => (
//                   <FormControlLabel
//                     key={service}
//                     control={
//                       <Checkbox
//                         checked={form.services?.includes(service)}
//                         onChange={() => {
//                           const current = form.services || [];
//                           const updated = current.includes(service)
//                             ? current.filter((s) => s !== service)
//                             : [...current, service];
//                           setForm((prev) => ({ ...prev, services: updated }));
//                         }}
//                       />
//                     }
//                     label={service}
//                   />
//                 ))}

//                 {selectedType && !allServices[selectedType]?.length && (
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
//                     <TextField
//                       fullWidth
//                       placeholder="Add new service"
//                       value={newService}
//                       onChange={(e) => setNewService(e.target.value)}
//                     />
//                     <IconButton
//                       onClick={() => {
//                         const trimmed = newService.trim();
//                         if (
//                           trimmed &&
//                           !(allServices[selectedType] || []).includes(trimmed)
//                         ) {
//                           const updatedServices = [
//                             ...(allServices[selectedType] || []),
//                             trimmed,
//                           ];
//                           setAllServices((prev) => ({
//                             ...prev,
//                             [selectedType]: updatedServices,
//                           }));
//                           const updatedFormServices = [
//                             ...(form.services || []),
//                             trimmed,
//                           ];
//                           setForm((prev) => ({
//                             ...prev,
//                             services: updatedFormServices,
//                             customServices: [
//                               ...(prev.customServices || []),
//                               trimmed,
//                             ],
//                           }));
//                         }
//                         setNewService("");
//                       }}
//                       color="primary"
//                     >
//                       ➕
//                     </IconButton>
//                   </Box>
//                 )}

//                 {allServices[selectedType]?.length > 0 &&
//                   !allServices[selectedType]?.includes("Other") && (
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={form.services?.includes("Other")}
//                           onChange={() => {
//                             const current = form.services || [];
//                             const updated = current.includes("Other")
//                               ? current.filter((s) => s !== "Other")
//                               : [...current, "Other"];
//                             setForm((prev) => ({ ...prev, services: updated }));
//                           }}
//                         />
//                       }
//                       label="Click for add more"
//                     />
//                   )}

//                 {form.services?.includes("Other") && (
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
//                     <TextField
//                       fullWidth
//                       placeholder="Add new service"
//                       value={newService}
//                       onChange={(e) => setNewService(e.target.value)}
//                     />
//                     <IconButton
//                       onClick={() => {
//                         const trimmed = newService.trim();
//                         if (
//                           trimmed &&
//                           !(allServices[selectedType] || []).includes(trimmed)
//                         ) {
//                           const updatedServices = [
//                             ...(allServices[selectedType] || []),
//                             trimmed,
//                           ];
//                           setAllServices((prev) => ({
//                             ...prev,
//                             [selectedType]: updatedServices,
//                           }));
//                           const updatedFormServices = [
//                             ...(form.services || []).filter((s) => s !== "Other"),
//                             trimmed,
//                           ];
//                           setForm((prev) => ({
//                             ...prev,
//                             services: updatedFormServices,
//                             customServices: [
//                               ...(prev.customServices || []),
//                               trimmed,
//                             ],
//                           }));
//                         }
//                         setNewService("");
//                       }}
//                       color="primary"
//                     >
//                       ➕
//                     </IconButton>
//                   </Box>
//                 )}
//               </Box>

//               {/* SUBMIT BUTTON FOR STEP 2 */}
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={async () => {
//                   const payload = {
//                     userId: form.userId,
//                     businessType: form.businessType || "Other",
//                     businessName: form.businessName || "",
//                     businessSize: businessSize || "",
//                     customBuisness:
//                       selectedType === "Other" ? newBusinessType || "Business" : "",
//                     buisnessService: form.services || [],
//                     customServices: form.customServices || [],
//                     buisnessEmail: form.email || "",
//                   };

//                   try {
//                     const res = await axios.post(
//                       `${URL}/api/businessDetails/create`,
//                       payload
//                     );
//                     localStorage.setItem("BusinessId", res.data.record.businessId);
//                     localStorage.setItem("agentCode", res.data.agentCode);
//                     setStep((prev) => prev + 1);
//                   } catch (error) {
//                     console.error("Error submitting business details:", error);
//                   }
//                 }}
//               >
//                 Save Business Details
//               </Button>
//             </Box>
//           )}

//           {step === 3 && (
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, border: 1, borderRadius: 2, p: 2 }}>
//               <TextField
//                 id="google-autocomplete"
//                 fullWidth
//                 placeholder="Search business via Google"
//                 value={form.googleBusiness || ""}
//                 onChange={(e) => {
//                   setForm({ ...form, googleBusiness: e.target.value });
//                   setHasNoGoogleOrWebsite(false);
//                 }}
//               />

//               <Box sx={{ position: 'relative' }}>
//                 <TextField
//                   fullWidth
//                   placeholder="Website URL include https://"
//                   value={form.businessUrl || ""}
//                   onChange={(e) => {
//                     setForm({ ...form, businessUrl: e.target.value });
//                     setIsWebsiteValid(null);
//                   }}
//                   onKeyDown={(e) => {
//                     const input = e.currentTarget as HTMLInputElement;
//                     const { key } = e;
//                     const { selectionStart, selectionEnd, value } = input;

//                     const fullSelection =
//                       selectionStart === 0 && selectionEnd === value.length;

//                     if (key === "Backspace" || key === "Delete") {
//                       if (fullSelection) {
//                         e.preventDefault();
//                         setForm((prev) => ({ ...prev, businessUrl: HTTPS_PREFIX }));
//                         requestAnimationFrame(() => {
//                           input.setSelectionRange(PREFIX_LEN, PREFIX_LEN);
//                         });
//                         return;
//                       }

//                       if (selectionStart <= PREFIX_LEN) {
//                         e.preventDefault();
//                         input.setSelectionRange(PREFIX_LEN, PREFIX_LEN);
//                       }
//                     }
//                   }}
//                   onClick={(e) => {
//                     const input = e.currentTarget as HTMLInputElement;
//                     if (input.selectionStart < PREFIX_LEN) {
//                       input.setSelectionRange(PREFIX_LEN, PREFIX_LEN);
//                     }
//                   }}
//                   onFocus={(e) => {
//                     const input = e.currentTarget as HTMLInputElement;
//                     if (!input.value.startsWith(HTTPS_PREFIX)) {
//                       setForm((prev) => ({
//                         ...prev,
//                         businessUrl: HTTPS_PREFIX + input.value,
//                       }));
//                       requestAnimationFrame(() => {
//                         input.setSelectionRange(PREFIX_LEN, PREFIX_LEN);
//                       });
//                     }
//                   }}
//                   onBlur={handleWebsiteBlur}
//                 />
//                 {form.businessUrl && (
//                   <Box sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
//                     {isVerifying ? (
//                       <CircularProgress size={20} />
//                     ) : isWebsiteValid === true ? (
//                       <CheckCircle color="success" />
//                     ) : isWebsiteValid === false ? (
//                       <Typography color="error">❌</Typography>
//                     ) : null}
//                   </Box>
//                 )}
//               </Box>

//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={hasNoGoogleOrWebsite}
//                     onChange={(e) => {
//                       const checked = e.target.checked;
//                       setHasNoGoogleOrWebsite(checked);
//                       if (checked) {
//                         setForm({
//                           ...form,
//                           googleBusiness: "",
//                           businessUrl: "",
//                         });
//                       }
//                     }}
//                   />
//                 }
//                 label="I don’t have Google Business or Website URL"
//               />

//               <Typography variant="body2" align="center" color="textSecondary">
//                 -- OR --
//               </Typography>

//               <TextField
//                 fullWidth
//                 placeholder="Business Name"
//                 value={form.businessName}
//                 onChange={(e) => setForm({ ...form, businessName: e.target.value })}
//               />
//               <TextField
//                 fullWidth
//                 placeholder="Address"
//                 value={form.address}
//                 onChange={(e) => setForm({ ...form, address: e.target.value })}
//               />
//               <TextField
//                 fullWidth
//                 placeholder="Phone"
//                 value={form.phone}
//                 onChange={(e) => setForm({ ...form, phone: e.target.value })}
//               />
//               <TextField
//                 fullWidth
//                 placeholder="Email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//               />
//               <TextareaAutosize
//                 minRows={4}
//                 placeholder="About your business"
//                 value={form.about}
//                 onChange={(e) => setForm({ ...form, about: e.target.value })}
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={async () => {
//                   const hasGoogle = form.googleBusiness?.trim();
//                   const hasWebsite = form.businessUrl?.trim();
//                   const manuallyFilled =
//                     form.businessName && form.address && form.phone && form.email;

//                   if (!hasNoGoogleOrWebsite && (!hasGoogle || !hasWebsite)) {
//                     alert(
//                       "Please enter both Google Business and Website URL, or check the 'I don't have...' option."
//                     );
//                     return;
//                   }

//                   if (hasNoGoogleOrWebsite && !manuallyFilled) {
//                     alert("Please fill out the manual form.");
//                     return;
//                   }

//                   const urls = [];
//                   if (hasWebsite) {
//                     urls.push(hasWebsite);
//                   }
//                   if (hasGoogle) {
//                     const query = encodeURIComponent(form.googleBusiness);
//                     const googleSearchUrl = `https://www.google.com/search?q=${query}`;
//                     urls.push(googleSearchUrl);
//                   }

//                   const textContent = [
//                     {
//                       title: "Business Details",
//                       text: `Name: ${form.businessName || "N/A"}
// Address: ${form.address || "N/A"}
// Phone: ${form.phone || "N/A"}
// Website: ${form.businessUrl || "N/A"}
// Email: ${form.email || "N/A"}
// About: ${form.about || "N/A"}
// Google: ${form.googleBusiness || "N/A"}`,
//                     },
//                   ];

//                   const knowledgeBaseName = localStorage.getItem("knowledgebaseName") || "My Business KB";
//                   const businessId = localStorage.getItem("BusinessId");

//                   try {
//                     const formData = new FormData();
//                     formData.append("knowledge_base_name", knowledgeBaseName);
//                     formData.append("enable_auto_refresh", "true");
//                     formData.append(
//                       "knowledge_base_texts",
//                       JSON.stringify(textContent)
//                     );

//                     if (urls.length > 0) {
//                       formData.append(
//                         "knowledge_base_urls",
//                         JSON.stringify(urls)
//                       );
//                     }

//                     const res = await axios.post(
//                       "https://api.retellai.com/create-knowledge-base",
//                       formData,
//                       {
//                         headers: {
//                           Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
//                           "Content-Type": "multipart/form-data",
//                         },
//                       }
//                     );

//                     const knowledgeBaseId = res?.data?.knowledge_base_id;
//                     if (knowledgeBaseId) {
//                       localStorage.setItem("knowledgeBaseId", knowledgeBaseId);

//                       await axios.patch(
//                         `${process.env.NEXT_PUBLIC_API_URL}/api/businessDetails/updateKnowledeBase/${businessId}`,
//                         {
//                           knowledge_base_texts: {
//                             businessName: form.businessName || "",
//                             address: form.address || "",
//                             phone: form.phone || "",
//                             website: form.businessUrl || "",
//                             rating: "",
//                             totalRatings: "",
//                             hours: "",
//                             businessStatus: "",
//                             categories: "",
//                             email: form.email || "",
//                             aboutBussiness: form.about || "",
//                           },
//                           googleUrl: form.googleBusiness || "",
//                           webUrl: form.businessUrl || "",
//                           aboutBusiness: form.about || "",
//                           additionalInstruction: "",
//                           agentId: localStorage.getItem("agent_id") || null,
//                           googleBusinessName: form.businessName || "",
//                           address1: form.address || "",
//                           businessEmail: form.email || "",
//                           businessName: form.businessName || "",
//                           phoneNumber: form.phone || "",
//                           isGoogleListing: !hasNoGoogleOrWebsite,
//                           isWebsiteUrl: !!hasWebsite,
//                           knowledge_base_id: knowledgeBaseId,
//                           knowledge_base_name: knowledgeBaseName,
//                         },
//                         {
//                           headers: {
//                             Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
//                             "Content-Type": "application/json",
//                           },
//                         }
//                       );
//                     }

//                     setStep((prev) => prev + 1);
//                   } catch (err) {
//                     console.error("Failed to create knowledge base:", err);
//                     alert("Error creating knowledge base. Try again later.");
//                   }
//                 }}
//               >
//                 Save & Continue
//               </Button>
//             </Box>
//           )}

//           {step === 4 && (
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <FormControl fullWidth>
//                 <InputLabel>Select Language</InputLabel>
//                 <Select
//                   value={form.language || ""}
//                   onChange={(e) =>
//                     setForm({
//                       ...form,
//                       language: e.target.value,
//                       agentLanguage: languages?.find((lang) => lang?.locale === e.target.value)?.name || e.target.value
//                     })
//                   }
//                 >
//                   <MenuItem disabled value="">
//                     Choose language
//                   </MenuItem>
//                   {languages.map((lang) => (
//                     <MenuItem key={lang.locale} value={lang.locale}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <img
//                           src={
//                             lang.locale
//                               ? `https://flagcdn.com/w20/${lang.locale.split("-")[1]?.toLowerCase() || "us"}.png`
//                               : "https://flagcdn.com/w20/us.png"
//                           }
//                           alt="flag"
//                           style={{ width: 20, height: 20 }}
//                         />
//                         {lang.name}
//                       </Box>
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl fullWidth>
//                 <InputLabel>Gender</InputLabel>
//                 <Select
//                   value={form.gender || ""}
//                   onChange={(e) =>
//                     setForm((prev) => ({
//                       ...prev,
//                       gender: e.target.value,
//                       avatar: "",
//                     }))
//                   }
//                 >
//                   <MenuItem disabled value="">
//                     Choose gender
//                   </MenuItem>
//                   <MenuItem value="Male">Male</MenuItem>
//                   <MenuItem value="Female">Female</MenuItem>
//                 </Select>
//               </FormControl>

//               <Box>
//                 <Typography variant="subtitle2">Voice</Typography>
//                 {filteredVoices.length === 0 ? (
//                   <Typography variant="body2" color="textSecondary">
//                     No voices found for gender: {form.gender}
//                   </Typography>
//                 ) : (
//                   <FormControl fullWidth>
//                     <InputLabel>Choose voice</InputLabel>
//                     <Select
//                       value={form.voice || ""}
//                       onChange={(e) => {
//                         const selectedVoice = filteredVoices.find(
//                           (voice) => voice.voice_id === e.target.value
//                         );
//                         setForm({
//                           ...form,
//                           voice: e.target.value,
//                           selectedVoice,
//                           agentName: selectedVoice?.voice_name
//                         });
//                       }}
//                     >
//                       <MenuItem disabled value="">
//                         Choose voice
//                       </MenuItem>
//                       {filteredVoices.map((voice, index) => (
//                         <MenuItem key={index} value={voice.voice_id}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
//                             <Box>
//                               <Typography variant="body2">{voice.voice_name}</Typography>
//                               <Typography variant="caption" color="textSecondary">
//                                 {voice.accent ? `${voice.accent} Accent` : voice.provider}
//                               </Typography>
//                             </Box>
//                             <IconButton
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 togglePlay(index);
//                               }}
//                             >
//                               {playingIdx === index ? (
//                                 <Pause />
//                               ) : (
//                                 <PlayArrow />
//                               )}
//                             </IconButton>
//                             <audio
//                               ref={(el) => (audioRefs.current[index] = el)}
//                               style={{ display: 'none' }}
//                             >
//                               <source src={voice.preview_audio_url} type="audio/mpeg" />
//                             </audio>
//                           </Box>
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 )}
//               </Box>

//               <FormControl fullWidth>
//                 <InputLabel>Avatar</InputLabel>
//                 <Select
//                   value={form.avatar || ""}
//                   onChange={(e) => setForm({ ...form, avatar: e.target.value })}
//                   disabled={!form.gender}
//                 >
//                   <MenuItem disabled value="">
//                     Choose avatar
//                   </MenuItem>
//                   {form.gender &&
//                     avatars[form.gender]?.map((av, index) => (
//                       <MenuItem key={index} value={av.img}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <img
//                             src={av.img}
//                             alt={`Avatar ${index + 1}`}
//                             style={{ width: 24, height: 24, borderRadius: '50%' }}
//                           />
//                           Avatar {index + 1}
//                         </Box>
//                       </MenuItem>
//                     ))}
//                 </Select>
//                 {!form.gender && (
//                   <Typography variant="body2" color="textSecondary">
//                     Select gender to choose avatar
//                   </Typography>
//                 )}
//               </FormControl>

//               <FormControl component="fieldset">
//                 <FormLabel component="legend">Role</FormLabel>
//                 <RadioGroup
//                   value={selectedRole}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                 >
//                   {roles.map((role, index) => (
//                     <FormControlLabel
//                       key={index}
//                       value={role.title}
//                       control={<Radio />}
//                       label={
//                         <Box>
//                           <Typography variant="body2">{role.title}</Typography>
//                           <Typography variant="caption" color="textSecondary">
//                             {role.description}
//                           </Typography>
//                         </Box>
//                       }
//                     />
//                   ))}
//                 </RadioGroup>
//               </FormControl>
//             </Box>
//           )}
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         {step > 1 && (
//           <Button variant="outlined" color="primary" onClick={handlePrevious}>
//             Previous
//           </Button>
//         )}
//         {step < 4 && (
//           <Button variant="contained" color="primary" onClick={handleNext}>
//             Next
//           </Button>
//         )}
//         {step === 4 && (
//           <Button variant="contained" color="primary" onClick={handleSubmit}>
//             Submit
//           </Button>
//         )}
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddAgentModal;

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
  Tooltip
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
function getServicesByType(type) {
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
  '.xml'
];
const maxFilesPerKB = 25;
const maxFileSizeMB = 50; // 50MB
const maxCsvRows = 1000;
const maxCsvCols = 50;

// ---------------- Main Component ----------------
export default function PartnerAgentGeneralInfo({ open, onClose, onSubmit }) {
  useEffect(() => {
    if (open) {
      setErrors({});
      setActiveStep(0);
      setApiStatus({ status: null, message: null });
      setVoices([]);
      setPlayingVoiceId(null);
      setFilteredVoices([]);
      // fetchUsers(); // Uncomment to enable API call for fetching users
    }
  }, [open]);

  const [formData, setFormData] = useState({
    selectedUser: '', // For user selection
    agentName: '',
    corePurpose: '',
    industry: '',
    service: [],
    customService: '',
    businessName: '',
    businessWebsite: '',
    businessPhone: '',
    businessAddress: [{
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
    }],
    agentGender: '',
    agentAvatar: '',
    agentLanguage: '',
    agentLanguageCode: '',
    agentVoice: '',
    customServices: [''],
    agentAccent: '',
    intents: [],
    KnowledgeBase: [
      {
        title: '',
        description: '',
        files: {
          brochure: [],
          tutorial: [],
          troubleshooting: [],
          other: []
        },
        urls: []
      }
    ]
  });

  const [users, setUsers] = useState(dummyUsers); // Initialize with dummy users
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [apiStatus, setApiStatus] = useState({ status: null, message: null });
  const [voices, setVoices] = useState([]);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [audio, setAudio] = useState(null);
  const audioRef = useRef(null);
  const [filteredVoices, setFilteredVoices] = useState([]);
  const token = localStorage.getItem('authToken');
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
  const agentTypes = ['Inbound', 'Outbound', 'Both'];
  const genders = ['Male', 'Female'];
  const steps = ['Agent Details', 'Business Details', 'Agent Configuration'];

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

  // Fetch users from API (kept for future use)
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data || []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to fetch users',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    if (voices && formData.agentGender) {
      const filtered = voices.filter(
        (voice) => voice.provider === 'elevenlabs' && voice?.gender?.toLocaleLowerCase() === formData?.agentGender?.toLocaleLowerCase()
      );
      setFilteredVoices(filtered || []);
    }
  }, [formData.agentGender, voices]);

  useEffect(() => {
    if (formData.agentGender && formData.agentLanguage) {
      const fetchVoices = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/fetchAgentVoiceDetailsFromRetell2`, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
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

  const handleCustomServiceChange = (event, index) => {
    const newCustomServices = [...formData.customServices];
    newCustomServices[index] = event.target.value;
    setFormData({ ...formData, customServices: newCustomServices });

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
      customServices: Array.isArray(errors.customServices) ? [...errors.customServices, ''] : ['']
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

    if (name === 'agentVoice') {
      const selectedVoice = voices.find((v) => v.voice_id === value);
      setFormData({
        ...formData,
        agentVoice: selectedVoice?.voice_id || '',
        agentAccent: selectedVoice?.accent || ''
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
        agentAccent: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
        ...(name === 'agentGender' ? { agentAvatar: '', agentVoice: '', agentAccent: '' } : {})
      });
    }
  };

  const handleServiceChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      service: value,
      customServices: value.includes('Other') ? formData.customServices : ['']
    });

    setErrors({
      ...errors,
      service: value.length === 0 ? 'At least one service is required' : '',
      customServices: value.includes('Other') ? formData.customServices.map(validateCustomService) : []
    });
  };

  const handleAvatarSelect = (avatarImg) => {
    setFormData({
      ...formData,
      agentAvatar: avatarImg
    });
  };

  const validateCustomService = (value) => {
    return value.trim() === '' ? 'Custom service cannot be empty' : '';
  };

  const validateStep = (step) => {
    let newErrors = {};
    if (step === 0) {
      if (!formData.selectedUser) newErrors.selectedUser = 'Please select a user';
      if (!formData.agentName) newErrors.agentName = 'Agent Name is required';
      if (!formData.agentGender) newErrors.agentGender = 'Agent Gender is required';
      if (!formData.agentAvatar) newErrors.agentAvatar = 'Please select an avatar';
    } else if (step === 1) {
      if (!formData.industry) newErrors.industry = 'Industry is required';
      if (formData.service.length === 0) newErrors.service = 'At least one Business Service/Product is required';
      if (formData.service.includes('Other') && !formData.customServices) newErrors.customServices = 'Please specify your service';
      if (!formData.businessWebsite) newErrors.businessWebsite = 'Website is required';
      if (!formData.businessPhone) newErrors.businessPhone = 'Phone number is required';
    } else if (step === 2332) {
      if (formData.service.length === 0) {
        newErrors.service = 'At least one Business Service/Product is required';
      } else {
        const idx = 0;
        const service = formData.service[idx];
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
      }
    } else if (step === 2) {
      // if (!formData.agentType) newErrors.agentType = 'Agent Type is required';
      if (!formData.agentLanguage) newErrors.agentLanguage = 'Agent Language is required';
      if (!formData.agentVoice) newErrors.agentVoice = 'Agent Voice is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // AGENT CREATION PROCESS
  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      const finalData = {
        ...formData,
        userId: formData.selectedUser,
        agentAccent: formData.agentAccent,
        service: formData.service.map((s) => (s === 'Other' ? formData.customService : s)),
      };
      try {
        setApiStatus({ status: null, message: null });
        setIsSubmitting(true);
        const formDataToSend = new FormData();

        // Normal fields
        formDataToSend.append('selectedUser', formData.selectedUser);
        formDataToSend.append('agentName', formData.agentName);
        formDataToSend.append('businessName', formData.businessName);
        formDataToSend.append('businessWebsite', formData.businessWebsite);
        formDataToSend.append('businessPhone', formData.businessPhone);
        formDataToSend.append('businessAddress', JSON.stringify(formData.businessAddress));
        formDataToSend.append('agentType', formData.agentType);
        formDataToSend.append('agentGender', formData.agentGender);
        formDataToSend.append('agentAvatar', formData.agentAvatar);
        formDataToSend.append('agentLanguage', formData.agentLanguage);
        formDataToSend.append('agentLanguageCode', formData.agentLanguageCode);
        formDataToSend.append('agentVoice', formData.agentVoice);
        formDataToSend.append('agentAccent', formData.agentAccent);
        formDataToSend.append('industry', formData.industry);
        formDataToSend.append('service', JSON.stringify(formData.service));
        formDataToSend.append('customService', formData.customService);
        formDataToSend.append('customServices', JSON.stringify(formData.customServices));
        formDataToSend.append('corePurpose', formData.corePurpose);
        formDataToSend.append('userId', formData.selectedUser);

        // Intents (without files)
        const intentsWithoutFiles = formData.intents.map(({ file, ...rest }) => rest);
        formDataToSend.append('intents', JSON.stringify(intentsWithoutFiles));

        // Intent files
        formData.intents.forEach((intent, idx) => {
          if (intent.files && intent.files.length > 0) {
            intent.files.forEach((file, fileIdx) => {
              formDataToSend.append(`intentFiles[${idx}]`, file);
            });
          }
        });

        // KnowledgeBase metadata
        const kbWithoutFiles = formData.KnowledgeBase.map(({ files, ...rest }) => rest);
        formDataToSend.append('KnowledgeBase', JSON.stringify(kbWithoutFiles));

        // KnowledgeBase files with readable names
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

        for (let [key, value] of formDataToSend.entries()) {
          console.log('FormData entry:', key, value);
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/enterpriseAgent/createEnterpriseAgent`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response) {
          setSnackbar({
            open: true,
            message: response?.data?.message,
            severity: 'success'
          });
          setTimeout(() => {
            handleClose();
          }, 1500);
          setApiStatus({ status: 'success', message: response?.data?.message });
          setTimeout(() => {
            onClose();
            setIsSubmitting(false);
            onSubmit();
          }, 1000);
        }
      } catch (error) {
        setApiStatus({
          status: 'error',
          message: error.message || 'An error occurred during submission'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleIntentChange = (event) => {
    const selected = event.target.value;

    const updatedIntents = selected.map((intent) => {
      if (intent === 'Other') {
        const existingOther = formData.intents.find((i) => i.type === 'Other');
        return existingOther || { type: 'Other', name: '', description: '', file: null, urls: [] };
      }
      const existing = formData.intents.find((i) => i.type === intent);
      return existing || { type: intent, name: '', description: '', file: null, urls: [] };
    });

    setFormData((prev) => ({
      ...prev,
      intents: updatedIntents
    }));
  };

  const handleAddOther = () => {
    setFormData((prev) => ({
      ...prev,
      intents: [...prev.intents, { type: 'Other', id: Date.now(), name: '', description: '', file: null, urls: [] }]
    }));
  };

  const handleIntentFieldChange = (index, field, value) => {
    const updatedIntents = [...formData.intents];
    updatedIntents[index][field] = value;
    setFormData((prev) => ({ ...prev, intents: updatedIntents }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`intent_${index}_${field}`];
      return newErrors;
    });
  };

  const handleRemoveIntent = (index) => {
    const updatedIntents = [...formData.intents];
    updatedIntents.splice(index, 1);
    setFormData((prev) => ({ ...prev, intents: updatedIntents }));
  };

  const handleAddUrl = async (intentIndex) => {
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

  const handleRemoveUrl = (intentIndex, urlIndex) => {
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
  const handleIndustryChange = (e) => {
    const selectedIndustry = e.target.value;
    // if (selectedIndustry !== 'Electronics & Home Appliances') {
    //   setSnackbar({
    //     open: true,
    //     message: 'Coming Soon!',
    //     severity: 'info'
    //   });
    //   return;
    // }
    handleChange(e);
    setFormData({
      ...formData,
      industry: selectedIndustry,
      service: [],
      customServices: ''
    });
  };

  const handleFileUploadServices = async (index, type, e) => {
    const files = Array.from(e.target.files);
    const kbCopy = [...formData.KnowledgeBase];
    kbCopy[index].files = kbCopy[index].files || {};
    kbCopy[index].files[type] = kbCopy[index].files[type] || [];

    let newErrors = { ...errors };
    newErrors[`service_${index}_files`] = '';

    for (let file of files) {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
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

  const ensureKnowledgeBase = (index, intent) => {
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
            other: []
          },
          urls: [],
          newUrl: ''
        };
      } else {
        kbCopy[index].title = intent || '';
      }
      return { ...prev, KnowledgeBase: kbCopy };
    });
  };

  const handleAddUrlServices = async (intentIndex, inputValue) => {
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

  const handleRemoveUrlServices = (intentIndex, urlIndex) => {
    setFormData((prev) => {
      const kbCopy = [...prev.KnowledgeBase];
      kbCopy[intentIndex].urls.splice(urlIndex, 1);
      return { ...prev, KnowledgeBase: kbCopy };
    });
  };

  const parseAddressComponents = (data) => {
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

  const handleAddressDataChange = (index, data) => {
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

  const handleRemoveAddress = (index) => {
    setFormData((prev) => ({
      ...prev,
      businessAddress: prev.businessAddress.filter((_, i) => i !== index),
    }));
  };

  const handleOfficeTypeChange = (index, value) => {
    setFormData((prev) => {
      const updatedAddresses = [...prev.businessAddress];
      updatedAddresses[index].officeType = value;
      return { ...prev, businessAddress: updatedAddresses };
    });
  };

  const handleAddressFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedAddresses = [...prev.businessAddress];
      updatedAddresses[index].addressDetails = {
        ...updatedAddresses[index].addressDetails,
        [field]: value,
      };
      return { ...prev, businessAddress: updatedAddresses };
    });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            {/* User Selection */}
            <Stack spacing={1}>
              <InputLabel>Select User</InputLabel>
              <Select
                name="selectedUser"
                value={formData.selectedUser}
                onChange={handleChange}
                error={!!errors.selectedUser}
                fullWidth
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{errors.selectedUser}</FormHelperText>
            </Stack>

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

            {/* Agent Gender */}
            <Stack spacing={1}>
              <InputLabel>Agent Gender</InputLabel>
              <Select name="agentGender" value={formData.agentGender} onChange={handleChange} error={!!errors.agentGender} fullWidth>
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
                      key={avatar.img}
                      onClick={() => handleAvatarSelect(avatar.img)}
                      sx={{
                        cursor: 'pointer',
                        border: formData.agentAvatar === avatar.img ? '2px solid #1976d2' : '2px solid transparent',
                        borderRadius: 2,
                        p: 0.5,
                        transition: 'border 0.2s ease-in-out'
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
      case 1:
        return (
          <Stack spacing={3}>
            {/* Industry */}
            <Stack spacing={1}>
              <InputLabel>Industry</InputLabel>
              <Select name="industry" value={formData.industry} onChange={handleIndustryChange} error={!!errors.industry} fullWidth>
                {allBusinessTypes.map((ind) => (
                  <MenuItem key={ind.type} value={ind.type}>
                    {ind.type}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{errors.industry}</FormHelperText>
              {selectedIndustryData && (
                <Stack direction="row" spacing={1} alignItems="center" mt={1} sx={{ p: 1, borderRadius: 2, bgcolor: '#f1f5f9' }}>
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
                      {index > 1 && (
                        <Button variant="outlined" color="error" onClick={() => handleRemoveCustomService(index)}>
                          Remove
                        </Button>
                      )}
                    </Stack>
                  ))}
                  <Button variant="contained" onClick={handleAddCustomService} sx={{ alignSelf: 'flex-start' }}>
                    Add Another Service
                  </Button>
                </Stack>
              )}
            </Stack>

            {/* Business Name */}
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

            {/* Business Website */}
            <Stack spacing={1}>
              <InputLabel>Business Website</InputLabel>
              <TextField
                name="businessWebsite"
                placeholder="E.g., https://www.example.com"
                value={formData.businessWebsite}
                onChange={handleChange}
                error={!!errors.businessWebsite}
                helperText={errors.businessWebsite}
                fullWidth
              />
            </Stack>

            {/* Business Phone Number */}
            <Stack spacing={1}>
              <InputLabel>Business Phone Number</InputLabel>
              <TextField
                name="businessPhone"
                placeholder="E.g., +1234567890"
                value={formData.businessPhone}
                onChange={handleChange}
                error={!!errors.businessPhone}
                helperText={errors.businessPhone}
                fullWidth
              />
            </Stack>

            {/* Business Addresses */}
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
            </Stack>
          </Stack>
        );
      case 2:
      //   return (
      //     <>
      //       <Stack spacing={1}>
      //         <InputLabel>Knowledge Base</InputLabel>
      //       </Stack>
      //       {formData.service.map((intent, index) => (
      //         <Paper key={intent} sx={{ p: 2, mt: 2 }} variant="outlined">
      //           <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      //             <Typography variant="subtitle1" sx={{ display: 'inline-block', mr: 2, wordBreak: 'break-word' }} gutterBottom>
      //               {intent}
      //             </Typography>
      //           </Stack>
      //           <Stack direction="row" alignItems="center" spacing={1}>
      //             <TextField
      //               label="Description"
      //               multiline
      //               rows={3}
      //               value={formData.KnowledgeBase[index]?.description || ''}
      //               fullWidth
      //               margin="normal"
      //               error={!!errors[`service_${index}_description`]}
      //               helperText={errors[`service_${index}_description`] || ''}
      //               onChange={(e) => {
      //                 ensureKnowledgeBase(index, intent);
      //                 const value = e.target.value;
      //                 setFormData((prev) => {
      //                   const kbCopy = [...prev.KnowledgeBase];
      //                   kbCopy[index].description = value;
      //                   return { ...prev, KnowledgeBase: kbCopy };
      //                 });
      //               }}
      //             />
      //             <Tooltip title="Explain in detail what this description is for." arrow>
      //               <IconButton>
      //                 <InfoOutlinedIcon fontSize="small" />
      //               </IconButton>
      //             </Tooltip>
      //           </Stack>
      //           <br />
      //           {['brochure', 'tutorial', 'troubleshooting', 'other'].map((type) => (
      //             <Stack key={type} direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
      //               <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
      //                 Upload {type.charAt(0).toUpperCase() + type.slice(1)} File
      //                 <input type="file" hidden multiple onChange={(e) => handleFileUploadServices(index, type, e)} />
      //               </Button>
      //               <Tooltip
      //                 title={`Upload ${type} files (Allowed: ${allowedFileTypes.join(', ')}, Max: ${maxFilesPerKB} files, ≤ ${maxFileSizeMB}MB each${type === 'csv' || type === 'tsv' || type === 'xls' || type === 'xlsx' ? `, Max rows: ${maxCsvRows}, Max columns: ${maxCsvCols}` : ''})`}
      //                 arrow
      //               >
      //                 <IconButton>
      //                   <InfoOutlinedIcon fontSize="small" />
      //                 </IconButton>
      //               </Tooltip>
      //               {formData.KnowledgeBase[index]?.files[type]?.length > 0 && (
      //                 <Typography variant="body2">
      //                   Selected: {formData.KnowledgeBase[index].files[type].map((f) => f.name).join(', ')}
      //                 </Typography>
      //               )}
      //             </Stack>
      //           ))}
      //           {errors[`service_${index}_files`] && (
      //             <Typography variant="body2" color="error" sx={{ mt: 1 }}>
      //               {errors[`service_${index}_files`]}
      //             </Typography>
      //           )}
      //           <br />
      //           <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      //             <TextField
      //               label="Add URL"
      //               size="small"
      //               value={formData.KnowledgeBase[index]?.newUrl || ''}
      //               sx={{ height: '40px', minWidth: '300px' }}
      //               onChange={(e) => {
      //                 let value = e.target.value;
      //                 if (value && !/^https?:\/\//i.test(value)) {
      //                   value = `https://${value.replace(/^https?:\/\//i, '')}`;
      //                 }
      //                 setFormData((prev) => {
      //                   const kbCopy = [...prev.KnowledgeBase];
      //                   kbCopy[index].newUrl = value;
      //                   return { ...prev, KnowledgeBase: kbCopy };
      //                 });
      //               }}
      //               onKeyDown={(e) => {
      //                 if (e.key === 'Enter') {
      //                   e.preventDefault();
      //                   handleAddUrlServices(index, e.currentTarget.value);
      //                 }
      //               }}
      //               error={!!formData.KnowledgeBase[index]?.errorMsg || !!errors[`service_${index}_urls`]}
      //               helperText={formData.KnowledgeBase[index]?.errorMsg || errors[`service_${index}_urls`] || ''}
      //             />
      //             <Tooltip title="Add a URL the agent can reference." arrow>
      //               <IconButton>
      //                 <InfoOutlinedIcon fontSize="small" />
      //               </IconButton>
      //             </Tooltip>
      //             <Button
      //               variant="contained"
      //               sx={{ height: '40px', minWidth: '80px' }}
      //               disabled={!formData.KnowledgeBase[index]?.newUrl?.trim()}
      //               onClick={() => handleAddUrlServices(index)}
      //             >
      //               Add
      //             </Button>
      //           </Stack>
      //           <br />
      //           <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
      //             {formData.KnowledgeBase[index]?.urls?.map((url, urlIndex) => (
      //               <Chip key={urlIndex} label={url} onDelete={() => handleRemoveUrlServices(index, urlIndex)} sx={{ mb: 1 }} />
      //             ))}
      //           </Stack>
      //         </Paper>
      //       ))}
      //       {errors.generalService && (
      //         <Typography variant="body2" color="error" sx={{ mt: 2 }}>
      //           {errors.generalService}
      //         </Typography>
      //       )}
      //     </>
      //   );
      // case 3:
        return (
          <Stack spacing={3}>
            {/* <Stack spacing={1}>
              <InputLabel>Agent Type</InputLabel>
              <Select name="agentType" value={formData.agentType} onChange={handleChange} error={!!errors.agentType} fullWidth>
                {agentTypes.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{errors.agentType}</FormHelperText>
            </Stack> */}
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
                        if (lang.locale == 'es-419') {
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
                          {playingVoiceId === voice.voice_id ? <PauseIcon fontSize="small" /> : <CustomPlayIcon fontSize="small" />}
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

  const handleClose = () => {
    onClose();
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
            boxShadow: 'none'
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: (theme) => theme.palette.grey[600]
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
            <Button disabled={activeStep === 0} onClick={handleBack} sx={{ textTransform: 'none' }}>
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              {isSubmitting && activeStep === steps.length - 1 ? 'Submitting...' : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
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