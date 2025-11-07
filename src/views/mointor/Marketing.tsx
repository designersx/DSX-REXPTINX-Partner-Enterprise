// 'use client';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Toaster, toast } from 'react-hot-toast';
// import { Copy, X, Pencil, Trash2 } from 'lucide-react';
// import { QRCodeCanvas } from 'qrcode.react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import Swal from 'sweetalert2';

// interface PartnerDetails {
//   name: string;
//   email: string;
//   phone: string;
//   referalName: string;
// }

// type EditTab = 'personal' | 'testimonials' | 'about';

// type Testimonial = {
//   id: number;
//   quote: string;
//   author: string;
//   roleTitle?: string | null;
//   imagePath?: string | null;
//   createdAt?: string;
// };

// const toApiFileUrl = (p?: string) => {
//   if (!p) return '';
//   if (/^https?:\/\//i.test(p)) return p;
//   const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
//   const cleaned = p.replace(/^(\.\.\/)+public/, '').replace(/^\/+/, '');
//   return `${base}/${cleaned}`;
// };

// export function ReferralLink() {
//   const [fullLink, setFullLink] = useState('');
//   const [partnerWebsite, setPartnerWebsite] = useState('');
//   const [referralName, setReferralName] = useState('');
//   const [partnerName, setPartnerName] = useState('');
//   const [partnerEmail, setPartnerEmail] = useState('');
//   const [referralCode, setReferralCode] = useState('');
//   const [phone, setPhone] = useState('');
//   const [isFreeSignup, setIsFreeSignup] = useState(false);
//   const [websiteTitle, setWebsiteTitle] = useState('My Partner Website');
//   const [websiteImage, setWebsiteImage] = useState('https://placehold.co/600x400');
//   const [mode, setMode] = useState<'preview' | 'edit'>('preview');
//   const [activeTab, setActiveTab] = useState<'referralLink' | 'websiteUrl' | 'businessCard'>('referralLink');
//   const [showPreview, setShowPreview] = useState(false);

//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editTab, setEditTab] = useState<EditTab>('personal');
//   const [saving, setSaving] = useState(false);

//   const [personalForm, setPersonalForm] = useState({ name: '', email: '', phone: '' });

//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
//   const [tLoading, setTLoading] = useState(false);
//   const [tSaving, setTSaving] = useState(false);
//   const [showTModal, setShowTModal] = useState(false);
//   const [isEditingT, setIsEditingT] = useState(false);
//   const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

//   const [tForm, setTForm] = useState({
//     quote: '',
//     author: '',
//     roleTitle: '',
//     imageFile: null,
//     imagePreview: ''
//   });

//   const [aboutText, setAboutText] = useState('');
//   const referalNameLS = typeof window !== 'undefined' ? localStorage.getItem('referralName') : '';
//   const [aboutLoading, setAboutLoading] = useState(false);
//   const [aboutImagePath, setAboutImagePath] = useState<string>('');
//   const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
//   const [aboutPreview, setAboutPreview] = useState<string>('');

//   const [aboutInitial, setAboutInitial] = useState({ description: '', imagePath: '' });

//   useEffect(() => {
//     if (!showEditModal || !referralName) return;

//     (async () => {
//       try {
//         setAboutLoading(true);
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/endusers/aboutsection/${referralName}`);
//         const desc = res.data?.aboutDescription || '';
//         const imgPath = res.data?.aboutImage || '';
//         const imgUrl = toApiFileUrl(imgPath);
//         setAboutText(desc);
//         setAboutImagePath(imgUrl);
//         setAboutInitial({ description: desc, imagePath: imgPath });
//         setAboutImageFile(null);
//         setAboutPreview('');
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setAboutLoading(false);
//       }
//     })();
//   }, [showEditModal, referralName]);

//   useEffect(() => {
//     if (!showEditModal || !referralName) return;
//     fetchTestimonials();
//   }, [showEditModal, referralName]);

//   const fetchTestimonials = async () => {
//     try {
//       setTLoading(true);
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${referralName}`);
//       const list: Testimonial[] = (res.data?.testimonials || []).map((t: Testimonial) => ({
//         ...t,
//         imagePath: t.imagePath ? toApiFileUrl(t.imagePath) : null
//       }));
//       setTestimonials(list);
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to load testimonials.');
//     } finally {
//       setTLoading(false);
//     }
//   };

//   const onAboutFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (!file) return;
//     setAboutImageFile(file);
//     if (aboutPreview) URL.revokeObjectURL(aboutPreview);
//     setAboutPreview(URL.createObjectURL(file));
//   };
//   const clearSelectedAboutFile = () => {
//     if (aboutPreview) URL.revokeObjectURL(aboutPreview);
//     setAboutImageFile(null);
//     setAboutPreview('');
//   };

//   const saveAbout = async () => {
//     if (!referralName) return;
//     if (!aboutDirty) {
//       toast('No changes to save', { icon: 'ℹ️' });
//       return;
//     }

//     try {
//       setSaving(true);
//       const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || '';
//       const fd = new FormData();
//       if ((aboutText ?? '') !== (aboutInitial.description ?? '')) {
//         fd.append('aboutDescription', aboutText);
//       }
//       if (aboutImageFile) {
//         fd.append('aboutImage', aboutImageFile);
//       }

//       const resp = await axios.patch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/addaboutsectionpartnerdashboard/${referralName}`,
//         fd,
//         {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : '',
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       const newDesc = resp.data?.aboutDescription ?? aboutText;
//       const newPath = resp.data?.aboutImage ?? aboutImagePath;
//       const newUrl = toApiFileUrl(newPath);

//       setAboutText(newDesc);
//       setAboutImagePath(newUrl);
//       setAboutInitial({ description: newDesc, imagePath: newPath });
//       clearSelectedAboutFile();

//       toast.success('About section updated.');
//     } catch (e) {
//       console.error(e);
//       toast.error('Failed to update About.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const aboutDirty = (aboutText ?? '') !== (aboutInitial.description ?? '') || !!aboutImageFile;

//   useEffect(() => {
//     const fetchPartnerDetails = async (slug: string) => {
//       try {
//         const res = await axios.get<PartnerDetails>(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/getPartnerDetailbyReferalName/${slug}`
//         );

