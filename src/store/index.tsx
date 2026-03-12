import { create } from "zustand";

interface BearValue {
  bears: number;
  mears: number;
  dispatch: (args: Partial<BearValue>) => void;
}

interface BearState extends BearValue {
  dispatch: (args: Partial<BearValue>) => void;
}

const initial = {
  bears: 0,
  mears: 0,
};

export const useStore = create<BearState>((set) => ({
  ...initial,
  dispatch: (by: Partial<BearValue>) => set(by),
}));
