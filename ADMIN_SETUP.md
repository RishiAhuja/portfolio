# Admin Panel Setup Guide

## 1. Database Setup

1. Navigate to your Supabase project dashboard
2. Go to **SQL Editor** in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `/supabase-schema-uncompiled.sql`
5. Paste into the SQL editor and click **Run**
6. Verify tables are created:
   - `uncompiled_entries`
   - `admin_users`
   - `admin_sessions`

## 2. Create First Admin User

### Option A: Using SQL Query

Run this query in Supabase SQL Editor (replace with your credentials):

```sql
INSERT INTO admin_users (email, password_hash)
VALUES (
  'your-email@example.com',
  crypt('your-secure-password', gen_salt('bf'))
);
```

### Option B: Using Node.js Script

Create a temporary file `scripts/create-admin.js`:

```javascript
import { createAdminUser } from '../src/lib/admin.js';

const email = 'your-email@example.com';
const password = 'your-secure-password';

createAdminUser(email, password).then(result => {
  console.log('Admin user created:', result);
}).catch(err => {
  console.error('Error:', err);
});
```

Run:
```bash
node scripts/create-admin.js
```

## 3. Access Admin Panel

1. Navigate to `/admin` in your browser
2. Login with your admin credentials
3. You should see the admin dashboard

## 4. Managing Content

### Create New Entry
- Click "Create New Entry"
- Fill in title, date, and content
- Slug is auto-generated from title (editable)
- Click "Create Entry"
- Entry starts as draft (not visible on `/uncompiled`)

### Publish Entry
- Toggle the "Published" switch on any entry
- Published entries appear immediately on `/uncompiled`

### Edit Entry
- Click "Edit" on any entry
- Modify content as needed
- Click "Update Entry"

### Delete Entry
- Click "Delete" on any entry
- Confirm deletion (permanent action)

## 5. Mobile Usage

The admin panel is fully responsive and works on mobile browsers:
- Navigate to `yourdomain.com/admin`
- Login with your credentials
- Create/edit/publish entries on the go

## 6. Security Notes

- Sessions expire after 7 days of inactivity
- Passwords are hashed with bcrypt
- RLS policies ensure only authenticated admins can modify content
- Public can only read published entries
- Logout button clears local session

## 7. Troubleshooting

### "Invalid credentials" error
- Double-check email/password
- Ensure admin user was created successfully
- Check Supabase logs for auth errors

### Entries not appearing on `/uncompiled`
- Ensure entry is marked as "Published"
- Check Supabase RLS policies are enabled
- Verify `get_published_entries()` function exists

### Session expired immediately
- Check `admin_sessions` table exists
- Verify `verify_admin_session()` function is created
- Clear browser localStorage and login again
