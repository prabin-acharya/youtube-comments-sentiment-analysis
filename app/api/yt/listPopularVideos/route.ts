// export const dynamic = "force-dynamic"; // defaults to auto

import axios from "axios";

export async function GET(request: Request) {
  try {
    const API_KEY = process.env.YOUTUBE_API;
    const API_URL = "https://www.googleapis.com/youtube/v3/videos";

    // const API_KEY = process.env.YOUTUBE_API;
    // const API_URL = "https://www.googleapis.com/youtube/v3/search";

    // const response = await axios.get(API_URL, {
    //   params: {
    //     key: API_KEY,
    //     part: "snippet",
    //     q: "Elon musk", // The search query
    //     type: "video", // To search only videos
    //     regionCode: "US",
    //     maxResults: 20,
    //   },
    // });

    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        part: "snippet",
        chart: "mostPopular",
        regionCode: "US",
        maxResults: 20,
      },
    });

    const videos = response.data.items.map((item: any) => ({
      title: item.snippet.title,
      videoId: item.id,
      thumbnail: item.snippet.thumbnails.high
        ? item.snippet.thumbnails.high.url
        : item.snippet.thumbnails.medium
        ? item.snippet.thumbnails.medium.url
        : item.snippet.thumbnails.default.url,
    }));

    console.log(videos);

    return Response.json({ videos });
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return Response.json({ error });
  }
}
