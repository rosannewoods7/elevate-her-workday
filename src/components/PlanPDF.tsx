'use client';

import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, BlobProvider } from '@react-pdf/renderer';
import { DailyPlan, Profile } from '@/lib/types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    color: '#4a154b',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  heading: {
    fontSize: 16,
    color: '#4a154b',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    color: '#111111',
    lineHeight: 1.5,
    marginBottom: 10,
  },
  actionCard: {
    border: '1pt solid #e8dde5',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 5,
  },
  fallbackBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1pt solid #e8dde5',
  },
  fallbackLabel: {
    fontSize: 10,
    color: '#8c688e',
    textTransform: 'uppercase',
    marginBottom: 2,
  }
});

interface PlanPDFProps {
  plan: DailyPlan;
  profile: Profile | null;
}

export const PlanDocument = ({ plan, profile }: PlanPDFProps) => {
  const getScienceByDomain = (domain: string) => {
    switch (domain) {
      case 'focus':
        return "Focus is strongly influenced by cognitive load and hormonal fluctuations. By breaking tasks into smaller steps or shifting demanding work out of your 'harder windows' (the times of day when symptoms peak), you reduce the cognitive friction required to start and sustain attention.";
      case 'energy':
        return "Energy fluctuations are a primary feature of the midlife transition. Managing the workday requires pacing and strategic recovery rather than pushing through fatigue, which can compound exhaustion. These actions provide micro-recoveries to sustain you longer.";
      case 'recovery':
        return "Sleep architecture changes during midlife, often reducing deep and REM sleep. Attempting high-demand tasks after poor recovery increases stress. These actions help you adjust expectations and protect your nervous system when your biological battery is low.";
      case 'load':
        return "When workload exceeds capacity, the nervous system shifts into a threat response. These actions are designed to help you regain agency by identifying what can be dropped, delegated, or delayed, thereby lowering physiological stress.";
      case 'comfort':
        return "Physical discomfort (like temperature changes or joint pain) directly competes with your brain's resources for task execution. Creating a more accommodating physical environment immediately frees up cognitive capacity.";
      case 'support':
        return "Many women try to manage midlife symptoms invisibly, which increases psychological load. Formulating a structured ask for support reduces the mental burden and builds practical infrastructure to help you succeed.";
      default:
        return "These actions were selected based on the specific constraints you recorded. Taking small, manageable steps helps reset the nervous system and builds momentum without requiring excessive effort.";
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Elevate HER Workday - My Personal Plan</Text>
        
        <View style={styles.section}>
          <Text style={styles.heading}>Date: {plan.local_date}</Text>
          <Text style={styles.text}>Primary Goal: {profile?.goal || 'General Balance'}</Text>
          <Text style={styles.text}>Current Focus: {plan.focus}</Text>
          {plan.effective_controls.length > 0 ? (
             <Text style={styles.text}>Controls Available: {plan.effective_controls.join(', ').replace(/_/g, ' ')}</Text>
          ) : null}
          {plan.effective_demand.length > 0 ? (
             <Text style={styles.text}>Work Demands: {plan.effective_demand.join(', ').replace(/_/g, ' ')}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>My Actions</Text>
          {plan.actions.map((action, i) => (
            <View key={action.id} style={styles.actionCard}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.text}>{action.instruction}</Text>
              {i === 0 ? (
                <View style={styles.fallbackBox}>
                  <Text style={styles.fallbackLabel}>If the day changes</Text>
                  <Text style={styles.text}>{plan.fallback}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>The Science: Why These Actions?</Text>
          <Text style={styles.text}>
            {getScienceByDomain(plan.focus)}
          </Text>
          <Text style={styles.text}>
            Note: Your plan also includes a 'fallback' option. This ensures you have a manageable alternative if unexpected disruptions occur, protecting you from the all-or-nothing cycle.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export function DownloadPlanButton({ plan, profile }: PlanPDFProps) {
  const [isClient, setIsClient] = useState(false);
  
  // Must render PDFDownloadLink only on client to avoid hydration errors
  React.useEffect(() => setIsClient(true), []);

  if (!isClient) return <button className="w-full py-3 border border-[var(--primary)] text-[var(--primary)] font-semibold rounded-lg opacity-50">Preparing PDF...</button>;

  return (
    <BlobProvider document={<PlanDocument plan={plan} profile={profile} />}>
      {({ blob, url, loading }) =>
        loading || !blob || !url ? (
          <button className="w-full py-3 border border-[var(--primary)] text-[var(--primary)] font-semibold rounded-[var(--eh-control-radius)] opacity-50">Loading PDF...</button>
        ) : (
          <button 
            onClick={async () => {
              const fileName = `Workday_Plan_${plan.local_date}.pdf`;
              if (navigator.share && navigator.canShare) {
                const file = new File([blob], fileName, { type: 'application/pdf' });
                if (navigator.canShare({ files: [file] })) {
                  try {
                    await navigator.share({
                      files: [file],
                      title: 'Workday Plan',
                    });
                    return;
                  } catch (err) {
                    console.log('Share canceled or failed');
                  }
                }
              }
              // Fallback for desktop/non-share browsers
              const a = document.createElement('a');
              a.href = url;
              a.download = fileName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className="w-full py-3 border border-[var(--primary)] text-[var(--primary)] font-semibold rounded-[var(--eh-control-radius)] hover:bg-[#e8dde5]"
          >
            Share / Save my summary
          </button>
        )
      }
    </BlobProvider>
  );
}
