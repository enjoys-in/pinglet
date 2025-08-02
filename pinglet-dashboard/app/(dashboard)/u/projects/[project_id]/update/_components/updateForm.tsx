"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Save,
    Loader2,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Zap,
    Settings,
} from "lucide-react";

import { FileUpload } from "./fileUpload";
import { ProjectDetailsResponse } from "@/lib/interfaces/project.interface";
import { TemplateCategoryResponse } from "@/lib/interfaces/template-category.interface";
import { AllWebsitesResponse } from "@/lib/interfaces/website.interface";
import { db } from "@/lib/db";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { API } from "@/lib/api/handler";

import { showToast } from "@/components/brand-toaster/toastContainer";
import { useRouter } from "next/navigation";

export function UpdateProjectForm({
    project,
}: {
    project: ProjectDetailsResponse;
}) {
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<
        "idle" | "success" | "error"
    >("idle");
    const [templateCategories, setTemplateCategories] = useState<
        TemplateCategoryResponse[]
    >([]);
    const router = useRouter()
    const [websites, setWebsites] = useState<AllWebsitesResponse[]>([]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isDirty },
    } = useForm<Partial<ProjectDetailsResponse>>({
        defaultValues: {
            name: "",
            description: null,
            logo: null,
            banner: null,
            website: { id: 0 },
            category: { id: 0 },
            is_active: true,
        },
    });

    const fetchLocalData = async () => {
        try {
            const categories = await db.getAllItems("template_categories");
            setTemplateCategories((categories as TemplateCategoryResponse[]) || []);

            const websites = await db.getAllItems("websites");
            setWebsites((websites as AllWebsitesResponse[]) || []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    useEffect(() => {
        if (project) {
            reset({
                name: project.name,
                description: project.description,
                logo: null,
                banner: null,
                website: {
                    id: project?.website?.id,
                },
                category: {
                    id: project?.category?.id,
                },
                is_active: project.is_active,
            });
        }
        fetchLocalData();

    }, [project, reset]);

    const onSubmit = async (data: ProjectDetailsResponse & any) => {
        setSubmitting(true);
        setSubmitStatus("idle");

        try {
            const payload = {
                name: data.name,
                description: data.description,
                logo: data.logo,
                banner: data.banner,
                is_active: data.is_active,
                website: {
                    id: data?.website?.id,
                },
                category: {
                    id: data?.category?.id,
                },
            };
            const { data: response } = await API.updateProject(project.id, payload);

            if (!response.success) {
                throw new Error(response.message || "Failed to update project");
            }
            setSubmitStatus("success");
            router.push(`/projects`)

            showToast({
                title: "Project Updated",
                message: `Project ${project.name} has been successfully updated.`,
                type: "success",
            })


        } catch (err) {
            
            setSubmitStatus("error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="  py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="shadow-2xl rounded-3xl overflow-hidden border ">
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-12 overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform -translate-x-16 translate-y-16"></div>

                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <Settings className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-white">
                                        Update {project.name}
                                    </h1>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Sparkles className="w-5 h-5 text-yellow-300" />
                                        <p className="text-indigo-100 font-medium">
                                            {project.description || "No description provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">
                        {/* Basic Information */}
                        <div className="space-y-8">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-300">
                                    Basic Information
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label className="block text-sm font-semibold text-slate-300 mb-3 ">
                                        Project Name
                                    </Label>
                                    <Input
                                        type="text"
                                        {...register("name", {
                                            required: "Project name is required",
                                            minLength: {
                                                value: 3,
                                                message: "Name must be at least 3 characters",
                                            },
                                        })}
                                        placeholder="Enter project name"
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{errors.name.message}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="block text-sm font-semibold text-slate-300 mb-3">
                                        Website
                                    </Label>
                                    <Controller
                                        name="website.id"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={(value) => field.onChange(+value)}
                                                defaultValue={field.value?.toString()}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select website" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {websites.map((website) => (
                                                        <SelectItem key={website.id} value={website.id.toString()}>
                                                            {website.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.website?.id && (
                                        <p className="text-red-500 text-sm">
                                            {errors.website.id.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="block text-sm font-semibold text-slate-300 mb-3">
                                    Description
                                </Label>
                                <Textarea
                                    {...register("description")}
                                    rows={5}
                                    placeholder="Describe your project..."
                                />
                                {errors.description && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.description.message}</span>
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="block text-sm font-semibold text-slate-300 mb-3">
                                    Template Category
                                </Label>
                                <Select
                                    onValueChange={(value) =>
                                        reset({ ...project, category: { id: +value } })
                                    }
                                    defaultValue={project.category?.id.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templateCategories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id.toString()}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category?.id && (
                                    <p className="text-red-500 text-sm">
                                        {errors.category.id.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Media Assets */}
                        <div className="space-y-8">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-300">
                                    Media Assets
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Controller
                                    name="logo"
                                    control={control}
                                    render={({ field }) => (
                                        <FileUpload
                                            label="Project Logo"
                                            currentFile={project.logo}
                                            onChange={field.onChange}
                                            error={errors.logo?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="banner"
                                    control={control}
                                    render={({ field }) => (
                                        <FileUpload
                                            label="Project Banner"
                                            currentFile={project.banner}
                                            onChange={field.onChange}
                                            error={errors.banner?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="space-y-8">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                                    <Settings className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-300">
                                    Project Settings
                                </h2>
                            </div>

                            <div className="bg-gradient-to-r p-6 rounded-2xl border  ">
                                <Controller
                                    control={control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-6 pt-8 border-t border-slate-200">
                            <Button
                                type="button"
                                className="px-8 py-3 border border-slate-300 rounded-xl text-slate-300 hover:bg-slate-50 transition-all duration-300 font-medium hover:border-slate-400 hover:shadow-md"
                                onClick={() => reset()}
                                disabled={submitting}
                            >
                                Reset
                            </Button>

                            <Button
                                type="submit"
                                disabled={submitting}
                                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 ${submitting
                                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                    : submitStatus === "success"
                                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                                        : submitStatus === "error"
                                            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                                            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-2xl"
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Updating...</span>
                                    </>
                                ) : submitStatus === "success" ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Updated!</span>
                                    </>
                                ) : submitStatus === "error" ? (
                                    <>
                                        <AlertCircle className="w-5 h-5" />
                                        <span>Error</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Update Project</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
