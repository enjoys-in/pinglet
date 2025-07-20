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
    <div class="container">
      <h1>Hello World!</h1>
      <p>Start editing to see live preview</p>
      <button class="btn">Click me</button>
    </div>
  </body>
</html>
`,
        },
        "/style.css": {
          code: template.raw_text?.css || `/* Add your custom CSS here */`,
        },

        "/index.js": { code: "", hidden: true },
      }}
      customSetup={{
        entry: "/index.html",
      }}
    >
      <div className="space-y-6">
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {/* Editor Content */}
          <div className="relative min-h-[500px]">
            <div className="h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <span className="text-sm font-medium text-gray-700">HTML Editor</span>

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