//         if (res.status === 200) {
//           const name = res.data.referalName || localStorage.getItem('referralName') || '';
//           const code = localStorage.getItem('referralCode') || '';
//           setReferralName(name);
//           setPartnerName(res.data.name || '');
//           setPartnerEmail(res.data.email || '');
//           setPhone(res.data.phone || '');
//           setReferralCode(code);
//           setFullLink(`https://refer.rxpt.us/${name}`);
//           setPartnerWebsite(`${window.location.origin}/${name}`);
//         }
//       } catch (err) {
//         console.log('Error while fetching partner details', err);
//         toast.error('Failed to load partner details.');
//       }
//     };

//     if (referalNameLS) fetchPartnerDetails(referalNameLS);
//   }, [referalNameLS]);

//   useEffect(() => {
//     if (!showEditModal) return;
//     setPersonalForm({
//       name: partnerName || '',
//       email: partnerEmail || '',
//       phone: phone || ''
//     });
//   }, [showEditModal]);

//   const copyToClipboard = async (text: string) => {
//     if (!text) return;
//     try {
//       await navigator.clipboard.writeText(text);
//       toast.success('Copied to clipboard!');
//     } catch {
//       toast.error('Failed to copy. Try again.');
//     }
//   };

//   const generateScreenshot = () => {
//     const preview = document.getElementById('website-mock');
//     if (!preview) return;
//     html2canvas(preview).then((canvas) => {
//       const img = canvas.toDataURL('image/png');
//       const a = document.createElement('a');
//       a.href = img;
//       a.download = 'website-screenshot.png';
//       a.click();
//       toast.success('Screenshot downloaded!');
//     });
//   };

//   const downloadBusinessCard = () => {
//     const card = document.getElementById('business-card');
//     if (!card) return;
//     html2canvas(card, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const imgWidth = canvas.width;
//       const imgHeight = canvas.height;
//       const pdfWidth = imgWidth * 0.264583;
//       const pdfHeight = imgHeight * 0.264583;
//       const pdf = new jsPDF('l', 'mm', [pdfWidth, pdfHeight]);
//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save('business-card.pdf');
//       toast.success('Business card PDF downloaded!');
//     });
//   };

//   const handleEditClick = () => {
//     if (!partnerWebsite) {
//       toast.error('Website URL not available yet.');
//       return;
//     }
//     setEditTab('personal');
//     setShowEditModal(true);
//   };

//   const personalDirty = personalForm.name !== partnerName || personalForm.email !== partnerEmail || personalForm.phone !== phone;

//   const updatePersonalField = (field: 'name' | 'email' | 'phone', value: string) => {
//     setPersonalForm((f) => ({ ...f, [field]: value }));
//   };

//   const submitPersonalUpdate = async () => {
//     if (!personalDirty) return;
//     try {
//       setSaving(true);
//       const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || '';

//       const url = `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/updatePartnerDetailbyReferalName/${referralName}`;

//       const resp = await axios.patch(
//         url,
//         {
//           name: personalForm.name,
//           email: personalForm.email,
//           phone: personalForm.phone
//         },
//         {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : '',
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       setPartnerName(resp.data?.name || personalForm.name);
//       setPartnerEmail(resp.data?.email || personalForm.email);
//       setPhone(resp.data?.phone || personalForm.phone);

//       toast.success('Personal details updated.');
//       setShowEditModal(false);
//     } catch (e) {
//       console.error(e);
//       toast.error('Update failed. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const resetTForm = () => {
//     if (tForm.imagePreview) URL.revokeObjectURL(tForm.imagePreview);
//     setTForm({
//       quote: '',
//       author: '',
//       roleTitle: '',
//       imageFile: null,
//       imagePreview: ''
//     });
//     setEditingItem(null);
//     setIsEditingT(false);
//   };

//   const openCreate = () => {
//     resetTForm();
//     setIsEditingT(false);
//     setShowTModal(true);
//   };

//   const openEdit = (item: Testimonial) => {
//     if (tForm.imagePreview) URL.revokeObjectURL(tForm.imagePreview);
//     setTForm({
//       quote: item.quote || '',
//       author: item.author || '',
//       roleTitle: item.roleTitle || '',
//       imageFile: null,
//       imagePreview: item.imagePath ? String(item.imagePath) : ''
//     });
//     setEditingItem(item);
//     setIsEditingT(true);
//     setShowTModal(true);
//   };

//   const onTFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (!file) return;
//     if (tForm.imagePreview) URL.revokeObjectURL(tForm.imagePreview);
//     setTForm((f) => ({
//       ...f,
//       imageFile: file,
//       imagePreview: URL.createObjectURL(file)
//     }));
//   };

//   const submitTestimonial = async () => {
//     if (!referralName) return;
//     if (!tForm.quote.trim() || !tForm.author.trim()) {
//       return toast.error('Quote and Author are required.');
//     }
//     try {
//       setTSaving(true);
//       const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || '';

//       const fd = new FormData();
//       fd.append('quote', tForm.quote.trim());
//       fd.append('author', tForm.author.trim());
//       if (tForm.roleTitle?.trim()) fd.append('roleTitle', tForm.roleTitle.trim());
//       if (tForm.imageFile) fd.append('image', tForm.imageFile);

//       if (isEditingT && editingItem) {
//         await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${editingItem.id}`, fd, {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : '',
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//         toast.success('Testimonial updated.');
//       } else {
//         await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${referralName}`, fd, {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : '',
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//         toast.success('Testimonial created.');
//       }

//       setShowTModal(false);
//       resetTForm();
//       fetchTestimonials();
//     } catch (err: any) {
//       console.error(err);
//       const msg = err?.response?.data?.message || err?.response?.data?.error || 'Request failed';
//       toast.error(msg);
//     } finally {
//       setTSaving(false);
//     }
//   };

//   const handleDeleteTestimonial = async (id) => {
//     try {
//       const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/deleteTestimonial/${id}`);

//       if (res.status === 200) {
//         toast.success('Testimonial deleted.');
//         setTestimonials((prev) => prev.filter((t) => t.id !== id));
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Failed',
//           text: res.data?.message || 'Something went wrong.'
//         });
//       }
//     } catch (error) {
//       console.error('❌ Delete error:', error);
//       const msg = error?.response?.data?.message || error?.response?.data?.error || 'Request failed';
//       toast.error(msg);
//     }
//   };

//   const tImage = (p?: string | null) => (p ? p : '/images/defaultiprofile.svg');

//   return (
//     <>
//       <Toaster position="top-right" />

//       <div className="p-4 overflow-hidden my-5">
//         <div className="bg-white rounded-2xl p-8 max-w-5xl w-full">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Partner Data</h2>

