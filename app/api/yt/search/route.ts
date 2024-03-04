// export const dynamic = "force-dynamic"; // defaults to auto

import axios from "axios";
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const API_KEY = process.env.YOUTUBE_API;
    const API_URL = "https://www.googleapis.com/youtube/v3/search";
    const CHANNEL_URL = "https://www.googleapis.com/youtube/v3/channels";
    const API_VIDEO_URL = "https://www.googleapis.com/youtube/v3/videos";

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    console.log(searchParams, query);

    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        part: "snippet",
        q: query || "Tom Cruise",
        type: "video",
        regionCode: "US",
        maxResults: 10,
      },
    });

    const videoItems = response.data.items;
    const videoIds = videoItems.map((item) => item.id.videoId).join(",");

    const videoDetailsResponse = await axios.get(API_VIDEO_URL, {
      params: {
        key: API_KEY,
        part: "snippet,statistics",
        id: videoIds,
      },
    });

    const videoDetails = videoDetailsResponse.data.items.reduce((acc, item) => {
      acc[item.id] = {
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount,
        commentCount: item.statistics.commentCount,
        channelName: item.snippet.channelTitle,
        channelLogo: item.snippet.thumbnails.default.url,
      };
      return acc;
    }, {});

    const videos = videoItems.map((item) => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.high
        ? item.snippet.thumbnails.high.url
        : item.snippet.thumbnails.medium
        ? item.snippet.thumbnails.medium.url
        : item.snippet.thumbnails.default.url,
      ...videoDetails[item.id.videoId],
    }));

    console.log(videoItems);

    return Response.json({ response: videos });
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return Response.json({ error });
  }
}
