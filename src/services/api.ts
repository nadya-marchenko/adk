export interface Fund {
    id: number;
    name: string;
    aum: string;
    return1Month: number;
    return3Month: number;
    return1Year: number;
    return3Year: number;
    return5Year: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    riskLevel: 'Low' | 'Medium' | 'Medium-High' | 'High';
    category: string;
    geography: string;
    esgScore: number;
    alpha: number;
    beta: number;
    manager: string;
    inceptionDate: string;
    morningstarRating: number;
    expenseRatio: number;
    minimumInvestment: number;
    dividendYield: number;
    turnoverRatio: number;
    nav: number;
    totalAssets: number;
    peRatio: number;
    pbRatio: number;
    isActive: boolean;
    isSustainable: boolean;
    currency: string;
    domicile: string;
    informationRatio: number;
    trackingError: number;
    uptrendCapture: number;
    downtrendCapture: number;
}

export interface FundsResponse {
    funds: Fund[];
    total: number;
    skip: number;
    limit: number;
}

// This matches the actual API response structure
export interface ApiFundsResponse {
    funds: Fund[];
    pagination: {
        skip: number;
        limit: number;
        total: number;
    };
    filters_applied: Record<string, any>;
    sort: {
        field: string;
        order: string;
    };
}

export interface FundsFilters {
    category?: string;
    geography?: string;
    riskLevel?: string;
    manager?: string;
    minReturn1Year?: number;
    maxReturn1Year?: number;
    minEsgScore?: number;
    maxEsgScore?: number;
    minSharpeRatio?: number;
    maxSharpeRatio?: number;
    minVolatility?: number;
    maxVolatility?: number;
    morningstarRating?: number;
    isActive?: boolean;
    isSustainable?: boolean;
    currency?: string;
}

export interface FundsSortParams {
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface FundsPaginationParams {
    skip?: number;
    limit?: number;
}

export type FundsQueryParams = FundsFilters & FundsSortParams & FundsPaginationParams;

// Widget-related interfaces
export interface WidgetData {
    id: string;
    title: string;
    description: string;
    funds: Fund[];
    metadata?: {
        period?: string;
        criteria?: string;
        lastUpdated?: string;
        aiGeneratedParams?: FundsQueryParams;
        aiReasoning?: string;
    };
}

export interface WidgetResponse {
    widget: WidgetData;
    success: boolean;
    message?: string;
}

// AI-generated widget configuration
export interface AIWidgetConfig {
    id: string;
    title: string;
    description: string;
    queryParams: FundsQueryParams;
    reasoning?: string;
    metadata?: {
        period?: string;
        criteria?: string;
    };
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://adk-be.onrender.com' 
    : 'http://0.0.0.0:8000';

class ApiService {
    private buildQueryString(params: FundsQueryParams): string {
        const searchParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });
        
        return searchParams.toString();
    }

