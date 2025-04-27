/**
 * Represents a single entry in the 'values' array found within content attributes.
 */
interface ValueEntry {
    value: number;
    percentage: number;
    datetime: string; // ISO 8601 date string
}

/**
 * Represents the attributes specific to an item within the 'content' array.
 * This structure appears common across different content types (Hidráulica, Eólica, etc.).
 */
interface ContentAttributes {
    title: string;
    description: string | null; // Can be a string (like ID) or null
    color: string; // Hex color code
    icon: string | null;
    type: string | null; // e.g., "distinct", "Generación renovable", or null for Saldo
    magnitude: string | null; // Assuming string based on null example
    composite: boolean;
    'last-update': string; // ISO 8601 date string
    values: ValueEntry[];
    total?: number; // Optional, as seen in Saldo I. internacionales
    'total-percentage'?: number; // Optional, as seen in Saldo I. internacionales
}

/**
 * Represents an item within the 'content' array of an 'included' element's attributes.
 */
interface ContentItem {
    type: string | null; // Type name or null for Saldo I. internacionales
    id: string; // Can be numeric string or descriptive ID
    groupId: string; // Parent group ID (e.g., "Renovable", "No-Renovable")
    attributes: ContentAttributes;
}

/**
 * Represents the main attributes of an 'included' item.
 */
interface IncludedAttributes {
    title: string;
    'last-update': string; // ISO 8601 date string
    description: string | null;
    magnitude: string | null; // Assuming string based on null example
    content: ContentItem[];
}

/**
 * Represents a single item in the top-level 'included' array.
 */
interface IncludedItem {
    type: string; // e.g., "Renovable", "No-Renovable"
    id: string;
    attributes: IncludedAttributes;
}

/**
 * Represents the structure of the 'cache-control' object within 'meta'.
 */
interface CacheControl {
    cache: string; // e.g., "HIT"
    expireAt: string; // ISO 8601 date string
}

/**
 * Represents the 'meta' object within the main 'data' object.
 */
interface MetaData {
    'cache-control': CacheControl;
}

/**
 * Represents the attributes of the main 'data' object.
 */
interface DataAttributes {
    title: string;
    'last-update': string; // ISO 8601 date string
    description: string;
}

/**
 * Represents the main 'data' object in the API response.
 */
export interface ApiDataObject {
    type: string; // e.g., "Balance de energía eléctrica"
    id: string;
    attributes: DataAttributes;
    meta: MetaData;
}

/**
 * Represents the overall structure of the JSON API response.
 */
export interface ReeApiResponse {
    data: ApiDataObject;
    included: IncludedItem[];
}