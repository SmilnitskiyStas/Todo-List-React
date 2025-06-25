import React from "react";
import { type Todo } from "@/types/todo";
import TodoItem from "../TodoItem/TodoItem";
import { AnimatePresence } from "framer-motion";

// --- Визначення інтерфейсу для пропсів TodoList ---
interface TodoListProps {
    todos: Todo[]; // Пропс 'todos' - це масив об'єктів типу Todo
    onToggleComplete: (id: number) => void; // Пропс 'onToggleComplete' - функція для зміни стану
    onDelete: (id: number) => void;
    onUpdate: (id: number, newTitle: string) => void;
  }
  
  // Компонент TodoList - тепер з TypeScript для пропсів
  const TodoList: React.FC<TodoListProps> = ({ todos, onToggleComplete, onDelete, onUpdate }) => {
    // Якщо завдань немає, показуємо повідомлення
    if (!todos || todos.length === 0) {
      return <p className="text-gray-600 text-center text-xl mt-8">Немає завдань для відображення!</p>;
    }
  
    return (
      <div className="w-full max-w-md">
        {/* Використовуємо метод map() для рендерингу кожного TodoItem */}
        <AnimatePresence>
          {todos.map(todo => (
            <TodoItem
              key={todo.id} // Обов'язково використовуйте унікальний 'key' для елементів списку!
              todo={todo} // Передаємо об'єкт todo як пропс до TodoItem
              onToggleComplete={onToggleComplete} // Передаємо функцію далі до TodoItem
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  };
  
  export default TodoList;