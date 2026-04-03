# API Documentation

## Overview

This is the API reference documentation for the Personal Kanban Board application. All endpoints follow RESTful conventions and return JSON responses.

- **Base URL**: `http://localhost:3000/api`
- **Authentication**: JWT Bearer token in `Authorization` header
- **Response Format**: JSON
- **Default Status Code**: 200 (Success), 201 (Created)

## Authentication

All protected endpoints require a valid JWT token obtained from the login endpoint.

### Token Usage

Include the token in the `Authorization` header:

```bash
Authorization: Bearer <your_jwt_token>
```

Tokens are stored in localStorage and automatically included by the frontend client.

### Response Format

All API responses follow this structure:

**Success Response (2xx)**
```json
{
  "id": "string",
  "title": "string",
  // ... resource fields
}
```

**Error Response (4xx, 5xx)**
```json
{
  "error": "Error message describing what went wrong"
}
```

## Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid input, missing required fields, or validation failed |
| 401 | Unauthorized | Missing, invalid, or expired JWT token |
| 403 | Forbidden | Authenticated but lacks permission (e.g., not board owner) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error occurred |

## Endpoint Summary

| Method | Path | Description | Auth | Mongo Ops |
|--------|------|-------------|------|-----------|
| **AUTH** |
| POST | `/auth/register` | Create new user account | ❌ | `User.create()` |
| POST | `/auth/login` | Authenticate and get token | ❌ | `User.findOne()` |
| POST | `/auth/logout` | Invalidate token | ✅ | N/A (client-side) |
| GET | `/auth/user` | Get current user profile | ✅ | `User.findById()` |
| **BOARDS** |
| GET | `/boards` | List all user boards | ✅ | `Board.find({owner})` |
| POST | `/boards` | Create new board | ✅ | `Board.create()` |
| GET | `/boards/:id` | Get board details | ✅ | `Board.findById()` |
| PUT | `/boards/:id` | Update board title | ✅ | `Board.findByIdAndUpdate()` |
| DELETE | `/boards/:id` | Delete board (cascade) | ✅ | `Board.deleteOne()`, `Column.deleteMany()`, `Task.deleteMany()` |
| **COLUMNS** |
| GET | `/boards/:boardId/columns` | List columns in board | ✅ | `Column.find({boardId})` |
| POST | `/boards/:boardId/columns` | Create column in board | ✅ | `Column.create()` |
| PUT | `/columns/:id` | Update column title | ✅ | `Column.findByIdAndUpdate()` |
| DELETE | `/columns/:id` | Delete column (cascade) | ✅ | `Column.deleteOne()`, `Task.deleteMany({columnId})` |
| **TASKS** |
| GET | `/columns/:columnId/tasks` | List tasks in column | ✅ | `Task.find({columnId})` |
| POST | `/columns/:columnId/tasks` | Create task in column | ✅ | `Task.create()` |
| GET | `/tasks/:id` | Get task details | ✅ | `Task.findById()` |
| PUT | `/tasks/:id` | Update task fields | ✅ | `Task.findByIdAndUpdate()` |
| DELETE | `/tasks/:id` | Delete task | ✅ | `Task.findByIdAndDelete()` |
| PATCH | `/tasks/:id/move` | Move task to column/position | ✅ | `Task.updateMany()`, `Task.findByIdAndUpdate()` |

---

## Detailed Endpoint Documentation

### AUTH

#### POST `/auth/register`

Create a new user account.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**MongoDB Operations**:
```
User.findOne({ email })           // Check if user exists
User.create({ email, password })   // Create new user
```

**Response (201)**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Cases**:
- 400: Email already exists
- 400: Invalid email format
- 400: Password too weak
- 500: Database error

---

#### POST `/auth/login`

Authenticate user and obtain JWT token.

**Auth Required**: No

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**MongoDB Operations**:
```
User.findOne({ email })  // Find user by email
// Password validation (bcrypt comparison, no DB)
```

**Response (200)**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Cases**:
- 401: Invalid email or password
- 500: Database error

