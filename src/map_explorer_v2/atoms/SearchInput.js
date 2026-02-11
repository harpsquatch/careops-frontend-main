import React from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import { RiSearchLine } from 'react-icons/ri';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    gap: ${S.sm};
    padding: ${S.md};
    border-radius: 9999px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ $transparent, theme }) => $transparent ? 'transparent' : theme.cardBg};
    backdrop-filter: ${({ $transparent, theme }) => $transparent ? 'none' : theme.cardBlur};
    -webkit-backdrop-filter: ${({ $transparent, theme }) => $transparent ? 'none' : theme.cardBlur};
    width: 100%;
`;

const Input = styled.input`
    border: none;
    outline: none;
    font-family: ${FONT_FAMILY};
    font-size: ${F.md};
    font-weight: ${W.regular};
    color: ${({ theme }) => theme.text};
    width: 100%;
    height: 100%;
    background: transparent;

    &::placeholder {
        color: ${({ theme }) => theme.textMuted};
    }
`;

const IconWrap = styled.div`
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.textMuted};
    font-size: ${F.lg};
    flex-shrink: 0;
`;

const SearchInput = ({ value, onChange, placeholder = 'Search...', transparent = false, ...rest }) => (
    <Wrapper $transparent={!!transparent}>
        <IconWrap><RiSearchLine /></IconWrap>
        <Input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...rest}
        />
    </Wrapper>
);

export default SearchInput;
