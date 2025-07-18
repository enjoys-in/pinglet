import React from 'react'
import { ApiResponse } from '@/lib/types'
import serverAxios from '@/lib/api/server.instance'
import { ProjectDetailsResponse } from '@/lib/interfaces/project.interface'
import ProjectDetails from './_components/projectDetails'

const page = async ({ params }: any) => {
  try {
    const { project_id } = params as { project_id: string }
    const { data } = await serverAxios.get<ApiResponse<ProjectDetailsResponse>>('/api/v1/project/' + project_id)

    return <ProjectDetails project={data.result} />
  } catch (error) {
    return (
      <div>error</div>
    )
  }
}

export default page