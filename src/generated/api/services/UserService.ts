/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Login
     * @param requestBody
     * @returns any Login successful. Use `auth_token` for HTTP `Authorization Bearer` header
     * @throws ApiError
     */
    public static postLogin(
        requestBody: {
            username: string;
            password: string;
        },
    ): CancelablePromise<{
        auth_token: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden. User does not exist with the provided credentials`,
            },
        });
    }
    /**
     * Create user. Only admin can do it
     * @param requestBody
     * @returns any A new user created
     * @throws ApiError
     */
    public static postUsers(
        requestBody: {
            username: string;
            password: string;
        },
    ): CancelablePromise<{
        id: string;
        username: string;
        /**
         * Date
         */
        created_at: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
}
