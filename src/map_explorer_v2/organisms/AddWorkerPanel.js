import React, { useState } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S } from '../constants';
import { FormLabel } from '../atoms';
import { PillButtonTall } from '../atoms/PillButton';
import { PanelHeader, FormField } from '../molecules';

/* ─── Layout ─── */

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    font-family: ${FONT_FAMILY};
`;

const Body = styled.div`
    flex: 1 1 auto;
    padding: ${S.xxl};
    display: flex;
    flex-direction: column;
    gap: ${S.lg};
`;

const Footer = styled.div`
    flex-shrink: 0;
    padding: ${S.lg} ${S.xxl};
    border-top: 1px solid ${({ theme }) => theme.border};
    display: flex;
    justify-content: flex-end;
    gap: ${S.md};
`;

/* ─── Component ─── */

const AddWorkerPanel = ({ worker, onSave, onClose, isSaving }) => {
    const isEdit = !!worker;

    const [fullName, setFullName] = useState(worker?.full_name || '');
    const [email, setEmail] = useState(worker?.email || '');

    const handleReset = () => {
        setFullName(worker?.full_name || '');
        setEmail(worker?.email || '');
    };

    const handleSave = () => {
        if (!email.trim()) return;
        const payload = {
            full_name: fullName.trim(),
            email: email.trim(),
        };
        if (isEdit) payload.uid = worker.uid;
        onSave?.(payload);
    };

    const isValid = email.trim().length > 0;

    return (
        <Wrapper>
            <PanelHeader title={isEdit ? 'Edit Worker' : 'Add Worker'} onClose={onClose} />

            <Body>
                <FormField
                    label="Full Name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter worker name"
                />

                <FormField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nurse@example.com"
                />
            </Body>

            <Footer>
                <PillButtonTall $secondary onClick={handleReset}>Reset</PillButtonTall>
                <PillButtonTall onClick={handleSave} disabled={!isValid || isSaving}>
                    {isSaving ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add Worker')}
                </PillButtonTall>
            </Footer>
        </Wrapper>
    );
};

export default AddWorkerPanel;

