import { AlertCircle, Webhook, Globe, Zap, Clock, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import serverAxios from '@/lib/api/server.instance';
import { ApiResponse } from '@/lib/types';
import { WebhookResponse } from '@/lib/interfaces/webhook.interface';

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

export default async function WebhookDetailsPage({ params }: { params: any }) {
    const { id } = await params as { id: string };

    let webhook: WebhookResponse | null = null;
    let error = false;

    try {
        const { data } = await serverAxios.get<ApiResponse<WebhookResponse>>('/api/v1/webhook/' + id);
        if (data.success) {
            webhook = data.result;
        } else {
            error = true;
        }
    } catch {
        error = true;
    }

    if (error || !webhook) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5 backdrop-blur-sm max-w-md w-full">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-destructive/10 mb-5">
                        <AlertCircle className="w-7 h-7 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Webhook not found</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        This webhook doesn&apos;t exist or couldn&apos;t be loaded.
                    </p>
                    <Link
                        href="/u/webhooks"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background text-foreground hover:bg-accent transition-colors"
                    >
                        Back to Webhooks
                    </Link>
                </div>
            </div>
        );
    }

    const triggers = webhook.triggers_on ?? [];
    const config = webhook.config ?? {};

    return (
        <div className="space-y-6">
            {/* Back link + Header */}
            <div>
                <Link href="/u/webhooks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Webhooks
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                            <Webhook className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{webhook.name}</h1>
                            {webhook.description && (
                                <p className="text-sm text-muted-foreground">{webhook.description}</p>
                            )}
                        </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                        webhook.is_active
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                        {webhook.is_active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {webhook.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Info */}
                <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Globe className="w-4 h-4 text-primary" />
                        <h2 className="font-semibold text-foreground">Information</h2>
                    </div>
                    <dl className="space-y-4 text-sm">
                        <div>
                            <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</dt>
                            <dd className="text-foreground font-mono mt-1">{webhook.id}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</dt>
                            <dd className="mt-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary capitalize">
                                    {webhook.type}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created</dt>
                            <dd className="text-foreground mt-1">{formatDate(webhook.created_at)}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Updated</dt>
                            <dd className="text-foreground mt-1">{formatDate(webhook.updated_at)}</dd>
                        </div>
                    </dl>
                </div>

                {/* Configuration */}
                <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Zap className="w-4 h-4 text-primary" />
                        <h2 className="font-semibold text-foreground">Configuration</h2>
                    </div>
                    {Object.keys(config).length > 0 ? (
                        <pre className="text-xs text-foreground font-mono bg-muted/50 rounded-xl p-4 border border-border/50 overflow-x-auto whitespace-pre-wrap break-all">
                            {JSON.stringify(config, null, 2)}
                        </pre>
                    ) : (
                        <p className="text-sm text-muted-foreground">No configuration set.</p>
                    )}
                </div>

                {/* Triggers */}
                <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Clock className="w-4 h-4 text-primary" />
                        <h2 className="font-semibold text-foreground">Event Triggers</h2>
                    </div>
                    {triggers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {triggers.map((trigger, i) => (
                                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-muted/50 text-foreground border border-border/50">
                                    {trigger}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No triggers configured.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