//           <div className="flex justify-center gap-4 mb-6">
//             <button
//               onClick={() => setActiveTab('referralLink')}
//               className={`px-4 py-2 rounded font-medium transition-colors ${
//                 activeTab === 'referralLink'
//                   ? 'bg-purple-600 text-white hover:bg-purple-700'
//                   : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
//               }`}
//             >
//               Referral Link
//             </button>
//             <button
//               onClick={() => setActiveTab('websiteUrl')}
//               className={`px-4 py-2 rounded font-medium transition-colors ${
//                 activeTab === 'websiteUrl'
//                   ? 'bg-purple-600 text-white hover:bg-purple-700'
//                   : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
//               }`}
//             >
//               Website URL
//             </button>
//             <button
//               onClick={() => setActiveTab('businessCard')}
//               className={`px-4 py-2 rounded font-medium transition-colors ${
//                 activeTab === 'businessCard'
//                   ? 'bg-purple-600 text-white hover:bg-purple-700'
//                   : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
//               }`}
//             >
//               Business Card
//             </button>
//           </div>

//           {activeTab === 'referralLink' && (
//             <div>
//               <div className="flex gap-3">
//                 <div className="relative flex-1">
//                   <input
//                     type="text"
//                     readOnly
//                     value={fullLink}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                   />
//                   <Copy
//                     onClick={() => copyToClipboard(fullLink)}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
//                   />
//                 </div>
//               </div>

//               <p className="mt-4 text-sm text-gray-500 text-center">Invite friends and earn rewards 🎉</p>

//               <div className="mt-6">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Referral URL QR Code</h3>
//                 <div className="flex justify-center">
//                   <div style={{ position: 'relative', display: 'inline-block' }}>
//                     <QRCodeCanvas value={fullLink} size={128} bgColor="#6524EB" fgColor="#FFFFFF" level="H" includeMargin={true} />
//                     <img
//                       src="/rexpt-main.png" // Replace with your icon path
//                       alt="QR Code Icon"
//                       style={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         width: '30%',
//                         height: '30%'
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'websiteUrl' && (
//             <div className="mt-6">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Partner Website URL</h3>

//               <div className="flex gap-3" style={{ justifyContent: 'center', alignItems: 'center' }}>
//                 <div className="relative flex-1">
//                   <input
//                     type="text"
//                     readOnly
//                     value={partnerWebsite}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
//                   />
//                   <Copy
//                     onClick={() => copyToClipboard(partnerWebsite)}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
//                   />
//                 </div>

//                 <button
//                   onClick={() => setShowPreview((s) => !s)}
//                   className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded"
//                 >
//                   {showPreview ? 'Close' : 'Preview'}
//                 </button>
//                 <button variant="outline" onClick={handleEditClick} disabled={!partnerWebsite}>
//                   Edit
//                 </button>
//               </div>

//               {showPreview && partnerWebsite && (
//                 <div className="mt-4">
//                   <div id="website-mock" className="border border-gray-300 p-4 rounded-lg bg-gray-100">
//                     <iframe
//                       src={partnerWebsite}
//                       title="Website Preview"
//                       className="w-full h-auto mb-4 border-none"
//                       style={{ minHeight: '400px' }}
//                       scrolling="yes"
//                     />
//                   </div>
//                 </div>
//               )}

//               {showPreview && !partnerWebsite && (
//                 <p className="text-center text-sm text-gray-500 mt-4">Website URL not available yet. Please try again in a moment.</p>
//               )}
//             </div>
//           )}

//           {activeTab === 'businessCard' && (
//             <div className="mt-6">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Partner Business Card Preview</h3>
//               <div
//                 id="business-card"
//                 className="relative border border-gray-300 p-4 rounded-lg mx-auto max-w-md bg-white shadow-md"
//                 style={{
//                   background: 'linear-gradient(120deg, #ffffff 40%, #ede7f6 70%, #6524EB 100%)'
//                 }}
//               >
//                 <div className="flex items-center mb-2">
//                   <img src="/rexpt-main.png" alt="Icon" className="w-12 h-12 mr-4 " />
//                   <div>
//                     <h2 className="text-xl font-bold">{referralName}</h2>
//                     <p className="text-sm text-gray-600">Partner</p>
//                   </div>
//                 </div>
//                 <div className="mb-2">
//                   <p className="text-sm">
//                     <strong>Name:</strong> {partnerName}
//                   </p>
//                   <p className="text-sm">
//                     <strong>Email:</strong> {partnerEmail}
//                   </p>
//                   <p className="text-sm">
//                     <strong>Phone:</strong> +{phone}
//                   </p>
//                   <p className="text-sm">
//                     <strong>Website:</strong> {partnerWebsite}
//                   </p>
//                   <p className="text-sm">
//                     <strong>Referral Link:</strong> {fullLink}
//                   </p>
//                 </div>
//                 <div className="absolute bottom-4 right-4">
//                   <div style={{ position: 'relative', display: 'inline-block' }}>
//                     <QRCodeCanvas
//                       value={partnerWebsite || fullLink}
//                       size={80}
//                       bgColor="#6524EB"
//                       fgColor="#FFFFFF"
//                       level="H"
//                       includeMargin={true}
//                     />
//                     <img
//                       src="/rexpt-main.png" // Replace with your icon path
//                       alt="QR Code Icon"
//                       style={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         width: '30%',
//                         height: '30%'
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-center mt-4 ">
//                 <button onClick={downloadBusinessCard} className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded">
//                   Download PDF Vector File
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {showEditModal && (
//         <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
//           <div className="absolute inset-0 " onClick={() => setShowEditModal(false)} />
//           <div
//             className="relative mx-auto my-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white text-[#1b1b1f] shadow-2xl ring-1 ring-[#6424ec]/10"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between bg-[#6424ec] px-6 py-4 text-white">
//               <h3 id="edit-modal-title" className="text-lg font-semibold">
//                 Edit
//               </h3>
//               <button
//                 className="rounded-md p-2 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
//                 onClick={() => setShowEditModal(false)}
//                 aria-label="Close"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="px-6 pt-5">
//               <div className="inline-flex overflow-hidden rounded-xl border border-[#6424ec]/20">
//                 <button
//                   className={`px-4 py-2 text-sm font-medium transition ${
//                     editTab === 'personal' ? 'bg-[#6424ec] text-white' : 'bg-white text-[#6424ec] hover:bg-[#6424ec]/5'
//                   }`}
//                   onClick={() => setEditTab('personal')}
//                 >
//                   1) Edit Personal Details
//                 </button>
//                 <button
//                   className={`border-l border-[#6424ec]/20 px-4 py-2 text-sm font-medium transition ${
//                     editTab === 'testimonials' ? 'bg-[#6424ec] text-white' : 'bg-white text-[#6424ec] hover:bg-[#6424ec]/5'
//                   }`}
//                   onClick={() => setEditTab('testimonials')}
//                 >
//                   2) Edit Testimonials
//                 </button>
//                 <button
//                   className={`border-l border-[#6424ec]/20 px-4 py-2 text-sm font-medium transition ${
//                     editTab === 'about' ? 'bg-[#6424ec] text-white' : 'bg-white text-[#6424ec] hover:bg-[#6424ec]/5'
//                   }`}
//                   onClick={() => setEditTab('about')}
//                 >
//                   3) Edit About
//                 </button>
//               </div>
//             </div>

//             <div className="px-6 pb-6 pt-4">
//               {editTab === 'personal' && (
//                 <>
//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                     <div>
//                       <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">Name</label>
//                       <input
//                         className="w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
//                         value={personalForm.name}
//                         onChange={(e) => updatePersonalField('name', e.target.value)}
//                         placeholder="Partner name"
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">Email</label>
//                       <input
//                         type="email"
//                         className="w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
//                         value={personalForm.email}
//                         onChange={(e) => updatePersonalField('email', e.target.value)}
//                         placeholder="name@example.com"
//                       />
//                     </div>
//                     <div>
//                       <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">Phone</label>
//                       <input
//                         className="w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
//                         value={personalForm.phone}
//                         onChange={(e) => updatePersonalField('phone', e.target.value)}
//                         placeholder="+1 555 123 4567"
//                       />
//                     </div>
//                   </div>

//                   <div className="mt-6 flex justify-end gap-2">
//                     <button
//                       className="rounded-lg border border-[#6424ec] px-4 py-2 text-[#6424ec] transition hover:bg-[#6424ec]/5 focus:outline-none focus:ring-2 focus:ring-[#6424ec]/40 disabled:cursor-not-allowed disabled:opacity-40"
//                       onClick={() => setShowEditModal(false)}
//                       disabled={saving}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="rounded-lg bg-[#6424ec] px-4 py-2 text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6424ec]/40 disabled:cursor-not-allowed disabled:opacity-40"
//                       onClick={submitPersonalUpdate}
//                       disabled={!personalDirty || saving}
//                     >
//                       {saving ? 'Updating...' : 'Update'}
//                     </button>
//                   </div>
//                 </>
//               )}

//               {editTab === 'testimonials' && (
//                 <>
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="text-sm text-gray-600">{tLoading ? 'Loading testimonials…' : `${testimonials.length}/5 used`}</div>
//                     <button
//                       onClick={openCreate}
//                       disabled={testimonials.length >= 5}
//                       title={testimonials.length >= 5 ? 'Limit reached (5)' : 'Create Testimonial'}
//                     >
//                       Create Testimonial
//                     </button>
//                   </div>

//                   <div className="max-h-80 md:max-h-96 overflow-y-auto pr-2">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {tLoading && (
//                         <>
//                           <div className="h-40 rounded-lg border border-[#6424ec]/20 animate-pulse bg-gray-100" />
//                           <div className="h-40 rounded-lg border border-[#6424ec]/20 animate-pulse bg-gray-100" />
//                         </>
//                       )}
//                       {!tLoading && testimonials.length === 0 && (
//                         <div className="text-sm text-gray-500">No testimonials yet. Click “Create Testimonial”.</div>
//                       )}
//                       {!tLoading &&
//                         testimonials.map((t) => (
//                           <div key={t.id} className="p-3 rounded-lg border border-[#6424ec]/20 bg-white shadow-sm flex gap-3">
//                             <img src={tImage(t.imagePath || undefined)} alt={t.author} className="w-16 h-16 rounded object-cover" />
//                             <div className="flex-1">
//                               <div className="text-sm italic">“{t.quote}”</div>
//                               <div className="mt-1 text-xs text-gray-700">
//                                 <span className="font-semibold">{t.author}</span>
//                                 {t.roleTitle ? ` • ${t.roleTitle}` : ''}
//                               </div>
//                             </div>
//                             <button className="self-start p-2 rounded hover:bg-gray-100" title="Edit" onClick={() => openEdit(t)}>
//                               <Pencil size={16} />
//                             </button>
//                             <button
//                               className="self-start p-2 rounded hover:bg-gray-100"
//                               title="Delete"
//                               onClick={() => handleDeleteTestimonial(t.id)}
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         ))}
//                     </div>
//                   </div>

