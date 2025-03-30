import React from 'react';
import ActivityCard from './ActivityCard';

interface ActivityListProps {
  activities: any[];
  status: string;
  clubId: string;
}

export default function ActivityList({ activities, status, clubId }: ActivityListProps) {
  const filteredActivities = activities.filter(activity => activity.status === status);
  
  if (filteredActivities.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">
          {status === 'upcoming' 
            ? 'ไม่พบกิจกรรมที่กำลังจะมาถึง' 
            : status === 'ongoing' 
              ? 'ไม่พบกิจกรรมที่กำลังดำเนินการ' 
              : 'ไม่พบกิจกรรมที่ผ่านมาแล้ว'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredActivities.map(activity => {
        // ตรวจสอบและเพิ่มฟิลด์ที่จำเป็นถ้าไม่มี
        const enhancedActivity = {
          ...activity,
          activityName: activity.activityName || activity.title || `กิจกรรม ${activity.id}`,
          aboutActivity: activity.aboutActivity || activity.description || `รายละเอียดกิจกรรมที่จัดขึ้นที่ ${activity.location} ในวันที่ ${activity.date} เวลา ${activity.time}`
        };
                
        return (
          <ActivityCard key={activity.id} activity={enhancedActivity} clubId={clubId} />
        );
      })}
    </div>
  );
}