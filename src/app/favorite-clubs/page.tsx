"use client";
import Loading from '@/components/Loading';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import ClubBoxSkeleton from '@/components/ClubBoxSkeleton';
import ClubBox from '@/components/ClubBox';
import { ActivitySkeleton } from '@/components/skeleton/activity-skeleton';
import FilterSelected from '@/components/FilterSelected';
import Club from '@/interfaces/Club';
import { Skeleton } from '@/components/skeleton/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function page() {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      fetchClubs();
    }, [searchTerm, sortOption]);

    const fetchClubs = () => {
      const searchParams = new URLSearchParams();
      searchParams.set("search", searchTerm);
      searchParams.set("sortType", sortOption);

      fetch("/api/club?" + searchParams.toString())
        .then((res) => res.json())
        .then((data: Club[]) => {
          setClubs(data);
          setFilteredClubs(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching clubs:", error);
          setIsLoading(false);
        });
    }
    
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-5">
        <div className="flex flex-col md:flex-row md:min-h-screen bg-gray-50">
          {/* Sidebar - Club Detail */}
          {isLoading ? (
            <div className="w-full md:w-80 lg:w-96 bg-green-800 text-white p-4 md:sticky md:top-0 md:h-screen md:overflow-y-auto shrink-0">
              <div className="space-y-4">
                {/* Skeleton loaders */}
                <div className="h-4 w-16 mb-2 bg-green-700 animate-pulse rounded"></div>
                <div className="h-6 w-24 bg-green-700 animate-pulse rounded"></div>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-80 lg:w-96 bg-green-800 text-white md:sticky md:top-0 md:h-screen md:overflow-y-auto shrink-0">
              {/* <ClubDetail club={clubForDetail} /> */}
              <div className="h-full px-3 py-4 overflow-y-auto bg-green-900 text-green-100">
                <Link
                  href="/"
                  className="flex items-center mb-6 cursor-pointer"
                >
                  <ArrowLeft className="mr-2" />
                  <h2 className="text-xl font-medium">ย้อนกลับไปหน้าหลัก</h2>
                </Link>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-2xl text-bold text-green-300">
                      ชมรมโปรด
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Main content -  Clubs*/}
        <div className="px-8 md:px-16 py-20 w-full">
          <Loading
            isLoading={isLoading}
            fallback={
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-10 w-full" />
              </div>
            }
          >
            <div className="flex justify-between items-center mb-4 gap-x-2">
              <div className="flex mt-4 gap-2 w-full border border-gray-900 bg-gray-100 rounded-lg p-2">
                <Search />
                <input
                  className="flex-1 border-none focus:border-transparent focus:ring-0 focus:outline-none bg-transparent text-sm"
                  type="search"
                  placeholder="ค้นหาชมรมที่ชื่นชอบ"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <Select value={sortOption} onValueChange={(value) => setSortOption(value as "asc" | "desc")}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="เรียงลำดับตาม" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">
                      เรียงตาม A-z/ก-ฮ
                    </SelectItem>
                    <SelectItem value="desc">
                      เรียงตาม z-a ,ฮ-ก
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Loading>
          <div className="grid auto-rows-max gap-3 grid-cols-1 md:grid-cols-2">
            <Loading
              isLoading={isLoading}
              fallback={Array.from({ length: 8 })
                .fill("")
                .map((_, i) => (
                  <ClubBoxSkeleton key={i} />
                ))}
            >
              {filteredClubs.length > 0 ? (
                filteredClubs.map((club) => {
                  const isFav = localStorage.getItem(`favoriteClub-${club.id}`);
                  return (
                    isFav && (
                      <ClubBox
                        key={club.id}
                        id={club.id}
                        clubType={club.clubType}
                        campus={club.campus}
                        clubName={club.clubName}
                        handler={() => {
                          setIsLoading(true);
                          fetchClubs()
                        }}
                      />
                    )
                  );
                })
              ) : (
                <p className="text-gray-500">ไม่พบชมรม</p>
              )}
            </Loading>
          </div>
        </div>
      </div>
    );
}