//                   {showTModal && (
//                     <div className="fixed inset-0 z-50 overflow-y-auto">
//                       <div className="absolute inset-0 bg-black/20" onClick={() => setShowTModal(false)} />
//                       <div
//                         className="relative mx-auto my-10 w-full max-w-lg rounded-2xl bg-white text-[#1b1b1f] shadow-2xl ring-1 ring-[#6424ec]/10 p-5 max-h-[90vh] overflow-y-auto"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <div className="flex items-center justify-between mb-3">
//                           <h4 className="text-lg font-semibold">{isEditingT ? 'Edit Testimonial' : 'Create Testimonial'}</h4>
//                           <button className="p-2 rounded hover:bg-gray-100" onClick={() => setShowTModal(false)}>
//                             <X size={18} />
//                           </button>
//                         </div>

//                         <div className="space-y-3">
//                           <div>
//                             <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">Quote *</label>
//                             <textarea
//                               className="min-h-[90px] w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
//                               value={tForm.quote}
//                               onChange={(e) => setTForm((f) => ({ ...f, quote: e.target.value }))}
//                               placeholder="What do customers say?"
//                             />
//                           </div>

//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                             <div>
//                               <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">Author *</label>
//                               <input
//                                 className="w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
//                                 value={tForm.author}
//                                 onChange={(e) => setTForm((f) => ({ ...f, author: e.target.value }))}
//                                 placeholder="Jane Doe"
//                               />
//                             </div>
//                             <div>
//                               <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
//                                 Role / Title
//                               </label>
//                               <input
//                                 className="w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
//                                 value={tForm.roleTitle}
//                                 onChange={(e) => setTForm((f) => ({ ...f, roleTitle: e.target.value }))}
//                                 placeholder="CEO, Acme Inc."
//                               />
//                             </div>
//                           </div>

