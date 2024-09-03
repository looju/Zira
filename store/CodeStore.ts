import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ZustandStorage } from "./AsyncStorage";

type CodeStoreType = {
  code: string;
  id: string;
  number: string;
  addCode: (value: string) => void;
  addNumber: (value: number | string) => void;
  addId: (value: string) => void;
};

export const useCodeStore = create(
  persist(
    (set, get) => ({
      code: "",
      number: "",
      id: "",
      addCode: (value: string) => set({ code: value }),
      addNumber: (value: number | string) => set({ number: value }),
      addId: (value: string | number) => set({ id: value }),
    }),
    {
      name: "codeStore", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => ZustandStorage),
    }
  )
);
