import {Injectable} from '@nestjs/common';
import * as admin from 'firebase-admin';
import {App, AdminAuth} from '../interfaces';



@Injectable()
export class FirebaseAdminAuthService implements AdminAuth {


    constructor(
        public readonly  app: App,
    ) {

    }

    protected get auth() {
        try {
            return this.app.auth();
        } catch (error) {
            console.error(
                {
                    error,
                    message: 'Firebase instance is undefined'
                }
            );
            throw new Error(
                'Firebase instance is undefined',
            );
        }
    }

    createCustomToken(uid: string, developerClaims?: Object): Promise<string> {
        return this.auth.createCustomToken(uid, developerClaims);
    }

    createProviderConfig(config: admin.auth.AuthProviderConfig): Promise<admin.auth.AuthProviderConfig> {
        return this.auth.createProviderConfig(config);
    }

    createSessionCookie(idToken: string, sessionCookieOptions: admin.auth.SessionCookieOptions): Promise<string> {
        return this.auth.createSessionCookie(idToken, sessionCookieOptions);
    }

    createUser(properties: admin.auth.CreateRequest): Promise<admin.auth.UserRecord> {
        return this.auth.createUser(properties);
    }

    deleteProviderConfig(providerId: string): Promise<void> {
        return this.auth.deleteProviderConfig(providerId);
    }

    deleteUser(uid: string): Promise<void> {
        return this.auth.deleteUser(uid);
    }

    deleteUsers(uids: string[]): Promise<admin.auth.DeleteUsersResult> {
        return this.auth.deleteUsers(uids);
    }

    generateEmailVerificationLink(email: string, actionCodeSettings?: admin.auth.ActionCodeSettings): Promise<string> {
        return this.auth.generateEmailVerificationLink(email, actionCodeSettings);
    }

    generatePasswordResetLink(email: string, actionCodeSettings?: admin.auth.ActionCodeSettings): Promise<string> {
        return this.auth.generatePasswordResetLink(email, actionCodeSettings);
    }

    generateSignInWithEmailLink(email: string, actionCodeSettings: admin.auth.ActionCodeSettings): Promise<string> {
        return this.auth.generateSignInWithEmailLink(email,actionCodeSettings);
    }

    getProviderConfig(providerId: string): Promise<admin.auth.AuthProviderConfig> {
        return this.auth.getProviderConfig(providerId);
    }

    getUser(uid: string): Promise<admin.auth.UserRecord> {
        return this.auth.getUser(uid);
    }

    getUserByEmail(email: string): Promise<admin.auth.UserRecord> {
        return this.auth.getUserByEmail(email);
    }

    getUserByPhoneNumber(phoneNumber: string): Promise<admin.auth.UserRecord> {
        return this.auth.getUserByPhoneNumber(phoneNumber);
    }

    getUsers(identifiers: admin.auth.UserRecord[]): Promise<admin.auth.GetUsersResult> {
        return this.auth.getUsers(identifiers);
    }

    importUsers(users: admin.auth.UserImportRecord[], options?: admin.auth.UserImportOptions): Promise<admin.auth.UserImportResult> {
        return this.auth.importUsers(users);
    }

    listProviderConfigs(options: admin.auth.AuthProviderConfigFilter): Promise<admin.auth.ListProviderConfigResults> {
        return this.auth.listProviderConfigs(options);
    }

    listUsers(maxResults?: number, pageToken?: string): Promise<admin.auth.ListUsersResult> {
        return this.auth.listUsers(maxResults, pageToken);
    }

    revokeRefreshTokens(uid: string): Promise<void> {
        return this.auth.revokeRefreshTokens(uid);
    }

    setCustomUserClaims(uid: string, customUserClaims: Object | null): Promise<void> {
        return this.auth.setCustomUserClaims(uid, customUserClaims);
    }

    tenantManager(): admin.auth.TenantManager {
        return this.auth.tenantManager();
    }

    updateProviderConfig(providerId: string, updatedConfig: admin.auth.UpdateAuthProviderRequest): Promise<admin.auth.AuthProviderConfig> {
        return this.auth.updateProviderConfig(providerId, updatedConfig);
    }

    updateUser(uid: string, properties: admin.auth.UpdateRequest): Promise<admin.auth.UserRecord> {
        return this.auth.updateUser(uid, properties);
    }

    verifyIdToken(idToken: string, checkRevoked?: boolean): Promise<admin.auth.DecodedIdToken> {
        return this.auth.verifyIdToken(idToken, checkRevoked);
    }

    verifySessionCookie(sessionCookie: string, checkForRevocation?: boolean): Promise<admin.auth.DecodedIdToken> {
        return this.auth.verifySessionCookie(sessionCookie);
    }
}

/*
This file is a partial modification of the following project:
Full project source: https://github.com/Aginix/nestjs-firebase-admin
Copyright 2020 by Sam Aginix (https://github.com/Aginix).
All rights reserved.
 */