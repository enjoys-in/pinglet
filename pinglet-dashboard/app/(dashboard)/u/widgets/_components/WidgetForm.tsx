"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Upload, Link, Image, Video, X } from 'lucide-react';
import WidgetPreview from './Widget';
import StyleEditorForm from './styleEditor';
import { API } from '@/lib/api/handler';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    text: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
    description: z.string().optional().or(z.literal('')),
    buttonText: z.string().optional().or(z.literal('Click Here')),
    link: z.string().url('Please enter a valid URL'),
    mediaType: z.enum(['image', 'video'], {
        required_error: 'Please select either image or video',
    }),
    imageSource: z.enum(['upload', 'url']).optional(),
    imageFile: z.any().optional(),
    imageUrl: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
    videoUrl: z.string().url('Please enter a valid video URL').optional().or(z.literal('')),
}).refine((data) => {
    if (data.mediaType === 'image') {
        if (data.imageSource === 'upload') {
            return data.imageFile !== undefined && data.imageFile !== null;
        } else if (data.imageSource === 'url') {
            return data.imageUrl && data.imageUrl.length > 0;
        }
        return false;
    } else if (data.mediaType === 'video') {
        return data.videoUrl && data.videoUrl.length > 0;
    }
    return true;
}, {
    message: 'Please provide the required media content',
    path: ['mediaType'],
});

type FormData = z.infer<typeof formSchema>;

