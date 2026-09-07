import { useEffect, useState } from "react"

interface Sermon {
  id: string
  title: string
  content: string
  video_url: string[]
  audio_url: string[]
  thumbnail: string
  duration: string
  series: string
  scripture: string
  tags: string[]
  featured: boolean
  preacher: {
    id: string
    name: string
    image: string
  }
  createdAt: string
}

interface UseSermons {
  page?: number
  limit?: number
  search?: string
  speaker?: string
  series?: string
  tag?: string
  featured?: boolean
}

export function useSermons({
  page = 1,
  limit = 10,
  search = "",
  speaker = "",
  series = "",
  tag = "",
  featured = false,
}: UseSermons = {}) {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(speaker && { speaker }),
          ...(series && { series }),
          ...(tag && { tag }),
          ...(featured && { featured: "true" }),
        })

        const response = await fetch(`/api/sermons?${params}`)
        if (!response.ok) throw new Error("Failed to fetch sermons")

        const data = await response.json()
        setSermons(data.sermons)
        setTotal(data.pagination.total)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSermons()
  }, [page, limit, search, speaker, series, tag, featured])

  return {
    sermons,
    total,
    isLoading,
    error,
    pageCount: Math.ceil(total / limit),
  }
}