//                           <div>
//                             <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
//                               Image (optional)
//                             </label>
//                             <input
//                               type="file"
//                               accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
//                               onChange={onTFileChange}
//                               className="block w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] file:mr-3 file:rounded-md file:border-0 file:bg-[#6424ec] file:px-3 file:py-2 file:text-white hover:file:opacity-90"
//                             />
//                             {tForm.imagePreview && (
//                               <div className="mt-2">
//                                 <img src={tForm.imagePreview} alt="preview" className="h-24 w-24 rounded object-cover border " />
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         <div className="mt-5 flex justify-end gap-2">
//                           <button
//                             className="rounded-lg border border-[#6424ec] px-4 py-2 text-[#6424ec] transition hover:bg-[#6424ec]/5"
//                             onClick={() => {
//                               setShowTModal(false);
//                               resetTForm();
//                             }}
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             className="rounded-lg bg-[#6424ec] px-4 py-2 text-white shadow-sm transition hover:opacity-90 disabled:opacity-40"
//                             onClick={submitTestimonial}
//                             disabled={tSaving}
//                           >
//                             {tSaving ? 'Saving...' : isEditingT ? 'Update' : 'Create'}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}

//               {editTab === 'about' && (
//                 <>
//                   {aboutLoading ? (
//                     <div className="text-sm text-gray-500">Loading about…</div>
//                   ) : (
//                     <>
//                       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                         <div className="md:col-span-2">
//                           <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
//                             About Description
//                           </label>
//                           <textarea
//                             className="min-h-[140px] w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#6424ec]"
//                             value={aboutText}
//                             onChange={(e) => {
//                               const text = e.target.value;
//                               if (text.length <= 600) {
//                                 setAboutText(text);
//                               } else {
//                                 setAboutText(text.slice(0, 600));
//                               }
//                             }}
//                             placeholder="Tell visitors about you/your business…"
//                           />
//                           <p className="mt-1 text-xs text-gray-500">{aboutText.length}/600 characters</p>
//                         </div>

//                         <div>
//                           <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#4b4b52]">
//                             About Image (optional)
//                           </label>
//                           <input
//                             type="file"
//                             accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
//                             onChange={onAboutFileChange}
//                             className="block w-full rounded-lg border border-[#6424ec]/30 bg-white px-3 py-2 text-[#1b1b1f] file:mr-3 file:rounded-md file:border-0 file:bg-[#6424ec] file:px-3 file:py-2 file:text-white hover:file:opacity-90"
//                           />
//                           {aboutImageFile && (
//                             <button onClick={clearSelectedAboutFile} className="mt-2 text-xs text-[#6424ec] underline" type="button">
//                               Remove selected file
//                             </button>
//                           )}
//                         </div>

//                         <div className="flex items-start gap-4">
//                           {aboutPreview && (
//                             <div className="rounded-lg border border-[#6424ec]/20 p-2">
//                               <img src={aboutPreview} alt="New About Preview" className="h-28 w-28 rounded object-cover" />
//                               <div className="mt-1 text-center text-[11px] text-gray-500">New image (unsaved)</div>
//                             </div>
//                           )}

//                           {aboutImagePath && (
//                             <div className="rounded-lg border border-[#6424ec]/20 p-2">
//                               <img src={aboutImagePath} alt="Current About" className="h-28 w-28 rounded object-cover" />
//                               <div className="mt-1 text-center text-[11px] text-gray-500">
//                                 Current image {aboutPreview && '(will be replaced)'}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="mt-6 flex justify-end gap-2">
//                         <button
//                           className="rounded-lg border border-[#6424ec] px-4 py-2 text-[#6424ec] transition hover:bg-[#6424ec]/5 focus:outline-none focus:ring-2 focus:ring-[#6424ec]/40 disabled:cursor-not-allowed disabled:opacity-40"
//                           onClick={() => setShowEditModal(false)}
//                           disabled={saving}
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           className="rounded-lg bg-[#6424ec] px-4 py-2 text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6424ec]/40 disabled:cursor-not-allowed disabled:opacity-40"
//                           onClick={saveAbout}
//                           disabled={!aboutDirty || saving}
//                         >
//                           {saving ? 'Saving...' : 'Save'}
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { ContentCopy, Close, Edit, Delete } from '@mui/icons-material';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Tabs,
  Tab,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
  Stack,
  Paper,
  TextareaAutosize
} from '@mui/material';

interface PartnerDetails {
  name: string;
  email: string;
  phone: string;
  referalName: string;
}

type EditTab = 'personal' | 'testimonials' | 'about';

type Testimonial = {
  id: number;
  quote: string;
  author: string;
  roleTitle?: string | null;
  imagePath?: string | null;
  createdAt?: string;
};

const toApiFileUrl = (p?: string) => {
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
  const cleaned = p.replace(/^(\.\.\/)+public/, '').replace(/^\/+/, '');
  return `${base}/${cleaned}`;
};

