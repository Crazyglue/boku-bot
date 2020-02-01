import { Callback } from 'aws-lambda'

export interface SlackEventHandler {
    (event: SlackEvents.Event, callback: Callback): void;
}

// export interface SlackEvent {
//     type: string;
//     event: any;
//     authed_users: String[];
// }

export declare module SlackEvents {

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
        block_id: string;
        elements: Element[];
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
    }

}

