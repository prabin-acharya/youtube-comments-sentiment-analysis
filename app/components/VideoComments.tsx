// components/VideoComments.tsx
import { useEffect, useState } from "react";

interface Comment {
  author: string;
  text: string;
  publishedAt: string;
}

interface VideoCommentsProps {
  videoId: string;
}

const VideoComments: React.FC<VideoCommentsProps> = ({ videoId }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchVideoComments = async () => {
      try {
        const response = await fetch(`/api/yt/comments/${videoId}/`);
        const data = await response.json();
        setComments(data.comments);
        console.log(data);
      } catch (error) {
        console.error("Error fetching video comments:", error);
      }
    };

    videoId && fetchVideoComments();
  }, [videoId]);

  if (comments.length === 0) {
    return <p>No comments available.</p>;
  }

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-4">Video Comments</h2>
      <ul className="px-4">
        {comments.map((comment, index) => (
          <li key={index} className="mb-4 max-w-[500px]">
            <p className="font-semibold">{comment.text}</p>
            <div>
              <span className="text-gray-600">{comment.publishedAt} </span>
              <span className="inline"> {comment.author}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoComments;
