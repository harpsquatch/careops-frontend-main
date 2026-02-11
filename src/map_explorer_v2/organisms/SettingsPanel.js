import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S } from '../constants';
import { Button, FormLabel } from '../atoms';
import { PanelHeader, FormField, Counter } from '../molecules';

/* ─── Organism layout ─── */

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    font-family: ${FONT_FAMILY};
`;

const Body = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: ${S.xxl};
    display: flex;
    flex-direction: column;
    gap: ${S.xl};
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${S.xs};
`;

const Footer = styled.div`
    padding: ${S.lg} ${S.xxl};
    border-top: 1px solid ${({ theme }) => theme.borderLight};
    display: flex;
    justify-content: flex-end;
    gap: ${S.md};
`;

/* ─── Component ─── */

const SettingsPanel = ({ userDetails, onSave, onClose, isSaving }) => {
    const [accountName, setAccountName] = useState('');
    const [accountEmail, setAccountEmail] = useState('');
    const [notifyCounter, setNotifyCounter] = useState(0);

    useEffect(() => {
        if (userDetails) {
            setAccountName(userDetails.account_name || '');
            setAccountEmail(userDetails.email || '');
            setNotifyCounter(userDetails.notify_days || 0);
        }
    }, [userDetails]);

    const handleReset = () => {
        if (userDetails) {
            setAccountName(userDetails.account_name || '');
            setAccountEmail(userDetails.email || '');
            setNotifyCounter(userDetails.notify_days || 0);
        }
    };

    const handleSave = () => {
        if (onSave) {
            onSave({ account_name: accountName, notify_days: notifyCounter });
        }
    };

    return (
        <Wrapper>
            <PanelHeader title="Settings" onClose={onClose} />

            <Body>
                <FormField
                    label="Account Name"
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Enter account name"
                />

                <FormField
                    label="Email"
                    type="email"
                    value={accountEmail}
                    disabled
                    placeholder="Email address"
                />

                <FieldGroup>
                    <FormLabel>Notify Members</FormLabel>
                    <Counter
                        value={notifyCounter}
                        onIncrement={() => notifyCounter < 14 && setNotifyCounter((c) => c + 1)}
                        onDecrement={() => notifyCounter > 1 && setNotifyCounter((c) => c - 1)}
                        disableIncrement={notifyCounter >= 14}
                        disableDecrement={notifyCounter <= 1}
                        hint="days before due date"
                    />
                </FieldGroup>
            </Body>

            <Footer>
                <Button variant="secondary" onClick={handleReset}>Reset</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving…' : 'Save'}
                </Button>
            </Footer>
        </Wrapper>
    );
};

export default SettingsPanel;