---

#### POST `/auth/logout`

Invalidate current session (client-side, clears token from localStorage).

**Auth Required**: Yes

**MongoDB Operations**: None (client-side only)

**Response (200)**:
```json
{
  "message": "Logged out successfully"
}
```

---

#### GET `/auth/user`

Get current authenticated user's profile.

**Auth Required**: Yes

**MongoDB Operations**:
```
User.findById(userId)  // Get current user by JWT payload
```

**Response (200)**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com"
}
```

**Error Cases**:
- 401: Invalid or missing token
- 404: User not found
- 500: Database error

---

### BOARDS

#### GET `/boards`

List all boards belonging to the authenticated user.

**Auth Required**: Yes

**MongoDB Operations**:
```
Board.find({ owner: userId })  // Get all user's boards
```

**Response (200)**:
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "title": "My Kanban Board",
    "owner": "507f1f77bcf86cd799439011",
    "createdAt": "2026-04-03T10:30:00Z",
    "updatedAt": "2026-04-03T10:30:00Z"
  }
]
```

**Error Cases**:
- 401: Missing or invalid token
- 500: Database error

---

#### POST `/boards`

Create a new board for the authenticated user.

**Auth Required**: Yes

**Request Body**:
```json
{
  "title": "My Project Tasks"
}
```

**MongoDB Operations**:
```
Board.create({
  title,
  owner: userId,
  createdAt,
  updatedAt
})
```

**Response (201)**:
```json
{
  "id": "507f1f77bcf86cd799439012",
  "title": "My Project Tasks",
  "owner": "507f1f77bcf86cd799439011",
  "createdAt": "2026-04-03T10:30:00Z",
  "updatedAt": "2026-04-03T10:30:00Z"
}
```

**Error Cases**:
- 400: Missing title
- 401: Missing or invalid token
- 500: Database error

---

#### GET `/boards/:id`

Get details of a specific board.

**Auth Required**: Yes

**MongoDB Operations**:
```
Board.findById(id)      // Find board
// Verify ownership
```

**Response (200)**:
```json
{
  "id": "507f1f77bcf86cd799439012",
  "title": "My Project Tasks",
  "owner": "507f1f77bcf86cd799439011",
  "createdAt": "2026-04-03T10:30:00Z",
  "updatedAt": "2026-04-03T10:30:00Z"
}
```

**Error Cases**:
- 400: Invalid board ID format
- 401: Missing or invalid token
- 403: Not board owner
- 404: Board not found
- 500: Database error

---

#### PUT `/boards/:id`

Update board title.

**Auth Required**: Yes

**Request Body**:
```json
{
  "title": "Updated Board Title"
}
```

**MongoDB Operations**:
```
Board.findById(id)              // Verify ownership
Board.findByIdAndUpdate(id, {   // Update title
  title,
  updatedAt: new Date()
})
```

**Response (200)**:
```json
{
  "id": "507f1f77bcf86cd799439012",
  "title": "Updated Board Title",
  "owner": "507f1f77bcf86cd799439011",
  "createdAt": "2026-04-03T10:30:00Z",
  "updatedAt": "2026-04-03T10:35:00Z"
}
```

**Error Cases**:
- 400: Missing title or invalid ID
- 401: Missing or invalid token
- 403: Not board owner
- 404: Board not found
- 500: Database error

---

#### DELETE `/boards/:id`

Delete a board and all associated columns and tasks (cascade delete).

**Auth Required**: Yes

**MongoDB Operations** (Cascade):
```
Board.findById(id)              // Verify ownership
Column.find({ boardId: id })    // Find all columns
Task.deleteMany({               // Delete all tasks in board
  boardId: id
})
Column.deleteMany({             // Delete all columns in board
  boardId: id
})
Board.findByIdAndDelete(id)     // Delete board
```

**Response (200)**:
```json
{
  "message": "Board deleted successfully"
}
```

**Error Cases**:
- 401: Missing or invalid token
- 403: Not board owner
- 404: Board not found
- 500: Database error

