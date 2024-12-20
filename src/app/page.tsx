'use client';

import { useState, useEffect } from 'react';
import { Task } from '../types';
import { useRouter } from 'next/navigation';
import './globals.css';

const COLORS = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#800080', '#FFC0CB', '#A52A2A'];

const HomePage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completedCount, setCompletedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editTaskId, setEditTaskId] = useState<number | null>(null);
    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [editTaskColor, setEditTaskColor] = useState('#21262d'); // Default color
    const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
    const router = useRouter();

    const fetchTasks = async () => {
        try {
            const res = await fetch('http://localhost:5000/tasks', { method: 'GET' });

            if (!res.ok) throw new Error('Failed to fetch tasks');

            const data = await res.json();
            setTasks(data);
            setCompletedCount(data.filter((task: Task) => task.completed).length);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleComplete = async (taskId: number) => {
        const task = tasks.find((task) => task.id === taskId);
        if (task) {
            try {
                const updatedTask = { ...task, completed: !task.completed };
                const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
                    method: 'PUT',
                    body: JSON.stringify(updatedTask),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to update task');
                }

                setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                        t.id === taskId ? { ...t, completed: !t.completed } : t
                    )
                );
                setCompletedCount((count) =>
                    updatedTask.completed ? count + 1 : count - 1
                );
            } catch (error) {
                console.error('Error toggling task completion:', error);
                alert('Failed to toggle task completion. Please try again.');
            }
        } else {
            alert('Task not found.');
        }
    };

    const deleteTask = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' });

            if (!res.ok) throw new Error('Failed to delete task');

            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
            setDeleteTaskId(null); // Close modal after deleting
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const editTask = (id: number) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            setEditTaskId(id);
            setEditTaskTitle(task.title);
            setEditTaskColor(task.color || '#21262d'); // Preserving existing color or default
            setIsEditing(true);
        }
    };

    const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditTaskTitle(event.target.value);
    };

    const handleColorChange = (color: string) => {
        setEditTaskColor(color);
    };

    const saveEditTask = async () => {
        if (editTaskId !== null) {
            try {
                const updatedTask = { id: editTaskId, title: editTaskTitle, completed: false, color: editTaskColor };
                const res = await fetch(`http://localhost:5000/tasks/${editTaskId}`, {
                    method: 'PUT',
                    body: JSON.stringify(updatedTask),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to update task');
                }

                setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                        t.id === editTaskId ? { ...t, title: editTaskTitle, color: editTaskColor } : t
                    )
                );
                setIsEditing(false);
                setEditTaskId(null);
                setEditTaskTitle('');
                setEditTaskColor('#21262d');
            } catch (error) {
                console.error('Error saving task edit:', error);
                alert('Failed to save task edit. Please try again.');
            }
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-white">
                <p className="text-lg font-semibold">Loading tasks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-red-500">
                <p className="text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">
            <header className="bg-[#161b22] px-4 py-6 shadow-lg">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold flex items-center">Todo App</h1>
                    <a
                        href="/create"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded shadow-lg flex items-center"
                    >
                        <svg
                            className="w-6 h-6 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Task
                    </a>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-lg font-medium">Tasks</h2>
                        <p className="text-sm text-gray-400">{tasks.length} total</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-medium">Completed</h2>
                        <p className="text-sm text-gray-400">{completedCount}</p>
                    </div>
                </div>

                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center text-gray-400 mt-16">
                        <svg
                            className="w-12 h-12 mb-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m2 6h-6m-6 0h6m2-12h6m-6 0H9m-6 0h6"
                            />
                        </svg>
                        <p className="text-center">You don't have any tasks yet. <br /> Start by creating one!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`p-4 rounded-lg shadow-sm ${task.completed
                                    ? 'bg-blue-600 text-gray-300'
                                    : 'bg-[#21262d]'
                                    } flex justify-between items-center transition duration-300`}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggleComplete(task.id)}
                                        className="mr-2 h-5 w-5 gray-500"
                                    />
                                    <span
                                        className={`text-lg ${task.completed ? 'line-through' : ''}`}
                                    >
                                        {task.title}
                                    </span>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => editTask(task.id)}
                                        className="text-yellow-500 hover:text-yellow-700"
                                        aria-label="Edit Task"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.862 3.487a1.748 1.748 0 112.471 2.471l-9.5 9.5a2 2 0 01-.884.512l-3.232.808a1 1 0 01-1.213-1.213l.808-3.232a2 2 0 01.512-.884l9.5-9.5zM19 15.5v5.25a1.25 1.25 0 01-1.25 1.25H4.25A1.25 1.25 0 013 20.75V5.25C3 4.56 3.56 4 4.25 4H9.5"
                                            />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => setDeleteTaskId(task.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6m-12 0l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-[#161b22] p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
                        <input
                            type="text"
                            value={editTaskTitle}
                            onChange={handleEditChange}
                            className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
                        />
                        <div className="flex space-x-2 mb-4">
                            {COLORS.map((color) => (
                                <div
                                    key={color}
                                    onClick={() => handleColorChange(color)}
                                    style={{ backgroundColor: color }}
                                    className={`w-6 h-6 rounded-full cursor-pointer ${editTaskColor === color ? 'border-2 border-gray-500' : ''
                                        }`}
                                ></div>
                            ))}
                        </div>
                        <button
                            onClick={saveEditTask}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="w-full mt-2 text-gray-500 hover:text-gray-700 text-center"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTaskId !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-[#161b22] p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            Are you sure you want to delete this task?
                        </h3>
                        <div className="flex space-x-4 justify-center">
                            <button
                                onClick={() => deleteTask(deleteTaskId)}
                                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteTaskId(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
