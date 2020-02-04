export declare module ImageFlip {
    export interface ImageFlipMemeTemplate {
        name: string;
        id: string;
        box_count: number;
        url: string;
        width: number;
        height: number;
    }

    export interface ImageFlipResponse {
        success: boolean;
        data: {
            url: string;
        }
    }

    export interface ImageFlipCreateParams {
        template_id: string;
        username: string;
        password: string;
        text0?: string;
        text1?: string;
    }

    export interface ImageFlipBox {
        [key: string]: string;
    }
}
