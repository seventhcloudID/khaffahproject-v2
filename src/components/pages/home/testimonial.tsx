import Screen from "@/components/layout/screen";
import { elMessiri } from "@/components/font/elmessiri";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import TestimonialCard from "./testimonial_card";
import { Icon } from "@/components/icon";
const HomeTestimonial = () => {
  return (
    <Screen className="px-4 md:px-0 bg-khaffah-neutral-light py-8 md:py-10 lg:py-14">
      <div className="flex w-full gap-4 md:gap-14 flex-col lg:flex-row items-center lg:justify-between">
        <div className="whitespace-nowrap flex flex-col items-center">
          <div className="space-y-2 flex flex-row-reverse lg:flex-col gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Star" className="w-6 h-6" />
              <Icon name="Star" className="w-6 h-6" />
              <Icon name="Star" className="w-6 h-6" />
              <Icon name="Star" className="w-6 h-6" />
              <Icon name="Star" className="w-6 h-6" />
            </div>
            <p className={`text-64 font-bold ${elMessiri.className}`}>5.0</p>
          </div>
          <p className="text-16">dari 1.848 jemaah</p>
        </div>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-2/3 md:basis-2/4 lg:basis-2/4 xl:basis-1/3 py-1"
              >
                <TestimonialCard type="testimonial" />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious /> */}
          {/* <CarouselNext /> */}
        </Carousel>
      </div>
    </Screen>
  );
};

export default HomeTestimonial;
