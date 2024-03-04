"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Video {
  title: string;
  videoId: string;
  thumbnail: string;
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
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      try {
        router;
        const response = await fetch(`/api/yt/search?query=${searchValue}`);
        const data = await response.json();
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }
  };

  console.log(videos);

  return (
    <main className="flex min-h-screen flex-col px-16 py-2 text-white">
      <h1 className="font-bold pb-6 text-2xl">Yt Demo</h1>
      <div className=" items-center justify-center flex ">
        <input
          placeholder="Search.."
          className="m-auto p-2 rounded outline-none text-white rounded-l-3xl rounded-r-3xl text-xl px-8 py-2 bg-slate-600"
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <h2 className="font-semibold p-4 text-xl">Most Popular YouTube Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video, index) => (
          <Link key={index} href={`/${video.videoId}`}>
            <div
              key={video.videoId}
              className="bg-gray-600 rounded-lg overflow-hidden shadow-md"
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={400}
                height={400}
              />

              <div className="p-4">
                <p className="text-base font-semibold mb-2">{video.title}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
