import axios from "axios";
import { NextResponse } from "next/server";

interface Comment {
  author: string;
  text: string;
  publishedAt: string;
}

export async function GET(request: Request) {
  try {
    console.log("#########################comments");

    const API_KEY = process.env.YOUTUBE_API;
    const API_URL = "https://www.googleapis.com/youtube/v3/commentThreads";

    let allComments: Comment[] = [];
    let nextPageToken: string | undefined = undefined;
    const maxResults = 200; // Number of comments you want to fetch

    do {
      const response: any = await axios.get(API_URL, {
        params: {
          key: API_KEY,
          part: "snippet",
          videoId: "2pMc8NOd2Xw",
          maxResults: maxResults - allComments.length, // Adjust maxResults to remaining comments
          pageToken: nextPageToken, // Add this to fetch next page
        },
      });

      const comments = response.data.items;
      allComments = allComments.concat(
        comments.map((item: any) => ({
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          text: item.snippet.topLevelComment.snippet.textOriginal,
          publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
        }))
      );
      nextPageToken = response.data.nextPageToken; // Update nextPageToken for next iteration
    } while (nextPageToken && allComments.length < maxResults);

    const response2 = await axios.post("http://localhost:5000/predict_sent5", {
      comments: allComments.slice(0, 100),
    });

    const analysed_comments = response2.data;

    // console.log(analysed_comments, "#######");

    return Response.json({
      // comments: allComments,
      analysed_comments: analysed_comments.results,
    });
  } catch (error) {
    console.error("Error fetching video details:", error);

    return Response.json({ error: "Internal server eroor" });
  }
}
