/**
 * GA4 integration configuration.
 *
 * • propertyId – GA4 property ID (numeric, e.g. "123456789").
 * • dateRange – ISO-8601 start/end (YYYY-MM-DD). Use same range as the dashboard.
 * • identifierMode – 'customDimension' | 'slugPath'
 *   – 'customDimension' → uses the custom dimension "partner_id".
 *   – 'slugPath'       → extracts the slug from page_path and maps it to the store name.
 * • partnerIdMap – when using slugPath, inform the mapping slug → partner_id.
 *   (ex.: { "lanchonete-do-juninho": "12345" })
 * • apiKey – OAuth 2.0 Bearer token or API-Key for the Data API.
 */
export const GA4_CONFIG = {
    enabled: true,                     // disable to turn off integration
    propertyId: 'YOUR_GA4_PROPERTY_ID', // ← replace this
    dateRange: {
        start: '2026-02-01',
        end: '2026-02-28'
    },
    identifierMode: 'customDimension' as const, // or 'slugPath'

    // Only used if identifierMode === 'slugPath'
    partnerIdMap: {} as Record<string, string>,

    // Access token (Bearer) – generated via Service Account or OAuth
    apiKey: '' // ← insert here
};
