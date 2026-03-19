import { ProjectDetailsResponse } from '@/lib/interfaces/project.interface'
import { formatDate } from '@/lib/utils'
import { Copy, Database, Layers } from 'lucide-react'
import React from 'react'

const ProjectHeader = ({ project, copyToClipboard, StatusBadge }: { StatusBadge: React.FC<{ isActive: boolean }>, project: ProjectDetailsResponse, copyToClipboard: any }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-border/50">
            <div className="absolute inset-0 gradient-primary opacity-90" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative px-6 py-10 sm:px-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                                <Layers className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                                    {project.name}
                                </h1>
                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                    <StatusBadge isActive={project.is_active} />
                                    <div className="flex items-center text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 text-sm">
                                        <Database className="w-3.5 h-3.5 mr-2" />
                                        <span className="font-mono text-xs">{project.unique_id}</span>
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

                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15 text-center">
                            <div className="text-white/60 text-xs mb-0.5">Created</div>
                            <div className="text-white font-medium text-sm">{formatDate(project.created_at)}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15 text-center">
                            <div className="text-white/60 text-xs mb-0.5">Updated</div>
                            <div className="text-white font-medium text-sm">{formatDate(project.updated_at)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectHeader