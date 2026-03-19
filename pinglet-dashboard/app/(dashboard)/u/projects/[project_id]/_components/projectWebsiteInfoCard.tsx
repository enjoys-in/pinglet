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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Website Information */}
            <div className="xl:col-span-2">
                <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
                                    <Globe className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">
                                        Website Details
                                    </h2>
                                    <p className="text-sm text-muted-foreground">Domain and configuration</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div className="group/item">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                        Website Name
                                    </label>
                                    <div className="flex items-center justify-between bg-muted/50 rounded-xl p-3.5 border border-border/50 group-hover/item:border-primary/30 transition-colors">
                                        <p className="font-semibold text-foreground">
                                            {website.name}
                                        </p>
                                        <Eye className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                                    </div>
                                </div>

                                <div className="group/item">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                        Website ID
                                    </label>
                                    <div className="flex items-center justify-between bg-muted/50 rounded-xl p-3.5 border border-border/50 group-hover/item:border-primary/30 transition-colors">
                                        <p className="font-mono text-sm text-foreground">
                                            {website.id}
                                        </p>
                                        <button
                                            onClick={() =>
                                                copyToClipboard(website.id.toString(), "website")
                                            }
                                            className="text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="group/item">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                        Domain
                                    </label>
                                    <div className="flex items-center justify-between bg-muted/50 rounded-xl p-3.5 border border-border/50 group-hover/item:border-primary/30 transition-colors">
                                        <p className="font-semibold text-foreground">
                                            {website.domain}
                                        </p>
                                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors cursor-pointer" />
                                    </div>
                                </div>

                                <div className="group/item">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                        Status
                                    </label>
                                    <div className="bg-muted/50 rounded-xl p-3.5 border border-border/50">
                                        <StatusBadge isActive={website.is_active} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tags Section */}
                        <div className="mb-6">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {website.tags.length > 0 ? (
                                    website.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="group/tag inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/5 text-primary border border-primary/15 hover:bg-primary/10 hover:border-primary/25 transition-all duration-200"
                                        >
                                            <Tag className="w-3 h-3 mr-1.5 group-hover/tag:rotate-12 transition-transform" />
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <div className="text-center py-6 w-full">
                                        <Tag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">No tags assigned</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="border-t border-border/50 pt-6">
                            <h3 className="text-sm font-semibold text-foreground mb-4">
                                Timeline
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
                                        <Calendar className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            Website Created
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(website.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-sm">
                                        <Clock className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            Last Updated
                                        </p>
                                        <p className="text-xs text-muted-foreground">
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
            <div className="space-y-6">
                {/* Category Information */}
                <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center mb-5">
                            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                                <Folder className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Category</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                                    Name
                                </label>
                                <p className="font-semibold text-foreground">
                                    {category.name}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                                    Slug
                                </label>
                                <p className="text-sm font-mono bg-muted/50 px-3 py-2 rounded-lg text-foreground border border-border/50">
                                    {category.slug}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                                    Description
                                </label>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {category.description}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-border/50">
                                <StatusBadge isActive={category.is_active} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center mb-5">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                                <TrendingUp className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">
                                Quick Actions
                            </h3>
                        </div>

                        <div className="space-y-2">
                            <Link href={`/u/projects/${project.id}/docs`} className="w-full flex items-center justify-between p-3.5 bg-muted/50 hover:bg-primary/5 rounded-xl border border-border/50 hover:border-primary/20 transition-all duration-200 group/btn">
                                <div className="flex items-center">
                                    <Code className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary mr-3 transition-colors" />
                                    <span className="text-sm font-medium text-foreground">
                                        API Documentation
                                    </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectWebsiteInfoCard;
