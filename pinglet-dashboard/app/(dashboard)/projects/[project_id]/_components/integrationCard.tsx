import React, { useState } from 'react';
import {

    Copy,

    CheckCircle,
    BarChart3
} from 'lucide-react';
import { ProjectDetailsResponse } from '@/lib/interfaces/project.interface';
import { __config } from '@/constants/config';
import EditorTabs from './editorTabs';

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
`}

    ]


    return (
        <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-700 hover:-translate-y-2 hover:bg-white/80">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {
                templates.map((template) => (
                    <div className="relative p-8" key={template.id}>
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
                        <EditorTabs
                        project={project}
                            id={template.id}
                            copyToClipboard={copyToClipboard} code={template.code} copiedItems={copiedItems}  />


                    </div>
                ))

            }
        </div>
    )
}
