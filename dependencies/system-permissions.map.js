/* =========================================================
  THIS FILE CONTAINS IS THE CENTRALIZED PLACE FOR STORING
INFORMATION ON WHICH RESOURCES (ENDPOINTS) ARE AVAILABLE TO
                WHICH SYSTEM PERMISSIONS.
========================================================= */



// mapping routes to relevant system permissions
const systemPermissionsMap = new Map([

  // SYSTEM PERMISSIONS

  [`GET /api/system-permissions/`, [`admin:*`, `admin:permissions:read`]],

  // SYSTEM ROLES

  [`POST /api/system-roles`, [`admin:*`, `admin:roles:create`]],
  [`GET /api/system-roles/*`, [`admin:*`, `admin:roles:read`]],
  [`GET /api/system-roles`, [`admin:*`, `admin:roles:read`]],
  [`PATCH /api/system-roles/*`, [`admin:*`, `admin:roles:update`]],
  [`DELETE /api/system-roles/*`, [`admin:*`, `admin:roles:delete`]]

]);



// exporting map as module
module.exports = {

  systemPermissionsMap

};