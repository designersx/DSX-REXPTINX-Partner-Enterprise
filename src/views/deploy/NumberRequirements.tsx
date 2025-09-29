import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    TextField,
    Typography,
    Button,
    Paper,
    Stack,
    CircularProgress,
    Divider,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AddressAutocomplete from 'components/AddressAutocomplete';

interface FormData {
    companyRegNumber: string;
    companyWebsite: string;
    passportOrCert: File | null;
    proofOfAddress: File | null;
    businessUseCase: string;
    contactInfo: string;
    address: string;

    first_name: string;
    last_name: string;
    business_name: string;
    phone_number: string;
    street_address: string;
    extended_address: string;
    locality: string;
    administrative_area: string;
    postal_code: string;
    country_code: string;
}

interface NumberRequirementsProps {
    onSubmit?: (data: FormData) => void;
    requirementLoading?: boolean
}

const NumberRequirements: React.FC<NumberRequirementsProps> = ({ onSubmit, requirementLoading }) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch
    } = useForm<FormData>({
        defaultValues: {
            companyRegNumber: '',
            companyWebsite: '',
            passportOrCert: null,
            proofOfAddress: null,
            businessUseCase: '',
            contactInfo: '',
            address: '',
        },
        mode: 'onChange',
    });
    const address = watch('address');

    // --- Validation Functions ---
    const validateCompanyRegNumber = (value: string) => {
        if (!value) return 'Company Registration Number is required';
        if (value.length !== 21) return 'Must be exactly 21 characters';
        if (!/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(value)) {
            return 'Must follow CIN format: L/U + 5 digits (industry) + 2 letters (state) + 4 digits (year) + 3 letters (type) + 6 digits (reg number)';
        }
        return true;
    };

    const validateWebsite = (value: string) => {
        if (!value) return 'Website is required';
        if (!value.startsWith('https://')) return 'Website must use HTTPS';
        try {
            const url = new URL(value);
            if (!url.hostname.includes('.') || url.hostname.includes('localhost')) {
                return 'Must be a valid domain with a TLD (e.g., .com, .co.in)';
            }
        } catch {
            return 'Must be a valid URL';
        }
        return true;
    };

    const validateContactInfo = (value: string) => {
        if (!value) return 'Contact information is required';
        if (!/^[A-Za-z\s.]+,\s*[A-Za-z\s.&-]+,\s*\+?[0-9\s-]+$/.test(value)) {
            return 'Must include name, business name, and phone number (e.g., John Doe, Acme Corp, +91 123 456 7890)';
        }
        return true;
    };
    const validateAddress = (value: string) => {
        if (!value) return 'Address is required';
        if (!/^[A-Za-z0-9\s,.-]+,\s*[A-Za-z\s]+,\s*[0-9]{6}$/.test(value)) {
            return 'Must be a valid address with PIN code (e.g., 123 Main Road, Mumbai, 400001)';
        }
        return true;
    };
    // Validate Street Address (must contain a house/flat number + street name)
    const validateStreetAddress = (value: string) => {
        if (!value) return 'Street address is required';
        // Require at least one number (house/flat no.) and street text
        if (!/^[0-9A-Za-z]+\s+[A-Za-z0-9\s,.-]+$/.test(value)) {
            return 'Street address must include a house/flat number and street name (e.g., 575C IT Park Road)';
        }
        return true;
    };

    // Validate Country Code (must be exactly 2 letters, like IN, US, UK)
    const validateCountryCode = (value: string) => {
        if (!value) return 'Country code is required';
        if (!/^[A-Z]{2}$/.test(value)) {
            return 'Country code must be a valid 2-letter ISO code (e.g., IN, US)';
        }
        return true;
    };

    const validateBusinessUseCase = (value: string) => {
        if (!value) return 'Business use case is required';
        if (value.length < 20) return 'Please provide a detailed use case (minimum 20 characters)';
        if (value.toLowerCase().includes('resale') || value.toLowerCase().includes('sub-allocated')) {
            return 'Business use case cannot include resale or sub-allocation';
        }
        return true;
    };

    const validateFile = (file: File | null) => {
        if (!file) return 'File is required';
        if (file.size > 3 * 1024 * 1024) return 'File must be less than 3MB';
        if (file.type !== 'application/pdf') return 'File must be PDF only';
        return true;
    };

    const onSubmitHandler = async (data: FormData) => {
        try {
            console.log('Submitted Number Requirements:', data);
            if (onSubmit)
                await onSubmit(data);

        } catch (error) {
            console.error('Submission error:', error);
        }
    };
    //initAddressAutocomplete
    const initAddressAutocomplete = () => {
        const autocomplete = new window.google.maps.places.Autocomplete(
            document.getElementById("google-autocomplete"),
            {
                types: ["establishment"],
                fields: ["place_id", "name", "url"],
            }
        );

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.place_id) {
                const businessUrl = place.url;
                const businessName = place.name;
                setGoogleListing(businessUrl);
                setDisplayBusinessName(businessName);
                sessionStorage.setItem("googleListing", businessUrl);
                sessionStorage.setItem("displayBusinessName", businessName);
                fetchPlaceDetails(place.place_id);
            }
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (window.google?.maps?.places) {
                const input = document.getElementById("google-address-autocomplete");
                if (input) {
                    initAddressAutocomplete();
                    clearInterval(interval);
                }
            }
        }, 300);
    }, []);
    const handleAddressDataChange = (data: {
        business_name: string;
        phone_number: string;
        street_address: string;
        locality: string;
        country_code: string;
        first_name: string;
        last_name: string;
        postal_code: string;
        administrative_area: string;
    }) => {
        setValue('business_name', data.business_name, { shouldValidate: true });
        setValue('phone_number', data.phone_number, { shouldValidate: true });
        setValue('street_address', data.street_address, { shouldValidate: true });
        setValue('locality', data.locality, { shouldValidate: true });
        setValue('country_code', data.country_code, { shouldValidate: true });
        setValue('first_name', data.first_name, { shouldValidate: true });
        setValue('last_name', data.last_name, { shouldValidate: true });
        setValue('postal_code', data.postal_code, { shouldValidate: true });
        setValue('administrative_area', data.administrative_area, { shouldValidate: true });
    };
    // Parse contactInfo to extract first_name, last_name
    useEffect(() => {
        if (control._formValues.contactInfo) {
            const [name, ,] = control._formValues.contactInfo.split(',').map((s) => s.trim());
            const [firstName, ...lastNameParts] = name.split(' ');
            setValue('first_name', firstName || '', { shouldValidate: true });
            setValue('last_name', lastNameParts.join(' ') || '', { shouldValidate: true });
        }
    }, [control._formValues.contactInfo, setValue])
    //initAddressAutocomplete
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.google?.maps?.places) {
                const input = document.getElementById("google-address-autocomplete");
                if (input) {
                    initAddressAutocomplete();
                    clearInterval(interval);
                }
            }
        }, 300);

    }, []);
    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);
    return (

        <Paper 
            sx={{
                p: 4,
                mx: 'auto',
                borderRadius: 2,
            }}
            elevation={4}
            className="p-8  max-w-2xl mx-auto my-10 rounded-2xl "
        >
            <Typography variant="h5" gutterBottom>
                Requirements
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <form onSubmit={handleSubmit(onSubmitHandler)} >
                  <fieldset disabled={isSubmitting || requirementLoading} style={{ border: "none" }}>
                <Stack spacing={4}>
                    {/* Company Registration Number */}
                    <Box>
                        <Controller
                            name="companyRegNumber"
                            control={control}
                            rules={{ validate: validateCompanyRegNumber }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Company Registration Number"
                                    fullWidth
                                    error={!!errors.companyRegNumber}
                                    helperText={errors.companyRegNumber?.message}
                                />
                            )}
                        />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                            Example:(L12345MH2020PLC123456)Company Registration Number is of 21 digits that comprised of: 1st digit: The first digit out of 21 symbolic with L or U for listed or unlisted company. Next 5 digits: The next five digits show the industry to which company belongs to. Next 2 characters: State code. Next 4 digits: Year of registration. Next 3 characters: Ownership type (e.g., PLC). Last 6 digits: Registration number.
                        </Typography>
                    </Box>

                    {/* Proof of Address */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Proof of Address (National)
                        </Typography>
                        <Controller
                            name="proofOfAddress"
                            control={control}
                            rules={{ validate: validateFile }}
                            render={() => (
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<UploadFileIcon />}
                                    fullWidth
                                    sx={{ py: 1.5, backgroundColor: 'black', color: 'white' }}
                                >
                                    Add Document
                                    <input
                                        type="file"
                                        hidden
                                        accept=".pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setValue('proofOfAddress', file, { shouldValidate: true });
                                        }}
                                    />
                                </Button>
                            )}
                        />
                        {errors.proofOfAddress && (
                            <Typography variant="caption" color="error">
                                {errors.proofOfAddress.message}
                            </Typography>
                        )}
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                            Example: Utility bill or invoice
                        </Typography>
                    </Box>

                    {/* Company Website */}
                    <Box>
                        <Controller
                            name="companyWebsite"
                            control={control}
                            rules={{ validate: validateWebsite }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Company Website"
                                    placeholder="https://telnyx.com/"
                                    fullWidth
                                    error={!!errors.companyWebsite}
                                    helperText={errors.companyWebsite?.message}
                                />
                            )}
                        />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                            Example: https://telnyx.com/
                        </Typography>
                    </Box>

                    {/* Contact Info */}
                    <Box>
                        <Controller
                            name="contactInfo"
                            control={control}
                            rules={{ validate: validateContactInfo }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Contact Info"
                                    placeholder="Name, business name, and contact phone numbers"
                                    fullWidth
                                    error={!!errors.contactInfo}
                                    helperText={errors.contactInfo?.message}
                                />
                            )}
                        />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                            Example:(John Doe, Acme Corp, +91 987654320)Name, business name, and contact phone numbers
                        </Typography>
                    </Box>

                    {/* ID or Passport Copy */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            ID or Passport Copy/Company Registration Certificate
                        </Typography>
                        <Controller
                            name="passportOrCert"
                            control={control}
                            rules={{ validate: validateFile }}
                            render={() => (
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<UploadFileIcon />}
                                    fullWidth
                                    sx={{ py: 1.5, backgroundColor: 'black', color: 'white' }}
                                >
                                    Add Document
                                    <input
                                        type="file"
                                        hidden
                                        accept=".pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setValue('passportOrCert', file, { shouldValidate: true });
                                        }}
                                    />
                                </Button>
                            )}
                        />
                        {errors.passportOrCert && (
                            <Typography variant="caption" color="error">
                                {errors.passportOrCert.message}
                            </Typography>
                        )}
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                            Example: Passport copy or copy of company registration
                        </Typography>
                    </Box>

                    {/* Address */}

                    {/* // NumberRequirements.tsx (Address field section) */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Address (National)
                        </Typography>
                        <Box display="flex" gap={2} alignItems="flex-start">
                            <Controller
                                name="address"
                                control={control}
                                // rules={{ validate: validateAddress }}
                                render={({ field, fieldState: { error } }) => (
                                    <AddressAutocomplete
                                        address={field.value}
                                        setAddress={(value) => {
                                            field.onChange(value); // Update React Hook Form
                                            setValue('address', value, { shouldValidate: true }); // Trigger validation
                                        }}
                                        // error={!!error}
                                        // helperText={error?.message}
                                        onAddressDataChange={handleAddressDataChange}
                                    />
                                )}
                            />
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                            Example: Address must be in the same country as the ordered number
                        </Typography>
                    </Box>
                    {/* {Object.values(addressData).some((val) => val) && (

                    )} */}
                    {/* Additional Fields */}

                    {address && <Stack spacing={2} sx={{ mt: 3 }}>
                        {/* First Name */}
                        <Controller
                            name="first_name"
                            control={control}
                            rules={{ required: 'First name is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="First Name"
                                    fullWidth
                                    error={!!errors.first_name}
                                    helperText={errors.first_name?.message}
                                />
                            )}
                        />
                        {/* Last Name */}
                        <Controller
                            name="last_name"
                            control={control}
                            rules={{ required: 'Last name is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Last Name"
                                    fullWidth
                                    error={!!errors.last_name}
                                    helperText={errors.last_name?.message}
                                />
                            )}
                        />
                        {/* Business Name */}
                        <Controller
                            name="business_name"
                            control={control}
                            rules={{ required: 'Business name is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Business Name"
                                    fullWidth
                                    error={!!errors.business_name}
                                    helperText={errors.business_name?.message}
                                />
                            )}
                        />
                        {/* Phone Number */}
                        <Controller
                            name="phone_number"
                            control={control}
                            rules={{ required: 'Phone number is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone Number"
                                    fullWidth
                                    error={!!errors.phone_number}
                                    helperText={errors.phone_number?.message}
                                />
                            )}
                        />
                        {/* Street Address */}
                        <Controller
                            name="street_address"
                            control={control}
                            rules={{ validate: validateStreetAddress }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Street Address"
                                    fullWidth
                                    error={!!errors.street_address}
                                    helperText={errors.street_address?.message}
                                />
                            )}
                        />
                        {/* Locality */}
                        <Controller
                            name="locality"
                            control={control}
                            rules={{ required: 'Locality is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Locality"
                                    fullWidth
                                    error={!!errors.locality}
                                    helperText={errors.locality?.message}
                                />
                            )}
                        />
                        {/* Administrative Area */}
                        <Controller
                            name="administrative_area"
                            control={control}
                            rules={{ required: 'Administrative area is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="State / Administrative Area"
                                    fullWidth
                                    error={!!errors.administrative_area}
                                    helperText={errors.administrative_area?.message}
                                />
                            )}
                        />
                        {/* Postal Code */}
                        <Controller
                            name="postal_code"
                            control={control}
                            rules={{ required: 'Postal code is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Postal Code"
                                    fullWidth
                                    error={!!errors.postal_code}
                                    helperText={errors.postal_code?.message}
                                />
                            )}
                        />
                        {/* Country */}
                        <Controller
                            name="country_code"
                            control={control}
                            rules={{ validate: validateCountryCode }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Country"
                                    fullWidth
                                    error={!!errors.country_code}
                                    helperText={errors.country_code?.message}
                                />
                            )}
                        />
                    </Stack>}


                    {/* Business Use Case */}
                    <Box>
                        <Controller
                            name="businessUseCase"
                            control={control}
                            rules={{ validate: validateBusinessUseCase }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Business Use Case"
                                    placeholder="This number will be used as the main contact line for my florist shop"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={!!errors.businessUseCase}
                                    helperText={errors.businessUseCase?.message}
                                />
                            )}
                        />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                            Example:(This number will be used as the main contact line for my flower shop.) This number will be used as the main contact line for my florist shop and will not be sub-allocated.
                        </Typography>
                    </Box>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting || requirementLoading}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            fontWeight: 'bold',
                            borderRadius: 2,
                            backgroundColor: '#808080',
                            color: 'white',
                        }}
                    >
                        {(isSubmitting || requirementLoading) ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </Stack>
                </fieldset>
            </form>
        </Paper>
    );
};

export default NumberRequirements;