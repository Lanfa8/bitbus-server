export declare module PaginationTypes {
    
    export type Pagination = {
        page: number;
        pageSize: number;
    };

    export type PaginationResponse<T> = {
        data: T[];
        total: number;
    };
}