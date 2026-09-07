import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Video, Music } from "lucide-react"
import Link from "next/link"

interface SermonCardProps {
  sermon: {
    id: string
    title: string
    content: string
    video_url: string[]
    audio_url: string[]
    createdAt: string
    preacher: {
      name: string | null
      image: string | null
    }
  }
  onDelete?: (id: string) => void
  canManage?: boolean
}

export function SermonCard({ sermon, onDelete, canManage = false }: SermonCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={sermon.preacher.image || "/placeholder-user.jpg"} alt={sermon.preacher.name || "Preacher"} />
            <AvatarFallback>{sermon.preacher.name?.[0] || "P"}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/sermons/${sermon.id}`}>
              <CardTitle className="text-xl hover:text-primary transition-colors">
                {sermon.title}
              </CardTitle>
            </Link>
            <CardDescription>
              By {sermon.preacher.name} • {format(new Date(sermon.createdAt), "MMM d, yyyy")}
            </CardDescription>
          </div>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <Link href={`/sermons/${sermon.id}/edit`} className="text-sm text-muted-foreground hover:text-primary">
              Edit
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault()
                onDelete?.(sermon.id)
              }}
              className="text-sm text-destructive hover:text-destructive/80"
            >
              Delete
            </button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-muted-foreground">{sermon.content}</p>
        <div className="flex gap-4 mt-4">
          {sermon.video_url.length > 0 && (
            <div className="flex items-center">
              <Video className="h-4 w-4 mr-1" />
              <span className="text-sm text-primary">{sermon.video_url.length} Video{sermon.video_url.length !== 1 ? "s" : ""}</span>
            </div>
          )}
          {sermon.audio_url.length > 0 && (
            <div className="flex items-center">
              <Music className="h-4 w-4 mr-1" />
              <span className="text-sm text-primary">{sermon.audio_url.length} Audio{sermon.audio_url.length !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
