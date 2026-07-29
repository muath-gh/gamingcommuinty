import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const GENRE_LABELS: Record<string, string> = {
  linear: 'خطي',
  'open-world': 'عالم مفتوح',
  metroidvania: 'ميترودفانيا',
  roguelike: 'روغ لايك',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  hard: 'صعب',
  adjustable: 'عادي/قابل للتعديل',
};

const PLAYSTYLE_LABELS: Record<string, string> = {
  exploration: 'استكشاف وحل الألغاز',
  'story-driven': 'مدفوع بالقصة',
  'combat-focused': 'قتال',
  stealth: 'تسلل',
};

interface EvaluateProfile {
  genrePref?: string | null;
  difficultyPref?: string | null;
  playstyle?: string[];
  playedGames?: string[];
}

function buildProfileSummary(profile?: EvaluateProfile) {
  const genre = (profile?.genrePref && GENRE_LABELS[profile.genrePref]) || 'غير محدد';
  const difficulty = (profile?.difficultyPref && DIFFICULTY_LABELS[profile.difficultyPref]) || 'غير محدد';
  const playstyle = (profile?.playstyle || []).map((p) => PLAYSTYLE_LABELS[p] || p).join('، ') || 'غير محدد';
  const playedGames = (profile?.playedGames || []).join('، ') || 'لا يوجد';

  return `تفضيل النوع: ${genre}\nتفضيل الصعوبة: ${difficulty}\nأسلوب اللعب المفضل: ${playstyle}\nألعاب سبق أن لعبها: ${playedGames}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'ميزة الذكاء الاصطناعي غير متوفرة بعد. يرجى إضافة مفتاح OpenAI API.' },
      { status: 500 }
    );
  }

  let body: { profile?: EvaluateProfile; gameName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  }

  const gameName = typeof body?.gameName === 'string' ? body.gameName.trim() : '';
  if (!gameName) {
    return NextResponse.json({ error: 'يرجى إدخال اسم لعبة' }, { status: 400 });
  }

  const profileSummary = buildProfileSummary(body?.profile);

  try {
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'أنت خبير تقييم توافق الألعاب. بناءً على الملف الشخصي للاعب واسم اللعبة المدخلة، قيّم مدى توافق اللعبة مع تفضيلات اللاعب. أجب حصراً ببنية JSON بالشكل التالي، وباللغة العربية: ' +
            '{"matchScore": رقم من 0 إلى 100, "verdict": "عبارة قصيرة تلخص النتيجة", "explanation": "شرح شخصي في 2-4 جمل عن سبب توافق أو عدم توافق اللعبة مع ملف اللاعب"}',
        },
        {
          role: 'user',
          content: `الملف الشخصي للاعب:\n${profileSummary}\n\nاسم اللعبة المطلوب تقييمها: ${gameName}`,
        },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content;
    const parsed = JSON.parse(raw || '{}');

    const matchScore = Math.max(0, Math.min(100, Math.round(Number(parsed.matchScore) || 0)));

    return NextResponse.json({
      matchScore,
      verdict: String(parsed.verdict || ''),
      explanation: String(parsed.explanation || ''),
    });
  } catch (error) {
    console.error('OpenAI evaluate error:', error);
    return NextResponse.json({ error: 'تعذر تقييم اللعبة حالياً، حاول مرة أخرى لاحقاً' }, { status: 502 });
  }
}
