import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import apiClient from '../api/client';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const response = await apiClient.post('/auth/login', data);
      setAuth(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError('');
      const response = await apiClient.post('/auth/google', {
        idToken: credentialResponse.credential,
      });
      setAuth(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Dynamic gradient & branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10 items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/40 via-purple-500/20 to-transparent opacity-60"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 glass p-12 rounded-2xl max-w-lg mx-8 animate-slide-up">
          <div className="flex items-center gap-3 text-primary mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <LayoutDashboard className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">SmartLeads</h1>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Experience the next generation of lead management. Accelerate your sales pipeline with advanced filtering, dynamic workflows, and intelligent insights.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center justify-center gap-2 text-primary mb-8">
            <LayoutDashboard className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-foreground">SmartLeads</h1>
          </div>
          
          <div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Create one now
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-900/50 animate-slide-up">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email address
                </label>
                <div className="relative group">
                  <input
                    {...register('email')}
                    type="email"
                    className="appearance-none block w-full px-4 py-3 bg-card border border-border rounded-xl shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm text-foreground transition-all duration-200"
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <input
                    {...register('password')}
                    type="password"
                    className="appearance-none block w-full px-4 py-3 bg-card border border-border rounded-xl shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm text-foreground transition-all duration-200"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-primary/20 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in to Dashboard'}
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google login failed')}
                  useOneTap
                  theme="filled_blue"
                  shape="circle"
                  width="100%"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
