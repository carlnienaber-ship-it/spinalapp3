import React from 'react';
import { Task } from '../../types';
import Toggle from '../ui/Toggle';

type TaskItemProps = {
  task: Task;
  onChange: (updatedTask: Task) => void;
  disabled?: boolean;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onChange, disabled = false }) => {
  const renderTaskControl = () => {
    switch (task.type) {
      case 'toggle':
        return (
          // The Toggle component doesn't have a native disabled prop, so we handle it with CSS and pointer-events
          <div className={disabled ? 'cursor-not-allowed' : ''}>
             <Toggle
              id={task.id}
              label={task.text}
              checked={task.completed}
              onChange={(checked) => !disabled && onChange({ ...task, completed: checked })}
            />
          </div>
        );
      case 'radio':
      case 'radio_text':
        return (
          <div>
            <p className="text-gray-300 mb-2">{task.text}</p>
            <div className="flex gap-4">
              {task.options?.map((option) => (
                <label key={option} className={`flex items-center space-x-2 text-gray-300 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input
                    type="radio"
                    name={task.id}
                    value={option}
                    checked={task.value === option}
                    onChange={(e) => onChange({ ...task, value: e.target.value, completed: true })}
                    disabled={disabled}
                    className="form-radio h-5 w-5 text-emerald-500 bg-gray-700 border-gray-500 focus:ring-emerald-500 disabled:opacity-50"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {task.type === 'radio_text' && task.value === 'Other' && (
              <textarea
                placeholder="Please specify..."
                value={task.notes || ''}
                onChange={(e) => onChange({ ...task, notes: e.target.value })}
                disabled={disabled}
                className="mt-3 block w-full rounded-md bg-gray-900 border-gray-600 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              />
            )}
          </div>
        );
      case 'toggle_text':
        return (
          <div>
            <div className={disabled ? 'cursor-not-allowed' : ''}>
              <Toggle
                id={task.id}
                label={task.text}
                checked={task.completed}
                onChange={(checked) => !disabled && onChange({ ...task, completed: checked })}
              />
            </div>
            {task.completed && (
              <textarea
                placeholder="Add notes..."
                value={task.notes || ''}
                onChange={(e) => onChange({ ...task, notes: e.target.value })}
                disabled={disabled}
                className="mt-3 block w-full rounded-md bg-gray-900 border-gray-600 px-3 py-2 text-gray-50 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              />
            )}
          </div>
        );
      default:
        return <p>Unsupported task type: {task.type}</p>;
    }
  };

  return <div className="border-b border-gray-700 pb-4 last:border-b-0">{renderTaskControl()}</div>;
};

export default TaskItem;