import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import ClubInterface from "@/interfaces/Club";
import Activity, { ActivityInterface } from "@/interfaces/Activity";

export default async function getClubActivities(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Add Delay to simulate server response time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const clubId = req.query.id;

  if (!clubId || isNaN(Number(clubId))) {
    return res.status(400).json({ message: "ท่านเรียกใช้งานไม่ถูกต้อง" });
  }

  try {
    const filePath = path.join(process.cwd(), "data/clubs.json");
    const fileData = await fs.readFile(filePath, "utf-8");

    if (!fileData) {
      return res
        .status(500)
        .json({ message: "ไม่พบไฟล์ .json ข้อมูลองค์กรนิสิต" });
    }

    const clubs = JSON.parse(fileData);
    const club = clubs.find((club: ClubInterface) => club.id === clubId);

    // แปลงข้อมูลกิจกรรมให้เข้ากับรูปแบบที่ต้องการใช้ในหน้า ClubActivities
    const activitiesFromClub = club.activities.map(
      (activity: ActivityInterface) => {
        // ถ้าสถานะเป็น ongoing ให้กำหนดวันที่เป็น 29 มีนาคม 2568
        const activityDate =
          activity.status === "ongoing" ? "29 มีนาคม 2568" : activity.date;

        // กำหนด deadline สำหรับกิจกรรม upcoming ให้เป็นหลังวันที่ 29 มีนาคม 2568
        let activityDeadline = activity.deadline || activityDate;
        if (activity.status === "upcoming" || !activity.status) {
          // ถ้าไม่มี deadline กำหนดไว้ หรือ deadline เดิมอยู่ก่อนวันที่ 29 มีนาคม 2568
          // ให้สุ่มวันที่ระหว่าง 30 มีนาคม - 15 เมษายน 2568
          const day = Math.floor(Math.random() * 16) + 30; // สุ่มวันที่ 30 มีนาคม - 15 เมษายน
          const month = day > 31 ? "เมษายน" : "มีนาคม"; // ถ้าวันที่เกิน 31 ให้เป็นเดือนเมษายน
          const actualDay = day > 31 ? day - 31 : day; // ปรับวันที่ให้ถูกต้องกตามเดือน
          activityDeadline = `${actualDay} ${month} 2568`;
        }

        // สร้างข้อมูลสรุปกิจกรรมสำหรับกิจกรรมที่ผ่านมาแล้ว (past)
        let activitySummary = "";
        if (activity.status === "past") {
          // สร้างข้อมูลสรุปกิจกรรมตาม ID ของกิจกรรม
          if (activity.id === "103-4") {
            activitySummary = `กิจกรรมทริปถ่ายภาพธรรมชาติที่อุทยานแห่งชาติเขาใหญ่ได้จัดขึ้นเมื่อวันที่ ${
              activity.date
            } มีผู้เข้าร่วมทั้งสิ้น ${Math.floor(
              (activity.maxParticipants || 30) * 0.9
            )} คน ผู้เข้าร่วมได้เรียนรู้เทคนิคการถ่ายภาพธรรมชาติและสัตว์ป่า ได้ฝึกปฏิบัติจริงในสถานที่จริง และได้ภาพถ่ายสวยๆ กลับไปมากมาย นอกจากนี้ยังได้สัมผัสบรรยากาศธรรมชาติและได้ออกกำลังกายจากการเดินป่า ทางชมรมขอขอบคุณทุกท่านที่มาร่วมกิจกรรมในครั้งนี้`;
          } else if (activity.id === "103-5") {
            activitySummary = `เวิร์กช็อปถ่ายภาพบุคลคลกับคุณณิชาภัทร ศรีมงคล ได้จัดขึ้นเมื่อวันที่ ${
              activity.date
            } ณ ${activity.location} มีผู้เข้าร่วมทั้งสิ้น ${Math.floor(
              (activity.maxParticipants || 30) * 0.85
            )} คน ผู้เข้าร่วมได้เรียนรู้เทคนิคการจัดแสง การจัดท่าทาง และการปรับแต่งภาพบุคคลให้ดูสวยงามและเป็นธรรมชาติ ทุกคนได้ลงมือปฏิบัติจริงและได้ภาพถ่ายที่สวยงามกลับไป พร้อมทั้งได้รับ Lightroom Preset สำหรับภาพบุคคลที่มีมูลค่า 500 บาท`;
          } else {
            // สำหรับกิจกรรม past อื่นๆ ที่ไม่ได้กำหนดเฉพาะ
            activitySummary = `กิจกรรม ${
              activity.activityName
            } ได้จัดขึ้นเมื่อวันที่ ${activity.date} ณ ${
              activity.location
            } มีผู้เข้าร่วมทั้งสิ้น ${Math.floor(
              (activity.maxParticipants || 30) * 0.8
            )} คน กิจกรรมดำเนินไปด้วยความเรียบร้อย ผู้เข้าร่วมได้รับความรู้และประสบการณ์ที่ดี มีการแลกเปลี่ยนความคิดเห็นและทำกิจกรรมร่วมกัน ทางชมรมขอขอบคุณทุกท่านที่มาร่วมกิจกรรมในครั้งนี้ และหวังว่าจะได้พบกันในกิจกรรมครั้งต่อไป`;
          }
        }

        // สร้างข้อมูลรูปภาพสำหรับกิจกรรมที่ผ่านมาแล้ว (past)
        const activityImages =
          activity.status === "past"
            ? [
                `https://picsum.photos/800/600?random=${activity.id}-1`,
                `https://picsum.photos/800/600?random=${activity.id}-2`,
                `https://picsum.photos/800/600?random=${activity.id}-3`,
              ]
            : [];

        return {
          id: activity.id,
          activityName: activity.activityName || activity.title || `กิจกรรม ${activity.id}`,
          date: activityDate,
          time: activity.time,
          location: activity.location,
          aboutActivity: activity.aboutActivity || activity.description || `รายละเอียดกิจกรรมที่จัดขึ้นที่ ${activity.location} ในวันที่ ${activity.date} เวลา ${activity.time}`,
          status: activity.status || "upcoming",
          clubId: clubId,
          fee: activity.fee || "ฟรี",
          deadline: activityDeadline,
          maxParticipants: activity.maxParticipants || 30,
          benefits: activity.benefits || {
            activityHours:
              activity.activityHours.universityActivity +
              activity.activityHours.fitnessActivity +
              activity.activityHours.socialActivity,
            certificate: true,
            other: "ได้รับประสบการณ์และความรู้ใหม่ๆ",
          },
          requirements: activity.requirements || "เปิดรับนิสิตทุกคณะ",
          detailedDescription: activity.detailedDescription,
          summary: activitySummary || undefined,
          images: activityImages.length > 0 ? activityImages : undefined,
        };
      }
    );

    return res.status(200).json(activitiesFromClub);
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรมขององค์กรนิสิต" });
  }
}
