export interface GetFilterSuccess<T> {
    readonly success: true;
    readonly data: T;
}
export interface GetFilterFailed {
    readonly success: false;
    readonly error: ErrorFeedback | ErrorFeedback[];
}

interface ErrorFeedback {
    readonly code: string;
    readonly message: string;
}

export type GetFilterResponse<T = undefined> = GetFilterSuccess<T> | GetFilterFailed;