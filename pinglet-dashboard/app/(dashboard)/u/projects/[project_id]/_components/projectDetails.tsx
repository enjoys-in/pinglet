"use client";
import { ProjectDetailsResponse } from "@/lib/interfaces/project.interface";
import React, { useEffect, useState } from "react";
import { Globe, Tag, Activity, Webhook, Users, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

import { toast } from "@/hooks/use-toast";
import { API } from "@/lib/api/handler";
import { TemplateCard } from "./integrationCard";
import WebhookCard from "./webhookCard";
import ProjectHeader from "./projectHeader";
import ProjectWebsiteInfoCard from "./projectWebsiteInfoCard";

const ProjectDetails = ({ project }: { project: ProjectDetailsResponse }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [onlineCount, setOnlineCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchPresence = async () => {
            try {
                const res = await API.getPresenceOnline(project.unique_id.toString());
                setOnlineCount(res.data?.result?.online ?? null);
            } catch { /* ignore */ }
        };
        fetchPresence();
        const interval = setInterval(fetchPresence, 30000);
        return () => clearInterval(interval);
    }, [project.unique_id]);

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
            Analytics: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
            Support: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
            Security: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
            SEO: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
            Performance: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
        };
        return (
            colors[category as keyof typeof colors] || "bg-muted text-muted-foreground"
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
        <div className="group relative overflow-hidden rounded-2xl p-6 border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div
                className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`}
            />
            <div className="relative">
                <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${color} shadow-md mb-4`}
                >
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
            </div>
        </div>
    );

    const StatusBadge = ({ isActive }: { isActive: boolean }) => (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
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
        <div className="space-y-8">
            {/* Header Section */}
            <ProjectHeader
                project={project}
                copyToClipboard={copyToClipboard}
                StatusBadge={StatusBadge}
            />

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {onlineCount !== null && (
                    <div className="group relative overflow-hidden rounded-2xl p-6 border border-emerald-500/30 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-[0.06]" />
                        <div className="relative">
                            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md mb-4">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                </span>
                                <span className="text-2xl font-bold text-foreground">{onlineCount}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">Users Online</div>
                        </div>
                    </div>
                )}
                <MetricCard
                    icon={Globe}
                    label="Website Status"
                    value={project.website?.is_active ? "Live" : "Offline"}
                    color="from-emerald-500 to-teal-600"
                />
                <MetricCard
                    icon={Tag}
                    label="Tags"
                    value={project.website?.tags?.length ?? 0}
                    color="from-blue-500 to-indigo-600"
                />
                <MetricCard
                    icon={Webhook}
                    label="Webhooks"
                    value={project.webhooks?.length ?? 0}
                    color="from-purple-500 to-pink-600"
                />
                <MetricCard
                    icon={Activity}
                    label="Category"
                    value={project.category?.is_active ? "Active" : "Inactive"}
                    color="from-orange-500 to-red-600"
                />
            </div>

            <ProjectWebsiteInfoCard
                project={project}
                website={project.website}
                copyToClipboard={copyToClipboard}
                StatusBadge={StatusBadge}
                category={project.category}
            />

            {/* Quick Documentation Link */}
            <Link href="/docs" target="_blank" className="block group">
                <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">SDK Documentation</h3>
                                <p className="text-sm text-muted-foreground">Integration guides, API reference, and custom events</p>
                            </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                </div>
            </Link>

            <TemplateCard project={project} getCategoryColor={getCategoryColor} />
            <WebhookCard webhooks={project.webhooks ?? []} />
        </div>
    );
};

export default ProjectDetails;
