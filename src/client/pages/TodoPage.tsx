import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Bell, BellOff, Loader2} from "lucide-react";
import {ReactNode, useEffect, useState} from "react";
import {CreateTodoForm} from "@/components/CreateTodoForm.tsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {TodoItem} from "@/components/TodoItem.tsx";
import {TodoBase, TodoCreateData} from "../../shared/interfaces.ts";
import {reminderService} from "@/services/ReminderService.tsx";
import {api} from "@/api";
import Dodo from "../../../assets/dodo.svg?react";

export const TodoPage = () => {
    const [todos, setTodos] = useState<TodoBase[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        loadTodos();
        setupReminders();

        return () => {
            reminderService.stop();
        };
    }, []);

    useEffect(() => {
        reminderService.setCurrentTodos(todos);
    }, [todos]);

    const loadTodos = async () => {
        try {
            setLoading(true);
            const todosData = await api.getTodos();
            setTodos(todosData.data!);
            reminderService.clearCheckedReminders();
        } catch (error) {
            console.error('Failed to load todos:', error);
        } finally {
            setLoading(false);
        }
    };

    const setupReminders = async () => {
        reminderService.start();
        setNotificationsEnabled(true);

        await reminderService.requestNotificationPermission();
    };

    const toggleNotifications = () => {
        if (notificationsEnabled) {
            reminderService.stop();
            setNotificationsEnabled(false);
        } else {
            reminderService.start();
            setNotificationsEnabled(true);
        }
    };

    const handleCreateTodo = async (todoData: TodoCreateData) => {
        try {
            const result = await api.createTodo(todoData);
            const newTodo = result.data;
            setTodos(prev => [newTodo!, ...prev]);
            reminderService.clearCheckedReminders();
            return true;
        } catch (error) {
            console.error('Failed to create todo:', error);
            return false; // propagate unsuccessful attempt
        }
    };

    const handleToggleTodo = async (id: number) => {
        try {
            const result = await api.toggleTodo(id);
            const updatedTodo = result.data;

            setTodos(prev => prev.map(todo =>
                todo.id === id ? updatedTodo! : todo
            ));
        } catch (error) {
            console.error('Failed to toggle todo:', error);
        }
    };

    const handleDeleteTodo = async (id: number) => {
        try {
            await api.deleteTodo(id);
            setTodos(prev => prev.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    const filteredTodos = todos.filter(todo => {
        switch (activeTab) {
            case 'active':
                return !todo.completed;
            case 'completed':
                return todo.completed;
            default:
                return true;
        }
    });

    const upcomingReminders = todos.filter(todo =>
        !todo.completed && todo.reminder_time && todo.due_date
    ).length;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>My Tasks</CardTitle>
                                    <CardDescription>
                                        Create and manage your todos with reminders
                                    </CardDescription>
                                </div>
                                <Button
                                    variant={notificationsEnabled ? "default" : "outline" as "default" | "outline"}
                                    size="sm"
                                    onClick={toggleNotifications}
                                    className="flex items-center gap-2"
                                >
                                    {notificationsEnabled ? (
                                        <>
                                            <Bell className="w-4 h-4"/>
                                            {upcomingReminders > 0 && (
                                                <span
                                                    className="bg-green-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                            {upcomingReminders}
                                        </span>
                                            )}
                                        </>
                                    ) as ReactNode : (
                                        <BellOff className="w-4 h-4"/>
                                    ) as ReactNode}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CreateTodoForm onSubmit={handleCreateTodo}/>
                        </CardContent>
                    </Card>

                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin"/>
                        </div>
                    ) || (
                        <Card>
                            <CardHeader>
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="all">
                                            All ({todos.length})
                                        </TabsTrigger>
                                        <TabsTrigger value="active">
                                            Active ({todos.filter(t => !t.completed).length})
                                        </TabsTrigger>
                                        <TabsTrigger value="completed">
                                            Completed ({todos.filter(t => t.completed).length})
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {filteredTodos.length === 0 ? (
                                        <>
                                            {(Math.random()<0.1) ? (
                                                <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                                                    No dodos found
                                                    <Dodo width="70px" className="opacity-60"/>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    No todos found
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        filteredTodos.map(todo => (
                                            <TodoItem
                                                key={todo.id}
                                                todo={todo}
                                                onToggle={handleToggleTodo}
                                                onDelete={handleDeleteTodo}
                                            />
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
