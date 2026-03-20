import { Briefcase, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const positions = [
  {
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "DevRel / Developer Advocate",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Contract",
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Careers</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us in building the future of web notifications.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-xl font-bold text-foreground mb-6">Open Positions</h2>
        <div className="space-y-4">
          {positions.map((job) => (
            <div key={job.title} className="rounded-xl border border-border/50 bg-card/80 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.department}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                  <span>{job.type}</span>
                </div>
              </div>
              <Link href="/contact">
                <Button variant="outline" size="sm" className="rounded-full gap-1">
                  Apply <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center rounded-2xl border border-border/50 bg-card/80 p-10">
          <h2 className="text-xl font-bold text-foreground mb-2">Don&apos;t see your role?</h2>
          <p className="text-muted-foreground mb-6">We&apos;re always looking for talented people. Send us your resume!</p>
          <Link href="/contact"><Button className="rounded-full">Get in Touch</Button></Link>
        </div>
      </div>
    </div>
  )
}
