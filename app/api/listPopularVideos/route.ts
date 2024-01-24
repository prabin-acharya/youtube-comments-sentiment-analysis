// export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
  try {
    const API_KEY = process.env.YOUTUBE_API;
    const API_URL = "https://www.googleapis.com/youtube/v3/videos";

    const response = await fetch(
      `${API_URL}?key=${API_KEY}&part=snippet&chart=mostPopular&regionCode=US&maxResults=10`
    );
    const data = await response.json();

    const videos = data.items.map((item: any) => ({
      title: item.snippet.title,
      videoId: item.id,
      thumbnail: item.snippet.thumbnails.default.url,
    }));

    // res.status(200).json(videos);
    return Response.json({ videos });
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return Response.json({ error });
  }
}
