import React from 'react';
import styled from 'styled-components';
import { Logo } from '../atoms';
import { S } from '../constants';

/* Auto-layout frame — sits in the grid, takes only its natural height */
const Wrapper = styled.div`
    align-self: start;
    width: 100%;
    display: flex;
    align-items: center;
    background: transparent;
    z-index: 10;
    pointer-events: none;

    & > * {
        pointer-events: auto;
    }
`;

const LogoArea = styled.div`
    display: flex;
    align-items: center;
    padding: ${S.md} ${S.xl};
`;

const ActionArea = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${S.md};
    padding: ${S.md} ${S.xl};
`;

const TopBar = ({ children }) => (
    <Wrapper>
        <LogoArea>
            <Logo />
        </LogoArea>
        <ActionArea>
            {children}
        </ActionArea>
    </Wrapper>
);

export default TopBar;
