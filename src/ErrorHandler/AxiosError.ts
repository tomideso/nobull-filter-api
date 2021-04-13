import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// AxiosError - is a plain object :/
export class AxiosException<T = any> extends Error implements AxiosError {
    config: AxiosRequestConfig;
    code?: string;
    request?: any;
    response?: AxiosResponse<T>;
    isAxiosError: boolean;

    constructor(error: Partial<AxiosError>) {
        const responseMessage: string = error.response && error.response.data ? `Response: ${JSON.stringify(error.response.data)}` : '';
        const errorMessage: string = responseMessage ? `${error.message} ${responseMessage}` : error.message || '';

        super(errorMessage);

        Object.assign(this, error);
        this.message = errorMessage;

        this.name = error.constructor.name;
        this.code = error.code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AxiosException);
        }
    }

   public toJSON(){
        return this.response.config
    }
}