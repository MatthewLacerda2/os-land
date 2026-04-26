import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/user-api';
import logo from '../assets/checkout360.png';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Spinner } from '../components/ui/spinner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await userApi.login({ email, password });
      localStorage.setItem('os_land_token', response.jwt);
      localStorage.setItem('os_land_user', JSON.stringify({
        name: response.name,
        email: response.email
      }));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      <div className="flex flex-col items-center mb-8">
        <img 
          src={logo} 
          alt="Checkout360 Logo" 
          className="w-24 h-auto mb-4 drop-shadow-md"
        />
      </div>

      <Card className="w-full max-w-sm border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-slate-800 tracking-tight">OS-Land</CardTitle>
          <CardDescription className="text-slate-500">HVAC Management System</CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@osland.com"
                className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="pb-8 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-base font-bold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="text-white" />
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
