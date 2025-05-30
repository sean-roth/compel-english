# Technology Architecture Decisions

## Core Stack
**Laravel + Google Cloud + Azure Speech API**

### Frontend
- Laravel (monolith approach, no microservices)
- Google Cloud hosting (using $300 credits)
- CloudFlare CDN for assets

### Database
**Decision: Google Cloud SQL (PostgreSQL)**
- NOT Firebase (NoSQL doesn't fit our needs)
- Better for relational data (users, scores, progress)
- Eloquent ORM benefits maintained
- Easy aggregation for analytics

### Why NOT Firebase
- Hard to query complex relationships
- Difficult to aggregate pronunciation scores
- Cost unpredictability with heavy usage
- Lose Laravel's native database features

### Pronunciation Engine
**Azure Speech Services**
- Only viable option currently
- Built-in pronunciation assessment
- Phoneme-level accuracy scores
- Supports Japanese speakers

**Future Options to Test:**
- SpeechSuper (when budget allows)
- SpeechAce (education-focused)
- DIY not viable (too complex/expensive)

## Visual Novel Framework
**For Demo: Web-based approach**
- Consider Monogatari.js (simple, web-native)
- Custom React framework for production
- Focus on desktop experience (cinematic quality)

## Architecture Principles
1. **Start simple**: Monolith over microservices
2. **Use proven tools**: Laravel + PostgreSQL
3. **Cache aggressively**: Redis for performance
4. **Buy vs Build**: Use Azure for pronunciation
5. **Desktop-first**: Preserve story experience

## Scaling Considerations
When SBIR funding arrives:
- Migrate to Go/Rust for performance
- Add more language support
- Build custom pronunciation engine
- Expand to mobile apps

## Current Limitations Accepted
- Reliance on Azure API (no alternative)
- Desktop-only for stories (quality > convenience)
- Token-based usage (managing Azure costs)

Last Updated: 2025-05-24
