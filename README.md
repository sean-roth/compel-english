# Compel English 🎬

> AI-powered ESL platform combining thriller narratives with pronunciation coaching for Japanese business professionals

## 🎯 Project Overview

Compel English revolutionizes business English learning by combining:
- **B-movie thriller narratives** that keep learners engaged
- **AI-powered pronunciation coaching** specifically for Japanese speakers
- **WhatsApp micro-learning** for daily practice
- **Token-based pricing** that scales with usage

### Target Market
- **Primary**: Japanese finance professionals (engineers and sales managers)
- **Pain Point**: Poor pronunciation undermines credibility in English business settings
- **Solution**: Story-driven practice with real-time AI feedback at $37.50/month (50% launch discount)

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL 14+
- Azure Speech Services account

### Installation

```bash
# Clone the repository
git clone https://github.com/sean-roth/compel-english.git
cd compel-english

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Build frontend assets
npm run dev
```

### Environment Setup

Add these to your `.env` file:
```env
# Azure Speech Services
AZURE_SPEECH_KEY=your_key_here
AZURE_SPEECH_REGION=your_region

# Database (PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=compel_english
DB_USERNAME=your_username
DB_PASSWORD=your_password

# WhatsApp (Brevo)
BREVO_API_KEY=your_key_here
WHATSAPP_NUMBER=your_number_here
```

## 📁 Project Structure

```
compel-english/
├── app/                    # Laravel application code
│   ├── Http/Controllers/   # API and web controllers
│   ├── Models/            # Eloquent models
│   └── Services/          # Business logic services
├── resources/
│   ├── js/                # React components
│   │   ├── components/    # Reusable UI components
│   │   └── pages/         # Page components
│   └── views/             # Blade templates
├── database/
│   ├── migrations/        # Database migrations
│   └── seeders/          # Test data seeders
├── public/               # Public assets
├── routes/               # API and web routes
└── tests/                # Feature and unit tests
```

## 🎮 Core Features

### MVP Demo (4-Week Build)
- ✅ One complete episode: "The Midnight Margin Call"
- ✅ 5 pronunciation checkpoints (regulatory compliance, liquidity crisis, etc.)
- ✅ r/l differentiation focus for Japanese speakers
- ✅ Basic visual novel interface
- ✅ WhatsApp daily challenge integration
- ✅ Email capture and demo analytics

### Future Features
- 🔄 Multiple story branches based on pronunciation performance
- 🔄 AI-generated character assets
- 🔄 Full payment processing (ChargeBee + Stripe)
- 🔄 Enterprise team management
- 🔄 Detailed pronunciation analytics

## 🛠 Technical Stack

### Backend
- **Framework**: Laravel 11
- **Database**: PostgreSQL (Google Cloud SQL)
- **Cache**: Redis
- **Queue**: Redis + Horizon

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Visual Novel**: Custom React components

### APIs & Services
- **Pronunciation**: Azure Speech Services
- **Payments**: ChargeBee → Stripe
- **Email/SMS**: Brevo (includes WhatsApp)
- **Hosting**: Google Cloud Platform
- **CDN**: CloudFlare

## 📊 Database Schema

```sql
-- Core tables for MVP
users (id, email, name, company, created_at)
demo_sessions (id, user_id, started_at, completed_at)
pronunciation_scores (id, session_id, phrase, score, audio_url)
story_progress (id, user_id, checkpoint, choices)
```

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage
```

## 🚀 Deployment

### Google Cloud Deployment
```bash
# Build production assets
npm run build

# Deploy to Google Cloud
gcloud app deploy
```

### Environment Configuration
- Set up Cloud SQL for PostgreSQL
- Configure Cloud Storage for assets
- Set up Cloud CDN for global delivery

## 📈 Business Model

### Pricing Tiers
- **Starter**: $37.50/month (500 pronunciation checks)
- **Professional**: $67/month (2000 checks)
- **Enterprise**: $127/month (unlimited)

### Market Validation Metrics
- Target: >10% cold email response rate
- Demo completion: >30%
- Conversion: >2 paid pilots

## 🤝 Contributing

This is currently a private project in active development. 

### Development Workflow
1. Create feature branch from `main`
2. Make changes with clear commits
3. Test thoroughly
4. Create pull request
5. Review and merge

## 📝 License

Proprietary - All rights reserved

## 🎯 Roadmap

### Phase 1: MVP Demo (Current)
- [x] Project setup
- [ ] Azure Speech API integration
- [ ] Basic visual novel engine
- [ ] First story episode
- [ ] WhatsApp bot setup

### Phase 2: Market Validation
- [ ] Cold email campaign
- [ ] Demo analytics
- [ ] User feedback collection
- [ ] Pricing validation

### Phase 3: Full Platform
- [ ] Payment integration
- [ ] Multiple episodes
- [ ] Admin dashboard
- [ ] Team features

### Phase 4: Scale
- [ ] Mobile apps
- [ ] Additional languages
- [ ] Enterprise features
- [ ] API for partners

## 📞 Contact

**Sean Roth**  
Project Lead  
[Your contact info]

---

Built with ❤️ for Japanese professionals learning English