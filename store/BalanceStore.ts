import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ZustandStorage } from "./AsyncStorage";

export interface Transaction {
  id: string;
  amount: number;
  date: number;
  title: string;
}

export interface BalanceState {
  transactions: Array<Transaction>;
  runTransaction: (transaction: Transaction) => void;
  balance: () => number;
  clearTransaction: () => void;
  title: () => string | string;
}

export const useBalanceStore = create<BalanceState>(
  persist(
    (set, get) => ({
      transactions: [],
      runTransaction: (transaction: any) => {
        set((state: any) => ({
          transactions: [...state.transactions, transaction],
        }));
      },
      balance: () => get().transactions.reduce((acc, t) => acc + t.amount, 0),
      clearTransaction: () => set({ transactions: [] }),
    }),
    {
      name: "balanceStore", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => ZustandStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
