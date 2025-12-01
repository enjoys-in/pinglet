import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Sparkles, Loader2 } from "lucide-react"
import { API } from "@/lib/api/handler"
import { db } from "@/lib/db"
import { TemplateCategoryResponse } from "@/lib/interfaces/template-category.interface"
import { useToast } from "@/hooks/use-toast"
import {

    useSandpack,
} from "@codesandbox/sandpack-react"

interface TemplateFormProps {
    onSave: (data: any) => void
    isSaving: boolean
    initialData: Record<string, any>
    hasChanges: boolean
    type: "create" | "update"
}
export function TemplateForm({ onSave, isSaving, initialData, hasChanges, type }: TemplateFormProps) {
    const { sandpack } = useSandpack()
    const [categories, setCategories] = useState<TemplateCategoryResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        category_id: initialData?.category_id || "",
    })

    useEffect(() => {
        loadCategories()
    }, [])

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                category_id: String(initialData.category?.id || initialData.category_id || ""),
            })
        }
    }, [initialData])

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
                                    <code className="font-mono text-foreground/80 bg-background/50 px-1 py-0.5 rounded">{"{{ var_name }}"}</code>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Update Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={isSaving || !hasChanges}
                    className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {type === "create" ? "Creating..." : "Updating..."}
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            {type === "create" ? "Create Template" : "Update Template"}
                        </>
                    )}
                </Button>

                {hasChanges && (
                    <p className="text-xs text-center text-muted-foreground">
                        You have unsaved changes
                    </p>
                )}
            </div>
        </div>
    )
}