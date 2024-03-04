// export const dynamic = "force-dynamic"; // defaults to auto

import axios from "axios";

export async function GET(request: Request) {
  try {
    const API_KEY = process.env.YOUTUBE_API;
    const API_URL = "https://www.googleapis.com/youtube/v3/videos";
    const CHANNEL_URL = "https://www.googleapis.com/youtube/v3/channels";

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

    // const videoResponse = await axios.get(API_URL, {
    //   params: {
    //     key: API_KEY,
    //     part: "snippet,contentDetails,statistics",
    //     chart: "mostPopular",
    //     regionCode: "US",
    //     maxResults: 10,
    //   },
    // });

    // const channelIds = videoResponse.data.items
    //   .map((item: any) => item.snippet.channelId)
    //   .join(",");

    // console.log(channelIds);

    // // Fetch channel details
    // const channelResponse = await axios.get(CHANNEL_URL, {
    //   params: {
    //     key: API_KEY,
    //     part: "snippet",
    //     id: channelIds,
    //   },
    // });

    // const channelMap = new Map(
    //   channelResponse.data.items.map((item: any) => [item.id, item])
    // );

    // console.log(channelResponse.data.items);

    // const videos = videoResponse.data.items.map((video: any) => {
    //   const channel: any = channelMap.get(video.snippet.channelId);
    //   return {
    //     title: video.snippet.title,
    //     videoId: video.id,
    //     thumbnail: video.snippet.thumbnails.high
    //       ? video.snippet.thumbnails.high.url
    //       : video.snippet.thumbnails.medium
    //       ? video.snippet.thumbnails.medium.url
    //       : video.snippet.thumbnails.default.url,
    //     channelName: channel.snippet.title,
    //     channelImage: channel.snippet.thumbnails.default.url,
    //     commentCount: video.statistics.commentCount,
    //     // Add more video details here
    //   };
    // });

    // // console.log(videos);

    // return Response.json({ videos });

    // Assuming you have a list of video IDs like this:
    const videoIds = [
      "F9U-yoJbgWs",
      "UXOMc8d3L8A",
      "ZTR6H4mug4M",
      "YbJOTdZBX1g",
      "dKrVegVI0Us",
      "50VNCymT-Cs",
      "TcMBFSGVi1c",
      "pRpeEdMmmQ0",
      "_YUzQa_1RCE",
      "CKSNR7Q8UdU",
      "NxpxD8TPxOo",
      "VyHV0BRtdxo",
      "1ZdlAg3j8nI",
      "hQwFeIupNP0",
      "XtFI7SNtVpY",
      "BcDK7lkzzsU",
      "r9PeYPHdpNo",
      "RgKAFK5djSk",
      "cqGjhVJWtEg",
      "GGEdSsUWDdA",
      "EtTTTI1xUtM",
    ];

    // Join the video IDs into a comma-separated string
    const idString = videoIds.join(",");

    // Fetch video details
    const videoResponse = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        part: "snippet,contentDetails,statistics",
        id: idString,
      },
    });

    const channelIds = videoResponse.data.items
      .map((item: any) => item.snippet.channelId)
      .join(",");

    console.log(channelIds);

    // Fetch channel details
    const channelResponse = await axios.get(CHANNEL_URL, {
      params: {
        key: API_KEY,
        part: "snippet",
        id: channelIds,
      },
    });

    const channelMap = new Map(
      channelResponse.data.items.map((item: any) => [item.id, item])
    );

    console.log(channelResponse.data.items);

    const videos = videoResponse.data.items.map((video: any) => {
      const channel: any = channelMap.get(video.snippet.channelId);
      return {
        title: video.snippet.title,
        videoId: video.id,
        thumbnail: video.snippet.thumbnails.high
          ? video.snippet.thumbnails.high.url
          : video.snippet.thumbnails.medium
          ? video.snippet.thumbnails.medium.url
          : video.snippet.thumbnails.default.url,
        channelName: channel.snippet.title,
        channelImage: channel.snippet.thumbnails.default.url,
        commentCount: video.statistics.commentCount,
        // Add more video details here
      };
    });

    // console.log(videos);

    return Response.json({ videos });
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return Response.json({ error });
  }
}
