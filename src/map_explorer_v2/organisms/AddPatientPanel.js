import React, { useState } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S } from '../constants';
import { Button, FormLabel, SelectInput } from '../atoms';
import { PanelHeader, FormField, Counter } from '../molecules';

/* ─── Service-type options (mirrored from AddField.tsx) ─── */

const SERVICE_OPTIONS = [
    { value: 1, label: 'Skilled Nursing' },
    { value: 2, label: 'Physical Therapy' },
    { value: 3, label: 'Remote Monitoring' },
    { value: 4, label: 'Occupational Therapy' },
    { value: 5, label: 'Speech Therapy' },
    { value: 6, label: 'Wound Care' },
    { value: 7, label: 'Palliative Care' },
    { value: 8, label: 'Post-Surgical Care' },
];

/* ─── Layout (matches SettingsPanel) ─── */

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

const AddPatientPanel = ({ onSave, onClose, isSaving }) => {
    const [patientName, setPatientName] = useState('');
    const [address, setAddress] = useState('');
    const [careLevel, setCareLevel] = useState('');
    const [serviceType, setServiceType] = useState(1);
    const [scheduledVisits, setScheduledVisits] = useState(0);
    const [notes, setNotes] = useState('');

    const handleReset = () => {
        setPatientName('');
        setAddress('');
        setCareLevel('');
        setServiceType(1);
        setScheduledVisits(0);
        setNotes('');
    };

    const handleSave = () => {
        if (!patientName.trim()) return;
        if (onSave) {
            onSave({
                field_name: patientName.trim(),
                address: address.trim(),
                acres: careLevel.trim() || 'Skilled',
                service_type: serviceType,
                scheduled_visits: scheduledVisits,
                notes: notes.trim(),
                active: true,
                lat: 0,
                lng: 0,
            });
        }
    };

    const isValid = patientName.trim().length > 0;

    return (
        <Wrapper>
            <PanelHeader title="Add Patient" onClose={onClose} />

            <Body>
                <FormField
                    label="Patient Name"
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                />

                <FormField
                    label="Address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter patient address"
                />

                <FieldGroup>
                    <FormLabel>Service Type</FormLabel>
                    <SelectInput
                        value={serviceType}
                        onChange={(e) => setServiceType(Number(e.target.value))}
                    >
                        {SERVICE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </SelectInput>
                </FieldGroup>

                <FormField
                    label="Care Level"
                    type="text"
                    value={careLevel}
                    onChange={(e) => setCareLevel(e.target.value)}
                    placeholder="e.g. Skilled, Acute, Intermediate"
                />

                <FieldGroup>
                    <FormLabel>Scheduled Visits (per month)</FormLabel>
                    <Counter
                        value={scheduledVisits}
                        onIncrement={() => setScheduledVisits((c) => c + 1)}
                        onDecrement={() => scheduledVisits > 0 && setScheduledVisits((c) => c - 1)}
                        disableIncrement={scheduledVisits >= 30}
                        disableDecrement={scheduledVisits <= 0}
                        hint="visits / month"
                    />
                </FieldGroup>

                <FormField
                    label="Care Notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any notes"
                />
            </Body>

            <Footer>
                <Button variant="secondary" onClick={handleReset}>Reset</Button>
                <Button onClick={handleSave} disabled={!isValid || isSaving}>
                    {isSaving ? 'Adding…' : 'Add Patient'}
                </Button>
            </Footer>
        </Wrapper>
    );
};

export default AddPatientPanel;

