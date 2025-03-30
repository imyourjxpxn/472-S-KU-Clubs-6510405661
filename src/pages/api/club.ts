import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import ClubInterface from "@/interfaces/Club";

export default async function findClubById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Add Delay to simulate server response time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    const filePath = path.join(process.cwd(), "data/clubs.json");
    const fileData = await fs.readFile(filePath, "utf-8");

    if (!fileData) {
      return res
        .status(500)
        .json({ message: "ไม่พบไฟล์ .json ข้อมูลองค์กรนิสิต" });
    }

    const clubs = JSON.parse(fileData) as ClubInterface[];
    return res.status(200).json(clubs);
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการค้นหาองค์กรนิสิต" });
  }
}