---

### COLUMNS

#### GET `/boards/:boardId/columns`

List all columns in a board.

**Auth Required**: Yes

**MongoDB Operations**:
```
Board.findById(boardId)        // Verify access
Column.find({                  // Get columns sorted by position
  boardId,
  sort: { position: 1 }
})
```

**Response (200)**:
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "title": "To Do",
    "boardId": "507f1f77bcf86cd799439012",
    "position": 0,
    "createdAt": "2026-04-03T10:30:00Z"
  },
  {
    "id": "507f1f77bcf86cd799439014",
    "title": "In Progress",
    "boardId": "507f1f77bcf86cd799439012",
    "position": 1,
    "createdAt": "2026-04-03T10:30:00Z"
  }
]
```

**Error Cases**:
- 401: Missing or invalid token
- 403: Not board owner
- 404: Board not found
- 500: Database error

---

#### POST `/boards/:boardId/columns`

Create a new column in a board.

**Auth Required**: Yes

**Request Body**:
```json
{
  "title": "Done"
}
```

**MongoDB Operations**:
```
Board.findById(boardId)           // Verify ownership
Column.countDocuments({           // Get next position
  boardId
})
Column.create({
  title,
  boardId,
  position: nextPosition,
  createdAt
})
```

**Response (201)**:
```json
{
  "id": "507f1f77bcf86cd799439015",
  "title": "Done",
  "boardId": "507f1f77bcf86cd799439012",
  "position": 2,
  "createdAt": "2026-04-03T10:35:00Z"
}
```

**Error Cases**:
- 400: Missing title or invalid boardId
- 401: Missing or invalid token
- 403: Not board owner
- 404: Board not found
- 500: Database error

---

#### PUT `/columns/:id`

Update column title.

**Auth Required**: Yes

**Request Body**:
```json
{
  "title": "In Review"
}
```

**MongoDB Operations**:
```
Column.findById(id)                    // Find column
Board.findById(column.boardId)         // Verify ownership
Column.findByIdAndUpdate(id, {         // Update title
  title
})
```

**Response (200)**:
```json
{
  "id": "507f1f77bcf86cd799439013",
  "title": "In Review",
  "boardId": "507f1f77bcf86cd799439012",
  "position": 0,
  "createdAt": "2026-04-03T10:30:00Z"
}
```

**Error Cases**:
- 400: Missing title or invalid ID
- 401: Missing or invalid token
- 403: Not column owner
- 404: Column not found
- 500: Database error

---

#### DELETE `/columns/:id`

Delete a column and all its tasks (cascade delete).

**Auth Required**: Yes

**MongoDB Operations** (Cascade):
```
Column.findById(id)              // Find column
Board.findById(column.boardId)   // Verify ownership
Task.deleteMany({                // Delete all tasks in column
  columnId: id
})
Column.findByIdAndDelete(id)     // Delete column
```

**Response (200)**:
```json
{
  "message": "Column deleted successfully"
}
```

**Error Cases**:
- 401: Missing or invalid token
- 403: Not board owner
- 404: Column not found
- 500: Database error

---

### TASKS

#### GET `/columns/:columnId/tasks`

List all tasks in a column.

**Auth Required**: Yes

**MongoDB Operations**:
```
Column.findById(columnId)         // Verify access
Task.find({                       // Get tasks sorted by position
  columnId,
  sort: { position: 1 }
})
```

**Response (200)**:
```json
[
  {
    "id": "507f1f77bcf86cd799439016",
    "title": "Implement authentication",
    "description": "Add JWT-based auth",
    "boardId": "507f1f77bcf86cd799439012",
    "columnId": "507f1f77bcf86cd799439013",
    "priority": "high",
    "dueDate": "2026-04-10T00:00:00Z",
    "position": 0,
    "createdAt": "2026-04-03T10:30:00Z"
  }
]
```

**Error Cases**:
- 401: Missing or invalid token
- 404: Column not found
- 500: Database error

---

#### POST `/columns/:columnId/tasks`

Create a new task in a column.

**Auth Required**: Yes

**Request Body**:
```json
{
  "title": "Design dashboard",
  "description": "Create mockups using Figma",
  "priority": "medium",
  "dueDate": "2026-04-15T00:00:00Z"
}
```

**MongoDB Operations**:
```
Column.findById(columnId)              // Find column
Board.findById(column.boardId)         // Verify ownership
Task.countDocuments({                  // Get next position
  columnId
})
Task.create({
  title,
  description,
  boardId: column.boardId,
  columnId,
  priority,
  dueDate,
  position: nextPosition,
  createdAt
})
```

**Response (201)**:
```json
{
  "id": "507f1f77bcf86cd799439017",
  "title": "Design dashboard",
  "description": "Create mockups using Figma",
  "boardId": "507f1f77bcf86cd799439012",
  "columnId": "507f1f77bcf86cd799439013",
  "priority": "medium",
  "dueDate": "2026-04-15T00:00:00Z",
  "position": 1,
  "createdAt": "2026-04-03T10:40:00Z"
}
```

**Error Cases**:
- 400: Missing title or invalid columnId
- 401: Missing or invalid token
- 403: Not board owner
- 404: Column not found
- 500: Database error

---

#### PUT `/tasks/:id`

Update task fields (title, description, priority, dueDate).

**Auth Required**: Yes

**Request Body** (all fields optional):
```json
{
  "title": "Updated task name",
  "description": "Updated description",
  "priority": "high",
  "dueDate": "2026-04-20T00:00:00Z"
}
```

**MongoDB Operations**:
```
Task.findById(id)                      // Find task
Board.findById(task.boardId)           // Verify ownership
Task.findByIdAndUpdate(id, {           // Update fields
  ...updateFields
})
```

**Response (200)**:
```json
{
  "id": "507f1f77bcf86cd799439016",
  "title": "Updated task name",
  "description": "Updated description",
  "boardId": "507f1f77bcf86cd799439012",
  "columnId": "507f1f77bcf86cd799439013",
  "priority": "high",
  "dueDate": "2026-04-20T00:00:00Z",
  "position": 0,
  "createdAt": "2026-04-03T10:30:00Z"
}
```

**Error Cases**:
- 400: Invalid fields or ID format
- 401: Missing or invalid token
- 403: Not board owner
- 404: Task not found
- 500: Database error

---

#### DELETE `/tasks/:id`

Delete a task.

**Auth Required**: Yes

**MongoDB Operations**:
```
Task.findById(id)                      // Find task
Column.findById(task.columnId)         // Get column
Board.findById(task.boardId)           // Verify ownership
Task.findByIdAndDelete(id)             // Delete task
Task.updateMany({                      // Shift remaining tasks
  columnId: task.columnId,
  position: { $gt: task.position }
}, {
  $inc: { position: -1 }
})
```

**Response (200)**:
```json
{
  "message": "Task deleted successfully"
}
```

**Error Cases**:
- 401: Missing or invalid token
- 403: Not board owner
- 404: Task not found
- 500: Database error

---

#### PATCH `/tasks/:id/move`

Move a task to a different column and/or position. Automatically reorders surrounding tasks.

**Auth Required**: Yes

**Request Body**:
```json
{
  "targetColumnId": "507f1f77bcf86cd799439014",
  "targetPosition": 2
}
```

**MongoDB Operations** (Smart reordering):
```
Task.findById(id)                      // Find task
Board.findById(task.boardId)           // Verify ownership
// Case 1: Same column
if (sourceColumn === targetColumn) {
  if (oldPosition < newPosition) {
    Task.updateMany({                  // Shift tasks between down
      columnId: sourceColumn,
      position: { $gt: oldPos, $lte: newPos }
    }, {
      $inc: { position: -1 }
    })
  } else {
    Task.updateMany({                  // Shift tasks between up
      columnId: sourceColumn,
      position: { $gte: newPos, $lt: oldPos }
    }, {
      $inc: { position: 1 }
    })
  }
}
// Case 2: Different columns
else {
  Task.updateMany({                    // Remove from source
    columnId: sourceColumn,
    position: { $gt: oldPos }
  }, {
    $inc: { position: -1 }
  })
  Task.updateMany({                    // Insert to target
    columnId: targetColumn,
    position: { $gte: newPos }
  }, {
    $inc: { position: 1 }
  })
}
Task.findByIdAndUpdate(id, {           // Update task
  columnId: targetColumnId,
  position: targetPosition
})
```

**Response (200)**:
```json
{
  "id": "507f1f77bcf86cd799439016",
  "title": "Implement authentication",
  "description": "Add JWT-based auth",
  "boardId": "507f1f77bcf86cd799439012",
  "columnId": "507f1f77bcf86cd799439014",
  "priority": "high",
  "dueDate": "2026-04-10T00:00:00Z",
  "position": 2,
  "createdAt": "2026-04-03T10:30:00Z"
}
```

**Error Cases**:
- 400: Missing targetColumnId/targetPosition or invalid format
- 401: Missing or invalid token
- 403: Not board owner
- 404: Task or column not found
- 500: Database error

**Note**: If task is moved to the same column at the same position, the API call is skipped by the frontend (no-op optimization).

---

## Common Patterns

### Authorization Model

- **User ownership**: Each board has an owner (the user who created it)
- **Resource access**: All operations verify the request user owns the board
- **Cascade deletes**: Deleting a board deletes all columns and tasks within it
- **Ownership validation**: `board.owner` must match `userId` from JWT token

### Position Tracking

Tasks store a `position` field within their column (0, 1, 2, ...) rather than global position:
- Allows efficient batch updates when moving between columns
- When a task is deleted, all tasks after it are shifted up by 1
- When inserting, tasks at or after the target position are shifted down by 1

### No-Op Optimization

Frontend detects when a task is dropped in the same column at the same position and skips the API call:
```javascript
if (task.columnId === targetColumnId && task.position === targetPosition) {
  return; // Skip API call
}
```

### MongoDB Compound Queries

Move operations use compound `updateMany()` queries for efficiency:
```javascript
// Reorder multiple tasks in single operation
Task.updateMany(
  {
    columnId: targetColumn,
    position: { $gte: newPosition }
  },
  {
    $inc: { position: 1 }
  }
)
```

---

## Example Workflows

### Workflow 1: User Registration and Board Creation

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
# Response: { "id": "...", "token": "eyJ..." }

# 2. Create board
curl -X POST http://localhost:3000/api/boards \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{ "title": "My First Board" }'
# Response: { "id": "board-123", "title": "My First Board", ... }

# 3. Add columns
curl -X POST http://localhost:3000/api/boards/board-123/columns \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{ "title": "To Do" }'
```

### Workflow 2: Moving a Task Between Columns

```bash
# 1. Get current board state
curl -X GET http://localhost:3000/api/boards/board-123/columns \
  -H "Authorization: Bearer eyJ..."

# 2. Move task (already handled frontend, but API call would be:)
curl -X PATCH http://localhost:3000/api/tasks/task-456/move \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "targetColumnId": "column-789",
    "targetPosition": 0
  }'
# Response: { "id": "task-456", "columnId": "column-789", "position": 0, ... }
```

---

## Performance Considerations

### Indexing Strategy

Recommended MongoDB indexes for optimal performance:

```javascript
// User
db.users.createIndex({ email: 1 }, { unique: true })

// Boards
db.boards.createIndex({ owner: 1 })

// Columns
db.columns.createIndex({ boardId: 1, position: 1 })

// Tasks
db.tasks.createIndex({ columnId: 1, position: 1 })
db.tasks.createIndex({ boardId: 1 })
```

### Query Optimization

- **Bulk updates** for position reordering use `updateMany()` with compound queries
- **Ownership checks** filter results at DB level, not application level
- **No unnecessary joins** - normalized schema avoids complex lookups
