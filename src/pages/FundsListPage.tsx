import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Paper,
    CircularProgress,
    Alert,
    Toolbar,
    TextField,
    InputAdornment,
    Button,
    Tabs,
    Tab,
    Grid
} from '@mui/material';
import {
    Search,
    List as ListIcon,
    TrendingUp,
    Shield,
    AutoFixHigh,
    SmartToy,
    Psychology
} from '@mui/icons-material';
import { 
    apiService, 
    Fund, 
    FundsResponse, 
    FundsFilters, 
    FundsQueryParams,
    WidgetData 
} from '../services/api';
import FundExpandableRow from '../components/funds/FundExpandableRow';
import FundsFiltersComponent from '../components/funds/FundsFilters';
import FundWidget from '../components/funds/FundWidget';
import { testBackendConnection, testDirectBackendAccess } from '../utils/testBackend';

// Tab configuration
interface TabConfig {
    id: number;
    label: string;
    icon: React.ReactElement;
    description: string;
}

const tabs: TabConfig[] = [
    {
        id: 0,
        label: 'Existing AI Widgets',
        icon: <TrendingUp />,
        description: 'Current AI-based widgets that receive params from AI and filter funds on backend'
    },
    {
        id: 1,
        label: 'AI-Enhanced Widgets',
        icon: <AutoFixHigh />,
        description: 'AI analyzes ALL fund data to select best funds for Top Performers and Steady Performers themes'
    },
    {
        id: 2,
        label: 'AI-Generated Widgets',
        icon: <SmartToy />,
        description: 'Fully AI-generated widgets with custom names and filtering parameters'
    },
    {
        id: 3,
        label: 'AI-Curated Widgets',
        icon: <Psychology />,
        description: 'AI generates widget names, analyzes fund data, and returns curated selections'
    }
];

