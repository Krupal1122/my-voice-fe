# Studies API Documentation

## Overview
The Studies API allows administrators to manage studies and users to view active studies. All data is stored in MongoDB.

## API Endpoints

### Studies

#### GET /api/studies
- **Description**: Get all studies
- **Response**: `{ studies: Study[] }`

#### GET /api/studies/active
- **Description**: Get only active studies (for homepage)
- **Response**: `{ studies: Study[] }`

#### GET /api/studies/:id
- **Description**: Get a specific study by ID
- **Response**: `{ study: Study }`

#### POST /api/studies
- **Description**: Create a new study
- **Body**: 
  ```json
  {
    "title": "string",
    "description": "string", 
    "targetParticipants": "number",
    "reward": "number",
    "duration": "string",
    "category": "string",
    "deadline": "string (ISO date)",
    "image": "string (optional)"
  }
  ```
- **Response**: `{ study: Study }`

#### PUT /api/studies/:id
- **Description**: Update a study
- **Body**: Same as POST
- **Response**: `{ study: Study }`

#### DELETE /api/studies/:id
- **Description**: Delete a study
- **Response**: `{ ok: true }`

#### PATCH /api/studies/:id/participate
- **Description**: Increment participant count (when someone joins)
- **Response**: `{ study: Study }`

## Study Model

```javascript
{
  _id: "string",
  title: "string",
  description: "string",
  status: "draft" | "active" | "completed" | "paused",
  participants: "number",
  targetParticipants: "number", 
  reward: "number",
  duration: "string",
  category: "Market Research" | "Product Research" | "Social Research" | "Behavioral Research",
  deadline: "Date",
  image: "string (optional)",
  createdAt: "Date",
  updatedAt: "Date"
}
```

## Frontend Integration

### Admin Panel
- **Component**: `CurrentStudies.tsx`
- **Features**: 
  - Add new studies
  - Edit existing studies
  - Delete studies
  - View study details
  - Real-time updates after CRUD operations

### Homepage
- **Component**: `Home.tsx`
- **Features**:
  - Displays active studies from MongoDB
  - Fallback to default studies if API fails
  - Loading states

## Setup Instructions

1. **Start MongoDB**: Ensure MongoDB is running on `mongodb://127.0.0.1:27017/myvoice`

2. **Start Server**: 
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Start Frontend**:
   ```bash
   npm install
   npm run dev
   ```

## Usage

1. **Admin Panel**: Navigate to Admin Panel → Studies tab to manage studies
2. **Homepage**: Active studies automatically appear on the homepage
3. **API**: Use the endpoints above for programmatic access

## Notes

- All studies created through the admin panel are automatically set to "active" status
- The homepage only displays studies with "active" status
- Image uploads are handled as base64 strings (consider implementing file upload service for production)
- Date fields are handled as ISO strings in the frontend and converted to Date objects in MongoDB
