import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const videoId = params.videoId;

    const API_KEY = process.env.YOUTUBE_API;
    const API_URL = "https://www.googleapis.com/youtube/v3/videos";
    const CHANNEL_URL = "https://www.googleapis.com/youtube/v3/channels";

    const videoResponse = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        part: "snippet,statistics,contentDetails",
        id: "tWYsfOSY9vY",
      },
    });
    if (videoResponse.data.items.length === 0) {
      return Response.json({ error: "Video Not Found" });
    }

    const channelId = videoResponse.data.items[0].snippet.channelId;
    const channelResponse = await axios.get(CHANNEL_URL, {
      params: {
        key: API_KEY,
        part: "snippet",
        id: channelId,
      },
    });

    const videoDetails = {
      title: videoResponse.data.items[0].snippet.title,
      description: videoResponse.data.items[0].snippet.description,
      publishedAt: videoResponse.data.items[0].snippet.publishedAt,
      thumbnail: videoResponse.data.items[0].snippet.thumbnails.maxres
        ? videoResponse.data.items[0].snippet.thumbnails.maxres.url
        : videoResponse.data.items[0].snippet.thumbnails.default.url,
      channelName: videoResponse.data.items[0].snippet.channelTitle,
      channelImage:
        channelResponse.data.items[0].snippet.thumbnails.default.url,
      views: videoResponse.data.items[0].statistics.viewCount,
      likes: videoResponse.data.items[0].statistics.likeCount,
      comments: videoResponse.data.items[0].statistics.commentCount,
    };

    return Response.json({ videoDetails });
  } catch (error) {
    console.error("Error fetching video details:", error);

    return Response.json({ error: "Internal server eroor" });
  }
}
