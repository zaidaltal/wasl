// Privacy Policy and Terms of Service content, in English and Arabic.
// Describes what the app actually does today (see database/schema.sql and lib/auth.ts).
// Have a lawyer review before launch; update LEGAL_UPDATED whenever the text changes.

export const LEGAL_UPDATED = '2026-10-13';
export const CONTACT_EMAIL = 'hello@wasl.jo';

export type LegalBlock = string | { list: string[] };
export interface LegalSection {
  id: string;
  title: string;
  body: LegalBlock[];
}
export interface LegalDoc {
  title: string;
  intro: string;
  sections: LegalSection[];
}

type Locale = 'en' | 'ar';

const privacy: Record<Locale, LegalDoc> = {
  en: {
    title: 'Privacy policy',
    intro:
      'This policy explains what information Wasl collects when you use the marketplace, why we collect it, and the choices you have. We keep it short and only describe what the service actually does.',
    sections: [
      {
        id: 'who-we-are',
        title: 'Who we are',
        body: [
          `Wasl is a freelance marketplace that connects businesses with freelancers in Jordan and across the Arab world. If you have a question about this policy or your data, email us at ${CONTACT_EMAIL}.`,
        ],
      },
      {
        id: 'what-we-collect',
        title: 'Information you give us',
        body: [
          'We only collect what you enter into Wasl:',
          {
            list: [
              'Account details: your name, email address, password, and whether you joined as a client or a freelancer. Passwords are stored as a one-way hash, never in plain text.',
              'Profile details: country, city, and profile photo. Freelancers can add a bio, skills, portfolio links, and an hourly rate. Clients can add a company name, description, and website.',
              'Marketplace activity: the jobs you post, the applications and cover letters you send, and whether an application was accepted or rejected.',
            ],
          },
          'We do not collect payment card details. Wasl does not process payments.',
        ],
      },
      {
        id: 'cookies',
        title: 'Cookies and storage on your device',
        body: [
          'Wasl uses a small number of strictly necessary items to work:',
          {
            list: [
              'wasl_token and wasl_user cookies keep you signed in. They expire after 7 days or when you log out.',
              'wasl_theme in your browser storage remembers whether you chose light or dark mode.',
            ],
          },
          'We do not use advertising cookies, cross-site tracking, or third-party analytics.',
        ],
      },
      {
        id: 'how-we-use',
        title: 'How we use your information',
        body: [
          {
            list: [
              'To create and secure your account and keep you signed in.',
              'To show your public profile and job posts to other people on Wasl.',
              'To let a client review the applications sent to their job.',
              'To contact you about your account when needed.',
              'To keep the marketplace safe, including investigating misuse.',
            ],
          },
        ],
      },
      {
        id: 'who-can-see',
        title: 'What other people can see',
        body: [
          'Some information is public so the marketplace can work:',
          {
            list: [
              'Freelancers: your name, photo, country, city, bio, skills, portfolio links, and hourly rate.',
              'Clients: your name or company name, country, and the jobs you post.',
              'Applications and cover letters are only visible to you and to the client who posted that job.',
            ],
          },
          'Your email address and password are never shown publicly.',
        ],
      },
      {
        id: 'sharing',
        title: 'Sharing',
        body: [
          'We do not sell your personal information and we do not share it with advertisers. We may disclose information if the law requires it, or to protect the safety of our users and the service.',
        ],
      },
      {
        id: 'retention',
        title: 'How long we keep it',
        body: [
          'We keep your information while your account is open. When an account is deleted, its profile, job posts, and applications are deleted with it.',
        ],
      },
      {
        id: 'your-choices',
        title: 'Your choices',
        body: [
          'You can view and edit your profile at any time from your profile page. To get a copy of your data, correct something you cannot edit, or delete your account, email us from the address on your account and we will handle it.',
        ],
      },
      {
        id: 'security',
        title: 'Security',
        body: [
          'We hash passwords and use signed tokens to authenticate requests. No online service can be perfectly secure, so please use a strong password that you do not use anywhere else.',
        ],
      },
      {
        id: 'changes',
        title: 'Changes to this policy',
        body: [
          'If we change this policy, we will update the date at the top of this page. For significant changes, we will let you know before they take effect.',
        ],
      },
    ],
  },
  ar: {
    title: 'سياسة الخصوصية',
    intro:
      'توضح هذه السياسة المعلومات التي يجمعها وصل عند استخدامك للمنصة، وسبب جمعها، والخيارات المتاحة لك. نحرص على أن تكون مختصرة وأن تصف فقط ما تفعله الخدمة فعلًا.',
    sections: [
      {
        id: 'who-we-are',
        title: 'من نحن',
        body: [
          `وصل منصة للعمل الحر تربط الشركات بالمستقلين في الأردن والعالم العربي. إن كان لديك سؤال عن هذه السياسة أو عن بياناتك، راسلنا على ${CONTACT_EMAIL}.`,
        ],
      },
      {
        id: 'what-we-collect',
        title: 'المعلومات التي تقدمها لنا',
        body: [
          'نجمع فقط ما تُدخله بنفسك في وصل:',
          {
            list: [
              'بيانات الحساب: اسمك وبريدك الإلكتروني وكلمة المرور، وما إذا انضممت كعميل أو كمستقل. تُخزَّن كلمات المرور بتشفير أحادي الاتجاه ولا تُحفظ كنص واضح أبدًا.',
              'بيانات الملف الشخصي: الدولة والمدينة والصورة الشخصية. يمكن للمستقل إضافة نبذة ومهارات وروابط أعمال وسعر للساعة، ويمكن للعميل إضافة اسم الشركة ووصفها وموقعها الإلكتروني.',
              'نشاطك على المنصة: الوظائف التي تنشرها، والطلبات والرسائل التعريفية التي ترسلها، وحالة كل طلب من قبول أو رفض.',
            ],
          },
          'لا نجمع بيانات بطاقات الدفع، فوصل لا يعالج أي مدفوعات.',
        ],
      },
      {
        id: 'cookies',
        title: 'ملفات تعريف الارتباط والتخزين على جهازك',
        body: [
          'يستخدم وصل عددًا قليلًا من العناصر الضرورية فقط ليعمل:',
          {
            list: [
              'ملفا wasl_token وwasl_user يُبقيانك مسجلًا للدخول، وينتهيان بعد 7 أيام أو عند تسجيل الخروج.',
              'العنصر wasl_theme في تخزين المتصفح يتذكر اختيارك للوضع الفاتح أو الداكن.',
            ],
          },
          'لا نستخدم ملفات إعلانية، ولا تتبعًا بين المواقع، ولا أدوات تحليل من جهات خارجية.',
        ],
      },
      {
        id: 'how-we-use',
        title: 'كيف نستخدم معلوماتك',
        body: [
          {
            list: [
              'لإنشاء حسابك وحمايته وإبقائك مسجلًا للدخول.',
              'لعرض ملفك العام ووظائفك المنشورة لمستخدمي وصل الآخرين.',
              'لتمكين العميل من مراجعة الطلبات المرسلة إلى وظيفته.',
              'للتواصل معك بشأن حسابك عند الحاجة.',
              'للحفاظ على أمان المنصة، بما في ذلك التحقيق في إساءة الاستخدام.',
            ],
          },
        ],
      },
      {
        id: 'who-can-see',
        title: 'ما يمكن للآخرين رؤيته',
        body: [
          'بعض المعلومات عامة حتى تعمل المنصة:',
          {
            list: [
              'المستقلون: الاسم والصورة والدولة والمدينة والنبذة والمهارات وروابط الأعمال وسعر الساعة.',
              'العملاء: الاسم أو اسم الشركة والدولة والوظائف المنشورة.',
              'الطلبات والرسائل التعريفية لا يراها إلا أنت والعميل صاحب الوظيفة.',
            ],
          },
          'لا يُعرض بريدك الإلكتروني ولا كلمة المرور للعامة أبدًا.',
        ],
      },
      {
        id: 'sharing',
        title: 'المشاركة',
        body: [
          'لا نبيع معلوماتك الشخصية ولا نشاركها مع المعلنين. قد نفصح عن معلومات إذا اقتضى القانون ذلك، أو لحماية سلامة مستخدمينا والخدمة.',
        ],
      },
      {
        id: 'retention',
        title: 'مدة الاحتفاظ بالبيانات',
        body: [
          'نحتفظ بمعلوماتك ما دام حسابك مفتوحًا. وعند حذف الحساب تُحذف معه بيانات الملف الشخصي والوظائف المنشورة والطلبات.',
        ],
      },
      {
        id: 'your-choices',
        title: 'خياراتك',
        body: [
          'يمكنك عرض ملفك الشخصي وتعديله في أي وقت من صفحة الملف الشخصي. للحصول على نسخة من بياناتك، أو تصحيح ما لا يمكنك تعديله، أو حذف حسابك، راسلنا من البريد المسجل في حسابك وسنتولى الأمر.',
        ],
      },
      {
        id: 'security',
        title: 'الأمان',
        body: [
          'نشفّر كلمات المرور ونستخدم رموزًا موقّعة للتحقق من الطلبات. لا توجد خدمة على الإنترنت آمنة تمامًا، لذا يُرجى استخدام كلمة مرور قوية لا تستخدمها في أي مكان آخر.',
        ],
      },
      {
        id: 'changes',
        title: 'التغييرات على هذه السياسة',
        body: [
          'إذا غيّرنا هذه السياسة سنحدّث التاريخ في أعلى الصفحة، وسنُعلمك بالتغييرات الجوهرية قبل سريانها.',
        ],
      },
    ],
  },
};

