import styles from "../styles/Home.module.css"

const Home = () => {
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


            {/** Middle self introduction section*/}
            <section id="about" className={styles.about}>
                <div className={styles.aboutContent}>
                    <h2>About Me</h2>
                    <p>
                        Hi, I'm Jiabao — a passionate developer with a love for front-end design, interactive experiences, and elegant code.
                        I enjoy transforming creative ideas into beautiful, functional websites, and I thrive on crafting digital experiences that feel alive and engaging.
                    </p>
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