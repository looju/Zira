import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateStorage } from "zustand/middleware";
export const ZustandStorage: StateStorage = {
  setItem: async (name, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      const storedValue = await AsyncStorage.setItem(name, jsonValue);
      return storedValue;
    } catch (e) {
      console.log("error saving value with async storage");
    }
  },
  getItem: async (name) => {
    try {
      const jsonValue = await AsyncStorage.getItem(name);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log("error getting value with async storage");
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name);
      console.log("success deleting item");
    } catch (e) {
      console.log("error removing value with async storage");
    }
  },
};
