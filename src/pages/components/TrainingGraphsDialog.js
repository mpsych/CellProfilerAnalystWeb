import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";

export default function TrainingGraphsFunction(props) {
  return (
    <Dialog fullWidth={500} open={props.open}>
      <DialogTitle>Training the Classifier</DialogTitle>
      <DialogContent>
        <div width={300} ref={props.graph1DivRef} />
        <div width={300} ref={props.graph2DivRef} />
      </DialogContent>
    </Dialog>
  );
}
