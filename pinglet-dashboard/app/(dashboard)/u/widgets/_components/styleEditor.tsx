"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface StyleFormData {
  // Container styles
  containerBottom: number
  containerRight: number
  containerWidth: number
  containerMinHeight: number
  containerPadding: string
  containerBorder: string
  containerBorderRadius: string
  containerBackgroundColor: string
  containerBoxShadow: string

  // Text styles
  textMargin: string
  textFontSize: string
  textFontWeight: number
  textColor: string
  textLineHeight: string

  // Button styles
  buttonColor: string
  buttonTextDecoration: string
  buttonFontWeight: number
  buttonFontSize: string
  buttonPadding: string
  buttonBackgroundColor: string
  buttonBorderRadius: string
  buttonTransition: string
  buttonDisplay: string
  buttonAlignItems: string
  buttonGap: string
  buttonTextAlign: string
  buttonWidth: string
}

const defaultValues: StyleFormData = {
  // Container defaults
  containerBottom: 20,
  containerRight: 20,
  containerWidth: 200,
  containerMinHeight: 50,
  containerPadding: "1.25rem",
  containerBorder: "1px solid rgb(226, 232, 240)",
  containerBorderRadius: "0.75rem",
  containerBackgroundColor: "white",
  containerBoxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",

  // Text defaults
  textMargin: "0 0 4px 0",
  textFontSize: "0.875rem",
  textFontWeight: 600,
  textColor: "rgb(31, 41, 55)",
  textLineHeight: "1.4",

  // Button defaults
  buttonColor: "white",
  buttonTextDecoration: "none",
  buttonFontWeight: 500,
  buttonFontSize: "0.75rem",
  buttonPadding: "0.375rem 0.75rem",
  buttonBackgroundColor: "rgb(0, 0, 0)",
  buttonBorderRadius: "0.375rem",
  buttonTransition: "0.2s",
  buttonDisplay: "flex",
  buttonAlignItems: "center",
  buttonGap: "0.15rem",
  buttonTextAlign: "left",
  buttonWidth: "fit-content",
}

