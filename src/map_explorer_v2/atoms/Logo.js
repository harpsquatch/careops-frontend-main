import React from 'react';
import styled, { useTheme } from 'styled-components';
import logoDarkMode from '../../static/images/logo-darkmode.png';
import logoLightMode from '../../static/images/logo-lightmode.png';

const Img = styled.img`
    height: 32px;
    width: auto;
    display: block;
`;

const Logo = (props) => {
    const theme = useTheme();
    const isDark = theme.mode === 'dark';
    const logoSrc = isDark ? logoDarkMode : logoLightMode;
    return <Img key={isDark ? 'dark' : 'light'} src={logoSrc} alt="CareOps" {...props} />;
};

export default Logo;
