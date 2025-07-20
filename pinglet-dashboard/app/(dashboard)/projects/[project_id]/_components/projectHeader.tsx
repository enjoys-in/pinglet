import { ProjectDetailsResponse } from '@/lib/interfaces/project.interface'
import { formatDate } from '@/lib/utils'
import { Copy, Database, Layers } from 'lucide-react'
import React from 'react'

const ProjectHeader = ({ project, copyToClipboard, StatusBadge }: { StatusBadge: React.FC<{ isActive: boolean }>, project: ProjectDetailsResponse, copyToClipboard: any }) => {
    return (
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative px-4 py-16 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="mb-8 lg:mb-0">
                            <div className="flex items-center mb-4">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 border border-white/30">
                                    <Layers className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight">
                                        {project.name}
                                    </h1>
                                    <div className="flex items-center space-x-4">
                                        <StatusBadge isActive={project.is_active} />
                                        <div className="flex items-center text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                                            <Database className="w-4 h-4 mr-2" />
                                            <span className="text-sm font-medium">Project ID: {project.unique_id}</span>
                                            <button
                                                onClick={() => copyToClipboard(project.unique_id.toString(), 'project')}
                                                className="ml-2 hover:text-white transition-colors"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="text-center lg:text-right bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                <div className="text-white/70 text-sm mb-1">Created</div>
                                <div className="text-white font-semibold">{formatDate(project.created_at)}</div>
                            </div>
                            <div className="text-center lg:text-right bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                <div className="text-white/70 text-sm mb-1">Updated</div>
                                <div className="text-white font-semibold">{formatDate(project.updated_at)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectHeader