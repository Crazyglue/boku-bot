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
        user: string;
        ts: string;
        team: string;
        edited: Edited;
        blocks: Block[];
        channel: string;
        event_ts: string;
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

    export interface SlackPostAttachment {
        title?: string;
        image_url?: string;
        blocks?: Block[];
    }
}

