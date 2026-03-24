import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Briefcase, Eye, EyeOff, UserCheck, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError,  setServerError]  = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: 'applicant' } });

  const role = watch('role');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const user = await registerUser({
        name:         data.name,
        email:        data.email,
        password:     data.password,
        role:         data.role,
        company_name: data.company_name || '',
      });
      navigate(data.role === 'company' ? '/dashboard/company' : '/dashboard/applicant');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Briefcase size={28} className="text-white" />
            </div>
            <span className="text-3xl font-bold font-display text-white">TalentBridge</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 font-display leading-tight">
            Start your journey today
          </h2>
          <p className="text-white/70 text-lg font-body">
            Whether you're looking for a job or hiring talent, TalentBridge connects you.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-5 text-left">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <UserCheck size={20} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm font-display">Job Seekers</p>
              <p className="text-white/60 text-xs mt-1">Browse thousands of jobs and apply with one click</p>
            </div>
            <div className="glass rounded-2xl p-5 text-left">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <Building2 size={20} className="text-white" />
              </div>
              <p className="text-white font-semibold text-sm font-display">Companies</p>
              <p className="text-white/60 text-xs mt-1">Post jobs and find qualified talent instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <Link to="/" className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-indigo-500 rounded-xl flex items-center justify-center">
              <Briefcase size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display text-gray-900">
              Talent<span className="text-primary-600">Bridge</span>
            </span>
          </Link>

          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 font-display">Create your account</h1>
              <p className="text-gray-500 text-sm mt-1">Free forever. No credit card required.</p>
            </div>

            {/* Role Toggle */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'applicant', icon: UserCheck, label: 'Job Seeker',  desc: 'Looking for opportunities' },
                  { value: 'company',   icon: Building2, label: 'Company',     desc: 'Hiring talent' },
                ].map(({ value, icon: Icon, label, desc }) => (
                  <label
                    key={value}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      role === value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                    }`}
                  >
                    <input type="radio" value={value} className="sr-only" {...register('role')} />
                    <Icon size={20} className={role === value ? 'text-primary-600' : 'text-gray-400'} />
                    <div className="text-center">
                      <p className={`text-sm font-semibold font-display ${role === value ? 'text-primary-700' : 'text-gray-700'}`}>
                        {label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    {role === value && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4 text-sm text-red-700">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {role === 'company' ? 'Contact Person Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  placeholder={role === 'company' ? 'Priya Nair' : 'Dusanapudi Lathik'}
                  className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Minimum 2 characters' },
                  })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Company Name — shown only for company role */}
              {role === 'company' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                  <input
                    type="text"
                    placeholder="TechCorp India Pvt Ltd"
                    className={`input-field ${errors.company_name ? 'border-red-300' : ''}`}
                    {...register('company_name', {
                      required: 'Company name is required',
                    })}
                  />
                  {errors.company_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>
                  )}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input-field ${errors.email ? 'border-red-300' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                  })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    className={`input-field pr-10 ${errors.password ? 'border-red-300' : ''}`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 w-4 h-4 rounded text-primary-600 focus:ring-primary-400"
                  {...register('terms', { required: 'You must accept the terms' })}
                />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  I agree to the{' '}
                  <Link to="#" className="text-primary-600 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="#" className="text-primary-600 hover:underline">Privacy Policy</Link>
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account →'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center gap-1 mt-4 text-sm text-gray-400 hover:text-primary-600 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}