export interface Education {
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
}

export interface WorkExperience {
    company: string;
    title: string;
    start_date: string;
    end_date: string;
    description: string;
}

export interface ResumeData {
    name: string;
    email: string;
    phone: string;
    address: string;
    skills: string[];
    education: Education[];
    work_experience: WorkExperience[];
}
