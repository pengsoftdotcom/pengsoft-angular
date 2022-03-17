import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    public readonly CACHE = 'pengsoft';

    public set(key: string, val: any): void {
        const item = localStorage.getItem(this.CACHE)
        let cache: any = {};
        if (item) {
            cache = JSON.parse(item);
        }
        cache[key] = val;
        localStorage.setItem(this.CACHE, JSON.stringify(cache));
    }

    public get(key: string): any {
        const item = localStorage.getItem(this.CACHE)
        let cache: any = {};
        if (item) {
            cache = JSON.parse(item);
        }
        return cache[key];
    }

    public clear(): void {
        localStorage.removeItem(this.CACHE);
    }

}
