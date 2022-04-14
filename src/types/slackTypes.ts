import { AppMentionEvent } from '@slack/bolt';
import { Callback } from 'aws-lambda'

export interface SlackEventHandler {
    (event: SlackAPI.SlackEventPayload, callback: Callback): void;
}

export declare module SlackAPI {
    export interface Edited {
        user: string;
        ts: string;
        type: string;
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
        event: AppMentionEvent;
        type: string;
        event_id: string;
        event_time: number;
        authed_users: string[];
        challenge?: string;
    }

    export interface SlackPost {
        attachments?: SlackPostAttachment[];
        blocks?: Block[];
        text: string;
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

    export interface Team {
        id: string;
        domain: string;
    }

    export interface Channel {
        id: string;
        name: string;
    }

    export interface User {
        id: string;
        name: string;
    }

    export interface Icons {
        [key: string]: string;
    }

    export interface BotProfile {
        id: string;
        deleted: boolean;
        name: string;
        updated: number;
        app_id: string;
        icons: Icons;
        team_id: string;
    }

    export interface Action {
        id?: string;
        name: string;
        text: string;
        type: "button"|"select";
        value: string;
        style?: "danger"|"default"|"primary";
    }

    export interface Attachment {
        fallback?: string;
        image_url?: string;
        image_width?: number;
        image_height?: number;
        image_bytes?: number;
        title?: string;
        id?: number;
        callback_id?: string;
        text: string;
        color?: string;
        actions?: Action[];
    }

    export interface OriginalMessage {
        bot_id: string;
        type: string;
        text: string;
        user: string;
        ts: string;
        team: string;
        bot_profile: BotProfile;
        attachments: Attachment[];
    }

    export interface ActionEvent {
        type: string;
        actions: Action[];
        callback_id: string;
        team: Team;
        channel: Channel;
        user: User;
        action_ts: string;
        message_ts: string;
        attachment_id: string;
        token: string;
        is_app_unfurl: boolean;
        original_message: OriginalMessage;
        response_url: string;
        trigger_id: string;
    }
}

