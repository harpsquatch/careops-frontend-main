import React from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';

const Pill = styled.span`
    padding: ${S.xs} ${S.sm};
    background: ${({ $bg, theme }) => $bg || theme.badgeBg};
    border-radius: 42.58px;
    backdrop-filter: blur(4.72px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${S.md};
`;

const Label = styled.span`
    color: ${({ $color, theme }) => $color || theme.textSecondary};
    font-size: ${F.sm};
    font-family: ${FONT_FAMILY};
    font-weight: ${W.medium};
    white-space: nowrap;
`;

const Badge = ({ children, bg, color, onClick, style, ...props }) => (
    <Pill $bg={bg} $color={color} onClick={onClick} style={style} {...props}>
        <Label $color={color}>{children}</Label>
    </Pill>
);

export default Badge;
