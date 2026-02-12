import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FONT_FAMILY, F, W } from './constants';
import TextInput from './atoms/TextInput';
import FormLabel from './atoms/FormLabel';
import { PillButtonTall } from './atoms/PillButton';
import { login } from '../services/authService';
import logoDark from '../static/images/logo-darkbg.png';

/* ─── animations ─── */

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
`;

const fadeOutContent = keyframes`
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(-40px); }
`;

const shimmer = keyframes`
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`;

/* ─── layout — pure overlay, no map ─── */

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 9999;
    font-family: ${FONT_FAMILY};
    pointer-events: ${({ $exiting }) => $exiting ? 'none' : 'auto'};
`;

const Vignette = styled.div`
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 1;
    transition: opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1);
    background:
        linear-gradient(to right,
            rgba(5, 5, 8, 0.88) 0%,
            rgba(5, 5, 8, 0.65) 25%,
            rgba(5, 5, 8, 0.2) 45%,
            transparent 60%),
        linear-gradient(to top,
            rgba(5, 5, 8, 0.7) 0%,
            transparent 30%),
        linear-gradient(to bottom,
            rgba(5, 5, 8, 0.5) 0%,
            transparent 20%);

    ${({ $exiting }) => $exiting && css`
        opacity: 0;
    `}
`;

const ContentLayer = styled.div`
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px;
    max-width: 480px;

    ${({ $exiting }) => $exiting && css`
        animation: ${fadeOutContent} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `}
`;

const LogoImg = styled.img`
    height: 40px;
    width: auto;
    margin-bottom: 24px;
    animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both;
`;

const Title = styled.h1`
    font-size: 42px;
    font-weight: ${W.semibold};
    color: #fff;
    letter-spacing: -0.5px;
    line-height: 1.15;
    margin-bottom: 12px;
    animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
`;

const Subtitle = styled.p`
    font-size: ${F.md};
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.6;
    margin-bottom: 36px;
    animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both;
`;

const LoginLabel = styled(FormLabel)`
    margin-bottom: -4px;

    font-weight: ${W.medium};
    color: ${({ theme }) => theme.textSecondary};
    font-size: ${F.md};
`;

const LoginInput = styled(TextInput)`
    background: ${({ theme }) => theme.textInputBg};
    backdrop-filter: blur(10px);
    padding: 16px 32px;
    border-color: ${({ theme }) => theme.textInputBorder};
    color: ${({ theme }) => theme.textInputText};
    
    &:focus-visible {
        border-color: ${({ theme }) => theme.textInputFocusBorder};
        color: ${({ theme }) => theme.textInputFocusText};
        background: ${({ theme }) => theme.textInputFocusBg};

    }
`;

const LoginButton = styled(PillButtonTall)`
    margin-top: 8px;
    padding: 16px 32px;
`;

const BtnText = styled.span`
    ${({ $loading }) => $loading && css`
        background: linear-gradient(90deg, #fff 25%, rgba(255,255,255,0.3) 50%, #fff 75%);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: ${shimmer} 1.5s infinite;
    `}
`;

const ErrorMsg = styled.p`
    font-size: ${F.xs};
    color: #E57373;
    animation: ${fadeUp} 0.3s ease;
`;

const BottomBar = styled.div`
    position: absolute;
    bottom: 32px;
    left: 80px;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 24px;
    animation: ${fadeUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both;

    ${({ $exiting }) => $exiting && css`
        animation: ${fadeOutContent} 0.8s ease forwards;
    `}
`;

const BottomText = styled.span`
    font-size: 11px;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 1px;
    text-transform: uppercase;
`;

const BottomDot = styled.span`
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
`;

/* ─── component — just UI overlay, map is behind ─── */

const LoginScreen = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [exiting, setExiting] = useState(false);
    const [gone, setGone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setError('Email is required'); return; }
        if (!password.trim()) { setError('Password is required'); return; }

        setError('');
        setLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            const msg = err?.response?.data?.detail || 'Invalid email or password';
            setError(msg);
            setLoading(false);
            return;
        }

        setLoading(false);
        setExiting(true);

        /* let the vignette fade finish (1.8s), then hand off */
        setTimeout(() => {
            setGone(true);
            onLogin({ email });
        }, 2000);
    };

    if (gone) return null;

    return (
        <Overlay $exiting={exiting}>
            <Vignette $exiting={exiting} />

            <ContentLayer $exiting={exiting}>

                <LogoImg src={logoDark} alt="CareOps" />

                <Title>Care.<br />Monitor.<br />Coordinate.</Title>
                <Form onSubmit={handleSubmit}>
                    <LoginLabel>Email</LoginLabel>
                    <LoginInput
                        type="email"
                        placeholder="name@organization.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        autoComplete="email"
                        autoFocus
                    />

                    <LoginLabel>Password</LoginLabel>
                    <LoginInput
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        autoComplete="current-password"
                    />

                    {error && <ErrorMsg>{error}</ErrorMsg>}

                    <LoginButton type="submit" disabled={loading}>
                        <BtnText $loading={loading}>
                            {loading ? 'Authenticating…' : 'Sign In'}
                        </BtnText>
                    </LoginButton>
                </Form>
            </ContentLayer>

            <BottomBar $exiting={exiting}>

                <BottomText>CareOps Platform</BottomText>
                <BottomDot />
                <BottomText>2026</BottomText>
            </BottomBar>
        </Overlay>
    );
};

export default LoginScreen;
