import { useState } from 'react'
import styles from "../styles/Home.module.css"
import NavBar from "../components/NavBar"
import EducationCard from "../components/EducationCard"
import WorkCard from "../components/WorkCard"
import ProjectCard from "../components/ProjectCard"
import Sidebar from "../components/Sidebar"
import ScrollToTop from "../components/ScrollToTop"
import config from "../config/config"

// Define types for config data
interface Education {
    schoolName: string;
    degree: string;
    duration: string;
    location: string;
    logoSrc: string;
    highlights: string[];
}

interface Experience {
    companyName: string;
    position: string;
    duration: string;
    location: string;
    logoSrc: string;
    highlights: string[];
}

interface Project {
    projectName: string;
    description: string;
    technologies: string[];
    duration: string;
    projectUrl?: string;
    githubUrl?: string;
    imageSrc: string;
    highlights: string[];
}

interface Section {
    id: string;
    title: string;
    icon: string;
    type: 'intro' | 'education' | 'experience' | 'projects' | 'custom';
    contentType?: 'project' | 'basic';
}

interface CustomSection {
    title: string;
    content?: string;
    items?: Project[];
    // For contact section
    email?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
}

// Helper function to parse markdown links
const parseMarkdownLinks = (text: string): string => {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
};

// Helper function to build image paths consistently
const getImagePath = (type: string, filename: string): string => {
    if (!filename) return '';
    
    const baseUrl = import.meta.env.BASE_URL;
    switch (type) {
        case 'schools':
            return `${baseUrl}/schools/${filename}`;
        case 'background':
            return `${baseUrl}/background/${filename}`;
        default:
            return `${baseUrl}${filename}`;
    }
};

