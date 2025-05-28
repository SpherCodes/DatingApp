export interface Visit {
    id: number;
    visitorId: number;
    visitedId: number;
    visitDate: Date;
    visitorKnownAs: string;
    visitorPhotoUrl?: string;
}