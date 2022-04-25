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
    alignContent: 'center'
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
        <Text style={[styles.alignCenter, {marginBottom: 10}]}>Reporte de Resultados</Text>
        <Text style={[styles.alignCenter, {fontSize: 14, marginBottom: 10}]}>Evaluación de Procesos</Text>
        <Text style={[styles.alignCenter, {fontSize: 14, marginBottom: 10}]}>{data.project_description}</Text>
        <Text style={[styles.alignCenter, {fontSize: 14}]}>Enfoque: Cuantitativo</Text>

        <View>
          <Text style={[styles.alignCenter, {fontSize: 14, marginTop:20}]}>Categoría: Procesos Primarios</Text>
          <View>
            <Text style={{fontSize: 14, marginTop:20}}>Grupo de Procesos: Adquisición</Text>
            <Text style={{fontSize: 14, marginTop:10}}>Procesos:</Text>
            <Text style={{fontSize: 14, marginTop:10}}>   1. Proceso 1: 100%</Text>
            <Text style={{fontSize: 14, marginTop:10}}>   2. Proceso 2: 80%</Text>
            <Text style={{fontSize: 14, marginTop:10}}>   3. Proceso 3: 90%</Text>
            <Text style={{fontSize: 14, marginTop:10}}>   4. Proceso 4: 95%</Text>
          </View>
          <View>
            <Text style={{fontSize: 14, marginTop:20}}>Grupo de Procesos: Suministro</Text>
            <Text style={{fontSize: 14, marginTop:10}}>Procesos:</Text>
          </View>
        </View>

        <View>
          <Text style={[styles.alignCenter, {fontSize: 14, marginTop:20}]}>Categoría: Procesos Organizacionales</Text>
          <View>
            <Text style={{fontSize: 14, marginTop:20}}>Grupo de Procesos: Adquisición</Text>
            <Text style={{fontSize: 14, marginTop:10}}>Procesos:</Text>
          </View>
          <View>
            <Text style={{fontSize: 14, marginTop:20}}>Grupo de Procesos: Suministro</Text>
            <Text style={{fontSize: 14, marginTop:10}}>Procesos:</Text>
            <Text style={{fontSize: 14, marginTop:10}}>   1. Proceso 5: 94%</Text>
            <Text style={{fontSize: 14, marginTop:10}}>   2. Proceso 6: 80%</Text>
          </View>
        </View>

        <View>
          <Text style={[styles.alignCenter, {fontSize: 14, marginTop:20}]}>Categoría: Procesos de Soporte</Text>
          <View>
            <Text style={{fontSize: 14, marginTop:20}}>Grupo de Procesos: Adquisición</Text>
            <Text style={{fontSize: 14, marginTop:10}}>Procesos:</Text>
            <Text style={{fontSize: 14, marginTop:10}}>   1. Proceso de soporte (Adquisición): 100%</Text>
          </View>
          <View>
            <Text style={{fontSize: 14, marginTop:20}}>Grupo de Procesos: Suministro</Text>
            <Text style={{fontSize: 14, marginTop:10}}>Procesos:</Text>
            <Text style={{fontSize: 14, marginTop:10}}>   1. Proceso de soporte (suministro): 100%</Text>
          </View>
        </View>

      </View>
      <View style={styles.section}>
        <Text>{data.something}</Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument