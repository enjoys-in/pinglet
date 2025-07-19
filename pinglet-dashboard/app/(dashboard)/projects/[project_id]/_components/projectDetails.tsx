"use client"
import { ProjectDetailsResponse } from '@/lib/interfaces/project.interface'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'

import React, { useState } from 'react';
import {
    Globe,
    Calendar,
    Tag,
    Activity,
    ExternalLink,
    Folder,
    Clock,
    Zap,
    Shield,
    Webhook,
    Copy,
    Eye,
    TrendingUp,
    Settings,
    MoreVertical,
    Star,
    Users,
    Database,
    Code,
    Layers,
    ChevronRight
} from 'lucide-react';

interface ProjectDetailsProps {
    project: ProjectDetailsResponse;
}

const ProjectDetails = ({ project }: { project: ProjectDetailsResponse }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null); 
    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(type);
        setTimeout(() => setCopiedId(null), 2000);
    };



    const MetricCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            <div className="relative">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} shadow-lg mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
                <div className="text-sm text-gray-600">{label}</div>
            </div>
        </div>
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const StatusBadge = ({ isActive }: { isActive: boolean }) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isActive
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
    return (
        <div>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/50">
                {/* Floating Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* Header Section */}
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
                                                        onClick={() => copyToClipboard(project.id.toString(), 'project')}
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

                {/* Metrics Overview */}
                <div className="relative -mt-8 px-4 sm:px-6 lg:px-8 mb-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                icon={Globe}
                                label="Website Status"
                                value={project.website.is_active ? "Live" : "Offline"}
                                color="from-emerald-500 to-teal-600"
                            />
                            <MetricCard
                                icon={Tag}
                                label="Tags"
                                value={project.website.tags.length}
                                color="from-blue-500 to-indigo-600"
                            />
                            <MetricCard
                                icon={Webhook}
                                label="Webhooks"
                                value={project.webhooks.length}
                                color="from-purple-500 to-pink-600"
                            />
                            <MetricCard
                                icon={Activity}
                                label="Category"
                                value={project.category.is_active ? "Active" : "Inactive"}
                                color="from-orange-500 to-red-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                        {/* Website Information */}
                        <div className="xl:col-span-2">
                            <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                                                <Globe className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">Website Details</h2>
                                                <p className="text-gray-600">Domain and configuration</p>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                            <MoreVertical className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                        <div className="space-y-6">
                                            <div className="group/item">
                                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Website Name</label>
                                                <div className="flex items-center justify-between bg-gray-50/50 rounded-xl p-4 border border-gray-100 group-hover/item:border-emerald-200 transition-colors">
                                                    <p className="text-lg font-semibold text-gray-900">{project.website.name}</p>
                                                    <Eye className="w-4 h-4 text-gray-400 group-hover/item:text-emerald-500 transition-colors" />
                                                </div>
                                            </div>

                                            <div className="group/item">
                                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Website ID</label>
                                                <div className="flex items-center justify-between bg-gray-50/50 rounded-xl p-4 border border-gray-100 group-hover/item:border-emerald-200 transition-colors">
                                                    <p className="text-lg font-mono text-gray-900">{project.website.id}</p>
                                                    <button
                                                        onClick={() => copyToClipboard(project.website.id.toString(), 'website')}
                                                        className="text-gray-400 hover:text-emerald-500 transition-colors"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="group/item">
                                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Domain</label>
                                                <div className="flex items-center justify-between bg-gray-50/50 rounded-xl p-4 border border-gray-100 group-hover/item:border-emerald-200 transition-colors">
                                                    <p className="text-lg font-semibold text-gray-900">{project.website.domain}</p>
                                                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover/item:text-emerald-500 transition-colors cursor-pointer" />
                                                </div>
                                            </div>

                                            <div className="group/item">
                                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Status</label>
                                                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                                                    <StatusBadge isActive={project.website.is_active} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags Section */}
                                    <div className="mb-8">
                                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 block">Tags</label>
                                        <div className="flex flex-wrap gap-3">
                                            {project.website.tags.length > 0 ? (
                                                project.website.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="group/tag inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                                    >
                                                        <Tag className="w-3 h-3 mr-2 group-hover/tag:rotate-12 transition-transform" />
                                                        {tag}
                                                    </span>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 w-full">
                                                    <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-gray-500">No tags assigned</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="border-t border-gray-100 pt-8">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Timeline</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                                    <Calendar className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">Website Created</p>
                                                    <p className="text-sm text-gray-600">{formatDate(project.website.created_at)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                                    <Clock className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                                                    <p className="text-sm text-gray-600">{formatDate(project.website.updated_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-8">

                            {/* Category Information */}
                            <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                                            <Folder className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Category</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Name</label>
                                            <p className="text-lg font-semibold text-gray-900">{project.category.name}</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Slug</label>
                                            <p className="text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg text-gray-700 border border-gray-200">
                                                {project.category.slug}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Description</label>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {project.category.description}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100">
                                            <StatusBadge isActive={project.category.is_active} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Webhooks Section */}
                            <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                                                <Webhook className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">Webhooks</h3>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Settings className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>

                                    {project.webhooks.length > 0 ? (
                                        <div className="space-y-3">
                                            {project.webhooks.map((webhook, index) => (
                                                <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                                    <p className="text-sm text-gray-900 font-mono">{JSON.stringify(webhook)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <Zap className="w-8 h-8 text-orange-500" />
                                            </div>
                                            <p className="text-gray-900 font-medium mb-1">No webhooks configured</p>
                                            <p className="text-sm text-gray-500">Set up webhooks to receive real-time updates</p>
                                            <button className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-medium rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                                                <Zap className="w-4 h-4 mr-2" />
                                                Add Webhook
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-blue-50 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all duration-300 group/btn">
                                            <div className="flex items-center">
                                                <Eye className="w-4 h-4 text-gray-600 group-hover/btn:text-indigo-600 mr-3 transition-colors" />
                                                <span className="text-sm font-medium text-gray-900">View Analytics</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover/btn:text-indigo-600 transition-colors" />
                                        </button>

                                        <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-teal-50 rounded-xl border border-gray-200 hover:border-emerald-200 transition-all duration-300 group/btn">
                                            <div className="flex items-center">
                                                <Settings className="w-4 h-4 text-gray-600 group-hover/btn:text-emerald-600 mr-3 transition-colors" />
                                                <span className="text-sm font-medium text-gray-900">Manage Settings</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover/btn:text-emerald-600 transition-colors" />
                                        </button>

                                        <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-pink-50 rounded-xl border border-gray-200 hover:border-purple-200 transition-all duration-300 group/btn">
                                            <div className="flex items-center">
                                                <Code className="w-4 h-4 text-gray-600 group-hover/btn:text-purple-600 mr-3 transition-colors" />
                                                <span className="text-sm font-medium text-gray-900">API Documentation</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover/btn:text-purple-600 transition-colors" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Card className="lg:col-span-2 xl:col-span-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
                    <div className="flex items-center">
                        <Webhook className="w-6 h-6 text-white mr-3" />
                        <h3 className="text-xl font-bold text-white">Webhooks</h3>
                        <Badge variant="secondary" className="ml-2">
                            {project.webhooks.length}
                        </Badge>
                    </div>
                </div>
                <CardHeader>

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


