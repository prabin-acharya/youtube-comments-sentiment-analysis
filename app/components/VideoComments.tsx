// components/VideoComments.tsx
import { useEffect, useState } from "react";
import { BsEmojiLaughingFill, BsFillEmojiFrownFill } from "react-icons/bs";

interface Comment {
  author: string;
  text: string;
  publishedAt: string;
  predicted_emotion: string;
}

interface VideoCommentsProps {
  videoId: string;
}

const VideoComments: React.FC<VideoCommentsProps> = ({ videoId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string>("");
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    const fetchVideoComments = async () => {
      setIsloading(true);
      try {
        const response = await fetch(`/api/yt/comments/${videoId}/`);
        const data = await response.json();

        console.log(data, "-----*");
        setComments(data.analysed_comments);

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

        setIsloading(false);
      } catch (error) {
        console.error("Error fetching video comments:", error);
      }
    };

    videoId && fetchVideoComments();
  }, [videoId]);

  if (comments?.length === 0) {
    return (
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
    );
  }

  // emotion_classes = ["joy", "fear", "anger", "sadness", "neutral"];
  if (comments?.length > 1) {
    const joyComments = comments.filter(
      (comment) => comment.predicted_emotion == "Joy"
    );
    const fearComments = comments.filter(
      (comment) => comment.predicted_emotion == "Disappointment"
    );
    const angerComments = comments.filter(
      (comment) => comment.predicted_emotion == "anger"
    );
    const sadnessComments = comments.filter(
      (comment) => comment.predicted_emotion == "Sadness"
    );
    const neutralComments = comments.filter(
      (comment) => comment.predicted_emotion == "Neutral"
    );
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

  // console.log(selectedEmotion);
  // console.log(
  //   comments?.filter((comment) => comment.predicted_emotion == selectedEmotion)
  // );

  // console.log("allComments", comments);

  return (
    <div className="py-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">Video Comments</h2>
      <div className="flex mb-6">
        <span
          className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
            selectedEmotion == "" ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedEmotion("")}
        >
          All
        </span>

        <span className="border-2 mx-2 border-gray-300"></span>

        <span
          className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
            selectedEmotion == "Joy" ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedEmotion("Joy")}
        >
          Joy{" "}
          <span className="font-normal text-xs">
            {
              comments?.filter((comment) => comment.predicted_emotion == "Joy")
                .length
            }
          </span>
        </span>

        <div
          className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
            selectedEmotion == "Sadness" ? "bg-black text-white" : "bg-gray-200"
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
            selectedEmotion == "Inquiry" ? "bg-black text-white" : "bg-gray-200"
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
                (comment) => comment.predicted_emotion == "Disappointment"
              ).length
            }
          </span>
        </div>

        <div
          className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
            selectedEmotion == "Neutral" ? "bg-black text-white" : "bg-gray-200"
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

        {/* <span className="border-2 mx-2 border-gray-300"></span> */}

        {/* <div
          className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
            selectedEmotion == "Positive"
              ? "bg-black text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setSelectedEmotion("Neutral")}
        >
          Positive
        </div>

        <div
          className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
            selectedEmotion == "Neutral2"
              ? "bg-black text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setSelectedEmotion("Neutral")}
        >
          Neutral
        </div>

        <div
          className={`mx-2  px-3 py-1 rounded font-semibold h-fit cursor-pointer  ${
            selectedEmotion == "Negeative"
              ? "bg-black text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setSelectedEmotion("Neutral")}
        >
          Negeative
        </div> */}
      </div>

      <ul className="px-4">
        {comments
          ?.filter((comment) => comment.predicted_emotion == selectedEmotion)
          .map((comment, index) => (
            <li key={index} className="mb-4 max-w-[500px]">
              <p className="font-semibold">{comment.text}</p>
              <div className="text-xs">
                <span className="text-gray-600">{comment.publishedAt} </span>
                <span className="inline text-gray-500"> {comment.author}</span>
              </div>
            </li>
          ))}

        {/* All Comments */}
        {selectedEmotion == "" &&
          comments.map((comment, index) => (
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
  );
};

export default VideoComments;
