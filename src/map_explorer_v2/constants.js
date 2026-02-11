import patientsIcon from '../static/images/patients.png';
import settingsIcon from '../static/images/settings.png';
import supportIcon from '../static/images/support.png';

export const MAPBOX_STYLE = 'mapbox://styles/harpsquatch/cmlfzl7i3002001sc1unpao8c';

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
    xs:   '11px',    // pills, muted captions
    sm:   '12px',    // badges, body text, subtitles, labels
    md:   '14px',    // base text, inputs, buttons, chips
    lg:   '16px',    // names, section headers
    xl:   '18px',    // panel titles, counter values
    xxl:  '20px',    // large titles, icon buttons
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

