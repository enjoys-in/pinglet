import { Button } from '@/components/ui/button';
import React from 'react'
import { html as beautifyHtml } from "js-beautify";
import { useSandpack } from '@codesandbox/sandpack-react';
import { useTemplateStore } from '@/store/template.store';

const SyncCode = () => {
    const { sandpack } = useSandpack();
    const { selectedCategoryId, activeTab, selectedTemplateId } = useTemplateStore()

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
        cssCode ?
            `<style>
    ${cssCode}
</style>`: "<style></style>"
    );

    // (Optional) Remove <meta> tags (you can comment this line if not needed)
    const sanitizedHtml = replacedLinkWithStyle.replace(
        /<meta\b[^>]*>/gi,
        ""
    );

    return (
        <Button
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow-md hover:from-indigo-700 transition-all duration-200 "

            onClick={async () => {
                const formatted = beautifyHtml(sanitizedHtml, {
                    indent_size: 2,
                    preserve_newlines: true,
                });
                console.log(formatted);
            }}
            type="button"
        >
            Save
        </Button>
    );
}

export default SyncCode