'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Chrome, Facebook, MessageCircle, ArrowRight, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/providers/AuthProvider';
type ValidationError = {
  field: string;
  message: string;
};

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const { refetch } = useAuth();
  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];

    if (!isLogin) {
      // Username validation
      if (!username.trim()) {
        errors.push({ field: 'username', message: 'اسم المستخدم مطلوب' });
      } else if (username.length < 3) {
        errors.push({ field: 'username', message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' });
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push({ field: 'username', message: 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام فقط' });
      }
    }

    // Email validation
    if (!email.trim()) {
      errors.push({ field: 'email', message: 'البريد الإلكتروني مطلوب' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: 'email', message: 'البريد الإلكتروني غير صالح' });
    }

    // Password validation
    if (!password) {
      errors.push({ field: 'password', message: 'كلمة المرور مطلوبة' });
    } else if (password.length < 6) {
      errors.push({ field: 'password', message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    } else if (!isLogin && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.push({ field: 'password', message: 'كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام' });
    }

    // Confirm password validation (for registration)
    if (!isLogin) {
      if (!confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'تأكيد كلمة المرور مطلوب' });
      } else if (password !== confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'كلمات المرور غير متطابقة' });
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setApiError('');
    setSuccess('');
    setValidationErrors([]);

    // Client-side validation
    const isValid = validateForm();

    if (!isValid) {
      console.log('Validation failed:', validationErrors);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'حدث خطأ أثناء تسجيل الدخول');
        }

        setSuccess(data.message);
        await refetch();
        router.push('/');
      } else {
        // Register
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password, confirmPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'حدث خطأ أثناء إنشاء الحساب');
        }

        setSuccess(data.message);
        await refetch()
        router.push('/');
      }
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black" dir="rtl">
      <AnimatedBackground />

      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-8 right-8 z-20 flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="font-semibold">العودة للرئيسية</span>
        </motion.button>
      </Link>



      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />

            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

              <div className="p-8">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-4xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text animate-pulse">
                      {isLogin ? 'أهلاً بعودتك' : 'انضم إلينا'}
                    </span>
                  </h1>
                  <p className="text-gray-400">
                    {isLogin ? 'أدخل بياناتك للمتابعة' : 'أنشئ حساب الألعاب الخاص بك'}
                  </p>
                </motion.div>

                {/* Validation Errors Alert */}
                <AnimatePresence>
                  {validationErrors.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="relative bg-gradient-to-br from-red-500/10 via-red-600/10 to-pink-500/10 backdrop-blur-sm border-2 border-red-500/50 rounded-2xl shadow-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 animate-pulse" />

                        <div className="relative p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: 2 }}
                                className="p-2 bg-red-500/20 rounded-full"
                              >
                                <AlertCircle className="w-5 h-5 text-red-400" />
                              </motion.div>
                              <h3 className="text-lg font-bold text-red-400">تنبيه!</h3>
                            </div>
                            <button
                              onClick={() => setValidationErrors([])}
                              className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          </div>

                          <div className="space-y-2">
                            {validationErrors.map((error, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2 text-red-300 bg-red-500/10 p-2.5 rounded-lg border border-red-500/30"
                              >
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse flex-shrink-0" />
                                <span className="text-sm font-medium">{error.message}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* API Error Alert */}
                <AnimatePresence>
                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="relative bg-gradient-to-br from-orange-500/10 via-red-600/10 to-red-500/10 backdrop-blur-sm border-2 border-orange-500/50 rounded-2xl shadow-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 animate-pulse" />

                        <div className="relative p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: 2 }}
                                className="p-2 bg-orange-500/20 rounded-full"
                              >
                                <AlertCircle className="w-5 h-5 text-orange-400" />
                              </motion.div>
                              <div>
                                <h3 className="text-base font-bold text-orange-400 mb-1">خطأ</h3>
                                <p className="text-sm text-orange-300">{apiError}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setApiError('')}
                              className="p-1 hover:bg-orange-500/20 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4 text-orange-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Alert */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="relative bg-gradient-to-br from-green-500/10 via-emerald-600/10 to-teal-500/10 backdrop-blur-sm border-2 border-green-500/50 rounded-2xl shadow-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 animate-pulse" />

                        <div className="relative p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 10 }}
                                className="p-2 bg-green-500/20 rounded-full"
                              >
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                              </motion.div>
                              <div>
                                <h3 className="text-base font-bold text-green-400 mb-1">نجح!</h3>
                                <p className="text-sm text-green-300">{success}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setSuccess('')}
                              className="p-1 hover:bg-green-500/20 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4 text-green-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsLogin(true);
                      setApiError('');
                      setSuccess('');
                      setValidationErrors([]);
                    }}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${isLogin
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/50'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                      }`}
                  >
                    تسجيل الدخول
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsLogin(false);
                      setApiError('');
                      setSuccess('');
                      setValidationErrors([]);
                    }}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${!isLogin
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                      }`}
                  >
                    إنشاء حساب
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        key="username"
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <InputField
                          icon={<User className="w-5 h-5" />}
                          type="text"
                          placeholder="اسم المستخدم"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <InputField
                    icon={<Mail className="w-5 h-5" />}
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <InputField
                    icon={<Lock className="w-5 h-5" />}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                  />

                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        key="confirm-password"
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <InputField
                          icon={<Lock className="w-5 h-5" />}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="تأكيد كلمة المرور"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isLogin && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-shadow relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                      {loading ? 'جاري المعالجة...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
                    </span>
                    {!loading && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
                        initial={{ x: '100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-900/80 text-gray-400">أو تابع باستخدام</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mt-6">
                    <SocialButton icon={<Chrome />} label="Google" color="from-red-500 to-yellow-500" />
                    <SocialButton icon={<Facebook />} label="Facebook" color="from-blue-600 to-blue-400" />
                    <SocialButton icon={<MessageCircle />} label="Discord" color="from-indigo-600 to-indigo-400" />
                    <SocialButton
                      icon={
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      }
                      label="X"
                      color="from-gray-700 to-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InputField({
  icon,
  type,
  placeholder,
  value,
  onChange,
  rightIcon,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightIcon?: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
      <div className="relative flex items-center bg-gray-800/50 rounded-xl border border-gray-700/50 group-hover:border-cyan-500/50 transition-all">
        <div className="pr-4 text-gray-400 group-hover:text-cyan-400 transition-colors">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent px-4 py-4 text-white placeholder-gray-500 focus:outline-none"
        />
        {rightIcon && (
          <div className="pl-4">
            {rightIcon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SocialButton({
  icon,
  label,
  color
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      className="relative p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 transition-all group overflow-hidden"
      title={label}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 transition-opacity`}
      />
      <div className="relative text-gray-400 group-hover:text-white transition-colors flex justify-center">
        {icon}
      </div>
    </motion.button>
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 -left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
      />

      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/50 rounded-full"
            style={{
              left: `${(i * 13.7) % 100}%`,
              top: `${(i * 17.3) % 100}%`,
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + (i % 10),
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
    </div>
  );
}