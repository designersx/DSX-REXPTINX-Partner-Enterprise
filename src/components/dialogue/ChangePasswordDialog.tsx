"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Button,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { Eye, EyeSlash } from "@wandersonalwes/iconsax-react";
import axios from "axios";
import { getUserId } from "utils/auth";

export default function ChangePasswordDialog({ open, onClose }) {
  const userId = getUserId();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    apiError: "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", apiError: "" });
    setSuccessMsg(""); // reset success on input change
  };

  const toggleShow = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors: any = {};

    if (!formData.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword) newErrors.newPassword = "New password is required";
    else if (formData.newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      return setErrors({ ...errors, ...newErrors });
    }

    try {
      setLoading(true);

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/endusers/updateUserPassword/${userId}`,
        {
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      );

      if (res.data.status) {
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setErrors({ currentPassword: "", newPassword: "", confirmPassword: "", apiError: "" });
        setSuccessMsg("Password updated successfully!"); // show success alert
      }
    } catch (err) {
      setErrors({
        ...errors,
        apiError: err.response?.data?.error || "Failed to update password",
      });
      setSuccessMsg("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
          setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });

        }
      }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Change Password</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            {/* Success Message */}
            {successMsg && (
              
                
              <Alert variant="filled" severity="info">
  {successMsg}
</Alert>
            )}

            {/* API Error (top-level) */}
            {errors.apiError && (
              <p style={{ color: "red", fontSize: "0.9rem", margin: 0 }}>
                {errors.apiError}
              </p>
            )}

            {/* Current Password */}
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type={showPassword.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleChange}
              error={Boolean(errors.currentPassword)}
              helperText={errors.currentPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => toggleShow("current")}>
                      {showPassword.current ? <Eye /> : <EyeSlash />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* New Password */}
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type={showPassword.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              error={Boolean(errors.newPassword)}
              helperText={errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => toggleShow("new")}>
                      {showPassword.new ? <Eye /> : <EyeSlash />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => toggleShow("confirm")}>
                      {showPassword.confirm ? <Eye /> : <EyeSlash />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button   onClick={() => {
                onClose(); 
                setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" }); // form reset
            }}
          disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

