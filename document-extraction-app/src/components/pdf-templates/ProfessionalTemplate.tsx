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
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    contactInfo: {
        fontSize: 10,
        color: '#444',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        paddingBottom: 3,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    experienceItem: {
        marginBottom: 10,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    company: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    date: {
        fontSize: 10,
        color: '#666',
        fontStyle: 'italic',
    },
    jobTitle: {
        fontSize: 11,
        fontStyle: 'italic',
        marginBottom: 3,
    },
    description: {
        fontSize: 10,
        textAlign: 'justify',
    },
    educationItem: {
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skillList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skill: {
        backgroundColor: '#eee',
        padding: '3 6',
        borderRadius: 3,
        marginRight: 5,
        marginBottom: 5,
        fontSize: 9,
    },
});

interface ProfessionalTemplateProps {
    data: ResumeData;
}

const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{data.name}</Text>
                <View style={styles.contactInfo}>
                    <Text>{data.email}</Text>
                    <Text>{data.phone}</Text>
                    <Text>{data.address}</Text>
                </View>
            </View>

            {/* Work Experience */}
            {data.work_experience && data.work_experience.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Professional Experience</Text>
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
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {data.education.map((edu, index) => (
                        <View key={index} style={styles.educationItem}>
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>{edu.degree}</Text>
                                <Text>{edu.field_of_study}</Text>
                            </View>
                            <Text style={styles.date}>{edu.start_date} - {edu.end_date}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.skillList}>
                        {data.skills.map((skill, index) => (
                            <Text key={index} style={styles.skill}>{skill}</Text>
                        ))}
                    </View>
                </View>
            )}
        </Page>
    </Document>
);

export default ProfessionalTemplate;
