import { NextApiRequest, NextApiResponse } from "next";
import { energyData } from "@/app/data/energyData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { energy_type } = req.query;

  res.setHeader("Access-Control-Allow-Origin", "*");

  let filteredData = energyData;

  if (energy_type && typeof energy_type === "string") {
    filteredData = energyData.filter(
      (item) => item.energy_type.toLowerCase() === energy_type.toLowerCase()
    );
  }

  res.status(200).json({
    count: filteredData.length,
    results: filteredData,
  });
}
