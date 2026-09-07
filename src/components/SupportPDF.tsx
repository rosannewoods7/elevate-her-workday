'use client';

import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30, // Reduced from 40
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 15, // Reduced from 30
    borderBottom: '2pt solid #4a154b',
    paddingBottom: 8,
  },
  title: {
    fontSize: 20, // Reduced from 24
    color: '#4a154b',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 10, // Reduced from 12
    color: '#8c688e',
    textTransform: 'uppercase',
    marginTop: 3,
  },
  section: {
    marginBottom: 12, // Reduced from 20
  },
  heading: {
    fontSize: 11, // Reduced from 14
    color: '#4a154b',
    marginBottom: 4, // Reduced from 8
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 10, // Reduced from 12
    color: '#111111',
    lineHeight: 1.4,
  },
  box: {
    backgroundColor: '#faf8f9',
    padding: 10, // Reduced from 15
    borderLeft: '3pt solid #4a154b',
    marginBottom: 8, // Reduced from 15
  },
  note: {
    fontSize: 9, // Reduced from 10
    color: '#605561',
    fontStyle: 'italic',
    marginTop: 15, // Reduced from 20
    borderTop: '1pt solid #ded5df',
    paddingTop: 8,
  }
});

interface WorkData {
  outcome: string;
  barrier: string;
  adjustment: string;
  commitment: string;
  review: string;
  audience: string;
}

const WorkPDF = ({ data }: { data: WorkData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Work Adjustment Request</Text>
        <Text style={styles.subtitle}>Prepared for: {data.audience || 'Colleague'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Why This Conversation Matters</Text>
        <Text style={styles.text}>
          Addressing a functional barrier is a standard part of professional management. 
          By framing your request around observable work outcomes and specific adjustments, you are providing a business solution, not just raising a problem. 
          It takes courage to ask for what you need, but protecting your operational capacity ultimately protects the quality of your work.
        </Text>
      </View>
      
      <View style={styles.box}>
        <Text style={styles.heading}>The Outcome</Text>
        <Text style={styles.text}>{data.outcome || 'Not specified.'}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.heading}>The Observable Barrier</Text>
        <Text style={styles.text}>{data.barrier || 'Not specified.'}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.heading}>Proposed Adjustment</Text>
        <Text style={styles.text}>{data.adjustment || 'Not specified.'}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.heading}>My Commitment</Text>
        <Text style={styles.text}>{data.commitment || 'Not specified.'}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.heading}>Review Plan</Text>
        <Text style={styles.text}>{data.review || 'Not specified.'}</Text>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.heading}>Preparation Notes</Text>
        <Text style={styles.text}>
          • Decide in advance which health details you prefer to keep private. You only need to discuss the functional impact on your work.
        </Text>
        <Text style={styles.text}>
          • If your proposed adjustment is rejected, ask: "If this option is unavailable, what alternative would address this specific work issue?"
        </Text>
        <Text style={styles.text}>
          • After the discussion, confirm the agreed action, owner, and review date in writing.
        </Text>
      </View>

      <Text style={styles.note}>Elevate HER Workday | This is a structural planning tool to guide a conversation about work conditions. It does not replace formal workplace HR or accommodation processes.</Text>
    </Page>
  </Document>
);

interface HealthData {
  concern: string;
  onset: string;
  impact: string;
  context: string;
  questions: string[];
}

const HealthPDF = ({ data }: { data: HealthData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointment Preparation</Text>
        <Text style={styles.subtitle}>Elevate HER Workday</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Maximizing Your Appointment</Text>
        <Text style={styles.text}>
          Healthcare appointments are often brief. Bringing a concise, accurate account of what has changed helps focus the clinical assessment. 
          You do not need to earn care through weeks of logging or arrive with a diagnosis. You are the expert on your baseline functioning. 
          If you feel dismissed, it is reasonable to ask for a further assessment or a referral.
        </Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.heading}>Primary Concern</Text>
        <Text style={styles.text}>{data.concern || 'Not specified.'}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.heading}>Onset / Timeline</Text>
        <Text style={styles.text}>{data.onset || 'Not specified.'}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.heading}>Functional Impact (Work/Life)</Text>
        <Text style={styles.text}>{data.impact || 'Not specified.'}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.heading}>Questions for the Clinician</Text>
        {data.questions && data.questions.length > 0 ? (
          data.questions.map((q, idx) => (
            <Text key={idx} style={styles.text}>• {q}</Text>
          ))
        ) : (
          <Text style={styles.text}>Not specified.</Text>
        )}
      </View>
      
      {data.context && (
        <View style={styles.box}>
          <Text style={styles.heading}>Additional Context / Log Summary</Text>
          <Text style={styles.text}>{data.context}</Text>
        </View>
      )}

      <View style={{ marginTop: 10 }}>
        <Text style={styles.heading}>During the Appointment</Text>
        <Text style={styles.text}>
          • If tests are ordered, ask what they rule out and when you will receive results.
        </Text>
        <Text style={styles.text}>
          • Before leaving, ensure you understand the exact next steps (e.g., watch and wait, medication, referral).
        </Text>
      </View>

      <Text style={styles.note}>Elevate HER Workday | Self-reported observations; not a diagnosis.</Text>
    </Page>
  </Document>
);

export function SupportPDFDownload({ type, workData, healthData, disabled }: { type: 'work' | 'health', workData?: WorkData, healthData?: HealthData, disabled?: boolean }) {
  const [isClient, setIsClient] = useState(false);
  React.useEffect(() => setIsClient(true), []);

  if (!isClient) return <button disabled className="w-full py-4 bg-[var(--eh-lilac)] text-[var(--eh-mauve)] font-bold rounded-lg opacity-50">Preparing Document...</button>;

  if (disabled) {
    return (
      <button disabled className="w-full py-4 bg-[var(--eh-lilac)] text-[var(--eh-mauve)] font-bold rounded-lg opacity-50 cursor-not-allowed">
        Complete fields to generate PDF
      </button>
    );
  }

  const doc = type === 'work' && workData ? <WorkPDF data={workData} /> : type === 'health' && healthData ? <HealthPDF data={healthData} /> : <Document><Page></Page></Document>;

  return (
    <PDFDownloadLink 
      document={doc} 
      fileName={`${type === 'work' ? 'Work_Adjustment_Request' : 'Healthcare_Preparation'}.pdf`}
    >
      {({ loading }) =>
        loading ? (
          <button className="w-full py-4 bg-[var(--eh-lilac)] text-[var(--eh-mauve)] font-bold rounded-lg">Generating PDF...</button>
        ) : (
          <button className="w-full py-4 bg-[var(--eh-plum)] text-white font-bold rounded-lg shadow-[var(--eh-shadow)] hover:opacity-90 transition-all">
            Download Preparation PDF
          </button>
        )
      }
    </PDFDownloadLink>
  );
}
