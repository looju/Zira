import { StyleSheet } from "react-native";
import Colors from "@/constants/Colors";

export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    fontSize: 40,
    fontWeight: "700",
    color: Colors.white,
  },
  pillButton: {
    padding: 10,
    height: 40,
    width: 70,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark,
  },
  textLink: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "500",
  },
  descriptionText: {
    fontSize: 18,
    marginTop: 20,
    fontFamily: "Helvetica",
    color: Colors.white,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  pillButtonSmall: {
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextSmall: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
    marginBottom: 10,
    color: "#fff",
  },
  block: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 20,
  },
});
