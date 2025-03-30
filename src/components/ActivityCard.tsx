import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Add clubId to your props interface
interface ActivityCardProps {
  activity: any;
  clubId: string; // Add this line
}

// Update the function signature to include clubId
export default function ActivityCard({ activity, clubId }: ActivityCardProps) {
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
        <h3 className="text-lg font-bold">{activity.activityName || `กิจกรรม ${activity.id}`}</h3>
        <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 w-full sm:w-auto" asChild>
          <Link href={`/club/${clubId}/activities/${activity.id}`}>
            ดูรายละเอียดทั้งหมด
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-gray-600">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">{activity.date}</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{activity.time}</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{activity.location}</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-sm">รับ: {activity.maxParticipants} คน</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-700 mb-3">{activity.aboutActivity || `รายละเอียดกิจกรรมที่จัดขึ้นที่ ${activity.location} ในวันที่ ${activity.date} เวลา ${activity.time}`}</p>
      
      <div className="flex flex-wrap gap-2">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          ค่าใช้จ่าย: {activity.fee}
        </span>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          เกียรติบัตร: {activity.benefits?.certificate ? 'มี' : 'ไม่มี'}
        </span>
        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
          สมัครภายใน: {activity.deadline}
        </span>
      </div>
    </div>
  );
}