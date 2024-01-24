// export const dynamic = "force-dynamic"; // defaults to auto

import axios from "axios";

export async function GET(request: Request) {
  try {
    const API_KEY = process.env.YOUTUBE_API;
    const API_URL = "https://www.googleapis.com/youtube/v3/videos";

    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        part: "snippet",
        chart: "mostPopular",
        regionCode: "US",
        maxResults: 10,
      },
    });

    const videos = response.data.items.map((item: any) => ({
      title: item.snippet.title,
      videoId: item.id,
      thumbnail: item.snippet.thumbnails.maxres
        ? item.snippet.thumbnails.maxres.url
        : item.snippet.thumbnails.default.url,
    }));

    return Response.json({ videos });
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return Response.json({ error });
  }
}
