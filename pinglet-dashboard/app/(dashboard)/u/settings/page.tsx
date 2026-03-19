import serverAxios from "@/lib/api/server.instance"
import SettingsClient from "./_components/settings-client"

async function fetchProfile() {
  try {
    const res = await serverAxios.get('/api/v1/auth/profile')
    return res.data?.result ?? null
  } catch {
    return null
  }
}

export default async function SettingsPage() {
  const profile = await fetchProfile()
  return <SettingsClient profile={profile} />
}
