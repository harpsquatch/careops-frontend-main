import React from 'react';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { useTheme } from 'styled-components';

import { ChartSkeleton } from '../atoms';
import useCareChartData from '../hooks/useCareChartData';

/* Register Chart.js modules once */
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/* ─── Styled wrapper ─── */

const Canvas = styled.div`
    position: relative;
    width: 100%;
    height: 220px;
`;

/* ─── Organism ─── */

const CareProgressChart = ({ fieldId }) => {
    const { isLoading, isEmpty, chartProps } = useCareChartData(fieldId);
    const theme = useTheme();

    if (isLoading)  return <ChartSkeleton text="Loading chart…" />;
    if (isEmpty || !chartProps) return <ChartSkeleton text="No chart data available" />;

    const { data, options, plugins } = chartProps;

    // Use theme.cardBg as key to force re-render when theme changes
    return (
        <Canvas>
            <Line key={theme.cardBg} data={data} options={options} plugins={plugins} />
        </Canvas>
    );
};

export default CareProgressChart;

