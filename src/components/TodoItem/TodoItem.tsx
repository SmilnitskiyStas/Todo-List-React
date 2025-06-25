import React, {useState} from 'react';
import { type Todo } from "@/types/todo"; // Імпортуємо наш інтерфейс Todo
import { Button } from '../ui/button';
import { Trash2, Pencil } from 'lucide-react';
import { Input } from '../ui/input';
import { motion } from 'framer-motion';

// --- Визначення інтерфейсу для пропсів TodoItem ---
interface TodoItemProps {
  todo: Todo; // Пропс 'todo' має бути типу Todo
  onToggleComplete: (id: number) => void; // Пропс 'onToggleComplete' - це функція,
    // яка приймає 'id' типу number і нічого не повертає (void)
  onDelete: (id: number) => void;
  onUpdate: (id: number, newTitle: string) => void;
}

// Компонент TodoItem - тепер з TypeScript для пропсів
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(todo.title);

  //Обробник збереження змін (після редагування)
  const handlerSaveEdit = () => {
    if (editedTitle.trim() === '') {
      alert('Завдання не може бути порожнім!');
      return;
    }

    if (editedTitle !== todo.title) {
      onUpdate(todo.id, editedTitle.trim());
    }
    setIsEditing(false);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlerSaveEdit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  return (
    <motion.div
      layout
      initial={{opacity: 0, y: 50, scale: 0.8}}
      animate={{opacity: 1, y: 0, scale: 1}}
      exit={{opacity: 0, x: -100, transition: {duration: 0.3}}}
      transition={{type: "spring", stiffness: 500, damping: 30}}
      className="flex items-center justify-between p-4 mb-2 bg-white rounded-lg shadow-sm group">
          <div className='flex items-center flex-grow'>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleComplete(todo.id)} // Викликаємо функцію з id завдання
                className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500 cursor-pointer"
        />
        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handlerSaveEdit}
            onKeyDown={handleKeyDown}
            className="ml-4 text-lg flex-grow border-blue-400 focus:border-blue-500"
            autoFocus
          />
        ) : (
            <motion.span
              className={`flex-grow ml-4 text-lg ${todo.completed ? 'line-throgh text-gray-500' : 'text-gray-800'} cursor-pointer`}
              onDoubleClick={() => setIsEditing(true)}
              animate={{color: todo.completed ? '#6b7280' : '#1f2937'}}
              transition={{duration: 0.2}}
            >
              {todo.title}
            </motion.span>
        )}
      </div>
      {/* Кнопки дій */}
      {/* Кнопка редагування */}
      <div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className='ml-4 text-gray-400 hover:text-ted-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
          >
            <Pencil className="h-5 w-5"/>
          </Button>
        )}
      </div>
      {/* Кнопка видалення */}
      <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          className='ml-4 text-red-400 hover:text-ted-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
      >
          <Trash2 className='h-5 w-5'/> {/* Покажеться значок смітника */}
      </Button>
    </motion.div>
  );
};

export default TodoItem;