const FundsListPage: React.FC = () => {
    const [funds, setFunds] = useState<Fund[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // Tab state
    const [activeTab, setActiveTab] = useState<number>(0);
    
    // Pagination state
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(25);
    
    // Sorting state
    const [sortBy, setSortBy] = useState<string>('return1Year');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    
    // Filters state
    const [filters, setFilters] = useState<FundsFilters>({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    // Available sortable fields
    const [sortableFields, setSortableFields] = useState<string[]>([]);
    
    // Widget state for Tab 0 (Existing AI Widgets)
    const [existingWidget1Data, setExistingWidget1Data] = useState<WidgetData | null>(null);
    const [existingWidget2Data, setExistingWidget2Data] = useState<WidgetData | null>(null);
    const [existingWidgetsLoading, setExistingWidgetsLoading] = useState<boolean>(false);
    
    // Widget state for Tab 1 (AI-Enhanced Widgets)
    const [enhancedWidget1Data, setEnhancedWidget1Data] = useState<WidgetData | null>(null);
    const [enhancedWidget2Data, setEnhancedWidget2Data] = useState<WidgetData | null>(null);
    const [enhancedWidgetsLoading, setEnhancedWidgetsLoading] = useState<boolean>(false);
    
    // Widget state for Tab 2 (AI-Generated Widgets)
    const [generatedWidget1Data, setGeneratedWidget1Data] = useState<WidgetData | null>(null);
    const [generatedWidget2Data, setGeneratedWidget2Data] = useState<WidgetData | null>(null);
    const [generatedWidgetsLoading, setGeneratedWidgetsLoading] = useState<boolean>(false);
    
    // Widget state for Tab 3 (AI-Curated Widgets)
    const [curatedWidget1Data, setCuratedWidget1Data] = useState<WidgetData | null>(null);
    const [curatedWidget2Data, setCuratedWidget2Data] = useState<WidgetData | null>(null);
    const [curatedWidgetsLoading, setCuratedWidgetsLoading] = useState<boolean>(false);
    
    // Widget errors for each tab
    const [existingWidget1Error, setExistingWidget1Error] = useState<string | null>(null);
    const [existingWidget2Error, setExistingWidget2Error] = useState<string | null>(null);
    const [enhancedWidget1Error, setEnhancedWidget1Error] = useState<string | null>(null);
    const [enhancedWidget2Error, setEnhancedWidget2Error] = useState<string | null>(null);
    const [generatedWidget1Error, setGeneratedWidget1Error] = useState<string | null>(null);
    const [generatedWidget2Error, setGeneratedWidget2Error] = useState<string | null>(null);
    const [curatedWidget1Error, setCuratedWidget1Error] = useState<string | null>(null);
    const [curatedWidget2Error, setCuratedWidget2Error] = useState<string | null>(null);

    // Load funds data
    const loadFunds = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const queryParams: FundsQueryParams = {
                skip: page * rowsPerPage,
                limit: rowsPerPage,
                sort_by: sortBy,
                sort_order: sortOrder,
                manager: searchTerm || undefined,
                ...filters
            };

            const response = await apiService.getFunds(queryParams);
            setFunds(response.funds);
            setTotal(response.total);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, sortBy, sortOrder, searchTerm, filters]);

    // Load existing widgets (Tab 0)
    const loadExistingWidgets = useCallback(async () => {
        console.log('🚀 Loading existing AI widgets...');
        setExistingWidgetsLoading(true);
        setExistingWidget1Error(null);
        setExistingWidget2Error(null);

        try {
            const [widget1, widget2] = await Promise.all([
                apiService.getAIGeneratedWidget('best-performing'),
                apiService.getAIGeneratedWidget('most-resilient')
            ]);
            
            setExistingWidget1Data(widget1);
            setExistingWidget2Data(widget2);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setExistingWidget1Error(errorMessage);
            setExistingWidget2Error(errorMessage);
        } finally {
            setExistingWidgetsLoading(false);
        }
    }, []);

    // Load AI-enhanced widgets (Tab 1)
    const loadEnhancedWidgets = useCallback(async () => {
        console.log('🚀 Loading AI-enhanced widgets...');
        setEnhancedWidgetsLoading(true);
        setEnhancedWidget1Error(null);
        setEnhancedWidget2Error(null);

        try {
            const [widget1, widget2] = await Promise.all([
                apiService.getWidgetData('ai-enhanced-top-performers'),
                apiService.getWidgetData('ai-enhanced-steady-performers')
            ]);
            
            setEnhancedWidget1Data(widget1);
            setEnhancedWidget2Data(widget2);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setEnhancedWidget1Error(errorMessage);
            setEnhancedWidget2Error(errorMessage);
        } finally {
            setEnhancedWidgetsLoading(false);
        }
    }, []);

    // Load AI-generated widgets (Tab 2)
    const loadGeneratedWidgets = useCallback(async () => {
        console.log('🚀 Loading AI-generated widgets...');
        setGeneratedWidgetsLoading(true);
        setGeneratedWidget1Error(null);
        setGeneratedWidget2Error(null);

        try {
            const [widget1, widget2] = await Promise.all([
                apiService.getWidgetData('ai-generated-widget-1'),
                apiService.getWidgetData('ai-generated-widget-2')
            ]);
            
            setGeneratedWidget1Data(widget1);
            setGeneratedWidget2Data(widget2);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setGeneratedWidget1Error(errorMessage);
            setGeneratedWidget2Error(errorMessage);
        } finally {
            setGeneratedWidgetsLoading(false);
        }
    }, []);

    // Load AI-curated widgets (Tab 3)
    const loadCuratedWidgets = useCallback(async () => {
        console.log('🚀 Loading AI-curated widgets...');
        setCuratedWidgetsLoading(true);
        setCuratedWidget1Error(null);
        setCuratedWidget2Error(null);

        try {
            const [widget1, widget2] = await Promise.all([
                apiService.getWidgetData('ai-curated-widget-1'),
                apiService.getWidgetData('ai-curated-widget-2')
            ]);
            
            setCuratedWidget1Data(widget1);
            setCuratedWidget2Data(widget2);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setCuratedWidget1Error(errorMessage);
            setCuratedWidget2Error(errorMessage);
        } finally {
            setCuratedWidgetsLoading(false);
        }
    }, []);

    // Load sortable fields on mount
    useEffect(() => {
        const loadSortableFields = async () => {
            console.log('🚀 Loading sortable fields...');
            try {
                const fields = await apiService.getSortableFields();
                console.log('📋 Received sortable fields:', fields);
                setSortableFields(fields);
                console.log('✅ Successfully set sortable fields state');
            } catch (err) {
                console.error('💥 Error loading sortable fields:', err);
            }
        };

        loadSortableFields();
    }, []);

    // Load widgets based on active tab
    useEffect(() => {
        switch (activeTab) {
            case 0:
                loadExistingWidgets();
                break;
            case 1:
                loadEnhancedWidgets();
                break;
            case 2:
                loadGeneratedWidgets();
                break;
            case 3:
                loadCuratedWidgets();
                break;
        }
    }, [activeTab, loadExistingWidgets, loadEnhancedWidgets, loadGeneratedWidgets, loadCuratedWidgets]);

    // Load funds when dependencies change
    useEffect(() => {
        loadFunds();
    }, [loadFunds]);

    const handleChangePage = (event: unknown, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (field: string): void => {
        const isAsc = sortBy === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortBy(field);
        setPage(0);
    };

    const handleFiltersChange = (newFilters: FundsFilters): void => {
        setFilters(newFilters);
        setPage(0);
    };

    const handleClearFilters = (): void => {
        setFilters({});
        setSearchTerm('');
        setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
        setActiveTab(newValue);
    };

    const renderWidgetsForTab = () => {
        switch (activeTab) {
            case 0: // Existing AI Widgets
                return (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        <FundWidget
                            title={existingWidget1Data?.title || "Top Performers"}
                            description={existingWidget1Data?.description || "AI-curated top performing funds"}
                            funds={existingWidget1Data?.funds || []}
                            loading={existingWidgetsLoading}
                            error={existingWidget1Error}
                            icon={<TrendingUp />}
                            color="success"
                            onViewAll={() => {
                                if (existingWidget1Data?.metadata?.aiGeneratedParams) {
                                    const params = existingWidget1Data.metadata.aiGeneratedParams;
                                    setFilters({
                                        category: params.category,
                                        geography: params.geography,
                                        riskLevel: params.riskLevel,
                                        manager: params.manager,
                                        minReturn1Year: params.minReturn1Year,
                                        maxReturn1Year: params.maxReturn1Year,
                                        minEsgScore: params.minEsgScore,
                                        maxEsgScore: params.maxEsgScore,
                                        minSharpeRatio: params.minSharpeRatio,
                                        maxSharpeRatio: params.maxSharpeRatio,
                                        minVolatility: params.minVolatility,
                                        maxVolatility: params.maxVolatility,
                                        morningstarRating: params.morningstarRating,
                                        isActive: params.isActive,
                                        isSustainable: params.isSustainable,
                                        currency: params.currency,
                                    });
                                    if (params.sort_by) setSortBy(params.sort_by);
                                    if (params.sort_order) setSortOrder(params.sort_order);
                                }
                                setPage(0);
                            }}
                        />
                        <FundWidget
                            title={existingWidget2Data?.title || "Steady Performers"}
                            description={existingWidget2Data?.description || "AI-curated steady performing funds"}
                            funds={existingWidget2Data?.funds || []}
                            loading={existingWidgetsLoading}
                            error={existingWidget2Error}
                            icon={<Shield />}
                            color="primary"
                            onViewAll={() => {
                                if (existingWidget2Data?.metadata?.aiGeneratedParams) {
                                    const params = existingWidget2Data.metadata.aiGeneratedParams;
                                    setFilters({
                                        category: params.category,
                                        geography: params.geography,
                                        riskLevel: params.riskLevel,
                                        manager: params.manager,
                                        minReturn1Year: params.minReturn1Year,
                                        maxReturn1Year: params.maxReturn1Year,
                                        minEsgScore: params.minEsgScore,
                                        maxEsgScore: params.maxEsgScore,
                                        minSharpeRatio: params.minSharpeRatio,
                                        maxSharpeRatio: params.maxSharpeRatio,
                                        minVolatility: params.minVolatility,
                                        maxVolatility: params.maxVolatility,
                                        morningstarRating: params.morningstarRating,
                                        isActive: params.isActive,
                                        isSustainable: params.isSustainable,
                                        currency: params.currency,
                                    });
                                    if (params.sort_by) setSortBy(params.sort_by);
                                    if (params.sort_order) setSortOrder(params.sort_order);
                                }
                                setPage(0);
                            }}
                        />
                    </Box>
                );
                
            case 1: // AI-Enhanced Widgets
                return (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        <FundWidget
                            title={enhancedWidget1Data?.title || "AI-Enhanced Top Performers"}
                            description={enhancedWidget1Data?.description || "AI analyzes ALL fund data to select best Top Performers"}
                            funds={enhancedWidget1Data?.funds || []}
                            loading={enhancedWidgetsLoading}
                            error={enhancedWidget1Error}
                            icon={<AutoFixHigh />}
                            color="success"
                            onViewAll={() => {
                                if (enhancedWidget1Data?.metadata?.aiGeneratedParams) {
                                    const params = enhancedWidget1Data.metadata.aiGeneratedParams;
                                    setFilters({
                                        category: params.category,
                                        geography: params.geography,
                                        riskLevel: params.riskLevel,
                                        manager: params.manager,
                                        minReturn1Year: params.minReturn1Year,
                                        maxReturn1Year: params.maxReturn1Year,
                                        minEsgScore: params.minEsgScore,
                                        maxEsgScore: params.maxEsgScore,
                                        minSharpeRatio: params.minSharpeRatio,
                                        maxSharpeRatio: params.maxSharpeRatio,
                                        minVolatility: params.minVolatility,
                                        maxVolatility: params.maxVolatility,
                                        morningstarRating: params.morningstarRating,
                                        isActive: params.isActive,
                                        isSustainable: params.isSustainable,
                                        currency: params.currency,
                                    });
                                    if (params.sort_by) setSortBy(params.sort_by);
                                    if (params.sort_order) setSortOrder(params.sort_order);
                                }
                                setPage(0);
                            }}
                        />
                        <FundWidget
                            title={enhancedWidget2Data?.title || "AI-Enhanced Steady Performers"}
                            description={enhancedWidget2Data?.description || "AI analyzes ALL fund data to select best Steady Performers"}
                            funds={enhancedWidget2Data?.funds || []}
                            loading={enhancedWidgetsLoading}
                            error={enhancedWidget2Error}
                            icon={<AutoFixHigh />}
                            color="primary"
                            onViewAll={() => {
                                if (enhancedWidget2Data?.metadata?.aiGeneratedParams) {
                                    const params = enhancedWidget2Data.metadata.aiGeneratedParams;
                                    setFilters({
                                        category: params.category,
                                        geography: params.geography,
                                        riskLevel: params.riskLevel,
                                        manager: params.manager,
                                        minReturn1Year: params.minReturn1Year,
                                        maxReturn1Year: params.maxReturn1Year,
                                        minEsgScore: params.minEsgScore,
                                        maxEsgScore: params.maxEsgScore,
                                        minSharpeRatio: params.minSharpeRatio,
                                        maxSharpeRatio: params.maxSharpeRatio,
                                        minVolatility: params.minVolatility,
                                        maxVolatility: params.maxVolatility,
                                        morningstarRating: params.morningstarRating,
                                        isActive: params.isActive,
                                        isSustainable: params.isSustainable,
                                        currency: params.currency,
                                    });
                                    if (params.sort_by) setSortBy(params.sort_by);
                                    if (params.sort_order) setSortOrder(params.sort_order);
                                }
                                setPage(0);
                            }}
                        />
                    </Box>
                );
                
            case 2: // AI-Generated Widgets
                return (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        <FundWidget
                            title={generatedWidget1Data?.title || "AI-Generated Widget 1"}
                            description={generatedWidget1Data?.description || "Fully AI-generated widget with custom parameters"}
                            funds={generatedWidget1Data?.funds || []}
                            loading={generatedWidgetsLoading}
                            error={generatedWidget1Error}
                            icon={<SmartToy />}
                            color="warning"
                            onViewAll={() => {
                                if (generatedWidget1Data?.metadata?.aiGeneratedParams) {
                                    const params = generatedWidget1Data.metadata.aiGeneratedParams;
                                    setFilters({
                                        category: params.category,
                                        geography: params.geography,
                                        riskLevel: params.riskLevel,
                                        manager: params.manager,
                                        minReturn1Year: params.minReturn1Year,
                                        maxReturn1Year: params.maxReturn1Year,
                                        minEsgScore: params.minEsgScore,
                                        maxEsgScore: params.maxEsgScore,
                                        minSharpeRatio: params.minSharpeRatio,
                                        maxSharpeRatio: params.maxSharpeRatio,
                                        minVolatility: params.minVolatility,
                                        maxVolatility: params.maxVolatility,
                                        morningstarRating: params.morningstarRating,
                                        isActive: params.isActive,
                                        isSustainable: params.isSustainable,
                                        currency: params.currency,
                                    });
                                    if (params.sort_by) setSortBy(params.sort_by);
                                    if (params.sort_order) setSortOrder(params.sort_order);
                                }
                                setPage(0);
                            }}
                        />
                        <FundWidget
                            title={generatedWidget2Data?.title || "AI-Generated Widget 2"}
                            description={generatedWidget2Data?.description || "Fully AI-generated widget with custom parameters"}
                            funds={generatedWidget2Data?.funds || []}
                            loading={generatedWidgetsLoading}
                            error={generatedWidget2Error}
                            icon={<SmartToy />}
                            color="warning"
                            onViewAll={() => {
                                if (generatedWidget2Data?.metadata?.aiGeneratedParams) {
                                    const params = generatedWidget2Data.metadata.aiGeneratedParams;
                                    setFilters({
                                        category: params.category,
                                        geography: params.geography,
                                        riskLevel: params.riskLevel,
                                        manager: params.manager,
                                        minReturn1Year: params.minReturn1Year,
                                        maxReturn1Year: params.maxReturn1Year,
                                        minEsgScore: params.minEsgScore,
                                        maxEsgScore: params.maxEsgScore,
                                        minSharpeRatio: params.minSharpeRatio,
                                        maxSharpeRatio: params.maxSharpeRatio,
                                        minVolatility: params.minVolatility,
                                        maxVolatility: params.maxVolatility,
                                        morningstarRating: params.morningstarRating,
                                        isActive: params.isActive,
                                        isSustainable: params.isSustainable,
                                        currency: params.currency,
                                    });
                                    if (params.sort_by) setSortBy(params.sort_by);
                                    if (params.sort_order) setSortOrder(params.sort_order);
                                }
                                setPage(0);
                            }}
                        />
                    </Box>
                );
                
            case 3: // AI-Curated Widgets
                return (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        <FundWidget
                            title={curatedWidget1Data?.title || "AI-Curated Widget 1"}
                            description={curatedWidget1Data?.description || "AI-curated funds with analysis and insights"}
                            funds={curatedWidget1Data?.funds || []}
                            loading={curatedWidgetsLoading}
                            error={curatedWidget1Error}
                            icon={<Psychology />}
                            color="error"
                            onViewAll={() => {
                                if (curatedWidget1Data?.metadata?.aiGeneratedParams) {
                                    const params = curatedWidget1Data.metadata.aiGeneratedParams;
                                    setFilters({
                                        category: params.category,
                                        geography: params.geography,
                                        riskLevel: params.riskLevel,
                                        manager: params.manager,
                                        minReturn1Year: params.minReturn1Year,
                                        maxReturn1Year: params.maxReturn1Year,
                                        minEsgScore: params.minEsgScore,
                                        maxEsgScore: params.maxEsgScore,
                                        minSharpeRatio: params.minSharpeRatio,
                                        maxSharpeRatio: params.maxSharpeRatio,
                                        minVolatility: params.minVolatility,
                                        maxVolatility: params.maxVolatility,
                                        morningstarRating: params.morningstarRating,
                                        isActive: params.isActive,
                                        isSustainable: params.isSustainable,
                                        currency: params.currency,
                                    });
                                    if (params.sort_by) setSortBy(params.sort_by);
                                    if (params.sort_order) setSortOrder(params.sort_order);
                                }
                                setPage(0);
                            }}
                        />
                        <FundWidget
                            title={curatedWidget2Data?.title || "AI-Curated Widget 2"}
                            description={curatedWidget2Data?.description || "AI-curated funds with analysis and insights"}
                            funds={curatedWidget2Data?.funds || []}
                            loading={curatedWidgetsLoading}
                            error={curatedWidget2Error}
                            icon={<Psychology />}
                            color="error"
                            onViewAll={() => {
                                if (curatedWidget2Data?.metadata?.aiGeneratedParams) {
                                    const params = curatedWidget2Data.metadata.aiGeneratedParams;
                                    setFilters({
                                        category: params.category,
                                        geography: params.geography,
                                        riskLevel: params.riskLevel,
                                        manager: params.manager,
                                        minReturn1Year: params.minReturn1Year,
                                        maxReturn1Year: params.maxReturn1Year,
                                        minEsgScore: params.minEsgScore,
                                        maxEsgScore: params.maxEsgScore,
                                        minSharpeRatio: params.minSharpeRatio,
                                        maxSharpeRatio: params.maxSharpeRatio,
                                        minVolatility: params.minVolatility,
                                        maxVolatility: params.maxVolatility,
                                        morningstarRating: params.morningstarRating,
                                        isActive: params.isActive,
                                        isSustainable: params.isSustainable,
                                        currency: params.currency,
                                    });
                                    if (params.sort_by) setSortBy(params.sort_by);
                                    if (params.sort_order) setSortOrder(params.sort_order);
                                }
                                setPage(0);
                            }}
                        />
                    </Box>
                );
                
            default:
                return null;
        }
    };

    if (error) {
        return (
            <Box sx={{ width: '100%' }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        <strong>Debug Info:</strong><br/>
                        Environment: {process.env.NODE_ENV || 'development'}<br/>
                        API URL: {process.env.NODE_ENV === 'production' ? 'https://adk-be.onrender.com' : 'http://0.0.0.0:8000'}<br/>
                        Check the browser console (F12) for detailed error logs.
                    </Typography>
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListIcon sx={{ mr: 2 }} />
                    Funds Explorer
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Comprehensive fund database with advanced filtering and AI-powered analysis
                </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ mb: 4 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange} 
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    {tabs.map((tab) => (
                        <Tab 
                            key={tab.id}
                            label={tab.label}
                            icon={tab.icon}
                            iconPosition="start"
                            sx={{ minHeight: 48 }}
                        />
                    ))}
                </Tabs>
                
                {/* Tab description */}
                <Box sx={{ mt: 2, mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        {tabs[activeTab].description}
                    </Typography>
                </Box>
            </Box>

            {/* Widgets Section */}
            <Box sx={{ mb: 4 }}>
                {renderWidgetsForTab()}
            </Box>

            {/* Search and Filters */}
            <Box sx={{ mb: 3 }}>
                <Card sx={{ mb: 2 }}>
                    <Toolbar>
                        <TextField
                            size="small"
                            placeholder="Search by fund manager..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ minWidth: 300 }}
                        />
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            {loading ? 'Loading...' : `${total.toLocaleString()} funds found`}
                        </Typography>
                    </Toolbar>
                </Card>

                <FundsFiltersComponent
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                />
            </Box>

            {/* Funds Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Fund Performance Overview
                    </Typography>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Fund Name</TableCell>
                                    <TableCell>Manager</TableCell>
                                    <TableCell>AUM</TableCell>
                                    <TableCell 
                                        align="right"
                                        sortDirection={sortBy === 'return1Month' ? sortOrder : false}
                                    >
                                        <TableSortLabel
                                            active={sortBy === 'return1Month'}
                                            direction={sortBy === 'return1Month' ? sortOrder : 'asc'}
                                            onClick={() => handleRequestSort('return1Month')}
                                        >
                                            1M Return
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell 
                                        align="right"
                                        sortDirection={sortBy === 'return3Month' ? sortOrder : false}
                                    >
                                        <TableSortLabel
                                            active={sortBy === 'return3Month'}
                                            direction={sortBy === 'return3Month' ? sortOrder : 'asc'}
                                            onClick={() => handleRequestSort('return3Month')}
                                        >
                                            3M Return
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell 
                                        align="right"
                                        sortDirection={sortBy === 'return1Year' ? sortOrder : false}
                                    >
                                        <TableSortLabel
                                            active={sortBy === 'return1Year'}
                                            direction={sortBy === 'return1Year' ? sortOrder : 'asc'}
                                            onClick={() => handleRequestSort('return1Year')}
                                        >
                                            1Y Return
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell 
                                        align="right"
                                        sortDirection={sortBy === 'sharpeRatio' ? sortOrder : false}
                                    >
                                        <TableSortLabel
                                            active={sortBy === 'sharpeRatio'}
                                            direction={sortBy === 'sharpeRatio' ? sortOrder : 'asc'}
                                            onClick={() => handleRequestSort('sharpeRatio')}
                                        >
                                            Sharpe Ratio
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell 
                                        align="right"
                                        sortDirection={sortBy === 'volatility' ? sortOrder : false}
                                    >
                                        <TableSortLabel
                                            active={sortBy === 'volatility'}
                                            direction={sortBy === 'volatility' ? sortOrder : 'asc'}
                                            onClick={() => handleRequestSort('volatility')}
                                        >
                                            Volatility
                                        </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : funds.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                No funds found. Try adjusting your filters.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    funds.map((fund) => (
                                        <FundExpandableRow key={fund.id} fund={fund} />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    {!loading && funds.length > 0 && (
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            component="div"
                            count={total}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default FundsListPage; 