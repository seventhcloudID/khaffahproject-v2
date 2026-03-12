import Screen from "@/components/layout/screen";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  titleClassName: string;
  svgClassName: string;
  description: string;
}

export const Note = (props: Props) => {
  return (
    <>
      <Screen className="px-4 bg-white">
        <div className="p-4 rounded-2xl border-[0.5px]">
          <div className="flex items-center gap-4">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
              className={cn(props.svgClassName)}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18 9C18 4.0293 13.9707 0 9 0C4.0293 0 0 4.0293 0 9C0 13.9707 4.0293 18 9 18C13.9707 18 18 13.9707 18 9ZM9 4.5C9.23869 4.5 9.46761 4.59482 9.6364 4.7636C9.80518 4.93239 9.9 5.1613 9.9 5.4V9.9C9.9 10.1387 9.80518 10.3676 9.6364 10.5364C9.46761 10.7052 9.23869 10.8 9 10.8C8.7613 10.8 8.53239 10.7052 8.3636 10.5364C8.19482 10.3676 8.1 10.1387 8.1 9.9V5.4C8.1 5.1613 8.19482 4.93239 8.3636 4.7636C8.53239 4.59482 8.7613 4.5 9 4.5ZM8.1 12.6C8.1 12.3613 8.19482 12.1324 8.3636 11.9636C8.53239 11.7948 8.7613 11.7 9 11.7H9.0072C9.2459 11.7 9.47481 11.7948 9.6436 11.9636C9.81238 12.1324 9.9072 12.3613 9.9072 12.6C9.9072 12.8387 9.81238 13.0676 9.6436 13.2364C9.47481 13.4052 9.2459 13.5 9.0072 13.5H9C8.7613 13.5 8.53239 13.4052 8.3636 13.2364C8.19482 13.0676 8.1 12.8387 8.1 12.6Z"
              />
            </svg>
            <div className="text-12 md:text-14 lg:text-16">
              <p className={cn(props.titleClassName)}>{props.title}</p>
              {/* <p className="text-khaffah-neutral-dark">
                Proses pengajuan Anda akan dikonfirmasi oleh tim kami paling
                lambat 1x24 jam.
              </p> */}
              <p className="text-khaffah-neutral-dark">{props.description}</p>
            </div>
          </div>
        </div>
      </Screen>
    </>
  );
};
