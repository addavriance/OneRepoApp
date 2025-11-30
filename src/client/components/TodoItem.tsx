import {Checkbox} from '@/components/ui/checkbox';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Calendar, Clock, Trash2} from 'lucide-react';
import {cn} from '@/lib/utils';
import {TodoBase} from "../../shared/interfaces.ts";

interface TodoItemProps {
    todo: TodoBase;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export const TodoItem = ({todo, onToggle, onDelete}: TodoItemProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed;

    return (
        <Card className={cn(
            "p-4 transition-all",
            todo.completed && "opacity-60 bg-gray-50"
        )}>
            <div className="flex items-start gap-3">
                <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => onToggle(todo.id)}
                    className="mt-1"
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className={cn(
                                "font-medium text-sm",
                                todo.completed && "line-through text-gray-500"
                            )}>
                                {todo.title}
                            </h3>

                            {todo.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {todo.description}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                                {todo.due_date && (
                                    <div className={cn(
                                        "flex items-center gap-1",
                                        isOverdue && "text-red-500 font-medium"
                                    )}>
                                        <Calendar className="w-3 h-3"/>
                                        {formatDate(todo.due_date)}
                                        {isOverdue && " (Overdue)"}
                                    </div>
                                )}

                                {todo.reminder_time && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3"/>
                                        {formatTime(todo.reminder_time)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(todo.id)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                        >
                            <Trash2 className="w-4 h-4"/>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
