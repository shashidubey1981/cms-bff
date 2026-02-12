export type PageProps =  {
        url: string;
        taxonomies: Taxonomy[];
        components: PageBlock[];
        hero: Hero[];
        seo: SeoProps;
        media: Media[];
        details: PDPPageBlock[];
        marketing: PDPPageBlock[];
}

export type Taxonomy = {
    taxonomy_uid: string;
    term_uid: string;
}

export type PageBlock = {
    api_component: APIComponent;
    teaser: Teaser;
    text: Text;
    card_collection: CardCollection;
    pgp_collection: PGPCardCollection;
    quick_links: QuickLinks;
    image_preset: Image;
}

export type Teaser = {
    id: string;
    heading: string;
    content: string;
    cta: CTA[];
    image: Image[];
    video: Video;
    isABEnabled: boolean;
    styles: Styles;
}

export type PGPCardCollection = {
    header: CardCollectionHeader;
    cards: PGPImageCardItem[];
}

export type PGPImageCardItem = {
    content: string;
    cta: CTA;
    image: Asset;
    image_alt_text: string;
    is_thumbnail: boolean;
    title: string;
    subtitle: string;
}

export type CardCollection = {
    header: CardCollectionHeader;
    id: string;
    cards: ImageCardItem[];
    count: number;
    edit_key: string;
    class_name: string;
}

export type CardCollectionHeader = {
    id: string;
    heading: string;
    content: string;
    sub_heading: string;
    class_name: string;
    cta: CTA;
}

export type ImageCardItem = {
    id: string|number;
    key: string|number;
    count: number;
    index: any;

    // Image
    image: Asset;
    cover_image: Asset;
    image_alt_text: string;
    image_position: string;
    is_thumbnail: boolean;
    alt: string;

    // Text
    title: string;
    subtitle: string;
    cta: CTA;
    url: string;
    summary: string;
}

export type Text = {
    id: string;
    content: any;
}

export type Asset = {
    content_type: string;
    contentType: string;
    dimension: Dimension;
    file_size: string;
    filename: string;
    is_dir: boolean;
    url: string;
}

export type Dimension = {
    height: number;
    width: number;
}

export type Video = {
    id: string | number;
    video: Asset;
    video_alt_text: string;
}

export type Image = {
    id: string | number;
    image: Asset;
    cover_image: Asset;
    image_alt_text: string;
    image_position: string;
    is_thumbnail: boolean;
    alt: string;
}

export type CTA = {
    text: string;
    external_url: string;
    link: InternalLink[];
}

export type InternalLink = {
    uid: string;
    content_type_uid: string;
    url: string;
    text: string;
}

export type APIComponent = {
    id: string;
    component_name: string;
}

export type Hero = {
    id: string;
    heading: string;
    content: string;
    cta: CTA[];
    image: Image[];
    video: Video;
    styles: Styles;
    summary: string;
    title: string;
    url: string;
    cover_image: Asset;
}
export type Styles = {
    text_align: string;
    theme: string;
    image_position: string;
}

export type SeoProps = {
    title: string;
    description: string;
    canonical_url: string;
    no_follow: boolean;
    no_index: boolean;
}

export type Media = {
    badge: boolean;
    identifier: string;
    name: string;
    image_url: string;
    alt: string;
    link: string;
    description: string;
}

export type PDPPageBlock = {
    brand_link: DynamicComponent;
    product_title: DynamicComponent;
    rating_summary: DynamicComponent;
    current_price: DynamicComponent;
    promotion_link: DynamicComponent;
    color_variant: DynamicComponent;
    inline_bundle: DynamicComponent;
    size_selection: DynamicComponent;
    length_selection: DynamicComponent;
    cross_sell_panel: DynamicComponent;
    purchase_action: DynamicComponent;
    personalized_list: DynamicComponent;
    payment: DynamicComponent;
    trust_assurance: DynamicComponent;
    fulfillment_options: DynamicComponent;
    shipping_options: ShippingPromoBannerComponent;
    accordion_group: AccordionGroupComponent;
    style_inspiration: DynamicComponent;
    frequently_bought: DynamicComponent;
    shop_similar: DynamicComponent;
    reviews: DynamicComponent;
    quick_links: QuickLinks;
}

export type QuickLinks = {
    title: string;
}

export type DynamicComponent = {
    dynamic_component: boolean;
    label: string;
}

export type ShippingPromoBannerComponent = {
    dynamic_component: boolean;
    icon: string;
    guest: ShippingPromoBannerContent;
    signed: ShippingPromoBannerContent;
}

export type ShippingPromoBannerContent = {
    title: RichText;
    subtitle: RichText;
}

export type RichText = {
    content: any;
}

export type AccordionGroupComponent = {
    dynamic_component: boolean;
    items: AccordionItem[];
}

export type AccordionItem = {
    dynamic: boolean;
    title: string;
    content: RichText;
}

// ---------------------------------------------------------------------------
// Raw Contentstack entry shape (adjust keys to match your CS content type)
// ---------------------------------------------------------------------------
export type RawPageEntry = Record<string, unknown> & {
    url?: string;
    taxonomies?: Taxonomy[] | unknown[];
    components?: PageBlock[] | unknown[];
    hero?: Hero[] | unknown[];
    seo?: Partial<SeoProps> | unknown;
    media?: Media[] | unknown[];
    details?: PDPPageBlock[] | unknown[];
    marketing?: PDPPageBlock[] | unknown[];
};

const defaultSeo: SeoProps = {
    title: '',
    description: '',
    canonical_url: '',
    no_follow: false,
    no_index: false,
};

/** Safely cast array or default to empty array */
function toArray<T>(value: unknown, guard?: (item: unknown) => item is T): T[] {
    if (Array.isArray(value)) {
        return guard ? value.filter(guard) : (value as T[]);
    }
    return [];
}

/**
 * Transform a raw Contentstack page entry into the typed PageProps shape.
 * Adjust field mappings below to match your actual Contentstack schema keys.
 */
export function transformEntryToPageProps(raw: RawPageEntry): PageProps {
    return {
        url: typeof raw?.url === 'string' ? raw.url : '',
        taxonomies: toArray<Taxonomy>(raw?.taxonomies),
        components: toArray<PageBlock>(raw?.components),
        hero: toArray<Hero>(raw?.hero),
        seo: raw?.seo && typeof raw.seo === 'object' && !Array.isArray(raw.seo)
            ? { ...defaultSeo, ...(raw.seo as Partial<SeoProps>) }
            : defaultSeo,
        media: toArray<Media>(raw?.media),
        details: toArray<PDPPageBlock>(raw?.details),
        marketing: toArray<PDPPageBlock>(raw?.marketing),
    };
}

/**
 * Transform an array of raw entries to PageProps[].
 */
export function transformEntriesToPageProps(rawEntries: RawPageEntry[]): PageProps[] {
    return rawEntries.map(transformEntryToPageProps);
}

