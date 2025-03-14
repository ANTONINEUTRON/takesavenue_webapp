
export interface Vote{
    id: string;
    userId: string;
    takeId: string;
    agree: boolean;
    content?: string;
    contenttype?: string;
}