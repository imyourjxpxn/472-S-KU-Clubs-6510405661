"use client";
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ActivitySkeleton } from '@/components/skeleton/activity-skeleton';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ClubDetail from '@/components/ClubDetail';
import ActivityList from '@/components/ActivityList';
import ClubInterface from '@/interfaces/Club';
import { useParams } from 'next/navigation';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function ClubDetailPage() {
  const { id } = useParams() as { id: string };
  const [loadingClub, setLoadingClub] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [clubData, setClubData] = useState<ClubInterface | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);

  function getClubById() {
    fetch(`/api/club/${id}`)
      .then(res => res.json())
      .then(data => {
        setClubData(data);
        setLoadingClub(false);
      })
      .catch(error => {
        console.error("Error fetching club data:", error);
        setLoadingClub(false);
      });
  }

  function getActivityById() {
    fetch(`/api/club/${id}/activities`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          console.error("Received non-array data:", data);
          setActivities([]);
        }
        setLoadingActivities(false);
      })
      .catch(error => {
        console.error("Error fetching activities:", error);
        setLoadingActivities(false);
        setActivities([]);
      });
  }

  useEffect(() => {
    getClubById();
    getActivityById();
  }, [id]);

  // Filter and sort activities
  useEffect(() => {
    if (!loadingActivities) {
      let result = [...activities];

      // Filter activities by search term
      if (searchTerm) {
        result = result.filter(activity =>
          (activity.activityName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (activity.aboutActivity?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (activity.location?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (activity.date?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Define a type for the Thai months mapping
      const thaiMonths: Record<string, number> = {
        "ม.ค.": 0, "ก.พ.": 1, "มี.ค.": 2, "เม.ย.": 3, "พ.ค.": 4, "มิ.ย.": 5,
        "ก.ค.": 6, "ส.ค.": 7, "ก.ย.": 8, "ต.ค.": 9, "พ.ย.": 10, "ธ.ค.": 11
      };

      // Define an interface for the activity object
      interface ActivityData {
        id: string;
        activityName: string;
        date: string;
        time: string;
        location: string;
        aboutActivity: string;
        status: string;
        clubId: string;
        // Add other properties as needed
      }

      function parseDateTime(activity: ActivityData) {
        try {
          if (!activity.date || !activity.time) return null;
          
          // Split the date string and handle different formats
          const dateParts = activity.date.split(" ");
          if (dateParts.length < 3) {
            return null;
          }
          
          const day = parseInt(dateParts[0]);
          const monthThai = dateParts[1];
          const yearThai = dateParts[2];
          
          // Check if the month is valid
          if (!thaiMonths.hasOwnProperty(monthThai)) {
            return null;
          }
          
          // Parse time (handle different formats)
          let hour = 0, minute = 0;
          if (activity.time) {
            const timeParts = activity.time.includes("-") 
              ? activity.time.split("-")[0].trim() 
              : activity.time.trim();
              
            if (timeParts.includes(".")) {
              [hour, minute] = timeParts.split(".").map(part => parseInt(part));
            } else if (timeParts.includes(":")) {
              [hour, minute] = timeParts.split(":").map(part => parseInt(part));
            }
          }

          const year = parseInt(yearThai) - 543; // แปลง พ.ศ. -> ค.ศ.
          const month = thaiMonths[monthThai]; // แปลงเดือนเป็นตัวเลข
          
          const date = new Date(year, month, day, hour, minute);
          return date;
        } catch (error) {
          return null;
        }
      }

      // Sort activities by sort option
      switch (sortOption) {
        case 'latestToOldest':
          result.sort((a, b) => {
            const dateA = parseDateTime(a);
            const dateB = parseDateTime(b);
            if (!dateA || !dateB) return 0;
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case 'oldestToLatest':
          result.sort((a, b) => {
            const dateA = parseDateTime(a);
            const dateB = parseDateTime(b);
            if (!dateA || !dateB) return 0;
            return dateA.getTime() - dateB.getTime();
          });
          break;
        case 'alphabetical':
          result.sort((a, b) => (a.activityName || '').localeCompare(b.activityName || ''));
          break;
        case 'reverseAlphabetical':
          result.sort((a, b) => (b.activityName || '').localeCompare(a.activityName || ''));
          break;
      }

      setFilteredActivities(result);
    }
  }, [searchTerm, sortOption, activities, loadingActivities]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar - Club Detail */}
      <aside id="default-sidebar" className="w-full md:w-80 lg:w-96 bg-green-800 text-white md:sticky md:top-0 md:h-screen md:overflow-y-auto shrink-0" aria-label="Sidebar">
        <div className="h-full px-3 py-4 bg-green-900 text-green-100 overflow-y-auto flex flex-col">
          <Link href="/" className="flex items-center mb-6 cursor-pointer">
            <ArrowLeft className="mr-2" />
            <h2 className="text-xl font-medium">ย้อนกลับ</h2>
          </Link>
          {!clubData && !loadingClub ? (
            <div className="flex flex-col items-center justify-center mt-auto mb-auto">
              <RefreshCcw className="w-12 h-12 text-white-800 mb-4" />
              <p className="text-2xl font-semibold text-white-800 mb-6">
                เกิดข้อผิดพลาด (500)
              </p>
              <button onClick={() => {
                setLoadingClub(true);
                getClubById();
              }} className="bg-green-600 text-white py-3 px-8 rounded-xl shadow-lg hover:bg-green-500 transition duration-300 ease-in-out">
                รีเฟรช
              </button>
            </div>
          ) : (
            <ClubDetail club={clubData} />
          )}
        </div>
      </aside>

      {/* Main content - Club Activities */}
      <div className="flex-1 p-4 md:p-6 md:overflow-y-auto">
        {loadingActivities ? (
          <>
            {/* Skeleton for banner */}
            <div className="w-full h-40 md:h-48 rounded-lg mb-4 md:mb-6 bg-gray-200 animate-pulse"></div>

            {/* Skeleton for heading */}
            <div className="h-8 w-48 mb-4 md:mb-6 bg-gray-200 animate-pulse rounded"></div>

            {/* Skeleton for tabs */}
            <div className="mb-4 md:mb-6">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded flex-shrink-0"></div>
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded flex-shrink-0"></div>
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded flex-shrink-0"></div>
              </div>
            </div>

            {/* Skeleton for activities */}
            <ActivitySkeleton />
            <ActivitySkeleton />
          </>
        ) : (
          <>
            <div className="w-full h-32 md:h-48 bg-gray-200 rounded-lg overflow-hidden relative mb-4 md:mb-6">
              <Image
                src={`/images/clubs/default-banner.jpg`}
                alt={`${clubData?.clubName || 'Club'} Banner`}
                fill
                className="object-cover"
                onError={(e) => {
                  // @ts-ignore
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/default-banner.jpg";
                }}
              />
            </div>

            <h1 className="text-xl md:text-2xl font-bold mb-2">กิจกรรมทั้งหมดของชมรม</h1>
            <p className="text-sm md:text-base text-gray-600 mb-4">นี่คือกิจกรรมหรืออีเวนต์ต่าง ๆ ภายในชมรมที่กำลังจะจัดขึ้น สามารถเลือกเข้าร่วมกิจกรรมที่คุณสนใจได้เลย!</p>

            {/* ส่วนค้นหาและเรียงลำดับ */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4 md:mb-6">
              <Input
                placeholder="ค้นหากิจกรรม..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="เรียงลำดับตาม" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latestToOldest">กิจกรรมล่าสุดไปเก่าสุด</SelectItem>
                  <SelectItem value="oldestToLatest">กิจกรรมเก่าสุดไปล่าสุด</SelectItem>
                  <SelectItem value="alphabetical">เรียงตาม A-z/ก-ฮ</SelectItem>
                  <SelectItem value="reverseAlphabetical">เรียงตาม z-a ,ฮ-ก</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* แท็บกิจกรรม */}
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-4 bg-gray-50 overflow-x-auto flex w-full border-b border-gray-200">
                <TabsTrigger value="upcoming" className="flex-1 data-[state=active]:bg-green-100 data-[state=active]:text-green-800">กำลังจะมาถึง</TabsTrigger>
                <TabsTrigger value="ongoing" className="flex-1 data-[state=active]:bg-green-100 data-[state=active]:text-green-800">กำลังดำเนินการ</TabsTrigger>
                <TabsTrigger value="past" className="flex-1 data-[state=active]:bg-green-100 data-[state=active]:text-green-800">ผ่านมาแล้ว</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                <ActivityList activities={filteredActivities} status="upcoming" clubId={id} />
              </TabsContent>

              <TabsContent value="ongoing">
                <ActivityList activities={filteredActivities} status="ongoing" clubId={id} />
              </TabsContent>

              <TabsContent value="past">
                <ActivityList activities={filteredActivities} status="past" clubId={id} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}