import React, { useState } from "react";
import { Box, InputBase, MenuItem } from "@material-ui/core";
import { ArrowRightAltRounded } from "@material-ui/icons";
import IconButton from "./IconButton";

interface Props {
  label: string;
  onSubmited: (value: string) => void;
  validate?: (value: any) => boolean | string;
}

function MenuItemWithTextField({ label, validate = () => true, onSubmited }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (newValue: string) => {
    setValue(newValue);

    if (!newValue) {
      setError("");
      return;
    }

    const result = validate(newValue);

    if (result === false) {
      setError("Invalid");
    } else if (result === true) {
      setError("");
    } else {
      setError(result);
    }
  };

  const handleSubmit = () => {
    if (value && !error) {
      onSubmited(value);
    }
  };

  return (
    <MenuItem style={{ backgroundColor: "transparent", display: "block" }}>
      <Box
        bgcolor="rgba(0,0,0,0.1)"
        position="relative"
        border="solid 1px"
        borderColor={error ? "rgba(255,0,0,0.5)" : "transparent"}
        px={2}
        py={1}
      >
        <InputBase
          placeholder={label}
          value={value}
          error={Boolean(error)}
          onChange={event => {
            handleChange(event.target.value);
          }}
          onKeyDown={event => {
            event.stopPropagation();
          }}
          onKeyUp={event => {
            event.stopPropagation();

            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
        />

        <Box
          position="absolute"
          visibility={Boolean(value) ? "visible" : "hidden"}
          top={11}
          right={11}
          bgcolor="rgba(0,0,0,0.1)"
        >
          <IconButton
            size="small"
            disabled={!Boolean(value) || Boolean(error)}
            onClicked={() => {
              handleSubmit();
            }}
          >
            <ArrowRightAltRounded fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Box color="red" fontSize={12} mt={1} ml={1}>
          {error}
        </Box>
      )}
    </MenuItem>
  );
}

export default MenuItemWithTextField;
