import { useState } from 'react'
import styles from "../styles/Home.module.css"
import NavBar from "../components/NavBar"
import EducationCard from "../components/EducationCard"
import WorkCard from "../components/WorkCard"
import ProjectCard from "../components/ProjectCard"
import Sidebar from "../components/Sidebar"
import ScrollToTop from "../components/ScrollToTop"
import Footer from "../components/Footer"
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

interface WorkExperience {
    companyName: string;
    position: string;
    duration: string;
    location: string;
    logoSrc: string;
    highlights: string[];
}

interface ProjectType {
    projectName: string;
    description: string;
    technologies: string[];
    duration: string;
    projectUrl?: string;
    githubUrl?: string;
    imageSrc: string;
    highlights: string[];
}

// Helper function to parse markdown links
const parseMarkdownLinks = (text: string): string => {
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
};

// Helper function to build image paths consistently
const getImagePath = (type: string, filename: string): string => {
    if (!filename) return '';
    
    const baseUrl = import.meta.env.BASE_URL;
    
    // Handle default_cover.jpg specifically - it's in the public root
    if (filename === 'default_cover.jpg') {
        return `${baseUrl}default_cover.jpg`;
    }
    
    switch (type) {
        case 'schools':
            return `${baseUrl}schools/${filename}`;
        case 'background':
            return `${baseUrl}background/${filename}`;
        default:
            return `${baseUrl}${filename}`;
    }
};

const Home = () => {
    const [activeSection, setActiveSection] = useState('about')

    const handleSectionChange = (sectionId: string) => {
        setActiveSection(sectionId);
    };

    // Helper function to render content dynamically based on navigation section type
    const renderNavigationSection = (sectionId: string) => {
        const navigationSection = config.home.navigation[sectionId];
        if (!navigationSection) return null;

        const { title, icon, type, content, items } = navigationSection;

        switch (type) {
            case 'about':
                return (
                    <div className={styles.rightContent}>
                        <div className={styles.introWrapper}>
                            <div className={styles.introTextSection}>
                                <div className={styles.aboutContent}>
                                    <h2>{icon} <span>{title}</span></h2>
                                    {content && 
                                        <p dangerouslySetInnerHTML={{ __html: parseMarkdownLinks(content) }} />
                                    }
                                </div>
                            </div>
                            {navigationSection.photo && (
                                <div className={styles.introImageSection}>
                                    <div className={styles.introPhotoWrapper}>
                                        <img 
                                            src={getImagePath('', navigationSection.photo)} 
                                            alt="About me" 
                                            className={styles.introPhoto}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'education':
                return (
                    <div className={styles.rightContent}>
                        <h2>{icon} <span>{title}</span></h2>
                        {items?.map((edu: Education, index: number) => (
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
                        <h2>{icon} <span>{title}</span></h2>
                        {items?.map((exp: WorkExperience, index: number) => (
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
                        <h2 id={`${sectionId}-section`}>{icon} <span>{title}</span></h2>
                        <div className={styles.projectsContainer}>
                            {items?.map((project: ProjectType, index: number) => (
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
                            <button 
                                className={styles.backToTopButton}
                                onClick={() => {
                                    const isMobile = window.innerWidth <= 768;
                                    if (isMobile) {
                                        const section = document.getElementById(`${sectionId}-section`);
                                        if (section) {
                                            section.scrollIntoView({ 
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                        }
                                    } else {
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
                                Back to {title} Top
                            </button>
                        </div>
                    </div>
                );

            case 'contact':
                return (
                    <div className={styles.rightContent}>
                        <h2>{icon} <span>{title}</span></h2>
                        {content && 
                            <p dangerouslySetInnerHTML={{ __html: parseMarkdownLinks(content) }} />
                        }
                        <div className={styles.contactSection}>
                            {navigationSection.email && (
                                <div className={styles.contactItem}>
                                    <i className="fas fa-envelope"></i>
                                    <a href={`mailto:${navigationSection.email}`}>{navigationSection.email}</a>
                                </div>
                            )}
                            {navigationSection.github && (
                                <div className={styles.contactItem}>
                                    <i className="fab fa-github"></i>
                                    <a href={navigationSection.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                                </div>
                            )}
                            {navigationSection.linkedin && (
                                <div className={styles.contactItem}>
                                    <i className="fab fa-linkedin"></i>
                                    <a href={navigationSection.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                </div>
                            )}
                            {navigationSection.twitter && (
                                <div className={styles.contactItem}>
                                    <i className="fab fa-twitter"></i>
                                    <a href={navigationSection.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
                                </div>
                            )}
                        </div>
                    </div>
                );

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
                    <h1>{config.home.hero.name}</h1>
                    <p>{config.home.hero.quote}</p>
                </div>
                <button 
                    className={styles.downArrow}
                    onClick={() => {
                        const aboutSection = document.getElementById('about');
                        if (aboutSection) {
                            aboutSection.scrollIntoView({ 
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }}
                >
                    <i className="fas fa-angle-down scroll-down-effects"></i>
                </button>
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
                            {renderNavigationSection(activeSection)}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            {/* Scroll to Top Button */}
            <ScrollToTop />
        </div>
    )
}

export default Home