/*
  # مخطط المراجعات والأخبار

  1. جداول جديدة
    - `game_reviews`
      - `id` (uuid, primary key)
      - `title` (text) - عنوان المراجعة
      - `game_name` (text) - اسم اللعبة
      - `slug` (text, unique) - للروابط الودية
      - `cover_image` (text) - صورة الغلاف
      - `excerpt` (text) - مقتطف قصير
      - `content` (text) - محتوى المراجعة الكامل
      - `author_name` (text) - اسم الكاتب
      - `author_avatar` (text) - صورة الكاتب
      - `rating` (decimal) - التقييم من 10
      - `gameplay_rating` (integer) - تقييم اللعب
      - `graphics_rating` (integer) - تقييم الرسومات
      - `story_rating` (integer) - تقييم القصة
      - `sound_rating` (integer) - تقييم الصوت
      - `platforms` (text[]) - المنصات المتاحة
      - `genre` (text) - النوع
      - `developer` (text) - المطور
      - `release_date` (text) - تاريخ الإصدار
      - `views_count` (integer) - عدد المشاهدات
      - `likes_count` (integer) - عدد الإعجابات
      - `published` (boolean) - منشور؟
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `game_news`
      - `id` (uuid, primary key)
      - `title` (text) - عنوان الخبر
      - `slug` (text, unique) - للروابط الودية
      - `cover_image` (text) - صورة الغلاف
      - `excerpt` (text) - مقتطف قصير
      - `content` (text) - محتوى الخبر الكامل
      - `author_name` (text) - اسم الكاتب
      - `author_avatar` (text) - صورة الكاتب
      - `category` (text) - الفئة (أخبار، تحديثات، إعلانات، إلخ)
      - `tags` (text[]) - الوسوم
      - `views_count` (integer) - عدد المشاهدات
      - `likes_count` (integer) - عدد الإعجابات
      - `published` (boolean) - منشور؟
      - `is_featured` (boolean) - خبر مميز؟
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - يمكن للجميع قراءة المحتوى المنشور
    - فقط المستخدمين المصرح لهم يمكنهم الإنشاء/التعديل
*/

-- إنشاء جدول مراجعات الألعاب
CREATE TABLE IF NOT EXISTS game_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  game_name text NOT NULL,
  slug text UNIQUE NOT NULL,
  cover_image text DEFAULT '',
  excerpt text DEFAULT '',
  content text DEFAULT '',
  author_name text DEFAULT 'فريق التحرير',
  author_avatar text DEFAULT '',
  rating decimal(3,1) DEFAULT 0.0,
  gameplay_rating integer DEFAULT 0,
  graphics_rating integer DEFAULT 0,
  story_rating integer DEFAULT 0,
  sound_rating integer DEFAULT 0,
  platforms text[] DEFAULT '{}',
  genre text DEFAULT '',
  developer text DEFAULT '',
  release_date text DEFAULT '',
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول أخبار الألعاب
CREATE TABLE IF NOT EXISTS game_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  cover_image text DEFAULT '',
  excerpt text DEFAULT '',
  content text DEFAULT '',
  author_name text DEFAULT 'فريق التحرير',
  author_avatar text DEFAULT '',
  category text DEFAULT 'أخبار',
  tags text[] DEFAULT '{}',
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  published boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE game_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_news ENABLE ROW LEVEL SECURITY;

-- سياسات المراجعات
CREATE POLICY "يمكن للجميع قراءة المراجعات المنشورة"
  ON game_reviews FOR SELECT
  USING (published = true);

CREATE POLICY "يمكن للمستخدمين المصادق عليهم إنشاء مراجعات"
  ON game_reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "يمكن للمستخدمين المصادق عليهم تحديث المراجعات"
  ON game_reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- سياسات الأخبار
CREATE POLICY "يمكن للجميع قراءة الأخبار المنشورة"
  ON game_news FOR SELECT
  USING (published = true);

CREATE POLICY "يمكن للمستخدمين المصادق عليهم إنشاء أخبار"
  ON game_news FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "يمكن للمستخدمين المصادق عليهم تحديث الأخبار"
  ON game_news FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_game_reviews_slug ON game_reviews(slug);
CREATE INDEX IF NOT EXISTS idx_game_reviews_published ON game_reviews(published);
CREATE INDEX IF NOT EXISTS idx_game_reviews_created_at ON game_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_news_slug ON game_news(slug);
CREATE INDEX IF NOT EXISTS idx_game_news_published ON game_news(published);
CREATE INDEX IF NOT EXISTS idx_game_news_featured ON game_news(is_featured);
CREATE INDEX IF NOT EXISTS idx_game_news_created_at ON game_news(created_at DESC);

