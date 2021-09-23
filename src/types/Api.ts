export const hasResult = (_: any): _ is ICalculationResult =>
    (_ as ICalculationResult).result !== undefined;

export interface ICalculationRequest {
    input: string;
}

export interface ICalculationResult {
    result: number;
}

export interface IApiError {
    severity: ApiErrorSeverity;
    error: string;
}

export enum ApiErrorSeverity {
    LOW,
    HIGH
}