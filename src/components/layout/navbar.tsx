"use client";
import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegments,
} from "next/navigation";
import Screen from "@/components/layout/screen";
import { useState, useCallback, useEffect } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { documentById } from "@/lib/utils";
import { Icon } from "@/components/icon";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useMe } from "@/query/auth";

const Navbar = () => {
  const { data, isLoading } = useMe();
  const router = useRouter();
  const device = useDeviceType();
  const pathname = usePathname();
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const selectedLayoutSegments = useSelectedLayoutSegments();

  // Hindari hydration mismatch: useMe() disabled di server (enabled: typeof window !== "undefined")
  // sehingga server render link, client awal bisa render spinner. Hanya tampilkan spinner setelah mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [open, setOpen] = useState(false);

  const handleNavbar = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const scrollIntoView = (id: string) => {
    if (pathname !== "/") {
      router.push("/#" + id);
    }
    const element = documentById<HTMLButtonElement>(id);
    if (element) {
      setOpen(false);
      const y = element.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleSheet = useCallback(() => {
    return documentById<HTMLButtonElement>("profile_sheet")?.click();
  }, []);

  const isDashboard = pathname?.startsWith("/account");

  // console.log("isDashboard", isDashboard);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (["(auth)", "(backoffice)"].includes(selectedLayoutSegment ?? ""))
    return <></>;

  if (pathname?.startsWith("/mitra")) {
    return null;
  }

  return (
    <>
      <div
        id="navbar"
        className="sticky left-0 right-0 top-0 z-50 bg-white backdrop-blur-md"
      >
        <Screen>
          <div className="font-medium px-4 backdrop-blur-sm w-full h-20 flex flex-row items-center justify-between">
            {/* overlay close area (mobile) */}
            <div
              className={`w-full h-screen inset-0 z-10 fixed ${
                open ? "" : "hidden"
              }`}
              onClick={handleNavbar}
            />

            {/* LOGO */}
            <Link
              href={"/"}
              className="w-24 flex items-center relative justify-center"
            >
              <svg
                width="158"
                height="48"
                viewBox="0 0 158 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M59.973 35.3845L62.8032 39.2474H61.7149L59.3726 35.9648L58.3022 36.9794V39.2474H57.449V32.7888H58.3022V35.9905L61.5787 32.7888H62.6945L59.973 35.3845ZM153.359 35.7734H154.964C155.164 35.7734 155.332 35.7674 155.468 35.7556C155.604 35.7438 155.754 35.7161 155.916 35.6747C156.08 35.6312 156.213 35.572 156.311 35.4931C156.412 35.4141 156.495 35.3016 156.562 35.1575C156.627 35.0114 156.661 34.8358 156.661 34.6305C156.661 34.1962 156.531 33.9001 156.266 33.7462C156.003 33.5922 155.646 33.5152 155.192 33.5152H153.359V35.7734ZM155.346 32.7888C156.791 32.7888 157.514 33.3849 157.514 34.5772C157.514 34.9522 157.413 35.2819 157.21 35.5701C157.009 35.8563 156.74 36.0497 156.408 36.1464C156.625 36.1938 156.801 36.2629 156.934 36.3537C157.066 36.4445 157.165 36.5728 157.224 36.7347C157.285 36.8985 157.325 37.0426 157.342 37.1709C157.36 37.2972 157.376 37.4847 157.388 37.7335C157.388 37.7571 157.39 37.8164 157.396 37.9091C157.404 38.0039 157.406 38.067 157.406 38.1006C157.406 38.1342 157.409 38.1934 157.419 38.2763C157.429 38.3612 157.435 38.4263 157.441 38.4678C157.449 38.5092 157.457 38.5664 157.469 38.6395C157.481 38.7125 157.496 38.7717 157.514 38.8171C157.532 38.8625 157.554 38.9138 157.577 38.9711C157.603 39.0283 157.629 39.0797 157.66 39.1251C157.69 39.1705 157.723 39.2119 157.759 39.2474H156.779C156.738 39.1862 156.702 39.1112 156.675 39.0204C156.647 38.9296 156.627 38.8231 156.616 38.6987C156.604 38.5743 156.596 38.4756 156.588 38.4006C156.582 38.3237 156.576 38.2131 156.57 38.069C156.564 37.923 156.562 37.842 156.562 37.8243C156.531 37.2735 156.418 36.9084 156.221 36.7268C156.025 36.5452 155.636 36.4544 155.055 36.4544H153.359V39.2474H152.506V32.7888H155.346ZM144.69 32.7888V36.863C144.69 37.4907 144.825 37.9506 145.097 38.2407C145.37 38.5309 145.814 38.677 146.432 38.677C147.066 38.677 147.517 38.5289 147.779 38.2329C148.042 37.9348 148.174 37.4788 148.174 36.863V32.7888H149.037V36.636C149.037 37.5795 148.84 38.2723 148.447 38.7165C148.054 39.1606 147.382 39.3836 146.432 39.3836C145.512 39.3836 144.848 39.1685 144.44 38.7342C144.031 38.3019 143.827 37.6328 143.827 36.7268V32.7888H144.69ZM135.961 34.137C135.578 34.6423 135.386 35.2661 135.386 36.0102C135.386 36.8195 135.59 37.465 135.999 37.9466C136.407 38.4263 136.952 38.6671 137.636 38.6671C138.313 38.6671 138.854 38.4263 139.261 37.9407C139.666 37.4571 139.87 36.8136 139.87 36.0102C139.87 35.2108 139.664 34.5732 139.255 34.0955C138.848 33.6179 138.301 33.379 137.618 33.379C136.897 33.379 136.346 33.6317 135.961 34.137ZM139.905 33.5567C140.45 34.1706 140.721 34.972 140.721 35.9648C140.721 36.9617 140.452 37.7848 139.915 38.4322C139.376 39.0777 138.613 39.4014 137.626 39.4014C137.124 39.4014 136.674 39.3106 136.275 39.129C135.876 38.9474 135.55 38.6967 135.299 38.3769C135.049 38.0572 134.857 37.69 134.729 37.2795C134.598 36.8689 134.533 36.4248 134.533 35.9471C134.533 34.9364 134.812 34.133 135.372 33.533C135.931 32.9349 136.68 32.6349 137.618 32.6349C138.598 32.6349 139.36 32.9428 139.905 33.5567ZM132.09 33.533H129.921V39.2474H129.068V33.533H126.898V32.7888H132.09V33.533ZM120.199 33.533H118.03V39.2474H117.177V33.533H115.008V32.7888H120.199V33.533ZM110.804 33.606L109.688 36.5906H111.902L110.804 33.606ZM113.825 39.2474H112.873L112.156 37.2696H109.443L108.708 39.2474H107.8L110.341 32.7888H111.303L113.825 39.2474ZM99.7949 32.7888L101.873 38.2585L103.877 32.7888H105.066V39.2474H104.258V33.8606L102.236 39.2474H101.491L99.4315 33.8606V39.2474H98.6138V32.7888H99.7949ZM92.8587 33.606L91.7428 36.5906H93.9568L92.8587 33.606ZM95.8804 39.2474H94.9285L94.2115 37.2696H91.4979L90.7632 39.2474H89.8547L92.3965 32.7888H93.3584L95.8804 39.2474ZM83.0291 38.5131H84.3267C85.1364 38.5131 85.725 38.3158 86.0904 37.919C86.4577 37.5222 86.6394 36.9044 86.6394 36.0635C86.6394 35.1812 86.4617 34.5377 86.1042 34.133C85.7487 33.7264 85.1424 33.5251 84.2892 33.5251H83.0291V38.5131ZM84.2813 32.7888C85.3754 32.7888 86.1832 33.0435 86.7046 33.5507C87.224 34.06 87.4847 34.8634 87.4847 35.9648C87.4847 37.0465 87.2418 37.8637 86.7579 38.4184C86.274 38.9711 85.4998 39.2474 84.4353 39.2474H82.1759V32.7888H84.2813ZM76.4287 33.606L75.3128 36.5906H77.5268L76.4287 33.606ZM79.4504 39.2474H78.4985L77.7815 37.2696H75.0679L74.3332 39.2474H73.4247L75.9665 32.7888H76.9283L79.4504 39.2474ZM70.7012 39.2474H69.848V36.2274H66.4352V39.2474H65.582V32.7888H66.4352V35.4832H69.848V32.7888H70.7012V39.2474Z"
                  fill="#121212"
                />
                <path
                  d="M72.4155 27.71C71.8447 27.71 71.2404 27.6231 70.6044 27.4514C69.9665 27.2816 69.2772 26.948 68.5346 26.4546C67.792 25.9591 66.9645 25.2367 66.052 24.2872L60.4292 18.4109V27.4237H57.5477V12.1082C57.5477 11.2515 57.4292 10.5626 57.1902 10.0395C56.9532 9.51646 56.4062 9.25591 55.549 9.25591H55.0651V8.5986H57.8617C58.5273 8.5986 59.0448 8.69532 59.416 8.88481C59.7873 9.07431 60.048 9.42172 60.2021 9.92506C60.3542 10.4304 60.4292 11.1568 60.4292 12.1082V17.6115L66.137 11.593C66.5932 11.0995 67.0553 10.6238 67.5214 10.1679C67.9875 9.71188 68.501 9.33684 69.0619 9.04075C69.6228 8.74664 70.2845 8.5986 71.0448 8.5986H72.615V9.39803C71.7598 9.39803 70.9935 9.5362 70.318 9.81058C69.6426 10.0869 68.9336 10.614 68.191 11.3936L62.9691 16.8712L69.5616 23.7167C70.0751 24.2477 70.6123 24.7392 71.1732 25.1853C71.7341 25.6314 72.2871 26.0025 72.8302 26.2966C73.3714 26.5927 73.871 26.7783 74.3273 26.8533V27.4237C74.1179 27.4988 73.8572 27.5659 73.5432 27.6231C73.2292 27.6803 72.852 27.71 72.4155 27.71ZM141.42 27.4237V12.1082C141.42 11.2515 141.299 10.5626 141.062 10.0395C140.825 9.51646 140.278 9.25591 139.421 9.25591H138.937V8.5986H141.734C142.4 8.5986 142.917 8.69532 143.288 8.88481C143.66 9.07431 143.92 9.42172 144.074 9.92506C144.226 10.4304 144.301 11.1568 144.301 12.1082V17.1278H152.634V8.5986H155.488V23.9161C155.488 24.7708 155.606 25.4617 155.845 25.9828C156.082 26.5059 156.629 26.7684 157.487 26.7684H158V27.4237H155.203C154.538 27.4237 154.018 27.3329 153.647 27.1533C153.278 26.9717 153.015 26.6263 152.863 26.1111C152.711 25.5979 152.634 24.8675 152.634 23.9161V18.2964H144.301V27.4237H141.42ZM124.897 20.8921H131.746L128.407 12.8208L124.897 20.8921ZM138.08 27.5659C137.604 27.5659 137.049 27.4849 136.411 27.325C135.773 27.1632 135.155 26.8158 134.557 26.2828C133.956 25.7499 133.449 24.9425 133.03 23.8589L132.315 22.0626H124.439L122.128 27.4237H120.787L128.892 8.5986H129.862L136.168 23.8589C136.607 24.8675 137.043 25.59 137.482 26.0262C137.918 26.4644 138.519 26.721 139.279 26.796V27.4237C139.127 27.4612 138.941 27.4948 138.722 27.5244C138.503 27.552 138.29 27.5659 138.08 27.5659ZM110.314 27.4237V12.1082C110.314 11.2515 110.193 10.5626 109.956 10.0395C109.719 9.51646 109.172 9.25591 108.315 9.25591H107.831V8.5986H119.359C120.025 8.5986 120.53 8.70914 120.872 8.92627C121.216 9.14537 121.453 9.43159 121.585 9.78294C121.719 10.1343 121.786 10.5014 121.786 10.8804V13.105H121.129C121.129 11.9266 120.819 11.0758 120.203 10.5528C119.582 10.0297 118.703 9.76912 117.562 9.76912H113.195V17.27H119.588V18.4385H113.195V27.4237H110.314ZM95.1892 27.4237V12.1082C95.1892 11.2515 95.0687 10.5626 94.8317 10.0395C94.5927 9.51646 94.0476 9.25591 93.1905 9.25591H92.7046V8.5986H104.235C104.9 8.5986 105.404 8.70914 105.748 8.92627C106.089 9.14537 106.328 9.43159 106.46 9.78294C106.593 10.1343 106.66 10.5014 106.66 10.8804V13.105H106.004C106.004 11.9266 105.694 11.0758 105.076 10.5528C104.458 10.0297 103.579 9.76912 102.437 9.76912H98.0707V17.27H104.464V18.4385H98.0707V27.4237H95.1892ZM78.6644 20.8921H85.5137L82.1759 12.8208L78.6644 20.8921ZM91.8495 27.5659C91.3735 27.5659 90.8165 27.4849 90.1806 27.325C89.5427 27.1632 88.9245 26.8158 88.3261 26.2828C87.7257 25.7499 87.2161 24.9425 86.7994 23.8589L86.0844 22.0626H78.2081L75.8974 27.4237H74.5564L82.6598 8.5986H83.6315L89.9377 23.8589C90.3761 24.8675 90.8126 25.59 91.251 26.0262C91.6875 26.4644 92.2879 26.721 93.0483 26.796V27.4237C92.8962 27.4612 92.7105 27.4948 92.4913 27.5244C92.2721 27.552 92.0588 27.5659 91.8495 27.5659Z"
                  fill="#007B6F"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.7996 0.179882C21.0636 0.158169 22.1103 1.17473 22.1301 2.43211L22.3414 15.0138C22.3612 16.2731 21.348 17.3213 20.086 17.343C19.4994 17.3647 18.895 17.1121 18.4724 16.7114L9.2689 7.81495C8.4394 7.01355 8.41767 5.68116 9.21952 4.85607L9.49404 4.56985C10.2939 3.74673 11.6369 3.72897 12.4565 4.5205L17.6646 9.55396L17.5461 2.50909C17.5244 1.25171 18.5376 0.201595 19.7996 0.179882ZM7.42227 10.079L16.4717 18.8274C17.9332 20.2407 16.9694 22.7199 14.8937 22.7633L2.13521 22.9765C0.985758 22.9963 0.025909 22.0666 0.00615901 20.9177L0.000234017 20.521C-0.015566 19.4531 0.770483 18.4306 1.81723 18.4109L9.30247 18.2727L4.23463 13.3735C3.33205 12.501 3.3044 11.0403 4.1813 10.1343C5.0582 9.22827 6.51772 9.20458 7.42227 10.079ZM27.4942 0.000256273C28.6555 -0.0175089 29.6035 0.890488 29.6232 2.05904L29.7437 9.29736L34.8471 4.04874C35.647 3.22365 37.0216 3.34208 37.8866 4.17902C38.7536 5.01595 38.8168 6.51415 37.9419 7.42017L29.1887 16.4626C28.3158 17.3647 26.8483 17.3884 25.9477 16.5159C25.4994 16.0836 25.2664 15.5092 25.2525 14.9289C25.1182 10.6672 25.1084 6.39769 25.0373 2.13405C25.0195 0.983262 25.9458 0.0259171 27.0972 0.00617799L27.4942 0.000256273ZM40.2072 9.2638C41.0051 8.43871 42.3461 8.41699 43.1697 9.21445L43.4541 9.48882C44.2224 10.233 44.3883 11.5141 43.6635 12.2661L38.4673 17.6549L45.518 17.5364C46.7741 17.5147 47.8268 18.5293 47.8485 19.7887C47.8682 21.05 46.8531 22.0981 45.593 22.1179L32.9669 22.3291C30.9484 22.3626 29.9214 19.8913 31.3059 18.4622L40.2072 9.2638ZM45.9268 25.0235C47.0624 25.0057 48.0025 25.9433 48.0203 27.0823L48.0262 27.479C48.044 28.5469 47.256 29.5694 46.2092 29.5891L38.724 29.7273L43.9775 34.8279C44.7951 35.6233 44.6905 36.9932 43.8471 37.8677C43.0018 38.7401 41.5087 38.7974 40.6042 37.921L31.5548 29.1726C30.1012 27.7692 31.0669 25.2722 33.0893 25.2386L45.9268 25.0235ZM38.7596 40.185C39.5871 40.9865 39.6108 42.3188 38.8089 43.1459L38.5324 43.4301C37.7266 44.2612 36.3955 44.277 35.5699 43.4795L30.3638 38.446L30.4823 45.4929C30.5021 46.7483 29.4929 47.8102 28.2269 47.8221C26.9629 47.832 25.9181 46.847 25.8964 45.5679L25.687 32.9428C25.6515 30.8978 28.1518 29.9326 29.5561 31.2886L38.7596 40.185ZM22.9892 45.866C23.0089 47.0167 22.0807 47.9761 20.9293 47.9938L20.5343 47.9997C19.375 48.0175 18.423 47.1115 18.4033 45.9429L18.2828 38.7026L13.3808 43.7697C12.5099 44.6698 11.0424 44.6954 10.1399 43.823C9.2373 42.9505 9.20965 41.4859 10.0846 40.5818L18.8378 31.5374C20.244 30.0846 22.7423 31.0498 22.7759 33.0711L22.9892 45.866ZM17.3526 27.9685C17.3506 28.5745 17.1096 29.1292 16.7206 29.5398L7.81925 38.7382C7.02135 39.5613 5.68033 39.585 4.85873 38.7875L4.57235 38.5112C3.80605 37.767 3.63818 36.4879 4.36498 35.7359L9.55922 30.3471L2.91928 30.4576C1.48741 30.4813 0.203659 29.6543 0.179959 28.2113C0.154284 26.7704 1.17338 25.9038 2.43343 25.8821L15.0221 25.6729C16.3019 25.6492 17.3526 26.6934 17.3526 27.9685Z"
                  fill="#E1C064"
                />
                <path
                  d="M25.687 32.9428C25.687 33.152 25.693 33.3691 25.6969 33.5803C25.7957 33.9041 25.9774 34.2061 26.2361 34.4568L30.3638 38.446L30.273 32.9112C30.2611 32.2894 30.0044 31.7229 29.5877 31.3202C28.1143 29.8951 25.689 30.886 25.687 32.9428ZM18.8378 31.5374L18.425 31.9637C18.269 32.2638 18.1821 32.6052 18.188 32.9645L18.2828 38.7026L22.134 34.7252C22.5705 34.2732 22.7897 33.6948 22.7759 33.0711C22.7285 31.0498 20.244 30.0865 18.8378 31.5374ZM15.0596 25.6729L14.4296 25.6828C14.1057 25.7814 13.8015 25.963 13.5507 26.2216L9.55922 30.3471L15.0971 30.2563C15.7252 30.2444 16.29 29.9918 16.7206 29.5398C18.0695 28.1264 17.1096 25.6393 15.0596 25.6729ZM15.0438 18.178L9.30247 18.2727L13.2841 22.1218C13.7344 22.5581 14.313 22.7752 14.9371 22.7633C16.9813 22.7219 17.9056 20.215 16.4717 18.8274L16.0471 18.4168C15.7252 18.247 15.4052 18.172 15.0438 18.178ZM17.6646 9.55396L17.7555 15.0888C17.7653 15.7106 18.0241 16.2751 18.4388 16.6798C19.8806 18.0832 22.3355 17.114 22.3414 15.0572L22.3315 14.4216C22.2308 14.0979 22.0491 13.7959 21.7904 13.5452L17.6646 9.55396ZM29.7437 9.29736L25.8924 13.2768C25.4599 13.7229 25.2427 14.3052 25.2506 14.8855C25.2802 16.9739 27.7904 17.9095 29.1887 16.4626L29.6015 16.0382C29.7595 15.7382 29.8444 15.3967 29.8385 15.0355L29.7437 9.29736ZM38.4673 17.6549L32.9294 17.7457C32.3072 17.7555 31.7404 18.0122 31.3375 18.4286C29.9333 19.8775 30.905 22.3291 32.9669 22.3291C33.1762 22.3291 33.3876 22.3232 33.5989 22.3192C33.9208 22.2185 34.225 22.0389 34.4758 21.7784L38.4673 17.6549ZM33.1506 25.2366C31.0669 25.2366 30.1012 27.7672 31.5548 29.1726L31.9814 29.5852C32.3013 29.7529 32.6232 29.8299 32.9827 29.824L38.724 29.7273L34.7444 25.8782C34.3 25.4498 33.7253 25.2366 33.1506 25.2366Z"
                  fill="#D6842A"
                />
              </svg>
            </Link>

            {/* NAV TENGAH / MENU (tetap posisinya) */}
            <div
              className={`flex flex-col z-10 gap-4 lg:flex-row bg-white lg:items-center lg:w-2/4 justify-around absolute lg:relative lg:h-auto lg:bg-transparent left-0 duration-200 lg:overflow-hidden lg:p-0 top-0  w-full p-4  ${
                open
                  ? "h-fit"
                  : "-translate-y-full opacity-0 lg:opacity-100 lg:translate-y-0"
              }`}
            >
              {/* header row (close btn) */}
              <div className="flex justify-end lg:hidden">
                <button className="w-fit" type="button" onClick={handleNavbar}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    className="w-6 h-6 stroke-khaffah-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {isDashboard ? (
                <></>
              ) : (
                <>
                  {" "}
                  {/* nav links */}
                  <div>
                    <Link
                      href="/"
                      className="w-full lg:w-auto text-left text-sm font-semibold
               text-khaffah-primary transition-colors duration-200 ease-out
               hover:text-khaffah-secondary focus-visible:outline-none
               focus-visible:ring-2 focus-visible:ring-khaffah-secondary/30 rounded-sm"
                    >
                      Beranda
                    </Link>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => scrollIntoView("service_section")}
                      className="w-full lg:w-auto text-left text-sm font-semibold cursor-pointer
               text-khaffah-primary transition-colors duration-200 ease-out
               hover:text-khaffah-secondary focus-visible:outline-none
               focus-visible:ring-2 focus-visible:ring-khaffah-secondary/30 rounded-sm"
                    >
                      Layanan Kami
                    </button>
                  </div>
                  <div>
                    <Link
                      href="/tentang-kami"
                      className="w-full lg:w-auto text-left text-sm font-semibold cursor-pointer
               text-khaffah-primary transition-colors duration-200 ease-out
               hover:text-khaffah-secondary focus-visible:outline-none
               focus-visible:ring-2 focus-visible:ring-khaffah-secondary/30 rounded-sm block"
                    >
                      Tentang Kami
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="/kontak-kami"
                      className="w-full lg:w-auto text-left text-sm font-semibold cursor-pointer block
               text-khaffah-primary transition-colors duration-200 ease-out
               hover:text-khaffah-secondary focus-visible:outline-none
               focus-visible:ring-2 focus-visible:ring-khaffah-secondary/30 rounded-sm"
                    >
                      Kontak
                    </Link>
                  </div>
                </>
              )}
              {!data ? (
                <div className="lg:hidden">
                  <div className="flex items-center gap-4 border-t pt-4">
                    <Link href="/login">
                      <div className="text-sm font-semibold text-khaffah-primary hover:text-[#06685F] transition-colors">
                        <p>Masuk Akun</p>
                      </div>
                    </Link>
                    <Link href="/register">
                      <div className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#007B6F] hover:bg-[#06685F] transition-colors">
                        <p>Daftar Akun</p>
                      </div>
                    </Link>
                  </div>
                </div>
              ) : null}


            </div>

            {/* KANAN (tetap posisinya) */}
            <div className="h-auto flex gap-6 lg:border-l lg:pl-8 flex-row items-center justify-center">
              {/* === SUDAH login: tampilkan bell + avatar; BELUM login / LOADING: tampilkan link Masuk & Daftar === */}
              {data ? (
                <>
                  <Link
                    href="#notification"
                    aria-label="Notifikasi"
                    className="p-2 rounded-full hover:bg-khaffah-primary/10 transition-colors"
                  >
                    <Icon
                      name="Notification"
                      className="w-5 h-5 cursor-pointer"
                    />
                  </Link>
                  {selectedLayoutSegments[1] === "account" &&
                  ["mobile", "tablet"].includes(device) ? (
                    <button type="button" onClick={handleSheet}>
                      <div className="p-2 bg-khaffah-primary/20 rounded-full">
                        <Icon
                          name="User"
                          className="fill-khaffah-primary w-5 h-5 cursor-pointer"
                        />
                      </div>
                    </button>
                  ) : (
                    <Link href={"/account"}>
                      <div className="p-2 bg-khaffah-primary/20 rounded-full">
                        <Icon
                          name="User"
                          className="fill-khaffah-primary w-5 h-5"
                        />
                      </div>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  {/* Saat loading atau belum login: tampilkan link agar user bisa ke halaman login */}
                  <div className="hidden lg:flex items-center gap-4">
                    {mounted && isLoading && (
                      <div className="w-5 h-5 rounded-full border-2 border-r-transparent animate-spin border-khaffah-aqua" />
                    )}
                    <Link
                      href="/login"
                      className="text-sm font-semibold text-khaffah-primary hover:text-[#06685F] transition-colors"
                    >
                      Masuk Akun
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#007B6F] hover:bg-[#06685F] transition-colors"
                    >
                      Daftar Akun
                    </Link>
                  </div>
                </>
              )}

              {/* hamburger button */}
              <button
                onClick={!isDashboard ? handleNavbar : handleSheet}
                type="button"
                className="block lg:hidden"
                aria-label="Buka menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  className="w-8 h-8 stroke-khaffah-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Screen>
      </div>
    </>
  );
};

export default Navbar;
