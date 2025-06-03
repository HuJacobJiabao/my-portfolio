import { useState } from 'react'
import styles from "../styles/Home.module.css"
import EducationCard from "../components/EducationCard"
import WorkCard from "../components/WorkCard"
import ProjectCard from "../components/ProjectCard"
import Sidebar from "../components/Sidebar"
import ScrollToTop from "../components/ScrollToTop"

const Home = () => {
    const [activeSection, setActiveSection] = useState('intro')

    const handleSectionChange = (sectionId: string) => {
        setActiveSection(sectionId);
    };

    const renderRightContent = () => {
        switch(activeSection) {
            case 'intro':
                return (
                    <div className={styles.rightContent}>
                        <div className={styles.introWrapper}>
                            <div className={styles.introTextSection}>
                                <div className={styles.aboutContent}>
                                    <h2>👤 <span>About Me</span></h2>
                                    <p>
                                        Hi, I'm Jiabao, currently a Master's student in 
                                        <a href="https://www.cs.usc.edu/academic-programs/masters/"> Computer Science</a> at 
                                        <a href="https://www.usc.edu/"> University of Southern California (USC)</a>. I'm a passionate developer with a love for front-end design,
                                        interactive experiences, and elegant code. I enjoy transforming creative
                                        ideas into beautiful, functional websites, and I thrive on crafting digital
                                        experiences that feel alive and engaging.
                                    </p>
                                </div>
                            </div>
                            <div className={styles.introImageSection}>
                                <div className={styles.introPhotoWrapper}>
                                    <img src={`${import.meta.env.BASE_URL}seattle.jpg`} alt="Jiabao Hu" className={styles.introPhoto} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 'education':
                return (
                    <div className={styles.rightContent}>
                        <h2>🎓 <span>Education</span></h2>
                        
                        <EducationCard 
                            schoolName="University of Southern California"
                            degree="Master of Science in Computer Science"
                            duration="Aug. 2023 - Dec. 2025"
                            location="Los Angeles, CA"
                            logoSrc={`${import.meta.env.BASE_URL}usc.png`}
                            logoAlt="USC Logo"
                            highlights={[
                                "Related Courses: Operating System, Computer Networking, Algorithm, Web Technologies, Database System, Information Retrieval"
                            ]}
                        />

                        <EducationCard
                            schoolName="University of Illinois at Urbana-Champaign"
                            degree="Bachelor of Science in Civil Engineering with Honors"
                            duration="Sep. 2019 - Jun. 2023"
                            location="Urbana, IL"
                            logoSrc={`${import.meta.env.BASE_URL}uiuc.png`}
                            logoAlt="UIUC Logo"
                            highlights={[
                                "Minor in Computer Science"
                            ]}
                        />

                        <EducationCard 
                            schoolName="Zhejiang University"
                            degree="Bachelor of Engineering in Civil Engineering"
                            duration="Sep. 2019 - Jun. 2023"
                            location="Hangzhou, China"
                            logoSrc={`${import.meta.env.BASE_URL}zju.png`}
                            logoAlt="ZJU Logo"
                            highlights={[]}
                        />
                    </div>
                )
            case 'experience':
                return (
                    <div className={styles.rightContent}>
                        <h2>💼 <span>Work Experience</span></h2>
                        
                        <WorkCard 
                            companyName="Zhejiang University/University of Illinois Urbana-Champaign Institute"
                            position="Undergraduate Research Assistant"
                            duration="Sep 2022 - Apr 2023"
                            location="Haining, China"
                            logoSrc={`${import.meta.env.BASE_URL}zjui.jpg`}
                            logoAlt="ZJU Logo"
                            highlights={[
                                "Engineered a modular 3D simulation platform in Python/Blender",
                                "Built scalable data generation pipelines for CV model training",
                                "Integrated and trained deep learning pipelines (PyTorch)"
                            ]}
                        />
                    </div>
                )
            case 'projects':
                return (
                    <div className={styles.rightContent}>
                        <h2>💻 <span>Projects</span></h2>
                        
                        <ProjectCard 
                            projectName="Portfolio Website"
                            description="A modern, responsive portfolio website built with React and TypeScript"
                            technologies={["React", "TypeScript", "CSS Modules", "Vite"]}
                            duration="Dec 2024 - Jan 2025"
                            projectUrl="https://github.com/HuJacobJiabao/my-portfolio"
                            imageSrc={`${import.meta.env.BASE_URL}hero.jpg`}
                            imageAlt="Portfolio Project"
                            highlights={[
                                "Responsive design with mobile-first approach",
                                "Component-based architecture with reusable cards",
                                "Modern UI with glass morphism effects and animations"
                            ]}
                        />

                        <ProjectCard 
                            projectName="3D Simulation Platform"
                            description="A modular 3D simulation platform for computer vision research"
                            technologies={["Python", "Blender", "PyTorch", "OpenCV"]}
                            duration="Sep 2022 - Apr 2023"
                            imageSrc={`${import.meta.env.BASE_URL}about.jpg`}
                            imageAlt="3D Simulation Project"
                            highlights={[
                                "Built scalable data generation pipelines",
                                "Integrated deep learning training workflows",
                                "Modular architecture for extensibility"
                            ]}
                        />
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className={styles.wrapper}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1>Jiabao Hu</h1>
                    <p>Let life be beautiful like summer flowers and death like autumn leaves.</p>
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
                    <p>© 2025 Jiabao Hu. All rights reserved.</p>
                    <p>Welcome to my portfolio website!</p>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            <ScrollToTop />
        </div>
    )
}

export default Home