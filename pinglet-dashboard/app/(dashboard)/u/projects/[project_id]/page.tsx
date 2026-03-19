import React from 'react'
import { ApiResponse } from '@/lib/types'
import serverAxios from '@/lib/api/server.instance'
import { ProjectDetailsResponse } from '@/lib/interfaces/project.interface'
import ProjectDetails from './_components/projectDetails'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

const page = async ({ params }: any) => {
  try {
    const { project_id } = await params as { project_id: string }
    const { data } = await serverAxios.get<ApiResponse<ProjectDetailsResponse>>('/api/v1/project/' + project_id)

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch project details")
    }
    return <ProjectDetails project={data.result} />
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5 backdrop-blur-sm max-w-md w-full">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-destructive/10 mb-5">
            <AlertCircle className="w-7 h-7 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load project</h3>
          <p className="text-sm text-muted-foreground mb-6">
            We couldn&apos;t fetch the project details. The project may not exist or there was a network issue.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/u/projects"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default page