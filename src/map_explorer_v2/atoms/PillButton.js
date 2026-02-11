import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';

const PillButton = styled.button`
    padding: ${S.xs} ${S.md};
    border: none;
    border-radius: 38px;
    font-size: ${F.xs};
    font-family: ${FONT_FAMILY};
    font-weight: ${W.semibold};
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s, transform 0.1s;

    background: ${({ $completed, theme }) =>
        $completed ? theme.completedBg : theme.btnBg};

    color: ${({ $completed, theme }) =>
        $completed ? theme.completedColor : theme.btnColor};

    &:hover {
        background: ${({ $completed, theme }) =>
            $completed ? theme.completedHoverBg : theme.btnHoverBg};
    }

    &:active {
        transform: scale(0.97);
    }
`;

export default PillButton;
