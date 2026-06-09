USE wasl_db;

-- Demo admin user (password: Admin@123)
INSERT INTO users (name, email, password, role, country, city) VALUES
    ('Admin Wasl', 'admin@wasl.jo', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Jordan', 'Amman');

-- Demo freelancers (password: Pass1234)
INSERT INTO users (name, email, password, role, country, city) VALUES
    ('Ahmad Al-Rashid',  'ahmad@example.com',  '$2y$12$LCalypso.example.hashed.password.here.please.chang', 'freelancer', 'Jordan',       'Amman'),
    ('Sara Al-Mansouri', 'sara@example.com',   '$2y$12$LCalypso.example.hashed.password.here.please.chang', 'freelancer', 'UAE',          'Dubai'),
    ('Omar Khalil',      'omar@example.com',   '$2y$12$LCalypso.example.hashed.password.here.please.chang', 'freelancer', 'Egypt',        'Cairo'),
    ('Layla Hassan',     'layla@example.com',  '$2y$12$LCalypso.example.hashed.password.here.please.chang', 'freelancer', 'Lebanon',      'Beirut'),
    ('Khalid Al-Saud',   'khalid@example.com', '$2y$12$LCalypso.example.hashed.password.here.please.chang', 'freelancer', 'Saudi Arabia', 'Riyadh');

-- Demo clients (password: Pass1234)
INSERT INTO users (name, email, password, role, country, city) VALUES
    ('Mohammed Al-Harbi', 'client1@example.com', '$2y$12$LCalypso.example.hashed.password.here.please.chang', 'client', 'Saudi Arabia', 'Jeddah'),
    ('Rania Nasser',      'client2@example.com', '$2y$12$LCalypso.example.hashed.password.here.please.chang', 'client', 'Jordan',       'Amman'),
    ('Faisal Al-Qasim',   'client3@example.com', '$2y$12$LCalypso.example.hashed.password.here.please.chang', 'client', 'Kuwait',       'Kuwait City');

-- Freelancer profiles
INSERT INTO freelancer_profiles (user_id, bio, skills, portfolio_links, hourly_rate) VALUES
    (2, 'Full-stack developer with 5+ years of experience building web applications for MENA markets. Specialized in React, Node.js, and PHP.',
        '["React", "Node.js", "PHP", "TypeScript", "MySQL", "TailwindCSS"]',
        '["https://github.com/ahmad", "https://ahmad.dev"]',
        45.00),
    (3, 'UI/UX designer passionate about creating beautiful, user-friendly interfaces. Worked with 50+ clients across the Gulf region.',
        '["Figma", "Adobe XD", "UI Design", "UX Research", "Prototyping"]',
        '["https://behance.net/sara", "https://dribbble.com/sara"]',
        55.00),
    (4, 'Digital marketing specialist with expertise in SEO, content marketing, and social media. Helped brands grow across MENA.',
        '["SEO", "Content Marketing", "Social Media", "Google Ads", "Analytics"]',
        '["https://omar-marketing.com"]',
        35.00),
    (5, 'Professional translator (Arabic/English/French) with 8 years of experience in legal, technical, and creative translation.',
        '["Arabic-English Translation", "Legal Translation", "Technical Writing", "Proofreading"]',
        '["https://linkedin.com/in/layla-hassan"]',
        40.00),
    (6, 'Mobile developer specializing in React Native and Flutter. Published 20+ apps on App Store and Google Play.',
        '["React Native", "Flutter", "iOS", "Android", "Firebase", "REST APIs"]',
        '["https://github.com/khalid", "https://khalid-apps.com"]',
        60.00);

-- Client profiles
INSERT INTO client_profiles (user_id, company_name, company_description, website) VALUES
    (7, 'Al-Harbi Tech Solutions', 'A Saudi-based technology company providing digital transformation services to SMEs in the Gulf region.', 'https://alharbi-tech.sa'),
    (8, 'Rania Creative Studio', 'A creative agency based in Amman specializing in branding, marketing, and digital content for Arab brands.', 'https://raniastudio.jo'),
    (9, 'Al-Qasim Consulting', 'Business consulting firm helping Kuwaiti companies expand regionally with strategic advisory services.', 'https://alqasim.kw');

-- Demo jobs
INSERT INTO jobs (client_id, category_id, title, description, budget, country, status) VALUES
    (7, 1, 'Build a Modern E-commerce Website',
     'We need a full-stack developer to build an e-commerce platform for our retail business. Requirements: React frontend, PHP/MySQL backend, payment integration, Arabic RTL support, mobile responsive design. This is a 3-month project.',
     3000.00, 'Saudi Arabia', 'open'),

    (8, 3, 'UI/UX Design for Mobile Banking App',
     'Looking for an experienced UI/UX designer to redesign our mobile banking application. Must have experience with financial apps and Arabic-first design. Deliverables: wireframes, high-fidelity mockups, and a design system.',
     2000.00, 'Jordan', 'open'),

    (9, 6, 'Translate Business Documents Arabic-English',
     'We need professional translation of 50+ business documents from Arabic to English. Documents include contracts, financial reports, and marketing materials. Must be a certified translator with legal experience.',
     800.00, 'Kuwait', 'open'),

    (7, 7, 'Manage Social Media Accounts for 3 Months',
     'Seeking a digital marketing expert to manage our Instagram, Twitter, and LinkedIn accounts. Create content calendar, design posts, run paid campaigns, and provide monthly analytics reports. Arabic and English content required.',
     1500.00, 'Saudi Arabia', 'open'),

    (8, 2, 'Develop React Native App for Food Delivery',
     'We are building a food delivery app for the Jordanian market. Need an experienced React Native developer. Features: user auth, restaurant listing, real-time order tracking, Arabic/English support, push notifications.',
     4000.00, 'Jordan', 'open'),

    (9, 10, 'Accounting and Bookkeeping Services',
     'Looking for a certified accountant to handle monthly bookkeeping, VAT filing, and financial reporting for our consulting firm. Must be familiar with Kuwaiti tax regulations. Remote work, ongoing contract.',
     500.00, 'Kuwait', 'open');
