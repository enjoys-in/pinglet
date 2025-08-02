"use client"

import { useCallback, useLayoutEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { db } from "@/lib/db"
import { AllWebsitesResponse } from "@/lib/interfaces/website.interface"
import { API } from "@/lib/api/handler"
import { TemplateCategoryResponse } from "@/lib/interfaces/template-category.interface"
import { useRouter } from "next/navigation"



export default function CreateProjectPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [templateGroup, setTemplateGroup] = useState<TemplateCategoryResponse[]>([])
    const [websites, setWebsites] = useState<AllWebsitesResponse[]>([])
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

    const [projectName, setProjectName] = useState("")
    const [selectedWebsite, setSelectedWebsite] = useState("")
    const { toast } = useToast()
    const router = useRouter()

    const handleNext = () => {
        if (currentStep === 1 && !selectedGroup) {
            toast({
                title: "Please select a template group",
                variant: "destructive",
            })
            return
        }

        if (currentStep === 2 && (!projectName || !selectedWebsite)) {
            toast({
                title: "Please fill in all required fields",
                variant: "destructive",
            })
            return
        }

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleCreateProject = async () => {
        try {
            const selectedGroupData = templateGroup.find((g) => String(g.id) === selectedGroup)
            if (!selectedGroupData) {
                throw new Error("Template group not found")
            }


            const { data } = await API.createProject({
                name: projectName,
                website: {
                    id: +selectedWebsite
                },
                category: {
                    id: +selectedGroupData?.id
                }
            })
            if (!data.success) {
                throw new Error(data.message)
            }

            toast({
                title: "Project created successfully!",
                description: "Your project has been created and is ready to use.",
            })
            router.push(`/u/projects/${data.result.id}`)
        } catch (error: any) {
            toast({
                title: error.message,
                variant: "destructive",
            })
        }
    }

    const selectedGroupData = templateGroup.find((g) => String(g.id) === selectedGroup)

    const loadConfig = useCallback(() => {
        db.getAllItems("websites").then((response) => {
            if (response.length > 0) {
                setWebsites(response as AllWebsitesResponse[])
            }
        })

        db.getAllItems("template_categories").then(async (r) => {
            if (r.length !== 0) {
                setTemplateGroup(r as TemplateCategoryResponse[])
                return
            }
            const { data } = await API.getTemplateCategories()
            if (data.success) {
                setTemplateGroup(data.result)
                db.bulkPutItems("template_categories", data.result as any)
            }
        })
    }, [])
    useLayoutEffect(() => {
        loadConfig()
    }, [])
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/u/projects">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                </Link>

            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
                <p className="text-muted-foreground">Follow the steps to create your notification project</p>
            </div>
            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-4 mb-8">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {step < currentStep ? <Check className="h-4 w-4" /> : step}
                        </div>
                        {step < 3 && <div className={`w-16 h-0.5 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />}
                    </div>
                ))}
            </div>

            <div className="max-h-96 overflow-y-auto">
                {currentStep === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step {currentStep}: Choose Template Category</CardTitle>
                            <CardDescription>Select the category that best fits your notification needs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {templateGroup.map((group) => (
                                    <Card
                                        key={group.id}
                                        className={`cursor-pointer transition-all hover:shadow-md ${selectedGroup === group.id.toString() ? "ring-2 ring-primary" : ""
                                            }`}
                                        onClick={() => setSelectedGroup(String(group.id))}
                                    >
                                        <CardContent className="p-6 text-center">
                                            <div className="text-4xl mb-4">{Array.from(group.name)[0]}</div>
                                            <h3 className="font-semibold text-lg mb-2">{group.name.slice(2)}</h3>
                                            <p className="text-sm text-muted-foreground">{group.description}</p>
                                            <Badge className="mt-3" variant="secondary">
                                                {group.template_count} templates
                                            </Badge>
                                        </CardContent>
                                    </Card>
                                ))}

                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* <Card>
                    <CardHeader>
                        <CardTitle>Step 2: Choose Template</CardTitle>
                        <CardDescription>Select a template from the {selectedGroupData.name} category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedGroupData.templates.map((template) => (
                                <Card
                                    key={template.id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                                        }`}
                                    onClick={() => setSelectedTemplate(template.id)}
                                >
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold mb-2">{template.name}</h3>
                                        <p className="text-sm text-muted-foreground">{template.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card> */}

                {/* Step 2: Project Details */}
                {currentStep === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step {currentStep}: Project Details</CardTitle>
                            <CardDescription>Configure your project settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="projectName">Project Name</Label>
                                <Input
                                    id="projectName"
                                    placeholder="Enter project name"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="website">Select Website</Label>
                                <Select value={selectedWebsite} onValueChange={setSelectedWebsite}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a website" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {websites.map((website) => (
                                            <SelectItem key={website.id} value={website.id.toString()}>
                                                <div className="flex flex-col">
                                                    <span>{website.name}</span>
                                                    <span className="text-xs text-muted-foreground">{website.domain}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Review and Create */}
                {currentStep === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step {currentStep}: Review and Create</CardTitle>
                            <CardDescription>Review your project configuration before creating</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Project Name</Label>
                                        <p className="text-lg font-semibold">{projectName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                                        <p className="text-lg font-semibold">{websites.find((w) => w.domain === selectedWebsite)?.domain}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Template Category</Label>
                                        <p className="text-lg font-semibold">{selectedGroupData?.name}</p>
                                    </div>

                                </div>

                                <div className="mt-6 p-4 bg-muted rounded-lg">
                                    <h4 className="font-medium mb-2">Template Description</h4>
                                    <p className="text-sm text-muted-foreground">{selectedGroupData?.description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between sticky bottom-0 bg-background px-4 py-3">
                <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {currentStep < 3 ? (
                    <Button onClick={handleNext}>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={handleCreateProject}>Create Project</Button>
                )}
            </div>
        </div>
    )
}
