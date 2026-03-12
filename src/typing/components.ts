import { StaticImageData } from "next/image";
import { PropsWithChildren } from "react";

export interface IScreen extends PropsWithChildren {
  id?: string;
  image?: string | StaticImageData;
  imageClassName?: string;
  imagePriority?: boolean;
  color?: string;
  className?: string;
}
