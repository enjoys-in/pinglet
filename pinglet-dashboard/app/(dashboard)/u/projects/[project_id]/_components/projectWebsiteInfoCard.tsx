import React from "react";

import {
    Globe,
    Calendar,
    Tag,
    ExternalLink,
    Folder,
    Clock,
    Copy,
    Eye,
    TrendingUp,
    Settings,
    MoreVertical,
    Code,
    ChevronRight,
} from "lucide-react";
import { ProjectDetailsResponse } from "@/lib/interfaces/project.interface";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const ProjectWebsiteInfoCard = ({
    project,
    website,
    copyToClipboard,
    StatusBadge,
    category
}: {
    project: ProjectDetailsResponse;
    website: ProjectDetailsResponse["website"];
    category: ProjectDetailsResponse["category"];
    copyToClipboard: (text: string, type: string) => void;
    StatusBadge: React.FC<{ isActive: boolean }>;

}) => {
    return (
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
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Website Details
                                        </h2>
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
                                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                            Website Name
                                        </label>
                                        <div className="flex items-center justify-between bg-gray-50/50 rounded-xl p-4 border border-gray-100 group-hover/item:border-emerald-200 transition-colors">
                                            <p className="text-lg font-semibold text-gray-900">
                                                {website.name}
                                            </p>
                                            <Eye className="w-4 h-4 text-gray-400 group-hover/item:text-emerald-500 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="group/item">
                                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                            Website ID
                                        </label>
                                        <div className="flex items-center justify-between bg-gray-50/50 rounded-xl p-4 border border-gray-100 group-hover/item:border-emerald-200 transition-colors">
                                            <p className="text-lg font-mono text-gray-900">
                                                {website.id}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(website.id.toString(), "website")
                                                }
                                                className="text-gray-400 hover:text-emerald-500 transition-colors"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="group/item">
                                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                            Domain
                                        </label>
                                        <div className="flex items-center justify-between bg-gray-50/50 rounded-xl p-4 border border-gray-100 group-hover/item:border-emerald-200 transition-colors">
                                            <p className="text-lg font-semibold text-gray-900">
                                                {website.domain}
                                            </p>
                                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover/item:text-emerald-500 transition-colors cursor-pointer" />
                                        </div>
                                    </div>

                                    <div className="group/item">
                                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                            Status
                                        </label>
                                        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                                            <StatusBadge isActive={website.is_active} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags Section */}
                            <div className="mb-8">
                                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 block">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {website.tags.length > 0 ? (
                                        website.tags.map((tag, index) => (
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                    Timeline
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                            <Calendar className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                Website Created
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(website.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                Last Updated
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(website.updated_at)}
                                            </p>
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
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                                        Name
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {category.name}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                                        Slug
                                    </label>
                                    <p className="text-sm font-mono bg-gray-50 px-3 py-2 rounded-lg text-gray-700 border border-gray-200">
                                        {category.slug}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                                        Description
                                    </label>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <StatusBadge isActive={category.is_active} />
                                </div>
                            </div>
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
                                <h3 className="text-xl font-bold text-gray-900">
                                    Quick Actions
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {/* <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-blue-50 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all duration-300 group/btn">
                                    <div className="flex items-center">
                                        <Eye className="w-4 h-4 text-gray-600 group-hover/btn:text-indigo-600 mr-3 transition-colors" />
                                        <span className="text-sm font-medium text-gray-900">
                                            View Analytics
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover/btn:text-indigo-600 transition-colors" />
                                </button>

                                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-teal-50 rounded-xl border border-gray-200 hover:border-emerald-200 transition-all duration-300 group/btn">
                                    <div className="flex items-center">
                                        <Settings className="w-4 h-4 text-gray-600 group-hover/btn:text-emerald-600 mr-3 transition-colors" />
                                        <span className="text-sm font-medium text-gray-900">
                                            Manage Settings
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover/btn:text-emerald-600 transition-colors" />
                                </button> */}

                                <Link href={`/u/projects/${project.id}/docs`} className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-purple-50 hover:to-pink-50 rounded-xl border border-gray-200 hover:border-purple-200 transition-all duration-300 group/btn">
                                    <div className="flex items-center">
                                        <Code className="w-4 h-4 text-gray-600 group-hover/btn:text-purple-600 mr-3 transition-colors" />
                                        <span className="text-sm font-medium text-gray-900">
                                            API Documentation
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover/btn:text-purple-600 transition-colors" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectWebsiteInfoCard;
