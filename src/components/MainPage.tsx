import React, { useState, useEffect } from 'react';
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
    Paper,
    Chip,
    Grid,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    Assessment,
    Star,
    Shield,
    Refresh
} from '@mui/icons-material';
import { Groq } from 'groq-sdk';

// Enhanced fund interface
interface Fund {
    id: number;
    name: string;
    aum: string;
    return1Month: number;
    return3Month: number;
    return1Year: number;
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
}

interface WidgetData {
    bestFunds: Fund[];
    smallestDeclineFunds: Fund[];
    insights: {
        bestFundsInsight: string;
        smallestDeclineInsight: string;
    };
}

// Generate 30 sample funds with realistic data
const generateFunds = (): Fund[] => {
    const fundNames = [
        'Alpha Growth Fund', 'Beta Balanced Fund', 'Gamma Value Fund', 'Delta ESG Fund',
        'Epsilon Tech Fund', 'Zeta Healthcare Fund', 'Eta Real Estate Fund', 'Theta Energy Fund',
        'Iota Infrastructure Fund', 'Kappa Emerging Markets Fund', 'Lambda Fixed Income Fund',
        'Mu Dividend Fund', 'Nu Small Cap Fund', 'Xi International Fund', 'Omicron Bond Fund',
        'Pi Commodities Fund', 'Rho Multi-Asset Fund', 'Sigma Private Equity Fund',
        'Tau Alternative Fund', 'Upsilon Currency Fund', 'Phi Sector Rotation Fund',
        'Chi Momentum Fund', 'Psi Quality Fund', 'Omega Conservative Fund', 'Prime Growth Fund',
        'Vector Equity Fund', 'Matrix Balanced Fund', 'Nexus Innovation Fund', 'Apex Value Fund',
        'Vertex Sustainability Fund'
    ];

    const categories = ['Equity', 'Fixed Income', 'Alternative', 'Multi-Asset', 'Real Estate', 'Commodity'];
    const geographies = ['North America', 'Europe', 'Asia-Pacific', 'Global', 'Emerging Markets'];
    const riskLevels: ('Low' | 'Medium' | 'Medium-High' | 'High')[] = ['Low', 'Medium', 'Medium-High', 'High'];
    const managers = [
        'BlackRock', 'Vanguard', 'Fidelity', 'State Street', 'JP Morgan', 'Goldman Sachs',
        'Morgan Stanley', 'UBS', 'Deutsche Bank', 'Credit Suisse', 'BNP Paribas', 'Allianz'
    ];

    return fundNames.map((name, index) => ({
        id: index + 1,
        name,
        aum: `$${(Math.random() * 10 + 0.5).toFixed(1)}B`,
        return1Month: parseFloat((Math.random() * 10 - 2).toFixed(2)),
        return3Month: parseFloat((Math.random() * 15 - 3).toFixed(2)),
        return1Year: parseFloat((Math.random() * 25 - 5).toFixed(2)),
        volatility: parseFloat((Math.random() * 20 + 5).toFixed(2)),
        sharpeRatio: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
        maxDrawdown: parseFloat((Math.random() * -15 - 2).toFixed(2)),
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        geography: geographies[Math.floor(Math.random() * geographies.length)],
        esgScore: Math.floor(Math.random() * 40 + 60),
        alpha: parseFloat((Math.random() * 8 - 2).toFixed(2)),
        beta: parseFloat((Math.random() * 0.8 + 0.6).toFixed(2)),
        manager: managers[Math.floor(Math.random() * managers.length)],
        inceptionDate: `${Math.floor(Math.random() * 15 + 2008)}-${String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0')}-01`
    }));
};

