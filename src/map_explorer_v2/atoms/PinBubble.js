import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';

const PinBubble = styled.div`
    font-family: ${FONT_FAMILY};
    font-size: ${F.md};
    font-weight: ${W.semibold};
    padding: ${S.sm} ${S.lg};
    border-radius: 24px;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;

    background: ${(p) => (p.$active ? p.theme.primary : p.theme.bg)};
    color: ${(p) => (p.$active ? p.theme.btnColor : p.theme.text)};
    border: 1.5px solid ${(p) => (p.$active ? p.theme.primary : p.theme.border)};
    transform: ${(p) => (p.$active ? 'scale(1.05)' : 'scale(1)')};
    z-index: ${(p) => (p.$active ? 10 : 1)};

    &:hover {
        box-shadow: 0 4px 14px ${({ theme }) => theme.cardShadow};
        transform: scale(1.05);
    }
`;

export default PinBubble;