export default function StyleEditorForm() {
  const [previewStyles, setPreviewStyles] = useState(defaultValues)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<StyleFormData>({
    defaultValues,
  })

  const watchedValues = watch()

  const onSubmit = (data: StyleFormData) => {
    setPreviewStyles(data)
    console.log("Updated styles:", data)
  }

  const handleReset = () => {
    reset(defaultValues)
    setPreviewStyles(defaultValues)
  }

  // Convert form data to CSS styles for preview
  const getContainerStyles = () => ({
    position: "fixed" as const,
    bottom: previewStyles.containerBottom,
    right: previewStyles.containerRight,
    width: previewStyles.containerWidth,
    minHeight: previewStyles.containerMinHeight,
    padding: previewStyles.containerPadding,
    border: previewStyles.containerBorder,
    borderRadius: previewStyles.containerBorderRadius,
    backgroundColor: previewStyles.containerBackgroundColor,
    boxShadow: previewStyles.containerBoxShadow,
    height: "auto",
  })

  const getTextStyles = () => ({
    margin: previewStyles.textMargin,
    fontSize: previewStyles.textFontSize,
    fontWeight: previewStyles.textFontWeight,
    color: previewStyles.textColor,
    lineHeight: previewStyles.textLineHeight,
  })

  const getButtonStyles = () => ({
    color: previewStyles.buttonColor,
    textDecoration: previewStyles.buttonTextDecoration,
    fontWeight: previewStyles.buttonFontWeight,
    fontSize: previewStyles.buttonFontSize,
    padding: previewStyles.buttonPadding,
    backgroundColor: previewStyles.buttonBackgroundColor,
    borderRadius: previewStyles.buttonBorderRadius,
    transition: previewStyles.buttonTransition,
    display: previewStyles.buttonDisplay,
    alignItems: previewStyles.buttonAlignItems,
    gap: previewStyles.buttonGap,
    textAlign: previewStyles.buttonTextAlign as any,
    width: previewStyles.buttonWidth,
    border: "none",
    cursor: "pointer",
  })

  return (
    <div className="">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">         
          <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
              <Card>
                <CardHeader>
                  <CardTitle>Container Styles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="containerBottom">Bottom (px)</Label>
                      <Input
                        id="containerBottom"
                        type="number"
                        {...register("containerBottom", { valueAsNumber: true })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="containerRight">Right (px)</Label>
                      <Input
                        id="containerRight"
                        type="number"
                        {...register("containerRight", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="containerWidth">Width (px)</Label>
                      <Input
                        id="containerWidth"
                        type="number"
                        {...register("containerWidth", { valueAsNumber: true })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="containerMinHeight">Min Height (px)</Label>
                      <Input
                        id="containerMinHeight"
                        type="number"
                        {...register("containerMinHeight", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="containerPadding">Padding</Label>
                    <Input id="containerPadding" {...register("containerPadding")} placeholder="1.25rem" />
                  </div>

                  <div>
                    <Label htmlFor="containerBorder">Border</Label>
                    <Input
                      id="containerBorder"
                      {...register("containerBorder")}
                      placeholder="1px solid rgb(226, 232, 240)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="containerBorderRadius">Border Radius</Label>
                      <Input id="containerBorderRadius" {...register("containerBorderRadius")} placeholder="0.75rem" />
                    </div>
                    <div>
                      <Label htmlFor="containerBackgroundColor">Background Color</Label>
                      <Input
                        id="containerBackgroundColor"
                        {...register("containerBackgroundColor")}
                        placeholder="white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="containerBoxShadow">Box Shadow</Label>
                    <Input
                      id="containerBoxShadow"
                      {...register("containerBoxShadow")}
                      placeholder="rgba(0, 0, 0, 0.1) 0px 4px 6px -1px..."
                    />
                  </div>
                </CardContent>
              </Card>

              
              <Card>
                <CardHeader>
                  <CardTitle>Text Styles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="textMargin">Margin</Label>
                    <Input id="textMargin" {...register("textMargin")} placeholder="0 0 4px 0" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="textFontSize">Font Size</Label>
                      <Input id="textFontSize" {...register("textFontSize")} placeholder="0.875rem" />
                    </div>
                    <div>
                      <Label htmlFor="textFontWeight">Font Weight</Label>
                      <Input
                        id="textFontWeight"
                        type="number"
                        {...register("textFontWeight", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="textColor">Color</Label>
                      <Input id="textColor" {...register("textColor")} placeholder="rgb(31, 41, 55)" />
                    </div>
                    <div>
                      <Label htmlFor="textLineHeight">Line Height</Label>
                      <Input id="textLineHeight" {...register("textLineHeight")} placeholder="1.4" />
                    </div>
                  </div>
                </CardContent>
              </Card>

            
              <Card>
                <CardHeader>
                  <CardTitle>Button Styles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="buttonColor">Text Color</Label>
                      <Input id="buttonColor" {...register("buttonColor")} placeholder="white" />
                    </div>
                    <div>
                      <Label htmlFor="buttonBackgroundColor">Background Color</Label>
                      <Input
                        id="buttonBackgroundColor"
                        {...register("buttonBackgroundColor")}
                        placeholder="rgb(0, 0, 0)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="buttonFontSize">Font Size</Label>
                      <Input id="buttonFontSize" {...register("buttonFontSize")} placeholder="0.75rem" />
                    </div>
                    <div>
                      <Label htmlFor="buttonFontWeight">Font Weight</Label>
                      <Input
                        id="buttonFontWeight"
                        type="number"
                        {...register("buttonFontWeight", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="buttonPadding">Padding</Label>
                      <Input id="buttonPadding" {...register("buttonPadding")} placeholder="0.375rem 0.75rem" />
                    </div>
                    <div>
                      <Label htmlFor="buttonBorderRadius">Border Radius</Label>
                      <Input id="buttonBorderRadius" {...register("buttonBorderRadius")} placeholder="0.375rem" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="buttonGap">Gap</Label>
                      <Input id="buttonGap" {...register("buttonGap")} placeholder="0.15rem" />
                    </div>
                    <div>
                      <Label htmlFor="buttonTransition">Transition</Label>
                      <Input id="buttonTransition" {...register("buttonTransition")} placeholder="0.2s" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="buttonDisplay">Display</Label>
                      <Input id="buttonDisplay" {...register("buttonDisplay")} placeholder="flex" />
                    </div>
                    <div>
                      <Label htmlFor="buttonAlignItems">Align Items</Label>
                      <Input id="buttonAlignItems" {...register("buttonAlignItems")} placeholder="center" />
                    </div>
                    <div>
                      <Label htmlFor="buttonTextAlign">Text Align</Label>
                      <Input id="buttonTextAlign" {...register("buttonTextAlign")} placeholder="left" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="buttonWidth">Width</Label>
                    <Input id="buttonWidth" {...register("buttonWidth")} placeholder="fit-content" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Apply Styles
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset to Default
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
