import React from "react";

interface YouTubeEmbedProps {
  embedId: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ embedId }) => {
  const url = `https://www.youtube.com/embed/${embedId}?autoplay=1`; // Include autoplay=1 here
  return (
    <div className="youtube-embed">
      <iframe
        width="660"
        height="415"
        src={url}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        // allowFullScreen
        title="YouTube video"
        className="rounded-md"
      />
    </div>
  );
};

export default YouTubeEmbed;
