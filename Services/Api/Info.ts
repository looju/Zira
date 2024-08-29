import axios from "axios";

const key = process.env.EXPO_PUBLIC_COINBASEKEY;
export async function GetInfoData(id: number) {
  axios({
    method: "get",
    url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${id}`,
    headers: { "X-CMC_PRO_API_KEY": `${key}` },
  })
    .then(function (response) {
      console.log(response, "res from server");
      return response.data;
    })
    .catch(function (err) {
      console.log(err, "error fetching  from server");
    });
}
