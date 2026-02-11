import patientsIcon from '../static/images/patients.png';
import settingsIcon from '../static/images/settings.png';
import supportIcon from '../static/images/support.png';

export const MAPBOX_STYLE_DARK = 'mapbox://styles/harpsquatch/cmlfzl7i3002001sc1unpao8c';
export const MAPBOX_STYLE_LIGHT = 'mapbox://styles/harpsquatch/cmli72dbl007101sc3k119jx3';

export const DEFAULT_VIEW = {
    longitude: -98.5,
    latitude: 39.8,
    zoom: 3,
};

export const FONT_FAMILY = "'SF Pro', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";

/* ─── Spacing tokens (4px grid) ─── */

export const S = {
    xs:   '4px',     // tight gaps, badge rows, decorative
    sm:   '8px',     // input/chip padding, small gaps
    md:   '12px',    // card padding, list gaps, standard gap
    lg:   '16px',    // panel sections, modal internal
    xl:   '20px',    // panel edge padding, panel header
    xxl:  '24px',    // modal body padding, large sections
};

/* ─── Type scale ─── */

export const F = {
    xs:   '12px',    // pills, muted captions
    sm:   '14px',    // badges, body text, subtitles, labels
    md:   '16px',    // base text, inputs, buttons, chips
    lg:   '18px',    // names, section headers
    xl:   '20px',    // panel titles, counter values
    xxl:  '24px',    // large titles, icon buttons
};

export const W = {
    regular:  '400',
    medium:   '500',
    semibold: '600',
};

/* ─── Chart Palette ─── */

export const CHART = {
    primary:        '#007bff',
    primaryFaded:   'rgba(0, 123, 255, 0.35)',
    primaryGhost:   'rgba(0, 123, 255, 0.05)',
    shadingFill:    'rgba(0, 123, 255, 0.12)',
    tickColor:      '#9BA298',
    gridColor:      'rgba(155, 162, 152, 0.1)',
    todayStroke:    'rgba(0, 0, 0, 0.25)',
    todayLabel:     'rgba(0, 0, 0, 0.4)',
    tooltipBg:      'rgba(0, 0, 0, 0.7)',
    milestoneBg:    '#FFFFFF',
};

/* ─── Care Level options + badge colors ─── */

export const CARE_LEVELS = [
    { value: 'Skilled',       label: 'Skilled',         bg: '#D4EDDA', color: '#155724', darkBg: '#1A3A2A', darkColor: '#6BCB77' },
    { value: 'Acute',         label: 'Acute',           bg: '#F8D7DA', color: '#721C24', darkBg: '#3A1A1A', darkColor: '#E57373' },
    { value: 'Intermediate',  label: 'Intermediate',    bg: '#FFF3CD', color: '#856404', darkBg: '#3A3018', darkColor: '#FFD93D' },
    { value: 'Palliative',    label: 'Palliative',      bg: '#E2D9F3', color: '#4A235A', darkBg: '#2D1F3D', darkColor: '#BB86FC' },
    { value: 'Rehab',         label: 'Rehab',           bg: '#D1ECF1', color: '#0C5460', darkBg: '#13343A', darkColor: '#4DD0E1' },
    { value: 'Observation',   label: 'Observation',     bg: '#FFE0B2', color: '#7B3F00', darkBg: '#3A2A14', darkColor: '#FFB74D' },
];

export const CARE_LEVEL_MAP = Object.fromEntries(
    CARE_LEVELS.map((l) => [l.value, l])
);

/* ─── Navigation Items ─── */

export const NAV_ITEMS = [
    {
        icon: patientsIcon,
        label: 'Nurse Workers',
        action: 'openWorkersPanel',
    },
    {
        icon: settingsIcon,
        label: 'Account Settings',
        action: 'settings',
    },
    {
        icon: supportIcon,
        label: 'Technical Support',
        action: 'support',
    },
];

