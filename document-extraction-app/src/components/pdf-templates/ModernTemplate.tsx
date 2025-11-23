import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '../../types/resume';

// Register a standard font
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TY17.ttf' },
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TY17.ttf', fontWeight: 'bold' },
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 0,
        fontFamily: 'Helvetica',
        flexDirection: 'row',
    },
    sidebar: {
        width: '30%',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: 20,
        height: '100%',
    },
    main: {
        width: '70%',
        padding: 30,
        backgroundColor: '#ffffff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2c3e50',
    },
    sidebarName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ecf0f1',
        textAlign: 'center',
    },
    contactInfo: {
        fontSize: 10,
        marginBottom: 20,
    },
    contactItem: {
        marginBottom: 5,
        color: '#bdc3c7',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        borderBottomWidth: 2,
        borderBottomColor: '#3498db',
        marginBottom: 15,
        paddingBottom: 5,
        color: '#2c3e50',
        textTransform: 'uppercase',
    },
    sidebarSectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#7f8c8d',
        marginBottom: 10,
        paddingBottom: 3,
        color: '#ecf0f1',
        textTransform: 'uppercase',
    },
    experienceItem: {
        marginBottom: 15,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    company: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#2c3e50',
    },
    date: {
        fontSize: 9,
        color: '#7f8c8d',
    },
    jobTitle: {
        fontSize: 11,
        fontStyle: 'italic',
        marginBottom: 5,
        color: '#34495e',
    },
    description: {
        fontSize: 10,
        textAlign: 'justify',
        color: '#555',
        lineHeight: 1.4,
    },
    educationItem: {
        marginBottom: 10,
    },
    skill: {
        backgroundColor: '#34495e',
        padding: '4 8',
        borderRadius: 4,
        marginBottom: 8,
        fontSize: 9,
        color: '#ecf0f1',
        textAlign: 'center',
    },
});

interface ModernTemplateProps {
    data: ResumeData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Sidebar */}
            <View style={styles.sidebar}>
                <View style={styles.contactInfo}>
                    <Text style={styles.sidebarSectionTitle}>Contact</Text>
                    <Text style={styles.contactItem}>{data.email}</Text>
                    <Text style={styles.contactItem}>{data.phone}</Text>
                    <Text style={styles.contactItem}>{data.address}</Text>
                </View>

                {/* Skills in Sidebar */}
                {data.skills && data.skills.length > 0 && (
                    <View>
                        <Text style={styles.sidebarSectionTitle}>Skills</Text>
                        {data.skills.map((skill, index) => (
                            <Text key={index} style={styles.skill}>{skill}</Text>
                        ))}
                    </View>
                )}
            </View>

            {/* Main Content */}
            <View style={styles.main}>
                <Text style={styles.name}>{data.name}</Text>

                {/* Work Experience */}
                {data.work_experience && data.work_experience.length > 0 && (
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {data.work_experience.map((job, index) => (
                            <View key={index} style={styles.experienceItem}>
                                <View style={styles.jobHeader}>
                                    <Text style={styles.company}>{job.company}</Text>
                                    <Text style={styles.date}>{job.start_date} - {job.end_date}</Text>
                                </View>
                                <Text style={styles.jobTitle}>{job.title}</Text>
                                <Text style={styles.description}>{job.description}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {data.education.map((edu, index) => (
                            <View key={index} style={styles.educationItem}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 11 }}>{edu.degree}</Text>
                                    <Text style={styles.date}>{edu.start_date} - {edu.end_date}</Text>
                                </View>
                                <Text style={{ fontSize: 10, color: '#555' }}>{edu.field_of_study}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </Page>
    </Document>
);

export default ModernTemplate;