    async getFunds(params: FundsQueryParams = {}): Promise<FundsResponse> {
        const queryString = this.buildQueryString(params);
        const url = `${API_BASE_URL}/funds${queryString ? `?${queryString}` : ''}`;
        
        console.log('🔗 Fetching funds from:', url);
        console.log('📊 Query params:', params);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors', // Explicitly set CORS mode
            });
            
            console.log('📡 Response status:', response.status, response.statusText);
            console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ HTTP Error Response:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            
            const rawData = await response.text();
            console.log('📄 Raw response:', rawData);
            
            let data;
            try {
                data = JSON.parse(rawData);
                console.log('✅ Parsed data:', data);
            } catch (parseError) {
                console.error('❌ JSON Parse Error:', parseError);
                console.error('❌ Raw response that failed to parse:', rawData);
                throw new Error(`Failed to parse JSON response: ${parseError}`);
            }
            
            // Validate response structure
            if (!data) {
                throw new Error('Response data is null or undefined');
            }
            
            if (!Array.isArray(data.funds)) {
                console.error('❌ Expected funds array, got:', typeof data.funds, data.funds);
                throw new Error('Response does not contain a funds array');
            }
            
            // Extract total from pagination object or fall back to top-level total
            let total = data.total;
            let skip = data.skip || 0;
            let limit = data.limit || 25;
            
            if (data.pagination) {
                total = data.pagination.total;
                skip = data.pagination.skip || skip;
                limit = data.pagination.limit || limit;
            }
            
            if (typeof total !== 'number') {
                console.error('❌ Expected total number, got:', typeof total, total);
                console.error('❌ Full response structure:', data);
                throw new Error('Response does not contain a valid total count');
            }
            
            console.log('✅ Successfully loaded funds:', data.funds.length, 'total:', total);
            
            // Return response in expected format
            return {
                funds: data.funds,
                total: total,
                skip: skip,
                limit: limit
            };
        } catch (error) {
            console.error('💥 Error fetching funds:', error);
            
            // Provide more specific error messages for common fetch failures
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                console.error('🌐 Network Error Details:');
                console.error('- This is usually a CORS or network connectivity issue');
                console.error('- Check if your backend is running on http://0.0.0.0:8000');
                console.error('- Verify CORS headers are properly configured');
                console.error('- Try accessing the URL directly:', url);
                
                throw new Error('Network error: Unable to connect to the backend server. Check if the server is running and CORS is configured properly.');
            }
            
            throw error;
        }
    }

    async getSortableFields(): Promise<string[]> {
        const url = `${API_BASE_URL}/sortable-fields`;
        console.log('🔗 Fetching sortable fields from:', url);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors', // Explicitly set CORS mode
            });
            
            console.log('📡 Sortable fields response status:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Sortable fields HTTP Error:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            
            const rawData = await response.text();
            console.log('📄 Sortable fields raw response:', rawData);
            
            let data;
            try {
                data = JSON.parse(rawData);
                console.log('✅ Sortable fields parsed data:', data);
            } catch (parseError) {
                console.error('❌ Sortable fields JSON Parse Error:', parseError);
                console.error('❌ Raw response that failed to parse:', rawData);
                throw new Error(`Failed to parse JSON response: ${parseError}`);
            }
            
            if (!Array.isArray(data)) {
                console.error('❌ Expected array for sortable fields, got:', typeof data, data);
                console.warn('⚠️ Using empty array as fallback for sortable fields');
                return [];
            }
            
            console.log('✅ Successfully loaded sortable fields:', data);
            return data;
        } catch (error) {
            console.error('💥 Error fetching sortable fields:', error);
            
            // Provide more specific error messages for common fetch failures
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                console.error('🌐 Sortable fields network error - this endpoint might have different CORS settings');
            }
            
            console.warn('⚠️ Using empty array as fallback for sortable fields');
            return []; // Return empty array as fallback
        }
    }

    // Widget Methods
    async getWidgetData(widgetId: string): Promise<WidgetData> {
        const url = `${API_BASE_URL}/widgets/${widgetId}`;
        console.log('🔗 Fetching widget data from:', url);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
            });
            
            console.log('📡 Widget response status:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Widget HTTP Error:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            
            const rawData = await response.text();
            console.log('📄 Widget raw response:', rawData);
            
            let data: WidgetResponse;
            try {
                data = JSON.parse(rawData);
                console.log('✅ Widget parsed data:', data);
            } catch (parseError) {
                console.error('❌ Widget JSON Parse Error:', parseError);
                throw new Error(`Failed to parse JSON response: ${parseError}`);
            }
            
            if (!data.success || !data.widget) {
                throw new Error(data.message || 'Widget data is invalid');
            }
            
            if (!Array.isArray(data.widget.funds)) {
                console.error('❌ Expected funds array in widget, got:', typeof data.widget.funds);
                throw new Error('Widget does not contain a valid funds array');
            }
            
            console.log('✅ Successfully loaded widget data:', data.widget);
            return data.widget;
        } catch (error) {
            console.error('💥 Error fetching widget data:', error);
            
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Network error: Unable to connect to the backend server for widget data.');
            }
            
            throw error;
        }
    }

    async getAIGeneratedWidget(widgetType: string): Promise<WidgetData> {
        return this.getWidgetData(`ai-${widgetType}`);
    }

    // Legacy methods for backward compatibility
    async getBestPerformingFunds(): Promise<WidgetData> {
        return this.getAIGeneratedWidget('best-performing');
    }

    async getMostResilientFunds(): Promise<WidgetData> {
        return this.getAIGeneratedWidget('most-resilient');
    }

    // Creative widget names endpoint
    async generateWidgetNames(): Promise<string[]> {
        const url = `${API_BASE_URL}/widgets/generate-names`;
        console.log('🔗 Fetching creative widget names from:', url);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
            });
            
            console.log('📡 Widget names response status:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Widget names HTTP Error:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            
            const rawData = await response.text();
            console.log('📄 Widget names raw response:', rawData);
            
            let data;
            try {
                data = JSON.parse(rawData);
                console.log('✅ Widget names parsed data:', data);
            } catch (parseError) {
                console.error('❌ Widget names JSON Parse Error:', parseError);
                throw new Error(`Failed to parse JSON response: ${parseError}`);
            }
            
            if (!data.names || !Array.isArray(data.names)) {
                console.error('❌ Expected names array, got:', typeof data.names);
                throw new Error('Response does not contain a valid names array');
            }
            
            console.log('✅ Successfully loaded widget names:', data.names);
            return data.names;
        } catch (error) {
            console.error('💥 Error fetching widget names:', error);
            
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Network error: Unable to connect to the backend server for widget names.');
            }
            
            throw error;
        }
    }
}

export const apiService = new ApiService(); 