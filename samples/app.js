import { EventEmitter } from 'node:events';
import * as utils from './utils.js';
import defaultConfig, { API_URL as baseUrl } from './config.js';

/* Блочный комментарий:
   проверяем, что он серый */

/**
 * JSDoc-комментарий.
 * @param {HTMLElement} root - корневой элемент
 * @param {{ count: number, debug?: boolean }} options
 * @returns {Promise<void>}
 */
export async function initApp(root, { count = 10, debug = false } = {}) {
    const items = await fetchItems(`${baseUrl}/items?limit=${count}`);
    let total = 0;

    for (const item of items) {
        if (item?.price > 100 && !item.hidden) {
            total += item.price * 1.2;
        } else if (item.price === undefined) {
            continue;
        }
    }

    root.textContent = `Итого: ${total.toFixed(2)} ₴`;
    debug && console.log('[app]', { total, items });
}

// Класс с наследованием
export default class Store extends EventEmitter {
    static VERSION = '1.0.1';
    #state = new Map();

    constructor(initial = {}) {
        super();
        this.name = 'store';
        Object.entries(initial).forEach(([key, value]) => this.set(key, value));
    }

    get size() {
        return this.#state.size;
    }

    set(key, value) {
        this.#state.set(key, value);
        this.emit('change', { key, value });
        return this;
    }
}

const fetchItems = async (url) => {
    try {
        const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(error instanceof TypeError ? 'Network error' : error.message);
        return [];
    } finally {
        utils.log("done");
    }
};

const EMAIL_RE = /^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i;
const numbers = [0, -1, 3.14, 1e6, 0xff, 0b1010, 1_000_000, 10n, NaN, Infinity];
const flags = { isNull: null, isUndef: undefined, yes: true, no: false };
const { a, ...rest } = { a: 1, b: 2, c: 3 };

switch (typeof defaultConfig) {
    case 'object':
        console.info(Math.max(...numbers), JSON.stringify(flags), rest, EMAIL_RE.test('a@b.cd'));
        break;
    default:
        new Store({ a });
}

window.setTimeout(() => document.body.classList.toggle('ready'), 300);
