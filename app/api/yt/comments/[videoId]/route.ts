import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    console.log("#########################comments");
    const videoId = params.videoId;

    const API_KEY = process.env.YOUTUBE_API;
    const API_URL = "https://www.googleapis.com/youtube/v3/commentThreads";

    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        part: "snippet",
        videoId: videoId,
        maxResults: 100,
      },
    });

    const comments = response.data.items.map((item: any) => ({
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textOriginal,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
    }));

    const response2 = await axios.post("http://localhost:5000/predict", {
      comments: comments.slice(0, 50),
    });

    const analysed_comments = response2.data;

    console.log(analysed_comments, "#######");

    return Response.json({
      comments,
      analysed_comments: analysed_comments.results,
    });
  } catch (error) {
    console.error("Error fetching video details:", error);

    return Response.json({ error: "Internal server eroor" });
  }
}
