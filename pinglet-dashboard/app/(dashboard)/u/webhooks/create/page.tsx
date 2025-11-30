"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility for class merging
import { ChevronDown, X } from "lucide-react";

import { useRouter } from "next/navigation"; // Assuming Next.js for navigation
import { useToast } from "@/hooks/use-toast";
import { API } from "@/lib/api/handler";
import { eventTriggers } from "../data";

// Define your event triggers

// Define your form schema
const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z.string().optional(),
    eventTrigger: z.array(z.string()).min(1, { message: "Please select at least one event trigger." }),
    triggerType: z.enum(["api", "telegram", "discord"]),
    url: z.string().url(),

})

export default function CreateWebhookPage() {
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            eventTrigger: [],
            triggerType: "api",
            url: "",

        },
    });

    const watchedTriggerType = form.watch("triggerType");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { data } = await API.createWebhook(values);
            if (data.success) {
                toast({
                    title: "Webhook created successfully",
                    description: "Your webhook has been created.",
                });
                router.push("/u/webhooks");
            } else {
                toast({
                    title: "Error creating webhook",
                    description: data.message,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error creating webhook",
                description: error.message || "Something went wrong",
                variant: "destructive",
            });
        }
    }
    return (
        <main className="container mx-auto py-8">
            <div className="mx-auto max-w-[500px] space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Add New Webhook</h1>
                    <p className="text-muted-foreground">Create a new webhook to integrate with external services.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter webhook name" {...field} />
                                    </FormControl>
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
                                        <Textarea placeholder="Describe what this webhook does" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="eventTrigger"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Trigger</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between h-auto min-h-10", // Added h-auto and min-h-10 for dynamic height
                                                        !field.value.length && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value.length > 0
                                                        ? (
                                                            <div className="flex flex-wrap gap-1 pr-2 py-1"> {/* Removed max-h and overflow, added py-1 for padding */}
                                                                {field.value.map((triggerValue) => {
                                                                    const trigger = eventTriggers.find((t) => t.value === triggerValue);
                                                                    return (
                                                                        <Badge key={triggerValue} variant="secondary" className="flex items-center gap-1">
                                                                            {trigger?.label}
                                                                            <X
                                                                                className="h-3 w-3 cursor-pointer"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    field.onChange(field.value.filter((val) => val !== triggerValue));
                                                                                }}
                                                                            />
                                                                        </Badge>
                                                                    );
                                                                })}
                                                            </div>
                                                        )
                                                        : "Select event triggers..."}
                                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search event trigger..." />
                                                <CommandList>
                                                    <CommandEmpty>No event trigger found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {eventTriggers.map((trigger) => (
                                                            <CommandItem
                                                                key={trigger.value}
                                                                onSelect={() => {
                                                                    if (field.value.includes(trigger.value)) {
                                                                        field.onChange(field.value.filter((val) => val !== trigger.value));
                                                                    } else {
                                                                        field.onChange([...field.value, trigger.value]);
                                                                    }
                                                                }}
                                                            >
                                                                <Checkbox
                                                                    checked={field.value.includes(trigger.value)}
                                                                    onCheckedChange={() => {
                                                                        if (field.value.includes(trigger.value)) {
                                                                            field.onChange(field.value.filter((val) => val !== trigger.value));
                                                                        } else {
                                                                            field.onChange([...field.value, trigger.value]);
                                                                        }
                                                                    }}
                                                                    className="mr-2"
                                                                />
                                                                {trigger.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="triggerType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trigger Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select trigger type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="api">REST URL</SelectItem>
                                            {/* <SelectItem value="telegram">Telegram Bot</SelectItem>
                                            <SelectItem value="discord">Discord Webhook</SelectItem> */}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {watchedTriggerType === "api" && (
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Webhook URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/webhook" {...field} />
                                        </FormControl>
                                        <FormDescription>The URL where POST requests will be sent</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}


                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Webhook</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    );
}