const MainPage: React.FC = () => {
    const [funds] = useState<Fund[]>(generateFunds());
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [widgetData, setWidgetData] = useState<WidgetData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [groqClient, setGroqClient] = useState<Groq | null>(null);

    useEffect(() => {
        // Initialize Groq client
        const apiKey = process.env.REACT_APP_GROQ_API_KEY;
        if (apiKey) {
            const client = new Groq({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true
            });
            setGroqClient(client);
        }
    }, []);

    useEffect(() => {
        generateWidgetData();
    }, [funds, groqClient]);

    const generateWidgetData = async (): Promise<void> => {
        setLoading(true);

        // Sort funds for best performers and smallest decline
        const sortedByReturn = [...funds].sort((a, b) => b.return1Month - a.return1Month);
        const bestFunds = sortedByReturn.slice(0, 5);

        // For smallest decline, we want funds with the least negative returns or smallest positive returns
        const sortedByDecline = [...funds].sort((a, b) => {
            // If both are negative, the one closer to 0 is better
            // If both are positive, the smaller one is better for "smallest decline"
            if (a.return1Month < 0 && b.return1Month < 0) {
                return b.return1Month - a.return1Month;
            } else if (a.return1Month >= 0 && b.return1Month >= 0) {
                return a.return1Month - b.return1Month;
            } else if (a.return1Month < 0) {
                return -1;
            } else {
                return 1;
            }
        });
        const smallestDeclineFunds = sortedByDecline.slice(0, 5);

        let insights = {
            bestFundsInsight: 'Analysis of top performing funds based on 1-month returns and risk metrics.',
            smallestDeclineInsight: 'Funds showing the most resilience during market downturns.'
        };

        // Generate AI insights if Groq is available
        if (groqClient) {
            try {
                const bestFundsData = bestFunds.map(f => `${f.name}: ${f.return1Month}% (1M), Sharpe: ${f.sharpeRatio}, Risk: ${f.riskLevel}`).join('; ');
                const smallestDeclineData = smallestDeclineFunds.map(f => `${f.name}: ${f.return1Month}% (1M), Max Drawdown: ${f.maxDrawdown}%`).join('; ');

                const [bestFundsResponse, smallestDeclineResponse] = await Promise.all([
                    groqClient.chat.completions.create({
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a financial analyst. Provide a concise 2-sentence insight about fund performance trends.'
                            },
                            {
                                role: 'user',
                                content: `Analyze these top performing funds from last month: ${bestFundsData}. What trends do you see?`
                            }
                        ],
                        model: 'llama3-8b-8192',
                        temperature: 0.3,
                        max_tokens: 150
                    }),
                    groqClient.chat.completions.create({
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a financial analyst. Provide a concise 2-sentence insight about fund resilience and risk management.'
                            },
                            {
                                role: 'user',
                                content: `Analyze these funds with smallest declines: ${smallestDeclineData}. What makes them resilient?`
                            }
                        ],
                        model: 'llama3-8b-8192',
                        temperature: 0.3,
                        max_tokens: 150
                    })
                ]);

                insights = {
                    bestFundsInsight: bestFundsResponse.choices[0].message.content || insights.bestFundsInsight,
                    smallestDeclineInsight: smallestDeclineResponse.choices[0].message.content || insights.smallestDeclineInsight
                };
            } catch (error) {
                console.error('Error generating AI insights:', error);
            }
        }

        setWidgetData({
            bestFunds,
            smallestDeclineFunds,
            insights
        });
        setLoading(false);
    };

    const handleChangePage = (event: unknown, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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

    const paginatedFunds = funds.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Assessment sx={{ mr: 2 }} />
                    Smart Fund Benchmarking
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Comprehensive analysis of 30 funds with AI-powered insights
                </Typography>
            </Box>

            {/* AI-Powered Widgets */}
            <Grid container spacing={3} sx={{ mb: 4 }} flexWrap="nowrap">
                <Grid item xs={12} md={6} {...({} as any)}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Star sx={{ mr: 1, color: 'warning.main' }} />
                                    Best Funds of Last Month
                                </Typography>
                                <Tooltip title="Refresh AI Analysis">
                                    <IconButton onClick={generateWidgetData} disabled={loading}>
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                                        {widgetData?.insights.bestFundsInsight}
                                    </Typography>
                                    <List dense>
                                        {widgetData?.bestFunds.map((fund, index) => (
                                            <ListItem key={fund.id} sx={{ px: 0 }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                                                        <Typography variant="caption">{index + 1}</Typography>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={fund.name}
                                                    secondary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body2" sx={{ color: getReturnColor(fund.return1Month) }}>
                                                                {fund.return1Month > 0 ? '+' : ''}{fund.return1Month}%
                                                            </Typography>
                                                            <Chip label={fund.riskLevel} size="small" color={getRiskChipColor(fund.riskLevel)} />
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6} {...({} as any)}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Shield sx={{ mr: 1, color: 'info.main' }} />
                                    Most Resilient Funds
                                </Typography>
                                <Tooltip title="Refresh AI Analysis">
                                    <IconButton onClick={generateWidgetData} disabled={loading}>
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                                        {widgetData?.insights.smallestDeclineInsight}
                                    </Typography>
                                    <List dense>
                                        {widgetData?.smallestDeclineFunds.map((fund, index) => (
                                            <ListItem key={fund.id} sx={{ px: 0 }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>
                                                        <Typography variant="caption">{index + 1}</Typography>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={fund.name}
                                                    secondary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body2" sx={{ color: getReturnColor(fund.return1Month) }}>
                                                                {fund.return1Month > 0 ? '+' : ''}{fund.return1Month}%
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Max DD: {fund.maxDrawdown}%
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

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
                                    <TableCell align="right">1M Return</TableCell>
                                    <TableCell align="right">3M Return</TableCell>
                                    <TableCell align="right">1Y Return</TableCell>
                                    <TableCell align="right">Sharpe Ratio</TableCell>
                                    <TableCell align="right">Volatility</TableCell>
                                    <TableCell>Risk Level</TableCell>
                                    <TableCell>Category</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedFunds.map((fund) => (
                                    <TableRow key={fund.id} hover>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {fund.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ESG Score: {fund.esgScore}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{fund.manager}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{fund.aum}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ color: getReturnColor(fund.return1Month) }}>
                                                {fund.return1Month > 0 ? '+' : ''}{fund.return1Month}%
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ color: getReturnColor(fund.return3Month) }}>
                                                {fund.return3Month > 0 ? '+' : ''}{fund.return3Month}%
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ color: getReturnColor(fund.return1Year) }}>
                                                {fund.return1Year > 0 ? '+' : ''}{fund.return1Year}%
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2">{fund.sharpeRatio}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2">{fund.volatility}%</Typography>
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 15, 20]}
                        component="div"
                        count={funds.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </CardContent>
            </Card>
        </Box>
    );
};

export default MainPage; 