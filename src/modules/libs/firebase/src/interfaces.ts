import  * as admin from 'firebase-admin';

export interface FirebaseModuleOptions extends admin.AppOptions{}

export type AdminAuth = admin.auth.Auth;
export type App = admin.app.App;