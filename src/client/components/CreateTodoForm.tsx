import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Calendar, Clock, Hourglass} from 'lucide-react';
import {TodoCreateData} from "../../shared/interfaces.ts";

interface CreateTodoFormProps {
    onSubmit: (todoData: TodoCreateData) => Promise<boolean>;
}

export const CreateTodoForm = ({onSubmit}: CreateTodoFormProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [reminderInterval, setReminderInterval] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            const success = await onSubmit({
                title: title.trim(),
                description: description.trim() || undefined,
                due_date: dueDate || undefined,
                reminder_time: reminderTime || undefined,
                reminder_interval: parseInt(reminderInterval) || undefined,
            } as TodoCreateData);

            if (success) {
                setTitle('');
                setDescription('');
                setDueDate('');
                setReminderTime('');
                setReminderInterval('');
            }
        } catch (error) {
            console.error('Failed to create todo:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details..."
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dueDate" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4"/>
                        Due Date
                    </Label>
                    <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="reminderTime" className="flex items-center gap-2">
                        <Clock className="w-4 h-4"/>
                        Reminder Time
                    </Label>
                    <Input
                        id="reminderTime"
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reminderInterval" className="flex items-center gap-2 w-20">
                        <Hourglass className="w-4 h-4"/>
                        Interval
                    </Label>
                    <Input
                        id="reminderInterval"
                        type="number"
                        min="1"
                        max="10"
                        value={reminderInterval}
                        className="w-20"
                        onChange={(e) => setReminderInterval(e.target.value)}
                    />
                </div>
            </div>

            <Button type="submit" size="sm" variant="outline" disabled={isSubmitting || !title.trim()}>
                {isSubmitting ? 'Creating...' : 'Add Task'}
            </Button>
        </form>
    );
};
