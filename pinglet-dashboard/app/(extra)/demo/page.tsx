"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Image, Video, Volume2, FileText, ShieldCheck, Cross, LucideCross, Trash } from "lucide-react";
import { API } from "@/lib/api/handler";
import { __config } from "@/constants/config";
import { DEFAULT_IMAGE } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showToast } from "@/components/brand-toaster/toastContainer";


type BaseButton = {
  text: string;
  action: 'redirect' | 'link' | 'alert' | 'event' | 'reload' | 'close' | 'onClick';
};

type ButtonWithSrc = BaseButton & {
  action: 'redirect' | 'link' | 'alert';
  src: string;
};

type ButtonWithEvent = BaseButton & {
  action: 'event';
  event: string;
  data?: object;
};

type ButtonReloadOrClose = BaseButton & {
  action: 'reload' | 'close';
};

type ButtonOnClick = BaseButton & {
  action: 'onClick';
  onClick: string;
};

type ButtonsData = ButtonWithSrc | ButtonWithEvent | ButtonReloadOrClose | ButtonOnClick;
const actionLabels: Record<ButtonsData['action'], string> = {
  redirect: 'Redirect',
  link: 'Link',
  alert: 'Alert',
  reload: 'Reload',
  close: 'Close',
  event: 'Event',
  onClick: 'onClick',
};
const formSchema = z.object({
  notificationType: z.enum(["0", "2"], { required_error: "Select notification type" }),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  icon: z.string().optional(),
  url: z.string().optional(),
  tag: z.string().optional(),
  mediaType: z.enum(["icon", "logo", "image", "audio", "video", "iframe", "none"], {
    required_error: "Please select a media type"
  }),
  buttons: z.array(
    z.object({
      text: z.string().min(1, "Button text is required"),
      action: z.enum(['redirect', 'link', 'alert', 'event', 'reload', 'close']),
      src: z.string().optional(),
      event: z.string().optional(),
      data: z.any().optional(),
    })
  ).max(3, "Maximum 3 buttons allowed"),
});

