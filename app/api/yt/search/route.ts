// export const dynamic = "force-dynamic"; // defaults to auto

import axios from "axios";
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const API_KEY = process.env.YOUTUBE_API;
    const API_URL = "https://www.googleapis.com/youtube/v3/search";

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    console.log(searchParams, query);

    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        part: "snippet",
        q: query || "Tom Cruise", // The search query
        type: "video", // To search only videos
        regionCode: "US",
        maxResults: 20,
      },
    });

    const videos = response.data.items.map((item: any) => ({
      title: item.snippet.title,
      videoId: item.id,
      thumbnail: item.snippet.thumbnails.maxres
        ? item.snippet.thumbnails.maxres.url
        : item.snippet.thumbnails.default.url,
    }));

    // console.log(videos);

    return Response.json({ videos });
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return Response.json({ error });
  }
}
