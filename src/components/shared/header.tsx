import { Icon } from "@/components/icon";
import Link from "next/link";
interface Props {
  title: string;
  description: string;
  link?: string;
}

export const Header = (props: Props) => {
  return (
    <div className="flex items-center gap-4 justify-between">
      <div className="space-y-1">
        <h1 className="text-20 md:text-24 lg:text-36 font-bold">
          {props.title}
        </h1>
        <p className="text-xs md:text-sm lg:text-16 text-khaffah-neutral-dark hidden md:block">
          {props.description}
        </p>
      </div>
      {props.link && props.link.trim() ? (
        <div>
          <Link href={props.link}>
            <div className="bg-khaffah-primary/20 flex items-center gap-2 w-fit px-6 py-3 rounded-xl">
              <p className="text-khaffah-primary text-xs md:text-sm lg:text-16 font-bold whitespace-nowrap">
                Lihat Semua
              </p>
              <Icon name="ArrowRight" className="fill-khaffah-primary" />
            </div>
          </Link>
        </div>
      ) : null}
    </div>
  );
};