export default function ProjectForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notificationType: "0" as const,
      title: "",
      description: "",
      icon: "",
      url: "",
      tag: "",
      mediaType: "icon" as const,
      buttons: []
    },
  });

  const { watch, handleSubmit, reset } = form;
  const { fields: buttonsFields, append, remove } = useFieldArray({ control: form.control, name: "buttons" });

  const selectedMedia = watch("mediaType");
  const selectedType = watch("notificationType");
  const PID =
    __config.APP.APP_ENV == "DEV"
      ? "0e5c2a5f527acdbe13791234"
      : "84d5cbb85cf887d76b55492f";
  const onSubmit = async (data: any) => {
    const isType2 = data.notificationType === "2";

    const payload: any = {
      projectId: PID,
      type: data.notificationType,
      ...(isType2 ? {} : { variant: "default" }),
      ...(isType2 && data.tag ? { tag: data.tag } : {}),
      body: {
        title: data.title || "Hello From Pinglet",
        ...(data.description ? { description: data.description } : {}),
      },
    };

    if (isType2) {
      // Type 2: icon/logo go directly on body, media is image/video/audio/iframe
      if (data.icon) payload.body.icon = data.icon;
      if (data.url) payload.body.url = data.url;

      if (selectedMedia && selectedMedia !== "none" && selectedMedia !== "icon" && selectedMedia !== "logo") {
        const mediaSrcMap: Record<string, string> = {
          image: "https://www.fsbondtec.at/wp-content/themes/financepro/assets/img/noimage_370X270.jpg",
          video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          audio: "http://commondatastorage.googleapis.com/codeskulptor-assets/Evillaugh.ogg",
          iframe: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        };
        payload.body.media = { type: selectedMedia, src: mediaSrcMap[selectedMedia] || mediaSrcMap.image };
      }
    } else {
      // Type 0: original media handling
      switch (selectedMedia) {
        case "icon":
          payload.body.media = { type: "icon", src: DEFAULT_IMAGE };
          break;
        case "logo":
          payload.body.media = { type: "logo", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWAwm5b7x7MIs4curvY6G94PKiyQB8-gBONg&s" };
          break;
        case "image":
          payload.body.media = { type: "image", src: "https://www.fsbondtec.at/wp-content/themes/financepro/assets/img/noimage_370X270.jpg" };
          break;
        case "video":
          payload.body.media = { type: "video", src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" };
          break;
        case "audio":
          payload.body.media = { type: "audio", src: "http://commondatastorage.googleapis.com/codeskulptor-assets/Evillaugh.ogg" };
          break;
        default:
          payload.body.media = { type: "icon", src: "\uD83E\uDD23" };
          break;
      }
    }

    if (data.buttons.length > 0) {
      payload.body.buttons = data.buttons;
    }
    const res = await API.demoNotification(payload);
    showToast({
      title: res.data.message,
      type: "success",
      duration: 5000
    });

  };

  const mediaOptions = selectedType === "2"
    ? [
        { id: "none", label: "None", icon: ShieldCheck },
        { id: "image", label: "Image", icon: Image },
        { id: "video", label: "Video", icon: Video },
        { id: "audio", label: "Audio", icon: Volume2 },
        { id: "iframe", label: "Iframe", icon: FileText },
      ]
    : [
        { id: "icon", label: "Icon", icon: ShieldCheck },
        { id: "logo", label: "Logo", icon: FileText },
        { id: "image", label: "Image", icon: Image },
        { id: "video", label: "Video", icon: Video },
        { id: "audio", label: "Audio", icon: Volume2 },
      ];
  const buttonWatch = watch('buttons')

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full max-w-4xl mx-auto">
          {/* Notification Type Selector */}
          <FormField
            control={form.control}
            name="notificationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notification Type</FormLabel>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {[
                    { id: "0", label: "In-Tab (Type 0)", desc: "Custom styled toast inside open tabs" },
                    { id: "2", label: "Glassmorphism HTML (Type 2)", desc: "Modern glassmorphism card overlay" },
                  ].map((opt) => (
                    <Card
                      key={opt.id}
                      onClick={() => field.onChange(opt.id)}
                      className={`cursor-pointer p-4 border-2 rounded-xl transition-all duration-200 hover:shadow-lg ${
                        field.value === opt.id
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-500/10"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${field.value === opt.id ? "text-purple-700 dark:text-purple-300" : "text-gray-800 dark:text-gray-200"}`}>{opt.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                        </div>
                        {field.value === opt.id && <Check className="w-4 h-4 text-purple-600" />}
                      </div>
                    </Card>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Hello from Pinglet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notification body text..." rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Type 2 extra fields */}
          {selectedType === "2" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://cdn.example.com/icon.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Click-Through URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag (dedup key)</FormLabel>
                    <FormControl>
                      <Input placeholder="optional-dedup-tag" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Button Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Call to Action Buttons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buttonsFields.length > 0 ?
                buttonsFields.map((button, index) => (
                  <div className="mb-4" key={index}>
                    <FormField
                      control={form.control}
                      name={`buttons.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Button Text</FormLabel>
                            <p className="text-sm text-muted-foreground" onClick={() => remove(index)}>
                              <Trash className="h-4 w-4" />
                            </p>
                          </div>
                          <FormControl>
                            <Input placeholder="Button Text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`buttons.${index}.action`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Button Action </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select an action" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="close">Close</SelectItem>
                                <SelectItem value="link">Link</SelectItem>
                                <SelectItem value="redirect">Redirect</SelectItem>
                                <SelectItem value="alert">Alert</SelectItem>
                                <SelectItem value="event">Event</SelectItem>
                                <SelectItem value="reload">Reload</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {['redirect', 'link', 'alert'].includes(buttonWatch[index].action) && (
                      <FormField
                        control={form.control}
                        name={`buttons.${index}.src`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source ({buttonWatch[index].action === "alert" ? "Message" : "URL"})</FormLabel>
                            <FormControl>
                              <Input placeholder={buttonWatch[index].action === "alert" ? "Message" : "URL"} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )) :
                <div>
                  <p className="text-sm text-muted-foreground">No buttons added yet.</p>

                </div>
              }
            </div>
            {buttonsFields.length < 3 && (
              <Button type="button" onClick={() => append({ text: "", action: "close" })} className="mt-4">
                Add More Button
              </Button>
            )}

          </div>

          {/* Media Type Selection */}
          <div>
            <FormField
              control={form.control}
              name="mediaType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media Type</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
                    {mediaOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = field.value === option.id;
                      return (
                        <Card
                          key={option.id}
                          onClick={() => field.onChange(option.id)}
                          className={`cursor-pointer flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-200 hover:shadow-lg ${isSelected ? "border-purple-500 bg-purple-50" : "border-gray-300"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-6 h-6 ${isSelected ? "text-purple-600" : "text-gray-500"}`} />
                            <span
                              className={`text-sm font-medium ${isSelected ? "text-purple-700" : "text-gray-800"
                                }`}
                            >
                              {option.label}
                            </span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                        </Card>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit / Reset Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <Button type="submit" className="w-full md:w-auto">
              Send Notification
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full md:w-auto"
              onClick={() => reset()}
            >
              Reset
            </Button>
          </div>
        </form>

      </Form>
    </div>
  );
}
