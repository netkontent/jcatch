db.auth('admin-user', 'admin-password')

db = db.getSiblingDB('jcatch')

db.createUser({
  user: 'logger',
  pwd: 'logger123',
  roles: [
    {
      role: 'root',
      db: 'jcatch',
    },
  ],
});
