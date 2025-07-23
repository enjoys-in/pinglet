declare function re(n: any): string;
declare namespace ue {
    export { ce as load };
    export { oe as hashComponents };
    export { re as componentsToDebugString };
}
declare function M(): any;
declare function z(): () => any;
declare function oe(e: any): string;
declare function G(): boolean;
declare function S(): boolean;
declare function F(): boolean;
declare function C(): boolean;
declare function Y(): boolean;
declare function W(): boolean;
declare function x(): boolean;
declare function ce(e: any): any;
declare function V(e: any, r: any, o: any): () => any;
declare function le(e: any, n: any): string;
declare function ae(e: any): Promise<any>;
declare namespace ne {
    function fonts(): any;
    function domBlockers(e: any): any;
    function fontPreferences(): any;
    function audio(): -2 | -1 | (() => any);
    function screenFrame(): () => any;
    function osCpu(): any;
    function languages(): any[];
    function colorDepth(): number;
    function deviceMemory(): any;
    function screenResolution(): any[];
    function hardwareConcurrency(): any;
    function timezone(): string;
    function sessionStorage(): boolean;
    function localStorage(): boolean;
    function indexedDB(): true | undefined;
    function openDatabase(): boolean;
    function cpuClass(): any;
    function platform(): string;
    function plugins(): {
        name: string;
        description: string;
        mimeTypes: {
            type: string;
            suffixes: string;
        }[];
    }[] | undefined;
    function canvas(): {
        winding: boolean;
        geometry: any;
        text: any;
    };
    function touchSupport(): {
        maxTouchPoints: number;
        touchEvent: boolean;
        touchStart: boolean;
    };
    function vendor(): string;
    function vendorFlavors(): string[];
    function cookiesEnabled(): boolean;
    function colorGamut(): string | undefined;
    function invertedColors(): boolean | undefined;
    function forcedColors(): boolean | undefined;
    function monochrome(): number | undefined;
    function contrast(): 0 | 1 | 10 | -1 | undefined;
    function reducedMotion(): boolean | undefined;
    function hdr(): boolean | undefined;
    function math(): {
        acos: number;
        acosh: number;
        acoshPf: number;
        asin: number;
        asinh: number;
        asinhPf: number;
        atanh: number;
        atanhPf: number;
        atan: number;
        sin: number;
        sinh: number;
        sinhPf: number;
        cos: number;
        cosh: number;
        coshPf: number;
        tan: number;
        tanh: number;
        tanhPf: number;
        exp: number;
        expm1: number;
        expm1Pf: number;
        log1p: number;
        log1pPf: number;
        powPI: number;
    };
    function videoCard(): {
        vendor: any;
        renderer: any;
    } | undefined;
    function pdfViewerEnabled(): boolean;
    function architecture(): number;
}
declare function Z(e: any, n: any): (n: any) => any;
declare function X(e: any, r: any, a: any): any;
export { re as componentsToDebugString, ue as default, M as getFullscreenElement, z as getScreenFrame, oe as hashComponents, G as isAndroid, S as isChromium, F as isDesktopSafari, C as isEdgeHTML, Y as isGecko, W as isTrident, x as isWebKit, ce as load, V as loadSources, le as murmurX64Hash128, ae as prepareForSources, ne as sources, Z as transformSource, X as withIframe };
