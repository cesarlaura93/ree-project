import { NextApiRequest, NextApiResponse } from "next";
import { energiasUnicas } from "@/app/data/energyData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(energiasUnicas);
}
