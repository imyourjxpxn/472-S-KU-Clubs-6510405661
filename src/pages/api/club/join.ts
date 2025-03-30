import { NextApiRequest, NextApiResponse } from "next";

export default async function joinClub(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Add Delay to simulate server response time
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return res.status(200).json({ message: "User joined the club" });
}
