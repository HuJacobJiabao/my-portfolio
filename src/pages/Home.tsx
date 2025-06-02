import { useState } from 'react'
import styles from "../styles/Home.module.css"
import EducationCard from "../components/EducationCard"
import WorkCard from "../components/WorkCard"

const Home = () => {
    const [activeSection, setActiveSection] = useState('intro')

    const sections = [
        { id: 'intro', title: 'About Me', icon: '👤' },
        { id: 'education', title: 'Education', icon: '🎓' },
        { id: 'experience', title: 'Work Experience', icon: '💼' }
    ]

    const renderRightContent = () => {
        switch(activeSection) {
            case 'intro':
                return (
                    <div className={styles.rightContent}>
                        <div className={styles.photoWrapper}>
                            <img src={`${import.meta.env.BASE_URL}seattle.jpg`} alt="Jiabao Hu" className={styles.photo} />
                        </div>
                        <div className={styles.aboutContent}>
                            <h2>Jiabao Hu</h2>
                            <p>
                                Hi, I'm Jiabao, currently a Master's student in 
                                <a href="https://www.cs.usc.edu/academic-programs/masters/">Computer Science</a> at 
                                <a href="https://www.usc.edu/">University of Southern California (USC)</a>. I'm a passionate developer with a love for front-end design,
                                interactive experiences, and elegant code. I enjoy transforming creative
                                ideas into beautiful, functional websites, and I thrive on crafting digital
                                experiences that feel alive and engaging.
                            </p>
                        </div>
                    </div>
                )
            case 'education':
                return (
                    <div className={styles.rightContent}>
                        <h2>🎓 Education</h2>
                        
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
                        <h2>💼 Work Experience</h2>
                        
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
                        <div className={styles.leftSidebar}>
                            {/* Profile Card with Integrated Contact Info */}
                            <div className={styles.profileCard}>
                                <div className={styles.photoWrapper}>
                                    <img src={`${import.meta.env.BASE_URL}favicon.png`} alt="Jiabao Hu" className={styles.photo} />
                                </div>
                                <h3 className={styles.profileName}>Jiabao Hu</h3>
                                <p className={styles.profileTitle}>Full-stack Developer</p>
                                <p className={styles.profileTitle}>MSCS at USC</p>
                                <div className={styles.contactCard}>
                                    <div className={styles.contactList}>
                                        <a href="mailto:hujiabao1224@gmail.com" className={styles.contactItem}>
                                            <i className="fas fa-envelope"></i>
                                        </a>
                                        <a href="https://github.com/HuJacobJiabao" className={styles.contactItem}>
                                            <i className="fab fa-github"></i>
                                        </a>
                                        <a href="https://www.linkedin.com/in/jiabao-hu-920664221/" className={styles.contactItem}>
                                            <i className="fab fa-linkedin"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>


                            {/* Navigation Card */}
                            <div className={styles.navigationCard}>
                                <h4>Navigation</h4>
                                <nav className={styles.navList}>
                                    {sections.map(section => (
                                        <button
                                            key={section.id}
                                            className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                                            onClick={() => setActiveSection(section.id)}
                                        >
                                            <span className={styles.navIcon}>{section.icon}</span>
                                            <span>{section.title}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

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
        </div>
    )
}

export default Home