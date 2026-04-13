/**
 * Roles disponibles en la aplicación.
 * Se usa para proteger rutas con @Roles() + RolesGuard.
 */
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
