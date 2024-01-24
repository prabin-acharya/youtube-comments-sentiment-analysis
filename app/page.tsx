"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Video {
  title: string;
  videoId: string;
  thumbnail: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/listPopularVideos");
        const data = await response.json();
        setVideos(data.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  console.log(videos);

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h2 className="font-semibold p-4 text-2xl">
        Most Popular YouTube Videos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div
            key={video.videoId}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <Image
              src={video.thumbnail}
              alt={video.title}
              width={500}
              height={500}
            />

            {/* <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-40 object-cover"
            /> */}
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
        ))}
      </div>
    </main>
  );
}
