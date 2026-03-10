import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import { usePatientSummary } from '../../hooks/usePatientSummary';
import Badge from '../atoms/Badge';
import { BodyText, MutedText } from '../atoms';
import { PanelHeader, SummaryMetric, SummarySection } from '../molecules';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    font-family: ${FONT_FAMILY};
`;

const TriggerCard = styled.button`
    width: 100%;
    padding: ${S.lg};
    background: ${({ theme }) => theme.cardBg};
    border-radius: 12px;
    box-shadow: 0px 2px 3.32px ${({ theme }) => theme.cardShadow};
    border: 0.87px ${({ theme }) => theme.cardOutline} solid;
    backdrop-filter: ${({ theme }) => theme.cardBlur};
    -webkit-backdrop-filter: ${({ theme }) => theme.cardBlur};
    color: ${({ theme }) => theme.text};
    font-family: ${FONT_FAMILY};
    font-size: ${F.md};
    font-weight: ${W.semibold};
    text-align: left;
    cursor: pointer;
`;

const Body = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: ${S.xxl};
    display: flex;
    flex-direction: column;
    gap: ${S.xl};
`;

const StatusRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${S.md};
`;

const StatusBadge = styled(Badge)`
    flex-shrink: 0;
`;

const HeroBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${S.sm};
`;

const HeroText = styled(BodyText)`
    font-size: ${F.md};
    font-weight: ${W.medium};
    line-height: 1.6;
`;

const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${S.sm};
`;

const RiskList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${S.xs};
`;

const ActionsList = styled.ul`
    margin: 0;
    padding-left: ${S.lg};
    display: flex;
    flex-direction: column;
    gap: ${S.xs};
`;

const ActionItem = styled.li`
    font-family: ${FONT_FAMILY};
    font-size: ${F.sm};
    font-weight: ${W.regular};
    color: ${({ theme }) => theme.text};
    line-height: 1.5;
`;

const LoadingText = styled(MutedText)`
    font-size: ${F.sm};
    text-align: center;
    font-style: normal;
`;

const ErrorTitle = styled.span`
    font-family: ${FONT_FAMILY};
    font-size: ${F.sm};
    font-weight: ${W.semibold};
    color: ${({ theme }) => theme.text};
`;

const ErrorText = styled(MutedText)`
    font-size: ${F.sm};
    line-height: 1.5;
    font-style: normal;
`;

const SupportText = styled(BodyText)`
    color: ${({ theme }) => theme.textSecondary};
`;

