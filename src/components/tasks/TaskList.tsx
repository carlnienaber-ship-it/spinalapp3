import React from 'react';
import { Task } from '../../types';
import TaskItem from './TaskItem';

type TaskListProps = {
  title: string;
  tasks: Task[];
  onTaskChange: (updatedTask: Task) => void;
  disabled?: boolean;
};

const TaskList: React.FC<TaskListProps> = ({ title, tasks, onTaskChange, disabled = false }) => {
  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-2xl font-bold text-gray-50 mb-6">{title}</h2>
      <div className="space-y-6">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onChange={onTaskChange} disabled={disabled} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;