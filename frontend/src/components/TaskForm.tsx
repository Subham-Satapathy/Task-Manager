// src/components/Dashboard/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';

interface TaskFormProps {
    onAddTask: (task: any) => void;
    onUpdateTask: (task: any) => void;
    selectedTask?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, onUpdateTask, selectedTask }) => {
    const [taskName, setTaskName] = useState('');
    const [taskPriority, setTaskPriority] = useState('Medium');

    useEffect(() => {
        if (selectedTask) {
            setTaskName(selectedTask.name);
            setTaskPriority(selectedTask.priority);
        }
    }, [selectedTask]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTask) {
            onUpdateTask({ ...selectedTask, name: taskName, priority: taskPriority });
        } else {
            onAddTask({ id: Date.now(), name: taskName, priority: taskPriority });
        }
        setTaskName('');
        setTaskPriority('Medium');
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Task Name"
                variant="outlined"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                fullWidth
                required
            />
            <TextField
                label="Priority"
                variant="outlined"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                fullWidth
                select
                SelectProps={{
                    native: true,
                }}
            >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </TextField>
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                {selectedTask ? 'Update Task' : 'Add Task'}
            </Button>
        </form>
    );
};

export default TaskForm;
