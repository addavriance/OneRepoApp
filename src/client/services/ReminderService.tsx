import {TodoBase} from "../../shared/interfaces.ts";
import {toast} from "@/hooks/use-toast.ts";

interface ReminderState {
    lastReminderTime: number;
    reminderCount: number;
}

class ReminderService {
    private checkInterval: NodeJS.Timeout | null = null;
    private checkedReminders = new Set<string>();
    private reminderStates = new Map<string, ReminderState>();
    private isRunning = false;
    private todos: TodoBase[] = [];

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.checkInterval = setInterval(() => {
            this.checkReminders();
        }, 10000);

        this.checkReminders();
    }

    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval as number);
            this.checkInterval = null;
        }
        this.isRunning = false;
        this.checkedReminders.clear();
        this.reminderStates.clear();
    }

    private async checkReminders() {
        try {
            const todos = this.getCurrentTodos();
            const now = new Date();

            todos.forEach(todo => {
                this.checkTodoForReminder(todo, now);
            });

        } catch (error) {
            console.error('Error checking reminders:', error);
        }
    }

    setCurrentTodos(todos: TodoBase[]) {
        this.todos = [...todos];
        this.clearCheckedReminders();
        this.cleanupReminderStates();
    }

    private getCurrentTodos(): TodoBase[] {
        return this.todos;
    }

    private cleanupReminderStates() {
        const currentTodoIds = new Set(this.todos.map(todo => todo.id));
        for (const todoId of this.reminderStates.keys()) {
            if (!currentTodoIds.has(Number(todoId))) {
                this.reminderStates.delete(todoId);
            }
        }
    }

    private checkTodoForReminder(todo: TodoBase, now: Date) {
        if (todo.completed) return;
        if (!todo.reminder_time || !todo.due_date) return;

        const reminderKey = `${todo.id}-${todo.reminder_time}`;
        const reminderDateTime = this.getReminderDateTime(todo.due_date, todo.reminder_time);
        if (!reminderDateTime) return;

        const timeDiff = reminderDateTime.getTime() - now.getTime();
        const twoMinutes = 2 * 60 * 1000;

        if (timeDiff >= 0 && timeDiff <= twoMinutes) {
            if (!this.checkedReminders.has(reminderKey)) {
                this.showReminder(todo, false);
                this.checkedReminders.add(reminderKey);

                if (todo.reminder_interval && todo.reminder_interval > 0) {
                    this.reminderStates.set(String(todo.id), {
                        lastReminderTime: now.getTime(),
                        reminderCount: 1
                    });
                }
            }
        }

        this.checkRepeatedReminders(todo, now);
    }

    private checkRepeatedReminders(todo: TodoBase, now: Date) {
        if (!todo.reminder_interval || todo.reminder_interval <= 0) return;

        const reminderState = this.reminderStates.get(String(todo.id));
        if (!reminderState) return;

        const intervalMs = todo.reminder_interval * 60 * 1000; // конвертируем минуты в миллисекунды
        const timeSinceLastReminder = now.getTime() - reminderState.lastReminderTime;

        if (timeSinceLastReminder >= intervalMs) {
            this.showReminder(todo, true);

            // Обновляем состояние
            this.reminderStates.set(String(todo.id), {
                lastReminderTime: now.getTime(),
                reminderCount: reminderState.reminderCount + 1
            });
        }
    }

    private getReminderDateTime(dueDate: string, reminderTime: string): Date | null {
        try {
            const datePart = dueDate.split('T')[0];
            return new Date(`${datePart}T${reminderTime}`);
        } catch {
            return null;
        }
    }

    private showReminder(todo: TodoBase, isRepeated: boolean) {
        const reminderState = this.reminderStates.get(String(todo.id));
        const countText = isRepeated && reminderState ? ` (${reminderState.reminderCount})` : '';

        toast({
            title: isRepeated ? 'Reminder Again!' : 'Reminder!',
            description: `${todo.title}${todo.due_date ? ` is due soon!` : ''}${countText}`,
            duration: 5000,
        });

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(isRepeated ? 'Todo Reminder Again' : 'Todo Reminder', {
                body: `${todo.title}${todo.due_date ? ' is due soon!' : ''}${countText}`,
            });
        }
    }

    async requestNotificationPermission() {
        if (!('Notification' in window)) return false;

        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return Notification.permission === 'granted';
    }

    clearCheckedReminders() {
        this.checkedReminders.clear();
        this.reminderStates.clear();
    }

    stopRepeatedReminders(todoId: string) {
        this.reminderStates.delete(todoId);
    }

    getReminderState(todoId: string): ReminderState | undefined {
        return this.reminderStates.get(todoId);
    }
}

export const reminderService = new ReminderService();
