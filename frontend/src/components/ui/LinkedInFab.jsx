import { useQuery } from '@tanstack/react-query'
import { Linkedin } from 'lucide-react'
import { getAbout } from '../../lib/api'

export default function LinkedInFab() {
  const { data: about } = useQuery({ queryKey: ['about'], queryFn: () => getAbout().then(r => r.data), staleTime: 300_000 })
  const url = about?.linkedin_url?.trim()
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="LinkedIn"
      title="LinkedIn"
      className="fixed bottom-24 left-6 z-[55] w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      style={{ background: '#0A66C2', boxShadow: '0 8px 24px -4px rgba(10,102,194,0.6)' }}
    >
      <Linkedin size={26} className="text-white" />
    </a>
  )
}
