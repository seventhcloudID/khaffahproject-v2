"use client";

import Image from "next/image";
import * as React from "react";

type Props = {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
  bgClassName?: string;
  textClassName?: string;
};

export function AvatarCircle({
  name,
  src,
  size = 96,
  className = "",
  bgClassName = "bg-khaffah-primary/10",
  textClassName = "text-khaffah-primary",
}: Props) {
  const [error, setError] = React.useState(false);
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "A";

  const diameter = `${size}px`;

  const canShowImg = Boolean(src) && !error;

  return (
    <div
      className={[
        "relative overflow-hidden rounded-full grid place-content-center select-none",
        bgClassName,
        className,
      ].join(" ")}
      style={{ width: diameter, height: diameter }}
      aria-label={name ? `Avatar ${name}` : "Avatar"}
    >
      {canShowImg ? (
        <Image
          src={src!}
          width={100}
          height={100}
          alt={name || "avatar"}
          className="h-full w-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span
          className={["font-bold", textClassName].join(" ")}
          style={{ fontSize: Math.round(size * 0.38) }}
        >
          {initial}
        </span>
      )}
    </div>
  );
}
