import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CryptoContext } from '../context/CryptoContext';
import AreaChart from '../components/AreaChart';
import { 
  ArrowUp, 
  ArrowDown, 
  Globe, 
  Github, 
  Twitter, 
  Facebook, 
  Link as LinkIcon,
  BarChart2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar
} from 'lucide-react';

const CoinPage = () => {
    const { cryptoId } = useParams();
    const [coinDetails, setCoinDetails] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [period, setPeriod] = useState('30');
    const [error, setError] = useState(null);
    const { currentCurrency } = useContext(CryptoContext);

    const requestOptions = {
        method: 'GET',
        headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-6ft4mo3VygFVj8pvXWc7rr4V' }
    };

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                // Fetch coin details
                const detailsRes = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${cryptoId}`,
                    requestOptions
                );
                if (!detailsRes.ok) throw new Error(`Error fetching coin details: ${detailsRes.statusText}`);
                const detailsData = await detailsRes.json();
                setCoinDetails(detailsData);

                // Fetch chart data
                const chartRes = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=${currentCurrency.name}&days=${period}&interval=daily`,
                    requestOptions
                );
                if (!chartRes.ok) throw new Error(`Error fetching chart data: ${chartRes.statusText}`);
                setChartData(await chartRes.json());
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };
        fetchData();
    }, [currentCurrency, cryptoId, period]);

    const formatNumber = (num, isCurrency = false, decimals = 2) => {
        if (num === undefined || num === null) return 'N/A';
        
        // Handle very small numbers
        if (num < 0.000001) {
            return isCurrency 
                ? `${currentCurrency.symbol}${num.toFixed(8)}` 
                : num.toFixed(8);
        }

        // Handle numbers between 0.000001 and 0.1
        if (num < 0.1) {
            return isCurrency 
                ? `${currentCurrency.symbol}${num.toFixed(6)}` 
                : num.toFixed(6);
        }

        // Handle numbers between 0.1 and 1
        if (num < 1) {
            return isCurrency 
                ? `${currentCurrency.symbol}${num.toFixed(4)}` 
                : num.toFixed(4);
        }

        // Handle numbers between 1 and 1000
        if (num < 1000) {
            return isCurrency 
                ? `${currentCurrency.symbol}${num.toFixed(decimals)}` 
                : num.toFixed(decimals);
        }

        // Handle larger numbers with suffixes
        const suffixes = ['', 'K', 'M', 'B', 'T'];
        const suffixNum = Math.floor(Math.log10(num) / 3);
        const shortNum = (num / Math.pow(1000, suffixNum)).toFixed(decimals);
        
        return isCurrency
            ? `${currentCurrency.symbol}${shortNum}${suffixes[suffixNum]}`
            : `${shortNum}${suffixes[suffixNum]}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'N/A';
        }
    };

    if (!cryptoId) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white'>
                <p>Error: No cryptocurrency ID provided.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white'>
                <p>{error}</p>
            </div>
        );
    }

    if (!coinDetails || !chartData) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-900'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500' />
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-900/90 text-white px-4 sm:px-[5%] md:px-[8%] py-6'>
            {/* Coin Header Section */}
            <div className='flex flex-col items-center md:flex-row gap-4 mb-6 bg-gray-800/30 backdrop-blur-lg p-4 rounded-xl border border-emerald-500/20'>
                <img 
                    src={coinDetails.image?.large} 
                    alt={coinDetails.name}
                    className='w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-1'
                />
                <div className='text-center md:text-left'>
                    <h1 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
                        {coinDetails.name}
                        <span className='text-xl md:text-2xl ml-2 text-cyan-400/90 block mt-1'>
                            ({coinDetails.symbol?.toUpperCase()})
                        </span>
                    </h1>
                    <div className='flex items-center justify-center md:justify-start gap-2 mt-1'>
                        <span className='text-sm text-gray-300'>Rank: #{coinDetails.market_cap_rank}</span>
                        <span className='text-sm text-gray-300'>•</span>
                        <span className='text-sm text-gray-300'>
                            {formatNumber(coinDetails.market_data.current_price[currentCurrency.name], true)}
                        </span>
                        <span className={`text-xs flex items-center ${
                            coinDetails.market_data.price_change_percentage_24h > 0 
                                ? 'text-emerald-400' 
                                : 'text-red-400'
                        }`}>
                            {coinDetails.market_data.price_change_percentage_24h > 0 ? (
                                <TrendingUp className='w-3 h-3 mr-0.5' />
                            ) : (
                                <TrendingDown className='w-3 h-3 mr-0.5' />
                            )}
                            {Math.abs(coinDetails.market_data.price_change_percentage_24h).toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Price Chart Section */}
            <div className='mb-6 bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2'>
                    <h2 className='text-lg font-semibold text-emerald-400/90 flex items-center gap-2'>
                        <BarChart2 className='w-5 h-5' />
                        {currentCurrency.symbol} Price Chart ({period === '1' ? '24H' : `${period}D`})
                    </h2>
                    <div className='relative group'>
                        <select 
                            value={period} 
                            onChange={(e) => setPeriod(e.target.value)}
                            className='bg-gray-800/60 border border-emerald-500/30 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50'
                        >
                            <option value="1">24H</option>
                            <option value="7">7D</option>
                            <option value="14">14D</option>
                            <option value="30">30D</option>
                            <option value="90">90D</option>
                            <option value="180">180D</option>
                            <option value="365">1Y</option>
                        </select>
                        <div className='absolute -inset-0.5 bg-gradient-to-r from-emerald-600/20 to-cyan-500/20 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300 -z-10'/>
                    </div>
                </div>
                <div className='h-64 md:h-96'>
                    <AreaChart historicalData={chartData} currencySymbol={currentCurrency.symbol}/>
                </div>
            </div>

            {/* Market Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                {/* Market Cap Card */}
                <div className='bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20'>
                    <div className='flex items-center gap-2 mb-2'>
                        <DollarSign className='w-4 h-4 text-emerald-400' />
                        <h3 className='text-sm font-medium text-cyan-400/80'>Market Cap</h3>
                    </div>
                    <p className='text-xl font-semibold text-gray-100'>
                        {formatNumber(coinDetails.market_data.market_cap[currentCurrency.name], true)}
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>
                        {formatNumber(coinDetails.market_data.circulating_supply)} {coinDetails.symbol.toUpperCase()} circulating
                    </p>
                </div>

                {/* 24h Volume Card */}
                <div className='bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20'>
                    <div className='flex items-center gap-2 mb-2'>
                        <TrendingUp className='w-4 h-4 text-emerald-400' />
                        <h3 className='text-sm font-medium text-cyan-400/80'>24h Volume</h3>
                    </div>
                    <p className='text-xl font-semibold text-gray-100'>
                        {formatNumber(coinDetails.market_data.total_volume[currentCurrency.name], true)}
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>
                        {coinDetails.market_data.price_change_percentage_24h > 0 ? (
                            <span className='text-emerald-400'>↑ {coinDetails.market_data.price_change_percentage_24h.toFixed(2)}%</span>
                        ) : (
                            <span className='text-red-400'>↓ {Math.abs(coinDetails.market_data.price_change_percentage_24h).toFixed(2)}%</span>
                        )} today
                    </p>
                </div>

                {/* All Time High Card */}
                <div className='bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20'>
                    <div className='flex items-center gap-2 mb-2'>
                        <ArrowUp className='w-4 h-4 text-emerald-400' />
                        <h3 className='text-sm font-medium text-cyan-400/80'>All Time High</h3>
                    </div>
                    <p className='text-xl font-semibold text-gray-100'>
                        {formatNumber(coinDetails.market_data.ath[currentCurrency.name], true)}
                    </p>
                    <p className='text-xs text-gray-400 mt-1 flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />
                        {formatDate(coinDetails.market_data.ath_date[currentCurrency.name])}
                    </p>
                </div>

                {/* All Time Low Card */}
                <div className='bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20'>
                    <div className='flex items-center gap-2 mb-2'>
                        <ArrowDown className='w-4 h-4 text-emerald-400' />
                        <h3 className='text-sm font-medium text-cyan-400/80'>All Time Low</h3>
                    </div>
                    <p className='text-xl font-semibold text-gray-100'>
                        {formatNumber(coinDetails.market_data.atl[currentCurrency.name], true)}
                    </p>
                    <p className='text-xs text-gray-400 mt-1 flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />
                        {formatDate(coinDetails.market_data.atl_date[currentCurrency.name])}
                    </p>
                </div>
            </div>

            {/* Detailed Sections */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
                {/* About Section */}
                <div className='lg:col-span-2 bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20'>
                    <h3 className='text-lg font-semibold text-emerald-400/90 mb-4'>About {coinDetails.name}</h3>
                    <div className='prose prose-invert max-w-none text-sm text-gray-300'>
                        {coinDetails.description?.en ? (
                            <p>{coinDetails.description.en.split('. ')[0]}.</p>
                        ) : (
                            <p>No description available for this cryptocurrency.</p>
                        )}
                        <div className='mt-4 space-y-3'>
                            {coinDetails.links?.homepage?.filter(Boolean).length > 0 && (
                                <div>
                                    <h4 className='text-sm font-medium text-emerald-400/80 mb-2'>Official Links</h4>
                                    <div className='space-y-2'>
                                        {coinDetails.links.homepage.filter(Boolean).map((link, index) => (
                                            <a
                                                key={index}
                                                href={link}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='flex items-center gap-2 text-sm text-cyan-400/80 hover:text-cyan-400 transition-colors'
                                            >
                                                <LinkIcon className='w-3 h-3' />
                                                <span className='truncate'>{link.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Price Performance Section */}
                <div className='bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20'>
                    <h3 className='text-lg font-semibold text-emerald-400/90 mb-4'>Price Performance</h3>
                    <div className='grid grid-cols-2 gap-3'>
                        {['1h', '24h', '7d', '14d', '30d', '60d', '200d', '1y'].map((timeframe) => (
                            <div key={timeframe} className={`p-2 rounded-lg ${
                                coinDetails.market_data[`price_change_percentage_${timeframe}_in_currency`]?.[currentCurrency.name] > 0
                                    ? 'bg-emerald-500/10'
                                    : 'bg-red-500/10'
                            }`}>
                                <div className='flex justify-between items-center'>
                                    <span className='text-xs text-gray-300'>{timeframe}</span>
                                    <span className={`text-sm font-medium ${
                                        coinDetails.market_data[`price_change_percentage_${timeframe}_in_currency`]?.[currentCurrency.name] > 0
                                            ? 'text-emerald-400'
                                            : 'text-red-400'
                                    }`}>
                                        {coinDetails.market_data[`price_change_percentage_${timeframe}_in_currency`]?.[currentCurrency.name]?.toFixed(2) || '0.00'}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Info Section */}
            <div className='bg-gray-800/30 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20'>
                <h3 className='text-lg font-semibold text-emerald-400/90 mb-4'>Additional Information</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div>
                        <h4 className='text-sm font-medium text-cyan-400/80 mb-2'>Categories</h4>
                        <div className='flex flex-wrap gap-2'>
                            {coinDetails.categories?.filter(Boolean).map((category, index) => (
                                <span key={index} className='px-2 py-1 text-xs bg-gray-700/50 rounded-md text-gray-300'>
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className='text-sm font-medium text-cyan-400/80 mb-2'>Genesis Date</h4>
                        <p className='text-sm text-gray-300'>
                            {coinDetails.genesis_date || 'Not available'}
                        </p>
                    </div>
                    <div>
                        <h4 className='text-sm font-medium text-cyan-400/80 mb-2'>Community Links</h4>
                        <div className='space-y-1'>
                            {coinDetails.links?.twitter_screen_name && (
                                <a
                                    href={`https://twitter.com/${coinDetails.links.twitter_screen_name}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='flex items-center gap-2 text-sm text-cyan-400/80 hover:text-cyan-400 transition-colors'
                                >
                                    <Twitter className='w-4 h-4' />
                                    Twitter
                                </a>
                            )}
                            {coinDetails.links?.facebook_username && (
                                <a
                                    href={`https://facebook.com/${coinDetails.links.facebook_username}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='flex items-center gap-2 text-sm text-cyan-400/80 hover:text-cyan-400 transition-colors'
                                >
                                    <Facebook className='w-4 h-4' />
                                    Facebook
                                </a>
                            )}
                            {coinDetails.links?.subreddit_url && (
                                <a
                                    href={coinDetails.links.subreddit_url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='flex items-center gap-2 text-sm text-cyan-400/80 hover:text-cyan-400 transition-colors'
                                >
                                    <span className='w-4 h-4'>/r/</span>
                                    Reddit
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinPage;