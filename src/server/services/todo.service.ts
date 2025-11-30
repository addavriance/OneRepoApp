import {
    ITodoActions, Result,
    TodoBase,
    TodoCreateData,
    TodoCreateResult,
    TodoListResult
} from "../../shared/interfaces";
import {ITodo, IUser, Todo} from "../db";
import {BaseService} from "./base.service";
import {Schema} from "mongoose";

export class TodoService extends BaseService implements ITodoActions {
    constructor(private currentUser: IUser) {
        super(currentUser);
    }

    private async getNextTodoId(): Promise<number> {
        const lastPost = await Todo.findOne()
            .sort({ id: -1 })
            .select('id')
            .lean() as TodoBase;

        return lastPost ? lastPost.id + 1 : 1;
    }
    async createTodo(data: TodoCreateData): Promise<TodoCreateResult> {
        const author = this.currentUser._id as Schema.Types.ObjectId
        const newId = await this.getNextTodoId();

        await Todo.create({
            ...data,
            id: newId,
            author,
        });

        return {
            error: false,
            code: 201,
            data: {...data, id: newId, completed: false} as TodoBase,
        }
    }

    async deleteTodo(id: number): Promise<Result> {
        const result = await Todo.findOneAndDelete({
            id,
            author: this.currentUser._id
        });

        if (!result) {
            return {
                error: true,
                messages: { todo: "Todo not found or you don't have permission to delete it" },
                code: 404
            };
        }

        return {
            error: false,
            messages: { success: "Todo deleted successfully" },
            code: 200
        };
    }

    async getTodos(): Promise<TodoListResult> {
        const result = await Todo.find({author: this.currentUser._id}).exec() as ITodo[];

        const todosData: TodoBase[] = result.map((todoRaw) => {
            return {
                id: todoRaw.id ,
                title: todoRaw.title,
                description: todoRaw.description,
                reminder_time: todoRaw.reminder_time,
                due_date: todoRaw.due_date,
                reminder_interval: todoRaw.reminder_interval,
                createdAt: todoRaw.createdAt,
                updatedAt: todoRaw.updatedAt
            } as TodoBase;
        });

        return {
            error: false,
            code: 200,
            data: todosData,
        };
    }

    async toggleTodo(id: number): Promise<TodoCreateResult> {
        const result = await Todo.findOne({
            id,
            author: this.currentUser._id
        }) as ITodo;

        if (!result) {
            return {
                error: true,
                messages: { todo: "Todo not found or you don't have permission to edit it" },
                code: 404
            };
        }

        result.completed = !result.completed;

        await result.save();

        return {
            error: false,
            code: 200,
            data: {
                id: result.id,
                title: result.title,
                description: result.description,
                completed: result.completed,
                due_date: result.due_date,
                reminder_time: result.reminder_time,
            }
        };
    }
}
