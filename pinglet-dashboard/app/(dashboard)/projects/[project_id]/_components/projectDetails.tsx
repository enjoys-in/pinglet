import { ProjectDetailsResponse } from '@/lib/interfaces/project.interface'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Webhook } from 'lucide-react'
import { db } from '@/lib/db'
const ProjectDetails = ({ project }: { project: ProjectDetailsResponse }) => {
    return (
        <div>
            Create Templates
            <Card className="lg:col-span-2 xl:col-span-3">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Webhook className="h-5 w-5" />
                        Webhooks
                        <Badge variant="secondary" className="ml-2">
                            {project.webhooks.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {project.webhooks.length > 0 ? (
                        <div className="space-y-4">
                            {project.webhooks.map((webhook, index) => (
                                <div key={index} className="p-4 border rounded-lg">
                                    {/* Webhook details would go here */}
                                    <p className="text-sm text-gray-600">Webhook {index + 1}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Webhook className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks configured</h3>
                            <p className="text-sm text-gray-500">
                                Webhooks allow you to receive real-time notifications when events occur in your project.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ProjectDetails