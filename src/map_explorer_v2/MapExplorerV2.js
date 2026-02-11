import React, { useState, useCallback, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { FONT_FAMILY, NAV_ITEMS, S } from './constants';
import { light, dark } from './themes';
import { TopBar, PatientPin } from './molecules';
import { MapboxMap, PatientsPanel, WorkersPanel, SettingsPanel, SupportPanel, VisitsPanel, NotifyWorkersPanel, AddPatientPanel, AddVisitPanel, NotesPanel } from './organisms';
import { NavChip, ThemeToggle } from './atoms';
import { ToastProvider } from './contexts/ToastContext';
import LoginScreen from './LoginScreen';
import useMapExplorerV2 from './useMapExplorerV2';
import { verifyToken, logout as clearToken } from '../services/authService';

const GlobalReset = createGlobalStyle`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { width: 100%; height: 100%; overflow: hidden; }
`;

/* Full-screen grid — all children overlap like Figma layers */
const Page = styled.div`
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-rows: 1fr;
    font-family: ${FONT_FAMILY};

    & > * {
        grid-row: 1;
        grid-column: 1;
    }
`;

/* Floating left panel — overlays the map */
const LeftPanel = styled.div`
    align-self: start;
    justify-self: start;
    z-index: 10;
    pointer-events: none;

    width: auto;
    max-height: 100vh;
    padding: 80px ${S.sm} ${S.sm} ${S.sm};   /* 80px top to clear the TopBar */

    & > * {
        pointer-events: auto;
    }
`;

const PanelContainer = styled.div`
    width: 380px;
    max-height: calc(100vh - 88px);
    overflow: visible;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
`;

const RightStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${S.sm};
    width: 380px;
    max-height: calc(100vh - 16px);
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
`;

/* Floating right panel — overlays the map */
const RightPanel = styled.div`
    align-self: end;
    justify-self: end;
    z-index: 10;
    pointer-events: none;

    width: auto;
    max-height: 100vh;
    padding: ${S.sm};   /* Bottom aligned, no top padding needed */

    & > * {
        pointer-events: auto;
    }
`;

/* ── Airbnb-style modal backdrop ── */
const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ModalCard = styled.div`
    width: 420px;
    max-height: 95vh;
    background: ${({ theme }) => theme.bg};
    backdrop-filter: ${({ theme }) => theme.bgBlur};
    border-radius: 16px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

const MapExplorerV2Content = ({ isDark, toggleTheme, authenticated, authChecked, onLogin, onLogout }) => {
    const {
        mapRef,
        viewState,
        onMove,
        onMapLoad,
        patients,
        selectedId,
        handlePinClick,
        workersPanelOpen,
        openWorkersPanel,
        closeWorkersPanel,
        workers,
        handleWorkerToggle,
        addWorkerPanelOpen,
        editingWorker,
        openAddWorkerPanel,
        closeAddWorkerPanel,
        handleSaveWorker,
        isSavingWorker,
        settingsPanelOpen,
        openSettingsPanel,
        closeSettingsPanel,
        userDetails,
        handleSettingsSave,
        isSavingSettings,
        supportPanelOpen,
        openSupportPanel,
        closeSupportPanel,
        handlePatientCardClick,
        selectedPatient,
        patientVisits,
        handleToggleVisit,
        notifyVisit,
        handleNotifyVisit,
        closeNotifyPanel,
        handleNotifySelected,
        editingPatient,
        addPatientPanelOpen,
        openAddPatientPanel,
        openEditPatientPanel,
        closeAddPatientPanel,
        handleAddPatient,
        handleDischargePatient,
        handleDeletePatient,
        isAddingPatient,
        addVisitPatient,
        openAddVisitPanel,
        closeAddVisitPanel,
        handleAddVisit,
        isAddingVisit,
        notesPatient,
        openNotesPanel,
        closeNotesPanel,
        handleSaveNotes,
        isSavingNotes,
    } = useMapExplorerV2(authenticated);

    return (
        <>
        <GlobalReset />
        <Page>
            {/* Layer 1 — full-screen map (always rendered) */}
            <MapboxMap mapRef={mapRef} viewState={viewState} onMove={onMove} onLoad={onMapLoad} isDark={isDark}>
                {authenticated && patients.map((patient) => (
                    <PatientPin
                        key={patient.id}
                        patient={patient}
                        isSelected={selectedId === patient.id}
                        onClick={handlePinClick}
                    />
                ))}
            </MapboxMap>

            {/* Login overlay — sits on top of the map when not authenticated */}
            {authChecked && !authenticated && <LoginScreen onLogin={onLogin} />}

            {/* Everything below only shows after login */}
            {authenticated && (
                <>
                    {/* Layer 2 — floating top bar */}
                    <TopBar>
                        {NAV_ITEMS.map((item, index) => {
                            const actions = {
                                openWorkersPanel,
                                settings: openSettingsPanel,
                                support: openSupportPanel,
                            };
                            return (
                                <NavChip
                                    key={index}
                                    icon={item.icon}
                                    label={item.label}
                                    onClick={actions[item.action] || undefined}
                                />
                            );
                        })}
                        <ThemeToggle isDark={isDark} onClick={toggleTheme} />
                    </TopBar>

                    {/* Layer 3 — floating patients panel on left */}
                    <LeftPanel>
                        <PanelContainer>
                            <PatientsPanel
                                patients={patients}
                                onPatientClick={handlePatientCardClick}
                                onAddPatient={openAddPatientPanel}
                                onEditPatient={openEditPatientPanel}
                                onAddVisit={openAddVisitPanel}
                                onDischargePatient={handleDischargePatient}
                                onDeletePatient={handleDeletePatient}
                                onOpenNotes={openNotesPanel}
                            />
                        </PanelContainer>
                    </LeftPanel>

                    {/* Layer 4 — floating right panel (when patient selected) */}
                    {selectedPatient && (
                        <RightPanel>
                            <RightStack>
                                <VisitsPanel
                                    patient={selectedPatient}
                                    visits={patientVisits}
                                    onToggleComplete={handleToggleVisit}
                                    onNotify={handleNotifyVisit}
                                />
                            </RightStack>
                        </RightPanel>
                    )}

                    {/* Modals */}
                    {workersPanelOpen && (
                        <Backdrop onClick={closeWorkersPanel}>
                            <ModalCard style={{ width: addWorkerPanelOpen ? 720 : 420, transition: 'width 0.3s ease' }} onClick={(e) => e.stopPropagation()}>
                                <WorkersPanel
                                    title="Nurses"
                                    workers={workers}
                                    onToggle={handleWorkerToggle}
                                    onClose={closeWorkersPanel}
                                    formOpen={addWorkerPanelOpen}
                                    editingWorker={editingWorker}
                                    onOpenForm={openAddWorkerPanel}
                                    onCloseForm={closeAddWorkerPanel}
                                    onSaveWorker={handleSaveWorker}
                                    isSavingWorker={isSavingWorker}
                                />
                            </ModalCard>
                        </Backdrop>
                    )}
                    {settingsPanelOpen && (
                        <Backdrop onClick={closeSettingsPanel}>
                            <ModalCard onClick={(e) => e.stopPropagation()}>
                                <SettingsPanel
                                    userDetails={userDetails}
                                    onSave={handleSettingsSave}
                                    onClose={closeSettingsPanel}
                                    onLogout={onLogout}
                                    isSaving={isSavingSettings}
                                />
                            </ModalCard>
                        </Backdrop>
                    )}
                    {supportPanelOpen && (
                        <Backdrop onClick={closeSupportPanel}>
                            <ModalCard onClick={(e) => e.stopPropagation()}>
                                <SupportPanel onClose={closeSupportPanel} />
                            </ModalCard>
                        </Backdrop>
                    )}
                    {notifyVisit && (
                        <Backdrop onClick={closeNotifyPanel}>
                            <ModalCard onClick={(e) => e.stopPropagation()}>
                                <NotifyWorkersPanel
                                    visit={notifyVisit}
                                    workers={workers.filter(w => !w.disabled)}
                                    onNotify={handleNotifySelected}
                                    onClose={closeNotifyPanel}
                                />
                            </ModalCard>
                        </Backdrop>
                    )}
                    {addPatientPanelOpen && (
                        <Backdrop onClick={closeAddPatientPanel}>
                            <ModalCard onClick={(e) => e.stopPropagation()}>
                                <AddPatientPanel
                                    patient={editingPatient}
                                    onSave={handleAddPatient}
                                    onClose={closeAddPatientPanel}
                                    isSaving={isAddingPatient}
                                />
                            </ModalCard>
                        </Backdrop>
                    )}
                    {addVisitPatient && (
                        <Backdrop onClick={closeAddVisitPanel}>
                            <ModalCard onClick={(e) => e.stopPropagation()}>
                                <AddVisitPanel
                                    patient={addVisitPatient}
                                    onSave={handleAddVisit}
                                    onClose={closeAddVisitPanel}
                                    isSaving={isAddingVisit}
                                />
                            </ModalCard>
                        </Backdrop>
                    )}
                    {notesPatient && (
                        <Backdrop onClick={closeNotesPanel}>
                            <ModalCard onClick={(e) => e.stopPropagation()}>
                                <NotesPanel
                                    patient={notesPatient}
                                    onSave={handleSaveNotes}
                                    onClose={closeNotesPanel}
                                    isSaving={isSavingNotes}
                                />
                            </ModalCard>
                        </Backdrop>
                    )}
                </>
            )}
        </Page>
        </>
    );
};

const MapExplorerV2 = () => {
    const [isDark, setIsDark] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const toggleTheme = useCallback(() => setIsDark((v) => !v), []);
    const handleLogin = useCallback(() => setAuthenticated(true), []);
    const handleLogout = useCallback(() => {
        clearToken();
        setAuthenticated(false);
    }, []);

    /* On mount, check if a valid JWT already exists in localStorage */
    useEffect(() => {
        verifyToken().then((result) => {
            if (result?.valid) setAuthenticated(true);
            setAuthChecked(true);
        });
    }, []);

    return (
        <ThemeProvider theme={isDark ? dark : light}>
            <ToastProvider>
                <MapExplorerV2Content
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                    authenticated={authenticated}
                    authChecked={authChecked}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                />
            </ToastProvider>
        </ThemeProvider>
    );
};

export default MapExplorerV2;
