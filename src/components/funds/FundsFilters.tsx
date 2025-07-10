import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    FormControlLabel,
    Switch,
    Button,
    Collapse,
    IconButton,
    Chip
} from '@mui/material';
import {
    FilterList,
    ExpandMore,
    ExpandLess,
    Clear
} from '@mui/icons-material';
import { FundsFilters } from '../../services/api';

interface FundsFiltersProps {
    filters: FundsFilters;
    onFiltersChange: (filters: FundsFilters) => void;
    onClearFilters: () => void;
}

const FundsFiltersComponent: React.FC<FundsFiltersProps> = ({
    filters,
    onFiltersChange,
    onClearFilters
}) => {
    const [expanded, setExpanded] = useState(false);

    const handleFilterChange = (key: keyof FundsFilters, value: any) => {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    const getActiveFiltersCount = (): number => {
        return Object.values(filters).filter(value => 
            value !== undefined && value !== null && value !== ''
        ).length;
    };

    const riskLevels = ['Low', 'Medium', 'Medium-High', 'High'];
    const categories = ['Equity', 'Fixed Income', 'Alternative', 'Multi-Asset', 'Real Estate', 'Commodity'];
    const geographies = ['North America', 'Europe', 'Asia-Pacific', 'Global', 'Emerging Markets', 'United States'];
    const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'CHF', 'CAD'];
    const morningstarRatings = [1, 2, 3, 4, 5];

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FilterList sx={{ mr: 1 }} />
                    <Typography variant="h6">
                        Filters
                    </Typography>
                    {getActiveFiltersCount() > 0 && (
                        <Chip
                            label={`${getActiveFiltersCount()} active`}
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                        />
                    )}
                </Box>
                <Box>
                    <Button
                        onClick={onClearFilters}
                        disabled={getActiveFiltersCount() === 0}
                        startIcon={<Clear />}
                        size="small"
                    >
                        Clear All
                    </Button>
                    <IconButton
                        onClick={() => setExpanded(!expanded)}
                        size="small"
                    >
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </Box>
            </Box>

            <Collapse in={expanded}>
                <Grid container spacing={3}>
                    {/* Basic Filters */}
                    <Grid xs={12} md={6} lg={3} sx={{ minWidth: '150px' }} {...({} as any)}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={filters.category || ''}
                                label="Category"
                                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid xs={12} md={6} lg={3} sx={{ minWidth: '150px' }} {...({} as any)}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Geography</InputLabel>
                            <Select
                                value={filters.geography || ''}
                                label="Geography"
                                onChange={(e) => handleFilterChange('geography', e.target.value || undefined)}
                            >
                                <MenuItem value="">All Geographies</MenuItem>
                                {geographies.map((geography) => (
                                    <MenuItem key={geography} value={geography}>
                                        {geography}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid xs={12} md={6} lg={3} sx={{ minWidth: '150px' }} {...({} as any)}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Risk Level</InputLabel>
                            <Select
                                value={filters.riskLevel || ''}
                                label="Risk Level"
                                onChange={(e) => handleFilterChange('riskLevel', e.target.value || undefined)}
                            >
                                <MenuItem value="">All Risk Levels</MenuItem>
                                {riskLevels.map((risk) => (
                                    <MenuItem key={risk} value={risk}>
                                        {risk}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid xs={12} md={6} lg={3} sx={{ minWidth: '150px' }} {...({} as any)}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Currency</InputLabel>
                            <Select
                                value={filters.currency || ''}
                                label="Currency"
                                onChange={(e) => handleFilterChange('currency', e.target.value || undefined)}
                            >
                                <MenuItem value="">All Currencies</MenuItem>
                                {currencies.map((currency) => (
                                    <MenuItem key={currency} value={currency}>
                                        {currency}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Manager Filter */}
                    <Grid xs={12} md={6} sx={{ minWidth: '150px' }} {...({} as any)}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Manager"
                            value={filters.manager || ''}
                            onChange={(e) => handleFilterChange('manager', e.target.value || undefined)}
                            placeholder="Search by fund manager..."
                        />
                    </Grid>

                    {/* Morningstar Rating */}
                    <Grid xs={12} md={6} lg={3} sx={{ minWidth: '150px' }} {...({} as any)}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Morningstar Rating</InputLabel>
                            <Select
                                value={filters.morningstarRating || ''}
                                label="Morningstar Rating"
                                onChange={(e) => handleFilterChange('morningstarRating', e.target.value || undefined)}
                            >
                                <MenuItem value="">All Ratings</MenuItem>
                                {morningstarRatings.map((rating) => (
                                    <MenuItem key={rating} value={rating}>
                                        {rating} Star{rating > 1 ? 's' : ''}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Boolean Filters */}
                    <Grid xs={12} md={3} sx={{ minWidth: '150px' }} {...({} as any)}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={filters.isActive === true}
                                    onChange={(e) => handleFilterChange('isActive', e.target.checked ? true : undefined)}
                                />
                            }
                            label="Active Funds Only"
                        />
                    </Grid>

                    <Grid xs={12} md={3} sx={{ minWidth: '150px' }} {...({} as any)}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={filters.isSustainable === true}
                                    onChange={(e) => handleFilterChange('isSustainable', e.target.checked ? true : undefined)}
                                />
                            }
                            label="Sustainable Funds Only"
                        />
                    </Grid>

                    {/* Range Filters */}
                    <Grid xs={12} sx={{ minWidth: '150px' }} {...({} as any)}>
                        <Typography variant="subtitle2" gutterBottom>
                            1-Year Return Range (%)
                        </Typography>
                        <Box sx={{ px: 2 }}>
                            <Slider
                                value={[filters.minReturn1Year || -50, filters.maxReturn1Year || 50]}
                                onChange={(_, newValue) => {
                                    const [min, max] = newValue as number[];
                                    handleFilterChange('minReturn1Year', min === -50 ? undefined : min);
                                    handleFilterChange('maxReturn1Year', max === 50 ? undefined : max);
                                }}
                                valueLabelDisplay="auto"
                                min={-50}
                                max={50}
                                step={1}
                                marks={[
                                    { value: -50, label: '-50%' },
                                    { value: 0, label: '0%' },
                                    { value: 50, label: '50%' }
                                ]}
                            />
                        </Box>
                    </Grid>

                    <Grid xs={12} md={6} {...({} as any)}>
                        <Typography variant="subtitle2" gutterBottom>
                            ESG Score Range
                        </Typography>
                        <Box sx={{ px: 2 }}>
                            <Slider
                                value={[filters.minEsgScore || 0, filters.maxEsgScore || 100]}
                                onChange={(_, newValue) => {
                                    const [min, max] = newValue as number[];
                                    handleFilterChange('minEsgScore', min === 0 ? undefined : min);
                                    handleFilterChange('maxEsgScore', max === 100 ? undefined : max);
                                }}
                                valueLabelDisplay="auto"
                                min={0}
                                max={100}
                                step={5}
                                marks={[
                                    { value: 0, label: '0' },
                                    { value: 50, label: '50' },
                                    { value: 100, label: '100' }
                                ]}
                            />
                        </Box>
                    </Grid>

                    <Grid xs={12} md={6} {...({} as any)}>
                        <Typography variant="subtitle2" gutterBottom>
                            Sharpe Ratio Range
                        </Typography>
                        <Box sx={{ px: 2 }}>
                            <Slider
                                value={[filters.minSharpeRatio || 0, filters.maxSharpeRatio || 3]}
                                onChange={(_, newValue) => {
                                    const [min, max] = newValue as number[];
                                    handleFilterChange('minSharpeRatio', min === 0 ? undefined : min);
                                    handleFilterChange('maxSharpeRatio', max === 3 ? undefined : max);
                                }}
                                valueLabelDisplay="auto"
                                min={0}
                                max={3}
                                step={0.1}
                                marks={[
                                    { value: 0, label: '0' },
                                    { value: 1.5, label: '1.5' },
                                    { value: 3, label: '3' }
                                ]}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Collapse>
        </Paper>
    );
};

export default FundsFiltersComponent; 