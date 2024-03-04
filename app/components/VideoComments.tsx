// components/VideoComments.tsx
import { useEffect, useState } from "react";

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
  const [selectedEmotion, setSelectedEmotion] = useState<string>("joy");
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
      (comment) => comment.predicted_emotion == "joy"
    );
    const fearComments = comments.filter(
      (comment) => comment.predicted_emotion == "fear"
    );
    const angerComments = comments.filter(
      (comment) => comment.predicted_emotion == "anger"
    );
    const sadnessComments = comments.filter(
      (comment) => comment.predicted_emotion == "sadness"
    );
    const neutralComments = comments.filter(
      (comment) => comment.predicted_emotion == "neutral"
    );
  }

  // console.log(selectedEmotion);
  // console.log(
  //   comments?.filter((comment) => comment.predicted_emotion == selectedEmotion)
  // );

  // console.log("allComments", comments);

  return (
    <div className="py-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">Video Comments</h2>
      <div className="flex mb-6">
        <div
          className={`flex-1 p-4 text-center font-semibold rounded-sm cursor-pointer  border border-gray-500 ${
            selectedEmotion == "joy" ? "bg-gray-800" : "bg-gray-600"
          }`}
          onClick={() => setSelectedEmotion("joy")}
        >
          joy
        </div>

        <div
          className={`flex-1 p-4 text-center font-semibold rounded-sm cursor-pointer  border border-gray-500 ${
            selectedEmotion == "fear" ? "bg-gray-800" : "bg-gray-600"
          }`}
          onClick={() => setSelectedEmotion("fear")}
        >
          fear
        </div>

        <div
          className={`flex-1 p-4 text-center font-semibold rounded-sm cursor-pointer  border border-gray-500 ${
            selectedEmotion == "anger" ? "bg-gray-800" : "bg-gray-600"
          }`}
          onClick={() => setSelectedEmotion("anger")}
        >
          anger
        </div>

        <div
          className={`flex-1 p-4 text-center font-semibold rounded-sm cursor-pointer  border border-gray-500 ${
            selectedEmotion == "sadness" ? "bg-gray-800" : "bg-gray-600"
          }`}
          onClick={() => setSelectedEmotion("sadness")}
        >
          sadness
        </div>

        <div
          className={`flex-1 p-4 text-center font-semibold rounded-sm cursor-pointer  border border-gray-500 ${
            selectedEmotion == "neutral" ? "bg-gray-800" : "bg-gray-600"
          }`}
          onClick={() => setSelectedEmotion("neutral")}
        >
          neutral
        </div>
      </div>

      <ul className="px-4">
        {comments
          ?.filter((comment) => comment.predicted_emotion == selectedEmotion)
          .map((comment, index) => (
            <li key={index} className="mb-4 max-w-[500px]">
              <p className="font-semibold">{comment.text}</p>
              <div>
                <span className="text-gray-600">{comment.publishedAt} </span>
                <span className="inline text-gray-500"> {comment.author}</span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default VideoComments;
