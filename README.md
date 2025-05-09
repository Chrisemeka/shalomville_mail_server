# Shalomville Mail Server

Simple backend mail service for Shalomville InnoTech Academy website.

## Setup

1. Copy `.env.example` to `.env`
2. Fill in your email credentials:
   ```
   EMAIL=your-gmail@gmail.com
   PASSWORD=your-app-specific-password
   ```
3. Install dependencies: `npm install`
4. Run locally: `npm start`

## Deployment on Render

1. Create a new Web Service on Render
2. Connect this repository
3. Configure environment variables in Render dashboard:
   - `EMAIL`: Your Gmail address
   - `PASSWORD`: Your Gmail app-specific password
4. Deploy

## API Endpoints

- `POST /api/contact` - Send contact form email
- `POST /api/register` - Send registration email  
- `GET /test` - Health check

## Frontend Integration

Update your frontend JavaScript to point to the Render URL:

```javascript
// Replace localhost URL with your Render backend URL
fetch('https://your-backend-name.onrender.com/api/contact', {
  method: 'POST',
  // ... rest of your code
});
```