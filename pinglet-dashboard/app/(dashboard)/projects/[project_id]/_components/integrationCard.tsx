import React, { useState } from 'react';
import {

    Copy,

    CheckCircle,
    BarChart3
} from 'lucide-react';
import { ProjectDetailsResponse } from '@/lib/interfaces/project.interface';
import { __config } from '@/constants/config';

export const TemplateCard = ({ project, getCategoryColor }: { project: ProjectDetailsResponse, getCategoryColor: (category: string) => void }) => {
    const [copiedItems, setCopiedItems] = useState<string[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const copyToClipboard = (text: string, type: string) => {

        navigator.clipboard.writeText(text);
        if (type.includes('template')) {
            setCopiedItems(prev => [...prev.filter(item => item !== type), type]);
            setTimeout(() => setCopiedItems(prev => prev.filter(item => item !== type)), 2000);
        } else {
            setCopiedId(type);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };
    const templates = [
        {
            id: 'project-v.0.0.2',
            title: 'Latest Version of Pinglet Default Notifications (Recommended)',
            description: 'All Features and Customization are supported',
            icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
            category: project.category.name,
            code: `<!-- Pinglet Default Notifications v0.0.2 -->
    <script
      type="module"
      src="${__config.CDN_URL}"      
      data-endpoint="${__config.NOTIFICATIONS_API_URL}"
      data-configured-domain="${project.website.domain}"
      data-project-id="${project.unique_id}"
      data-pinglet-id="94b00f277a7a8c12a233e39d3e4f5a6b7"     
      data-checksum="sha384-Y7YXYX2j5YloeGIEAei75Q6PcXH+o/A93sGoo8u3SxeGjMUbmR+JqizhPOPKfiy3" 
      data-load-templates="true"
    ></script>
`,

        }, {
            id: 'project-v.0.0.1',
            title: 'Old Version of Pinglet Default Notifications',
            description: 'Only Basic Features are supported. (No Customization)',
            icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
            category: project.category.name,
            code: `<!-- Pinglet Default Notifications v0.0.1 -->
<script async src=""${__config.CDN_URL}""></script>
<script>
    PingletWidget.init({
        endpoint: "${__config.NOTIFICATIONS_API_URL}",
        expectedDomains: ["${project.website.domain}],
        projectIds: ["${project.unique_id}"],
      });
</script>`
        }
    ]


    return (
        <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-700 hover:-translate-y-2 hover:bg-white/80">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {
                templates.map((template) => (
                    <div className="relative p-8">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                                    <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-500 border border-blue-200/50">
                                        {template.icon}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-1">
                                        {template.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {template.description}
                                    </p>
                                </div>
                            </div>
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${getCategoryColor(template.category)}`}>
                                {template.category}
                            </div>
                        </div>


                        {/* Code Preview */}
                        <div className="relative group/code">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 rounded-2xl blur-xl opacity-20 group-hover/code:opacity-30 transition-opacity duration-500" />
                            <div className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-2xl border border-gray-700/50 overflow-hidden">
                                {/* Code Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800/50 to-slate-800/50 border-b border-gray-700/50">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                        </div>
                                        <span className="text-xs text-gray-400 ml-2 font-mono">index.html</span>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(template.code, `template-${template.id}`)}
                                        className={`group/btn relative overflow-hidden px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${copiedItems.includes(`template-${template.id}`)
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                                            : 'bg-gradient-to-r from-gray-700 to-slate-700 hover:from-blue-600 hover:to-indigo-600 text-gray-300 hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {copiedItems.includes(`template-${template.id}`) ? (
                                                <>
                                                    <CheckCircle className="w-3 h-3" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3" />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>

                                {/* Code Content */}
                                <div className="p-4">
                                    <pre className="text-gray-100 text-xs leading-relaxed overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                        <code className="font-mono">
                                            {template.code}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                ))

            }
        </div>
    )
}
