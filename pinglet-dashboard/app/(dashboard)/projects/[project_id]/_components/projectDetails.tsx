"use client";
import { ProjectDetailsResponse } from "@/lib/interfaces/project.interface";
import React, { useState } from "react";
import { Globe, Tag, Activity, Webhook } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { TemplateCard } from "./integrationCard";
import WebhookCard from "./webhookCard";
import ProjectHeader from "./projectHeader";
import ProjectWebsiteInfoCard from "./projectWebsiteInfoCard";

const ProjectDetails = ({ project }: { project: ProjectDetailsResponse }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(type);
        setTimeout(() => setCopiedId(null), 2000);
        toast({
            title: "Copied to clipboard!",
            description: "HTML code has been copied successfully.",
        });
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            Analytics: "bg-blue-100 text-blue-800 border-blue-200",
            Support: "bg-purple-100 text-purple-800 border-purple-200",
            Security: "bg-red-100 text-red-800 border-red-200",
            SEO: "bg-green-100 text-green-800 border-green-200",
            Performance: "bg-orange-100 text-orange-800 border-orange-200",
        };
        return (
            colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
        );
    };

    const MetricCard = ({
        icon: Icon,
        label,
        value,
        color,
    }: {
        icon: any;
        label: string;
        value: string | number;
        color: string;
    }) => (
        <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div
                className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
            />
            <div className="relative">
                <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} shadow-lg mb-4`}
                >
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
                <div className="text-sm text-gray-600">{label}</div>
            </div>
        </div>
    );

    const StatusBadge = ({ isActive }: { isActive: boolean }) => (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isActive
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
        >
            <div
                className={`w-2 h-2 rounded-full mr-2 ${isActive ? "bg-emerald-500" : "bg-red-500"
                    }`}
            />
            {isActive ? "Active" : "Inactive"}
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
                <ProjectHeader
                    project={project}
                    copyToClipboard={copyToClipboard}
                    StatusBadge={StatusBadge}
                />

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

                <ProjectWebsiteInfoCard
                    website={project.website}
                    copyToClipboard={copyToClipboard}
                    StatusBadge={StatusBadge}
                    category={project.category}
                />
            </div>
            <TemplateCard project={project} getCategoryColor={getCategoryColor} />
            <WebhookCard webhooks={project.webhooks} />
        </div>
    );
};

export default ProjectDetails;
