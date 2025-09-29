import React, { useState, useEffect, useRef } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Stack, Paper, FormControl, InputLabel, Select, MenuItem,
    RadioGroup, FormControlLabel, Radio, Box, TextField, Button, Alert, CircularProgress,
    Snackbar
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import PhoneIcon from "@mui/icons-material/Phone";
import SearchIcon from "@mui/icons-material/Search";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { buyNumberFromEnterPrise, fetchAvailablePhoneNumberByCountry, numberRequirementsToBuyNumber } from "../../../Services/phoneNumbers";
import RefreshIcon from "@mui/icons-material/Refresh";
import decodeToken from "lib/decodeToken";
import NumberRequirements from "./NumberRequirements";
import { AlertColor } from "@mui/material";
const BuyPhoneNumberModal = ({ open, onClose, onSubmit, countries }) => {
    const [formData, setFormData] = useState({
        provider: "telnyx",
        country: "US",
        numberType: "local",
        searchQuery: "",
        phoneNumber: ""
    });
    const token = localStorage.getItem("authToken")
    const userDetails = decodeToken(token)
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState(false);

    const [showRequirements, setShowRequirements] = useState(false);
    const [requirementsData, setRequirementsData] = useState([])
    const [requirementLoading, setRequirementLoading] = useState(false)
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: '',
        severity: 'info'
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    console.log(requirementsData, "requirementsData")
    const contentRef = useRef<HTMLDivElement | null>(null);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const fetchNumbers = async (country = formData.country, type = formData.numberType) => {
        setLoading(true);
        try {
            const res = await fetchAvailablePhoneNumberByCountry(
                token,
                country,
                "",
                "",
                "",
                "",
                type
            );
            setAvailableNumbers(res.data || []);
        } catch (err) {
            console.error("Error fetching numbers:", err);
            setAvailableNumbers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        const country_code = formData.country
        const locality = ""
        const administrative_area = ""
        const getRandomDigit = () => Math.floor(Math.random() * 9 + 1).toString();
        const startsWith = getRandomDigit();
        const endsWith = getRandomDigit();
        const phone_number_type = formData.numberType
        try {
            const res = await fetchAvailablePhoneNumberByCountry(
                token, country_code, locality, administrative_area, startsWith, endsWith, phone_number_type
            );
            setAvailableNumbers(res.data || []);
        } catch (error) {
            console.error("Error refreshing numbers:", error);
            setAvailableNumbers([]);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.phoneNumber) return;
        const userId = userDetails?.user?.id
        const phoneNumber = formData.phoneNumber
        const phone_number_type = formData.numberType
        const import_type = "phone"
        setPurchaseLoading(true)
        try {
            const res = await buyNumberFromEnterPrise(token, userId, phoneNumber
                , phone_number_type, "", "", "", "", "", import_type)

            if (res.success) {
                setSnackbar({
                    open: true,
                    message: res?.message,
                    severity: 'success'
                });
                setTimeout(() => {
                    onClose();
                    onSubmit()
                }, 1000);
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || "Something went wrong, please try again.",
                severity: 'error'
            });
        } finally {
            setPurchaseLoading(false)
        }
    }
    const handleRequirementSubmit = async (data) => {
        try {
            setRequirementLoading(true)
            const userId = userDetails?.user?.id
            const country_code = formData.country
            const phone_number_type = formData.numberType
            const phoneNumber = formData.phoneNumber
            const import_type = "phone"
            const response = await numberRequirementsToBuyNumber(token, userId, country_code, phone_number_type, phoneNumber, data, import_type)
            // console.log(response.data.message)
            if (response) {
                setSnackbar({
                    open: true,
                    message: response?.data?.message,
                    severity: 'success'
                });
                setShowRequirements(false);
                setTimeout(() => {
                    onClose();
                    onSubmit()
                }, 2000);
            }
        } catch (error) {
            console.error("Frontend error:", error.response?.data || error.message);

            setSnackbar({
                open: true,
                message: error.response?.data?.message || "Something went wrong, please try again.",
                severity: 'error'
            });
        } finally {
            setRequirementLoading(false)
        }
    }
    // Auto-fetch numbers when modal opens
    useEffect(() => {
        if (open) fetchNumbers();
    }, [open]);

    // Auto-fetch numbers when number type changes
    useEffect(() => {
        if (open) fetchNumbers(formData.country, formData.numberType);
    }, [formData.numberType, formData.country]);
    useEffect(() => {
        const container = document.querySelector(".MuiDialogContent-root");
        if (container) container.scrollTop = 0;
    }, [])
    return (
        <Dialog open={open} onClose={(event, reason) => {
            if (reason !== "backdropClick") {
                onClose();
            }
        }} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h5" fontWeight="bold">Buy Phone Number</Typography>
                <Typography variant="body2" color="text.secondary">
                    Purchase a new phone number from your preferred provider
                </Typography>
            </DialogTitle>

            {!showRequirements ? <form onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 3 }}>
                    <Stack spacing={3}>
                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Country</InputLabel>
                                <Select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    label="Country"
                                >
                                    {countries.map((country) => (
                                        <MenuItem key={country.value} value={country.value}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <span>{country.flag}</span>
                                                <span>{country.label}</span>
                                            </Stack>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Paper>


                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                                Number Type
                            </Typography>
                            <RadioGroup
                                row
                                name="numberType"
                                value={formData.numberType}
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value="local"
                                    control={<Radio />}
                                    label={
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <PhoneIcon fontSize="small" />
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">Local</Typography>
                                                {/* <Typography variant="caption" color="text.secondary">$2/month</Typography> */}
                                            </Box>
                                        </Stack>
                                    }
                                />
                                {formData.country !== "GB" && <FormControlLabel
                                    value="toll_free"
                                    control={<Radio />}
                                    label={
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <PhoneIcon fontSize="small" color="warning" />
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">Toll-free</Typography>
                                                {/* <Typography variant="caption" color="text.secondary">$5/month</Typography> */}
                                            </Box>
                                        </Stack>
                                    }
                                />}
                            </RadioGroup>
                        </Paper>


                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                                Available Numbers
                            </Typography>

                            <Stack direction="row" spacing={2} alignItems="end" mb={2}>
                                <TextField
                                    fullWidth
                                    label="Filter numbers"
                                    name="searchQuery"
                                    value={formData.searchQuery}
                                    onChange={handleChange}
                                    placeholder="Enter area code or partial number"
                                    variant="outlined"
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<RefreshIcon />}
                                    onClick={handleRefresh}
                                    sx={{
                                        minWidth: 140,
                                        height: 40,
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        '&:hover': { boxShadow: 4 }
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? "Refreshing..." : "Refresh"}
                                </Button>
                            </Stack>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : formData.phoneNumber ? (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    Selected Number: {formData.phoneNumber}
                                </Alert>
                            ) : null}

                            <Box sx={{ mt: 2, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
                                {availableNumbers
                                    .filter((num) => num.phone_number.includes(formData.searchQuery))
                                    .map((num) => (
                                        <Paper
                                            key={num.id}
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                borderColor: formData.phoneNumber === num.phone_number ? 'primary.main' : 'grey.300',
                                                bgcolor: formData.phoneNumber === num.phone_number ? 'primary.lighter' : 'background.paper',
                                                '&:hover': { bgcolor: 'grey.100' },
                                                borderRadius: 2,
                                                boxShadow: 1
                                            }}
                                            onClick={() => handleChange({ target: { name: 'phoneNumber', value: num.phone_number } })}
                                        >
                                            <Typography variant="subtitle2" fontWeight="medium">{num.phone_number}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {num.phone_number_type === 'local' ? 'Local' : 'Toll-free'}
                                            </Typography>
                                            {formData.phoneNumber === num.phone_number && (
                                                <Typography variant="caption" color="primary" sx={{ display: 'block' }}>Selected</Typography>
                                            )}
                                        </Paper>
                                    ))}
                            </Box>
                        </Paper>

                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3, flexDirection: "column", alignItems: "stretch" }}>
                    {formData.country === "GB" && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Documents Required before purchasing a UK number
                        </Alert>
                    )}
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button onClick={onClose} variant="outlined">Cancel</Button>
                        {formData.country === "GB" ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setShowRequirements(true)} // 👈 open UK form
                                disabled={!formData.phoneNumber}
                            >
                                Requirements
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!formData.phoneNumber}
                                startIcon={<CreditCardIcon />}
                            >

                                {(purchaseLoading) ? (
                                    <>   Please wait   <CircularProgress size={24} color="inherit" /></>
                                ) : (
                                    ' Purchase Number'
                                )}
                            </Button>
                        )}
                    </Stack>
                </DialogActions>

            </form> :
                // <DialogContent sx={{ p: 3, maxHeight: "80vh", overflowY: "auto" }}>

                // </DialogContent>
                <div>

                    <NumberRequirements
                        onSubmit={(data) => {
                            handleRequirementSubmit(data)

                        }}
                        requirementLoading={requirementLoading}
                    />


                </div>
            }
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
        </Dialog>

    );
};

export default BuyPhoneNumberModal;
