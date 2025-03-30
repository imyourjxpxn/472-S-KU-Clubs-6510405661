import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import ClubInterface from "@/interfaces/Club";
import { ActivityInterface } from "@/interfaces/Activity";

export default async function getActivityById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Add Delay to simulate server response time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const clubId = req.query.id as string;
  const activityId = req.query.activityId as string;

  if (!clubId || isNaN(Number(clubId)) || !activityId) {
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
    // Fix the type comparison issue by using a more robust approach
    const club = clubs.find((club: ClubInterface) => {
      // Convert both to string for comparison to avoid type issues
      return String(club.id) === String(clubId);
    });

    if (!club) {
      return res.status(404).json({ message: "ไม่พบข้อมูลชมรม" });
    }

    // Check if activities array exists
    if (!club.activities || !Array.isArray(club.activities)) {
      return res.status(404).json({ message: "ไม่มีข้อมูลกิจกรรมของชมรมนี้" });
    }

    const activity = club.activities.find(
      (act: ActivityInterface) => act.id === activityId
    );

    // Inside the try block, after finding the activity
    if (!activity) {
      return res.status(404).json({ message: "ไม่พบข้อมูลกิจกรรม" });
    }
    
    // แปลงข้อมูลกิจกรรมให้เข้ากับรูปแบบที่ต้องการใช้ในหน้ารายละเอียดกิจกรรม
    // ใช้วันที่จากข้อมูล JSON โดยตรง ไม่ต้องกำหนดค่าพิเศศสำหรับ ongoing
    const activityDate = activity.date;
    
    // กำหนด deadline สำหรับกิจกรรม upcoming
    let activityDeadline = activity.deadline || activityDate;
    if (activity.status === "upcoming" && !activity.deadline) {
      const day = Math.floor(Math.random() * 16) + 30;
      const month = day > 31 ? "เมษายน" : "มีนาคม";
      const actualDay = day > 31 ? day - 31 : day;
      activityDeadline = `${actualDay} ${month} 2568`;
    }
    
    // สร้างข้อมูลสรุปกิจกรรมสำหรับกิจกรรมที่ผ่านมาแล้ว (past)
    let activitySummary = "";
    if (activity.status === "past") {
      if (activity.id === "103-4") {
        activitySummary = `กิจกรรมทริปถ่ายภาพธรรมชาติที่อุทยานแห่งติดขึ้นเมื่อวันที่ ${activity.date
          } มีผู้เข้าร่วมทั้งสิ้น ${Math.floor(
            (activity.maxParticipants || 30) * 0.9
          )} คน ผู้เข้าร่วมได้เรียนรู้เทคนิคการถ่ายภาพธรรมชาติและสัตว์ป่า ได้ฝึกปฏิบัติจริงในสถานที่จริง และได้ภาพถ่ายสวยๆ กลับไปมากมาย นอกจากนี้ยังได้สัมผัสยากาศธรรมชาติและได้ออกกำลังกายจากการเดินป่า ทางชมรมขอขอบคุณทุกท่านที่มาร่วมกิจกรรมในครั้งนี้`;
      } else if (activity.id === "103-5") {
        activitySummary = `เวิร์กช็อปถ่ายภาพบุคลคลกับคุณณิชาภัทร ศรีมงคล ได้จัดขึ้นเมื่อวันที่ ${activity.date
          } ณ ${activity.location} มีผู้เข้าร่วมทั้งสิ้น ${Math.floor(
            (activity.maxParticipants || 30) * 0.85
          )} คน ผู้เข้าร่วมได้เรียนรู้เทคนิคการจัดแสง การจัดท่าทาง และการปรับแต่งภาพบุคคลให้ดูสวยงามและเป็นธรรมชาติ ทุกคนได้ลงมือปฏิบัติจริงและได้ภาพถ่ายที่สวยงามกลับไป พร้อมทั้งได้รับ Lightroom Preset สำหรับภาพบุคคลที่มีมูลค่า 500 บาท`;
      } else {
        activitySummary = `กิจกรรม ${activity.activityName
          } ได้จัดขึ้นเมื่อวันที่ ${activity.date} ณ ${activity.location
          } มีผู้เข้าร่วมทั้งสิ้น ${Math.floor(
            (activity.maxParticipants || 30) * 0.8
          )} คน กิจกรรมดำเนินไปด้วยความเรียบร้อย ผู้เข้าร่วมได้รับความรู้และประสบการณ์ที่ดี มีการแลกเปลี่ยนความคิดเห็นและทำกิจกรรมร่วมกัน ทางชมรมขอขอบคุณทุกท่านที่มาร่วมกิจกรรมในครั้งนี้ และหวังว่าจะได้พบกันในกิจกรรมครั้งต่อไป`;
      }
    }

    // สร้างข้อมูลรูปภาพสำหรับกิจกรรมที่ผ่านมาแล้ว (past)
    let activityImages: string[] = [];
    let debugInfo = `Club ID: ${clubId}, Activity ID: ${activityId}, Status: ${activity.status || "unknown"}`;

    // คอลเลกชันรูปภาพตามประเภทชมรม
    const imageCollections: Record<string, string[]> = {
      "ศิลปะและดนตรี": [
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop"
      ],
      "กีฬาและสุขภาพ": [
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop"
      ],
      "จิตอาสาและพัฒนาสังคม": [
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&h=600&fit=crop"
      ],
      "วิทยาศาสตร์และเทคโนโลยี": [
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop"
      ],
      "ศิลปะและสื่อสาร": [
        "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=600&fit=crop"
      ],
      "เทคโนโลยีและการพัฒนา": [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
      ],
      "ภาษาและวรรณกรรม": [
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&h=600&fit=crop"
      ],
      "การเรียนรู้และพัฒนา": [
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop"
      ],
      "สังคมและมนุษย์ศาสตร์": [
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop"
      ]
    };

    // Add fallback images that don't rely on external services
    const fallbackImages = [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop",
    ];
    
    // เลือกคอลเลกชันรูปภาพตามประเภทชมรม
    let selectedCollection = imageCollections["วิทยาศาสตร์และเทคโนโลยี"]; // Default to tech images
    
    // ตรวจสอบว่าประเภทชมรมตรงกับคีย์ในคอลเลกชันหรือไม่
    if (club.clubType && imageCollections[club.clubType]) {
      selectedCollection = imageCollections[club.clubType];
      debugInfo += `, Using collection for: ${club.clubType}`;
    } else {
      debugInfo += `, Using default collection`;
    }
    
    
    // ใช้ activity ID เป็น seed ในการสุ่มรูปภาพ
    const activityIdNum = parseInt(activity.id.replace(/\D/g, '')) || 0;
    
    // สร้างฟังก์ชันสุ่มที่ใช้ seed จาก activity ID
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    // สุ่มเลือกรูปภาพ 3 รูปที่ไม่ซ้ำกันโดยใช้ activity ID เป็น seed
    const getUniqueImages = (images: string[], count: number, seed: number) => {
      const shuffled = [...images];
      
      // สลับตำแหน่งรูปภาพโดยใช้ seed
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      return shuffled.slice(0, Math.min(count, shuffled.length));
    };
    
    // เลือกรูปภาพ 3 รูปที่ไม่ซ้ำกันสำหรับกิจกรรมนี้
    const imageCount = 3;
    try {
      activityImages = getUniqueImages(selectedCollection, imageCount, activityIdNum);
      
      activityImages = await Promise.all(
        activityImages.map((img, index) =>
          loadImageWithFallback(img, fallbackImages[index % fallbackImages.length])
        )
      );
      
      // If we didn't get enough images or any image fails to load, add fallback images
      if (activityImages.length < imageCount) {
        const neededFallbacks = imageCount - activityImages.length;
        activityImages = [
          ...activityImages,
          ...getUniqueImages(fallbackImages, neededFallbacks, activityIdNum + 100)
        ];
        debugInfo += `, Added ${neededFallbacks} fallback images`;
      }
    } catch (error) {
      console.error("Error generating images:", error);
      // Use fallback images if there's an error
      activityImages = getUniqueImages(fallbackImages, imageCount, activityIdNum + 100);
      debugInfo += `, Error handled, using fallback images`;
    } finally {
      debugInfo += `, Generated ${activityImages.length} images with seed ${activityIdNum}`;
    }
      const activityDetail = {
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
            (activity.activityHours?.universityActivity || 0) +
            (activity.activityHours?.fitnessActivity || 0) +
            (activity.activityHours?.socialActivity || 0) || 2,
          certificate: true,
          other: "ได้รับประสบการณ์และความรู้ใหม่ๆ",
        },
        requirements: activity.requirements || "เปิดรับนิสิตทุกคณะ",
        detailedDescription: activity.detailedDescription,
        summary: activitySummary || undefined,
        images: activityImages, // Always include images
        showHeaderImage: true, // Set to true to ensure images are displayed
        galleryTitle: activity.status === "past" ? "ภาพจากการจัดกิจกรรม" :
          activity.status === "ongoing" ? "ภาพกิจกรรมที่กำลังดำเนินการ" :
            "ภาพกิจกรรม",
        debugInfo: debugInfo
      };

      return res.status(200).json(activityDetail);
    } catch (error) {
      console.error("Error fetching activity:", error);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม" });
    }
  } // Add this closing brace for the main handler function

// Function to load images with fallback
async function loadImageWithFallback(imageUrl: string, fallbackUrl: string) {
    const controller = new AbortController();
    const timeoutDuration = 30000; // Increase timeout duration to 30 seconds
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
  
    try {
      const response = await fetch(imageUrl, {
        signal: controller.signal,
      });
    
      clearTimeout(timeoutId);
    
      if (!response.ok) {
        throw new Error('Image load failed');
      }
      return imageUrl;
    } catch (error) {
      if (error instanceof Error) { // Type assertion for error
        if (error.name === 'AbortError') {
          console.error(`Timeout error loading image ${imageUrl}:`, error);
        } else {
          console.error(`Error loading image ${imageUrl}:`, error);
        }
      } else {
        console.error(`Unknown error loading image ${imageUrl}:`, error);
      }
      return fallbackUrl;
    } finally {
      clearTimeout(timeoutId);
    }
}