"use client";
import { Skeleton } from "@/components/skeleton/skeleton";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import FilterSelected from "@/components/FilterSelected";
import ClubBox from "@/components/ClubBox";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import ClubBoxSkeleton from "@/components/ClubBoxSkeleton";
import Image from "next/image";
import ClubInterface from "@/interfaces/Club";

export default function Home() {
  const [clubs, setClubs] = useState<ClubInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClubType, setSelectedClubType] = useState("ทุกประเภท");
  const [selectedCampus, setSelectedCampus] = useState("ทุกวิทยาเขต");
  const [filteredClubs, setFilteredClubs] = useState(clubs);
  const [durringPage, setDurringPage] = useState(1);
  const pageCount = Math.ceil(clubs.length / 6);

  // Fetch club data from API
  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.set("search", searchTerm);
    searchParams.set("selectedClubType", selectedClubType);
    searchParams.set("selectedCampus", selectedCampus);
    fetch("/api/clubs?" + searchParams.toString())
      .then((res) => res.json())
      .then((data) => {
        setClubs(data);
        setFilteredClubs(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching clubs:", error);
        setIsLoading(false);
      });
  }, [searchTerm, selectedClubType, selectedCampus]);

  return (
    <div className="w-screen h-screen px-4 py-8 md:flex gap-6">
      <div className="md:w-[500px]">
        <Loading
          isLoading={isLoading}
          fallback={
            <>
              <Skeleton className="h-10 w-full mt-4" />
              <Skeleton className="h-[24px] w-[60px] mt-3" />
              <Skeleton className="h-10 w-full rounded-none rounded-tr-lg rounded-tl-lg mt-3" />
              <div className="w-full h-0.5"></div>
              <Skeleton className="h-10 w-full rounded-none rounded-br-lg rounded-bl-lg" />
            </>
          }
        >
          <h6 className="text-3xl font-semibold">
            <span className="text-lime-700">KU</span> Clubs
          </h6>
          {/* Search Input */}
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
          <p className="font-medium mt-3">Filters</p>
          {/* Club Type Filter */}
          <div className="mt-3">
            <FilterSelected
              placeholder="ประเภทชมรม"
              items={[
                "ทุกประเภท",
                "ศิลปะและดนตรี",
                "กีฬาและสุขภาพ",
                "จิตอาสาและพัฒนาสังคม",
                "ศิลปะและสื่อสาร",
                "เทคโนโลยีและการพัฒนา",
                "วิทยาศาสตร์และเทคโนโลยี",
                "ภาษาและวรรณกรรม",
                "การเรียนรู้และพัฒนา",
                "สังคมและมนุษยศาสตร์",
                "การพัฒนาบุคลิกภาพ",
              ]}
              className="rounded-tr-lg rounded-tl-lg"
              onChange={setSelectedClubType}
            />
            <div className="w-full h-[1px] bg-white"></div>
            {/* Campus Filter */}
            <FilterSelected
              placeholder="วิทยาเขต"
              items={["ทุกวิทยาเขต", "บางเขน", "กำแพงแสน", "ศรีราชา"]}
              className="rounded-br-lg rounded-bl-lg"
              onChange={setSelectedCampus}
            />
          </div>
        </Loading>
      </div>
      {/* Club List */}
      <div className="w-full">
        <div className="grid auto-rows-max mt-3 gap-3 md:grid-cols-2 w-full">
          <Loading
            isLoading={isLoading}
            fallback={Array.from({ length: 6 })
              .fill("")
              .map((_, i) => (
                <ClubBoxSkeleton key={i} />
              ))}
          >
            {filteredClubs.length > 0 ? (
              filteredClubs
                .slice((durringPage - 1) * 6, durringPage * 6)
                .map((club) => (
                  <ClubBox
                    key={club.id}
                    id={club.id}
                    clubType={club.clubType}
                    campus={club.campus}
                    clubName={club.clubName}
                  />
                ))
            ) : (
              <p className="text-gray-500">ไม่พบชมรมที่ค้นหา</p>
            )}
          </Loading>
        </div>
        <div className="flex justify-between mt-4">
          <Loading
            isLoading={isLoading}
            fallback={<Skeleton className="w-[90px] h-[24px]" />}
          >
            <button
              className="flex text-sm justify-center items-center gap-2 disabled:text-gray-400"
              disabled={durringPage === 1}
              onClick={() => setDurringPage((durringPage - 1) % pageCount)}
            >
              <ArrowLeft />
              <p>Previous</p>
            </button>
          </Loading>
          <Loading
            isLoading={isLoading}
            fallback={<Skeleton className="w-[90px] h-[24px]" />}
          >
            <button
              className="flex text-sm justify-center items-center gap-2 disabled:text-gray-400"
              disabled={durringPage === pageCount}
              onClick={() => setDurringPage(durringPage + 1)}
            >
              <p>Next</p>
              <ArrowRight />
            </button>
          </Loading>
        </div>
      </div>
    </div>
  );
  0 - 6;
  6 - 12;
  12 - 18;
  18 - 24;
}
