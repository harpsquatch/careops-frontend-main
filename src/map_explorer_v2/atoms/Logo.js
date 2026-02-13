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
    const isDark = theme.mode === 'dark';
    // dark mode → light logo (logo-lightbg.png), light mode → dark logo (logo-darkbg.png)
    const logoSrc = isDark ? logoLight : logoDark;
    return <Img key={isDark ? 'dark' : 'light'} src={logoSrc} alt="CareOps" {...props} />;
};

export default Logo;

