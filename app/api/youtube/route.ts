import { NextResponse } from 'next/server'

const CHANNEL_ID = 'UClXiwzPQkD_nhP0eEFcIZqg'
const API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'YouTube API Key fehlt' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'overview'

  try {
    if (type === 'overview') {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,brandingSettings&id=${CHANNEL_ID}&key=${API_KEY}`
      )
      const data = await res.json()
      if (!data.items?.length) return NextResponse.json({ error: 'Kanal nicht gefunden' }, { status: 404 })
      const ch = data.items[0]
      return NextResponse.json({
        title: ch.snippet.title,
        description: ch.snippet.description,
        thumbnail: ch.snippet.thumbnails?.high?.url,
        subscribers: parseInt(ch.statistics.subscriberCount || '0'),
        totalViews: parseInt(ch.statistics.viewCount || '0'),
        videoCount: parseInt(ch.statistics.videoCount || '0'),
      })
    }

    if (type === 'videos') {
      const maxResults = searchParams.get('max') || '20'
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video&key=${API_KEY}`
      )
      const searchData = await searchRes.json()
      if (!searchData.items?.length) return NextResponse.json({ videos: [] })

      const videoIds = searchData.items.map((i: any) => i.id.videoId).join(',')
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoIds}&key=${API_KEY}`
      )
      const statsData = await statsRes.json()

      const videos = statsData.items?.map((v: any) => ({
        id: v.id,
        title: v.snippet.title,
        publishedAt: v.snippet.publishedAt,
        thumbnail: v.snippet.thumbnails?.medium?.url,
        description: v.snippet.description,
        tags: v.snippet.tags || [],
        duration: v.contentDetails.duration,
        views: parseInt(v.statistics.viewCount || '0'),
        likes: parseInt(v.statistics.likeCount || '0'),
        comments: parseInt(v.statistics.commentCount || '0'),
        url: `https://youtube.com/watch?v=${v.id}`,
      })) || []

      return NextResponse.json({ videos })
    }

    if (type === 'topsongs') {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&order=viewCount&type=video&key=${API_KEY}`
      )
      const searchData = await searchRes.json()
      if (!searchData.items?.length) return NextResponse.json({ videos: [] })

      const videoIds = searchData.items.map((i: any) => i.id.videoId).join(',')
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${API_KEY}`
      )
      const statsData = await statsRes.json()

      const videos = statsData.items?.map((v: any) => ({
        id: v.id,
        title: v.snippet.title,
        publishedAt: v.snippet.publishedAt,
        thumbnail: v.snippet.thumbnails?.medium?.url,
        tags: v.snippet.tags || [],
        views: parseInt(v.statistics.viewCount || '0'),
        likes: parseInt(v.statistics.likeCount || '0'),
        comments: parseInt(v.statistics.commentCount || '0'),
        url: `https://youtube.com/watch?v=${v.id}`,
      })).sort((a: any, b: any) => b.views - a.views) || []

      return NextResponse.json({ videos })
    }

    return NextResponse.json({ error: 'Unbekannter Typ' }, { status: 400 })
  } catch (err) {
    console.error('YouTube API Fehler:', err)
    return NextResponse.json({ error: 'API Fehler' }, { status: 500 })
  }
}
