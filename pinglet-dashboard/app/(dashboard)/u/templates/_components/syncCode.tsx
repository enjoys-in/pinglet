import { Button } from '@/components/ui/button';
import React from 'react'
import { html as beautifyHtml } from "js-beautify";
import { useSandpack } from '@codesandbox/sandpack-react';
import { Save, Loader2 } from 'lucide-react';
import { useState } from 'react';

const SyncCode = () => {
    const { sandpack } = useSandpack();
    const [isSaving, setIsSaving] = useState(false);

    const htmlCode = sandpack.files["/index.html"]?.code || "";
    const cssCode = sandpack.files["/style.css"]?.code || "";

    // Remove <script> tags
    const withoutScripts = htmlCode.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
    );

    // Replace <link rel="stylesheet" ...> with <style> block
    const replacedLinkWithStyle = withoutScripts.replace(
        /<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi,
        cssCode ? `<style> ${cssCode}</style>` : "<style></style>"
    );

    // (Optional) Remove <meta> tags
    const sanitizedHtml = replacedLinkWithStyle.replace(
        /<meta\b[^>]*>/gi,
        ""
    );

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formatted = beautifyHtml(sanitizedHtml, {
                indent_size: 2,
                preserve_newlines: true,
            });
            sandpack.updateFile("/index.html", formatted);
            console.log(formatted);

            // Simulate save delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Button
            className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 font-medium"
            onClick={handleSave}
            disabled={isSaving}
            type="button"
        >
            {isSaving ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                </>
            ) : (
                <>
                    <Save className="w-4 h-4" />
                    Save Changes
                </>
            )}
        </Button>
    );
}

export default SyncCode