-- إدراج بيانات تجريبية للمراجعات
INSERT INTO game_reviews (title, game_name, slug, cover_image, excerpt, content, author_name, rating, gameplay_rating, graphics_rating, story_rating, sound_rating, platforms, genre, developer, release_date, views_count, likes_count)
VALUES 
(
  'ذا لاست أوف أس بارت 2 - مراجعة شاملة',
  'The Last of Us Part II',
  'the-last-of-us-part-2-review',
  'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress',
  'تحفة فنية تعيد تعريف معايير سرد القصص في الألعاب، مع رسومات مذهلة وأداء تمثيلي استثنائي.',
  'تعد The Last of Us Part II واحدة من أكثر الألعاب طموحًا وإثارة للجدل في تاريخ الألعاب. تقدم اللعبة تجربة عاطفية عميقة مع قصة معقدة تتحدى توقعات اللاعبين. الرسومات مذهلة بكل المقاييس، والأداء التمثيلي يضع معايير جديدة للصناعة. نظام القتال محسّن بشكل كبير عن الجزء الأول، مع المزيد من الخيارات التكتيكية والحركات السلسة. الصوت والموسيقى التصويرية تخلق جوًا مثاليًا يعزز التجربة العاطفية. على الرغم من أن القصة قد تكون مثيرة للجدل لدى البعض، إلا أنها تجربة لا يمكن نسيانها.',
  'أحمد الغامدي',
  9.5,
  9,
  10,
  9,
  10,
  ARRAY['بلايستيشن 4', 'بلايستيشن 5', 'الحاسوب'],
  'أكشن، مغامرات، رعب البقاء',
  'Naughty Dog',
  'يونيو 2020',
  15420,
  892
),
(
  'إلدن رينج - رحلة ملحمية في عالم مفتوح',
  'Elden Ring',
  'elden-ring-review',
  'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress',
  'تحفة من FromSoftware تجمع بين صعوبة Dark Souls وحرية العالم المفتوح في تجربة لا تُنسى.',
  'Elden Ring هي تحفة فنية من FromSoftware بالتعاون مع George R.R. Martin. تقدم اللعبة عالمًا مفتوحًا شاسعًا مليئًا بالأسرار والتحديات. نظام القتال عميق ومرضٍ، يكافئ المهارة والصبر. التصميم الفني مذهل، حيث يقدم مناظر طبيعية متنوعة وأعداء فريدة. القصة غامضة ومثيرة للاهتمام، تُروى من خلال العالم نفسه. الصعوبة عالية لكنها عادلة، وكل انتصار يشعرك بالإنجاز الحقيقي. اللعبة توفر ساعات لا نهائية من الاستكشاف والقتال.',
  'فاطمة المطيري',
  9.8,
  10,
  9,
  8,
  9,
  ARRAY['بلايستيشن 4', 'بلايستيشن 5', 'إكس بوكس', 'الحاسوب'],
  'أكشن، لعب الأدوار',
  'FromSoftware',
  'فبراير 2022',
  28750,
  1456
),
(
  'جود أوف وور راجناروك - ختام ملحمي للأسطورة',
  'God of War Ragnarök',
  'god-of-war-ragnarok-review',
  'https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress',
  'تكملة رائعة تحسن كل شيء من الجزء السابق مع قصة عاطفية وقتال محسّن.',
  'God of War Ragnarök يرتقي بكل جانب من أجزاء اللعبة السابقة. العلاقة بين كريتوس وأتريوس تتطور بشكل طبيعي ومؤثر. نظام القتال أكثر تنوعًا مع أسلحة وقدرات جديدة. العوالم التسعة مصممة بعناية فائقة، كل منها فريد وممتع للاستكشاف. الرسومات على PS5 مذهلة مع معدل إطارات سلس. الموسيقى والصوت يخلقان جوًا ملحميًا حقيقيًا. القصة الرئيسية عميقة ومليئة باللحظات العاطفية، بينما المهام الجانبية غنية بالمحتوى.',
  'خالد الشهري',
  9.7,
  10,
  10,
  9,
  10,
  ARRAY['بلايستيشن 4', 'بلايستيشن 5'],
  'أكشن، مغامرات',
  'Santa Monica Studio',
  'نوفمبر 2022',
  21890,
  1203
);

