"use client";

import type React from "react";
import { useLayoutEffect, useState, useRef } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Upload,
  ImageIcon,
  Video,
  Music,
  X,
  Plus,
  Calendar,
  Eye,
  ArrowLeft,
  Loader2,
  Play,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface AllWebsitesResponse {
  id: string;
  name: string;
  domain: string;
  createdAt?: string;
  updatedAt?: string;
}

import { db } from "@/lib/db";
import { AllProjectsResponse } from "@/lib/interfaces/project.interface";

const notificationSchema = z.object({
  website: z.string().min(1, "Please select a website"),
  project: z.string().min(1, "Please select a project"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(300, "Description must be less than 300 characters"),
  icon: z.any().optional(),
  mediaType: z.enum(["none", "image", "video", "audio"]).default("none"),
  mediaFile: z.any().optional(),
  buttons: z
    .array(
      z.object({
        text: z.string().min(1, "Button text is required"),
        action: z.enum(["redirect", "alert", "custom"]),
        value: z.string().min(1, "Action value is required"),
      })
    )
    .max(2, "Maximum 2 buttons allowed"),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  scheduled: z.boolean().default(false),
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  silent: z.boolean().default(false),
  autoRemove: z.boolean().default(false),
});

type NotificationForm = z.infer<typeof notificationSchema>;


interface UploadedFile {
  file: File;
  url: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

export default function CreateNotificationPage() {
  const [selectedButtons, setSelectedButtons] = useState<
    Array<{ text: string; action: string; value: string }>
  >([]);
  const [previewData, setPreviewData] = useState<any>(null);
  const [websites, setWebsites] = useState<AllWebsitesResponse[]>([]);
  const [projects, setProjects] = useState< AllProjectsResponse[]>([]);
  const [iconFile, setIconFile] = useState<UploadedFile | null>(null);
  const [mediaFile, setMediaFile] = useState<UploadedFile | null>(null);

  const iconInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const form = useForm<NotificationForm>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      website: "",
      project: "",
      title: "",
      description: "",
      mediaType: "none",
      buttons: [],
      priority: "normal",
      scheduled: false,
      silent: false,
      autoRemove: false,
    },
  });

  const watchedValues = form.watch();
  const selectedWebsite = websites.find((w) => w.id === watchedValues.website);
  const availableProjects = projects.filter(
    (p) => p.website.id === +watchedValues.website
  );

  // File validation
  const validateFile = (file: File, type: "icon" | "media") => {
    const maxSizes = {
      icon: 100 * 1024, // 100KB
      image: 5 * 1024 * 1024, // 5MB
      video: 50 * 1024 * 1024, // 50MB
      audio: 10 * 1024 * 1024, // 10MB
    };

    const allowedTypes = {
      icon: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      video: ["video/mp4", "video/webm", "video/ogg"],
      audio: [
        "audio/mp3",
        "audio/wav",
        "audio/ogg",
        "audio/m4a",
        "audio/aac",
        "audio/mpeg",
      ],
    };

    if (type === "icon") {
      if (file.size > maxSizes.icon) {
        return "Icon file size must be less than 100KB";
      }
      if (!allowedTypes.icon.includes(file.type)) {
        return "Icon must be an image file (JPEG, PNG, GIF, WebP)";
      }
    } else {
      const mediaType = watchedValues.mediaType;
      if (mediaType === "image") {
        if (file.size > maxSizes.image) {
          return "Image file size must be less than 5MB";
        }
        if (!allowedTypes.image.includes(file.type)) {
          return "Please select a valid image file";
        }
      } else if (mediaType === "video") {
        if (file.size > maxSizes.video) {
          return "Video file size must be less than 50MB";
        }
        if (!allowedTypes.video.includes(file.type)) {
          return "Please select a valid video file";
        }
      } else if (mediaType === "audio") {
        if (file.size > maxSizes.audio) {
          return "Audio file size must be less than 10MB";
        }
        if (!allowedTypes.audio.includes(file.type)) {
          return "Please select a valid audio file";
        }
      }
    }
    return null;
  };

  // Upload file to server
  const uploadFile = async (
    file: File,
    type: "icon" | "media"
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.url;
  };

  // Handle icon file selection
  const handleIconSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file, "icon");
    if (error) {
      toast({
        title: "Invalid file",
        description: error,
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setIconFile({
      file,
      url,
      uploading: false,
      uploaded: false,
    });
  };

  // Handle media file selection
  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file, "media");
    if (error) {
      toast({
        title: "Invalid file",
        description: error,
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setMediaFile({
      file,
      url,
      uploading: false,
      uploaded: false,
    });
  };

  // Upload icon
  const handleIconUpload = async () => {
    if (!iconFile) return;

    setIconFile((prev) =>
      prev ? { ...prev, uploading: true, error: undefined } : null
    );

    try {
      const uploadedUrl = await uploadFile(iconFile.file, "icon");
      setIconFile((prev) =>
        prev
          ? {
            ...prev,
            uploading: false,
            uploaded: true,
            url: uploadedUrl,
          }
          : null
      );
      form.setValue("icon", uploadedUrl);
      toast({
        title: "Success",
        description: "Icon uploaded successfully",
      });
    } catch (error) {
      setIconFile((prev) =>
        prev
          ? {
            ...prev,
            uploading: false,
            error: "Upload failed",
          }
          : null
      );
      toast({
        title: "Upload failed",
        description: "Failed to upload icon. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Upload media
  const handleMediaUpload = async () => {
    if (!mediaFile) return;

    setMediaFile((prev) =>
      prev ? { ...prev, uploading: true, error: undefined } : null
    );

    try {
      const uploadedUrl = await uploadFile(mediaFile.file, "media");
      setMediaFile((prev) =>
        prev
          ? {
            ...prev,
            uploading: false,
            uploaded: true,
            url: uploadedUrl,
          }
          : null
      );
      form.setValue("mediaFile", uploadedUrl);
      toast({
        title: "Success",
        description: "Media uploaded successfully",
      });
    } catch (error) {
      setMediaFile((prev) =>
        prev
          ? {
            ...prev,
            uploading: false,
            error: "Upload failed",
          }
          : null
      );
      toast({
        title: "Upload failed",
        description: "Failed to upload media. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Remove icon
  const removeIcon = () => {
    if (iconFile) {
      URL.revokeObjectURL(iconFile.url);
    }
    setIconFile(null);
    form.setValue("icon", undefined);
    if (iconInputRef.current) {
      iconInputRef.current.value = "";
    }
  };

  // Remove media
  const removeMedia = () => {
    if (mediaFile) {
      URL.revokeObjectURL(mediaFile.url);
    }
    setMediaFile(null);
    form.setValue("mediaFile", undefined);
    if (mediaInputRef.current) {
      mediaInputRef.current.value = "";
    }
  };

  // Get accepted file types for media input
  const getAcceptedTypes = () => {
    switch (watchedValues.mediaType) {
      case "image":
        return "image/jpeg,image/png,image/gif,image/webp";
      case "video":
        return "video/mp4,video/webm,video/ogg";
      case "audio":
        return "audio/mp3,audio/wav,audio/ogg,audio/m4a,audio/aac,audio/mpeg";
      default:
        return "";
    }
  };

  // Clear media when type changes
  const handleMediaTypeChange = (value: string) => {
    if (value === "none" && mediaFile) {
      removeMedia();
    }
    form.setValue("mediaType", value as any);
  };

  const addButton = () => {
    if (selectedButtons.length < 2) {
      setSelectedButtons([
        ...selectedButtons,
        { text: "", action: "redirect", value: "" },
      ]);
    }
  };

  const removeButton = (index: number) => {
    const newButtons = selectedButtons.filter((_, i) => i !== index);
    setSelectedButtons(newButtons);
    form.setValue("buttons", newButtons);
  };

  const updateButton = (index: number, field: string, value: string) => {
    const newButtons = [...selectedButtons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setSelectedButtons(newButtons);
    form.setValue("buttons", newButtons);
  };

  const onSubmit = async (data: NotificationForm) => {
    try {
      // Check if files need to be uploaded
      if (iconFile && !iconFile.uploaded) {
        toast({
          title: "Upload required",
          description: "Please upload the icon before submitting.",
          variant: "destructive",
        });
        return;
      }

      if (mediaFile && !mediaFile.uploaded) {
        toast({
          title: "Upload required",
          description: "Please upload the media file before submitting.",
          variant: "destructive",
        });
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Notification created",
        description: "Your notification has been created successfully.",
      });
      // Redirect to notifications list
      window.location.href = "/notifications";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create notification. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updatePreview = () => {
    const values = form.getValues();
    setPreviewData({
      title: values.title || "Notification Title",
      description:
        values.description || "Notification description will appear here",
      buttons: selectedButtons.filter((b) => b.text.trim() !== ""),
      icon: iconFile?.url || "/placeholder.svg?height=64&width=64",
    });
  };

  useLayoutEffect(() => {
    db.getAllItems("websites").then((response) => {
      if (response.length > 0) {
        setWebsites(response as any);
      }
    });
    db.getAllItems("projects").then((response) => {
      if (response.length > 0) {
        setProjects(response as any);
      }
    })
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex justify-between space-x-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Create Notification
          </h2>
          <p className="text-muted-foreground">
            Create a new push notification for your users
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/u/notifications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notifications
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Configure the basic details of your notification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select website" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {websites.map((website) => (
                                <SelectItem key={website.id} value={website.id}>
                                  {website.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="project"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!watchedValues.website}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select project" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableProjects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter notification title"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updatePreview();
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/100 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter notification description"
                            className="resize-none"
                            rows={3}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              updatePreview();
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/300 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Media & Icon */}
              <Card>
                <CardHeader>
                  <CardTitle>Media & Icon</CardTitle>
                  <CardDescription>
                    Add an icon and optional media to your notification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Icon/Logo</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center overflow-hidden">
                        {iconFile ? (
                          <img
                            src={iconFile.url || "/placeholder.svg"}
                            alt="Icon preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => iconInputRef.current?.click()}
                            disabled={iconFile?.uploading}
                          >
                            {iconFile ? "Change Icon" : "Select Icon"}
                          </Button>
                          {iconFile && !iconFile.uploaded && (
                            <Button
                              size="sm"
                              type="button"
                              onClick={handleIconUpload}
                              disabled={iconFile.uploading}
                            >
                              {iconFile.uploading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                "Upload"
                              )}
                            </Button>
                          )}
                          {iconFile && (
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={removeIcon}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Max 100KB, square preferred (JPEG, PNG, GIF, WebP)
                        </p>
                        {iconFile?.uploaded && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Uploaded successfully
                          </p>
                        )}
                        {iconFile?.error && (
                          <p className="text-xs text-red-600 mt-1">
                            {iconFile.error}
                          </p>
                        )}
                      </div>
                    </div>
                    <input
                      ref={iconInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleIconSelect}
                      className="hidden"
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="mediaType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Type</FormLabel>
                        <Select
                          onValueChange={handleMediaTypeChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No Media</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedValues.mediaType !== "none" && (
                    <div>
                      <Label>Media File</Label>
                      <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                        {mediaFile ? (
                          <div className="space-y-4">
                            {/* File Preview */}
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 border rounded-lg flex items-center justify-center overflow-hidden bg-muted">
                                {watchedValues.mediaType === "image" && (
                                  <img
                                    src={mediaFile.url || "/placeholder.svg"}
                                    alt="Media preview"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                {watchedValues.mediaType === "video" && (
                                  <div className="relative w-full h-full">
                                    <video
                                      src={mediaFile.url}
                                      className="w-full h-full object-cover"
                                    />
                                    <Play className="absolute inset-0 m-auto h-6 w-6 text-white" />
                                  </div>
                                )}
                                {watchedValues.mediaType === "audio" && (
                                  <Volume2 className="h-8 w-8 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {mediaFile.file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(mediaFile.file.size / 1024 / 1024).toFixed(
                                    2
                                  )}{" "}
                                  MB
                                </p>
                                {mediaFile.uploaded && (
                                  <p className="text-xs text-green-600">
                                    ✓ Uploaded successfully
                                  </p>
                                )}
                                {mediaFile.error && (
                                  <p className="text-xs text-red-600">
                                    {mediaFile.error}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => mediaInputRef.current?.click()}
                                disabled={mediaFile.uploading}
                              >
                                Change File
                              </Button>
                              {!mediaFile.uploaded && (
                                <Button
                                  size="sm"
                                  type="button"
                                  onClick={handleMediaUpload}
                                  disabled={mediaFile.uploading}
                                >
                                  {mediaFile.uploading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Uploading...
                                    </>
                                  ) : (
                                    "Upload"
                                  )}
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={removeMedia}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="flex flex-col items-center gap-2">
                              {watchedValues.mediaType === "image" && (
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              )}
                              {watchedValues.mediaType === "video" && (
                                <Video className="h-8 w-8 text-muted-foreground" />
                              )}
                              {watchedValues.mediaType === "audio" && (
                                <Music className="h-8 w-8 text-muted-foreground" />
                              )}
                              <div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  type="button"
                                  onClick={() => mediaInputRef.current?.click()}
                                >
                                  Select {watchedValues.mediaType}
                                </Button>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Drag and drop or click to upload
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {watchedValues.mediaType === "image" &&
                                    "Max 5MB (JPEG, PNG, GIF, WebP)"}
                                  {watchedValues.mediaType === "video" &&
                                    "Max 50MB (MP4, WebM, OGG)"}
                                  {watchedValues.mediaType === "audio" &&
                                    "Max 10MB (MP3, WAV, OGG, M4A)"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        ref={mediaInputRef}
                        type="file"
                        accept={getAcceptedTypes()}
                        onChange={handleMediaSelect}
                        className="hidden"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Action Buttons</CardTitle>
                  <CardDescription>
                    Add up to 2 action buttons to your notification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedButtons.map((button, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <Label>Button {index + 1}</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeButton(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <Label className="text-xs">Button Text</Label>
                          <Input
                            placeholder="Button text"
                            value={button.text}
                            onChange={(e) =>
                              updateButton(index, "text", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Action Type</Label>
                          <Select
                            value={button.action}
                            onValueChange={(value) =>
                              updateButton(index, "action", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="redirect">Redirect</SelectItem>
                              <SelectItem value="alert">Alert</SelectItem>
                              <SelectItem value="custom">Custom JS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">
                            {button.action === "redirect"
                              ? "URL"
                              : button.action === "alert"
                                ? "Message"
                                : "JavaScript"}
                          </Label>
                          <Input
                            placeholder={
                              button.action === "redirect"
                                ? "https://example.com"
                                : button.action === "alert"
                                  ? "Alert message"
                                  : "console.log('clicked')"
                            }
                            value={button.value}
                            onChange={(e) =>
                              updateButton(index, "value", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedButtons.length < 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addButton}
                      className="w-full bg-transparent"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Button
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* UTM Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle>UTM Parameters</CardTitle>
                  <CardDescription>
                    Track your notification performance with UTM parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="utmSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UTM Source</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., newsletter" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="utmMedium"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UTM Medium</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., push" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="utmCampaign"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UTM Campaign</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., spring_sale" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Schedule & Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Schedule & Settings</CardTitle>
                  <CardDescription>
                    Configure when and how your notification will be sent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="scheduled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Schedule Notification
                          </FormLabel>
                          <FormDescription>
                            Send this notification at a specific date and time
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchedValues.scheduled && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="scheduleDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="scheduleTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="silent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Silent Notification
                            </FormLabel>
                            <FormDescription>
                              Send without sound or vibration
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="autoRemove"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Auto Remove
                            </FormLabel>
                            <FormDescription>
                              Automatically remove notification after
                              interaction
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-2">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit">
                  {watchedValues.scheduled
                    ? "Schedule Notification"
                    : "Send Now"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Live Preview
              </CardTitle>
              <CardDescription>
                See how your notification will appear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Desktop Preview */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    DESKTOP
                  </Label>
                  <div className="mt-2 bg-background border rounded-lg p-4 shadow-lg max-w-sm">
                    <div className="flex items-start gap-3">
                      <img
                        src={
                          iconFile?.url || "/placeholder.svg?height=40&width=40"
                        }
                        alt="Icon"
                        className="w-10 h-10 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-1">
                          {watchedValues.title || "Notification Title"}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {watchedValues.description ||
                            "Notification description will appear here"}
                        </div>
                        {selectedWebsite && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {selectedWebsite.domain}
                          </div>
                        )}
                        {selectedButtons.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {selectedButtons.map(
                              (button, index) =>
                                button.text && (
                                  <Button
                                    type="button"
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="h-6 px-2 text-xs bg-transparent"
                                  >
                                    {button.text}
                                  </Button>
                                )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Preview */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">
                    MOBILE
                  </Label>
                  <div className="mt-2 bg-background border rounded-lg p-3 shadow-lg">
                    <div className="flex items-start gap-2">
                      <img
                        src={
                          iconFile?.url || "/placeholder.svg?height=32&width=32"
                        }
                        alt="Icon"
                        className="w-8 h-8 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-1">
                          {watchedValues.title || "Notification Title"}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {watchedValues.description ||
                            "Notification description"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings Summary */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    SETTINGS
                  </Label>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Priority:</span>
                      <Badge variant="outline" className="text-xs">
                        {watchedValues.priority || "normal"}
                      </Badge>
                    </div>
                    {watchedValues.mediaType !== "none" && (
                      <div className="flex items-center justify-between text-xs">
                        <span>Media:</span>
                        <Badge variant="outline" className="text-xs">
                          {watchedValues.mediaType}
                        </Badge>
                      </div>
                    )}
                    {watchedValues.scheduled && (
                      <div className="flex items-center justify-between text-xs">
                        <span>Scheduled:</span>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          Yes
                        </Badge>
                      </div>
                    )}
                    {watchedValues.silent && (
                      <div className="flex items-center justify-between text-xs">
                        <span>Silent:</span>
                        <Badge variant="outline" className="text-xs">
                          Yes
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
