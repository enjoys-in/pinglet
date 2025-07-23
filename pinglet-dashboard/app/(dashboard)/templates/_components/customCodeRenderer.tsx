"use client"

import { TemplateResponse } from "@/lib/interfaces/templates.interface"

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
// import { highlightActiveLine, highlightSpecialChars } from "@codemirror/view";
import { autocompletion, closeBrackets } from "@codemirror/autocomplete";

import { indentWithTab, defaultKeymap } from "@codemirror/commands";
import {
  keymap, highlightActiveLine, highlightSpecialChars,
  highlightActiveLineGutter,
  highlightTrailingWhitespace,
  gutters,
  lineNumbers,
  EditorView,
  tooltips,
  rectangularSelection
} from "@codemirror/view";
import SyncCode from "./syncCode";


const customAutocompleteTheme = EditorView.theme({
  ".cm-tooltip-autocomplete": {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    border: "1px solid #444",
  },
  ".cm-tooltip-autocomplete .cm-completionLabel": {
    color: "#fff"
  },
  ".cm-tooltip-autocomplete .cm-completionMatchedText": {
    color: "#6cf"
  }
});
interface CustomCodeRendererProps {
  template: TemplateResponse
}


export function CustomCodeRenderer({ template }: CustomCodeRendererProps) {
  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code)

  }

  return (
    <SandpackProvider
      template="vanilla"
      theme="dark"

      files={{
        "/index.html": {
          code: template.raw_text?.html || `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
     <div class="pinglet">

   <!-- Add your custom HTML here, DO NOT REMOVE THE '.pinglet' DIV -->

 
    </div>
  </body>
</html>
`,
        },
        "/style.css": {
          code: template.raw_text?.css || `.pinglet {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f7fa;
            padding: 2rem;
            line-height: 1.5;
        }
          /* Add your custom CSS here, DO NOT REMOVE THE '.pinglet' CLASS */
`,
        },

        "/index.js": { code: "", hidden: true },
      }}
      customSetup={{
        entry: "/index.html",
      }}
    >
      <div className="space-y-6">

        <div className="bg-white dark:bg-gray-800 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {/* Editor Content */}
          <div className="relative min-h-[500px]">
            <div className="h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 dark:bg-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">HTML Editor</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(template.raw_text?.html, "HTML")}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Copy HTML
                  </button>
                  <SyncCode />
                </div>
              </div>

              <SandpackLayout>
                <SandpackCodeEditor
                  showTabs
                  extensions={[
                    highlightActiveLine(),
                    highlightSpecialChars(),
                    autocompletion(),
                    closeBrackets(),
                    keymap.of([indentWithTab]),
                    keymap.of([...defaultKeymap]),
                    html(),
                    css(),
                    customAutocompleteTheme,
                    highlightActiveLineGutter(),
                    highlightTrailingWhitespace(),
                    lineNumbers(),
                    gutters(),
                    tooltips(),
                    rectangularSelection()
                  ]
                  }
                  showInlineErrors
                  showLineNumbers
                  wrapContent
                  readOnly
                  showReadOnly

                  style={{ height: 600 }}
                />
                <SandpackPreview style={{ height: 600 }} />
              </SandpackLayout>
            </div>
          </div>
        </div>
      </div>
    </SandpackProvider>
  )
}
