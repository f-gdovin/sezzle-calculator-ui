import axios from 'axios';
import { ApiErrorSeverity, IApiError, ICalculationRequest, ICalculationResult } from '../types/Api';
import { ApiResponse } from '../state/types';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 2000
});

class ApiError implements IApiError {
    severity: ApiErrorSeverity;
    error: string;

    constructor(severity: ApiErrorSeverity, error: string) {
        this.severity = severity;
        this.error = error;
    }
}

export const evaluate = async (request: ICalculationRequest): Promise<ApiResponse> => {
    return await instance.post<ICalculationResult>(`/calculate`, request)
        .then(res => res.data)
        .then(body => body as ICalculationResult)
        .catch(error => {
            const errorResponse = error.response;
            const severity = errorResponse.status < 500 ? ApiErrorSeverity.LOW : ApiErrorSeverity.HIGH;
            return new ApiError(severity, errorResponse.data.error)
        });
}