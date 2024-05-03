/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTodoItemDto } from '../models/CreateTodoItemDto';
import type { TodoItem } from '../models/TodoItem';
import type { UpdateTodoItemDto } from '../models/UpdateTodoItemDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TodoService {
    /**
     * Returns a list of todo items
     * @param offset Default value is 0
     * @param limit Default value is 10
     * @returns any A JSON array of todo items
     * @throws ApiError
     */
    public static getTodos(
        offset?: number,
        limit?: number,
    ): CancelablePromise<{
        items: Array<TodoItem>;
        /**
         * Default value is 0
         */
        offset?: number;
        /**
         * Default value is 10
         */
        limit?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/todos',
            query: {
                'offset': offset,
                'limit': limit,
            },
            errors: {
                401: `Unauthorized. Token expired`,
            },
        });
    }
    /**
     * Create a new todo item
     * @param requestBody
     * @returns TodoItem A new JSON todo item
     * @throws ApiError
     */
    public static postTodos(
        requestBody: CreateTodoItemDto,
    ): CancelablePromise<TodoItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/todos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized. Token expired`,
            },
        });
    }
    /**
     * Returns a todo item
     * @param id
     * @returns TodoItem A JSON todo item
     * @throws ApiError
     */
    public static getTodos1(
        id: string,
    ): CancelablePromise<TodoItem> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/todos/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized. Token expired`,
                404: `Not found`,
            },
        });
    }
    /**
     * Update a todo item
     * @param id
     * @param requestBody
     * @returns TodoItem A JSON todo item
     * @throws ApiError
     */
    public static patchTodos(
        id: string,
        requestBody: UpdateTodoItemDto,
    ): CancelablePromise<TodoItem> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/todos/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized. Token expired`,
                404: `Not found`,
            },
        });
    }
    /**
     * Delete a todo item
     * @param id
     * @returns any Deleted
     * @throws ApiError
     */
    public static deleteTodos(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/todos/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized. Token expired`,
                404: `Not found`,
            },
        });
    }
}
