import Screen from "@/components/layout/screen";
const EdutripBenefit = () => {
  return (
    <Screen className="py-10 px-4 md:px-0 bg-white">
      <div className="space-y-8">
        <div className="space-y-8">
          <div className="w-full text-center flex justify-center gap-2 items-center flex-col">
            <p className="text-20 md:text-24 lg:text-36 font-semibold">
              Kelebihan EduTrip
            </p>
            <p className="text-xs md:text-sm lg:text-16 w-5/6">
              Perjalanan ibadah yang lebih bermakna dengan bimbingan personal
              dan ilmu yang mendalam.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4">
          <div className="border w-full h-full p-8 rounded-2xl">
            <div className="flex justify-center items-center flex-col gap-2">
              <svg
                width="58"
                height="58"
                viewBox="0 0 58 58"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="p-1"
              >
                <rect width="58" height="58" rx="16" fill="#CCE5E2" />
                <path
                  d="M17.975 25.19C17.975 22.3714 19.1366 19.6683 21.2041 17.6752C23.2717 15.6822 26.076 14.5625 29 14.5625C31.924 14.5625 34.7283 15.6822 36.7959 17.6752C38.8634 19.6683 40.025 22.3714 40.025 25.19V26.7613C42.6962 27.1303 44.75 29.3454 44.75 32.022V32.4015C44.75 35.0963 42.3387 37.4587 39.5021 37.3327C38.3366 40.5513 35.3725 42.7208 32.1736 43.2704C31.4334 43.5315 30.5577 43.4086 29.7875 43.4086C29.1609 43.4086 28.56 43.1686 28.117 42.7416C27.6739 42.3145 27.425 41.7352 27.425 41.1312C27.425 40.5273 27.6739 39.948 28.117 39.5209C28.56 39.0939 29.1609 38.8539 29.7875 38.8539C31.0365 38.8539 32.4193 38.6793 33.2635 39.7785C35.3047 38.8418 36.875 36.8635 36.875 34.2993V25.19C36.875 23.1767 36.0453 21.2459 34.5685 19.8223C33.0916 18.3987 31.0886 17.5989 29 17.5989C26.9114 17.5989 24.9084 18.3987 23.4315 19.8223C21.9547 21.2459 21.125 23.1767 21.125 25.19V34.6788C21.125 35.3835 20.8346 36.0593 20.3177 36.5575C19.8008 37.0558 19.0998 37.3357 18.3688 37.3357C17.0112 37.3357 15.7092 36.8159 14.7492 35.8905C13.7893 34.9652 13.25 33.7101 13.25 32.4015V32.022C13.2497 30.744 13.7272 29.5086 14.595 28.5424C15.4628 27.5763 16.6628 26.9439 17.975 26.7613V25.19Z"
                  fill="#007B6F"
                />
              </svg>

              <div className="text-center space-y-2">
                <p className="text-14 md:text-16 lg:text-20 font-bold">
                  Konsultasi Kapan Saja
                </p>
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  Atur sendiri jadwal konsultasi privat Anda. Kami siap
                  mendampingi perencanaan ibadah Anda secara mendalam di waktu
                  terbaik bagi Anda.
                </p>
              </div>
            </div>
          </div>
          <div className="border w-full h-full p-8 rounded-2xl">
            <div className="flex justify-center items-center flex-col gap-2">
              <svg
                width="58"
                height="58"
                viewBox="0 0 58 58"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="p-1"
              >
                <rect width="58" height="58" rx="16" fill="#CCE5E2" />
                <path
                  d="M36.8753 15.3603C39.2508 16.7319 41.227 18.7002 42.6081 21.0702C43.9892 23.4402 44.7273 26.1298 44.7495 28.8728C44.7716 31.6158 44.077 34.317 42.7344 36.709C41.3918 39.101 39.4477 41.1009 37.0946 42.5107C34.7415 43.9205 32.061 44.6913 29.3185 44.7468C26.576 44.8023 23.8665 44.1406 21.4583 42.8271C19.0501 41.5137 17.0267 39.5941 15.5884 37.2584C14.1501 34.9226 13.3467 32.2517 13.2579 29.5101L13.25 28.9998L13.2579 28.4895C13.3461 25.7695 14.1376 23.1187 15.5553 20.7956C16.9729 18.4726 18.9683 16.5565 21.347 15.2341C23.7257 13.9118 26.4064 13.2284 29.1278 13.2505C31.8492 13.2726 34.5184 13.9995 36.8753 15.3603ZM29.0002 19.5498C28.6144 19.5499 28.2421 19.6915 27.9538 19.9479C27.6655 20.2042 27.4813 20.5574 27.4362 20.9406L27.4252 21.1248V28.9998L27.4393 29.2062C27.4753 29.4794 27.5823 29.7385 27.7496 29.9574L27.8867 30.1149L32.6117 34.8399L32.7598 34.9691C33.036 35.1834 33.3756 35.2997 33.7253 35.2997C34.0749 35.2997 34.4145 35.1834 34.6907 34.9691L34.8388 34.8384L34.9695 34.6903C35.1838 34.4141 35.3001 34.0744 35.3001 33.7248C35.3001 33.3752 35.1838 33.0356 34.9695 32.7594L34.8388 32.6113L30.5752 28.3462V21.1248L30.5642 20.9406C30.5191 20.5574 30.3349 20.2042 30.0466 19.9479C29.7583 19.6915 29.386 19.5499 29.0002 19.5498Z"
                  fill="#007B6F"
                />
              </svg>

              <div className="text-center space-y-2">
                <p className="text-14 md:text-16 lg:text-20 font-bold">
                  Pengetahuan Terbaru
                </p>
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  Setiap pertanyaan dan keraguan Anda terjawab. Kami pastikan
                  Anda berangkat dengan bekal ilmu yang memadai dan hati yang
                  lebih tenang.
                </p>
              </div>
            </div>
          </div>
          <div className="border w-full h-full p-8 rounded-2xl">
            <div className="flex justify-center items-center flex-col gap-2">
              <svg
                width="58"
                height="58"
                viewBox="0 0 58 58"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="p-1"
              >
                <rect width="58" height="58" rx="16" fill="#CCE5E2" />
                <path
                  d="M43.9109 14.0755C45.0297 15.1951 45.0297 16.9978 43.9109 18.0984L37.0627 24.9519C36.7343 25.2806 36.5982 25.7553 36.7026 26.2082L40.3876 42.1945C40.4916 42.6458 40.3569 43.1188 40.0308 43.4475L39.1798 44.3051C38.5371 44.9529 37.4501 44.7883 37.0279 43.9792L31.3738 33.1436C30.9525 32.3362 29.8689 32.1701 29.2253 32.8142L23.6067 38.4371C23.3059 38.7381 23.1648 39.1636 23.2262 39.5848L23.7133 42.9293C23.7749 43.3528 23.6321 43.7803 23.3282 44.0815L23.0482 44.3591C22.4132 44.9887 21.3525 44.8368 20.9197 44.0541L18.6323 39.9181C18.51 39.6969 18.328 39.5146 18.107 39.3919L13.944 37.0802C13.1654 36.6479 13.0123 35.5927 13.6359 34.9568L13.9255 34.6615C14.2275 34.3536 14.6586 34.2088 15.0853 34.2719L18.4755 34.7741C18.8977 34.8366 19.3246 34.6954 19.6264 34.3934L25.1918 28.8238C25.8338 28.1813 25.67 27.1005 24.8664 26.6772L14.0209 20.9655C13.2155 20.5414 13.0531 19.4572 13.6988 18.8156L14.5608 17.959C14.8895 17.6324 15.3627 17.4975 15.8141 17.6017L31.7866 21.2891C32.2396 21.3937 32.7145 21.2574 33.0432 20.9285L39.891 14.0755C40.9529 12.9748 42.8491 12.9748 43.9109 14.0755Z"
                  fill="#007B6F"
                />
              </svg>

              <div className="text-center space-y-2">
                <p className="text-14 md:text-16 lg:text-20 font-bold">
                  Destinasi Menarik & Edukatif
                </p>
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  Jelajahi situs-situs bersejarah di Tanah Suci dengan panduan
                  mendalam untuk menyerap hikmah di setiap langkah perjalanan
                  Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default EdutripBenefit;
