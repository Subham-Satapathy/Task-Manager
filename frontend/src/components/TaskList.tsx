// src/components/Dashboard/TaskList.tsx
import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface TaskListProps {
    tasks: any[];
    onDeleteTask: (taskId: number) => void;
    onUpdateTask: (task: any) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDeleteTask, onUpdateTask }) => {
    return (
        <>
            {tasks.map((task) => (
                <Card key={task.id} style={{ margin: '10px 0' }}>
                    <CardContent>
                        <Typography variant="h6">{task.name}</Typography>
                        <Typography variant="subtitle1">Priority: {task.priority}</Typography>
                        <IconButton onClick={() => onUpdateTask(task)}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={() => onDeleteTask(task.id)}>
                            <Delete />
                        </IconButton>
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

export default TaskList;
