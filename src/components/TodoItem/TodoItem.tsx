import React from 'react';
import { type Todo } from "@/types/todo"; // Імпортуємо наш інтерфейс Todo

// --- Визначення інтерфейсу для пропсів TodoItem ---
interface TodoItemProps {
  todo: Todo; // Пропс 'todo' має бути типу Todo
  onToggleComplete: (id: number) => void; // Пропс 'onToggleComplete' - це функція,
                                          // яка приймає 'id' типу number і нічого не повертає (void)
}

// Компонент TodoItem - тепер з TypeScript для пропсів
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete }) => {
  return (
    <div className="flex items-center justify-between p-4 mb-2 bg-white rounded-lg shadow-sm">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo.id)} // Викликаємо функцію з id завдання
        className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
      />
      <span className={`flex-grow ml-4 text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
        {todo.title}
      </span>
      {/* Тут можна додати інші елементи, наприклад, кнопки видалення/редагування */}
    </div>
  );
};

export default TodoItem;