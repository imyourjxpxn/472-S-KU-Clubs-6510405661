"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ActivityDetail {
  id: string;
  activityName: string;
  date: string;
  time: string;
  location: string;
  aboutActivity: string;
  status: string;
  clubId: string;
  fee: string;
  deadline: string;
  maxParticipants: number;
  benefits: {
    activityHours?: number;
    certificate: boolean;
    other: string;
  };
  requirements: string;
  detailedDescription?: string;
  summary?: string;
  images?: string[];
}

export default function ActivityDetailPage() {
  const params = useParams();
  // Safely access params with nullish coalescing operator
  const clubId = params?.id as string || '';
  const activityId = params?.activityId as string || '';
  
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!activityId || !clubId) return;

    const fetchActivityDetail = async () => {
      try {
        setLoading(true);
        // ดึงข้อมูลกิจกรรมจาก API - ปรับ URL ให้ตรงกับ API route ใหม่
        const response = await fetch(`/api/club/${clubId}/activities/${activityId}`);
        
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลกิจกรรมได้');
        }
        
        const data = await response.json();
        setActivity(data);
        
        // Set the first image as selected if available
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลกิจกรรมได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    fetchActivityDetail();
  }, [activityId, clubId]); // เพิ่ม clubId เป็น dependency

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <p className="text-red-500 mb-4">{error || 'ไม่พบข้อมูลกิจกรรม'}</p>
          <Button asChild>
            <Link href={`/club/${clubId}/activities`}>กลับไปหน้ากิจกรรมชมรม</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/club/${clubId}/activities`} className="text-green-600 hover:text-green-800 transition-colors flex items-center">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="font-medium">กลับไปหน้ากิจกรรมชมรม</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        {activity.status === 'past' && activity.images && activity.images.length > 0 && (
          <div className="mb-6">
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-4">
              <Image
                src={selectedImage || activity.images[0]}
                alt={activity.activityName}
                fill
                className="object-cover"
                onError={(e) => {
                  // @ts-ignore
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/default-activity.jpg";
                }}
              />
            </div>
            
            {/* แสดงแกลเลอรี่ย่อยเมื่อมีรูปมากกว่า 1 รูป */}
            {activity.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {activity.images.slice(0, 5).map((img, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === img ? 'border-green-500' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`${activity.activityName} - รูปที่ ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // @ts-ignore
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/default-activity.jpg";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-start mb-6 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{activity.activityName}</h1>
          <div className={`px-4 py-2 rounded-full font-medium ${activity.status === 'past'
              ? 'bg-gray-100 text-gray-600'
              : activity.status === 'ongoing'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
            {activity.status === 'upcoming' ? 'กำลังจะมาถึง' :
              activity.status === 'ongoing' ? 'กำลังดำเนินการ' : 'ผ่านไปแล้ว'}
          </div>
        </div>

        {/* รายละเอียดกิจกรรม */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4 text-green-800">รายละเอียดกิจกรรม</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">วันที่จัดกิจกรรม</p>
                  <p className="text-gray-600">{activity.date}</p>
                </div>
              </div>
              
              {/* ส่วนอื่นๆ ยังคงเหมือนเดิม */}
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">เวลา</p>
                  <p className="text-gray-600">{activity.time}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">สถานที่</p>
                  <p className="text-gray-600">{activity.location}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">ค่าใช้จ่าย</p>
                  <p className="text-gray-600">{activity.fee}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* แสดงส่วนข้อมูลการสมัครเฉพาะกิจกรรมที่ยังไม่ผ่านไป */}
          {activity.status !== 'past' && (
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-4 text-green-800">ข้อมูลการสมัคร</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">จำนวนผู้เข้าร่วม</p>
                    <p className="text-gray-600">รับสมัครสูงสุด {activity.maxParticipants} คน</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">สมัครภายใน</p>
                    <p className="text-gray-600">{activity.deadline}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* แสดงสรุปกิจกรรมสำหรับกิจกรรมที่ผ่านไปแล้ว */}
          {activity.status === 'past' && activity.summary && (
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-4 text-green-800">สรุปกิจกรรม</h2>
              <p className="text-gray-700 whitespace-pre-line">{activity.summary}</p>
            </div>
          )}
          
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4 text-green-800">รายละเอียดเพิ่มเติม</h2>
            <div className="mb-4">
              <p className="text-gray-700 whitespace-pre-line">{activity.aboutActivity}</p>
              {activity.detailedDescription && (
                <p className="text-gray-700 mt-2 whitespace-pre-line">{activity.detailedDescription}</p>
              )}
            </div>
          </div>
          
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4 text-green-800">คุณสมบัติผู้สมัคร</h2>
            <p className="text-gray-700">{activity.requirements}</p>
          </div>
          
          {activity.benefits && (
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-4 text-green-800">ประโยชน์ที่จะได้รับ</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {activity.benefits.activityHours && (
                  <li>ชั่วโมงกิจกรรม: {activity.benefits.activityHours} ชั่วโมง</li>
                )}
                {activity.benefits.certificate && (
                  <li>ได้รับเกียรติบัตร</li>
                )}
                {activity.benefits.other && (
                  <li>{activity.benefits.other}</li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        {/* ปุ่มสมัครเข้าร่วมกิจกรรม (สำหรับกิจกรรมที่กำลังจะมาถึงเท่านั้น) */}
        {activity.status === 'upcoming' && (
          <div className="mt-8 flex justify-center">
            <Button
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg text-lg w-full sm:w-auto"
              asChild
            >
              <a href="https://forms.gle/D9nXwDneC4rBxBNq8" target="_blank" rel="noopener noreferrer">
                สมัครเข้าร่วมกิจกรรม
              </a>
            </Button>
          </div>
        )}
        
        {/* ปุ่มดูรูปภาพทั้งหมด (สำหรับกิจกรรมที่ผ่านไปแล้วและมีรูปมากกว่า 5 รูป) */}
        {activity.status === 'past' && activity.images && activity.images.length > 5 && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              className="text-green-700 border-green-700 hover:bg-green-50"
              asChild
            >
              <Link href={`/club/${clubId}/activities/${activityId}/gallery`}>
                ดูรูปภาพทั้งหมด ({activity.images.length} รูป)
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}