const Home = () => {
    const [activeSection, setActiveSection] = useState('intro')

    const handleSectionChange = (sectionId: string) => {
        setActiveSection(sectionId);
    };

    const renderRightContent = () => {
        // Find the current active section from config
        const allSections = config.site.navigation.sections as Section[];
        const currentSection = allSections.find(section => section.id === activeSection);
        
        if (!currentSection) {
            return null;
        }
        
        // Render based on section type
        switch(currentSection.type) {
            case 'intro':
                return (
                    <div className={styles.rightContent}>
                        <div className={styles.introWrapper}>
                            <div className={styles.introTextSection}>
                                <div className={styles.aboutContent}>
                                    <h2>👤 <span>{config.site.about.title}</span></h2>
                                    <p dangerouslySetInnerHTML={{ __html: parseMarkdownLinks(config.site.about.content) }} />
                                </div>
                            </div>
                            <div className={styles.introImageSection}>
                                <div className={styles.introPhotoWrapper}>
                                    <img src={getImagePath('', config.site.about.photo)} alt={config.site.hero.name} className={styles.introPhoto} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
                
            case 'education':
                return (
                    <div className={styles.rightContent}>
                        <h2>🎓 <span>Education</span></h2>
                        
                        {(config.site.education as Education[]).map((edu: Education, index: number) => (
                            <EducationCard 
                                key={index}
                                schoolName={edu.schoolName}
                                degree={edu.degree}
                                duration={edu.duration}
                                location={edu.location}
                                logoSrc={getImagePath('schools', edu.logoSrc)}
                                logoAlt={`${edu.schoolName} Logo`}
                                highlights={edu.highlights}
                            />
                        ))}
                    </div>
                );
                
            case 'experience':
                return (
                    <div className={styles.rightContent}>
                        <h2>💼 <span>Work Experience</span></h2>
                        
                        {(config.site.experience as Experience[]).map((exp: Experience, index: number) => (
                            <WorkCard 
                                key={index}
                                companyName={exp.companyName}
                                position={exp.position}
                                duration={exp.duration}
                                location={exp.location}
                                logoSrc={getImagePath('schools', exp.logoSrc)}
                                logoAlt={`${exp.companyName} Logo`}
                                highlights={exp.highlights}
                            />
                        ))}
                    </div>
                );
                
            case 'projects':
                return (
                    <div className={styles.rightContent}>
                        <h2 id="projects-section">💻 <span>Projects</span></h2>
                        
                        <div className={styles.projectsContainer}>
                            {(config.site.projects as Project[]).map((project: Project, index: number) => (
                                <ProjectCard 
                                    key={index}
                                    projectName={project.projectName}
                                    description={project.description}
                                    technologies={project.technologies}
                                    duration={project.duration}
                                    projectUrl={project.projectUrl}
                                    githubUrl={project.githubUrl}
                                    imageSrc={getImagePath('background', project.imageSrc)}
                                    imageAlt={`${project.projectName} Project`}
                                    highlights={project.highlights}
                                />
                            ))}
                            
                            {/* Back to projects top button */}
                            <button 
                                className={styles.backToTopButton}
                                onClick={() => {
                                    // Detect if device is mobile
                                    const isMobile = window.innerWidth <= 768;
                                    
                                    if (isMobile) {
                                        // Mobile: scroll to project title
                                        const projectsSection = document.getElementById('projects-section');
                                        if (projectsSection) {
                                            projectsSection.scrollIntoView({ 
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                        }
                                    } else {
                                        // Desktop: scroll to #about section
                                        const aboutSection = document.getElementById('about');
                                        if (aboutSection) {
                                            aboutSection.scrollIntoView({ 
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                        }
                                    }
                                }}
                            >
                                <i className="fas fa-arrow-up"></i>
                                Back to Projects Top
                            </button>
                        </div>
                    </div>
                );
                
            case 'custom':
                // Handle custom sections based on contentType
                const sectionData = config.site[currentSection.id] as CustomSection;
                
                if (currentSection.contentType === 'project' && sectionData && sectionData.items) {
                    return (
                        <div className={styles.rightContent}>
                            <h2 id={`${currentSection.id}-section`}>{currentSection.icon} <span>{sectionData.title}</span></h2>
                            
                            <div className={styles.projectsContainer}>
                                {(sectionData.items as Project[]).map((project: Project, index: number) => (
                                    <ProjectCard 
                                        key={index}
                                        projectName={project.projectName}
                                        description={project.description}
                                        technologies={project.technologies}
                                        duration={project.duration}
                                        projectUrl={project.projectUrl}
                                        githubUrl={project.githubUrl}
                                        imageSrc={getImagePath('background', project.imageSrc)}
                                        imageAlt={`${project.projectName} Project`}
                                        highlights={project.highlights}
                                    />
                                ))}
                                
                                {/* Back to section top button */}
                                <button 
                                    className={styles.backToTopButton}
                                    onClick={() => {
                                        // Detect if device is mobile
                                        const isMobile = window.innerWidth <= 768;
                                        
                                        if (isMobile) {
                                            // Mobile: scroll to project title
                                            const section = document.getElementById(`${currentSection.id}-section`);
                                            if (section) {
                                                section.scrollIntoView({ 
                                                    behavior: 'smooth',
                                                    block: 'start'
                                                });
                                            }
                                        } else {
                                            // Desktop: scroll to #about section and hide navbar
                                            const aboutSection = document.getElementById('about');
                                            const navbar = document.querySelector('nav');
                                            
                                            if (aboutSection && navbar instanceof HTMLElement) {
                                                aboutSection.scrollIntoView({ 
                                                    behavior: 'smooth',
                                                    block: 'start'
                                                });
                                                
                                                // Hide navbar temporarily (desktop only)
                                                setTimeout(() => {
                                                    navbar.style.transform = 'translateY(-100%)';
                                                    navbar.style.transition = 'transform 0.3s ease';
                                                    
                                                    // Show navbar again after 3 seconds
                                                    setTimeout(() => {
                                                        navbar.style.transform = '';
                                                        navbar.style.transition = '';
                                                    }, 3000);
                                                }, 1000); // Wait for scroll animation to complete
                                            }
                                        }
                                    }}
                                >
                                    <i className="fas fa-arrow-up"></i>
                                    Back to {sectionData.title} Top
                                </button>
                            </div>
                        </div>
                    );
                } else if (currentSection.contentType === 'basic' && sectionData) {
                    // Basic content type with text
                    return (
                        <div className={styles.rightContent}>
                            <h2>{currentSection.icon} <span>{sectionData.title}</span></h2>
                            {sectionData.content && 
                                <p dangerouslySetInnerHTML={{ __html: parseMarkdownLinks(sectionData.content) }} />
                            }
                            <div className={styles.contactSection}>
                                <div className={styles.contactItem}>
                                    <i className="fas fa-envelope"></i>
                                    <a href={`mailto:${sectionData.email}`}>{sectionData.email}</a>
                                </div>
                                <div className={styles.contactItem}>
                                    <i className="fab fa-github"></i>
                                    <a href={sectionData.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                                </div>
                                <div className={styles.contactItem}>
                                    <i className="fab fa-linkedin"></i>
                                    <a href={sectionData.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                </div>
                            </div>
                        </div>
                    );
                }
                return null;

            default:
                return null;
        }
    }

    return (
        <div className={styles.wrapper}>
            <NavBar />
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>{config.site.hero.name}</h1>
                    <p>{config.site.hero.quote}</p>
                </div>
                <a href="#about" className={styles.downArrow}>
                    <i className="fas fa-angle-down scroll-down-effects"></i>
                </a>
            </section>

            {/* About Section */}
            <section id="about" className={styles.about}>
                <div className={styles.aboutWrapper}>
                    <div className={styles.aboutContainer}>
                        {/* Left Sidebar */}
                        <Sidebar 
                            activeSection={activeSection}
                            onSectionChange={handleSectionChange}
                        />

                        {/* Right Content Area */}
                        <div className={styles.rightContentArea}>
                            {renderRightContent()}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerText}>
                    <p>{config.site.footer.copyright}</p>
                    <p>{config.site.footer.message}</p>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            <ScrollToTop />
        </div>
    )
}

export default Home