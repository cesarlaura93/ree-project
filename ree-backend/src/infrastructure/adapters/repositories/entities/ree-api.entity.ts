interface ValueEntry {
    value: number;
    percentage: number;
    datetime: string;
}

interface ContentAttributes {
    title: string;
    description: string | null;
    color: string;
    icon: string | null;
    type: string | null;
    magnitude: string | null;
    composite: boolean;
    'last-update': string;
    values: ValueEntry[];
    total?: number;
    'total-percentage'?: number;
}

interface ContentItem {
    type: string | null;
    id: string;
    groupId: string;
    attributes: ContentAttributes;
}

interface IncludedAttributes {
    title: string;
    'last-update': string;
    description: string | null;
    magnitude: string | null;
    content: ContentItem[];
}

interface IncludedItem {
    type: string;
    id: string;
    attributes: IncludedAttributes;
}

interface CacheControl {
    cache: string;
    expireAt: string;
}

interface MetaData {
    'cache-control': CacheControl;
}

interface DataAttributes {
    title: string;
    'last-update': string;
    description: string;
}

export interface ApiDataObject {
    type: string;
    id: string;
    attributes: DataAttributes;
    meta: MetaData;
}

export interface ReeApiResponse {
    data: ApiDataObject;
    included: IncludedItem[];
}