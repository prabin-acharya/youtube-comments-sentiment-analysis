"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import VideoComments from "../components/VideoComments";

interface VideoDetails {
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
}

export default function Video({ params }: { params: { videoId: string } }) {
  const videoId = params.videoId;

  const [video, setVideo] = useState<VideoDetails | null>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(`/api/yt/video/${videoId}`);
        const data = await response.json();
        setVideo(data.videoDetails);

        console.log(data, "####");
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  if (!video || !videoId) {
    return <p className="">Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col p-16 text-white">
      <div>
        <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
        <div className="max-w-screen-md mx-auto">
          <Image
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-64 object-cover mb-4 rounded-md"
            width={1200}
            height={1200}
          />
          <div className="py-2">
            <span className="text-gray-600 text-sm font-semibold">
              {new Date(video.publishedAt).toDateString()}
            </span>
            <Link
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline inline px-4"
            >
              Watch on YouTube
            </Link>
          </div>
          <div className="">
            <span className="font-semibold inline ">Description: </span>
            <p className="text-md inline">{video.description}</p>
          </div>

          <VideoComments videoId={videoId as string} />
        </div>
      </div>
    </main>
  );
}
