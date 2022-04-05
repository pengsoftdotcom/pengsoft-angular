import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StoreService } from './store.service';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {

    private readonly ACCESS_TOKEN = 'accessToken';

    private readonly USER_DETAILS = 'userDetails';

    constructor(private store: StoreService) { }

    getBearerAuthorizationHeaders(): any {
        return { Authorization: 'Bearer ' + this.accessToken.value };
    }

    getBasicAuthorizationHeaders(): any {
        return { Authorization: environment.authorization.basic };
    }

    isAuthenticated(): boolean {
        const accessToken = this.accessToken;
        return accessToken.expiredAt && accessToken.expiredAt - new Date().getTime() + 1000 * 60 * 30 > 0;
    }

    isNotAuthenticated(): boolean {
        return !this.isAuthenticated();
    }

    clear(): void {
        this.store.clear();
    }

    get accessToken(): any {
        return Object.assign({}, this.store.get(this.ACCESS_TOKEN));
    }

    set accessToken(accessToken: any) {
        this.store.set(this.ACCESS_TOKEN, accessToken);
    }

    get userDetails(): any {
        return Object.assign({ user: {} }, this.store.get(this.USER_DETAILS));
    }

    set userDetails(userDetails: any) {
        this.store.set(this.USER_DETAILS, userDetails);
    }

    get urlsPermitted(): string[] {
        return ['/oauth/token'];
    }

    hasAnyRole(roles: string[]): boolean {
        const userRoles: string[] = this.userDetails && this.userDetails.roles ? this.userDetails.roles : [];
        return userRoles.some((userRole: any) => roles.some(role => role === userRole.code));
    }

    hasAnyAuthority(authorityString?: string, exclusive?: string): boolean {
        const authorities: string[] = [];
        if (authorityString) {
            authorityString.split(',')
                .map(authority => authority.trim())
                .forEach(authority => authorities.push(authority));
        }
        const userAuthorities: string[] = this.userDetails && this.userDetails.authorities ? this.userDetails.authorities : [];
        if (authorities.length > 0) {
            if (authorities.some(authority => userAuthorities.includes(authority))) {
                if (exclusive && exclusive.split(',').some(e => userAuthorities.includes(e.trim()))) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }

}
