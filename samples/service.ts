import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map, catchError, of } from 'rxjs';

/** Статус заказа */
export enum OrderStatus {
    Pending = 'pending',
    Paid = 'paid',
    Shipped = 'shipped',
}

export interface Order<TMeta = Record<string, unknown>> {
    readonly id: number;
    title: string;
    price?: number;
    status: OrderStatus;
    tags: string[];
    meta: TMeta;
}

type OrderKeys = keyof Order;
type Nullable<T> = T | null;
type PartialOrder = Partial<Pick<Order, 'title' | 'price'>>;

// Абстрактный базовый класс
abstract class BaseService<T extends { id: number }> {
    protected readonly cache = new Map<number, T>();
    abstract load(id: number): Observable<Nullable<T>>;
}

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseService<Order> implements Disposable {
    private readonly http = inject(HttpClient);
    private static readonly API = '/api/v1/orders' as const;
    public timeoutMs: number = 5_000;

    constructor(private readonly locale: string = 'ru-UA') {
        super();
    }

    load(id: number): Observable<Nullable<Order>> {
        const params = new HttpParams().set('expand', 'meta');
        return this.http.get<Order>(`${OrderService.API}/${id}`, { params }).pipe(
            map((order) => ({ ...order, title: order.title.trim() })),
            catchError(() => of(null)),
        );
    }

    formatPrice(order: Order): string {
        if (typeof order.price !== 'number') return '—';
        return new Intl.NumberFormat(this.locale, { style: 'currency', currency: 'UAH' }).format(order.price);
    }

    isPaid(order: Order): order is Order & { status: OrderStatus.Paid } {
        return order.status === OrderStatus.Paid;
    }

    [Symbol.dispose](): void {
        this.cache.clear();
    }
}

export const DEFAULTS = { retries: 3, debug: false } satisfies Record<string, number | boolean>;

export function groupBy<T, K extends PropertyKey>(list: readonly T[], getKey: (item: T) => K): Record<K, T[]> {
    return list.reduce((acc, item) => {
        (acc[getKey(item)] ??= []).push(item);
        return acc;
    }, {} as Record<K, T[]>);
}

declare global {
    interface Window { __APP_VERSION__: string }
}

namespace Utils {
    export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
}
