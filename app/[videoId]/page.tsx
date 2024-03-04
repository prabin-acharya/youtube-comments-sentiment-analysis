"use client";
import { channel } from "diagnostics_channel";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import VideoComments from "../components/VideoComments";

interface VideoDetails {
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  channelName: string;
  channelImage: string;
  views: string;
  likes: string;
  comments: string;
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
    <main className="flex min-h-screen flex-col p-16">
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
            <Image
              src={video.channelImage}
              className="rounded-full inline"
              width={30}
              height={30}
              alt="channel logo"
            />
            <span className="font-semibold px-4">{video.channelName}</span>
          </div>
          <div className="">
            <span className="font-semibold inline ">Description: </span>
            <p className="text-md inline">
              {video.description.slice(0, 300)}...
            </p>
          </div>

          <div className="py-4 flex flex-col">
            <div>
              <span className="font-semibold">Likes: </span>{" "}
              <span>{video.likes}</span>
            </div>
            <div>
              <span className="font-semibold">Views: </span>{" "}
              <span>{video.views}</span>
            </div>
            <div>
              <span className="font-semibold">Comments: </span>{" "}
              <span>{video.comments}</span>
            </div>
          </div>

          <VideoComments videoId={videoId as string} />
        </div>
      </div>
    </main>
  );
}