export function WidgetForm({ data }: { data?: FormData }) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const router = useRouter()
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: '',
            description: '',
            buttonText: 'Click Here',
            link: '',
            mediaType: 'image',
            imageSource: 'upload',
            imageUrl: '',
            videoUrl: '',
        },
    });

    const watchMediaType = form.watch('mediaType');
    const watchImageSource = form.watch('imageSource');
    const watchImageUrl = form.watch('imageUrl');

    const handleImageUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            form.setValue('imageFile', file);
            form.clearErrors('mediaType');
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        form.setValue('imageFile', null);
        form.setValue('imageUrl', '');
    };

    React.useEffect(() => {
        if (watchImageSource === 'url' && watchImageUrl) {
            setImagePreview(watchImageUrl);
            form.clearErrors('mediaType');
        }
    }, [watchImageUrl, watchImageSource, form]);

    React.useEffect(() => {
        if (watchMediaType === 'video') {
            setImagePreview(null);
            form.setValue('imageFile', null);
            form.setValue('imageUrl', '');
        }
    }, [watchMediaType, form]);
    React.useEffect(() => {
        if (data) {
            form.reset(data);
        }
    }, [data, form]);
    const onSubmit = async (input: FormData) => {
        try {
            if (input.mediaType === 'image') {
                if (input.imageSource === 'upload' && input.imageFile) {
                    input.imageUrl = imagePreview as string
                }
            }

            const { data } = await API.createWidget(input)
            if (!data.success) {
                throw new Error(data.message || 'Failed to create widget');
            }
            toast.success('Widget created successfully!');

            form.reset();
            setImagePreview(null);
            setDragActive(false);
            router.push('/u/widgets')
        } catch (error) {
            toast.error((error as Error).message || 'Something went wrong');
            return;
        }

    };

    return (
        <div className="flex lg:flex-row gap-4 py-8 px-4 sm:flex-col ">
            <div className="w-1/2 border-zinc-800/30">
                <Card className="shadow-xl backdrop-blur-sm">
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Title Field */}
                                <FormField
                                    control={form.control}
                                    name="text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-200 font-medium">Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your content title..."
                                                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description Field */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-200 font-medium">Description  (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe your content in detail..."
                                                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 min-h-[100px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='flex flex-col justify-between gap-4'>
                                    <FormField
                                        control={form.control}
                                        name="buttonText"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-200 font-medium flex items-center gap-2">

                                                    Button Text
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Click here"
                                                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="link"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-200 font-medium flex items-center gap-2">
                                                    <Link className="w-4 h-4" />
                                                    Link
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="https://example.com"
                                                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>


                                {/* Media Type Selection */}
                                <FormField
                                    control={form.control}
                                    name="mediaType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-200 font-medium">Media Type</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-row space-x-6"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="image" id="image" />
                                                        <Label htmlFor="image" className="flex items-center gap-2 cursor-pointer">
                                                            <Image className="w-4 h-4 text-green-600" />
                                                            Image
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="video" id="video" disabled />
                                                        <Label htmlFor="video" className="flex items-center gap-2 cursor-pointer">
                                                            <Video className="w-4 h-4 text-purple-600" />
                                                            Video
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Image Section */}
                                {watchMediaType === 'image' && (
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="imageSource"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-200 font-medium">Image Source</FormLabel>
                                                    <FormControl>
                                                        <Tabs
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            className="w-full"
                                                        >
                                                            <TabsList className="grid w-full grid-cols-2">
                                                                <TabsTrigger value="upload">Upload File</TabsTrigger>
                                                                <TabsTrigger value="url">Image URL</TabsTrigger>
                                                            </TabsList>
                                                            <TabsContent value="upload" className="mt-4 flex flex-col justify-between">

                                                                {imagePreview ? (
                                                                    <div className="relative">
                                                                        <Label className="text-slate-200 font-medium mb-2 block">Image Preview</Label>
                                                                        <div className="relative rounded-lg overflow-hidden border border-slate-200">
                                                                            <img
                                                                                src={imagePreview}
                                                                                alt="Preview"
                                                                                className="w-full h-48 object-cover"
                                                                            />
                                                                            <Button
                                                                                type="button"
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                className="absolute top-2 right-2 p-1 h-8 w-8"
                                                                                onClick={removeImage}
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ) :
                                                                    <div
                                                                        className={`border-2  border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                                                            ? 'border-blue-500 bg-blue-50'
                                                                            : 'border-slate-300 hover:border-slate-400'
                                                                            }`}
                                                                        onDragEnter={handleDrag}
                                                                        onDragLeave={handleDrag}
                                                                        onDragOver={handleDrag}
                                                                        onDrop={handleDrop}
                                                                    >
                                                                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                                                        <p className="text-slate-600 mb-4">
                                                                            Drag and drop an image here, or click to select
                                                                        </p>
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            onChange={(e) => {
                                                                                const file = e.target.files?.[0];
                                                                                if (file) handleImageUpload(file);
                                                                            }}
                                                                            className="hidden"
                                                                            id="image-upload"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            onClick={() => document.getElementById('image-upload')?.click()}
                                                                            className="border-slate-300 hover:border-slate-400"
                                                                        >
                                                                            Choose File
                                                                        </Button>
                                                                    </div>}
                                                            </TabsContent>
                                                            <TabsContent value="url" className="mt-4">
                                                                <FormField
                                                                    control={form.control}
                                                                    name="imageUrl"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormControl>
                                                                                <Input
                                                                                    placeholder="https://example.com/image.jpg"
                                                                                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                                                                    {...field}
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </TabsContent>
                                                        </Tabs>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {/* Image Preview */}

                                    </div>
                                )}

                                {/* Video Section */}
                                {watchMediaType === 'video' && (
                                    <FormField
                                        control={form.control}
                                        name="videoUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium flex items-center gap-2">
                                                    <Video className="w-4 h-4 text-purple-600" />
                                                    Video URL
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="https://youtube.com/watch?v=..."
                                                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                >
                                    Create Widget
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            <div className="w-1/2 border-zinc-800/30 ">
                <div className=" first-letter:">
                    <Label className="text-slate-200 font-medium mb-2 block">Style Editor</Label>
                    {/* <StyleEditorForm  /> */}
                    <WidgetPreview
                        text={form.getValues('text')}
                        description={form.getValues('description')}
                        buttonText={form.getValues('buttonText')}
                        link={form.getValues('link')}
                        imagePreview={imagePreview}
                        videoUrl={form.getValues('videoUrl')}
                    />
                </div>
            </div>
        </div>
    );
}