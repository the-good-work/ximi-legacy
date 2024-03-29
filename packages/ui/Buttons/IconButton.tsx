import { keyframes } from "@stitches/react";
import React, { MouseEventHandler, ReactNode } from "react";
import { styled } from "../theme/theme";

const spin = keyframes({
  from: { transform: "rotate(0)" },
  to: { transform: "rotate(360deg)" },
});

const StyledButton = styled("button", {
  aspectRatio: 1,
  span: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "$2xs",
  },
  "&:hover": {
    cursor: "pointer",
    backgroundColor: "$accent-translucent",
  },
  variants: {
    iconSize: {
      sm: {
        span: {
          svg: {
            width: "$sm",
            height: "auto",
          },
        },
      },
      md: {
        span: {
          svg: {
            width: "$md",
            height: "auto",
          },
        },
      },
      lg: {
        span: {
          svg: {
            width: "$lg",
            height: "auto",
          },
        },
      },
      xl: {
        span: {
          svg: {
            width: "$xl",
            height: "auto",
          },
        },
      },
    },
    state: {
      default: {
        span: { path: { fill: "$text" } },
      },
      loading: {
        animation: `${spin} ease-in-out 500ms infinite`,
      },
      active: {
        span: { path: { fill: "$accent" } },
      },
      disabled: {
        span: { path: { fill: "$grey" } },
        pointerEvents: "none",
      },
    },
    variant: {
      solid: {
        borderRadius: "$xs",
        border: "2px solid $brand",
        backgroundColor: "$background",
        color: "$text",
      },
      outline: {
        borderRadius: "$xs",
        border: "1px solid $brand",
        backgroundColor: "transparent",
        color: "$text",
      },
      ghost: {
        borderRadius: "$xs",
        border: "none",
        backgroundColor: "transparent",
        color: "$text",
      },
    },
  },
  defaultVariants: {
    variant: "solid",
    iconSize: "sm",
    state: "default",
  },
});

export default function IconButton({
  icon,
  iconSize,
  css,
  disabled,
  onClick,
  state = "default",
  variant = "solid",
  ...props
}: {
  icon: ReactNode;
  disabled?: boolean;
  iconSize: any;
  state?: "default" | "loading" | "active" | "disabled";
  props?: any;
  variant?: "solid" | "ghost" | "outline";
  css?: any;
  onClick?: MouseEventHandler;
}) {
  return (
    <StyledButton
      state={state}
      iconSize={iconSize}
      variant={variant}
      onClick={onClick}
      css={css}
      {...props}
    >
      <div aria-hidden="true">{icon}</div>
    </StyledButton>
  );
}
