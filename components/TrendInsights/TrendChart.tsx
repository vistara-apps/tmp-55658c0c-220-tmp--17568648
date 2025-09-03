'use client';

interface TrendChartProps {
  data: { date: string; score: number }[];
  height?: number;
  width?: number;
}

export default function TrendChart({ data, height = 200, width = 400 }: TrendChartProps) {
  // If no data, return empty chart
  if (!data || data.length === 0) {
    return (
      <div 
        style={{ height, width }} 
        className="bg-gray-100 rounded-md flex items-center justify-center"
      >
        <p className="text-gray-500">No trend data available</p>
      </div>
    );
  }
  
  // Find min and max values for scaling
  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));
  
  // Calculate scaling factors
  const chartHeight = height - 40; // Leave room for labels
  const chartWidth = width - 60; // Leave room for y-axis labels
  
  // Calculate x and y positions for each data point
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * chartWidth + 50;
    const y = chartHeight - ((d.score - minScore) / (maxScore - minScore || 1)) * chartHeight + 10;
    return { x, y, ...d };
  });
  
  // Create SVG path for the line
  const pathData = points.map((p, i) => 
    (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)
  ).join(' ');
  
  // Create SVG path for the area under the line
  const areaData = `${pathData} L ${points[points.length - 1].x},${chartHeight + 10} L ${points[0].x},${chartHeight + 10} Z`;
  
  return (
    <div className="relative">
      <h4 className="text-sm font-medium mb-2">Trend History</h4>
      <svg width={width} height={height} className="overflow-visible">
        {/* Y-axis */}
        <line x1="50" y1="10" x2="50" y2={chartHeight + 10} stroke="#e5e7eb" strokeWidth="1" />
        
        {/* X-axis */}
        <line x1="50" y1={chartHeight + 10} x2={chartWidth + 50} y2={chartHeight + 10} stroke="#e5e7eb" strokeWidth="1" />
        
        {/* Y-axis labels */}
        <text x="10" y="15" className="text-xs fill-gray-500">100</text>
        <text x="10" y={chartHeight / 2 + 10} className="text-xs fill-gray-500">50</text>
        <text x="10" y={chartHeight + 10} className="text-xs fill-gray-500">0</text>
        
        {/* X-axis labels (show first, middle, and last date) */}
        <text x="50" y={chartHeight + 30} className="text-xs fill-gray-500" textAnchor="middle">
          {new Date(data[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </text>
        <text x={chartWidth / 2 + 50} y={chartHeight + 30} className="text-xs fill-gray-500" textAnchor="middle">
          {new Date(data[Math.floor(data.length / 2)].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </text>
        <text x={chartWidth + 50} y={chartHeight + 30} className="text-xs fill-gray-500" textAnchor="middle">
          {new Date(data[data.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </text>
        
        {/* Area under the line */}
        <path d={areaData} fill="url(#gradient)" opacity="0.2" />
        
        {/* Line */}
        <path d={pathData} fill="none" stroke="hsl(234, 82%, 57%)" strokeWidth="2" />
        
        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="hsl(234, 82%, 57%)"
            className="hover:r-4 transition-all duration-200"
          />
        ))}
        
        {/* Gradient for area under the line */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(234, 82%, 57%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(234, 82%, 57%)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

