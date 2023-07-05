export interface SuccessResponse {
  data: Record<string, unknown>;
}

export interface ErrorResponse {
  error: {
    code: number;
    name: string;
    message: string;
  };
}

export type Response = SuccessResponse | ErrorResponse;
