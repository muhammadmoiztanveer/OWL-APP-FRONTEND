# Backend Implementation: Login as Doctor Feature

## Overview
Implement a "Login as Doctor" feature that allows admin users to impersonate doctor users. This feature should return the doctor user's data (with permissions) so the frontend can display the doctor's dashboard and modules.

## Requirements

### 1. Route Definition
Add a new route in `routes/api.php`:

```php
Route::post('/users/{user}/login-as', [UserController::class, 'loginAs'])
    ->middleware(['auth:sanctum', 'role:admin'])
    ->name('users.login-as');
```

**Important Notes:**
- Route should be protected with `auth:sanctum` middleware
- Only users with `admin` role should be able to access this route
- The route parameter `{user}` should accept the user ID

### 2. Controller Method
Add a `loginAs` method to `UserController`:

```php
/**
 * Allow admin to login as another user (doctor)
 * 
 * @param User $user The user to impersonate
 * @return \Illuminate\Http\JsonResponse
 */
public function loginAs(User $user)
{
    // Check if current user is admin
    if (!auth()->user()->hasRole('admin')) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized. Only admins can impersonate users.',
        ], 403);
    }

    // Optional: Check if user being impersonated is a doctor
    // Uncomment if you only want to allow impersonating doctors
    // if ($user->account_type !== 'doctor') {
    //     return response()->json([
    //         'success' => false,
    //         'message' => 'You can only impersonate doctor users.',
    //     ], 403);
    // }

    // Prevent admin from impersonating themselves
    if (auth()->id() === $user->id) {
        return response()->json([
            'success' => false,
            'message' => 'You cannot impersonate yourself.',
        ], 403);
    }

    // Load user relationships (roles with permissions)
    $user->load(['roles.permissions', 'permissions']);

    // Use UserResource to format the response (if you have one)
    // This ensures consistent response format with login/register endpoints
    return response()->json([
        'success' => true,
        'message' => 'User data retrieved successfully',
        'data' => new UserResource($user), // Or format manually (see below)
    ]);
}
```

### 3. Response Format
The response should match the structure expected by the frontend. The frontend expects:

```json
{
    "success": true,
    "message": "User data retrieved successfully",
    "data": {
        "id": 4,
        "name": "Dr. John Doe",
        "email": "doctor@example.com",
        "account_type": "doctor",
        "roles": [
            {
                "id": 2,
                "name": "doctor",
                "guard_name": "web",
                "permissions": [
                    {
                        "id": 1,
                        "name": "patient.view",
                        "guard_name": "web"
                    },
                    {
                        "id": 2,
                        "name": "patient.create",
                        "guard_name": "web"
                    }
                    // ... more permissions
                ]
            }
        ],
        "directPermissions": [],
        "allPermissions": [
            {
                "id": 1,
                "name": "patient.view",
                "guard_name": "web"
            },
            {
                "id": 2,
                "name": "patient.create",
                "guard_name": "web"
            }
            // ... all permissions (direct + through roles)
        ],
        "doctor": {
            // Doctor profile data if exists
        },
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
    }
}
```

