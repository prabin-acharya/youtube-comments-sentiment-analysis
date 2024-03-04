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

export default function Recommended() {
  const [videos, setVideos] = useState<Video[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/yt/listPopularVideos");
        const data = await response.json();
        const shuffledVideos = shuffle(data.videos);

        setVideos(shuffledVideos);

        console.log(data, "^^^^^");
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  console.log(videos);

  return (
    <main className="flex min-h-screen flex-col px-16 py-3">
      <h2 className="font-semibold p-4 text-xl">Similar Videos</h2>
      <div className="flex flex-col">
        <div className="w-4/5 m-auto">
          {videos.map((video, index) => (
            <Link key={index} href={`/${video.videoId}`}>
              <div className="px-2">
                <div
                  key={video.videoId}
                  // className=" rounded-lg overflow-hidden items-center justify-center flex flex-col px-3"
                  className="w-full h-52 relative" // style={{ width: "450px", height: "500px" }}
                >
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 rounded-xl"
                  />
                </div>
                <div className="p-2">
                  <p className="text-base font-semibold mb-2">
                    {video.title.substring(0, 40)}
                  </p>
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
      </div>
    </main>
  );
}

function shuffle(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
