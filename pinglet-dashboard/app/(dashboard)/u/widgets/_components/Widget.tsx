import { DEFAULT_IMAGE } from '@/lib/utils'
import React from 'react'

interface WidgetProps {
    text: string, description?: string, buttonText?: string,
    link?: string,
    imagePreview?: string | null
    videoUrl?: string
}
const WidgetPreview = ({ text, description, buttonText, link, imagePreview, videoUrl }: WidgetProps) => {

    return (
        <div
            id="text-widget-preview"
            style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                width: 200,
                height: "auto",
                minHeight: 50,
                padding: "1.25rem",
                border: "1px solid rgb(226, 232, 240)",
                borderRadius: "0.75rem",
                backgroundColor: "white",
                boxShadow:
                    "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
                overflow: "auto",
                zIndex: 9999
            }}
        >
            <button
                style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 24,
                    height: 24,
                    border: "none",
                    borderRadius: "50%",
                    backgroundColor: "rgb(243, 244, 246)",
                    color: "rgb(75, 85, 99)",
                    fontSize: 18,
                    lineHeight: 1,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    transition: "background-color 0.2s"
                }}
            >
                ×
            </button>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    height: "100%"
                }}
            >
                <img
                    src={imagePreview || DEFAULT_IMAGE}
                    style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: "0.5rem"
                    }}
                />
                <div>
                    {text && <p
                        style={{
                            margin: "0 0 4px 0",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "rgb(31, 41, 55)",
                            lineHeight: "1.4"
                        }}
                    >
                        {text}
                    </p>}

                    {
                        description && <p
                            style={{
                                margin: "0 0 4px 0",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                color: "rgb(31, 41, 55)",
                                lineHeight: "1.4"
                            }}
                        >
                            {description}
                        </p>
                    }
                </div>
                <a
                    href={link}
                    target="_blank"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        padding: "0.375rem 0.75rem",
                        backgroundColor: "rgb(0, 0, 0)",
                        borderRadius: "0.375rem",
                        transition: "0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.15rem",
                        textAlign: "left",
                        width: "fit-content"
                    }}
                >
                    {buttonText}
                </a>
            </div>
        </div>

    )
}

export default WidgetPreview