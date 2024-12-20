'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown'];

const CreateTaskPage = () => {
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('red');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newTask = { title, color, completed: false };

        try {
            const res = await fetch("http://localhost:5000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });

            if (!res.ok) {
                const error = await res.text();
                console.error("Error response:", error);
                alert(`Error: ${res.status} ${res.statusText}`);
                return;
            }

            const task = await res.json();
            console.log("Task created:", task);
            router.push("/"); // Redirect back to the home page
        } catch (error) {
            console.error("Failed to create task:", error);
            alert("Failed to create task");
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">
            <header className="bg-[#161b22] px-4 py-6 shadow-md">
                <div className="max-w-2xl mx-auto flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="mr-4 p-2 text-white hover:text-blue-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold">Todo App</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Brush your teeth"
                            className="w-full p-3 rounded-lg bg-[#21262d] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-4">Color</label>
                        <div className="flex space-x-3">
                            {COLORS.map((colorOption) => (
                                <button
                                    type="button"
                                    key={colorOption}
                                    onClick={() => setColor(colorOption)}
                                    className={`w-10 h-10 rounded-full border-2 ${color === colorOption ? 'border-blue-500' : 'border-gray-600'
                                        }`}
                                    style={{ backgroundColor: colorOption }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg text-lg font-medium flex items-center justify-center space-x-2"
                        >
                            <span>Add Task</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CreateTaskPage;
