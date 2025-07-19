import React from 'react'
import { ApiResponse } from '@/lib/types'
import serverAxios from '@/lib/api/server.instance'
import { ProjectDetailsResponse } from '@/lib/interfaces/project.interface'
import ProjectDetails from './_components/projectDetails'
import { AlertCircle } from 'lucide-react'

const page = async ({ params }: any) => {
  try {
    const { project_id } = await params as { project_id: string }
    const { data } = await serverAxios.get<ApiResponse<ProjectDetailsResponse>>('/api/v1/project/' + project_id)

    return <ProjectDetails project={data.result} />
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <p className="text-slate-700 font-medium">Failed to fetch project details</p>
        </div>
      </div>
    )
  }
}

export default page