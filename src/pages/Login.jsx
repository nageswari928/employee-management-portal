import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

export const Login = () => {
  const { employees, login, auth } = useAppContext();
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    if (auth) {
      navigate('/dashboard.html');
    }
  }, [auth, navigate]);

  const validateLoginForm = (empId, pass) => {
    const errors = [];
    if (!empId || empId.trim().length === 0) {
      errors.push('Employee ID is required.');
    }
    if (!pass || pass.length < 6) {
      errors.push('Password must be at least 6 characters.');
    }
    return errors;
  };

  const handleReset = () => {
    setEmployeeId('');
    setPassword('');
    setRememberMe(false);
    setMessage('');
    setMessageType('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    
    const errors = validateLoginForm(employeeId, password);
    if (errors.length > 0) {
      setMessageType('error');
      setMessage(errors.join(' '));
      return;
    }

    // Verify credentials
    const validUser = employees.find(
      user => user.employeeId === employeeId && user.password === password
    );

    if (!validUser) {
      setMessageType('error');
      setMessage('Invalid Employee ID or Password');
      return;
    }

    // Auth logic
    login(employeeId, rememberMe);
    setMessageType('success');
    setMessage('Authentication successful. Redirecting...');

    setTimeout(() => {
      navigate('/dashboard.html');
    }, 400);
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none" />

      <section 
        className="w-full max-w-md"
        data-testid="login-card"
        aria-labelledby="login-title"
      >
        <Card className="border-slate-800 bg-slate-950/85 backdrop-blur-md shadow-2xl text-slate-100">
          <CardHeader className="space-y-2 pb-6 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-blue-500/20 shadow-md">
                EP
              </div>
              <div>
                <p className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">Northstar Holdings</p>
                <CardTitle id="login-title" className="text-xl font-bold tracking-tight text-white">
                  Employee Management Portal
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form 
              id="loginForm" 
              data-testid="login-form" 
              onSubmit={handleSubmit}
              onReset={handleReset}
              className="space-y-4"
              noValidate
            >
              {/* Employee ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="employeeId">
                  Employee ID
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    data-testid="employee-id"
                    autoComplete="username"
                    value={employeeId}
                    onChange={(e) => {
                      setEmployeeId(e.target.value);
                      setMessage('');
                    }}
                    className="pl-9 bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus-visible:ring-blue-600"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400" htmlFor="password">
                  Password
                </label>
                <div 
                  className="relative flex items-center" 
                  data-testid="password-wrapper"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    data-testid="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setMessage('');
                    }}
                    className="pl-9 pr-10 bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus-visible:ring-blue-600"
                    required
                  />
                  <button
                    id="togglePassword"
                    data-testid="toggle-password"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & forgot password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-350 select-none">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    data-testid="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-950"
                  />
                  <span>Remember me</span>
                </label>
                <a 
                  href="forgot-password.html" 
                  onClick={(e) => e.preventDefault()}
                  className="text-blue-500 hover:text-blue-450 font-medium transition-colors"
                  data-testid="forgot-password"
                >
                  Forgot password?
                </a>
              </div>

              {/* Error/Success message */}
              {message && (
                <div 
                  id="loginMessage"
                  data-testid="login-message"
                  className={`p-3 rounded-md text-xs font-medium border text-center transition-all ${
                    messageType === 'error' 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  {message}
                </div>
              )}

              {/* Actions row */}
              <div className="flex gap-3 pt-2">
                <Button
                  id="loginBtn"
                  type="submit"
                  data-testid="login-btn"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
                >
                  Login
                </Button>
                <Button
                  id="resetBtn"
                  type="reset"
                  data-testid="reset-btn"
                  variant="outline"
                  className="border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white"
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};
