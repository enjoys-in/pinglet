"use client";
import { __config } from "@/constants/config";
import Script from "next/script";
import React from "react";

const PingletWidget = () => {
    const PID =
        __config.APP.APP_ENV == "DEV"
            ? "0e5c2a5f527acdbe13791234"
            : "84d5cbb85cf887d76b55492f";
    const URL =
        __config.APP.APP_ENV == "DEV"
            ? "http://localhost:8888/api/v1/notifications"
            : __config.NOTIFICATIONS_API_URL ||
            "http://pinglet.enjoys.in/api/v1/notifications";

    return (
        <Script
            type="module"
            crossOrigin="anonymous"
            src={__config.CDN_URL}
            data-endpoint={URL}
            data-configured-domain="localhost"
            data-project-id={PID}
            // data-testimonials="false"
            data-templates="1"
            data-pinglet-id="94b00f277a7a8c12a233e39d3e4f5a6b7"
            data-checksum="sha384-bt2+37hfBbS8dxEUfbyk7QYPqeaSU/22+ZdVPh3xC1lMUeTKGl1UPg6wjiW0EkkN"

        />
    );
};

export default PingletWidget;
