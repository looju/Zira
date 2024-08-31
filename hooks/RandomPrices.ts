import moment from "moment";
import { numberFormat } from "./FormatNumbers";

export const RandomPrices = (price: any) => {
  const rndDate = moment(new Date(new Date().valueOf() - Math.random() * 1e12))
    .format("Do YYYY, h:mm:ss a")
    .toLocaleString();

  return [
    {
      value: numberFormat.format(
        Number(price) * Math.floor(Math.random() * 2.7)
      ),
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price) * Math.floor(Math.random() * 2.5) + 1,
      dataPointText: `As at ${rndDate}`,
    },
    {
      value: Number(price),
      dataPointText: `As at ${rndDate}`,
    },
  ];
};

//have to implement fake data cause coinbase api doesn't offer historical price data to basic plans, which is implemented in this projects
