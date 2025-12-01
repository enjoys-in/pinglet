"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

import { ArrowLeft, Sparkles, Loader2 } from "lucide-react"
import { API } from "@/lib/api/handler"

import { useToast } from "@/hooks/use-toast"
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    useSandpack,
} from "@codesandbox/sandpack-react"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { javascript } from "@codemirror/lang-javascript"

import { autocompletion, closeBrackets } from "@codemirror/autocomplete"
import {
    keymap,
    highlightActiveLine,
    highlightSpecialChars,
    highlightActiveLineGutter,
    highlightTrailingWhitespace,
    gutters,
    lineNumbers,
    EditorView,
    tooltips,
    rectangularSelection,
} from "@codemirror/view"
import { indentWithTab, defaultKeymap } from "@codemirror/commands"
import { TemplateResponse } from "@/lib/interfaces/templates.interface"
import { TemplateForm } from "../_components/templateForm"
import FormatCode from "../_components/formatCode"
const customAutocompleteTheme = EditorView.theme({
    ".cm-tooltip-autocomplete": {
        backgroundColor: "#1e1e1e",
        color: "#fff",
        border: "1px solid #444",
    },
    ".cm-tooltip-autocomplete .cm-completionLabel": {
        color: "#fff",
    },
    ".cm-tooltip-autocomplete .cm-completionMatchedText": {
        color: "#6cf",
    },
})






export function EditTemplatePage({ data }: { data: TemplateResponse }) {
    const router = useRouter()
    const { toast } = useToast()
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [templateData, setTemplateData] = useState<TemplateResponse | null>(null)
    const [initialCode, setInitialCode] = useState({
        html: data.raw_text?.html || "",
        css: data.raw_text?.css || "",
        js: data.raw_text?.js || "",
    })
    const [hasChanges, setHasChanges] = useState(false)



    const loadTemplate = async () => {
        try {

            if (data) {
                setTemplateData(data)
                setInitialCode({ html: data.raw_text?.html || "", css: data.raw_text?.css || "", js: data.raw_text?.js || "" })
            } else {
                toast({
                    title: "Error",
                    description: "Failed to load template",
                    variant: "destructive",
                })
                router.push("/u/templates")
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load template",
                variant: "destructive",
            })
            router.push("/u/templates")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdate = async (updatedData: any) => {
        setIsSaving(true)
        try {
            const { data } = await API.updateTemplate(+templateData!.id, updatedData)
            if (!data.success) {
                toast({
                    title: "Error",
                    description: "Failed to update template",
                    variant: "destructive",
                })
                return
            }

            toast({
                title: "Success",
                description: "Template updated successfully!",
            })

            setHasChanges(false)
            // router.push("/u/templates")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update template",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }
    useEffect(() => {
        loadTemplate()
    }, [])

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Loading template...</p>
                </div>
            </div>
        )
    }

    if (!templateData) {
        return null
    }

    return (
        <SandpackProvider
            template="vanilla"
            theme="dark"
            files={{
                "/index.html": {
                    code: initialCode.html,
                    active: true,
                },
                "/style.css": {
                    code: initialCode.css,
                },
                "/index.js": { code: initialCode.js },
            }}
            customSetup={{
                entry: "/index.html",
            }}
        >
            <ChangeDetector
                initialCode={initialCode}
                initialFormData={{
                    name: templateData.name,
                    description: templateData.description,
                    category_id: String(templateData.category?.id || ""),
                }}
                onChangeDetected={setHasChanges}
            />
            <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
                {/* Header */}
                <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.push("/u/templates")}
                                    className="rounded-xl hover:bg-primary/10 transition-all duration-200"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                                        <Sparkles className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                            Edit Template
                                        </h1>
                                        <p className="text-sm text-muted-foreground">
                                            Update your template design and code
                                        </p>
                                    </div>
                                </div>

                            </div>
                            <FormatCode />
                        </div>
                    </div>
                </div>

                {/* Main Content - Split Layout */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Side - Form */}
                    <TemplateForm
                        onSave={handleUpdate}
                        isSaving={isSaving}
                        initialData={templateData}
                        hasChanges={true}
                        type="update"
                    />

                    {/* Right Side - Code Renderer */}
                    <div className="flex-1 overflow-hidden">
                        <div className="h-full">
                            <SandpackLayout>
                                <SandpackCodeEditor
                                    showTabs
                                    extensions={[
                                        highlightActiveLine(),
                                        highlightSpecialChars(),
                                        autocompletion(),
                                        closeBrackets(),
                                        keymap.of([indentWithTab]),
                                        keymap.of([...defaultKeymap]),
                                        html(),
                                        css(),
                                        javascript(),
                                        customAutocompleteTheme,
                                        highlightActiveLineGutter(),
                                        highlightTrailingWhitespace(),
                                        lineNumbers(),
                                        gutters(),
                                        tooltips(),
                                        rectangularSelection(),
                                    ]}
                                    showInlineErrors
                                    showLineNumbers
                                    wrapContent
                                    style={{ height: 600, flex: 1 }}
                                />
                                <SandpackPreview
                                    style={{ height: 600, flex: 1 }}
                                    showOpenInCodeSandbox={false}
                                    showRefreshButton={true}
                                />
                            </SandpackLayout>
                        </div>
                    </div>
                </div>
            </div>
        </SandpackProvider>
    )
}

// Component to detect changes in code and form
function ChangeDetector({
    initialCode,
    initialFormData,
    onChangeDetected
}: {
    initialCode: any
    initialFormData: any
    onChangeDetected: (hasChanges: boolean) => void
}) {
    const { sandpack } = useSandpack()
    const [formData, setFormData] = useState(initialFormData)

    useEffect(() => {
        const checkChanges = () => {
            const currentHtml = sandpack.files["/index.html"]?.code || ""
            const currentCss = sandpack.files["/style.css"]?.code || ""
            const currentJs = sandpack.files["/index.js"]?.code || ""

            const codeChanged =
                currentHtml !== initialCode.html ||
                currentCss !== initialCode.css ||
                currentJs !== initialCode.js

            const formChanged =
                formData.name !== initialFormData.name ||
                formData.description !== initialFormData.description ||
                formData.category_id !== initialFormData.category_id

            onChangeDetected(codeChanged || formChanged)
        }

        // Check for changes every second
        const interval = setInterval(checkChanges, 1000)

        return () => clearInterval(interval)
    }, [sandpack, initialCode, formData, initialFormData, onChangeDetected])

    return null
}
