'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader as Loader2, CircleAlert as AlertCircle, CircleCheck as CheckCircle2, X, Chrome, Facebook, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/providers/AuthProvider';
type ValidationError = { field: string; message: string };

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
      if (!username.trim()) errors.push({ field: 'username', message: 'اسم المستخدم مطلوب' });
      else if (username.length < 3) errors.push({ field: 'username', message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' });
      else if (!/^[a-zA-Z0-9_]+$/.test(username)) errors.push({ field: 'username', message: 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام فقط' });
    }
    if (!email.trim()) errors.push({ field: 'email', message: 'البريد الإلكتروني مطلوب' });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push({ field: 'email', message: 'البريد الإلكتروني غير صالح' });
    if (!password) errors.push({ field: 'password', message: 'كلمة المرور مطلوبة' });
    else if (password.length < 6) errors.push({ field: 'password', message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    else if (!isLogin && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) errors.push({ field: 'password', message: 'كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام' });
    if (!isLogin) {
      if (!confirmPassword) errors.push({ field: 'confirmPassword', message: 'تأكيد كلمة المرور مطلوب' });
      else if (password !== confirmPassword) errors.push({ field: 'confirmPassword', message: 'كلمات المرور غير متطابقة' });
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(''); setSuccess(''); setValidationErrors([]);
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isLogin) {
        const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'حدث خطأ أثناء تسجيل الدخول');
        setSuccess(data.message);
        await refetch();
        router.push('/');
      } else {
        const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password, confirmPassword }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'حدث خطأ أثناء إنشاء الحساب');
        setSuccess(data.message);
        await refetch();
        router.push('/');
      }
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden ambient-bg" dir="rtl">
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-neon-blue/12 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-neon-red/10 rounded-full blur-3xl animate-pulse-glow" />

      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-8 right-8 z-20 flex items-center gap-2 px-6 py-3 rounded-xl glass-strong text-cream-muted hover:text-cream transition-all"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="font-semibold">العودة للرئيسية</span>
        </motion.button>
      </Link>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue/30 via-transparent to-neon-red/30 rounded-2xl blur-lg opacity-60" />
            <div className="relative glass-strong rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-neon-blue via-cream/20 to-neon-red" />

              <div className="p-8">
                <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-8">
                  <h1 className="text-4xl font-black mb-2 text-cream">
                    {isLogin ? 'أهلاً بعودتك' : 'انضم إلينا'}
                  </h1>
                  <p className="text-cream-muted">
                    {isLogin ? 'أدخل بياناتك للمتابعة' : 'أنشئ حساب الألعاب الخاص بك'}
                  </p>
                </motion.div>

                <AnimatePresence>
                  {validationErrors.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                      <div className="relative bg-neon-red/10 border border-neon-red/40 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <h3 className="font-bold text-red-400">تنبيه!</h3>
                          </div>
                          <button onClick={() => setValidationErrors([])} className="p-1 hover:bg-neon-red/20 rounded-lg transition-colors">
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          {validationErrors.map((error, index) => (
                            <motion.div key={index} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-2 text-red-300 bg-neon-red/10 p-2.5 rounded-lg border border-neon-red/20">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                              <span className="text-sm">{error.message}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {apiError && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                      <div className="relative bg-amber-500/10 border border-amber-500/40 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-400" />
                            <div>
                              <h3 className="font-bold text-amber-400 mb-0.5">خطأ</h3>
                              <p className="text-sm text-amber-300">{apiError}</p>
                            </div>
                          </div>
                          <button onClick={() => setApiError('')} className="p-1 hover:bg-amber-500/20 rounded-lg transition-colors">
                            <X className="w-4 h-4 text-amber-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {success && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                      <div className="relative bg-emerald-600/10 border border-emerald-500/40 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <div>
                              <h3 className="font-bold text-emerald-400 mb-0.5">نجح!</h3>
                              <p className="text-sm text-emerald-300">{success}</p>
                            </div>
                          </div>
                          <button onClick={() => setSuccess('')} className="p-1 hover:bg-emerald-600/20 rounded-lg transition-colors">
                            <X className="w-4 h-4 text-emerald-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2 mb-6 p-1 bg-ink-900/60 rounded-xl border border-neon-blue/15">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setIsLogin(true); setApiError(''); setSuccess(''); setValidationErrors([]); }} className={`flex-1 py-3 rounded-lg font-semibold transition-all ${isLogin ? 'btn-primary' : 'text-cream-muted hover:text-cream'}`}>
                    تسجيل الدخول
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setIsLogin(false); setApiError(''); setSuccess(''); setValidationErrors([]); }} className={`flex-1 py-3 rounded-lg font-semibold transition-all ${!isLogin ? 'btn-secondary' : 'text-cream-muted hover:text-cream'}`}>
                    إنشاء حساب
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div key="username" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                        <InputField icon={<User className="w-5 h-5" />} type="text" placeholder="اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <InputField icon={<Mail className="w-5 h-5" />} type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <InputField icon={<Lock className="w-5 h-5" />} type={showPassword ? 'text' : 'password'} placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)} className="text-cream-muted hover:text-cream transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>} />
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div key="confirm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                        <InputField icon={<Lock className="w-5 h-5" />} type={showPassword ? 'text' : 'password'} placeholder="تأكيد كلمة المرور" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isLogin && (
                    <div className="flex justify-end">
                      <button type="button" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">نسيت كلمة المرور؟</button>
                    </div>
                  )}
                  <motion.button whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }} type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="flex items-center justify-center gap-2">
                      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                      {loading ? 'جاري المعالجة...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
                    </span>
                  </motion.button>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full tech-divider" /></div>
                    <div className="relative flex justify-center text-sm"><span className="px-4 glass-strong text-cream-muted">أو تابع باستخدام</span></div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mt-6">
                    <SocialButton icon={<Chrome />} label="Google" />
                    <SocialButton icon={<Facebook />} label="Facebook" />
                    <SocialButton icon={<MessageCircle />} label="Discord" />
                    <SocialButton icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>} label="X" />
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

function InputField({ icon, type, placeholder, value, onChange, rightIcon }: { icon: React.ReactNode; type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; rightIcon?: React.ReactNode; }) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} className="relative group">
      <div className="relative flex items-center input-gaming rounded-xl group-focus-within:border-neon-blue/70">
        <div className="pr-4 text-cream-muted group-focus-within:text-blue-400 transition-colors">{icon}</div>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="flex-1 bg-transparent px-4 py-4 text-cream placeholder:cream-muted/50 focus:outline-none" />
        {rightIcon && <div className="pl-4">{rightIcon}</div>}
      </div>
    </motion.div>
  );
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string; }) {
  return (
    <motion.button whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }} type="button" className="relative p-4 rounded-xl glass border-neon-blue/20 hover:border-neon-blue/50 transition-all group" title={label}>
      <div className="text-cream-muted group-hover:text-cream transition-colors flex justify-center">{icon}</div>
    </motion.button>
  );
}
