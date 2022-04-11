declare module 'deepai' {
    export function setApiKey(key: string): void;
    export function callStandardApi(text: string, params: any): any;
}
