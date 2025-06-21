import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AddTodoFormProps {
    onAddTodo: (title: string) => void;
    isAdding: boolean;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo, isAdding }) => {
    const [newTodoTitle, setNewTodoTitle] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodoTitle(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newTodoTitle.trim() === '') {
            alert('Будь ласка, введіть назву завдання!');
            return;
        }

        onAddTodo(newTodoTitle.trim());
        setNewTodoTitle('');
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-grow">
                <Label htmlFor="newTodo" className="sr-only">
                    Нове завдання
                </Label>
                <Input
                    id="newTodo"
                    type="text"
                    placeholder="Додати нове завдання..."
                    value={newTodoTitle}
                    onChange={handleInputChange}
                    className="w-full"
                    disabled={isAdding}
                />
                <Button type="submit" className="px-6 py-3 mt-3" disabled={isAdding}>
                    {isAdding ? 'Додаємо...' : 'Додати завдання'}
                </Button>
            </div>
        </form>
    );
};

export default AddTodoForm;