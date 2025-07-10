import React, { useState } from 'react';
import {
    TableRow,
    TableCell,
    IconButton,
    Collapse,
    Box,
    Typography,
    Grid,
    Chip,
    Rating,
    Divider
} from '@mui/material';
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    TrendingUp,
    TrendingDown
} from '@mui/icons-material';
import { Fund } from '../../services/api';

interface FundExpandableRowProps {
    fund: Fund;
}

const FundExpandableRow: React.FC<FundExpandableRowProps> = ({ fund }) => {
    const [open, setOpen] = useState(false);

    const getRiskChipColor = (risk: string): 'success' | 'warning' | 'error' | 'default' => {
        switch (risk) {
            case 'Low': return 'success';
            case 'Medium': return 'warning';
            case 'Medium-High': return 'warning';
            case 'High': return 'error';
            default: return 'default';
        }
    };

    const getReturnColor = (returnValue: number): string => {
        if (returnValue > 0) return 'success.main';
        if (returnValue < 0) return 'error.main';
        return 'text.primary';
    };

    const formatCurrency = (value: number, currency: string = 'USD'): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency === 'JPY' ? 'JPY' : 'USD',
            minimumFractionDigits: currency === 'JPY' ? 0 : 2,
        }).format(value);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <TableRow hover onClick={() => setOpen(!open)} sx={{ cursor: 'pointer' }}>
                <TableCell>
                    <IconButton size="small">
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Box>
                        <Typography variant="body2" fontWeight="medium">
                            {fund.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {fund.manager}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Typography variant="body2">{fund.aum}</Typography>
                </TableCell>
                <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="body2" sx={{ color: getReturnColor(fund.return1Year) }}>
                            {fund.return1Year > 0 ? '+' : ''}{fund.return1Year.toFixed(2)}%
                        </Typography>
                        {fund.return1Year > 0 ? (
                            <TrendingUp sx={{ ml: 0.5, fontSize: 16, color: 'success.main' }} />
                        ) : (
                            <TrendingDown sx={{ ml: 0.5, fontSize: 16, color: 'error.main' }} />
                        )}
                    </Box>
                </TableCell>
                <TableCell align="right">
                    <Typography variant="body2">{fund.sharpeRatio.toFixed(2)}</Typography>
                </TableCell>
                <TableCell>
                    <Chip
                        label={fund.riskLevel}
                        size="small"
                        color={getRiskChipColor(fund.riskLevel)}
                    />
                </TableCell>
                <TableCell>
                    <Typography variant="body2">{fund.category}</Typography>
                </TableCell>
                <TableCell>
                    <Rating value={fund.morningstarRating} readOnly size="small" />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Fund Details
                            </Typography>
                            
                            <Grid container spacing={3}>
                                {/* Performance Metrics */}
                                <Grid xs={12} md={6} {...({} as any)}>
                                    <Typography variant="subtitle2" gutterBottom color="primary">
                                        Performance
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">1 Month:</Typography>
                                            <Typography variant="body2" sx={{ color: getReturnColor(fund.return1Month) }}>
                                                {fund.return1Month > 0 ? '+' : ''}{fund.return1Month.toFixed(2)}%
                                            </Typography>
                                        </Grid>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">3 Month:</Typography>
                                            <Typography variant="body2" sx={{ color: getReturnColor(fund.return3Month) }}>
                                                {fund.return3Month > 0 ? '+' : ''}{fund.return3Month.toFixed(2)}%
                                            </Typography>
                                        </Grid>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">3 Year:</Typography>
                                            <Typography variant="body2" sx={{ color: getReturnColor(fund.return3Year) }}>
                                                {fund.return3Year > 0 ? '+' : ''}{fund.return3Year.toFixed(2)}%
                                            </Typography>
                                        </Grid>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">5 Year:</Typography>
                                            <Typography variant="body2" sx={{ color: getReturnColor(fund.return5Year) }}>
                                                {fund.return5Year > 0 ? '+' : ''}{fund.return5Year.toFixed(2)}%
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Risk Metrics */}
                                <Grid xs={12} md={6} {...({} as any)}>
                                    <Typography variant="subtitle2" gutterBottom color="primary">
                                        Risk & Analytics
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">Volatility:</Typography>
                                            <Typography variant="body2">{fund.volatility.toFixed(2)}%</Typography>
                                        </Grid>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">Max Drawdown:</Typography>
                                            <Typography variant="body2" color="error.main">
                                                {fund.maxDrawdown.toFixed(2)}%
                                            </Typography>
                                        </Grid>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">Alpha:</Typography>
                                            <Typography variant="body2" sx={{ color: getReturnColor(fund.alpha) }}>
                                                {fund.alpha > 0 ? '+' : ''}{fund.alpha.toFixed(2)}
                                            </Typography>
                                        </Grid>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">Beta:</Typography>
                                            <Typography variant="body2">{fund.beta.toFixed(2)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid xs={12} {...({} as any)}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>

                                {/* Fund Information */}
                                <Grid xs={12} md={6} {...({} as any)}>
                                    <Typography variant="subtitle2" gutterBottom color="primary">
                                        Fund Information
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid xs={6} {...({} as any)}   >
                                            <Typography variant="body2" color="text.secondary">Geography:</Typography>
                                            <Typography variant="body2">{fund.geography}</Typography>
                                        </Grid>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">Currency:</Typography>
                                            <Typography variant="body2">{fund.currency}</Typography>
                                        </Grid>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">Domicile:</Typography>
                                            <Typography variant="body2">{fund.domicile}</Typography>
                                        </Grid>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">Inception:</Typography>
                                            <Typography variant="body2">{formatDate(fund.inceptionDate)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Financial Metrics */}
                                <Grid xs={12} md={6} {...({} as any)}>
                                    <Typography variant="subtitle2" gutterBottom color="primary">
                                        Financial Details
                                    </Typography>
                                    <Grid container spacing={1}>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">Expense Ratio:</Typography>
                                            <Typography variant="body2">{fund.expenseRatio.toFixed(2)}%</Typography>
                                        </Grid>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">Dividend Yield:</Typography>
                                            <Typography variant="body2">{fund.dividendYield.toFixed(2)}%</Typography>
                                        </Grid>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">NAV:</Typography>
                                            <Typography variant="body2">{formatCurrency(fund.nav, fund.currency)}</Typography>
                                        </Grid>
                                        <Grid xs={6} {...({} as any)}>
                                            <Typography variant="body2" color="text.secondary">Min Investment:</Typography>
                                            <Typography variant="body2">
                                                {fund.minimumInvestment > 0 ? formatCurrency(fund.minimumInvestment, fund.currency) : 'No minimum'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid xs={12} {...({} as any)}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>

                                {/* ESG & Sustainability */}
                                <Grid xs={12} md={4} {...({} as any)}>
                                    <Typography variant="subtitle2" gutterBottom color="primary">
                                        ESG & Sustainability
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>ESG Score:</Typography>
                                        <Chip 
                                            label={fund.esgScore.toFixed(1)} 
                                            size="small" 
                                            color={fund.esgScore >= 80 ? 'success' : fund.esgScore >= 60 ? 'warning' : 'error'} 
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Sustainable:</Typography>
                                        <Chip 
                                            label={fund.isSustainable ? 'Yes' : 'No'} 
                                            size="small" 
                                            color={fund.isSustainable ? 'success' : 'default'} 
                                        />
                                    </Box>
                                </Grid>

                                {/* Status */}
                                <Grid xs={12} md={4} {...({} as any)}   >
                                    <Typography variant="subtitle2" gutterBottom color="primary">
                                        Status
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Active:</Typography>
                                        <Chip 
                                            label={fund.isActive ? 'Active' : 'Inactive'} 
                                            size="small" 
                                            color={fund.isActive ? 'success' : 'error'} 
                                        />
                                    </Box>
                                </Grid>

                                {/* Additional Metrics */}
                                <Grid xs={12} md={4} {...({} as any)}>
                                    <Typography variant="subtitle2" gutterBottom color="primary">
                                        Additional Metrics
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        P/E Ratio: <span style={{ color: 'black' }}>{fund.peRatio.toFixed(2)}</span>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        P/B Ratio: <span style={{ color: 'black' }}>{fund.pbRatio.toFixed(2)}</span>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Turnover Ratio: <span style={{ color: 'black' }}>{fund.turnoverRatio.toFixed(2)}%</span>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export default FundExpandableRow; 