const terms: Record<Locale, LegalDoc> = {
  en: {
    title: 'Terms of service',
    intro:
      'These terms are the agreement between you and Wasl when you use the marketplace. Please read them before creating an account.',
    sections: [
      {
        id: 'agreement',
        title: 'Agreeing to these terms',
        body: [
          'By creating an account or using Wasl, you agree to these terms and to our privacy policy. If you do not agree, do not use the service.',
        ],
      },
      {
        id: 'accounts',
        title: 'Your account',
        body: [
          {
            list: [
              'You must be at least 18 years old to create an account.',
              'The information you give us must be accurate and kept up to date.',
              'Each account belongs to one person or one business. Do not share your login.',
              'You are responsible for activity on your account. Tell us right away if you think someone else has access to it.',
            ],
          },
        ],
      },
      {
        id: 'what-wasl-is',
        title: 'What Wasl does',
        body: [
          'Wasl is a place for clients to post jobs and for freelancers to apply to them. Wasl is not a party to any agreement between a client and a freelancer, does not employ freelancers, and does not guarantee the quality, safety, or legality of any job or work.',
        ],
      },
      {
        id: 'clients',
        title: 'If you hire on Wasl',
        body: [
          {
            list: [
              'Describe your job, budget, and timeline honestly.',
              'Only post work that is lawful and that you have the right to offer.',
              'Respond to applicants respectfully and keep their information private.',
            ],
          },
        ],
      },
      {
        id: 'freelancers',
        title: 'If you work on Wasl',
        body: [
          {
            list: [
              'Represent your skills, experience, and rates accurately.',
              'Only show portfolio work that you created or have permission to share.',
              'Apply only to jobs you genuinely intend to do.',
            ],
          },
        ],
      },
      {
        id: 'prohibited',
        title: 'What is not allowed',
        body: [
          {
            list: [
              'Fraud, scams, or misleading job posts and profiles.',
              'Harassment, hate speech, or threats toward anyone.',
              'Posting content that infringes someone else’s rights.',
              'Spam, or collecting other users’ information without permission.',
              'Trying to break, overload, or get unauthorized access to the service.',
            ],
          },
        ],
      },
      {
        id: 'content',
        title: 'Content you post',
        body: [
          'You keep ownership of what you post, such as your profile, job posts, and cover letters. You give Wasl permission to store and display that content on the service so the marketplace can work. You are responsible for what you post.',
        ],
      },
      {
        id: 'payments',
        title: 'Payments and disputes',
        body: [
          'Wasl does not handle payments. Clients and freelancers agree on price, delivery, and payment directly with each other, and resolve any disputes between themselves.',
        ],
      },
      {
        id: 'termination',
        title: 'Suspending or closing accounts',
        body: [
          'We may remove content or suspend accounts that break these terms or put other users at risk. You can ask us to delete your account at any time.',
        ],
      },
      {
        id: 'liability',
        title: 'Disclaimers and liability',
        body: [
          'Wasl is provided as it is, without warranties of any kind. To the extent the law allows, Wasl is not liable for losses that come from agreements between users, from content posted by users, or from the service being unavailable.',
        ],
      },
      {
        id: 'law',
        title: 'Governing law',
        body: [
          'These terms are governed by the laws of the Hashemite Kingdom of Jordan. Disputes with Wasl will be handled by the competent courts in Amman.',
        ],
      },
      {
        id: 'changes',
        title: 'Changes and contact',
        body: [
          `We may update these terms. When we do, we will change the date at the top of this page and, for significant changes, tell you in advance. Questions? Email ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
  ar: {
    title: 'شروط الخدمة',
    intro: 'هذه الشروط هي الاتفاق بينك وبين وصل عند استخدامك للمنصة. يُرجى قراءتها قبل إنشاء حساب.',
    sections: [
      {
        id: 'agreement',
        title: 'الموافقة على الشروط',
        body: [
          'بإنشائك حسابًا أو استخدامك لوصل فإنك توافق على هذه الشروط وعلى سياسة الخصوصية. إن لم توافق، فلا تستخدم الخدمة.',
        ],
      },
      {
        id: 'accounts',
        title: 'حسابك',
        body: [
          {
            list: [
              'يجب أن يكون عمرك 18 عامًا على الأقل لإنشاء حساب.',
              'يجب أن تكون المعلومات التي تقدمها صحيحة ومحدّثة.',
              'كل حساب يخص شخصًا واحدًا أو شركة واحدة، فلا تشارك بيانات دخولك.',
              'أنت مسؤول عن النشاط على حسابك. أبلغنا فورًا إن اشتبهت بأن شخصًا آخر يستخدمه.',
            ],
          },
        ],
      },
      {
        id: 'what-wasl-is',
        title: 'ما يقدمه وصل',
        body: [
          'وصل مكان ينشر فيه العملاء الوظائف ويتقدم إليها المستقلون. وصل ليس طرفًا في أي اتفاق بين العميل والمستقل، ولا يوظّف المستقلين، ولا يضمن جودة أي وظيفة أو عمل أو سلامته أو قانونيته.',
        ],
      },
      {
        id: 'clients',
        title: 'إذا كنت توظّف عبر وصل',
        body: [
          {
            list: [
              'صف الوظيفة والميزانية والمدة بصدق.',
              'انشر فقط أعمالًا قانونية يحق لك عرضها.',
              'تعامل مع المتقدمين باحترام وحافظ على خصوصية معلوماتهم.',
            ],
          },
        ],
      },
      {
        id: 'freelancers',
        title: 'إذا كنت تعمل عبر وصل',
        body: [
          {
            list: [
              'اعرض مهاراتك وخبرتك وأسعارك بدقة.',
              'لا تعرض إلا أعمالًا أنجزتها بنفسك أو لديك إذن بمشاركتها.',
              'لا تتقدم إلا للوظائف التي تنوي إنجازها فعلًا.',
            ],
          },
        ],
      },
      {
        id: 'prohibited',
        title: 'ما هو غير مسموح',
        body: [
          {
            list: [
              'الاحتيال أو النصب أو الوظائف والملفات المضللة.',
              'التحرش أو خطاب الكراهية أو التهديد تجاه أي شخص.',
              'نشر محتوى ينتهك حقوق الآخرين.',
              'الرسائل المزعجة، أو جمع معلومات المستخدمين الآخرين دون إذن.',
              'محاولة تعطيل الخدمة أو إثقالها أو الوصول إليها دون تصريح.',
            ],
          },
        ],
      },
      {
        id: 'content',
        title: 'المحتوى الذي تنشره',
        body: [
          'تبقى مالكًا لما تنشره، مثل ملفك الشخصي ووظائفك ورسائلك التعريفية. وتمنح وصل إذنًا بتخزين هذا المحتوى وعرضه على الخدمة حتى تعمل المنصة. وأنت مسؤول عما تنشره.',
        ],
      },
      {
        id: 'payments',
        title: 'المدفوعات والنزاعات',
        body: [
          'لا يتولى وصل أي مدفوعات. يتفق العميل والمستقل مباشرة على السعر والتسليم والدفع، ويحلّان أي نزاع بينهما.',
        ],
      },
      {
        id: 'termination',
        title: 'تعليق الحسابات أو إغلاقها',
        body: [
          'قد نزيل المحتوى أو نعلّق الحسابات التي تخالف هذه الشروط أو تعرّض المستخدمين الآخرين للخطر. ويمكنك أن تطلب حذف حسابك في أي وقت.',
        ],
      },
      {
        id: 'liability',
        title: 'إخلاء المسؤولية',
        body: [
          'يُقدَّم وصل كما هو دون أي ضمانات. وفي الحدود التي يسمح بها القانون، لا يتحمل وصل مسؤولية الخسائر الناتجة عن الاتفاقات بين المستخدمين، أو عن المحتوى الذي ينشرونه، أو عن تعذّر الوصول إلى الخدمة.',
        ],
      },
      {
        id: 'law',
        title: 'القانون الواجب التطبيق',
        body: ['تخضع هذه الشروط لقوانين المملكة الأردنية الهاشمية، وتختص محاكم عمّان المختصة بالنظر في أي نزاع مع وصل.'],
      },
      {
        id: 'changes',
        title: 'التغييرات والتواصل',
        body: [
          `قد نحدّث هذه الشروط، وعندها سنغيّر التاريخ في أعلى الصفحة ونُعلمك مسبقًا بالتغييرات الجوهرية. لديك سؤال؟ راسلنا على ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
};

export function getLegalDoc(kind: 'privacy' | 'terms', locale: string): LegalDoc {
  const l: Locale = locale === 'ar' ? 'ar' : 'en';
  return (kind === 'privacy' ? privacy : terms)[l];
}
