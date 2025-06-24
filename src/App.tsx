import { useState, useEffect } from "react";
import { type Todo } from './types/todo';
import TodoList from "@/components/TodoList/TodoList";
import { supabase } from './lib/supabaseClient';
import AddTodoForm from "./components/AddTodoForm/AddTodoForm";
import { Toaster, toast } from 'sonner';
// import { title } from "process";


// -- Функція для отримання даних з Supabase --
async function fetchTodosFromSupabase(): Promise<Todo[]> {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('id', { ascending: true });
  
  if (error) {
    console.error('Error fetching todos from Supabase:', error);
    throw error;
  }

  return data as Todo[];
}

async function updateTodoTitleInSupabase(id:number, newTitle: string): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .update({ title: newTitle })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating todo title in Supabase:', error);
    throw error;
  }
  if (!data || data.length === 0) {
    throw new Error('No data returned after updating todo title');
  }
  return data[0] as Todo;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<number | null>(null);

  // Для завантаження даних
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const data = await fetchTodosFromSupabase();
        setTodos(data);
      } catch (error) {
        console.error("Помилка завантаження завдань:", error);
        toast.error("Не вдалося завантажити завдання.")
      } finally {
        setLoading(false);
      }
    };
    loadTodos();
  }, []);

  // Функція для зміни статусу завдання (виконано/не винокано)
  const handleToggleComplete = async (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) return;
    try {
      const { error } = await supabase
      .from('todos')
      .update({ completed: !todoToUpdate.completed })
      .eq('id', id);
    
      if (error) {
        console.error('Error updating todo in Supabase:', error);
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, completed: !todoToUpdate.completed } : todo
          )
        );
        toast.error("Помилка оновлення завдання. Спробуйте ще раз")
      } else {
        toast.success("Статус завдання оновлено!")
      }
    } catch (error) {
      console.error("Непередбачена помилка при оновленні статусу:", error);
      toast.error("Непередбачена помилка при оновленні статусу.")
    }
  };

  // -- Add new task --
  const handleAddTodo = async (title: string) => {
    try {
      setIsAdding(true);
      const { data, error } = await supabase
        .from('todos')
        .insert([
          { title: title.trim(), completed: false }
        ])
        .select();
      
      if (error) {
        console.error('Error adding new todo to Supabase:', error);
        toast.error('Помилка додавання завдання. Спробуйте ще раз.')
      } else if (data && data.length > 0) {
        setTodos(prevTodos => [...prevTodos, data[0] as Todo]);
        toast.success("Завдання успішно додано!");
      }
    } catch (error) {
      console.error("Непередбачена помилка при додаванні:", error);
      toast.error("Непередбачена помилка при додаванні.")
    } finally {
      setIsAdding(false);
    }
  };

  // -- Function to delete task --
  const handleDeleteTodo = async (id: number) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    if (!todoToDelete) return;

    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    setIsDelete(id);

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting todo from Supabase:', error);
        toast.error('Помилка видалення завданн. Спробуйте ще раз.');
        setTodos(prevTodos => [...prevTodos, todoToDelete].sort((a, b) => a.id - b.id));
      } else {
        toast.success("Завдання успішно видалено!");
      }
    } catch (error) {
      console.error('Непередбачена помилка при видаленні!:', error);
      toast.error("Непередбачена помилка при видаленні.");
    } finally {
      setIsDelete(null);
    }
  };

  const handleUpdateTodo = async (id: number, newTitle: string) => {
    const originalTodo = todos.find(t => t.id === id);

    if (!originalTodo) return;

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      )
    );

    try {
      await updateTodoTitleInSupabase(id, newTitle);
      toast.success("Завдання успішно оновлено!");
    } catch (error) {
      console.error("Помилка оновлення заголовка завдання:", error);
      toast.error("Помилка оновлення заголовка завдання");

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, title: originalTodo.title } : todo
        )
      );
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-8">Мій список To-Do List</h1>

      <AddTodoForm onAddTodo={handleAddTodo} isAdding={ isAdding } />

      {loading ? (
        <p className="text-2xl text-gray-700">Завантажуємо завдання...</p>
      ) : (
          <TodoList todos={todos}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />   
      )}
      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App