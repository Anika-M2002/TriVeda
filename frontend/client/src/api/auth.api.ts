import { apiClient } from './client';

export const authApi = {
    staffLogin: async (credentials: any) => {
        return apiClient.post('/auth/staff/login', credentials);
    },
    patientLogin: async (credentials: any) => {
        return apiClient.post('/auth/patient/login', credentials);
    },
    // Admin function to create doctors
    createDoctor: async (doctorData: any) => {
        return apiClient.post('/admin/create-doctor', doctorData);
    },
    // Fetch available departments
    getDepartments: async () => {
        return apiClient.get('/admin/departments');
    }
};