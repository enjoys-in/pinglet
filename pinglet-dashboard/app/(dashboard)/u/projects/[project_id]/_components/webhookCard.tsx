import { Settings, Webhook, Zap } from 'lucide-react'
import React from 'react'

const WebhookCard = ({webhooks}:{webhooks:any[]}) => {
  return (
      <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center">
                            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                                <Webhook className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Webhooks</h3>
                        </div>
                        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>

                    {webhooks.length > 0 ? (
                        <div className="space-y-2">
                            {webhooks.map((webhook, index) => (
                                <div key={index} className="p-3.5 bg-muted/50 rounded-xl border border-border/50">
                                    <p className="text-sm text-foreground font-mono">{JSON.stringify(webhook)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-7 h-7 text-orange-500" />
                            </div>
                            <p className="text-foreground font-medium mb-1">No webhooks configured</p>
                            <p className="text-sm text-muted-foreground">Set up webhooks to receive real-time updates</p>
                            <button className="mt-4 inline-flex items-center px-4 py-2 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity shadow-md">
                                <Zap className="w-4 h-4 mr-2" />
                                Add Webhook
                            </button>
                        </div>
                    )}
                </div>
            </div>
  )
}

export default WebhookCard