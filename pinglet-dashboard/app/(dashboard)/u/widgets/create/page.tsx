import React from 'react'
import { WidgetForm } from '../_components/WidgetForm'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <Link href="/widgets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Widgets
          </Button>
        </Link>

      </div>
      <WidgetForm />
    </div>
  )
}

export default page