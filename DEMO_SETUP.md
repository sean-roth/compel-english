# Demo Site Setup Guide

## Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL 14+ (or SQLite for local development)

### Installation Steps

1. **Install Dependencies**
```bash
composer install
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Database Setup**
```bash
# For PostgreSQL (recommended)
php artisan migrate

# For local development with SQLite (change DB_CONNECTION=sqlite in .env)
touch database/database.sqlite
php artisan migrate
```

4. **Build Assets**
```bash
npm run dev  # For development
# OR
npm run build  # For production
```

5. **Run the Application**
```bash
php artisan serve
```

Visit `http://localhost:8000` to see the demo!

## Demo Features

### 🎯 Hero Section
- Compelling headline with crisis theme
- Video preview placeholder
- Clear call-to-action button

### 🎬 Interactive Demo Flow
1. **Context Setup** - Hotel crisis scenario introduction
2. **Pronunciation Practice** - 4 key phrases with mock recording
3. **AI Feedback** - Mock pronunciation analysis and scoring
4. **Conversion** - Payment integration + email capture

### 🔧 Technical Implementation

#### Backend (Laravel)
- **LandingController** - Serves the demo page
- **DemoController** - Handles recording and email capture
- **CheckoutController** - Manages payment sessions (mock)
- **DemoLead Model** - Stores lead information

#### Frontend (React + Inertia.js)
- Step-by-step demo experience
- Interactive pronunciation practice
- Mock recording with visual feedback
- Mobile-responsive design

## Environment Variables

### Required for Production
```env
# ChargeBee (Payment Processing)
CHARGEBEE_SITE=your_site_name
CHARGEBEE_API_KEY=your_api_key
VITE_CHARGEBEE_KEY=your_publishable_key

# Brevo (Email Marketing)
BREVO_API_KEY=your_brevo_key
BREVO_LIST_ID=your_list_id

# Azure Speech (Future: Real Pronunciation)
AZURE_SPEECH_KEY=your_speech_key
AZURE_SPEECH_REGION=your_region
```

### Database Configuration
```env
# PostgreSQL (Recommended)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=compel_english
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## API Endpoints

### Demo API
- `POST /api/demo/record` - Process pronunciation (mock)
- `POST /api/demo/email` - Capture email leads
- `POST /api/checkout/session` - Create payment session

### Database Tables
- `demo_leads` - Email captures and demo completions
- `users` - User accounts (existing)

## Deployment

### Google Cloud Run (Recommended)
```bash
npm run build
gcloud run deploy compel-english \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### Environment Setup Checklist
- [ ] PostgreSQL database created
- [ ] ChargeBee account connected
- [ ] Brevo API configured
- [ ] Domain/SSL configured
- [ ] Analytics tracking added

## Testing the Demo

### Success Metrics to Track
- [ ] Page loads in < 2 seconds
- [ ] Demo completion rate > 40%
- [ ] Email capture rate > 25% of visitors
- [ ] Checkout initiation > 5% of demo completers

### Test Scenarios
1. **Hero to Demo Flow** - Click "Try Free Demo" button
2. **Practice Recording** - Click record button and get feedback
3. **Email Capture** - Submit email in fallback form
4. **Checkout Flow** - Test payment button (mock mode)

## Future Enhancements

### Phase 1 (Current Demo)
- [x] Mock pronunciation scoring
- [x] Email lead capture
- [x] Payment integration structure
- [x] Mobile-responsive design

### Phase 2 (Production Ready)
- [ ] Real Azure Speech API integration
- [ ] Actual ChargeBee payment processing
- [ ] Brevo email automation
- [ ] Analytics dashboard
- [ ] A/B testing framework

### Phase 3 (Full Platform)
- [ ] User authentication
- [ ] Course content management
- [ ] Progress tracking
- [ ] Advanced pronunciation analytics

## Troubleshooting

### Common Issues
1. **ChargeBee Errors** - Check API keys and site configuration
2. **Email Capture Fails** - Verify Brevo API connection
3. **Recording Issues** - Currently mock mode, check browser console
4. **Database Errors** - Ensure migrations have run successfully

### Debug Mode
Set `APP_DEBUG=true` in `.env` for detailed error messages.

## Support

For technical issues or questions:
- Check the main README.md for general setup
- Review Laravel and React documentation
- Contact: sean@compelenglish.com