# CURSOR AI PROMPT: Backend Login as Doctor Feature

## Problem
The frontend is calling `POST /api/users/{id}/login-as` but getting 404 error. Need to implement this endpoint.

## Requirements

### 1. Add Route
In `routes/api.php`, add:
```php
Route::post('/users/{user}/login-as', [UserController::class, 'loginAs'])
    ->middleware(['auth:sanctum', 'role:admin'])
    ->name('users.login-as');
```

### 2. Add Controller Method
In `UserController`, add `loginAs` method:

```php
public function loginAs(User $user)
{
    // Security: Only admins can impersonate
    if (!auth()->user()->hasRole('admin')) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized. Only admins can impersonate users.',
        ], 403);
    }

    // Prevent self-impersonation
    if (auth()->id() === $user->id) {
        return response()->json([
            'success' => false,
            'message' => 'You cannot impersonate yourself.',
        ], 403);
    }

    // Load relationships
    $user->load(['roles.permissions', 'permissions']);

    // Get all permissions (direct + through roles)
    $allPermissions = collect();
    $allPermissions = $allPermissions->merge($user->permissions);
    foreach ($user->roles as $role) {
        $allPermissions = $allPermissions->merge($role->permissions);
    }
    $allPermissions = $allPermissions->unique('name')->values();

    // Format response to match frontend expectations
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
                    'guard_name' => $role->guard_name ?? 'web',
                    'permissions' => $role->permissions->map(function ($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                            'guard_name' => $permission->guard_name ?? 'web',
                        ];
                    }),
                ];
            }),
            'directPermissions' => $user->permissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name ?? 'web',
                ];
            }),
            'allPermissions' => $allPermissions->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name ?? 'web',
                ];
            }),
            'doctor' => $user->account_type === 'doctor' ? $user->doctor : null,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ],
    ]);
}
```

### 3. Response Format Requirements
The frontend expects this exact structure:
- `success: boolean`
- `message: string`
- `data: object` with:
  - `id`, `name`, `email`, `account_type`
  - `roles[]` with nested `permissions[]`
  - `directPermissions[]` (usually empty)
  - `allPermissions[]` (flat array of ALL permissions - direct + through roles)
  - `doctor` (if account_type is 'doctor')
  - `created_at`, `updated_at`

### 4. Important Notes
- **No token change**: This does NOT change the auth token. Admin stays logged in.
- **Permission format**: All permissions must include `guard_name` field (default to 'web' if not set).
- **allPermissions**: Must be a flat array containing ALL permissions (both direct and through roles), with duplicates removed.
- **Security**: Only admins can access. Check role in middleware AND controller.

### 5. Testing
Test with:
```bash
POST /api/users/4/login-as
Headers: Authorization: Bearer {admin_token}
```

Should return 200 with user data including all permissions.

