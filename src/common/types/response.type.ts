export type APIResponse<T> = {
    message: string
    statusCode?: number
    data?: T
    error?: string
}
