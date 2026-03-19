import React, { useState } from 'react';
import {

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
      crossorigin="anonymous"
      src="${__config.CDN_URL}"      
      data-endpoint="${__config.NOTIFICATIONS_API_URL}"
      data-configured-domain="${project.website.domain}"
      data-project-id="${project.unique_id}"
      data-pinglet-id="${project.website?.pinglet_id?.publicKey}"
      data-checksum="sha384-bt2+37hfBbS8dxEUfbyk7QYPqeaSU/22+ZdVPh3xC1lMUeTKGl1UPg6wjiW0EkkN" 
      data-load-templates="true"
    ></script>
`},


    ]


    return (
        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
            {
                templates.map((template) => (
                    <div className="p-6" key={template.id}>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-5 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/15">
                                    {template.icon}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground mb-0.5">
                                        {template.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {template.description}
                                    </p>
                                </div>
                            </div>
                            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0 ${getCategoryColor(template.category)}`}>
                                {template.category}
                            </div>
                        </div>
                        <EditorTabs
                            project={project}
                            id={template.id}
                            copyToClipboard={copyToClipboard} code={template.code} copiedItems={copiedItems} />


                    </div>
                ))

            }

        </div>
    )
}
