"use client"
import Script from 'next/script'
import React from 'react'

const PingletWidget = () => {
    return <Script
        type="module"
        src="https://cdn.jsdelivr.net/npm/@enjoys/pinglet/v0.0.2/pinglet-sse.js"
        data-endpoint="http://pinglet.enjoys.in/api/v1/notifications"
        data-configured-domain="localhost"
        data-project-id="0e5c2a5f527acdbe1379"
        data-pinglet-id="94b00f277a7a8c12a233e39d3e4f5a6b7"
        data-checksum="sha384-Y7YXYX2j5YloeGIEAei75Q6PcXH+o/A93sGoo8u3SxeGjMUbmR+JqizhPOPKfiy3"
        data-load-templates="true"
    ></Script>
}

export default PingletWidget