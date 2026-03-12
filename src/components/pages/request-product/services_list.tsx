import { Icon } from "@/components/icon";
import Screen from "@/components/layout/screen";
import Link from "next/link";
const RequestProductServicesList = () => {
  return (
    <Screen className="py-10 px-4 md:px-0 bg-white">
      <div className="space-y-8">
        <div className="space-y-8">
          <div className="w-full text-center flex justify-center gap-2 items-center flex-col">
            <p className="text-20 md:text-24 lg:text-36 font-semibold">
              Pilihan Layanan Paket Request
            </p>
            <p className="text-xs md:text-sm lg:text-16 w-5/6">
              Temukan berbagai pilihan paket perjalanan yang sesuai dengan
              kebutuhan Anda. Mulai dari umrah reguler, liburan plus umrah,
              hingga paket custom yang fleksibel. Semua layanan dirancang untuk
              memberikan pengalaman ibadah dan perjalanan terbaik, nyaman, dan
              aman bersama mitra terpercaya.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="border w-full h-full p-6 rounded-2xl">
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
                  d="M26.3738 22.1091V13.25H17.5153C16.7322 13.25 15.9811 13.5611 15.4274 14.1149C14.8736 14.6687 14.5625 15.4199 14.5625 16.203V41.7961C14.5625 42.5793 14.8736 43.3305 15.4274 43.8843C15.9811 44.4381 16.7322 44.7492 17.5153 44.7492H22.8717C22.4584 43.9814 22.3107 43.0561 22.5489 42.0973L23.2871 39.1482C23.5636 38.042 24.1351 37.0316 24.9407 36.2247L34.4488 26.7159C35.4445 25.7191 36.7776 25.1318 38.1851 25.0701V25.0622H29.3266C28.5435 25.0622 27.7924 24.7511 27.2387 24.1973C26.6849 23.6435 26.3738 22.8923 26.3738 22.1091ZM28.3424 22.1091V13.7422L37.693 23.0935H29.3266C29.0656 23.0935 28.8152 22.9898 28.6306 22.8052C28.4461 22.6206 28.3424 22.3702 28.3424 22.1091ZM41.0474 28.1097C40.7055 27.7678 40.2997 27.4965 39.853 27.3114C39.4063 27.1263 38.9275 27.031 38.444 27.031C37.9604 27.031 37.4817 27.1263 37.035 27.3114C36.5883 27.4965 36.1824 27.7678 35.8406 28.1097L26.3325 37.6186C25.7793 38.1729 25.3867 38.8669 25.1966 39.6266L24.4584 42.5757C24.3856 42.8691 24.3899 43.1762 24.4709 43.4674C24.5518 43.7585 24.7067 44.0238 24.9205 44.2374C25.1343 44.451 25.3997 44.6056 25.6909 44.6864C25.9821 44.7671 26.2892 44.7711 26.5825 44.698L29.5314 43.9617C30.2913 43.771 30.9852 43.3778 31.5393 42.8238L41.0474 33.315C41.7374 32.6246 42.125 31.6885 42.125 30.7124C42.125 29.7363 41.7374 28.8001 41.0474 28.1097Z"
                  fill="#007B6F"
                />
              </svg>

              <div className="text-center space-y-3">
                <p className="text-14 md:text-16 lg:text-20 font-bold">
                  Request Umroh (Group)
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Icon name="Info" className="w-3 h-3 fill-khaffah-primary" />
                  <p className="text-8 md:text-10 lg:text-12 text-khaffah-primary">
                    Semua jenis akun bisa menggunakan
                  </p>
                </div>
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  Rancang perjalanan umrah Anda sesuai kebutuhan dan preferensi.
                  Fleksibel dalam memilih jadwal, fasilitas, hingga layanan
                  tambahan.
                </p>

                <Link
                  href="/product-request/custom-umrah?kategori=group"
                  className="flex justify-center items-center"
                >
                  <p className="text-8 md:text-10 lg:text-12 font-bold w-full bg-khaffah-primary flex justify-center items-center text-white h-10 rounded-xl">
                    Pilih Layanan
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="border w-full h-full p-6 rounded-2xl">
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
                  d="M45.023 39.2268L38.1333 27.1414C37.9556 26.8266 37.7015 26.5658 37.3963 26.3852C37.0911 26.2046 36.7457 26.1105 36.3945 26.1124C36.0435 26.1105 35.6982 26.2046 35.3932 26.3852C35.0882 26.5658 34.8343 26.8266 34.6569 27.1414L32.6819 30.6051C32.6359 30.6859 32.6117 30.7782 32.6117 30.8721C32.6117 30.9661 32.6359 31.0583 32.6819 31.1392L36.0662 37.1071C36.1947 37.3288 36.2414 37.5914 36.1974 37.8461C36.1535 38.1008 36.0221 38.3303 35.8275 38.4918C35.7141 38.5833 35.5833 38.6486 35.4437 38.6834C35.3041 38.7183 35.1589 38.7217 35.0179 38.6937C34.8769 38.6656 34.7433 38.6066 34.626 38.5207C34.5086 38.4347 34.4103 38.3237 34.3374 38.1952L25.6912 22.9467C25.5128 22.6315 25.2583 22.3702 24.9528 22.1887C24.6474 22.0072 24.3017 21.9117 23.9498 21.9117C23.598 21.9117 23.2523 22.0072 22.9468 22.1887C22.6414 22.3702 22.3869 22.6315 22.2085 22.9467L12.9776 39.2294C12.8662 39.424 12.8183 39.6508 12.8411 39.8759C12.8639 40.1011 12.956 40.3126 13.1039 40.4789C13.2034 40.5871 13.3235 40.6726 13.4566 40.73C13.5896 40.7874 13.7327 40.8154 13.8767 40.8123H44.1252C44.2686 40.8141 44.4108 40.7854 44.5431 40.7278C44.6754 40.6703 44.7949 40.5851 44.8942 40.4776C45.0428 40.3115 45.1356 40.0999 45.1588 39.8744C45.182 39.649 45.1344 39.4218 45.023 39.2268ZM20.9735 29.2624L23.9498 24.0124L26.9262 29.2624H20.9735ZM30.5163 20.3375C30.5163 19.7145 30.694 19.1055 31.027 18.5874C31.36 18.0694 31.8334 17.6657 32.3871 17.4273C32.9409 17.1889 33.5503 17.1265 34.1382 17.248C34.7261 17.3696 35.2661 17.6696 35.6899 18.1101C36.1138 18.5506 36.4024 19.1119 36.5194 19.7229C36.6363 20.334 36.5763 20.9673 36.3469 21.5429C36.1175 22.1185 35.7291 22.6104 35.2307 22.9566C34.7323 23.3027 34.1463 23.4874 33.5469 23.4874C32.7432 23.4874 31.9723 23.1556 31.4039 22.5648C30.8356 21.9741 30.5163 21.1729 30.5163 20.3375Z"
                  fill="#007B6F"
                />
              </svg>

              <div className="text-center space-y-3">
                <p className="text-14 md:text-16 lg:text-20 font-bold">
                  Umrah Plus Liburan
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Icon name="Info" className="w-3 h-3 fill-khaffah-primary" />
                  <p className="text-8 md:text-10 lg:text-12 text-khaffah-primary">
                    Semua jenis akun bisa menggunakan
                  </p>
                </div>
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  Rancang perjalanan umrah Anda sesuai kebutuhan dan preferensi.
                  Fleksibel dalam memilih jadwal, fasilitas, hingga layanan
                  tambahan.
                </p>

                <Link href="/product-request/custom-umrah?kategori=plus-liburan" className="flex justify-center items-center">
                  <p className="text-8 md:text-10 lg:text-12 font-bold w-full bg-khaffah-primary flex justify-center items-center text-white h-10 rounded-xl">
                    Pilih Layanan
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="border w-full h-full p-6 rounded-2xl">
            <div className="flex justify-center items-center flex-col gap-2">
              <svg
                width="58"
                height="58"
                viewBox="0 0 58 58"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="58" height="58" rx="16" fill="#CCE5E2" />
                <path
                  d="M26.3738 22.1091V13.25H17.5153C16.7322 13.25 15.9811 13.5611 15.4274 14.1149C14.8736 14.6687 14.5625 15.4199 14.5625 16.203V41.7961C14.5625 42.5793 14.8736 43.3305 15.4274 43.8843C15.9811 44.4381 16.7322 44.7492 17.5153 44.7492H22.8717C22.4584 43.9814 22.3107 43.0561 22.5489 42.0973L23.2871 39.1482C23.5636 38.042 24.1351 37.0316 24.9407 36.2247L34.4488 26.7159C35.4445 25.7191 36.7776 25.1318 38.1851 25.0701V25.0622H29.3266C28.5435 25.0622 27.7924 24.7511 27.2387 24.1973C26.6849 23.6435 26.3738 22.8923 26.3738 22.1091ZM28.3424 22.1091V13.7422L37.693 23.0935H29.3266C29.0656 23.0935 28.8152 22.9898 28.6306 22.8052C28.4461 22.6206 28.3424 22.3702 28.3424 22.1091ZM41.0474 28.1097C40.7055 27.7678 40.2997 27.4965 39.853 27.3114C39.4063 27.1263 38.9275 27.031 38.444 27.031C37.9604 27.031 37.4817 27.1263 37.035 27.3114C36.5883 27.4965 36.1824 27.7678 35.8406 28.1097L26.3325 37.6186C25.7793 38.1729 25.3867 38.8669 25.1966 39.6266L24.4584 42.5757C24.3856 42.8691 24.3899 43.1762 24.4709 43.4674C24.5518 43.7585 24.7067 44.0238 24.9205 44.2374C25.1343 44.451 25.3997 44.6056 25.6909 44.6864C25.9821 44.7671 26.2892 44.7711 26.5825 44.698L29.5314 43.9617C30.2913 43.771 30.9852 43.3778 31.5393 42.8238L41.0474 33.315C41.7374 32.6246 42.125 31.6885 42.125 30.7124C42.125 29.7363 41.7374 28.8001 41.0474 28.1097Z"
                  fill="#007B6F"
                />
              </svg>

              <div className="text-center space-y-3">
                <p className="text-14 md:text-16 lg:text-20 font-bold">
                  Request Umrah (Private)
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Icon name="Info" className="w-3 h-3 fill-khaffah-primary" />
                  <p className="text-8 md:text-10 lg:text-12 text-khaffah-primary">
                    Semua jenis akun bisa menggunakan
                  </p>
                </div>
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  Perjalanan eksklusif dengan layanan private untuk keluarga
                  atau rombongan kecil. Memberikan kenyamanan dan privasi lebih
                  dalam beribadah.
                </p>

                <Link href="/product-request/custom-umrah?kategori=private" className="flex justify-center items-center">
                  <p className="text-8 md:text-10 lg:text-12 font-bold w-full bg-khaffah-primary flex justify-center items-center text-white h-10 rounded-xl">
                    Pilih Layanan
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="border w-full h-full p-6 rounded-2xl">
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
                  d="M26.3738 22.1091V13.25H17.5153C16.7322 13.25 15.9811 13.5611 15.4274 14.1149C14.8736 14.6687 14.5625 15.4199 14.5625 16.203V41.7961C14.5625 42.5793 14.8736 43.3305 15.4274 43.8843C15.9811 44.4381 16.7322 44.7492 17.5153 44.7492H22.8717C22.4584 43.9814 22.3107 43.0561 22.5489 42.0973L23.2871 39.1482C23.5636 38.042 24.1351 37.0316 24.9407 36.2247L34.4488 26.7159C35.4445 25.7191 36.7776 25.1318 38.1851 25.0701V25.0622H29.3266C28.5435 25.0622 27.7924 24.7511 27.2387 24.1973C26.6849 23.6435 26.3738 22.8923 26.3738 22.1091ZM28.3424 22.1091V13.7422L37.693 23.0935H29.3266C29.0656 23.0935 28.8152 22.9898 28.6306 22.8052C28.4461 22.6206 28.3424 22.3702 28.3424 22.1091ZM41.0474 28.1097C40.7055 27.7678 40.2997 27.4965 39.853 27.3114C39.4063 27.1263 38.9275 27.031 38.444 27.031C37.9604 27.031 37.4817 27.1263 37.035 27.3114C36.5883 27.4965 36.1824 27.7678 35.8406 28.1097L26.3325 37.6186C25.7793 38.1729 25.3867 38.8669 25.1966 39.6266L24.4584 42.5757C24.3856 42.8691 24.3899 43.1762 24.4709 43.4674C24.5518 43.7585 24.7067 44.0238 24.9205 44.2374C25.1343 44.451 25.3997 44.6056 25.6909 44.6864C25.9821 44.7671 26.2892 44.7711 26.5825 44.698L29.5314 43.9617C30.2913 43.771 30.9852 43.3778 31.5393 42.8238L41.0474 33.315C41.7374 32.6246 42.125 31.6885 42.125 30.7124C42.125 29.7363 41.7374 28.8001 41.0474 28.1097Z"
                  fill="#007B6F"
                />
              </svg>

              <div className="text-center space-y-3">
                <p className="text-14 md:text-16 lg:text-20 font-bold">
                  Request LA Umrah (Group/Private) 
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Icon name="Info" className="w-3 h-3 fill-khaffah-primary" />
                  <p className="text-8 md:text-10 lg:text-12 text-khaffah-primary">
                    Hanya untuk akun Mitra yang memiliki PPIU
                  </p>
                </div>
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  Paket khusus bagi mitra dengan izin resmi (PPU) untuk mengatur
                  layanan penerbangan dan akomodasi sesuai kebutuhan jamaah.
                </p>

                <Link href="/login/mitra" className="flex justify-center items-center">
                  <p className="text-8 md:text-10 lg:text-12 font-bold w-full bg-khaffah-primary flex justify-center items-center text-white h-10 rounded-xl">
                    Pilih Layanan
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="border w-full h-full p-6 rounded-2xl">
            <div className="flex justify-center items-center flex-col gap-2">
              <svg
                width="58"
                height="58"
                viewBox="0 0 58 58"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="58" height="58" rx="16" fill="#CCE5E2" />
                <path
                  d="M26.3738 22.1091V13.25H17.5153C16.7322 13.25 15.9811 13.5611 15.4274 14.1149C14.8736 14.6687 14.5625 15.4199 14.5625 16.203V41.7961C14.5625 42.5793 14.8736 43.3305 15.4274 43.8843C15.9811 44.4381 16.7322 44.7492 17.5153 44.7492H22.8717C22.4584 43.9814 22.3107 43.0561 22.5489 42.0973L23.2871 39.1482C23.5636 38.042 24.1351 37.0316 24.9407 36.2247L34.4488 26.7159C35.4445 25.7191 36.7776 25.1318 38.1851 25.0701V25.0622H29.3266C28.5435 25.0622 27.7924 24.7511 27.2387 24.1973C26.6849 23.6435 26.3738 22.8923 26.3738 22.1091ZM28.3424 22.1091V13.7422L37.693 23.0935H29.3266C29.0656 23.0935 28.8152 22.9898 28.6306 22.8052C28.4461 22.6206 28.3424 22.3702 28.3424 22.1091ZM41.0474 28.1097C40.7055 27.7678 40.2997 27.4965 39.853 27.3114C39.4063 27.1263 38.9275 27.031 38.444 27.031C37.9604 27.031 37.4817 27.1263 37.035 27.3114C36.5883 27.4965 36.1824 27.7678 35.8406 28.1097L26.3325 37.6186C25.7793 38.1729 25.3867 38.8669 25.1966 39.6266L24.4584 42.5757C24.3856 42.8691 24.3899 43.1762 24.4709 43.4674C24.5518 43.7585 24.7067 44.0238 24.9205 44.2374C25.1343 44.451 25.3997 44.6056 25.6909 44.6864C25.9821 44.7671 26.2892 44.7711 26.5825 44.698L29.5314 43.9617C30.2913 43.771 30.9852 43.3778 31.5393 42.8238L41.0474 33.315C41.7374 32.6246 42.125 31.6885 42.125 30.7124C42.125 29.7363 41.7374 28.8001 41.0474 28.1097Z"
                  fill="#007B6F"
                />
              </svg>

              <div className="text-center space-y-3">
                <p className="text-14 md:text-16 lg:text-20 font-bold">
                  Paket LA Saudi
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Icon name="Info" className="w-3 h-3 fill-khaffah-primary" />
                  <p className="text-8 md:text-10 lg:text-12 text-khaffah-primary">
                    Hanya untuk akun Mitra yang memiliki PPIU
                  </p>
                </div>
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  Pilihan paket LA khusus untuk mitra berizin PPU dengan
                  fasilitas resmi dari Saudi, menghadirkan perjalanan yang aman
                  dan terpercaya.
                </p>

                <Link href="/login/mitra" className="flex justify-center items-center">
                  <p className="text-8 md:text-10 lg:text-12 font-bold w-full bg-khaffah-primary flex justify-center items-center text-white h-10 rounded-xl">
                    Pilih Layanan
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="border w-full h-full p-6 rounded-2xl">
            <div className="flex justify-center items-center flex-col gap-2">
              <svg
                width="58"
                height="58"
                viewBox="0 0 58 58"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="58" height="58" rx="16" fill="#CCE5E2" />
                <path
                  d="M26.3738 22.1091V13.25H17.5153C16.7322 13.25 15.9811 13.5611 15.4274 14.1149C14.8736 14.6687 14.5625 15.4199 14.5625 16.203V41.7961C14.5625 42.5793 14.8736 43.3305 15.4274 43.8843C15.9811 44.4381 16.7322 44.7492 17.5153 44.7492H22.8717C22.4584 43.9814 22.3107 43.0561 22.5489 42.0973L23.2871 39.1482C23.5636 38.042 24.1351 37.0316 24.9407 36.2247L34.4488 26.7159C35.4445 25.7191 36.7776 25.1318 38.1851 25.0701V25.0622H29.3266C28.5435 25.0622 27.7924 24.7511 27.2387 24.1973C26.6849 23.6435 26.3738 22.8923 26.3738 22.1091ZM28.3424 22.1091V13.7422L37.693 23.0935H29.3266C29.0656 23.0935 28.8152 22.9898 28.6306 22.8052C28.4461 22.6206 28.3424 22.3702 28.3424 22.1091ZM41.0474 28.1097C40.7055 27.7678 40.2997 27.4965 39.853 27.3114C39.4063 27.1263 38.9275 27.031 38.444 27.031C37.9604 27.031 37.4817 27.1263 37.035 27.3114C36.5883 27.4965 36.1824 27.7678 35.8406 28.1097L26.3325 37.6186C25.7793 38.1729 25.3867 38.8669 25.1966 39.6266L24.4584 42.5757C24.3856 42.8691 24.3899 43.1762 24.4709 43.4674C24.5518 43.7585 24.7067 44.0238 24.9205 44.2374C25.1343 44.451 25.3997 44.6056 25.6909 44.6864C25.9821 44.7671 26.2892 44.7711 26.5825 44.698L29.5314 43.9617C30.2913 43.771 30.9852 43.3778 31.5393 42.8238L41.0474 33.315C41.7374 32.6246 42.125 31.6885 42.125 30.7124C42.125 29.7363 41.7374 28.8001 41.0474 28.1097Z"
                  fill="#007B6F"
                />
              </svg>

              <div className="text-center space-y-3">
                <p className="text-14 md:text-16 lg:text-20 font-bold">
                  Komponen
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Icon name="Info" className="w-3 h-3 fill-khaffah-primary" />
                  <p className="text-8 md:text-10 lg:text-12 text-khaffah-primary">
                    Hanya untuk akun Mitra yang memiliki PPIU
                  </p>
                </div>
                <p className="text-10 md:text-12 lg:text-14 text-khaffah-neutral-dark">
                  Paket tambahan berupa layanan atau fasilitas khusus yang bisa
                  dipadukan dengan paket utama. Hanya tersedia untuk mitra
                  berizin PPU.
                </p>

                <Link href="/login/mitra" className="flex justify-center items-center">
                  <p className="text-8 md:text-10 lg:text-12 font-bold w-full bg-khaffah-primary flex justify-center items-center text-white h-10 rounded-xl">
                    Pilih Layanan
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
};

export default RequestProductServicesList;
