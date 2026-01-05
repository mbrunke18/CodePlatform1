import { db } from '../server/db.js';
import { roles, permissions, rolePermissions } from '../shared/schema.js';

async function seed() {
    console.log('🌱 Starting database seed...');
    
    try {
        // Clear existing data
        await db.delete(rolePermissions);
        await db.delete(roles);
        await db.delete(permissions);

        // 1. Create Permissions
        const p = await db.insert(permissions).values([
            { action: 'create_organization', description: 'Allows user to create a new organization.' },
            { action: 'create_scenario', description: 'Allows user to create a strategic scenario.' },
            { action: 'view_users', description: 'Allows user to view all users in the system.' },
        ]).returning();

        // 2. Create Roles
        const r = await db.insert(roles).values([
            { name: 'Admin' },
            { name: 'Executive' },
            { name: 'Analyst' },
        ]).returning();

        // 3. Assign Permissions to Roles
        const adminRole = r.find(role => role.name === 'Admin');
        const execRole = r.find(role => role.name === 'Executive');

        if (adminRole && execRole) {
            const adminPermissions = p.map(perm => perm.id);
            const execPermissions = p.filter(perm => perm.action !== 'view_users').map(perm => perm.id);

            await db.insert(rolePermissions).values(
                adminPermissions.map(permId => ({ roleId: adminRole.id, permissionId: permId }))
            );
            await db.insert(rolePermissions).values(
                execPermissions.map(permId => ({ roleId: execRole.id, permissionId: permId }))
            );
        }
        
        console.log('\n✅ Seed complete!');
        console.log('🚀 IMPORTANT: After you sign up, manually assign a `roleId` to your user in the database to enable permissions.');
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
    
    process.exit(0);
}

seed();