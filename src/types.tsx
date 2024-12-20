export interface Task {
    id: number;
    title: string;
    color: string;
    completed: boolean;
    createdAt: string;  // Assuming you want to include the timestamp fields
    updatedAt: string;
}