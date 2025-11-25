import type { User as ApiUser } from '@/types/api';
import type { Permission } from '@/types/domain';

export function getUserPermissions(user: ApiUser): Permission[] {
  const basePermissions: Permission[] = ['read_own_profile'];

  switch (user.role) {
    case 'participant':
      return [
        ...basePermissions,
        'read_own_profile',
        'read_own_assignment',
        'read_event'
      ];

    case 'organizer':
      return [
        ...basePermissions,
        'update_own_profile',
        'create_event',
        'read_event',
        'update_event',
        'delete_event',
        'manage_participants',
        'manage_rules',
        'generate_assignments',
        'read_assignments'
      ];

    case 'admin':
      return [
        ...basePermissions,
        'update_own_profile',
        'create_event',
        'read_event',
        'update_event',
        'delete_event',
        'manage_participants',
        'manage_rules',
        'generate_assignments',
        'read_assignments',
        'manage_all_events',
        'manage_users',
        'view_admin_dashboard',
        'view_all_events',
        'view_all_users',
        'system_admin'
      ];

    default:
      return basePermissions;
  }
}

export function hasPermission(user: ApiUser | null, permission: Permission): boolean {
  if (!user) return false;
  return getUserPermissions(user).includes(permission);
}

export function hasAnyPermission(user: ApiUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  const userPermissions = getUserPermissions(user);
  return permissions.some(permission => userPermissions.includes(permission));
}

export function hasAllPermissions(user: ApiUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  const userPermissions = getUserPermissions(user);
  return permissions.every(permission => userPermissions.includes(permission));
}