import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W, CARE_LEVELS } from '../constants';
import { FormLabel, SelectInput, Avatar } from '../atoms';
import { PillButtonTall } from '../atoms/PillButton';
import { PanelHeader, FormField, Counter } from '../molecules';
import { uploadAvatar } from '../../services/supabaseStorage';
import { useToast } from '../contexts/ToastContext';

/* ─── Service-type options ─── */

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

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${S.xs};
`;

const Footer = styled.div`
    flex-shrink: 0;
    padding: ${S.lg} ${S.xxl};
    border-top: 1px solid ${({ theme }) => theme.border};
    display: flex;
    justify-content: flex-end;
    gap: ${S.md};
`;

/* ─── Avatar upload area ─── */

const AvatarSection = styled.div`
    display: flex;
    align-items: center;
    gap: ${S.lg};
`;

const AvatarWrapper = styled.div`
    position: relative;
    cursor: pointer;
    flex-shrink: 0;

    &:hover > div {
        opacity: 1;
    }
`;

const AvatarOverlay = styled.div`
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    color: #fff;
    font-size: ${F.xs};
    font-weight: ${W.semibold};
    font-family: ${FONT_FAMILY};
    pointer-events: none;
`;

const HiddenInput = styled.input`
    display: none;
`;

const AvatarHint = styled.span`
    color: ${({ theme }) => theme.textSecondary};
    font-size: ${F.sm};
    font-family: ${FONT_FAMILY};
`;

/* const LocationHint = styled.span`
    color: ${({ theme }) => theme.textMuted};
    font-size: ${F.xs};
    font-family: ${FONT_FAMILY};
`; */

const LatLngRow = styled.div`
    display: flex;
    gap: ${S.md};
    & > * { flex: 1; }
`;

/* ─── Component ─── */

const AddPatientPanel = ({ patient, onSave, onClose, isSaving }) => {
    const { toast } = useToast();
    const isEdit = !!patient;
    const fileRef = useRef(null);

    const [patientName, setPatientName] = useState(patient?.field_name || '');
    const [description, setDescription] = useState(patient?.description || '');
    const [lat, setLat] = useState(patient?.lat || '');
    const [lng, setLng] = useState(patient?.lng || '');
    const [careLevel, setCareLevel] = useState(patient?.acres || 'Skilled');
    const [serviceType, setServiceType] = useState(patient?.service_type || 1);
    const [scheduledVisits, setScheduledVisits] = useState(patient?.scheduled_visits || 0);
    const [notes, setNotes] = useState(patient?.notes || '');
    const [avatarUrl, setAvatarUrl] = useState(patient?.avatar_url || '');
    const [uploading, setUploading] = useState(false);

    const handleReset = () => {
        setPatientName(patient?.field_name || '');
        setDescription(patient?.description || '');
        setLat(patient?.lat || '');
        setLng(patient?.lng || '');
        setCareLevel(patient?.acres || 'Skilled');
        setServiceType(patient?.service_type || 1);
        setScheduledVisits(patient?.scheduled_visits || 0);
        setNotes(patient?.notes || '');
        setAvatarUrl(patient?.avatar_url || '');
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side preview immediately
        const preview = URL.createObjectURL(file);
        setAvatarUrl(preview);

        setUploading(true);
        try {
            const url = await uploadAvatar(file, 'patients');
            setAvatarUrl(url);
        } catch (err) {
            toast.error(err?.message || 'Image upload failed');
            // Revert to previous URL on failure
            setAvatarUrl(patient?.avatar_url || '');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = () => {
        if (!patientName.trim()) return;
        const payload = {
            field_name: patientName.trim(),
            description: description.trim(),
            address: patient?.address || '',
            acres: careLevel.trim() || 'Skilled',
            service_type: serviceType,
            scheduled_visits: scheduledVisits,
            notes: notes.trim(),
            active: patient?.active ?? true,
            lat: parseFloat(lat) || 0,
            lng: parseFloat(lng) || 0,
            avatar_url: avatarUrl,
        };
        if (isEdit) payload.id = patient.id;
        onSave?.(payload);
    };

    const isValid = patientName.trim().length > 0 && !uploading;

    return (
        <Wrapper>
            <PanelHeader title={isEdit ? 'Edit Patient' : 'Add Patient'} onClose={onClose} />

            <Body>
                {/* Avatar upload */}
                <FieldGroup>
                    <FormLabel>Photo</FormLabel>
                    <AvatarSection>
                        <AvatarWrapper onClick={() => fileRef.current?.click()}>
                            <Avatar src={avatarUrl || undefined} alt={patientName || 'Patient'} size={64} />
                            <AvatarOverlay>{uploading ? '...' : 'Edit'}</AvatarOverlay>
                        </AvatarWrapper>
                        <AvatarHint>Click to upload a profile photo</AvatarHint>
                        <HiddenInput
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </AvatarSection>
                </FieldGroup>

                <FormField
                    label="Patient Name"
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                />

                <FormField
                    label="Description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short clinical summary"
                />

                <FieldGroup>
                    <LatLngRow>
                        <FormField
                            label="Latitude"
                            type="text"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            placeholder="e.g. 40.7128"
                        />
                        <FormField
                            label="Longitude"
                            type="text"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                            placeholder="e.g. -74.0060"
                        />
                    </LatLngRow>
                </FieldGroup>

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

                <FieldGroup>
                    <FormLabel>Care Level</FormLabel>
                    <SelectInput
                        value={careLevel}
                        onChange={(e) => setCareLevel(e.target.value)}
                    >
                        {CARE_LEVELS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </SelectInput>
                </FieldGroup>

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
                <PillButtonTall $secondary onClick={handleReset}>Reset</PillButtonTall>
                <PillButtonTall onClick={handleSave} disabled={!isValid || isSaving}>
                    {isSaving ? (isEdit ? 'Saving…' : 'Adding…') : (isEdit ? 'Save Changes' : 'Add Patient')}
                </PillButtonTall>
            </Footer>
        </Wrapper>
    );
};

export default AddPatientPanel;
