import { Settings, Webhook, Zap } from 'lucide-react'
import React from 'react'

const WebhookCard = ({webhooks}:{webhooks:any[]}) => {
  return (
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

                    {webhooks.length > 0 ? (
                        <div className="space-y-3">
                            {webhooks.map((webhook, index) => (
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
  )
}

export default WebhookCard