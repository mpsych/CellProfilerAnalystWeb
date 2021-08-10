import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function cellBigPictureDialog(props) {
  return (
    <Dialog
      style={{ alignItems: "center" }}
      onClose={props.onClose}
      open={props.open}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent style={{ alignItems: "center", justifyContent: "center" }}>
        <img width={430} height={430} src={props.src}></img>
      </DialogContent>
    </Dialog>
  );
}
