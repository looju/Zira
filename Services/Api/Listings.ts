import axios from "axios";

export const GetListingsData = async () => {
  const key = process.env.EXPO_PUBLIC_COINBASEKEY;
  const data = await axios.get(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=1`,
    {
      headers: { "X-CMC_PRO_API_KEY": `${key}` },
    }
  );
  return data.data;
};
