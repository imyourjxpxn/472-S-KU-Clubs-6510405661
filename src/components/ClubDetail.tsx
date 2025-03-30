import { Skeleton } from "./skeleton/skeleton";
import ClubInterface from "@/interfaces/Club";
import { useState } from "react";
import { CircleChevronRight, CircleChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ClubDetail({ club }: { club: ClubInterface | null }) {
    const [isVisible, setIsVisible] = useState(true);
    const [isLoadingJoin, setIsLoadingJoin] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(prevState => !prevState);
    };

    async function joinClub() {
        setIsLoadingJoin(true);
        fetch("/api/club/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                clubCode: club?.clubCode,
            }),
        }).then((res) => {
            setIsLoadingJoin(false);
            if (res.ok) {
                toast.success("เข้าร่วมสำเร็จ", {className:"toast-alert"});
            } else {
                toast.error(res.statusText);
            }
        }
        );
    }

    const clubDetails = [
        {
            "title": "Club ID",
            "content": club?.clubCode,
            "isTitle": true
        },
        {
            "title": "ชื่อชมรม",
            "content": club?.clubName,
            "isTitle": true
        },
        {
            "title": "วิทยาเขต",
            "content": club?.campus,
            "isTitle": true
        },
        {
            "title": "ประเภทชมรม",
            "content": club?.clubType,
            "isTitle": true
        },
        {
            "title": "ประธานชมรม",
            "content": club?.clubPresident,
            "isTitle": true
        },
        {
            "title": "ที่ปรึกษา",
            "content": club?.advisor,
            "isTitle": true
        },
        {
            "title": "รายละเอียดชมรม",
            "content": club?.aboutClub,
            "isTitle": false
        }
    ]

    return (
        <>
            {clubDetails.map((detail, index) => (
                <div key={index} className="space-y-6 mb-5">
                    <div className="space-y-1">
                        <p className="text-sm">{detail.title}</p>
                        {detail.content ? (
                            <p className={detail.isTitle ? ("content text-2xl text-bold text-green-300") : ("content text-sm")}>{detail.content}</p>
                        ) : (
                            <Skeleton className="skeleton h-[40px] w-[300px] bg-green-800" />
                        )}
                    </div>
                </div>
            ))}

            <button onClick={() => { joinClub(); }} 
            type="button" className="
            joinClubButton focus:outline-none text-white font-medium 
            bg-green-700 hover:bg-green-800
            rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                {isLoadingJoin ? (
                    <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-b-2 border-gray-100 rounded-full animate-spin" />
                    </div>
                ) : "เข้าร่วม"}
            </button>

            <div className="space-y-1">
                <p className="text-sm">คณะกรรมการ
                    <button
                        className="ms-1 text-sm align-middle"
                        onClick={toggleVisibility}
                    >
                        {isVisible ? (
                            <CircleChevronDown className="h-4 w-4" />
                        ) : (
                            <CircleChevronRight className="h-4 w-4" />
                        )}
                    </button>
                </p>
                {club ? (
                    <>
                        {isVisible && (
                            <div className="mt-2 space-y-2 committee">
                                {/* Display Committee Members */}
                                {club.committee ? (
                                    club.committee.length > 0 ? (
                                        <ul className="pl-5 space-y-1 content">
                                            {club.committee.map((member, index) => (
                                                <li key={index} className="text-sm">
                                                    {member.image ? (<img
                                                        className="w-5 h-5 rounded-full inline me-2 committee-avatar"
                                                        src={member.image ? `/images/committee/${member.image}` : ""}
                                                        alt="Rounded avatar"
                                                    />) : ("")}
                                                    <p className="inline committee-name">{member.name}</p>
                                                </li>
                                            ))
                                            }
                                        </ul>
                                    ) : (
                                        <p className="text-sm content committee-404">ไม่มีข้อมูล</p>
                                    )
                                ) : (
                                    <Skeleton className="skeleton h-[40px] w-[300px] bg-green-800" />
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <Skeleton className="skeleton h-[40px] w-[300px] bg-green-800" />
                )}
            </div>
        </>
    );
}