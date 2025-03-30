import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import Club from "@/interfaces/Club";

const getClubs = async () => {
  try {
    const filePath = path.join(process.cwd(), "data/clubs.json");
    const fileData = await fs.readFile(filePath, "utf-8");

    if (!fileData) {
      throw new Error("ไม่พบไฟล์ .json ข้อมูลองค์กรนิสิต");
    }

    const clubs = JSON.parse(fileData) as Club[];

    return clubs;
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    throw new Error("เกิดข้อผิดพลาดในการค้นหาองค์กรนิสิต");
  }
};

export async function GET(req: NextRequest) {
  const clubs = await getClubs();
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search");
  const selectedClubType = searchParams.get("selectedClubType");
  const selectedCampus = searchParams.get("selectedCampus");
  const sortType = searchParams.get("sortType")

  const results = clubs.filter((club) => {
    let matchesSearch = true;
    if (search !== null) {
      matchesSearch = club.clubName
        .toLowerCase()
        .includes(search.toLowerCase());
    }
    const matchesClubType =
      selectedClubType === null ||
      selectedClubType === "ทุกประเภท" ||
      club.clubType === selectedClubType;
    const matchesCampus =
      selectedCampus === null ||
      selectedCampus === "ทุกวิทยาเขต" ||
      club.campus === `วิทยาเขต${selectedCampus}`;
    return matchesSearch && matchesClubType && matchesCampus;
  });

  if (sortType === "asc") {
    results.sort((a, b) => a.clubName.localeCompare(b.clubName));
  } else if (sortType === "desc") {
    results.sort((a, b) => b.clubName.localeCompare(a.clubName));
  }

  await new Promise((res) => setTimeout(res , 1000))
  return Response.json(results);
}
