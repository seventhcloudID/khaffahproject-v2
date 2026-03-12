import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Screen from "../layout/screen";

interface Props {
  header: { title: string; description: string };
  faq: Array<{ question: string; answer: React.ReactElement }>;
}

export const Faq = (props: Props) => {
  return (
    <>
      <Screen className="px-4 md:px-0 py-12">
        <div className="space-y-1">
          <h1 className="text-14 md:text-16 lg:text-20 font-bold">
            {props.header.title}
          </h1>
          <p className="text-xs md:text-sm lg:text-16 text-khaffah-neutral-dark">
            {props.header.description}
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          {props.faq.map((item, key) => {
            return (
              <AccordionItem key={key} value={`item-${(key + 1).toString()}`}>
                <AccordionTrigger className="text-black text-12 md:text-14 lg:text-16">
                  {item?.question}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance text-12 md:text-14 lg:text-16">
                  <>{item?.answer}</>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Screen>
    </>
  );
};
