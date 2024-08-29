import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ZustandStorage } from "./AsyncStorage";

type CodeStoreType = {
  code: string;
  addCode: (value: string) => void;
};

export const useCodeStore = create(
  persist(
    (set, get) => ({
      code: "",
      addCode: (value: string) => set({ code: value }),
    }),
    {
      name: "codeStore", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => ZustandStorage),
    }
  )
);
