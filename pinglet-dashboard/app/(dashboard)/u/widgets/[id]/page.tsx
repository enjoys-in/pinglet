import React from 'react'
import { WidgetForm } from '../_components/WidgetForm'
import serverAxios from '@/lib/api/server.instance'
import { ApiResponse } from '@/lib/types'
import { Widget } from '@/lib/interfaces/widget.interface'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const page = async ({ params }: any) => {
  const { id } = await params
  try {
    const { data } = await serverAxios.get<ApiResponse<Widget>>('/api/v1/widget/' + id)
    if (!data.success) {
      throw new Error(data.message)
    }
    return (
      <div>
        <div className="flex items-center gap-4">
          <Link href="/u/widgets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Widgets
            </Button>
          </Link>

        </div>
        <WidgetForm data={data.result.data} />
      </div>
    )
  } catch (error) {
    return <div className="text-red-500">
      Error loading widget data.
    </div>
  }

}

export default page