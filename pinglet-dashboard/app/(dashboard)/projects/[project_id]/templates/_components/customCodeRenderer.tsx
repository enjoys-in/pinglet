"use client"

import { useState, useEffect } from "react"
 
import { cn } from "@/lib/utils"
import { Template } from "@/lib/interfaces/templates.interface"

interface CustomCodeRendererProps {
  template: Template
}

type EditorTab = "html" | "css" | "preview"

export function CustomCodeRenderer({ template }: CustomCodeRendererProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>("html")
  const [htmlCode, setHtmlCode] = useState(
    template.customCode?.html ||
      `<div class="container">
  <h1>Hello World!</h1>
  <p>Start editing to see live preview</p>
  <button class="btn">Click me</button>
</div>`,
  )

  const [cssCode, setCssCode] = useState(
    template.customCode?.css ||
      `.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  color: #2563eb;
  margin-bottom: 1rem;
}

p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.btn {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.btn:hover {
  background: #2563eb;
}`,
  )

  const [previewHtml, setPreviewHtml] = useState("")

  // Update preview when code changes
  useEffect(() => {
    const sanitizedHtml = htmlCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    const fullHtml = `
      <style>${cssCode}</style>
      ${sanitizedHtml}
    `
    setPreviewHtml(fullHtml)
  }, [htmlCode, cssCode])

  const tabs = [
    { id: "html" as EditorTab, label: "HTML", icon: "🏗️" },
    { id: "css" as EditorTab, label: "CSS", icon: "🎨" },
    { id: "preview" as EditorTab, label: "Preview", icon: "👁️" },
  ]

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code)
    // You could add a toast notification here
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{template.name} - Live Code Editor</h2>
        <p className="text-gray-600">Edit HTML and CSS to see live preview (JavaScript disabled for security)</p>
      </div>

      {/* Editor Container */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === tab.id
                  ? "bg-white text-blue-600 border-b-2 border-blue-600 -mb-px"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Editor Content */}
        <div className="relative min-h-[500px]">
          {/* HTML Editor */}
          {activeTab === "html" && (
            <div className="h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <span className="text-sm font-medium text-gray-700">HTML Editor</span>
                <button
                  onClick={() => copyToClipboard(htmlCode, "HTML")}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Copy HTML
                </button>
              </div>
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full h-[450px] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                placeholder="Enter your HTML code here..."
                spellCheck={false}
              />
            </div>
          )}

          {/* CSS Editor */}
          {activeTab === "css" && (
            <div className="h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <span className="text-sm font-medium text-gray-700">CSS Editor</span>
                <button
                  onClick={() => copyToClipboard(cssCode, "CSS")}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Copy CSS
                </button>
              </div>
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="w-full h-[450px] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                placeholder="Enter your CSS code here..."
                spellCheck={false}
              />
            </div>
          )}

          {/* Live Preview */}
          {activeTab === "preview" && (
            <div className="h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <span className="text-sm font-medium text-gray-700">Live Preview</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(htmlCode + "\n\n<style>\n" + cssCode + "\n</style>", "Complete")}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    Copy All
                  </button>
                  <button
                    onClick={() => {
                      setHtmlCode(`<div class="container">
  <h1>Hello World!</h1>
  <p>Start editing to see live preview</p>
  <button class="btn">Click me</button>
</div>`)
                      setCssCode(`.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  color: #2563eb;
  margin-bottom: 1rem;
}

p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.btn {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.btn:hover {
  background: #2563eb;
}`)
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div className="p-4 h-[450px] overflow-auto bg-white">
                <div className="border border-gray-200 rounded-lg min-h-full">
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-full min-h-[400px] border-0 rounded-lg"
                    sandbox="allow-same-origin"
                    title="Live Preview"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Split View Toggle for larger screens */}
      <div className="hidden lg:block">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700">Split View Editor</h3>
          </div>
          <div className="grid grid-cols-2 gap-0 min-h-[400px]">
            {/* Left: Code Editor */}
            <div className="border-r border-gray-200">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("html")}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === "html" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  HTML
                </button>
                <button
                  onClick={() => setActiveTab("css")}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm font-medium transition-colors border-l border-gray-200",
                    activeTab === "css" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  CSS
                </button>
              </div>
              <textarea
                value={activeTab === "html" ? htmlCode : cssCode}
                onChange={(e) => (activeTab === "html" ? setHtmlCode(e.target.value) : setCssCode(e.target.value))}
                className="w-full h-[350px] p-4 font-mono text-sm resize-none focus:outline-none"
                placeholder={`Enter your ${activeTab.toUpperCase()} code here...`}
                spellCheck={false}
              />
            </div>

            {/* Right: Live Preview */}
            <div className="bg-gray-50">
              <div className="p-2 border-b border-gray-200 bg-gray-100">
                <span className="text-xs font-medium text-gray-600">Live Preview</span>
              </div>
              <div className="p-4 h-[350px] overflow-auto">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-full border border-gray-200 rounded bg-white"
                  sandbox="allow-same-origin"
                  title="Split View Preview"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