export default function ReferralLink() {
  const [fullLink, setFullLink] = useState('');
  const [partnerWebsite, setPartnerWebsite] = useState('');
  const [referralName, setReferralName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [phone, setPhone] = useState('');
  const [isFreeSignup, setIsFreeSignup] = useState(false);
  const [websiteTitle, setWebsiteTitle] = useState('My Partner Website');
  const [websiteImage, setWebsiteImage] = useState('https://placehold.co/600x400');
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [activeTab, setActiveTab] = useState<'referralLink' | 'websiteUrl' | 'businessCard'>('referralLink');
  const [showPreview, setShowPreview] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTab, setEditTab] = useState<EditTab>('personal');
  const [saving, setSaving] = useState(false);

  const [personalForm, setPersonalForm] = useState({ name: '', email: '', phone: '' });

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [tLoading, setTLoading] = useState(false);
  const [tSaving, setTSaving] = useState(false);
  const [showTModal, setShowTModal] = useState(false);
  const [isEditingT, setIsEditingT] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const [tForm, setTForm] = useState({
    quote: '',
    author: '',
    roleTitle: '',
    imageFile: null as File | null,
    imagePreview: ''
  });

  const [aboutText, setAboutText] = useState('');
  const referalNameLS = typeof window !== 'undefined' ? localStorage.getItem('referralName') : '';
  const [aboutLoading, setAboutLoading] = useState(false);
  const [aboutImagePath, setAboutImagePath] = useState<string>('');
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [aboutPreview, setAboutPreview] = useState<string>('');

  const [aboutInitial, setAboutInitial] = useState({ description: '', imagePath: '' });

  useEffect(() => {
    if (!showEditModal || !referralName) return;

    (async () => {
      try {
        setAboutLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/endusers/aboutsection/${referralName}`);
        const desc = res.data?.aboutDescription || '';
        const imgPath = res.data?.aboutImage || '';
        const imgUrl = toApiFileUrl(imgPath);
        setAboutText(desc);
        setAboutImagePath(imgUrl);
        setAboutInitial({ description: desc, imagePath: imgPath });
        setAboutImageFile(null);
        setAboutPreview('');
      } catch (e) {
        console.error(e);
      } finally {
        setAboutLoading(false);
      }
    })();
  }, [showEditModal, referralName]);

  useEffect(() => {
    if (!showEditModal || !referralName) return;
    fetchTestimonials();
  }, [showEditModal, referralName]);

  const fetchTestimonials = async () => {
    try {
      setTLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${referralName}`);
      const list: Testimonial[] = (res.data?.testimonials || []).map((t: Testimonial) => ({
        ...t,
        imagePath: t.imagePath ? toApiFileUrl(t.imagePath) : null
      }));
      setTestimonials(list);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load testimonials.');
    } finally {
      setTLoading(false);
    }
  };

  const onAboutFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setAboutImageFile(file);
    if (aboutPreview) URL.revokeObjectURL(aboutPreview);
    setAboutPreview(URL.createObjectURL(file));
  };

  const clearSelectedAboutFile = () => {
    if (aboutPreview) URL.revokeObjectURL(aboutPreview);
    setAboutImageFile(null);
    setAboutPreview('');
  };

  const saveAbout = async () => {
    if (!referralName) return;
    if (!aboutDirty) {
      toast('No changes to save', { icon: 'ℹ️' });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
      const fd = new FormData();
      if ((aboutText ?? '') !== (aboutInitial.description ?? '')) {
        fd.append('aboutDescription', aboutText);
      }
      if (aboutImageFile) {
        fd.append('aboutImage', aboutImageFile);
      }

      const resp = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/addaboutsectionpartnerdashboard/${referralName}`,
        fd,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const newDesc = resp.data?.aboutDescription ?? aboutText;
      const newPath = resp.data?.aboutImage ?? aboutImagePath;
      const newUrl = toApiFileUrl(newPath);

      setAboutText(newDesc);
      setAboutImagePath(newUrl);
      setAboutInitial({ description: newDesc, imagePath: newPath });
      clearSelectedAboutFile();

      toast.success('About section updated.');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update About.');
    } finally {
      setSaving(false);
    }
  };

  const aboutDirty = (aboutText ?? '') !== (aboutInitial.description ?? '') || !!aboutImageFile;

  useEffect(() => {
    const fetchPartnerDetails = async (slug: string) => {
      try {
        const slug = localStorage.getItem('referralName');
        const res = await axios.get<PartnerDetails>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/getPartnerDetailbyReferalName/${slug}`
        );

        if (res.status === 200) {
          const name = res.data.referalName || localStorage.getItem('referralName') || '';
          const code = localStorage.getItem('referralCode') || '';
          setReferralName(name);
          setPartnerName(res.data.name || '');
          setPartnerEmail(res.data.email || '');
          setPhone(res.data.phone || '');
          setReferralCode(code);
          setFullLink(`https://refer.rxpt.us/${name}`);
          setPartnerWebsite(`https://partner.rxpt.us/${name}`);
        }
      } catch (err) {
        console.log('Error while fetching partner details', err);
        toast.error('Failed to load partner details.');
      }
    };

    if (referalNameLS) fetchPartnerDetails(referalNameLS);
  }, [referalNameLS]);

  useEffect(() => {
    if (!showEditModal) return;
    setPersonalForm({
      name: partnerName || '',
      email: partnerEmail || '',
      phone: phone || ''
    });
  }, [showEditModal, partnerName, partnerEmail, phone]);

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy. Try again.');
    }
  };

  const generateScreenshot = () => {
    const preview = document.getElementById('website-mock');
    if (!preview) return;
    html2canvas(preview).then((canvas) => {
      const img = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = img;
      a.download = 'website-screenshot.png';
      a.click();
      toast.success('Screenshot downloaded!');
    });
  };

  const downloadBusinessCard = () => {
    const card = document.getElementById('business-card');
    if (!card) return;
    html2canvas(card, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfWidth = imgWidth * 0.264583;
      const pdfHeight = imgHeight * 0.264583;
      const pdf = new jsPDF('l', 'mm', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('business-card.pdf');
      toast.success('Business card PDF downloaded!');
    });
  };

  const handleEditClick = () => {
    if (!partnerWebsite) {
      toast.error('Website URL not available yet.');
      return;
    }
    setEditTab('personal');
    setShowEditModal(true);
  };

  const personalDirty = personalForm.name !== partnerName || personalForm.email !== partnerEmail || personalForm.phone !== phone;

  const updatePersonalField = (field: 'name' | 'email' | 'phone', value: string) => {
    setPersonalForm((f) => ({ ...f, [field]: value }));
  };

  const submitPersonalUpdate = async () => {
    if (!personalDirty) return;
    try {
      setSaving(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || '';

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/updatePartnerDetailbyReferalName/${referralName}`;

      const resp = await axios.patch(
        url,
        {
          name: personalForm.name,
          email: personalForm.email,
          phone: personalForm.phone
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        }
      );

      setPartnerName(resp.data?.name || personalForm.name);
      setPartnerEmail(resp.data?.email || personalForm.email);
      setPhone(resp.data?.phone || personalForm.phone);

      toast.success('Personal details updated.');
      setShowEditModal(false);
    } catch (e) {
      console.error(e);
      toast.error('Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetTForm = () => {
    if (tForm.imagePreview) URL.revokeObjectURL(tForm.imagePreview);
    setTForm({
      quote: '',
      author: '',
      roleTitle: '',
      imageFile: null,
      imagePreview: ''
    });
    setEditingItem(null);
    setIsEditingT(false);
  };

  const openCreate = () => {
    resetTForm();
    setIsEditingT(false);
    setShowTModal(true);
  };

  const openEdit = (item: Testimonial) => {
    if (tForm.imagePreview) URL.revokeObjectURL(tForm.imagePreview);
    setTForm({
      quote: item.quote || '',
      author: item.author || '',
      roleTitle: item.roleTitle || '',
      imageFile: null,
      imagePreview: item.imagePath ? String(item.imagePath) : ''
    });
    setEditingItem(item);
    setIsEditingT(true);
    setShowTModal(true);
  };

  const onTFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (tForm.imagePreview) URL.revokeObjectURL(tForm.imagePreview);
    setTForm((f) => ({
      ...f,
      imageFile: file,
      imagePreview: URL.createObjectURL(file)
    }));
  };

  const submitTestimonial = async () => {
    if (!referralName) return;
    if (!tForm.quote.trim() || !tForm.author.trim()) {
      return toast.error('Quote and Author are required.');
    }
    try {
      setTSaving(true);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || '';

      const fd = new FormData();
      fd.append('quote', tForm.quote.trim());
      fd.append('author', tForm.author.trim());
      if (tForm.roleTitle?.trim()) fd.append('roleTitle', tForm.roleTitle.trim());
      if (tForm.imageFile) fd.append('image', tForm.imageFile);

      if (isEditingT && editingItem) {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${editingItem.id}`, fd, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Testimonial updated.');
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/${referralName}`, fd, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Testimonial created.');
      }

      setShowTModal(false);
      resetTForm();
      fetchTestimonials();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Request failed';
      toast.error(msg);
    } finally {
      setTSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/deleteTestimonial/${id}`);

      if (res.status === 200) {
        toast.success('Testimonial deleted.');
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: res.data?.message || 'Something went wrong.'
        });
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.error || 'Request failed';
      toast.error(msg);
    }
  };

  const tImage = (p?: string | null) => (p ? p : '/images/defaultiprofile.svg');

  return (
    <>
      <Toaster position="top-right" />

      <Box sx={{ p: 1, my: 1 }}>
        <Card sx={{ maxWidth: '5xl', width: '100%', mx: 'auto', borderRadius: 4 }}>
          <CardContent sx={{ p: 8 }}>
            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Partner Data
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 6 }}>
              <Button
                variant={activeTab === 'referralLink' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setActiveTab('referralLink')}
              >
                Referral Link
              </Button>
              <Button
                variant={activeTab === 'websiteUrl' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setActiveTab('websiteUrl')}
              >
                Website URL
              </Button>
              <Button
                variant={activeTab === 'businessCard' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setActiveTab('businessCard')}
              >
                Business Card
              </Button>
            </Stack>

            {activeTab === 'referralLink' && (
              <Box>
                <Stack direction="row" spacing={3}>
                  <TextField
                    fullWidth
                    value={fullLink}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => copyToClipboard(fullLink)}>
                            <ContentCopy />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    variant="outlined"
                  />
                </Stack>

                <Typography variant="body2" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
                  Invite friends and earn rewards 🎉
                </Typography>

                <Box sx={{ mt: 6, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
                    Referral URL QR Code
                  </Typography>
                  <Box sx={{ display: 'inline-block', position: 'relative' }}>
                    <QRCodeCanvas value={fullLink} size={128} bgColor="#6524EB" fgColor="#FFFFFF" level="H" includeMargin />
                    <Box
                      component="img"
                      src="/rexpt-logo1.avif" // Replace with your icon path
                      alt="QR Code Icon"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '30%',
                        height: '30%'
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {activeTab === 'websiteUrl' && (
              <Box sx={{ mt: 6 }}>
                <Typography variant="h6" align="center" sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
                  Partner Website URL
                </Typography>

                <Stack direction="row" spacing={3} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    value={partnerWebsite}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => copyToClipboard(partnerWebsite)}>
                            <ContentCopy />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    variant="outlined"
                  />
                  <Button variant="contained" color="primary" onClick={() => setShowPreview((s) => !s)}>
                    {showPreview ? 'Close' : 'Preview'}
                  </Button>
                  <Button variant="outlined" onClick={handleEditClick} disabled={!partnerWebsite}>
                    Edit
                  </Button>
                </Stack>

                {showPreview && partnerWebsite && (
                  <Box sx={{ mt: 4 }}>
                    <Box id="website-mock" sx={{ border: 1, borderColor: 'grey.300', p: 4, borderRadius: 2, bgcolor: 'grey.100' }}>
                      <Box
                        component="iframe"
                        src={partnerWebsite}
                        title="Website Preview"
                        sx={{ width: '100%', minHeight: '400px', border: 'none' }}
                        scrolling="yes"
                      />
                    </Box>
                  </Box>
                )}

                {showPreview && !partnerWebsite && (
                  <Typography variant="body2" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
                    Website URL not available yet. Please try again in a moment.
                  </Typography>
                )}
              </Box>
            )}

            {activeTab === 'businessCard' && (
              <Box sx={{ mt: 6 }}>
                <Typography variant="h6" align="center" sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
                  Partner Business Card Preview
                </Typography>
                <Paper
                  id="business-card"
                  sx={{
                    position: 'relative',
                    border: 1,
                    borderColor: 'grey.300',
                    p: 4,
                    borderRadius: 2,
                    maxWidth: '400px',
                    mx: 'auto',
                    bgcolor: 'white',
                    boxShadow: 3,
                    background: 'linear-gradient(120deg, #ffffff 40%, #ede7f6 70%, #6524EB 100%)'
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box component="img" src="/rexpt-logo1.avif" alt="Icon" sx={{ width: 30, height: 30 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {referralName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Partner
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {partnerName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {partnerEmail}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> +{phone}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Website:</strong> {partnerWebsite}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Referral Link:</strong> {fullLink}
                    </Typography>
                  </Box>
                  <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <QRCodeCanvas
                        value={partnerWebsite || fullLink}
                        size={80}
                        bgColor="#6524EB"
                        fgColor="#FFFFFF"
                        level="H"
                        includeMargin
                      />
                      <Box
                        component="img"
                        src="/rexpt-logo1.avif"
                        alt="QR Code Icon"
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '30%',
                          height: '30%'
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button variant="contained" color="primary" onClick={downloadBusinessCard}>
                    Download PDF Vector File
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        fullWidth
        maxWidth="lg"
        sx={{ '& .MuiDialog-paper': { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ bgcolor: '#6424ec', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit</Typography>
          <IconButton onClick={() => setShowEditModal(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Tabs
            value={editTab}
            onChange={(_, newValue) => setEditTab(newValue)}
            variant="fullWidth"
            sx={{ mb: 4, borderBottom: 1, borderColor: '#6424ec' }}
          >
            <Tab label="1) Edit Personal Details" value="personal" />
            <Tab label="2) Edit Testimonials" value="testimonials" />
            <Tab label="3) Edit About" value="about" />
          </Tabs>

          {editTab === 'personal' && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Name"
                  value={personalForm.name}
                  onChange={(e) => updatePersonalField('name', e.target.value)}
                  placeholder="Partner name"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={personalForm.email}
                  onChange={(e) => updatePersonalField('email', e.target.value)}
                  placeholder="name@example.com"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={personalForm.phone}
                  onChange={(e) => updatePersonalField('phone', e.target.value)}
                  placeholder="+1 555 123 4567"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          )}

          {editTab === 'testimonials' && (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {tLoading ? 'Loading testimonials…' : `${testimonials.length}/5 used`}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={openCreate}
                  disabled={testimonials.length >= 5}
                  title={testimonials.length >= 5 ? 'Limit reached (5)' : 'Create Testimonial'}
                >
                  Create Testimonial
                </Button>
              </Stack>

              <Box sx={{ maxHeight: { xs: 320, md: 384 }, overflowY: 'auto', pr: 2 }}>
                <Grid container spacing={2}>
                  {tLoading ? (
                    <>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            height: 160,
                            borderRadius: 2,
                            border: 1,
                            borderColor: '#6424ec',
                            bgcolor: 'grey.100',
                            animation: 'pulse 1.5s infinite'
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            height: 160,
                            borderRadius: 2,
                            border: 1,
                            borderColor: '#6424ec',
                            bgcolor: 'grey.100',
                            animation: 'pulse 1.5s infinite'
                          }}
                        />
                      </Grid>
                    </>
                  ) : testimonials.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No testimonials yet. Click “Create Testimonial”.
                    </Typography>
                  ) : (
                    testimonials.map((t) => (
                      <Grid item xs={12} md={6} key={t.id}>
                        <Paper sx={{ p: 3, borderRadius: 2, border: 1, borderColor: '#6424ec', boxShadow: 1, display: 'flex', gap: 2 }}>
                          <Box
                            component="img"
                            src={tImage(t.imagePath || undefined)}
                            alt={t.author}
                            sx={{ width: 64, height: 64, borderRadius: 1, objectFit: 'cover' }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                              “{t.quote}”
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              <strong>{t.author}</strong>
                              {t.roleTitle ? ` • ${t.roleTitle}` : ''}
                            </Typography>
                          </Box>
                          <IconButton onClick={() => openEdit(t)} title="Edit">
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteTestimonial(t.id)} title="Delete">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Paper>
                      </Grid>
                    ))
                  )}
                </Grid>
              </Box>
            </>
          )}

          {editTab === 'about' && (
            <>
              {aboutLoading ? (
                <Typography variant="body2" color="text.secondary">
                  Loading about…
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 'bold', color: 'text.secondary' }}>
                      About Description
                    </Typography>
                    <TextareaAutosize
                      minRows={5}
                      value={aboutText}
                      onChange={(e) => {
                        const text = e.target.value;
                        if (text.length <= 600) {
                          setAboutText(text);
                        } else {
                          setAboutText(text.slice(0, 600));
                        }
                      }}
                      placeholder="Tell visitors about you/your business…"
                      style={{
                        width: '100%',
                        borderRadius: 8,
                        border: '1px solid rgba(100, 36, 236, 0.3)',
                        padding: 8,
                        fontFamily: 'inherit',
                        fontSize: '1rem'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      {aboutText.length}/600 characters
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 'bold', color: 'text.secondary' }}>
                      About Image (optional)
                    </Typography>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                      onChange={onAboutFileChange}
                      style={{ width: '100%' }}
                    />
                    {aboutImageFile && (
                      <Button onClick={clearSelectedAboutFile} color="primary" sx={{ mt: 2, textDecoration: 'underline' }}>
                        Remove selected file
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2}>
                      {aboutPreview && (
                        <Box sx={{ borderRadius: 2, border: 1, borderColor: '#6424ec', p: 2 }}>
                          <Box
                            component="img"
                            src={aboutPreview}
                            alt="New About Preview"
                            sx={{ width: 112, height: 112, borderRadius: 1, objectFit: 'cover' }}
                          />
                          <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                            New image (unsaved)
                          </Typography>
                        </Box>
                      )}
                      {aboutImagePath && (
                        <Box sx={{ borderRadius: 2, border: 1, borderColor: '#6424ec', p: 2 }}>
                          <Box
                            component="img"
                            src={aboutImagePath}
                            alt="Current About"
                            sx={{ width: 112, height: 112, borderRadius: 1, objectFit: 'cover' }}
                          />
                          <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                            Current image {aboutPreview && '(will be replaced)'}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={() => setShowEditModal(false)} disabled={saving}>
            Cancel
          </Button>
          {editTab === 'personal' && (
            <Button variant="contained" color="primary" onClick={submitPersonalUpdate} disabled={!personalDirty || saving}>
              {saving ? 'Updating...' : 'Update'}
            </Button>
          )}
          {editTab === 'about' && (
            <Button variant="contained" color="primary" onClick={saveAbout} disabled={!aboutDirty || saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={showTModal}
        onClose={() => {
          setShowTModal(false);
          resetTForm();
        }}
        fullWidth
        maxWidth="sm"
        sx={{ '& .MuiDialog-paper': { borderRadius: 4, maxHeight: '90vh', overflowY: 'auto' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{isEditingT ? 'Edit Testimonial' : 'Create Testimonial'}</Typography>
          <IconButton
            onClick={() => {
              setShowTModal(false);
              resetTForm();
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Box>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 'bold', color: 'text.secondary' }}>
                Quote *
              </Typography>
              <TextareaAutosize
                minRows={4}
                value={tForm.quote}
                onChange={(e) => setTForm((f) => ({ ...f, quote: e.target.value }))}
                placeholder="What do customers say?"
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1px solid rgba(100, 36, 236, 0.3)',
                  padding: 8,
                  fontFamily: 'inherit',
                  fontSize: '1rem'
                }}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Author *"
                  value={tForm.author}
                  onChange={(e) => setTForm((f) => ({ ...f, author: e.target.value }))}
                  placeholder="Jane Doe"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Role / Title"
                  value={tForm.roleTitle}
                  onChange={(e) => setTForm((f) => ({ ...f, roleTitle: e.target.value }))}
                  placeholder="CEO, Acme Inc."
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Box>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 'bold', color: 'text.secondary' }}>
                Image (optional)
              </Typography>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={onTFileChange}
                style={{ width: '100%' }}
              />
              {tForm.imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <Box
                    component="img"
                    src={tForm.imagePreview}
                    alt="preview"
                    sx={{ width: 96, height: 96, borderRadius: 1, objectFit: 'cover', border: 1, borderColor: 'grey.300' }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setShowTModal(false);
              resetTForm();
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={submitTestimonial} disabled={tSaving}>
            {tSaving ? 'Saving...' : isEditingT ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
