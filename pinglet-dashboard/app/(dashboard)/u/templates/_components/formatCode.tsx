import { Button } from '@/components/ui/button';
import React from 'react'
import { html as beautifyHtml, css_beautify, js_beautify } from "js-beautify";
import { useSandpack } from '@codesandbox/sandpack-react';
import { Save, Loader2 } from 'lucide-react';
import { useState } from 'react';

const FormatCode = () => {
    const { sandpack } = useSandpack();
    const [isSaving, setIsSaving] = useState(false);

    const htmlCode = sandpack.files["/index.html"]?.code || "";
    const cssCode = sandpack.files["/style.css"]?.code || "";
    const jsCode = sandpack.files["/index.js"]?.code || "";


    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formatted = beautifyHtml(htmlCode, {
                indent_size: 2,
                preserve_newlines: true,
            });
            sandpack.updateFile("/index.html", formatted);
            sandpack.updateFile("/style.css", css_beautify(cssCode, {
                indent_size: 2,
                preserve_newlines: true,
            }));
            sandpack.updateFile("/index.js", js_beautify(jsCode, {
                indent_size: 2,
                preserve_newlines: true,
            }));


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
                    Formatting...
                </>
            ) : (
                <>
                    <Save className="w-4 h-4" />
                    Format
                </>
            )}
        </Button>
    );
}

export default FormatCode