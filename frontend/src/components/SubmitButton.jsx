// C:\Users\hp\OneDrive\Desktop\28 jan skyway\skywayitsolution\frontend\src\components\SubmitButton.jsx

import React from "react";
import { Button, CircularProgress } from "@mui/material";

/**
 * Reusable Submit Button
 *
 * Props:
 * - isSubmitting  : boolean  → button disable + loader dikhao
 * - label         : string   → normal state text  (default: "Submit")
 * - loadingLabel  : string   → loading state text (default: "Please wait...")
 * - color         : string   → MUI color          (default: "success")
 * - fullWidth     : boolean  → full width button  (default: true)
 */
const SubmitButton = ({
    isSubmitting,
    label = "Submit",
    loadingLabel = "Please wait...",
    color = "success",
    fullWidth = true,
}) => {
    return (
        <Button
            type="submit"
            variant="contained"
            color={color}
            fullWidth={fullWidth}
            size="large"
            disabled={isSubmitting}
            className="transition-all duration-200"
            style={{
                height: "56px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                backgroundColor: isSubmitting ? "#81c784" : undefined,
            }}
        >
            {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                    <CircularProgress size={24} color="inherit" />
                    <span className="font-bold tracking-wider">{loadingLabel}</span>
                </div>
            ) : (
                <span className="font-bold tracking-wider">{label}</span>
            )}
        </Button>
    );
};

export default SubmitButton;