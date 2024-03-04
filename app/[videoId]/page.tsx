"use client";
import { channel } from "diagnostics_channel";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiLike } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";
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
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");

  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [searchValue, setSearchValue] = useState(searchQuery || "");

  const router = useRouter();

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

  if (!video || !videoId) {
    return <p className="">Loading...</p>;
  }

  console.log(video);

  return (
    <main className="flex min-h-screen flex-col px-16 py-3">
      <h1
        className="font-bold  text-2xl text-red-600 cursor-pointer"
        onClick={() => router.push("/")}
      >
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
      <div className="w-4/5 m-auto py-6">
        <div className="max-w-screen-md mx-auto">
          <h2 className="font-semibold py-6 text-2xl">{video.title}</h2>

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

          <div className="py-4 flex flex-col ">
            <div className="flex flex-row w-2/3 py-8 justify-between ">
              <div className="">
                <span className="text-lg block">Views</span>
                <span className="text-3xl font-bold">
                  {formatViews(video.views)}
                </span>
              </div>

              {/* <div>
                <span className=" text-lg block">Likes </span>
                <span className="text-3xl font-bold">
                  {formatViews(video.likes)}
                </span>
              </div> */}

              <div className="pr-20">
                <span className=" text-lg block">Comments </span>
                <span className="text-3xl font-bold">
                  {formatViews(video.comments)}
                </span>
              </div>
            </div>

            <div className="flex flex-row w-2/3 py-8 justify-between ">
              <div className="">
                <span className="text-lg block">Likes Ratio</span>
                <div className="flex flex-row">
                  <span className="text-3xl font-bold">
                    {video.views !== "0"
                      ? (
                          (Number(video.likes) / Number(video.views)) *
                          100
                        ).toFixed(2)
                      : "0"}
                    %
                  </span>
                  <span className="px-4 border py-2 rounded-full border-red-600 flex flex-row items-center ml-2">
                    <BiLike className="text-red-700 fill text-xl mr-2" />
                    {formatViews(video.likes)}
                  </span>
                </div>
              </div>

              <div>
                <span className=" text-lg block">Comments Intensity</span>
                <span className="text-3xl font-bold">{}</span>
              </div>
            </div>

            {/* <div>
              <span className="text-lg">Likes Ratio </span>
              <br />
              <span className="text-3xl">{video.comments}</span>
            </div>
            <div>
              <span className="text-lg">Comments </span>
              <br />
              <span className="text-3xl">{video.comments}</span>
            </div> */}
          </div>

          <VideoComments videoId={videoId as string} />
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
