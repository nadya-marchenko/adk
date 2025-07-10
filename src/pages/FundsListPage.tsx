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
    Button
} from '@mui/material';
import {
    Search,
    List as ListIcon
} from '@mui/icons-material';
import { 
    apiService, 
    Fund, 
    FundsResponse, 
    FundsFilters, 
    FundsQueryParams 
} from '../services/api';
import FundExpandableRow from '../components/funds/FundExpandableRow';
import FundsFiltersComponent from '../components/funds/FundsFilters';
import { testBackendConnection, testDirectBackendAccess } from '../utils/testBackend';

const FundsListPage: React.FC = () => {
    const [funds, setFunds] = useState<Fund[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
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

    const loadFunds = useCallback(async () => {
        console.log('🚀 Starting to load funds...');
        setLoading(true);
        setError(null);

        try {
            const queryParams: FundsQueryParams = {
                ...filters,
                sort_by: sortBy,
                sort_order: sortOrder,
                skip: page * rowsPerPage,
                limit: rowsPerPage
            };

            // Add search functionality (assuming backend supports it)
            if (searchTerm.trim()) {
                queryParams.manager = searchTerm.trim();
            }

            console.log('📋 Loading funds with params:', queryParams);
            const response: FundsResponse = await apiService.getFunds(queryParams);
            
            console.log('📊 Received funds response:', response);
            setFunds(response.funds);
            setTotal(response.total);
            console.log('✅ Successfully set funds state');
        } catch (err) {
            console.error('💥 Error in loadFunds:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(`Failed to load funds: ${errorMessage}`);
        } finally {
            setLoading(false);
            console.log('🏁 Finished loading funds');
        }
    }, [filters, sortBy, sortOrder, page, rowsPerPage, searchTerm]);

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
                // Don't set an error state for sortable fields, just log it
                // The table will still work without sortable field validation
            }
        };

        loadSortableFields();
    }, []);

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

    const handleSort = (field: string): void => {
        if (!sortableFields.includes(field)) return;
        
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
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

    const getSortDirection = (field: string): 'asc' | 'desc' | false => {
        if (sortBy !== field) return false;
        return sortOrder;
    };

    const isSortable = (field: string): boolean => {
        return sortableFields.includes(field);
    };

    const formatColumnHeader = (field: string): string => {
        const headerMap: { [key: string]: string } = {
            name: 'Fund Name',
            aum: 'AUM',
            return1Year: '1Y Return',
            sharpeRatio: 'Sharpe Ratio',
            riskLevel: 'Risk Level',
            category: 'Category',
            morningstarRating: 'Rating'
        };
        return headerMap[field] || field;
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
                    Comprehensive fund database with advanced filtering and analysis
                </Typography>
                
                {/* Debug info in development */}
                {process.env.NODE_ENV === 'development' && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            <strong>Debug Mode:</strong><br/>
                            Environment: {process.env.NODE_ENV}<br/>
                            API URL: http://0.0.0.0:8000<br/>
                            Sortable Fields: {sortableFields.length > 0 ? sortableFields.join(', ') : 'Not loaded'}<br/>
                            Current State: {loading ? 'Loading...' : `${funds.length} funds, ${total} total`}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                onClick={() => testBackendConnection()}
                            >
                                Test Backend Connection
                            </Button>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                onClick={() => testDirectBackendAccess()}
                            >
                                Show Test URLs
                            </Button>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                onClick={() => loadFunds()}
                            >
                                Retry Load Funds
                            </Button>
                        </Box>
                    </Alert>
                )}
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
                <CardContent sx={{ p: 0 }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width={50}></TableCell>
                                    <TableCell>
                                        {isSortable('name') ? (
                                            <TableSortLabel
                                                active={sortBy === 'name'}
                                                direction={getSortDirection('name') || 'asc'}
                                                onClick={() => handleSort('name')}
                                            >
                                                {formatColumnHeader('name')}
                                            </TableSortLabel>
                                        ) : (
                                            formatColumnHeader('name')
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isSortable('aum') ? (
                                            <TableSortLabel
                                                active={sortBy === 'aum'}
                                                direction={getSortDirection('aum') || 'asc'}
                                                onClick={() => handleSort('aum')}
                                            >
                                                {formatColumnHeader('aum')}
                                            </TableSortLabel>
                                        ) : (
                                            formatColumnHeader('aum')
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {isSortable('return1Year') ? (
                                            <TableSortLabel
                                                active={sortBy === 'return1Year'}
                                                direction={getSortDirection('return1Year') || 'asc'}
                                                onClick={() => handleSort('return1Year')}
                                            >
                                                {formatColumnHeader('return1Year')}
                                            </TableSortLabel>
                                        ) : (
                                            formatColumnHeader('return1Year')
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {isSortable('sharpeRatio') ? (
                                            <TableSortLabel
                                                active={sortBy === 'sharpeRatio'}
                                                direction={getSortDirection('sharpeRatio') || 'asc'}
                                                onClick={() => handleSort('sharpeRatio')}
                                            >
                                                {formatColumnHeader('sharpeRatio')}
                                            </TableSortLabel>
                                        ) : (
                                            formatColumnHeader('sharpeRatio')
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isSortable('riskLevel') ? (
                                            <TableSortLabel
                                                active={sortBy === 'riskLevel'}
                                                direction={getSortDirection('riskLevel') || 'asc'}
                                                onClick={() => handleSort('riskLevel')}
                                            >
                                                {formatColumnHeader('riskLevel')}
                                            </TableSortLabel>
                                        ) : (
                                            formatColumnHeader('riskLevel')
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isSortable('category') ? (
                                            <TableSortLabel
                                                active={sortBy === 'category'}
                                                direction={getSortDirection('category') || 'asc'}
                                                onClick={() => handleSort('category')}
                                            >
                                                {formatColumnHeader('category')}
                                            </TableSortLabel>
                                        ) : (
                                            formatColumnHeader('category')
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isSortable('morningstarRating') ? (
                                            <TableSortLabel
                                                active={sortBy === 'morningstarRating'}
                                                direction={getSortDirection('morningstarRating') || 'asc'}
                                                onClick={() => handleSort('morningstarRating')}
                                            >
                                                {formatColumnHeader('morningstarRating')}
                                            </TableSortLabel>
                                        ) : (
                                            formatColumnHeader('morningstarRating')
                                        )}
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