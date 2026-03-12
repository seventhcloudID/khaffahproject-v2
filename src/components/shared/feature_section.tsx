import Screen from "@/components/layout/screen";

interface Feature {
  title: string;
  description: string;
}

interface Props extends Feature {
  feature: Array<{ icon: React.ReactElement } & Feature>;
}

export const FeatureSection = (props: Props) => {
  return (
    <Screen className="py-10 px-4 md:px-0 bg-white">
      <div className="space-y-8">
        <div className="space-y-8">
          <div className="w-full text-center flex justify-center gap-2 items-center flex-col">
            <p className="text-20 md:text-24 lg:text-36 font-bold">
              {props.title}
            </p>
            <p className="text-xs md:text-sm lg:text-16 w-5/6">
              {props.description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {props.feature.map((item, key) => {
            return (
              <div key={key} className="border w-full h-full p-8 rounded-2xl">
                <div className="flex justify-center items-center flex-col gap-2">
                  {item.icon}

                  <div className="text-center space-y-2">
                    <p className="text-14 md:text-16 lg:text-20 font-bold">
                      {item.title}
                    </p>
                    <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
};
