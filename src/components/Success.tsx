import React, { type SVGAttributes } from "react";

interface SvgCheckAnimationProps extends SVGAttributes<SVGElement> {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Success(props: SvgCheckAnimationProps) {
  const { size, width, height, className, style, color, ...rest } = props;
  return (
    <svg
      width={width ?? size ?? 115}
      height={height ?? size ?? 115}
      viewBox="0 0 133 133"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      {...rest}
    >
      <g id="check-group" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <circle id="filled-circle" fill={color ?? "#07b481"} cx="66.5" cy="66.5" r="54.5" />
        <circle id="white-circle" fill="#FFFFFF" cx="66.5" cy="66.5" r="55.5" />
        <circle id="outline" stroke={color ?? "#07b481"} strokeWidth="4" cx="66.5" cy="66.5" r="54.5" />
        <polyline id="check" stroke="#FFFFFF" strokeWidth="5.5" points="41 70 56 85 92 49" />
      </g>
    </svg>
  );
}
