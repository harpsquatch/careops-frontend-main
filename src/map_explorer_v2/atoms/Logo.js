import React from 'react';
import styled, { useTheme } from 'styled-components';
import logoDark from '../../static/images/logo-darkbg.png';
import logoLight from '../../static/images/logo-lightbg.png';

const Img = styled.img`
    height: 32px;
    width: auto;
    display: block;
`;

const Logo = (props) => {
    const theme = useTheme();
    // Check theme mode - default to light if mode is not set
    const isDark = theme.mode === 'dark' || (!theme.mode && theme.bg?.includes('rgba(0, 0, 0'));
    const logoSrc = isDark ? logoDark : logoLight;
    return <Img key={isDark ? 'dark' : 'light'} src={logoSrc} alt="CareOps" {...props} />;
};

export default Logo;

