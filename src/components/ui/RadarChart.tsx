import React, { useState } from 'react';

interface DataPoint {
    label: string;
    value: number;
    max: number;
}

interface RadarChartProps {
    data: DataPoint[];
    size?: number;
    color?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 300, color = '#64B2BC' }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const padding = 40;
    const radius = (size - padding * 2) / 2;
    const center = size / 2;
    const angleStep = (Math.PI * 2) / data.length;

    // Helper to calculate coordinates
    const getCoordinates = (index: number, value: number, max: number) => {
        const angle = index * angleStep - Math.PI / 2; // Start from top
        const normalizedValue = value / max;
        const x = center + radius * normalizedValue * Math.cos(angle);
        const y = center + radius * normalizedValue * Math.sin(angle);
        return { x, y };
    };

    // Generate polygon points
    const points = data.map((d, i) => {
        const { x, y } = getCoordinates(i, d.value, d.max);
        return `${x},${y}`;
    }).join(' ');

    // Generate background polygons (grid)
    const gridLevels = [0.25, 0.5, 0.75, 1];

    return (
        <div className="relative flex justify-center items-center">
            <svg width={size} height={size} className="overflow-visible">
                {/* Grid Lines */}
                {gridLevels.map((level, i) => (
                    <polygon
                        key={i}
                        points={data.map((d, index) => {
                            const { x, y } = getCoordinates(index, d.max * level, d.max);
                            return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#2A2A2A" // darkGrey
                        strokeWidth="1"
                        className="transition-all duration-300"
                    />
                ))}

                {/* Axes */}
                {data.map((d, i) => {
                    const { x, y } = getCoordinates(i, d.max, d.max);
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={x}
                            y2={y}
                            stroke="#2A2A2A"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon */}
                <polygon
                    points={points}
                    fill={color}
                    fillOpacity="0.2"
                    stroke={color}
                    strokeWidth="2"
                    className="transition-all duration-500 ease-out"
                />

                {/* Data Points & Labels */}
                {data.map((d, i) => {
                    const { x, y } = getCoordinates(i, d.value, d.max);
                    const labelCoords = getCoordinates(i, d.max * 1.15, d.max);
                    const isHovered = hoveredIndex === i;

                    return (
                        <g
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="cursor-pointer group"
                        >
                            {/* Point */}
                            <circle
                                cx={x}
                                cy={y}
                                r={isHovered ? 6 : 4}
                                fill={color}
                                className="transition-all duration-300"
                            />

                            {/* Label */}
                            <text
                                x={labelCoords.x}
                                y={labelCoords.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={isHovered ? color : '#767676'} // accent or quillGray
                                className={`text-xs md:text-sm font-ptMono transition-colors duration-300 ${isHovered ? 'font-bold' : ''}`}
                            >
                                {d.label}
                            </text>

                            {/* Value Tooltip (visible on hover) */}
                            <text
                                x={labelCoords.x}
                                y={labelCoords.y + 15}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={color}
                                className={`text-xs font-ptMono transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                            >
                                {d.value}kg
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default RadarChart;
