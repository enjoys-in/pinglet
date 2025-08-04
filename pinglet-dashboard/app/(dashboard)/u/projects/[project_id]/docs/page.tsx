"use client";
import React, { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const examples = {
    "-1": {
        label: "Browser Push Service Worker - (Upcoming)",
        description:
            "Triggers native browser push notifications. Works even if browser/tab is closed (requires service worker).",
        endpoint: "https://pinglet.enjoys.in/api/v1/notifications/send",
        headers: {
            "x-project-id": "your-project-id",
            // "x-pinglet-id": "your-pinglet-id",
            "x-pinglet-version": "1.0.5",
        },
        request: {
            project_id: "your-project-id",
            type: -1,
            variant: "default",
            data: {
                title: "Pinglet Alert",
                description: "Browser Push is active!",
                actions: [{ text: "Dismiss", action: "close" }],
            },
        },
        response: {
            "message": "OK",
            "result": "Notification Sent",
            "success": true,
            "X-API-PLATFORM STATUS": "OK"
        }
    },
    "0": {
        label: "In-Tab Notification",
        description:
            "Custom styled notifications shown inside open tabs. No service worker needed.",
        endpoint: "https://pinglet.enjoys.in/api/v1/notifications/send",

        headers: {
            "x-project-id": "your-project-id",
            // "x-pinglet-id": "your-pinglet-id",
            "x-pinglet-version": "1.0.5",
        },
        request: {
            project_id: "your-project-id",
            type: 0,
            variant: "default",
            body: {
                title: "Hello from Pinglet",
                description: "New design incoming!",
                media: {
                    type: "icon",
                    src: "🔥",
                },
                buttons: [
                    {
                        text: "Fix Now",
                        action: "link",
                        src: "https://example.com/action",
                    },
                    {
                        text: "Dismiss",
                        action: "close",
                    },
                ],
            },
            overrides: {
                auto_dismiss: false,
            },
        },
        response: {
            "message": "OK",
            "result": "Notification Sent",
            "success": true,
            "X-API-PLATFORM STATUS": "OK"
        }
    },
    "1": {
        label: "Custom HTML/CSS - (Upcoming)",
        description:
            "Fully custom template with HTML, CSS, variables. Perfect for SaaS branding and marketing.",
        endpoint: "https://pinglet.enjoys.in/api/v1/notifications/send",

        headers: {
            "x-project-id": "your-project-id",
            // "x-pinglet-id": "your-pinglet-id",
            "x-pinglet-version": "1.0.0",
        },
        request: {
            project_id: "your-project-id",
            template_id: "template-abc",
            type: 1,
            variant: "promo",
            data: {
                title: "Welcome to Pinglet", // used inside custom template
            },
        },
        response: {
            "message": "OK",
            "result": "Notification Sent",
            "success": true,
            "X-API-PLATFORM STATUS": "OK"
        }
    },
};

const PingletApiUsage = () => {
    const [activeTab, setActiveTab] = useState("0");

    return (
        <div className="  p-6">
            <h1 className="text-3xl font-bold mb-2">🔔 Pinglet API Usage Guide</h1>
            <p className="text-gray-500 mb-6">
                Select a notification type below to view sample request, headers, and
                response formats.
            </p>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4 flex space-x-2">
                    {Object.entries(examples).map(([key, val]) => (
                        <TabsTrigger key={key} value={key}>
                            {val.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Object.entries(examples).map(([key, val]) => (
                    <TabsContent key={key} value={key}>
                        <Card className="shadow-lg border rounded-2xl bg-white dark:bg-zinc-900">
                            <CardContent className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold">{val.label}</h2>
                                    <p className="text-gray-500">{val.description}</p>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase">
                                            Endpoint
                                        </h3>
                                        <code className="block bg-zinc-100 dark:bg-zinc-800 rounded-md p-2 text-blue-600">
                                            {val.endpoint}
                                        </code>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                                            Headers
                                        </h3>
                                        <pre className="bg-zinc-950 text-yellow-400 p-4 rounded-xl text-sm overflow-x-auto">
                                            {JSON.stringify(val.headers, null, 2)}
                                        </pre>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4 w-full">
                                        <div className="w-1/2">
                                            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                                                Request Payload
                                            </h3>
                                            <pre className="bg-zinc-950 text-green-400 p-4 rounded-xl text-sm overflow-x-auto">
                                                {JSON.stringify(val.request, null, 2)}
                                            </pre>
                                        </div>
                                        <div className="w-1/2">
                                            Schema
                                            <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 text-sm space-y-4">
                                                <div>
                                                    <div className="font-semibold text-gray-700 dark:text-gray-200">project_id</div>
                                                    <div className="text-blue-600 break-all">"your-project-id"</div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="font-semibold text-gray-700 dark:text-gray-200">type</div>
                                                        <div className="text-green-500">0</div>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-700 dark:text-gray-200">variant</div>
                                                        <div className="text-blue-500">"default"</div>
                                                    </div>
                                                </div>
                                                {
                                                    activeTab === "-1" && (
                                                        <div>
                                                            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">body</div>
                                                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md p-4 space-y-2">
                                                                <div><span className="text-gray-400">title*:</span> <span className="text-green-400">"Hello from Pinglet" // string</span></div>
                                                                <div><span className="text-gray-400">description:</span> <span className="text-pink-400">"New design incoming!"  // string</span></div>
                                                                <div><span className="text-gray-400">badge:</span> <span className="text-orange-400">"🔥" (must be valid URL)</span></div>
                                                                <div><span className="text-gray-400">icon*:</span> <span className="text-purple-400">(must be valid URL)</span></div>
                                                                <div><span className="text-gray-400">timestamp:</span> <span className="text-indigo-400">number of milliseconds</span></div>
                                                                <div><span className="text-blue-400">image:</span> <span className="text-green-400">(must be valid URL)</span></div>
                                                                <div><span className="text-gray-400">requireInteraction:</span> <span className="text-yellow-400"> boolean (Require User Click)</span></div>
                                                                <div><span className="text-gray-400">vibrate:</span> <span className="text-yellow-400"> array of number [200, 100, 200], // Vibration pattern for mobile devices</span></div>
                                                                <div>
                                                                    <div className="text-gray-400">data: <span className="text-teal-400"> (object) payload send to function executed in client side </span></div>
                                                                    <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 text-sm space-y-6 h-96 overflow-y-auto">
                                                                        <div>
                                                                            <div className="font-semibold text-gray-800 dark:text-gray-100">🔁 Options</div>
                                                                            <div className="ml-4 mt-2 space-y-1">
                                                                                <div><span className="text-gray-400">duration:</span> <span className="text-slate-400"> auto dismiss toast after ms</span></div>
                                                                                <div><span className="text-gray-400">url:</span> <span className="text-yellow-400">when click on toast, open new tab</span></div>
                                                                                <div><span className="text-gray-400">func:</span> <span className="text-blue-400">custom function wrapped in string</span></div>
                                                                                <div><span className="text-gray-400">payload:</span> <span className="text-blue-400">custom object payload sent to function wrapped in string</span></div>

                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                </div>




                                                                <div>
                                                                    <div className="text-gray-400">actions:</div>
                                                                    <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 text-sm space-y-6 h-96 overflow-y-auto">

                                                                        {/* Variant 1 */}
                                                                        <div>
                                                                            <div className="font-semibold text-gray-800 dark:text-gray-100">🔁 View / Close Button</div>
                                                                            <div className="ml-4 mt-2 space-y-1">
                                                                                <div><span className="text-gray-500">text*:</span> <span className="text-yellow-500">string</span></div>
                                                                                <div><span className="text-gray-500">action*:</span> <span className="text-blue-500">"view" | "dismiss"</span></div>
                                                                                <div><span className="text-gray-500">icon:</span> <span className="text-blue-500"> (must be valid URL)(optional)</span></div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Variant 3 */}
                                                                        <div>
                                                                            <div className="font-semibold text-gray-800 dark:text-gray-100">📡 Custom Event Button</div>
                                                                            <div className="ml-4 mt-2 space-y-1">
                                                                                <div><span className="text-gray-500">text:</span> <span className="text-yellow-500">string</span></div>
                                                                                <div><span className="text-gray-500">action:</span> <span className="text-blue-500">"eventname"</span></div>
                                                                                <div><span className="text-gray-500">data?:</span> <span className="text-purple-500">any</span></div>
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    activeTab === "0" && (
                                                        <>
                                                            <div>
                                                                <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">body</div>
                                                                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-md p-4 space-y-2">
                                                                    <div><span className="text-gray-400">title:</span> <span className="text-green-400">"Hello from Pinglet"</span></div>
                                                                    <div><span className="text-gray-400">description:</span> <span className="text-green-400">"New design incoming!"</span></div>
                                                                    <div><span className="text-gray-400">icon:</span> <span className="text-green-400">"🔥" (emoji/text/svg/base64)</span></div>
                                                                    <div><span className="text-gray-400">logo:</span> <span className="text-green-400">"url/base64"</span></div>
                                                                    <div><span className="text-gray-400">url:</span> <span className="text-green-400">"url" (optional, when click on toast, open new tab)</span></div>

                                                                    <div>
                                                                        <div className="text-gray-400">media:</div>
                                                                        <div className="ml-4 space-y-1">
                                                                            <div><span className="text-gray-500">type:</span>
                                                                                <span className="text-purple-400">"image"</span>
                                                                                <span className="text-gray-400 ml-2 italic">(image | audio | video | iframe)</span>
                                                                            </div>
                                                                            <div><span className="text-gray-500">src:</span>
                                                                                <span className="text-yellow-400">"🔥"</span>
                                                                                <span className="text-gray-400 ml-2 italic">(  must be valid URL)</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <div className="text-gray-400">buttons:</div>
                                                                        <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 text-sm space-y-6 h-96 overflow-y-auto">

                                                                            {/* Variant 1 */}
                                                                            <div>
                                                                                <div className="font-semibold text-gray-800 dark:text-gray-100">🔁 Reload / Close Button</div>
                                                                                <div className="ml-4 mt-2 space-y-1">
                                                                                    <div><span className="text-gray-500">text:</span> <span className="text-yellow-500">string</span></div>
                                                                                    <div><span className="text-gray-500">action:</span> <span className="text-blue-500">"reload" | "close"</span></div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Variant 2 */}
                                                                            <div>
                                                                                <div className="font-semibold text-gray-800 dark:text-gray-100">🔗 Redirect / Link / Alert Button</div>
                                                                                <div className="ml-4 mt-2 space-y-1">
                                                                                    <div><span className="text-gray-500">text:</span> <span className="text-yellow-500">string</span></div>
                                                                                    <div><span className="text-gray-500">action:</span> <span className="text-blue-500">"redirect" | "link" | "alert"</span></div>
                                                                                    <div><span className="text-gray-500">src:</span> <span className="text-green-500">string (URL/message)</span></div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Variant 3 */}
                                                                            <div>
                                                                                <div className="font-semibold text-gray-800 dark:text-gray-100">📡 Custom Event Button</div>
                                                                                <div className="ml-4 mt-2 space-y-1">
                                                                                    <div><span className="text-gray-500">text:</span> <span className="text-yellow-500">string</span></div>
                                                                                    <div><span className="text-gray-500">action:</span> <span className="text-blue-500">"event"</span></div>
                                                                                    <div><span className="text-gray-500">event:</span> <span className="text-green-500">string</span></div>
                                                                                    <div><span className="text-gray-500">data?:</span> <span className="text-purple-500">any</span></div>
                                                                                </div>
                                                                            </div>


                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="">
                                                                <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">overrides</div>
                                                                <div className=" h-96 overflow-y-auto bg-white dark:bg-zinc-900 border rounded-xl p-6 text-sm space-y-4">
                                                                    <div>
                                                                        <div className="font-semibold text-gray-700 dark:text-gray-200">position</div>
                                                                        <div className="text-blue-500">"top-right" | "top-left" | "bottom-right" | "bottom-left"</div>
                                                                    </div>

                                                                    <div>
                                                                        <div className="font-semibold text-gray-700 dark:text-gray-200">transition</div>
                                                                        <div className="text-purple-500">"fade" | "slide" | "zoom"</div>
                                                                    </div>

                                                                    <div>
                                                                        <div className="font-semibold text-gray-700 dark:text-gray-200">branding</div>
                                                                        <div className="ml-4 space-y-1">
                                                                            <div><span className="text-gray-500">show:</span> <span className="text-green-500">boolean</span></div>
                                                                            <div><span className="text-gray-500">once:</span> <span className="text-green-500">boolean</span></div>
                                                                            <div><span className="text-gray-500">html:</span> <span className="text-yellow-500">string</span></div>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <div className="font-semibold text-gray-700 dark:text-gray-200">sound</div>
                                                                        <div className="ml-4 space-y-1">
                                                                            <div><span className="text-gray-500">play:</span> <span className="text-green-500">boolean</span></div>
                                                                            <div><span className="text-gray-500">src:</span> <span className="text-yellow-500">string (URL)</span></div>
                                                                            <div><span className="text-gray-500">volume:</span> <span className="text-blue-500">number (0-1)</span></div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <div className="font-semibold text-gray-700 dark:text-gray-200">duration</div>
                                                                            <div className="text-blue-500">number (ms)</div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-semibold text-gray-700 dark:text-gray-200">auto_dismiss</div>
                                                                            <div className="text-green-500">boolean</div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-semibold text-gray-700 dark:text-gray-200">maxVisible</div>
                                                                            <div className="text-blue-500">number</div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-semibold text-gray-700 dark:text-gray-200">stacking</div>
                                                                            <div className="text-green-500">boolean</div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-semibold text-gray-700 dark:text-gray-200">dismissible</div>
                                                                            <div className="text-green-500">boolean</div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-semibold text-gray-700 dark:text-gray-200">pauseOnHover</div>
                                                                            <div className="text-green-500">boolean</div>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <div className="font-semibold text-gray-700 dark:text-gray-200">website</div>
                                                                        <div className="text-yellow-500">string (URL)</div>
                                                                    </div>

                                                                    <div>
                                                                        <div className="font-semibold text-gray-700 dark:text-gray-200">time</div>
                                                                        <div className="text-green-500">boolean</div>
                                                                    </div>

                                                                    <div>
                                                                        <div className="font-semibold text-gray-700 dark:text-gray-200">favicon</div>
                                                                        <div className="text-green-500">boolean</div>
                                                                    </div>

                                                                    <div>
                                                                        <div className="font-semibold text-gray-700 dark:text-gray-200">theme</div>
                                                                        <div className="ml-4 space-y-1">
                                                                            <div><span className="text-gray-500">mode:</span> <span className="text-purple-400">"light" | "dark" | "auto"</span></div>
                                                                            <div><span className="text-gray-500">customClass:</span> <span className="text-yellow-500">string</span></div>
                                                                            <div><span className="text-gray-500">rounded:</span> <span className="text-green-500">boolean</span></div>
                                                                            <div><span className="text-gray-500">shadow:</span> <span className="text-green-500">boolean</span></div>
                                                                            <div><span className="text-gray-500">border:</span> <span className="text-green-500">boolean</span></div>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <div className="font-semibold text-gray-700 dark:text-gray-200">iconDefaults</div>
                                                                        <div className="ml-4 space-y-1">
                                                                            <div><span className="text-gray-500">show:</span> <span className="text-green-500">boolean</span></div>
                                                                            <div><span className="text-gray-500">size:</span> <span className="text-blue-500">number (px)</span></div>
                                                                            <div><span className="text-gray-500">position:</span> <span className="text-purple-400">"left" | "right" | "top"</span></div>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <div className="font-semibold text-gray-700 dark:text-gray-200">progressBar</div>
                                                                        <div className="ml-4 space-y-1">
                                                                            <div><span className="text-gray-500">show:</span> <span className="text-green-500">boolean</span></div>
                                                                            <div><span className="text-gray-500">color:</span> <span className="text-yellow-500">string (hex/rgb)</span></div>
                                                                            <div><span className="text-gray-500">height:</span> <span className="text-blue-500">number (px)</span></div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </>
                                                    )
                                                }

                                            </div>

                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-1">
                                            Sample Response
                                        </h3>
                                        <pre className="bg-zinc-950 text-cyan-400 p-4 rounded-xl text-sm overflow-x-auto">
                                            {JSON.stringify(val.response, null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button variant="outline" className="text-sm">
                                        Copy Example JSON
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default PingletApiUsage;
