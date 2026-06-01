import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Platform = 'YouTube' | 'Instagram' | 'TikTok'

export type SubscriberEntry = {
  id: string
  platform: Platform
  count: number
  recorded_at: string
  created_at: string
}

export type Goal = {
  id: string
  title: string
  category: string
  target_value: number | null
  current_value: number
  deadline: string | null
  description: string | null
  achieved: boolean
  created_at: string
}

export type PipelineVideo = {
  id: string
  title: string
  category: string
  status: number
  notes: string | null
  shoot_date: string | null
  upload_date: string | null
  created_at: string
}

export type CalendarEvent = {
  id: string
  title: string
  event_date: string
  event_type: 'dreh' | 'schnitt' | 'upload'
  notes: string | null
  created_at: string
}

export type VideoEntry = {
  id: string
  title: string
  category: string
  upload_date: string | null
  location: string | null
  youtube_url: string | null
  notes: string | null
  views: number | null
  likes: number | null
  comments: number | null
  created_at: string
}

export type VisionItem = {
  id: string
  title: string
  description: string | null
  category: string
  deadline: string | null
  emoji: string
  created_at: string
}

export type Milestone = {
  id: string
  platform: Platform
  value: number
  achieved_at: string | null
  created_at: string
}

export type ChecklistItem = {
  id: string
  label: string
  category: string
  sort_order: number
  checked: boolean
}
