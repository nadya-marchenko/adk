import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Box,
    Chip,
    IconButton,
    Skeleton
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    ArrowForward
} from '@mui/icons-material';
import { Fund } from '../../services/api';

interface FundWidgetProps {
    title: string;
    description: string;
    funds: Fund[];
    loading: boolean;
    error?: string | null;
    onViewAll?: () => void;
    icon?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const FundWidget: React.FC<FundWidgetProps> = ({
    title,
    description,
    funds,
    loading,
    error,
    onViewAll,
    icon,
    color = 'primary'
}) => {
    const formatReturn = (value: number | null | undefined): string => {
        if (value === null || value === undefined) return 'N/A';
        const formatted = (value * 100).toFixed(2);
        return `${formatted}%`;
    };

    const formatAUM = (value: string | number | null | undefined): string => {
        if (value === null || value === undefined) return 'N/A';
        
        // If it's already a formatted string (like "$452M"), return as is
        if (typeof value === 'string') {
            return value;
        }
        
        // If it's a number, format it
        if (typeof value === 'number') {
            if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
            if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
            if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
            return `$${value.toFixed(0)}`;
        }
        
        return 'N/A';
    };

    const getReturnIcon = (returnValue: number | null | undefined) => {
        if (returnValue === null || returnValue === undefined) return null;
        return returnValue >= 0 ? 
            <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} /> : 
            <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />;
    };

    const getReturnColor = (returnValue: number | null | undefined): 'success' | 'error' | 'default' => {
        if (returnValue === null || returnValue === undefined) return 'default';
        return returnValue >= 0 ? 'success' : 'error';
    };

    if (loading) {
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                        <Skeleton variant="text" width={150} height={28} />
                    </Box>
                    <Skeleton variant="text" width={200} height={20} sx={{ mb: 2 }} />
                    <List dense>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                                <Skeleton variant="text" width="100%" height={60} />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card sx={{ height: '100%' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {icon && <Box sx={{ mr: 1, color: `${color}.main` }}>{icon}</Box>}
                        <Typography variant="h6" component="h3">
                            {title}
                        </Typography>
                    </Box>
                    {onViewAll && (
                        <IconButton size="small" onClick={onViewAll} aria-label="View all">
                            <ArrowForward fontSize="small" />
                        </IconButton>
                    )}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {description}
                </Typography>

                {/* Funds List */}
                <List dense sx={{ p: 0 }}>
                    {funds.slice(0, 5).map((fund, index) => (
                        <ListItem 
                            key={fund.id || index} 
                            sx={{ 
                                px: 0, 
                                py: 1,
                                borderBottom: index < Math.min(funds.length, 5) - 1 ? '1px solid' : 'none',
                                borderColor: 'divider'
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                        {fund.name || 'N/A'}
                                    </Typography>
                                }
                                secondary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            AUM: {formatAUM(fund.aum)}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            {getReturnIcon(fund.return1Year)}
                                            <Chip
                                                label={formatReturn(fund.return1Year)}
                                                size="small"
                                                color={getReturnColor(fund.return1Year)}
                                                variant="outlined"
                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                </List>

                {funds.length === 0 && (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                        No funds available
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default FundWidget; 