### 4. UserResource Implementation (Recommended)
If you have a `UserResource`, update it to include all necessary fields:

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // Get all permissions (direct + through roles)
        $allPermissions = $this->getAllPermissions();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'account_type' => $this->account_type,
            'roles' => $this->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'guard_name' => $role->guard_name,
                    'permissions' => $role->permissions->map(function ($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                            'guard_name' => $permission->guard_name,
                        ];
                    }),
                ];
            }),
            'directPermissions' => $this->permissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name,
                ];
            }),
            'allPermissions' => $allPermissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name,
                ];
            }),
            'doctor' => $this->when($this->account_type === 'doctor', function () {
                return $this->doctor; // Assuming you have a doctor relationship
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Get all permissions (direct + through roles)
     */
    private function getAllPermissions()
    {
        $permissions = collect();

        // Add direct permissions
        $permissions = $permissions->merge($this->permissions);

        // Add permissions through roles
        foreach ($this->roles as $role) {
            $permissions = $permissions->merge($role->permissions);
        }

        // Remove duplicates by permission name
        return $permissions->unique('name')->values();
    }
}
```

### 5. Alternative: Manual Response Formatting
If you don't have a UserResource, format the response manually in the controller:

```php
public function loginAs(User $user)
{
    // ... validation checks from above ...

    // Load relationships
    $user->load(['roles.permissions', 'permissions']);

    // Get all permissions (direct + through roles)
    $allPermissions = collect();
    $allPermissions = $allPermissions->merge($user->permissions);
    foreach ($user->roles as $role) {
        $allPermissions = $allPermissions->merge($role->permissions);
    }
    $allPermissions = $allPermissions->unique('name')->values();

    return response()->json([
        'success' => true,
        'message' => 'User data retrieved successfully',
        'data' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'account_type' => $user->account_type,
            'roles' => $user->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'guard_name' => $role->guard_name,
                    'permissions' => $role->permissions->map(function ($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                            'guard_name' => $permission->guard_name,
                        ];
                    }),
                ];
            }),
            'directPermissions' => $user->permissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name,
                ];
            }),
            'allPermissions' => $allPermissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name,
                ];
            }),
            'doctor' => $user->account_type === 'doctor' ? $user->doctor : null,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ],
    ]);
}
```

### 6. Security Considerations

1. **Role Check**: Only admins should be able to use this endpoint
2. **Self-Impersonation**: Prevent admins from impersonating themselves
3. **Optional Doctor-Only**: Optionally restrict to only doctor users
4. **Audit Logging**: Consider logging when admins impersonate users (optional):

```php
// Add to loginAs method
activity()
    ->causedBy(auth()->user())
    ->performedOn($user)
    ->log('Admin impersonated user');
```

### 7. Testing Checklist

- [ ] Admin can call the endpoint successfully
- [ ] Non-admin users get 403 error
- [ ] Admin cannot impersonate themselves (403 error)
- [ ] Response includes all user data (roles, permissions)
- [ ] Response includes `allPermissions` array
- [ ] Response format matches frontend expectations
- [ ] Doctor profile is included if user is a doctor
- [ ] Permissions are properly nested in roles
- [ ] No duplicate permissions in `allPermissions`

### 8. Error Responses

**403 Forbidden (Not Admin):**
```json
{
    "success": false,
    "message": "Unauthorized. Only admins can impersonate users."
}
```

**403 Forbidden (Self-Impersonation):**
```json
{
    "success": false,
    "message": "You cannot impersonate yourself."
}
```

**404 Not Found (User doesn't exist):**
```json
{
    "success": false,
    "message": "User not found."
}
```

### 9. Important Notes

- **No Token Change**: This endpoint does NOT change the authentication token. The admin remains logged in with their own token.
- **Frontend Handling**: The frontend stores the impersonated user data separately and uses it for permission checks and UI display.
- **Session Safety**: The actual session remains tied to the admin user, so logging out will log out the admin, not the impersonated user.
- **Permission Format**: Ensure permissions include `guard_name` field (should be "web" for web guard permissions).

### 10. Example Request

```bash
POST /api/users/4/login-as
Headers:
  Authorization: Bearer {admin_token}
  Accept: application/json
```

### 11. Expected Response (Success)

```json
{
    "success": true,
    "message": "User data retrieved successfully",
    "data": {
        "id": 4,
        "name": "Dr. John Doe",
        "email": "doctor@example.com",
        "account_type": "doctor",
        "roles": [...],
        "directPermissions": [],
        "allPermissions": [...],
        "doctor": {...},
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
    }
}
```

## Implementation Priority

1. **CRITICAL**: Add route with admin middleware
2. **CRITICAL**: Implement controller method with validation
3. **IMPORTANT**: Format response to match frontend expectations
4. **IMPORTANT**: Include `allPermissions` array in response
5. **NICE TO HAVE**: Add audit logging
6. **NICE TO HAVE**: Add rate limiting for security

## Notes for Frontend Compatibility

The frontend expects:
- `success: boolean`
- `message: string`
- `data: UserManagement` (with all fields including `allPermissions`)
- Permissions should have `guard_name` field
- Roles should include nested `permissions` array
- `allPermissions` should be a flat array of all permissions (direct + through roles)

Make sure the response structure matches exactly what the frontend is expecting!

