import { Callback } from 'aws-lambda'

export interface SlackEventHandler {
    (event: SlackAPI.SlackEventPayload, callback: Callback): void;
}

export declare module SlackAPI {
    export interface Edited {
        user: string;
        ts: string;
    }

    export interface Element {
        type: string;
        user_id: string;
        text: string;
        elements: Element[];
    }

    export interface Block {
        type: string;
        block_id?: string;
        elements?: Element[];
        text?: {
            type: string;
            text: string;
        }
    }

    export interface Event {
        client_msg_id: string;
        type: string;
        text: string;
        user: {
            id: string;
            name: string;
        };
        ts: string;
        team: string;
        edited: Edited;
        blocks: Block[];
        channel: string;
        event_ts: string;
        callback_id?: string;
        trigger_id?: string;
        actions?: Action[];
        original_message?: Event;
        attachments?: SlackPostAttachment[];
    }

    export interface SlackEventPayload {
        token: string;
        team_id: string;
        api_app_id: string;
        event: Event;
        type: string;
        event_id: string;
        event_time: number;
        authed_users: string[];
        challenge?: string;
    }

    export interface SlackPost {
        attachments?: SlackPostAttachment[];
        blocks?: Block[];
        text?: string;
    }

    export interface Action {
        name: string;
        text: string;
        type: string;
        value: string;
    }

    export interface SlackPostAttachment {
        title?: string;
        image_url?: string;
        blocks?: Block[];
        fallback?: string;
        callback_id?: string;
        color?: string;
        attachment_type?: string;
        actions?: Action[];
    }
}