function buildLocalSummary(patient, visits = []) {
    if (!patient) return null;

    const today = new Date();
    const last30 = new Date(today);
    last30.setDate(today.getDate() - 30);

    const parsedVisits = visits
        .map((visit) => {
            const due = visit?.due_date ? new Date(visit.due_date) : null;
            const completed = visit?.completed_date ? new Date(visit.completed_date) : null;
            return {
                ...visit,
                due,
                completed,
            };
        })
        .filter((visit) => !visit.due || !Number.isNaN(visit.due.getTime()));

    const completedVisits = parsedVisits.filter((visit) => visit.status === 2);
    const pendingVisits = parsedVisits.filter((visit) => visit.status === 1);
    const overdueVisits = pendingVisits.filter((visit) => visit.due && visit.due < today);
    const upcomingVisits = pendingVisits.filter((visit) => visit.due && visit.due >= today);
    const recentDue = parsedVisits.filter((visit) => visit.due && visit.due >= last30);
    const recentCompleted = completedVisits.filter((visit) => visit.completed && visit.completed >= last30);

    const adherence = recentDue.length > 0
        ? Math.round((recentCompleted.length / recentDue.length) * 1000) / 10
        : 0;

    let statusSummary = 'Active care';
    if (patient.active === false) {
        statusSummary = 'Discharged';
    } else if (overdueVisits.length >= 3) {
        statusSummary = 'Needs immediate attention';
    } else if (overdueVisits.length > 0) {
        statusSummary = 'Behind schedule';
    } else if (adherence >= 90) {
        statusSummary = 'On track';
    }

    const risks = [];
    if (overdueVisits.length > 0) {
        risks.push({
            level: overdueVisits.length >= 3 ? 'high' : 'medium',
            message: `${overdueVisits.length} overdue visit${overdueVisits.length > 1 ? 's' : ''}`,
        });
    }
    if (recentDue.length > 0 && adherence < 70) {
        risks.push({
            level: 'medium',
            message: `Low adherence: ${Math.round(adherence)}% in last 30 days`,
        });
    }
    if (patient.active === false) {
        risks.push({
            level: 'info',
            message: 'Patient is currently discharged',
        });
    }

    const nextVisit = upcomingVisits
        .slice()
        .sort((a, b) => (a.due?.getTime() || 0) - (b.due?.getTime() || 0))[0] || null;

    const actions = [];
    if (nextVisit?.due) {
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysUntil = Math.ceil((nextVisit.due.getTime() - today.getTime()) / msPerDay);
        if (daysUntil <= 3) {
            actions.push(`Next visit due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`);
        }
    }
    if (overdueVisits.length > 0) {
        actions.push(`Reschedule ${overdueVisits.length} overdue visit${overdueVisits.length > 1 ? 's' : ''}`);
    }
    if (actions.length === 0) {
        actions.push('No immediate actions required');
    }

    return {
        status_summary: statusSummary,
        description: patient.description || '',
        insights: `${patient.field_name || 'Patient'} is under ${patient.acres || 'Unknown'} care. ${statusSummary}.`,
        adherence_30d: adherence,
        completed_count: completedVisits.length,
        pending_count: pendingVisits.length,
        overdue_count: overdueVisits.length,
        cadence: `${patient.scheduled_visits || 0} visits/month expected`,
        risks,
        next_visit: nextVisit ? {
            due_date: nextVisit.due_date,
            text: nextVisit.text || '',
        } : null,
        actions,
    };
}

