"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Sparkles, Code2, Loader2 } from "lucide-react"
import { API } from "@/lib/api/handler"
import { db } from "@/lib/db"
import { TemplateCategoryResponse } from "@/lib/interfaces/template-category.interface"
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

const defaultHtml = `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="./style.css" />
    <script src="./index.js"></script>
  </head>
  <body>
    <div class="pinglet">
      <!-- Add your custom HTML here -->
      <h1>Hello Template!</h1>
      <p>Start building your template here.</p>
    </div>
  </body>
</html>`

const defaultCss = `.pinglet {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f7fa;
            padding: 2rem;
            line-height: 1.5;
        }
/* Add your custom CSS here, DO NOT REMOVE THE '.pinglet' CLASS */`
function TemplateForm({ onSave, isSaving }: { onSave: (data: any) => void; isSaving: boolean }) {
    const { sandpack } = useSandpack()
    const [categories, setCategories] = useState<TemplateCategoryResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_id: "",
    })

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        setIsLoading(true)
        try {
            const cached = await db.getAllItems("template_categories")
            if (cached.length > 0) {
                setCategories(cached as TemplateCategoryResponse[])
            } else {
                const { data } = await API.getTemplateCategories()
                if (data.success) {
                    setCategories(data.result)
                    db.bulkPutItems("template_categories", data.result as any)
                }
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load categories",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = () => {
        if (!formData.name || !formData.category_id) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            })
            return
        }

        // Get code from Sandpack
        const htmlCode = sandpack.files["/index.html"]?.code || ""
        const cssCode = sandpack.files["/style.css"]?.code || ""
        const jsCode = sandpack.files["/index.js"]?.code || ""

        const templateData = {
            ...formData,
            raw_text: {
                html: htmlCode,
                css: cssCode,
                js: jsCode,
            },
        }

        onSave(templateData)
    }

    return (
        <div className="w-80 border-r border-border/50 bg-background/50 backdrop-blur-sm overflow-y-auto">
            <div className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">
                            Template Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Enter template name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="rounded-xl border-border/50 bg-background/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Enter template description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="rounded-xl border-border/50 bg-background/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-semibold">
                            Category <span className="text-destructive">*</span>
                        </Label>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <Select
                                value={formData.category_id}
                                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                            >
                                <SelectTrigger className="rounded-xl border-border/50 bg-background/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>

                {/* Info Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-foreground mb-1">Template Guidelines</h4>
                            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                                <li>
                                    Keep the <code className="font-mono text-foreground/80 bg-background/50 px-1 py-0.5 rounded">.pinglet</code> wrapper div
                                </li>
                                <li>Use semantic HTML elements</li>
                                <li>Test responsiveness across devices</li>
                                <li>Optimize for performance and accessibility</li>
                                <li>
                                    Use variables for data manipulation like{" "}
                                    <code className="font-mono text-foreground/80 bg-background/50 px-1 py-0.5 rounded">{"{{ var_name }}"}</code> (e.g.,{" "}
                                    <code className="font-mono text-foreground/80 bg-background/50 px-1 py-0.5 rounded">{"{{ name }}"}</code>,{" "}
                                    <code className="font-mono text-foreground/80 bg-background/50 px-1 py-0.5 rounded">{"{{ age }}"}</code>)
                                </li>
                                <li>
                                    Pass these variables in the{" "}
                                    <code className="font-mono text-foreground/80 bg-background/50 px-1 py-0.5 rounded">custom_template</code> object of the POST API request
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Template
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
export default function CreateTemplatePage() {
    const router = useRouter()
    const { toast } = useToast()
    const [categories, setCategories] = useState<TemplateCategoryResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_id: "",
    })

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        setIsLoading(true)
        try {
            const cached = await db.getAllItems("template_categories")
            if (cached.length > 0) {
                setCategories(cached as TemplateCategoryResponse[])
            } else {
                const { data } = await API.getTemplateCategories()
                if (data.success) {
                    setCategories(data.result)
                    db.bulkPutItems("template_categories", data.result as any)
                }
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load categories",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (input: any) => {

        setIsSaving(true)
        try {

            const { data } = await API.createTemplate(input)
            if (!data.success) {
                toast({
                    title: "Error",
                    description: "Failed to create template",
                    variant: "destructive",
                })
                return
            }

            toast({
                title: "Success",
                description: "Template created successfully!",
            })

            // router.push("/u/templates")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create template",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <SandpackProvider
            template="vanilla"
            theme="dark"
            files={{
                "/index.html": {
                    code: defaultHtml,
                    active: true,
                },
                "/style.css": {
                    code: defaultCss,
                },
                "/index.js": { code: "// Do not edit this file" },
            }}
            customSetup={{
                entry: "/index.html",
            }}
        >
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
                                            Create New Template
                                        </h1>
                                        <p className="text-sm text-muted-foreground">
                                            Design and build your custom template
                                        </p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                {/* Main Content - Split Layout */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Left Side - Form */}
                    <TemplateForm onSave={handleSubmit} isSaving={isSaving} />

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