-- إدراج بيانات تجريبية للأخبار
INSERT INTO game_news (title, slug, cover_image, excerpt, content, author_name, category, tags, is_featured, views_count, likes_count)
VALUES
(
  'الإعلان عن Grand Theft Auto VI رسميًا - كل التفاصيل',
  'gta-6-official-announcement',
  'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress',
  'بعد سنوات من الانتظار، أعلنت Rockstar Games رسميًا عن GTA VI مع أول تريلر مذهل.',
  'في حدث تاريخي لعالم الألعاب، كشفت Rockstar Games أخيرًا عن Grand Theft Auto VI. التريلر الأول يعد بعالم أكبر وأكثر حيوية من أي وقت مضى. اللعبة ستتم في مدينة خيالية مستوحاة من ميامي مع شخصيتين رئيسيتين قابلتين للعب. التقنيات المستخدمة تدفع حدود الجيل الحالي من الأجهزة. محرك RAGE الجديد يقدم فيزياء وإضاءة واقعية بشكل لم نشهده من قبل. تاريخ الإصدار المتوقع هو 2025، حصريًا على أجهزة الجيل الحالي والحاسوب. المجتمع متحمس للغاية، والتريلر حقق أرقامًا قياسية في عدد المشاهدات.',
  'سارة العتيبي',
  'إعلانات',
  ARRAY['GTA', 'Rockstar', 'إعلانات', 'ألعاب مفتوحة'],
  true,
  45230,
  2890
),
(
  'تحديث ضخم قادم لـ Fortnite يضيف وضع لعب جديد كليًا',
  'fortnite-major-update-new-mode',
  'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress',
  'Epic Games تعلن عن تحديث كبير يتضمن وضع PvE جديد وخريطة موسعة.',
  'أعلنت Epic Games عن التحديث الأكبر لـ Fortnite منذ سنوات. الوضع الجديد "صراع الأساطير" يجمع بين عناصر PvE وPvP في تجربة فريدة. الخريطة الجديدة ضعف حجم الخريطة الحالية مع بيئات متنوعة. أسلحة جديدة وميكانيكيات بناء محسّنة ستغير استراتيجيات اللعب. نظام التقدم يحصل على إصلاح شامل مع مكافآت أفضل. الحدث الافتتاحي سيكون أكبر حدث حي في تاريخ اللعبة. التحديث مجاني لجميع اللاعبين ويصدر الشهر المقبل.',
  'محمد الدوسري',
  'تحديثات',
  ARRAY['Fortnite', 'تحديثات', 'Epic Games'],
  true,
  32100,
  1567
),
(
  'مبيعات بلايستيشن 5 تتجاوز 50 مليون جهاز عالميًا',
  'ps5-sales-milestone-50-million',
  'https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress',
  'Sony تحتفل بمعلم مهم مع استمرار الطلب القوي على الجهاز.',
  'أعلنت Sony رسميًا أن مبيعات PlayStation 5 تجاوزت 50 مليون وحدة عالميًا. هذا الإنجاز يأتي بعد ثلاث سنوات من الإطلاق، على الرغم من تحديات سلسلة التوريد الأولية. الطلب لا يزال قويًا مع توفر أفضل للأجهزة. ألعاب حصرية قادمة تعد بدفع المبيعات أكثر. Sony تعلن عن خطط لنموذج Slim الجديد وتحديثات للبرمجيات. المستقبل يبدو مشرقًا لمنصة PlayStation.',
  'نورة القحطاني',
  'أخبار',
  ARRAY['PlayStation', 'Sony', 'مبيعات'],
  false,
  18900,
  734
),
(
  'الكشف عن تاريخ إصدار Hollow Knight: Silksong أخيرًا',
  'hollow-knight-silksong-release-date',
  'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress',
  'بعد سنوات من الانتظار، Team Cherry تعلن عن موعد إطلاق التتمة المنتظرة.',
  'في إعلان مفاجئ، كشفت Team Cherry عن تاريخ إصدار Hollow Knight: Silksong. اللعبة ستصدر في الربع الثاني من 2024 على جميع المنصات. التريلر الجديد يعرض عوالم جديدة مذهلة وميكانيكيات لعب محسّنة. الشخصية الرئيسية هورنت تقدم أسلوب لعب مختلف عن نايت الأصلي. الموسيقى التصويرية مرة أخرى من تأليف Christopher Larkin. المجتمع متحمس بشكل لا يصدق بعد الانتظار الطويل.',
  'عبدالله الحربي',
  'أخبار',
  ARRAY['Hollow Knight', 'إندي', 'تواريخ إصدار'],
  false,
  25600,
  1876
);
