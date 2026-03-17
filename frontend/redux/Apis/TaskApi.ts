import { baseApi } from './BaseApi';

interface Task {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  user: string;
  createdAt: string;
  updatedAt: string;
}

export type { Task };

interface CreateTaskRequest {
  title: string;
  description: string;
  status?: 'pending' | 'completed';
}

interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed';
}

interface TasksResponse {
  success: boolean;
  message: string;
  data: {
    tasks: Task[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalTasks: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
    statistics: {
      totalAllTasks: number;
      totalCompletedTasks: number;
      totalPendingTasks: number;
      completionRate: number;
    };
  };
}

interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<TasksResponse, { page?: number; limit?: number; status?: string; sortBy?: string; sortOrder?: string }>({
      query: (params) => ({
        url: '/tasks',
        params,
      }),
      providesTags: ['Tasks'],
    }),
    getTask: builder.query<TaskResponse, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: ['Tasks'],
    }),
    createTask: builder.mutation<TaskResponse, CreateTaskRequest>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),
    updateTask: builder.mutation<TaskResponse, { id: string; body: UpdateTaskRequest }>({
      query: ({ id, body }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),
    deleteTask: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;