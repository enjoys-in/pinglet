import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Copy } from 'lucide-react'
import { __config } from '@/constants/config'
import { ProjectDetailsResponse } from '@/lib/interfaces/project.interface'
const EditorTabs = ({ project, code, copiedItems, copyToClipboard, id }: {
    id: string,
    code: string,
    copiedItems: string[],
    copyToClipboard: (text: string, type: string) => void,

    project: ProjectDetailsResponse
}) => {
    const NEXTJS = `"use client"
import Script from 'next/script'
import React from 'react'

const PingletWidget = () => {
    return <Script
            type="module"
            crossOrigin="anonymous"
            src="${__config.CDN_URL}"
            data-endpoint="${__config.NOTIFICATIONS_API_URL}"
            data-configured-domain="${project.website.domain}"
            data-project-id="${project.unique_id}"
            data-pinglet-id="${project.website?.pinglet_id?.publicKey}"
            data-checksum="sha384-Y7YXYX2j5YloeGIEAei75Q6PcXH+o/A93sGoo8u3SxeGjMUbmR+JqizhPOPKfiy3"
            data-load-templates="true"
    />
}

export default PingletWidget`
    const OLD_VERSION = `<!-- Pinglet Default Notifications v0.0.2 -->
    <script
        type="module"
        crossorigin="anonymous"
        src="${__config.CDN_URL}"
        data-endpoint="${__config.NOTIFICATIONS_API_URL}"
        data-configured-domain="${project.website.domain}"
        data-project-id="${project.unique_id}"
        data-pinglet-id="${project.website?.pinglet_id?.publicKey}"
        data-checksum="sha384-Y7YXYX2j5YloeGIEAei75Q6PcXH+o/A93sGoo8u3SxeGjMUbmR+JqizhPOPKfiy3"
        data-load-templates="true"
    ></script>`
    return (
        <Tabs defaultValue={"editor"} value='editor'>
            <TabsList >
                <TabsTrigger value="editor">React/Vite/Html/PHP/Wordpress</TabsTrigger>
                <TabsTrigger value="preview">Next.Js</TabsTrigger>
                <TabsTrigger value="pinglet">Old Version</TabsTrigger>
            </TabsList>
            <TabsContent value="editor">
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
                                onClick={() => copyToClipboard(code, `template-${id}`)}
                                className={`group/btn relative overflow-hidden px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${copiedItems.includes(`template-${id}`)
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                                    : 'bg-gradient-to-r from-gray-700 to-slate-700 hover:from-blue-600 hover:to-indigo-600 text-gray-300 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    {copiedItems.includes(`template-${id}`) ? (
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
                                    {code}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="preview">
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800/50 to-slate-800/50 border-b border-gray-700/50">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs text-gray-400 ml-2 font-mono">PingletWidget.tsx</span>
                    </div>
                    <button
                        onClick={() => copyToClipboard(NEXTJS, `template-${id}`)}
                        className={`group/btn relative overflow-hidden px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${copiedItems.includes(`template-${id}`)
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                            : 'bg-gradient-to-r from-gray-700 to-slate-700 hover:from-blue-600 hover:to-indigo-600 text-gray-300 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {copiedItems.includes(`template-${id}`) ? (
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
                <div className="relative group/code">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 rounded-2xl blur-xl opacity-20 group-hover/code:opacity-30 transition-opacity duration-500" />
                    <div className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-2xl border border-gray-700/50 overflow-hidden">

                        <div className="p-4">
                            <pre className="text-gray-100 text-xs leading-relaxed overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                <code className="font-mono">
                                    {NEXTJS}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="pinglet">
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
                        onClick={() => copyToClipboard(OLD_VERSION, `template-${id}`)}
                        className={`group/btn relative overflow-hidden px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${copiedItems.includes(`template-${id}`)
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                            : 'bg-gradient-to-r from-gray-700 to-slate-700 hover:from-blue-600 hover:to-indigo-600 text-gray-300 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {copiedItems.includes(`template-${id}`) ? (
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
                <div className="relative group/code">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 rounded-2xl blur-xl opacity-20 group-hover/code:opacity-30 transition-opacity duration-500" />
                    <div className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-2xl border border-gray-700/50 overflow-hidden">
                        <div className="p-4">
                            <pre className="text-gray-100 text-xs leading-relaxed overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                <code className="font-mono">
                                    {OLD_VERSION}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>




            </TabsContent>
        </Tabs>
    )
}

export default EditorTabs