import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useLocation } from 'wouter';
import { useToast } from './use-toast';

export const useStaffLogin = () => {
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    return useMutation({
        mutationFn: authApi.staffLogin,
        onSuccess: (data: any) => {
            // THE MAGIC REDIRECT: React Router checks the role!
            const role = data.user.role;
            
            // Save safe user data to localStorage so the dashboard knows who is logged in
            localStorage.setItem('triveda_user', JSON.stringify(data.user));

            if (role === 'ADMIN') {
                toast({ title: "Welcome Admin!" });
                setLocation('/admin/dashboard');
            } else if (role === 'DOCTOR') {
                toast({ title: `Welcome Dr. ${data.user.name}` });
                setLocation('/doctor/dashboard');
            } else {
                toast({ title: "Login Successful", description: `Redirecting ${role}` });
            }
        },
        onError: (error: Error) => {
            toast({ title: "Login Failed", description: error.message, variant: "destructive" });
        }
    });
};