import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { selectedUser } from '../store/selectors';
import { useHayVisionFields, useAddHayFields } from '../hooks/usePatients';
import { useWorkers, useUpdateWorker } from '../hooks/useWorkers';
import { useGetAccountDetails, useUpdateAccountDetails } from '../hooks/useAccounts';
import { getAllEvents, useUpdateEvent } from '../hooks/useVisits';
import { useQuery } from 'react-query';
import { DEFAULT_VIEW } from './constants';
import { toast } from 'react-toastify';

export default function useMapExplorerV2() {
    const mapRef = useRef(null);
    const didFitBounds = useRef(false);

    const [viewState, setViewState] = useState(DEFAULT_VIEW);
    const [selectedId, setSelectedId] = useState(null);
    const [workersPanelOpen, setWorkersPanelOpen] = useState(false);
    const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
    const [supportPanelOpen, setSupportPanelOpen] = useState(false);
    const [notifyVisit, setNotifyVisit] = useState(null); // visit being notified
    const [addPatientPanelOpen, setAddPatientPanelOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const toggleTheme = useCallback(() => setIsDark((v) => !v), []);


    const selectedAccId = selectedUser();
    const { isLoading, data: hayFields } = useHayVisionFields(selectedAccId);
    const patients = useMemo(() => hayFields || [], [hayFields]);

    const onMove = (evt) => setViewState(evt.viewState);

    // Fit map bounds to all patient locations
    const fitToPatients = useCallback(() => {
        const map = mapRef.current;
        if (!map || patients.length === 0) return;

        const valid = patients
            .filter((p) => p.lat && p.lng)
            .map((p) => ({ lat: p.lat, lng: p.lng }));

        if (valid.length === 0) return;

        if (valid.length === 1) {
            map.flyTo({ center: [valid[0].lng, valid[0].lat], zoom: 13, duration: 2000, essential: true });
            return;
        }

        const lngs = valid.map((p) => p.lng);
        const lats = valid.map((p) => p.lat);
        map.fitBounds(
            [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
            { padding: 80, duration: 2000, essential: true }
        );
    }, [patients]);

    // Auto-fit on first data load
    useEffect(() => {
        if (!didFitBounds.current && mapRef.current && patients.length > 0) {
            fitToPatients();
            didFitBounds.current = true;
        }
    }, [patients, fitToPatients]);

    const onMapLoad = useCallback(() => {
        if (!didFitBounds.current && patients.length > 0) {
            fitToPatients();
            didFitBounds.current = true;
        }
    }, [fitToPatients, patients]);

    // Click a pin -> select + fly to it
    const handlePinClick = useCallback((patient) => {
        setSelectedId(patient.id);
        mapRef.current?.flyTo({
            center: [patient.lng, patient.lat],
            zoom: 14,
            duration: 1200,
            essential: true,
        });
    }, []);

    // Workers
    const { isSuccess: isWorkersSuccess, data: workers } = useWorkers();
    const updateWorker = useUpdateWorker();

    const handleWorkerToggle = useCallback((worker, category) => {
        const data = { worker, category, id: worker.uid };
        updateWorker.mutateAsync(data).catch((err) => {
            toast.error(err.message);
        });
    }, [updateWorker]);

    const openWorkersPanel = useCallback(() => setWorkersPanelOpen(true), []);
    const closeWorkersPanel = useCallback(() => setWorkersPanelOpen(false), []);

    // Settings
    const { data: userDetails } = useGetAccountDetails();
    const updateAccountDetails = useUpdateAccountDetails();

    const openSettingsPanel = useCallback(() => setSettingsPanelOpen(true), []);
    const closeSettingsPanel = useCallback(() => setSettingsPanelOpen(false), []);

    // Support
    const openSupportPanel = useCallback(() => setSupportPanelOpen(true), []);
    const closeSupportPanel = useCallback(() => setSupportPanelOpen(false), []);

    // Patient card click — select + fly to
    const handlePatientCardClick = useCallback((patient) => {
        setSelectedId(patient.id);
        if (patient.lat && patient.lng) {
            mapRef.current?.flyTo({
                center: [patient.lng, patient.lat],
                zoom: 14,
                duration: 1200,
                essential: true,
            });
        }
    }, []);

    const handleSettingsSave = useCallback(async (data) => {
        try {
            await updateAccountDetails.mutateAsync({ ...data, uid: selectedAccId });
            toast.success('Settings saved');
            setSettingsPanelOpen(false);
        } catch (err) {
            toast.error(err.message || 'Failed to save settings');
        }
    }, [updateAccountDetails, selectedAccId]);

    // ─── Events / Visits ───
    const { data: allEvents } = useQuery('allEvents', getAllEvents, {
        onError: (err) => console.error('Failed to fetch events', err),
    });
    const updateEvent = useUpdateEvent();

    // Get selected patient object
    const selectedPatient = patients.find((p) => p.id === selectedId) || null;

    // Filter visits for the selected patient
    const patientVisits = useMemo(() => {
        if (!selectedId || !allEvents) return [];
        return allEvents.filter((ev) => ev.field_id === selectedId);
    }, [selectedId, allEvents]);

    // Notify workers for a visit
    const handleNotifyVisit = useCallback((visit) => {
        setNotifyVisit(visit);
    }, []);
    const closeNotifyPanel = useCallback(() => setNotifyVisit(null), []);
    
    const handleNotifySelected = useCallback((visit, selectedWorkers) => {
        // TODO: Implement actual notification API call here
        console.log('Notifying workers:', selectedWorkers, 'for visit:', visit);
        toast.success(`Notified ${selectedWorkers.length} worker(s)`);
        setNotifyVisit(null);
    }, []);

    // Add Patient
    const addHayFields = useAddHayFields();
    const openAddPatientPanel = useCallback(() => setAddPatientPanelOpen(true), []);
    const closeAddPatientPanel = useCallback(() => setAddPatientPanelOpen(false), []);

    const handleAddPatient = useCallback(async (patientData) => {
        try {
            await addHayFields.mutateAsync({ ...patientData, uid: selectedAccId });
            toast.success('Patient added successfully');
            setAddPatientPanelOpen(false);
        } catch (err) {
            toast.error(err?.message || 'Failed to add patient');
        }
    }, [addHayFields, selectedAccId]);

    const handleToggleVisit = useCallback((visit, newStatus) => {
        const payload = { id: visit.id, status: newStatus };
        if (newStatus === 2) {
            const now = new Date();
            payload.completed_date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        }
        updateEvent.mutateAsync(payload).catch((err) => {
            toast.error(err?.message || 'Failed to update visit');
        });
    }, [updateEvent]);

    return {
        mapRef,
        viewState,
        onMove,
        onMapLoad,
        patients,
        isLoading,
        selectedId,
        setSelectedId,
        selectedPatient,
        handlePinClick,
        // Workers
        workersPanelOpen,
        openWorkersPanel,
        closeWorkersPanel,
        workers: isWorkersSuccess ? workers : [],
        handleWorkerToggle,
        // Settings
        settingsPanelOpen,
        openSettingsPanel,
        closeSettingsPanel,
        userDetails,
        handleSettingsSave,
        isSavingSettings: updateAccountDetails.isLoading,
        // Support
        supportPanelOpen,
        openSupportPanel,
        closeSupportPanel,
        // Patients
        handlePatientCardClick,
        // Add Patient
        addPatientPanelOpen,
        openAddPatientPanel,
        closeAddPatientPanel,
        handleAddPatient,
        isAddingPatient: addHayFields.isLoading,
        // Visits
        patientVisits,
        handleToggleVisit,
        // Notify
        notifyVisit,
        handleNotifyVisit,
        closeNotifyPanel,
        handleNotifySelected,
        // Theme
        isDark,
        toggleTheme,
    };
}
