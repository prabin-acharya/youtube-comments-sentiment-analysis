"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

interface Video {
  title: string;
  videoId: string;
  thumbnail: string;
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  description: string;
}

export default function Search() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");

  const [videos, setVideos] = useState<Video[]>([]);
  const [searchValue, setSearchValue] = useState(searchQuery || "");

  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`/api/yt/search?query=${searchQuery}`);
        const data = await response.json();
        setVideos(data.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [searchQuery]);

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      try {
        const searchQuery = searchValue;
        const encodedSearchQuery = encodeURIComponent(searchQuery);
        router.push(`/search?query=${encodedSearchQuery}`);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }
  };

  console.log(videos);

  return (
    <main className="flex min-h-screen flex-col px-16 py-3">
      <h1 className="font-bold  text-2xl text-red-600 cursor-pointer">
        Yt Demo
      </h1>
      <div className=" items-center justify-center flex  ">
        <div className="flex flex-row w-2/5">
          <input
            placeholder="Search.."
            className="flex-1 m-auto p-2 rounded-l-full text-xl px-4 py-2 border-2 w-2/5 outline-1 outline-gray-400 text-gray-900"
            onKeyDown={handleKeyDown}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="border-2 rounded-r-full  py-3 px-6 cursor-pointer bg-gray-200 hover:bg-gray-300">
            <IoSearchOutline
              className="text-xl text-gray-500 "
              onClick={() => {
                const searchQuery = searchValue;
                const encodedSearchQuery = encodeURIComponent(searchQuery);
                router.push(`/search?query=${encodedSearchQuery}`);
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-4/5 m-auto">
        <h2 className="font-semibold px-4 pt-6 text-2xl underline">
          Search Results For &quot;{searchQuery}&quot;
        </h2>
      </div>
      <div className="flex flex-col py-6">
        <div className="w-4/5 m-auto">
          {videos?.map((video, index) => (
            <Link key={index} href={`/${video.videoId}`}>
              <div key={video.videoId} className="flex py-2 cursor-pointer">
                <div className="w-1/3 h-52 relative  overflow-hidden">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 rounded-xl"
                  />
                </div>

                <div className="p-4">
                  <p className="text-lg font-medium  mb-2">{video.title}</p>
                  <span>{formatViews(video.viewCount)}</span> <span>views</span>
                  <p className="">
                    {video.description?.length > 80
                      ? video.description?.substring(0, 80) + "..."
                      : video.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function formatViews(views) {
  let num = views;
  let suffix = ["", "K", "M", "B", "T"];
  let tier = Math.floor(Math.log10(num) / 3);

  if (tier > 0) {
    num = (num / Math.pow(10, tier * 3)).toFixed(1);
  }

  return num + suffix[tier];
}
