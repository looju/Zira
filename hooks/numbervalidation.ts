import { ipqEndpoint } from "@/constants/Url";
import axios from "axios";

export type numType = {
  fullNumber: string;
};

export const Validation = ({ fullNumber }: numType) =>
  axios
    .get(`${ipqEndpoint}/${fullNumber}`)
    .then(function (response) {
      // handle success
      console.log(response.data);
      const data = {
        number: response.data.formatted,
        valid: response.data.valid,
        country: response.data.country,
        fraudScore: response.data.fraud_score,
      };
      return data;
    })
    .catch(function (error) {
      // handle error
      console.log(error, "Error fetching number");
    });
