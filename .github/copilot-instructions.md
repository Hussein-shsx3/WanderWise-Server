# WanderWise Server - AI Copilot Instructions

## Project Overview
WanderWise is an AI-powered trip planning application that generates personalized travel itineraries based on user preferences, budget, and destination. The server (Node.js + Express + MongoDB) handles user authentication, itinerary management, and integrations with three external APIs: OpenWeatherMap (weather), OpenRouter (AI suggestions), and implicit Leaflet support (frontend maps).

## Architecture Overview

### Core Components
1. **Authentication System** (`src/middleware/authMiddleware.ts`, `src/services/auth.service.ts`)
   - JWT-based authentication with Bearer token verification
   - User registration with email verification
   - Password reset flow with token expiration
   - Tokens stored in Authorization header: `Bearer <JWT_TOKEN>`

2. **Itinerary Management** (NEW)
   - Models: `src/models/itinerary.model.ts` - Stores multi-day trips with activities, weather, and coordinates
   - Services: `src/services/itinerary.service.ts` - CRUD operations and AI generation
   - Controllers: `src/controllers/itinerary.controller.ts` - Route handlers
   - Routes: `src/routes/itinerary.route.ts` - API endpoints

3. **API Integrations**
   - **Weather**: `src/services/weather.service.ts` uses OpenWeatherMap API for current/forecast data
   - **AI**: `src/services/ai.service.ts` uses OpenRouter API (gpt-3.5-turbo) for itinerary generation
   - **User**: `src/services/user.service.ts` - User profile management

### Data Flow
```
Frontend Request → authMiddleware (JWT verify) → Controller → Service → Database/External APIs
                                                  ↓
                                           Error Handler → AppError response
```

## Key Conventions & Patterns

### Error Handling
- Custom `AppError` class in `src/middleware/errorMiddleware.ts` with statusCode, message, and code properties
- All route handlers wrapped with `asyncHandler` middleware that catches Promise rejections
- Consistent error response format: `{ success: false, message, code, statusCode }`
- Example: `throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS")`

### Service Layer Pattern
- Services contain all business logic (validation, API calls, database operations)
- Controllers are thin - they parse input, call services, and format responses
- Example: `createItineraryService` validates dates, gets coordinates, and creates database record
- Return format: `{ success: true, message, data }`

### Data Models
- MongoDB schemas with timestamps and indexes for common queries
- Example itinerary schema: userId (ref to User), destination, coordinates, dayItineraries array with weather
- Day structure: day number, date, weather object, activities array
- Activity structure: id, name, category (attraction/dining/accommodation/transport), time, location with lat/lon

### DTO Pattern
- Request validation through DTOs in `src/dtos/` (auth.dto.ts, itinerary.dto.ts)
- DTOs define input shape but aren't enforced at compile-time - add runtime validation if needed
- Example: `CreateItineraryDTO` has destination, startDate, endDate, budget, travelStyle, preferences

### Environment Variables
Required:
- `MONGODB_URI` - MongoDB Atlas connection
- `PORT` - Server port (default 5000)
- `JWT_SECRET` - Token signing secret
- `OPENWEATHER_API_KEY` - Weather API key
- `OPENROUTER_API_KEY` - AI API key (includes Bearer prefix in requests)
- `CORS_ORIGIN` - Frontend URL (comma-separated if multiple)
- `NODE_ENV` - development/production
- Email configuration (Gmail SMTP for verification emails)

## Important Architectural Decisions

1. **Timezone Handling**: All dates stored as ISO Date objects in MongoDB. Frontend responsible for display formatting.

2. **Weather in Itinerary**: Weather data fetched and stored at itinerary creation (uses 5-day forecast from OpenWeather). Updated separately if user modifies dates.

3. **AI Generation Strategy**: 
   - Full itinerary generation uses `generateTravelItinerary()` - returns formatted text with day-by-day suggestions
   - Day-level activities can be generated separately with `generateDayActivities()`
   - OpenRouter model: gpt-3.5-turbo (cheaper than gpt-4, sufficient for travel planning)
   - Prompt engineering focuses on structured output (times, costs, categories)

4. **Activity IDs**: Client-generated UUIDs (v4) recommended since activities are embedded documents without MongoDB _id.

5. **Security**:
   - Rate limiting: 100 requests per 15 minutes on `/api/*` routes
   - Helmet for security headers (CSP disabled for flexibility)
   - Password hashing with bcryptjs (10 salt rounds)
   - Email tokens expire in 24 hours

## Common Development Tasks

### Adding a New API Integration
1. Create service file: `src/services/[name].service.ts`
2. Export functions with try/catch → `throw new AppError(...)`
3. Add environment variables to `.env`
4. Call from controller/existing service
5. Example: Weather service → controller checks coordinates first, calls weather service, handles errors

### Extending Itinerary Schema
1. Update `src/types/itinerary.type.ts` interfaces
2. Update MongoDB schema in `src/models/itinerary.model.ts`
3. Update DTOs in `src/dtos/itinerary.dto.ts` if user-facing
4. Existing data migrations handled by MongoDB's flexible schema (optional for unversioned APIs)

### Adding Authentication to Routes
1. Import `authMiddleware` from `src/middleware/authMiddleware.ts`
2. Add to router: `router.use(authMiddleware)` (applies to all routes below)
3. Access user ID via `req.user?.id` in controllers
4. Example in `src/routes/itinerary.route.ts`

### Testing API Endpoints
- Use Postman/Insomnia with Bearer token from login response
- Health check: `GET /health`
- Generate AI itinerary: `POST /api/v1/itineraries/generate` with dates and destination
- Add activity: `POST /api/v1/itineraries/:id/days/:dayNumber/activities`

## File Organization Quick Reference
```
src/
  ├── models/           → MongoDB schemas (User, Itinerary)
  ├── controllers/      → Route handlers (auth, user, itinerary)
  ├── services/         → Business logic (auth, user, itinerary, weather, ai)
  ├── routes/           → Express routers with endpoints
  ├── dtos/             → Request/response type definitions
  ├── middleware/       → Auth, error handling, compression
  ├── types/            → TypeScript interfaces (user, itinerary)
  ├── utils/            → Helpers (generateToken, sendEmail, emailTemplate)
  ├── config/           → Database connection
  ├── app.ts            → Express app setup
  └── server.ts         → Entry point, graceful shutdown

.env                     → Environment secrets (NEVER commit)
package.json            → Dependencies & scripts
tsconfig.json           → TypeScript configuration
```

## Debugging Tips
- Check logs: Use `chalk` colors in console logs for visibility (check server.ts startup logs)
- Middleware order matters: Auth before routes, error handler last
- MongoDB connection: Ensure `MONGODB_URI` is correct and network access enabled in Atlas
- API keys: Verify `OPENWEATHER_API_KEY` and `OPENROUTER_API_KEY` are valid and have quotas
- CORS errors: Add frontend URL to `CORS_ORIGIN` environment variable
- TypeScript errors: Run `npm run build` to catch type mismatches

## Next Steps / Known Gaps
- Input validation: Consider adding `joi` or `zod` for DTO runtime validation
- Rate limiting per user (currently global) for API integrations
- Pagination for itinerary lists (currently returns all)
- Caching for destination coordinates (repeated requests → same result)
- Unit/integration tests (test folder recommended)
- API documentation: Swagger/OpenAPI spec generation
