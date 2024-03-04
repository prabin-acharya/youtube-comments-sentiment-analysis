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
  channelName: string;
  channelImage: string;
  commentCount: number;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/yt/listPopularVideos");
        const data = await response.json();
        setVideos(data.videos);

        console.log(data, "^^^^^");
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

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
      <h2 className="font-semibold p-4 text-xl">Most Popular YouTube Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
        {videos.map((video, index) => (
          <Link key={index} href={`/${video.videoId}`}>
            <div className="px-2">
              <div
                key={video.videoId}
                // className=" rounded-lg overflow-hidden items-center justify-center flex flex-col px-3"
                className="w-full h-0 relative pb-[56.25%] overflow-hidden"
                // style={{ width: "450px", height: "500px" }}
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0 rounded-xl"
                />

                {/* <div className="p-4"> */}
                {/* <p className="text-base font-semibold mb-2">{video.title}</p> */}
                {/* <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Watch on YouTube
                </a> */}
                {/* </div> */}
              </div>
              <div className="p-2">
                <p className="text-base font-semibold mb-2">{video.title}</p>
                <div className="">
                  <Image
                    src={video.channelImage}
                    className="rounded-full inline"
                    width={30}
                    height={30}
                    alt="channel logo"
                  />
                  <span className=" px-4 text-gray-600">
                    {video.channelName}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
