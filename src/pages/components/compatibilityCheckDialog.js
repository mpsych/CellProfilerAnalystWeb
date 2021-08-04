import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { useEffect, useState } from "react";

export default function CompatibilityCheck() {
  const [hasCompatError, setHasCompatError] = useState(false);
  useEffect(() => {
    if (
      typeof OffscreenCanvas === "undefined" ||
      typeof ImageBitmap === "undefined" ||
      typeof Worker === "undefined" ||
      typeof indexedDB === "undefined"
    ) {
      setHasCompatError(true);
    }
  }, []);
  return (
    <Dialog fullWidth={1000} open={hasCompatError}>
      <DialogTitle>Compatibility Error:</DialogTitle>
      <DialogContentText
        align="center"
        style={{ marginLeft: 20, marginRight: 20 }}
      >
        {
          "Your browser is not compatible with this app. Please use an up-to-date version of Edge or Chrome."
        }
      </DialogContentText>
    </Dialog>
  );
}
