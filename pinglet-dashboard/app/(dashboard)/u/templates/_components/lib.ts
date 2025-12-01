export const sanitizeHtml = (
    htmlCode: string,
    cssCode: string, // Add cssCode as a required parameter
    {
        mergeStyleTags = true,
        removeScripts = true,
        removeMetaTags = true,
        removeLinkTags = true,
    }: {
        mergeStyleTags?: boolean;
        removeScripts?: boolean;
        removeMetaTags?: boolean;
        removeLinkTags?: boolean;
    }
) => {
    let processedHtml = htmlCode;
    let collectedStyles: string[] = [];

    // 1. Remove <script> tags if removeScripts is true
    if (removeScripts) {
        processedHtml = processedHtml.replace(
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            ""
        );
    }

    // 2. Handle <style> tags and collect their content if mergeStyleTags is true
    if (mergeStyleTags) {
        processedHtml = processedHtml.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, p1) => {
            collectedStyles.push(p1);
            return ""; // Remove original style tag
        });
    }

    // 3. Handle <link rel="stylesheet"> tags
    if (removeLinkTags || mergeStyleTags) {
        // If merging, we collect and then remove. If just removing, we remove.
        // For simplicity, we assume `cssCode` from Sandpack is the main external style source.
        // If actual external linked stylesheets were to be merged, they'd require fetching.
        processedHtml = processedHtml.replace(/<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi, "");
    }

    // Add the provided cssCode to collected styles if merging
    if (mergeStyleTags && cssCode) {
        collectedStyles.push(cssCode);
    } else if (!mergeStyleTags && cssCode) {
        // If not merging but cssCode is provided, insert it as a new style block (e.g., at the head)
        if (processedHtml.includes('<head>')) {
            processedHtml = processedHtml.replace(/<head>/i, `<head><style>${cssCode}</style>`);
        } else {
            // If no head, prepend a head with style
            processedHtml = `<head><style>${cssCode}</style></head>${processedHtml}`;
        }
    }


    // 4. Insert merged styles if any
    if (mergeStyleTags && collectedStyles.length > 0) {
        const mergedStyleBlock = `<style>${collectedStyles.join('\n')}</style>`;
        if (processedHtml.includes('<head>')) {
            processedHtml = processedHtml.replace(/<head>/i, `<head>${mergedStyleBlock}`);
        } else if (processedHtml.includes('<body>')) {
            processedHtml = processedHtml.replace(/<body>/i, `<head>${mergedStyleBlock}</head><body>`);
        } else {
            processedHtml = `<head>${mergedStyleBlock}</head>${processedHtml}`;
        }
    }

    // 5. Remove <meta> tags if removeMetaTags is true
    if (removeMetaTags) {
        processedHtml = processedHtml.replace(/<meta\b[^>]*>/gi, "");
    }

    return processedHtml;
};