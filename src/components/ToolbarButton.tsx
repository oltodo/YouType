import React from "react";
import { SvgIconProps } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "components/IconButton";

interface Props {
  tooltip: string;
  icon: React.FunctionComponent<SvgIconProps>;
  disabled: boolean;
  onClicked: () => void;
}

const ToolbarButton = ({ tooltip, icon: Icon, disabled, onClicked }: Props) => {
  return (
    <Tooltip title={tooltip} placement="top">
      <span>
        <IconButton onClicked={onClicked} disabled={disabled}>
          <Icon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ToolbarButton;
