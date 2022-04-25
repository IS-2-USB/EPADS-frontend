import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  alignCenter: {
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    alignContent: 'center',
    marginBottom: 10
  },
  page: {
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10
  }
});

// Create Document Component
const MyDocument = ({ data }) => ( // 
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.alignCenter}>Reporte de Resultados</Text>
        <Text style={[styles.alignCenter, {fontSize: 14}]}>Evaluación de Procesos</Text>
        <Text style={[styles.alignCenter, {fontSize: 14}]}>{data.project_description}</Text>
        <Text style={[styles.alignCenter, {fontSize: 14}]}>Enfoque: Cuantitativo</Text>
      </View>
      <View style={styles.section}>
        <Text>{data.something}</Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument