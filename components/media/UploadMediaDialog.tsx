// components/media/UploadDialog.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  X,
  Upload,
  Image as ImageIcon,
  Video,
  Sparkles,
  Check,
  Zap,
  Tag,
} from 'lucide-react';
import { GamingCard } from '@/components/gaming/GamingCard';
import { useEffect } from 'react'
import { GamingButton } from '@/components/gaming/GamingButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GameDTO } from '@/lib/dto/game.dto';



const MOCK_TAGS = [
  'ملحمي',
  'مضحك',
  'احترافي',
  'منافسة',
  'تعاون',
  'سولو',
  'فوز',
  'هزيمة',
];

type FileWithPreview = {
  file: File;
  preview: string;
  progress: number;
  uploaded: boolean;
};

export default function UploadMediaDialog({
  showUploadModal,
  setShowUploadModal,
}: {
  showUploadModal: boolean;
  setShowUploadModal: (show: boolean) => void;
}) {

  const [games, setGames] = useState<GameDTO[]>([])
const [selectedGame, setSelectedGame] = useState<string>('') // UUID
const [gamesLoading, setGamesLoading] = useState(false)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
 
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
useEffect(() => {
  const loadGames = async () => {
    try {
      setGamesLoading(true)
      const res = await fetch('/api/games')
      if (!res.ok) throw new Error('Failed to load games')
      const data: GameDTO[] = await res.json()
      setGames(data)
    } catch (err) {
      console.error('Error loading games', err)
    } finally {
      setGamesLoading(false)
    }
  }

  loadGames()
}, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept:
      mediaType === 'image'
        ? { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }
        : { 'video/*': ['.mp4', '.webm'] },
    maxSize: mediaType === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false,
      }));
      setFiles((prev) => [...prev, ...newFiles]);

      // محاكاة رفع الملف
      newFiles.forEach((fileObj, index) => {
        simulateUpload(files.length + index);
      });
    },
  });

  const simulateUpload = (fileIndex: number) => {
    const interval = setInterval(() => {
      setFiles((prev) => {
        const updated = [...prev];
        if (updated[fileIndex].progress < 100) {
          updated[fileIndex].progress += 10;
        } else {
          updated[fileIndex].uploaded = true;
          clearInterval(interval);
        }
        return updated;
      });
    }, 200);
  };

  const removeFile = (preview: string) => {
    setFiles((prev) => prev.filter((f) => f.preview !== preview));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    if (!title || files.length === 0) {
      alert('الرجاء إدخال العنوان واختيار ملف واحد على الأقل');
      return;
    }

    setIsSubmitting(true);

    try {
      // رفع كل ملف
      for (const fileObj of files) {
        const formData = new FormData();
        formData.append('file', fileObj.file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', mediaType);
        formData.append('gameId', selectedGame);
        formData.append('isFeatured', String(featured));
        formData.append('tags', JSON.stringify(selectedTags));

        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'حدث خطأ أثناء الرفع');
        }

        console.log('تم رفع الملف:', data);
      }

      // نجح الرفع
      alert('تم رفع الميديا بنجاح! 🎉');
      
      // إعادة تعيين النموذج
      setTitle('');
      setDescription('');
      setSelectedGame('');
      setSelectedTags([]);
      setFeatured(false);
      setFiles([]);
      setShowUploadModal(false);

      // إعادة تحميل الصفحة لعرض الميديا الجديدة
      window.location.reload();
    } catch (error: any) {
      console.error('خطأ في الرفع:', error);
      alert(error.message || 'حدث خطأ أثناء رفع الملف');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto neon-border-blue shadow-2xl"
            dir="rtl"
          >
            <div className="sticky top-0 z-10 glass-strong border-b border-neon-blue/15 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-blue-400" />
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold text-cream text-glow-blue">
                      رفع ميديا
                    </h2>
                    <p className="text-cream-muted text-sm mt-1">
                      شارك لحظاتك الملحمية في الألعاب
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 rounded-lg glass border-neon-blue/20 hover:border-neon-blue/50 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <GamingCard className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <Label className="text-lg font-semibold text-cream">
                        نوع الميديا
                      </Label>
                      <div className="flex gap-2">
                        {(['image', 'video'] as const).map((type) => (
                          <motion.button
                            key={type}
                            onClick={() => setMediaType(type)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                              mediaType === type
                                ? 'btn-primary glow-blue'
                                : 'btn-ghost'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {type === 'image' ? (
                              <ImageIcon className="w-4 h-4" />
                            ) : (
                              <Video className="w-4 h-4" />
                            )}
                            {type === 'image' ? 'صورة' : 'فيديو'}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div
                      {...getRootProps()}
                      className={`relative border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer ${
                        isDragActive
                          ? 'border-neon-blue bg-neon-blue/10 shadow-lg shadow-[0_0_20px_rgba(32,88,154,0.3)]'
                          : 'border-neon-blue/25 hover:border-neon-blue/60 bg-ink-900/50'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center justify-center text-center">
                        <motion.div
                          animate={{
                            y: isDragActive ? -10 : 0,
                            scale: isDragActive ? 1.2 : 1,
                          }}
                          className="mb-4"
                        >
                          <Upload
                            className={`w-16 h-16 ${
                              isDragActive ? 'text-blue-400' : 'text-cream-muted'
                            }`}
                          />
                        </motion.div>
                        <p className="text-xl font-semibold text-cream mb-2">
                          {isDragActive
                            ? 'أفلت الملفات هنا!'
                            : 'اسحب وأفلت الملفات هنا'}
                        </p>
                        <p className="text-cream-muted mb-4">
                          أو انقر للتصفح من جهازك
                        </p>
                        <div className="flex gap-4 text-sm text-cream-muted">
                          <span>
                            الحد الأقصى: {mediaType === 'image' ? '10 ميجابايت' : '100 ميجابايت'}
                          </span>
                          <span>•</span>
                          <span>
                            الصيغ:{' '}
                            {mediaType === 'image'
                              ? 'JPG, PNG, GIF'
                              : 'MP4, WebM'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {files.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        <AnimatePresence>
                          {files.map((file) => (
                            <motion.div
                              key={file.preview}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="relative group rounded-lg overflow-hidden surface border-neon-blue/15"
                              whileHover={{ scale: 1.05 }}
                            >
                              <div
                                className="relative aspect-video cursor-pointer"
                                onClick={() => setExpandedFile(file.preview)}
                              >
                                {mediaType === 'image' ? (
                                  <img
                                    src={file.preview}
                                    alt={file.file.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <video
                                    src={file.preview}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>

                              <div className="p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-cream truncate">
                                      {file.file.name}
                                    </p>
                                    <p className="text-xs text-cream-muted">
                                      {formatFileSize(file.file.size)}
                                    </p>
                                  </div>
                                  <motion.button
                                    onClick={() => removeFile(file.preview)}
                                    className="mr-2 p-1 rounded-lg bg-neon-red/20 text-red-400 hover:bg-neon-red hover:text-cream transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <X className="w-4 h-4" />
                                  </motion.button>
                                </div>

                                <div className="relative h-2 bg-ink-900/80 rounded-full overflow-hidden border border-neon-blue/10">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${file.progress}%` }}
                                    className={`h-full rounded-full ${
                                      file.uploaded
                                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                                        : 'bg-gradient-to-r from-neon-blue to-blue-400'
                                    }`}
                                  />
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-cream-muted">
                                    {file.progress}%
                                  </span>
                                  {file.uploaded && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                    >
                                      <Check className="w-4 h-4 text-emerald-400" />
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </GamingCard>

                  <GamingCard className="p-6">
                    <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      تفاصيل الميديا
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="title" className="text-white mb-2 block">
                          العنوان <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="أدخل عنواناً ملحمياً..."
                          className="input-gaming"
                          maxLength={100}
                          dir="auto"
                        />
                        <p className="text-xs text-cream-muted mt-1 text-left">
                          {title.length}/100
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="description"
                          className="text-cream mb-2 block"
                        >
                          الوصف
                        </Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="أخبرنا عن هذه اللحظة..."
                          className="input-gaming min-h-[120px]"
                          maxLength={500}
                          dir="auto"
                        />
                        <p className="text-xs text-cream-muted mt-1 text-left">
                          {description.length}/500
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="game" className="text-cream mb-2 block">
                          اللعبة
                        </Label>
                     <Select
  value={selectedGame}
  onValueChange={setSelectedGame}
>
  <SelectTrigger className="input-gaming">
    <SelectValue
      placeholder={gamesLoading ? 'جاري تحميل الألعاب...' : 'اختر لعبة'}
    />
  </SelectTrigger>

  <SelectContent className="glass-strong border-neon-blue/20">
    {games.map((game) => (
      <SelectItem
        key={game.id}
        value={game.id}    
        className="text-cream hover:bg-neon-blue/10"
      >
        {game.name}        
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                      </div>
                    </div>
                  </GamingCard>
                </div>

                <div className="space-y-6">
                  <GamingCard className="p-6">
                    <h2 className="text-xl font-bold text-cream mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-blue-400" />
                      الوسوم
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {MOCK_TAGS.map((tag) => (
                        <motion.button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            selectedTags.includes(tag)
                              ? 'btn-primary glow-blue'
                              : 'btn-ghost'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {selectedTags.includes(tag) && (
                            <Check className="w-3 h-3 inline ml-1" />
                          )}
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </GamingCard>

                  <GamingCard className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="featured"
                          className="text-cream font-semibold"
                        >
                          محتوى مميز
                        </Label>
                        <p className="text-sm text-cream-muted mt-1">
                          إبرازه في المعرض
                        </p>
                      </div>
                      <motion.div
                        animate={{
                          boxShadow: featured
                            ? '0 0 20px rgba(32, 88, 154, 0.5)'
                            : '0 0 0px rgba(32, 88, 154, 0)',
                        }}
                        className="rounded-full"
                      >
                        <Switch
                          id="featured"
                          checked={featured}
                          onCheckedChange={setFeatured}
                        />
                      </motion.div>
                    </div>
                  </GamingCard>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <GamingButton
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full h-14 text-lg font-bold relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-neon-blue via-blue-500 to-neon-red"
                        animate={{
                          x: isSubmitting ? ['-100%', '100%'] : '0%',
                        }}
                        transition={{
                          duration: 1,
                          repeat: isSubmitting ? Infinity : 0,
                        }}
                      />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                            >
                              <Sparkles className="w-5 h-5" />
                            </motion.div>
                            جاري الرفع...
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
                            نشر الميديا
                          </>
                        )}
                      </span>
                    </GamingButton>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <AnimatePresence>
        {expandedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedFile(null)}
            className="fixed inset-0 z-[60] bg-ink-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <button
                onClick={() => setExpandedFile(null)}
                className="absolute -top-12 left-0 p-2 rounded-lg glass-strong hover:border-neon-blue/50 text-cream transition-colors neon-border-blue"
              >
                <X className="w-6 h-6" />
              </button>
              {mediaType === 'image' ? (
                <img
                  src={expandedFile}
                  alt="معاينة"
                  className="w-full h-auto rounded-xl"
                />
              ) : (
                <video
                  src={expandedFile}
                  controls
                  className="w-full h-auto rounded-xl"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}