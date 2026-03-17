import { baseApi } from './BaseApi';

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface UserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<{ success: boolean; message: string }, RegisterRequest>({
      query: (body) => ({
        url: '/users/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<{ success: boolean; message: string }, LoginRequest>({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
    }),
    getMe: builder.query<UserResponse, void>({
      query: () => '/users/me',
    }),
    updateUser: builder.mutation<UserResponse, UpdateUserRequest>({
      query: (body) => ({
        url: '/users/update',
        method: 'PUT',
        body,
      }),
    }),
    deleteUser: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/users/delete',
        method: 'DELETE',
      }),
    }),
    forgotPassword: builder.mutation<{ success: boolean; message: string }, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/users/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<{ success: boolean; message: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: '/users/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetMeQuery, useUpdateUserMutation, useDeleteUserMutation, useForgotPasswordMutation, useResetPasswordMutation } = userApi;