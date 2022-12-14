import { TodosAccess } from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import {parseUserId} from "../auth/utils";
import {TodoUpdate} from "../models/TodoUpdate";

// TODO: Implement businessLogic
// Done
const uuidv4 = require('uuid/v4');
const toDoAccess = new TodosAccess();

export async function getAllTodo(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.getAllTodo(userId);
}
export function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const userId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    
    return toDoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}
export function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.updateTodo(updateTodoRequest, todoId, userId);
}
export function deleteTodo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.deleteTodo(todoId, userId);
}
export function generateUploadUrl(todoId: string): Promise<string> {
    return toDoAccess.generateUploadUrl(todoId);
}