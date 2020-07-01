interface DeepAIResponse {
    output: string;
    id: string;
    err?: string;
}

declare module 'deepai' {
    export function setApiKey(key: string): void;
    export function callStandardApi(text: string, params: any): DeepAIResponse;
}
