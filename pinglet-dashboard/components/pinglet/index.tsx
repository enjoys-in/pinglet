"use client"
import { __config } from '@/constants/config'
import Script from 'next/script'
import React from 'react'

const PingletWidget = () => {
    const PID=__config.APP.APP_ENV==   "DEV" ?"0e5c2a5f527acdbe13791234":"84d5cbb85cf887d76b55492f"
    return  <Script
            type="module"
            strategy="beforeInteractive"
            src="https://cdn.jsdelivr.net/npm/@enjoys/pinglet@1.0.3/v0.0.2/pinglet-sse.js"
            data-endpoint="http://pinglet.enjoys.in/api/v1/notifications"
            data-configured-domain="localhost"
            data-project-id={PID}
            data-pinglet-id="94b00f277a7a8c12a233e39d3e4f5a6b7"
            data-checksum="sha384-Y7YXYX2j5YloeGIEAei75Q6PcXH+o/A93sGoo8u3SxeGjMUbmR+JqizhPOPKfiy3"
            data-load-templates="true"
    />
}

export default PingletWidget
