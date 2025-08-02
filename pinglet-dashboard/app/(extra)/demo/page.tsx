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
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  mediaType: z.enum(["icon", "logo", "image", "audio", "video"], {
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
  ).max(2, "Maximum 2 buttons allowed"),
});

export default function ProjectForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      mediaType: "icon",
      buttons: []
    },
  });

  const { watch, handleSubmit, reset } = form;
  const { fields: buttonsFields, append, remove } = useFieldArray({ control: form.control, name: "buttons" });

  const selectedMedia = watch("mediaType");
  const PID =
    __config.APP.APP_ENV == "DEV"
      ? "0e5c2a5f527acdbe13791234"
      : "84d5cbb85cf887d76b55492f";
  const onSubmit = async (data: any) => {

    const payload: any = {
      "projectId": PID,
      "variant": "default",
      "type": "0",
      "body": {
        "title": data.title || "Hello From Pinglet",
        "description": data.description || "This is Demo Version of Pinglet, New Design are upcoming!",
      },
    }
    switch (selectedMedia) {
      case "icon":
        payload.body["media"] = {
          "type": "icon",
          "src": DEFAULT_IMAGE
        }
        break;
      case "logo":
        payload.body["media"] = {
          "type": "logo",
          "src": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWAwm5b7x7MIs4curvY6G94PKiyQB8-gBONg&s"
        }
        break;
      case "image":
        payload.body["media"] = {
          "type": "image",
          "src": "https://www.fsbondtec.at/wp-content/themes/financepro/assets/img/noimage_370X270.jpg"
        }
        break;
      case "video":
        payload.body["media"] = {
          "type": "video",
          "src": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
        break;
      case "audio":
        payload.body["media"] = {
          "type": "audio",
          "src": "http://commondatastorage.googleapis.com/codeskulptor-assets/Evillaugh.ogg"
        }
        break;
      default:
        payload.body["media"] = {
          "type": "icon",
          "src": "🤣"
        }
        break;
    }

    if (data.buttons.length > 0) {

      payload.body["buttons"] = data.buttons

    }
    const res = await API.demoNotification(payload);
    showToast({
      title: res.data.message,
      type: "success",
      duration: 5000
    });

  };

  const mediaOptions = [
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
          {/* Title & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My Amazing Project" {...field} />
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
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us more about your project..." rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
            {buttonsFields.length < 2 && (
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
