import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import { Button, TextField } from "@material-ui/core";

import React from "react";

export default function ImageFetchDialog(props) {
  const [currentValue, setCurrentValue] = React.useState(1);
  return (
    <Dialog open={props.open} onClose={props.onCancel}>
      <DialogTitle>Fetch By Image</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select the image number you would like to fetch from.
        </DialogContentText>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            props.onSubmit();
          }}
        >
          <FormControl>
            <TextField
              onChange={(event) => {
                const value = event.target.value;
                if (value === null || value === undefined || value === "") {
                  return;
                }

                props.onChangeValue(value);
                setCurrentValue(parseInt(value));
              }}
              type="number"
              inputProps={{ step: 1, min: 1 }}
              value={currentValue}
              label="Image Number"
            ></TextField>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onSubmit} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
