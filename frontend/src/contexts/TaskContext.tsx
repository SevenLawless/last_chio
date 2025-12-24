import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

export interface Category {
  id: number;
  user_id: number;
  name: string;
  color: string;
  display_order: number;
  created_at: string;
}

export interface Task {
  id: number;
  mission_id: number;
  title: string;
  state: 'NOT_STARTED' | 'COMPLETED';
  display_order: number;
  cancelled_at: string | null;
  created_at: string;
}

export interface Mission {
  id: number;
  user_id: number;
  category_id: number | null;
  title: string;
  state: 'NOT_STARTED' | 'COMPLETED';
  display_order: number;
  cancelled_at: string | null;
  created_at: string;
  tasks?: Task[];
}

export interface SelectedTask {
  id: number;
  user_id: number;
  task_id: number;
  display_order: number;
  created_at: string;
  title: string;
  state: 'NOT_STARTED' | 'COMPLETED';
  mission_id: number;
  mission_title: string;
}

interface TaskContextType {
  categories: Category[];
  missions: Mission[];
  selectedTasks: SelectedTask[];
  loading: boolean;
  refreshCategories: () => Promise<void>;
  refreshMissions: () => Promise<void>;
  refreshSelectedTasks: () => Promise<void>;
  createCategory: (name: string, color: string) => Promise<void>;
  updateCategory: (id: number, name: string, color: string, displayOrder?: number) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  createMission: (title: string, categoryId: number | null) => Promise<void>;
  updateMission: (id: number, data: Partial<Mission>) => Promise<void>;
  cancelMission: (id: number) => Promise<void>;
  createTask: (missionId: number, title: string) => Promise<void>;
  updateTask: (id: number, data: Partial<Task>) => Promise<void>;
  cancelTask: (id: number) => Promise<void>;
  addSelectedTask: (taskId: number) => Promise<void>;
  removeSelectedTask: (id: number) => Promise<void>;
  reorderSelectedTasks: (tasks: { id: number; display_order: number }[]) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<SelectedTask[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCategories = async () => {
    try {
      const response = await api.get<Category[]>('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const refreshMissions = async () => {
    try {
      const response = await api.get<Mission[]>('/missions');
      setMissions(response.data);
    } catch (error) {
      console.error('Error fetching missions:', error);
      setMissions([]);
    }
  };

  const refreshSelectedTasks = async () => {
    try {
      const response = await api.get<SelectedTask[]>('/selected-tasks');
      setSelectedTasks(response.data);
    } catch (error) {
      console.error('Error fetching selected tasks:', error);
      setSelectedTasks([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        // Clear data when user logs out
        setCategories([]);
        setMissions([]);
        setSelectedTasks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      // Clear old data immediately
      setCategories([]);
      setMissions([]);
      setSelectedTasks([]);
      
      try {
        await Promise.all([
          refreshCategories(),
          refreshMissions(),
          refreshSelectedTasks()
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const createCategory = async (name: string, color: string) => {
    await api.post('/categories', { name, color });
    await refreshCategories();
  };

  const updateCategory = async (id: number, name: string, color: string, displayOrder?: number) => {
    await api.put(`/categories/${id}`, { name, color, display_order: displayOrder });
    await refreshCategories();
  };

  const deleteCategory = async (id: number) => {
    await api.delete(`/categories/${id}`);
    await refreshCategories();
    await refreshMissions();
  };

  const createMission = async (title: string, categoryId: number | null) => {
    await api.post('/missions', { title, category_id: categoryId });
    await refreshMissions();
  };

  const updateMission = async (id: number, data: Partial<Mission>) => {
    await api.put(`/missions/${id}`, data);
    await refreshMissions();
    await refreshSelectedTasks();
  };

  const cancelMission = async (id: number) => {
    await api.delete(`/missions/${id}`);
    await refreshMissions();
    await refreshSelectedTasks();
  };

  const createTask = async (missionId: number, title: string) => {
    await api.post(`/missions/${missionId}/tasks`, { title });
    await refreshMissions();
  };

  const updateTask = async (id: number, data: Partial<Task>) => {
    await api.put(`/missions/tasks/${id}`, data);
    await refreshMissions();
    await refreshSelectedTasks();
  };

  const cancelTask = async (id: number) => {
    await api.delete(`/missions/tasks/${id}`);
    await refreshMissions();
    await refreshSelectedTasks();
  };

  const addSelectedTask = async (taskId: number) => {
    await api.post('/selected-tasks', { task_id: taskId });
    await refreshSelectedTasks();
  };

  const removeSelectedTask = async (id: number) => {
    await api.delete(`/selected-tasks/${id}`);
    await refreshSelectedTasks();
  };

  const reorderSelectedTasks = async (tasks: { id: number; display_order: number }[]) => {
    await api.put('/selected-tasks/reorder', { tasks });
    await refreshSelectedTasks();
  };

  return (
    <TaskContext.Provider
      value={{
        categories,
        missions,
        selectedTasks,
        loading,
        refreshCategories,
        refreshMissions,
        refreshSelectedTasks,
        createCategory,
        updateCategory,
        deleteCategory,
        createMission,
        updateMission,
        cancelMission,
        createTask,
        updateTask,
        cancelTask,
        addSelectedTask,
        removeSelectedTask,
        reorderSelectedTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

