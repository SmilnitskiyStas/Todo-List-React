import { useState, useEffect } from "react";
import { type Todo } from './types/todo';
import { Button } from "./components/ui/button";
import TodoList from "@/components/TodoList/TodoList";
import { supabase } from './lib/supabaseClient';


// -- Імітація отримання даних від API --
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

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const data = await fetchTodosFromSupabase();
        setTodos(data);
      } catch (error) {
        console.error("Помилка завантаження завдань:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTodos();
  }, []);

  const handleToggleComplete = async (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) return;

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
      alert('Помилка оновлення завдання. Спробуйте ще раз.');
    }
  };

  // -- Add new task --
  const handleAddTodo = async () => {
    const newTodoTitle = prompt("Введіть назву нового завдання:");
    if (newTodoTitle && newTodoTitle.trim() !== '') {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          { title: newTodoTitle.trim(), completed: false }
        ])
        .select();
      
      if (error) {
        console.error('Error adding new todo to Supabase:', error);
        alert('Помилка додавання завдання. Спробуйте ще раз.')
      } else if (data && data.length > 0) {
        setTodos(prevTodos => [...prevTodos, data[0] as Todo]);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-5xl font-extrabold text-blue-700 mb-8">Мій список To-Do List</h1>

      {loading ? (
        <p className="text-2xl text-gray-700">Завантажуємо завдання...</p>
      ) : (
          <TodoList todos={todos} onToggleComplete={ handleToggleComplete } />   
      )}

      <Button
        className="mt-8 px-6 py-3 text-lg bg-green-500 hover:bg-green-600 text-white"
        onClick={handleAddTodo}
      >Додати нове завдання</Button>
    </div>
  )
}

export default App