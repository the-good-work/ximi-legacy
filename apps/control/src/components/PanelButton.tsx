import React, { ReactNode, MouseEventHandler } from "react";
import Button from "ui/Buttons/Button";

import { styled } from "ui/theme/theme";

const StyledPanelButton = styled(Button, {
  textTransform: "uppercase",
  borderRadius: 0,
  variants: {
    active: {
      true: {
        span: {
          color: "$accent",
        },
        border: "2px solid $brand",
        borderLeft: "none",
        background: "none",
        backgroundColor: "transparent",
        ".icon": {
          span: {
            path: { fill: "$accent" },
          },
        },
      },
      false: {
        border: "none",
        borderRadius: 0,
        color: "$text",
        borderLeft: "2px solid $brand",
        background: "none",
        backgroundColor: "transparent",
        ".icon": {
          span: {
            path: { fill: "$text" },
          },
        },
      },
    },
  },
  defaultVariants: {
    active: false,
  },
});

export default function PanelButton({
  children,
  active,
  onClick,
  icon,
  css,
}: {
  children: ReactNode;
  active: boolean;
  onClick?: MouseEventHandler;
  icon?: ReactNode;
  css?: any;
}) {
  return (
    <StyledPanelButton
      css={css}
      icon={icon}
      onClick={onClick}
      children={children}
      active={active}
    />
  );
}