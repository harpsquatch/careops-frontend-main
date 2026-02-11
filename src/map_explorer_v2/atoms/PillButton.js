import styled, { css } from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';

const base = css`
    border-radius: 38px;
    font-family: ${FONT_FAMILY};
    font-weight: ${W.semibold};
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s, transform 0.1s;

    background: ${({ $completed, $secondary, theme }) =>
        $secondary ? theme.surface
        : $completed ? theme.completedBg
        : theme.btnBg};

    color: ${({ $completed, $secondary, theme }) =>
        $secondary ? theme.textSecondary
        : $completed ? theme.completedColor
        : theme.btnColor};

    border: ${({ $secondary, theme }) =>
        $secondary ? `1px solid ${theme.border}` : 'none'};

    &:hover:not(:disabled) {
        background: ${({ $completed, $secondary, theme }) =>
            $secondary ? theme.surfaceHover
            : $completed ? theme.completedHoverBg
            : theme.btnHoverBg};
    }

    &:active { transform: scale(0.97); }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const PillButton = styled.button`
    ${base}
    padding: ${S.sm} ${S.md};
    font-size: ${F.xs};
`;

export const PillButtonTall = styled.button`
    ${base}
    padding: ${S.sm} ${S.xl};
    font-size: ${F.md};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
`;

export default PillButton;
