"use client";
import { channel } from "diagnostics_channel";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiLike } from "react-icons/bi";
import { CgDanger } from "react-icons/cg";
import { IoSearchOutline } from "react-icons/io5";
import { MdAutoFixHigh } from "react-icons/md";
import LoadingSpinner from "../components/LoadingSpinner";
import Recommended from "../components/Recommended";
import VideoComments from "../components/VideoComments";
import YouTubeEmbed from "../components/YoutubeEmbed";

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

interface Comment {
  author: string;
  text: string;
  publishedAt: string;
  predicted_emotion: string;
}

interface VideoCommentsProps {
  videoId: string;
}

export default function Video({ params }: { params: { videoId: string } }) {
  const videoId = params.videoId;
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");

  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [searchValue, setSearchValue] = useState(searchQuery || "");

  const router = useRouter();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsPosNeg, setCommentsPosNeg] = useState<Comment[]>([]);

  const [selectedEmotion, setSelectedEmotion] = useState<string>("");

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

  //
  // VideoComment component
  //
  useEffect(() => {
    const fetchVideoComments = async () => {
      try {
        const response = await fetch(`/api/yt/comments/${videoId}/`);
        const data = await response.json();

        console.log(data, "-----*");
        setComments(data.analysed_comments);
        setCommentsPosNeg(data.analysed_comments_posneg);

        const filteredArray = data.analysed_comments?.filter((obj: any) => {
          const confidence = parseFloat(obj.confidence);
          return confidence > 0.85;
        });

        const filteredArray2 = data.analysed_comments_posneg?.filter(
          (obj: any) => {
            const confidence = parseFloat(obj.confidence);
            return confidence > 0.85;
          }
        );

        console.log(filteredArray, "@@@", filteredArray2);
      } catch (error) {
        console.error("Error fetching video comments:", error);
      }
    };

    videoId && fetchVideoComments();
  }, [videoId]);

  if (!video || !videoId) {
    return <p className=""></p>;
  }

  const renderEmoji = (emotion: string) => {
    switch (emotion) {
      case "Joy":
        return "😁";
      case "Sadness":
        return "🙁";
      case "Inquiry":
        return "🤔";
      case "Disappointment":
        return "😞";
      case "Neutral":
        return "😐";
      default:
        return "😐";
    }
  };

  console.log(video);

  let positives: Comment[] = [];
  let negatives: Comment[] = [];
  let neutrals: Comment[] = [];

  if (commentsPosNeg.length > 0) {
    positives = commentsPosNeg.filter(
      (comment) => comment.predicted_emotion == "positive"
    );
    negatives = commentsPosNeg.filter(
      (comment) => comment.predicted_emotion == "negative"
    );
    neutrals = commentsPosNeg.filter(
      (comment) => comment.predicted_emotion == "neutral"
    );
  }

  const total = positives.length + negatives.length;
  const positivePercentage = (positives.length / total) * 100;
  const negativePercentage = (negatives.length / total) * 100;

  let higherPercentage;
  if (positivePercentage > negativePercentage) {
    higherPercentage = positivePercentage.toFixed(1);
  } else {
    higherPercentage = negativePercentage.toFixed(1);
  }

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
          <div
            className="border-2 rounded-r-full  py-3 px-6 cursor-pointer bg-gray-200 hover:bg-gray-300"
            onClick={() => {
              const searchQuery = searchValue;
              const encodedSearchQuery = encodeURIComponent(searchQuery);
              router.push(`/search?query=${encodedSearchQuery}`);
            }}
          >
            <IoSearchOutline className="text-xl text-gray-500 " />
          </div>
        </div>
      </div>
      <div className="w-full m-auto py-6 flex ">
        <div className="w-2/3">
          <h2 className="font-semibold py-6 text-2xl">{video.title}</h2>

          <YouTubeEmbed embedId={videoId} />
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

              <div className="w-64">
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

              <div className="w-64">
                <span className=" text-lg block my-2">Comments Sentiment</span>
                <span className="text-xl font-bold flex w-fit">
                  {commentsPosNeg && commentsPosNeg.length > 0 ? (
                    <div className="flex flex-row">
                      <span className="text-3xl">{higherPercentage}%</span>
                      {positivePercentage > negativePercentage ? (
                        <>
                          <span className="border rounded-full p-2 px-3 border-green-500 text-green-700 mx-2 flex flex-row items-center font-medium">
                            <MdAutoFixHigh className="text-green-600 mr-2 " />
                            positive
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="border rounded-full p-2 px-3 border-red-500 text-red-700 mx-2 flex flex-row items-center font-medium">
                            <CgDanger className="text-red-600 mr-2 " />
                            negative
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <LoadingSpinner />
                  )}
                </span>
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

          {/* <VideoComments videoId={videoId as string} />
           */}
          {comments?.length === 0 ? (
            <>
              <div className="flex items-center justify-center p-8 pt-16 flex-col">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <style>{`.spinner_HIK5{transform-origin:center;animation:spinner_XVY9 1s cubic-bezier(0.36,.6,.31,1) infinite;} @keyframes spinner_XVY9{50%{transform:rotate(180deg)}100%{transform:rotate(360deg)}}`}</style>
                  <circle cx="12" cy="12" r="3" fill="black" />
                  <g className="spinner_HIK5">
                    <circle cx="4" cy="12" r="3" fill="black" />
                    <circle cx="20" cy="12" r="3" fill="black" />
                  </g>
                </svg>
                <p className="font-bold pt-4">Analysing Comments...</p>
              </div>
            </>
          ) : (
            <>
              <div className="py-4 mt-8">
                <h2 className="text-2xl font-bold mb-4">Video Comments</h2>
                <div className="flex mb-6">
                  <span
                    className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
                      selectedEmotion == ""
                        ? "bg-black text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedEmotion("")}
                  >
                    All
                  </span>

                  <span className="border-2 mx-2 border-gray-300"></span>

                  <span
                    className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
                      selectedEmotion == "Joy"
                        ? "bg-black text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedEmotion("Joy")}
                  >
                    Joy{" "}
                    <span className="font-normal text-xs">
                      {
                        comments?.filter(
                          (comment) => comment.predicted_emotion == "Joy"
                        ).length
                      }
                    </span>
                  </span>

                  <div
                    className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
                      selectedEmotion == "Sadness"
                        ? "bg-black text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedEmotion("Sadness")}
                  >
                    Sadness{" "}
                    <span className="font-normal text-xs">
                      {
                        comments?.filter(
                          (comment) => comment.predicted_emotion == "Sadness"
                        ).length
                      }
                    </span>
                  </div>

                  <div
                    className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
                      selectedEmotion == "Inquiry"
                        ? "bg-black text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedEmotion("Inquiry")}
                  >
                    Inquiry{" "}
                    <span className="font-normal text-xs">
                      {
                        comments?.filter(
                          (comment) => comment.predicted_emotion == "Inquiry"
                        ).length
                      }
                    </span>
                  </div>

                  <div
                    className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
                      selectedEmotion == "Disappointment"
                        ? "bg-black text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedEmotion("Disappointment")}
                  >
                    Disappointment{" "}
                    <span className="font-normal text-xs">
                      {
                        comments?.filter(
                          (comment) =>
                            comment.predicted_emotion == "Disappointment"
                        ).length
                      }
                    </span>
                  </div>

                  <div
                    className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
                      selectedEmotion == "Neutral"
                        ? "bg-black text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedEmotion("Neutral")}
                  >
                    Neutral{" "}
                    <span className="font-normal text-xs">
                      {
                        comments?.filter(
                          (comment) => comment.predicted_emotion == "Neutral"
                        ).length
                      }
                    </span>
                  </div>
                </div>

                <ul className="px-4">
                  {comments
                    ?.filter(
                      (comment) => comment.predicted_emotion == selectedEmotion
                    )
                    .map((comment, index) => (
                      <li key={index} className="mb-4 max-w-[500px]">
                        <p className="font-semibold">{comment.text}</p>
                        <div className="text-xs">
                          <span className="text-gray-600">
                            {comment.publishedAt}{" "}
                          </span>
                          <span className="inline text-gray-500">
                            {" "}
                            {comment.author}
                          </span>
                        </div>
                      </li>
                    ))}

                  {/* All Comments */}
                  {selectedEmotion == "" &&
                    comments?.map((comment, index) => (
                      <li key={index} className="mb-8 max-w-[600px]">
                        <div className="flex">
                          <div className="">
                            <p className="font-semibold">{comment.text}</p>
                            <div className="text-xs">
                              <span className="text-gray-600">
                                {comment.publishedAt}{" "}
                              </span>
                              <span className="inline text-gray-500">
                                {" "}
                                {comment.author}
                              </span>
                            </div>
                          </div>
                          <div className="p-2 flex ">
                            <div className="border border-red-600 flex h-fit rounded-l-full rounded-r-full p-2">
                              <span className="text-2xl mr-2">
                                {renderEmoji(comment.predicted_emotion)}{" "}
                              </span>
                              <span className="font-semibold">
                                {comment.predicted_emotion}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/*  */}
        <Recommended />
      </div>
    </main>
  );
}

function formatViews(views: any) {
  let num = views;
  let suffix = ["", "K", "M", "B", "T"];
  let tier = Math.floor(Math.log10(num) / 3);

  if (tier > 0) {
    num = (num / Math.pow(10, tier * 3)).toFixed(1);
  }

  return num + suffix[tier];
}
