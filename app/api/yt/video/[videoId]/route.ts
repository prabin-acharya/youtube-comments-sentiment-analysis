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

    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        part: "snippet",
        id: videoId,
      },
    });

    if (response.data.items.length === 0) {
      return Response.json({ error: "Video Not Found" });
    }

    const videoDetails = {
      title: response.data.items[0].snippet.title,
      description: response.data.items[0].snippet.description,
      publishedAt: response.data.items[0].snippet.publishedAt,
      thumbnail: response.data.items[0].snippet.thumbnails.maxres
        ? response.data.items[0].snippet.thumbnails.maxres.url
        : response.data.items[0].snippet.thumbnails.default.url,
    };

    return Response.json({ videoDetails });
  } catch (error) {
    console.error("Error fetching video details:", error);

    return Response.json({ error: "Internal server eroor" });
  }
}
