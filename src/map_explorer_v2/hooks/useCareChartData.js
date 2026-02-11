import { useMemo } from 'react';
import { format } from 'date-fns';
import { useTheme } from 'styled-components';
import { useGetChatData } from '../../hooks/useCharts';
import { FONT_FAMILY } from '../constants';

/**
 * Hook that fetches chart data for a patient and returns
 * ready-to-render Chart.js { data, options, plugins }.
 *
 * @param {string} fieldId  – patient / field id
 * @returns {{ isLoading, isEmpty, chartProps }}
 */
export default function useCareChartData(fieldId) {
    const { data: raw, isSuccess, isLoading } = useGetChatData(fieldId);
    const theme = useTheme();

    const result = useMemo(() => {
        if (!isSuccess || !raw || !theme) return null;

        const { labels, values, forecast_values, valid_index } = raw;
        const todayIdx = valid_index;

        /* ── Split actual vs scheduled ── */
        const actualValues   = values.map((v, i) => (i <= todayIdx ? v : null));
        const scheduledValues = values.map((v, i) => (i >= todayIdx ? v : null));

        /* ── Shading range (only up to today) ── */
        const shadingRange = forecast_values.map((v, i) =>
            i <= todayIdx ? v : { min: 0, max: 0 },
        );

        /* ──────── Plugin: risk-band shading ──────── */
        const shadingArea = {
            id: 'shadingArea',
            beforeDatasetsDraw(chart) {
                const { ctx, scales: { y } } = chart;
                const meta = chart.getDatasetMeta(0);
                if (!meta?.data?.length) return;

                const ds = chart.data.datasets[0];
                if (!ds.shadingRange) return;

                const tickH = y.height / (y.max - y.min);
                const pts = [];
                for (let i = 0; i <= todayIdx && i < meta.data.length; i++) {
                    if (ds.shadingRange[i] && meta.data[i]) pts.push(i);
                }
                if (pts.length < 2) return;

                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = theme.chartShadingFill;

                // bottom edge
                ctx.moveTo(
                    meta.data[pts[0]].x,
                    meta.data[pts[0]].y + tickH * ds.shadingRange[pts[0]].min,
                );
                for (let k = 1; k < pts.length; k++) {
                    const i = pts[k];
                    ctx.lineTo(meta.data[i].x, meta.data[i].y + tickH * ds.shadingRange[i].min);
                }
                // top edge (reversed)
                for (let k = pts.length - 1; k >= 0; k--) {
                    const i = pts[k];
                    ctx.lineTo(meta.data[i].x, meta.data[i].y - tickH * ds.shadingRange[i].max);
                }

                ctx.closePath();
                ctx.fill();
                ctx.restore();
            },
        };

        /* ──────── Plugin: "Today" dashed line ──────── */
        const todayLine = {
            id: 'todayLine',
            beforeDatasetsDraw(chart) {
                const { ctx, chartArea: { top, bottom } } = chart;
                const meta = chart.getDatasetMeta(0);
                if (!meta?.data || todayIdx >= meta.data.length) return;
                const xPos = meta.data[todayIdx]?.x;
                if (!xPos) return;

                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = theme.chartTodayStroke;
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.moveTo(xPos, top);
                ctx.lineTo(xPos, bottom);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = theme.chartTodayLabel;
                ctx.font = `10px ${FONT_FAMILY}`;
                ctx.textAlign = 'center';
                ctx.fillText('Today', xPos, top - 6);
                ctx.restore();
            },
        };

        /* ──────── Datasets ──────── */
        const datasets = [
            {
                label: 'Completed',
                data: actualValues,
                borderColor: theme.chartPrimary,
                borderWidth: 2.5,
                backgroundColor: theme.chartPrimary,
                order: 2,
                spanGaps: false,
                shadingRange,
            },
            {
                label: 'Scheduled',
                data: scheduledValues,
                borderColor: theme.chartPrimaryFaded,
                borderWidth: 2,
                borderDash: [6, 4],
                backgroundColor: theme.chartPrimaryGhost,
                order: 3,
                spanGaps: false,
                shadingRange: forecast_values,
            },
        ];

        const data = { labels, datasets };

        /* ──────── Options ──────── */
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 16, bottom: 0, left: 0, right: 0 } },
            interaction: { intersect: false, mode: 'nearest' },
            elements: { point: { radius: 0 } },

            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    border: { display: false },
                    title: { display: false },
                    ticks: {
                        stepSize: 25,
                        font: { size: 10, family: FONT_FAMILY },
                        color: theme.chartTickColor,
                        padding: 6,
                        callback: (v) => v,
                    },
                    grid: {
                        color: theme.chartGridColor,
                        drawBorder: false,
                    },
                },
                x: {
                    border: { display: false },
                    grid: { display: false },
                    title: { display: false },
                    ticks: {
                        maxTicksLimit: 6,
                        font: { size: 10, family: FONT_FAMILY },
                        color: theme.chartTickColor,
                        padding: 4,
                        callback(_, idx) {
                            if (idx >= labels.length) return '';
                            return format(new Date(labels[idx]), 'MMM d');
                        },
                    },
                },
            },

            plugins: {
                legend: { display: false },
                [shadingArea.id]: shadingArea,
                tooltip: {
                    intersect: false,
                    yAlign: 'bottom',
                    displayColors: false,
                    padding: { top: 8, bottom: 8, left: 12, right: 12 },
                    cornerRadius: 8,
                    titleFont: { size: 11, family: FONT_FAMILY },
                    bodyFont: { size: 12, family: FONT_FAMILY, weight: '500' },
                    callbacks: {
                        title(items) {
                            const d = new Date(items[0].label);
                            return format(d, 'MMM d, yyyy');
                        },
                        label(item) {
                            if (item.datasetIndex === 0) return item.formattedValue ? `Care Score: ${item.formattedValue}` : null;
                            if (item.datasetIndex === 1) return item.formattedValue ? `Scheduled: ${item.formattedValue}` : null;
                            return null;
                        },
                    },
                    backgroundColor(ctx) {
                        return ctx.tooltip.dataPoints[0].datasetIndex === 1
                            ? theme.chartPrimary
                            : theme.chartTooltipBg;
                    },
                },
            },
        };

        const plugins = [shadingArea, todayLine];

        return { data, options, plugins };
    }, [raw, isSuccess, theme]);

    return {
        isLoading,
        isEmpty: isSuccess && !raw,
        chartProps: result,
    };
}

