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
    // Optimistic update - add mission with temporary ID
    const tempId = Date.now(); // Temporary ID
    const newMission: Mission = {
      id: tempId,
      user_id: 0, // Will be set by server
      category_id: categoryId,
      title,
      state: 'NOT_STARTED',
      display_order: 0,
      cancelled_at: null,
      created_at: new Date().toISOString(),
      tasks: []
    };

    setMissions(prev => [...prev, newMission]);

    // Sync in background
    try {
      await api.post('/missions', { title, category_id: categoryId });
      await refreshMissions();
    } catch (error) {
      // Rollback on error
      await refreshMissions();
      throw error;
    }
  };

  const updateMission = async (id: number, data: Partial<Mission>) => {
    // Optimistic update for mission state changes
    if (data.state !== undefined || data.title !== undefined) {
      setMissions(prev => prev.map(mission => 
        mission.id === id ? { ...mission, ...data } : mission
      ));
    }

    // Sync in background
    try {
      await api.put(`/missions/${id}`, data);
      await refreshMissions();
      await refreshSelectedTasks();
    } catch (error) {
      // Rollback on error
      await refreshMissions();
      await refreshSelectedTasks();
      throw error;
    }
  };

  const cancelMission = async (id: number) => {
    // Optimistic update - remove mission immediately
    const missionToRemove = missions.find(m => m.id === id);
    const taskIds = missionToRemove?.tasks?.map(t => t.id) || [];

    setMissions(prev => prev.filter(mission => mission.id !== id));
    setSelectedTasks(prev => prev.filter(st => !taskIds.includes(st.task_id)));

    // Sync in background
    try {
      await api.delete(`/missions/${id}`);
      await refreshMissions();
      await refreshSelectedTasks();
    } catch (error) {
      // Rollback on error
      await refreshMissions();
      await refreshSelectedTasks();
      throw error;
    }
  };

  const createTask = async (missionId: number, title: string) => {
    // Optimistic update - add task with temporary ID
    const tempId = Date.now(); // Temporary ID
    const newTask: Task = {
      id: tempId,
      mission_id: missionId,
      title,
      state: 'NOT_STARTED',
      display_order: 0,
      cancelled_at: null,
      created_at: new Date().toISOString()
    };

    setMissions(prev => prev.map(mission => 
      mission.id === missionId 
        ? { ...mission, tasks: [...(mission.tasks || []), newTask] }
        : mission
    ));

    // Sync in background
    try {
      await api.post(`/missions/${missionId}/tasks`, { title });
      await refreshMissions();
    } catch (error) {
      // Rollback on error
      await refreshMissions();
      throw error;
    }
  };

  const updateTask = async (id: number, data: Partial<Task>) => {
    // Optimistic update for task state changes
    if (data.state !== undefined) {
      setMissions(prev => prev.map(mission => ({
        ...mission,
        tasks: mission.tasks?.map(task => 
          task.id === id ? { ...task, ...data } : task
        )
      })));
      setSelectedTasks(prev => prev.map(st => 
        st.task_id === id ? { ...st, ...data } : st
      ));
    }

    // Sync in background
    try {
      await api.put(`/missions/tasks/${id}`, data);
      await refreshMissions();
      await refreshSelectedTasks();
    } catch (error) {
      // Rollback on error
      await refreshMissions();
      await refreshSelectedTasks();
      throw error;
    }
  };

  const cancelTask = async (id: number) => {
    // Optimistic update - remove task immediately
    setMissions(prev => prev.map(mission => ({
      ...mission,
      tasks: mission.tasks?.filter(task => task.id !== id)
    })));
    setSelectedTasks(prev => prev.filter(st => st.task_id !== id));

    // Sync in background
    try {
      await api.delete(`/missions/tasks/${id}`);
      await refreshMissions();
      await refreshSelectedTasks();
    } catch (error) {
      // Rollback on error
      await refreshMissions();
      await refreshSelectedTasks();
      throw error;
    }
  };

  const addSelectedTask = async (taskId: number) => {
    // Find task info for optimistic update
    const task = missions
      .flatMap(m => m.tasks || [])
      .find(t => t.id === taskId);
    const mission = missions.find(m => m.tasks?.some(t => t.id === taskId));

    if (task && mission) {
      // Optimistic update - add to selected tasks immediately
      const tempId = Date.now();
      const newSelectedTask: SelectedTask = {
        id: tempId,
        user_id: 0,
        task_id: taskId,
        display_order: selectedTasks.length + 1,
        created_at: new Date().toISOString(),
        title: task.title,
        state: task.state,
        mission_id: mission.id,
        mission_title: mission.title
      };
      setSelectedTasks(prev => [...prev, newSelectedTask]);
    }

    // Sync in background
    try {
      await api.post('/selected-tasks', { task_id: taskId });
      await refreshSelectedTasks();
    } catch (error) {
      // Rollback on error
      await refreshSelectedTasks();
      throw error;
    }
  };

  const removeSelectedTask = async (id: number) => {
    // Optimistic update - remove immediately
    setSelectedTasks(prev => prev.filter(st => st.id !== id));

    // Sync in background
    try {
      await api.delete(`/selected-tasks/${id}`);
      await refreshSelectedTasks();
    } catch (error) {
      // Rollback on error
      await refreshSelectedTasks();
      throw error;
    }
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

