"use client";

import { IScreen } from "@/typing/components";
import Image from "next/image";

const Screen = (props: IScreen) => {
  return (
    <section
      key={props.id}
      id={props.id}
      className={`flex flex-col items-center ${props?.className ?? null}`}
      style={{
        backgroundColor: props.color,
      }}
    >
      {props.image ? (
        <Image
          fill
          priority={props?.imagePriority ? true : false}
          src={props?.image}
          alt="BackgroundImage"
          className={props?.imageClassName}
        />
      ) : null}
      <div className="max-w-xl sm:max-w-3xl lg:max-w-4xl xl:max-w-7xl 2xl:max-w-[80rem] duration-100 flex flex-col grow w-full h-full">
        {props.children}
      </div>
    </section>
  );
};

export default Screen;
