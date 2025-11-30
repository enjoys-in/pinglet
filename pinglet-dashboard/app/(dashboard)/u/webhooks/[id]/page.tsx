import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// Placeholder for data fetching function
async function getWebhookDetails(id: string) {
    // In a real application, this would fetch data from an API
    // For now, we'll simulate a successful fetch with dummy data
    // or return null to trigger notFound if the ID is unknown
    if (id === '123' || id === 'test-webhook-id') {
        return {
            id: id,
            name: `Webhook ${id} Name`,
            url: `https://api.example.com/webhooks/${id}`,
            events: ['order.created', 'payment.succeeded'],
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Add more configuration details
            config: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_SECRET_TOKEN',
                },
                payloadExample: {
                    event: "order.created",
                    data: { orderId: "abc-123" }
                }
            },
            // Add more analytics details
            analytics: {
                totalCalls: 1234,
                successfulCalls: 1200,
                failedCalls: 34,
                lastCall: new Date().toISOString(),
                averageResponseTimeMs: 150,
                recentErrors: [
                    { timestamp: new Date().toISOString(), message: "Failed to connect", statusCode: 500 },
                    { timestamp: new Date().toISOString(), message: "Invalid payload", statusCode: 400 },
                ]
            }
        };
    }
    return null; // Webhook not found
}

interface WebhookDetailsPageProps {
    params: {
        id: string;
    };
}

export default async function WebhookDetailsPage({ params }: WebhookDetailsPageProps) {
    const webhook = await getWebhookDetails(params.id);

    if (!webhook) {
        notFound();
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Webhook Details: {webhook.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Info Section */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Information</h2>
                    <p><strong>ID:</strong> {webhook.id}</p>
                    <p><strong>URL:</strong> <code className="bg-gray-100 p-1 rounded text-sm">{webhook.url}</code></p>
                    <p><strong>Status:</strong> <span className={`font-medium ${webhook.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{webhook.status}</span></p>
                    <p><strong>Events:</strong> {webhook.events.join(', ')}</p>
                    <p><strong>Created At:</strong> {new Date(webhook.createdAt).toLocaleString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(webhook.updatedAt).toLocaleString()}</p>
                </section>

                {/* Configuration Section */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Configuration</h2>
                    <p><strong>Method:</strong> {webhook.config.method}</p>
                    <h3 className="font-medium mt-3 mb-1">Headers:</h3>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                        {JSON.stringify(webhook.config.headers, null, 2)}
                    </pre>
                    <h3 className="font-medium mt-3 mb-1">Payload Example:</h3>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                        {JSON.stringify(webhook.config.payloadExample, null, 2)}
                    </pre>
                    {/* Add more configuration specific details */}
                </section>

                {/* Analytics Section */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                    <p><strong>Total Calls:</strong> {webhook.analytics.totalCalls}</p>
                    <p><strong>Successful Calls:</strong> {webhook.analytics.successfulCalls}</p>
                    <p><strong>Failed Calls:</strong> {webhook.analytics.failedCalls}</p>
                    <p><strong>Last Call:</strong> {new Date(webhook.analytics.lastCall).toLocaleString()}</p>
                    <p><strong>Avg. Response Time:</strong> {webhook.analytics.averageResponseTimeMs}ms</p>

                    <h3 className="font-medium mt-3 mb-1">Recent Errors:</h3>
                    {webhook.analytics.recentErrors.length > 0 ? (
                        <ul className="list-disc pl-5 text-sm">
                            {webhook.analytics.recentErrors.map((error, index) => (
                                <li key={index}>
                                    [{new Date(error.timestamp).toLocaleString()}]{' '}
                                    <span className="font-mono text-red-600">({error.statusCode})</span> {error.message}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No recent errors.</p>
                    )}
                    {/* Add more analytics specific details */}
                </section>
            </div>

            {/* You might want to add more detailed logs or charts here */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Recent Deliveries (Placeholder)</h2>
                <p className="text-gray-500">
                    Detailed logs of recent webhook deliveries would appear here, including status, response, and timestamps.
                </p>
            </div>
        </div>
    );
}
