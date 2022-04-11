export declare module Reddit {
    export interface RedditPost {
        data: {
            url: string;
            title: string;
        }
    }

    export interface RedditReponse {
        data: {
            children: RedditPost[]
        }
    }
}