const PatientSummaryPanel = ({ patientId, patient, visits = [], onClose, onOpen }) => {
    const { data: summary, isLoading, error } = usePatientSummary(patientId);
    const localSummary = useMemo(() => buildLocalSummary(patient, visits), [patient, visits]);
    const theme = useTheme();

    if (!patientId && onOpen) {
        return (
            <TriggerCard type="button" onClick={onOpen}>
                Patient Summary
            </TriggerCard>
        );
    }

    if (onOpen && !onClose) {
        return (
            <TriggerCard type="button" onClick={onOpen}>
                Patient Summary
            </TriggerCard>
        );
    }

    if (isLoading) {
        return (
            <Wrapper>
                <PanelHeader title="Patient Summary" onClose={onClose} />
                <Body>
                    <LoadingText>Analyzing patient data...</LoadingText>
                </Body>
            </Wrapper>
        );
    }

    if (error) {
        if (!localSummary) {
            return (
                <Wrapper>
                    <PanelHeader title="Patient Summary" onClose={onClose} />
                    <Body>
                        <ErrorTitle>Patient Summary Unavailable</ErrorTitle>
                        <ErrorText>
                            Live summary data could not be loaded. The patient record is still available.
                        </ErrorText>
                    </Body>
                </Wrapper>
            );
        }
    }

    if (!summary && !localSummary) {
        return (
            <Wrapper>
                <PanelHeader title="Patient Summary" onClose={onClose} />
                <Body>
                    <ErrorTitle>Patient Summary Unavailable</ErrorTitle>
                    <ErrorText>No summary data was returned for this patient.</ErrorText>
                </Body>
            </Wrapper>
        );
    }

    const resolvedSummary = summary || localSummary;

    const safeSummary = {
        status_summary: resolvedSummary.status_summary || 'Active care',
        description: resolvedSummary.description || '',
        insights: resolvedSummary.insights || '',
        adherence_30d: resolvedSummary.adherence_30d ?? 0,
        completed_count: resolvedSummary.completed_count ?? 0,
        pending_count: resolvedSummary.pending_count ?? 0,
        overdue_count: resolvedSummary.overdue_count ?? 0,
        cadence: resolvedSummary.cadence || 'No cadence available',
        risks: Array.isArray(resolvedSummary.risks) ? resolvedSummary.risks : [],
        next_visit: resolvedSummary.next_visit || null,
        actions: Array.isArray(resolvedSummary.actions) && resolvedSummary.actions.length > 0
            ? resolvedSummary.actions
            : ['No immediate actions required'],
    };

    const getStatusTone = (status) => {
        const statusText = String(status || '');
        if (statusText.includes('Needs immediate attention')) {
            return 'danger';
        }
        if (statusText.includes('Behind schedule')) {
            return 'warning';
        }
        if (statusText.includes('On track')) {
            return 'success';
        }
        return 'default';
    };

    const getStatusBadgeColor = (status) => {
        const statusText = String(status || '');
        if (statusText.includes('Needs immediate attention')) {
            return { bg: theme.dangerBg, color: theme.dangerColor };
        }
        if (statusText.includes('Behind schedule')) {
            return { bg: theme.accentBg, color: theme.primary };
        }
        if (statusText.includes('On track')) {
            return { bg: theme.completedBg, color: theme.completedColor };
        }
        return { bg: theme.badgeBg, color: theme.textSecondary };
    };

    const getRiskTone = (level) => {
        if (level === 'high') {
            return { bg: theme.dangerBg, color: theme.dangerColor };
        }
        if (level === 'medium') {
            return { bg: theme.accentBg, color: theme.primary };
        }
        return { bg: theme.badgeBg, color: theme.textSecondary };
    };

    const statusColors = getStatusBadgeColor(safeSummary.status_summary);
    const statusTone = getStatusTone(safeSummary.status_summary);
    const actionItems = safeSummary.actions.filter((action) => {
        if (action === 'No immediate actions required') return false;
        if (safeSummary.next_visit && action.startsWith('Next visit due in')) return false;
        if (safeSummary.overdue_count > 0 && action.startsWith('Reschedule')) return false;
        return true;
    });
    const heroText = safeSummary.insights || safeSummary.description;
    const metrics = [
        { value: `${safeSummary.adherence_30d}%`, label: 'Adherence', tone: statusTone },
        { value: safeSummary.overdue_count, label: 'Overdue', tone: safeSummary.overdue_count > 0 ? 'danger' : 'default' },
        { value: safeSummary.pending_count, label: 'Open visits', tone: 'default' },
    ];

    return (
        <Wrapper>
            <PanelHeader title="Patient Summary" onClose={onClose} />
            <Body>
                <StatusRow>
                    <HeroText>{heroText || 'No summary available'}</HeroText>
                    <StatusBadge bg={statusColors.bg} color={statusColors.color}>
                        {safeSummary.status_summary}
                    </StatusBadge>
                </StatusRow>

                <SummarySection title="Key Metrics">
                    <MetricsGrid>
                        {metrics.map((metric) => (
                            <SummaryMetric
                                key={metric.label}
                                value={metric.value}
                                label={metric.label}
                                tone={metric.tone}
                            />
                        ))}
                    </MetricsGrid>
                </SummarySection>

                {safeSummary.risks.length > 0 && (
                    <SummarySection title="Risk Indicators">
                        <RiskList>
                            {safeSummary.risks.map((risk, idx) => {
                                const riskTone = getRiskTone(risk.level);
                                return (
                                    <Badge key={idx} bg={riskTone.bg} color={riskTone.color}>
                                        {risk.message}
                                    </Badge>
                                );
                            })}
                        </RiskList>
                    </SummarySection>
                )}

                {safeSummary.next_visit && safeSummary.next_visit.due_date && (
                    <SummarySection title="Next Visit">
                        <SupportText>
                            {new Date(safeSummary.next_visit.due_date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </SupportText>
                    </SummarySection>
                )}

                {actionItems.length > 0 && (
                    <SummarySection title="Recommended Actions">
                        <ActionsList>
                            {actionItems.map((action, idx) => (
                                <ActionItem key={idx}>{action}</ActionItem>
                            ))}
                        </ActionsList>
                    </SummarySection>
                )}
            </Body>
        </Wrapper>
    );
};

export default PatientSummaryPanel;

