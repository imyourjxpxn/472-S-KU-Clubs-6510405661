export interface ActivityHours {
  universityActivity: number;
  fitnessActivity: number;
  socialActivity: number;
}

// เพิ่มฟิลด์ที่จำเป็นใน ActivityInterface
export interface ActivityInterface {
  id: string;
  date: string;
  location: string;
  time: string;
  status?: 'upcoming' | 'ongoing' | 'past';
  
  // เพิ่มฟิลด์ที่ใช้ในข้อมูล JSON
  activityName?: string;
  title?: string;
  aboutActivity?: string;
  description?: string;
  
  activityHours: {
    universityActivity: number;
    fitnessActivity: number;
    socialActivity: number;
  };
  
  maxParticipants?: number;
  fee?: string;
  deadline?: string;
  benefits?: {
    activityHours?: number;
    certificate?: boolean;
    other?: string;
  };
  requirements?: string;
  detailedDescription?: string;
}

// คงไว้ซึ่ง default export
export default interface Activity {
  id: string;
  activityName: string;  // เปลี่ยนจาก title เป็น activityName
  date: string;
  time: string;
  location: string;
  aboutActivity: string;  // เปลี่ยนจาก description เป็น aboutActivity
  status: string;
  clubId: string;
  fee: string;
  deadline: string;
  maxParticipants: number;
  benefits: {
    certificate: boolean;
    other: string;
  };
  requirements: string;
  detailedDescription: string;
  summary?: string;
  images?: string[];
  activityHours: {
    universityActivity: number;
    fitnessActivity: number;
    socialActivity: number;
  };
}
