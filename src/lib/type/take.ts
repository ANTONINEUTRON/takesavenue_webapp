export type TakeStatus = 'active' | 'expired' | 'completed' | 'pending';

export interface Take {
    id: string;
    userId: String;
    title: string;
    contenttype: string; //video, image, text
    punishment: string;
    content: string;
    responder: string;
    agrees?: number;
    disagrees?: number;
    duration: number; // in milliseconds
    likes?: number;
    shares?: number;
    status: TakeStatus;
    created_at: Date;
    expired_at: Date;
}