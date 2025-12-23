import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import feather from 'feather-icons';
import '../../About/css/About.css';

const About = () => {
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        // Initialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Intersection Observer for animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({
                            ...prev,
                            [entry.target.dataset.section]: true
                        }));
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '-50px 0px'
            }
        );

        // Observe all sections
        document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const stats = [
        { id: 1, value: '12+', label: 'Years Experience' },
        { id: 2, value: '5,000+', label: 'Happy Families' },
        { id: 3, value: '$2.5B+', label: 'In Sales' },
        { id: 4, value: '50+', label: 'Cities Served' }
    ];

    const team = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'CEO & Founder',
            image: 'http://static.photos/people/300x300/1',
            description: 'With over 15 years in real estate, Sarah leads our vision and strategy.',
            social: {
                linkedin: '#',
                twitter: '#',
                email: 'sarah@homehaven.com'
            }
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Chief Operations Officer',
            image: 'http://static.photos/people/300x300/2',
            description: 'Michael ensures our operations run smoothly across all locations.',
            social: {
                linkedin: '#',
                twitter: '#',
                email: 'michael@homehaven.com'
            }
        },
        {
            id: 3,
            name: 'David Wilson',
            role: 'Chief Technology Officer',
            image: 'http://static.photos/people/300x300/3',
            description: 'David drives our digital innovation and platform development.',
            social: {
                linkedin: '#',
                twitter: '#',
                email: 'david@homehaven.com'
            }
        }
    ];

    const values = [
        {
            id: 1,
            icon: 'heart',
            title: 'Client First',
            description: 'We put our clients\' needs above all else, building lasting relationships based on trust.'
        },
        {
            id: 2,
            icon: 'award',
            title: 'Excellence',
            description: 'We strive for excellence in every transaction, delivering exceptional results.'
        },
        {
            id: 3,
            icon: 'users',
            title: 'Integrity',
            description: 'We conduct business with honesty, transparency, and ethical practices.'
        },
        {
            id: 4,
            icon: 'zap',
            title: 'Innovation',
            description: 'We embrace technology and new ideas to improve the real estate experience.'
        },
        {
            id: 5,
            icon: 'globe',
            title: 'Community',
            description: 'We\'re committed to building stronger communities through responsible growth.'
        },
        {
            id: 6,
            icon: 'smile',
            title: 'Joy',
            description: 'We bring enthusiasm and positivity to the home buying and selling journey.'
        }
    ];

    return (
        <div className="about-page">
            <main className="about-container">
                {/* Hero Section */}
                <section className="about-hero" data-section="hero">
                    <div className="hero-overlay"></div>
                    <div className="hero-background">
                        <img 
                            src="http://static.photos/office/1200x630/1" 
                            alt="Our Team" 
                            className="hero-image"
                            loading="lazy"
                        />
                    </div>
                    <div className="hero-content">
                        <div className={`hero-text ${isVisible.hero ? 'animate-fade-up' : ''}`}>
                            <h1 className="hero-title">Our Story & Mission</h1>
                            <p className="hero-subtitle">
                                Helping families find their perfect home since 2010
                            </p>
                        </div>
                    </div>
                </section>

                {/* About Content */}
                <section 
                    className="about-content-section" 
                    data-section="content"
                >
                    <div className={`content-grid ${isVisible.content ? 'animate-fade-up' : ''}`}>
                        <div className="content-text">
                            <h2 className="section-title">Who We Are</h2>
                            <div className="text-content">
                                <p className="paragraph">
                                    HomeHaven was founded in 2010 with a simple mission: to make finding and buying a home as seamless and stress-free as possible. What started as a small team of passionate real estate professionals has grown into one of the most trusted names in the industry.
                                </p>
                                <p className="paragraph">
                                    We believe everyone deserves a home that fits their lifestyle and budget. Our team of expert agents combines local market knowledge with cutting-edge technology to deliver exceptional service to our clients.
                                </p>
                                <div className="highlight-box">
                                    <p className="highlight-text">
                                        "Our vision is to revolutionize the real estate experience through transparency, innovation, and personalized service."
                                    </p>
                                </div>
                                <div className="cta-buttons">
                                    <Link to="/contact" className="cta-button primary">
                                        Contact Us
                                    </Link>
                                    <Link to="/careers" className="cta-button secondary">
                                        Join Our Team
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="content-image">
                            <div className="image-container">
                                <img 
                                    src="http://static.photos/people/1200x800/1" 
                                    alt="Our Team" 
                                    className="team-image"
                                    loading="lazy"
                                />
                                <div className="image-overlay">
                                    <p className="overlay-text">Our dedicated team of real estate experts</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section 
                    className="stats-section" 
                    data-section="stats"
                >
                    <div className={`stats-container ${isVisible.stats ? 'animate-fade-up' : ''}`}>
                        <div className="stats-grid">
                            {stats.map((stat) => (
                                <div key={stat.id} className="stat-item">
                                    <div className="stat-value">{stat.value}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="stats-note">
                            <p>And growing every day</p>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section 
                    className="team-section" 
                    data-section="team"
                >
                    <div className={`team-container ${isVisible.team ? 'animate-fade-up' : ''}`}>
                        <div className="section-header">
                            <h2 className="section-title text-center">Meet Our Leadership</h2>
                            <p className="section-subtitle text-center">
                                The passionate team behind HomeHaven's success
                            </p>
                        </div>
                        <div className="team-grid">
                            {team.map((member) => (
                                <div key={member.id} className="team-card">
                                    <div className="team-image-container">
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            className="team-member-image"
                                            loading="lazy"
                                        />
                                        <div className="team-social">
                                            <a 
                                                href={member.social.linkedin} 
                                                className="social-link"
                                                aria-label={`Connect with ${member.name} on LinkedIn`}
                                            >
                                                <i data-feather="linkedin"></i>
                                            </a>
                                            <a 
                                                href={member.social.twitter} 
                                                className="social-link"
                                                aria-label={`Follow ${member.name} on Twitter`}
                                            >
                                                <i data-feather="twitter"></i>
                                            </a>
                                            <a 
                                                href={`mailto:${member.social.email}`} 
                                                className="social-link"
                                                aria-label={`Email ${member.name}`}
                                            >
                                                <i data-feather="mail"></i>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="team-info">
                                        <h3 className="team-member-name">{member.name}</h3>
                                        <p className="team-member-role">{member.role}</p>
                                        <p className="team-member-description">{member.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="team-cta">
                            <Link to="/team" className="view-team-button">
                                Meet Full Team
                                <i data-feather="arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section 
                    className="values-section" 
                    data-section="values"
                >
                    <div className={`values-container ${isVisible.values ? 'animate-fade-up' : ''}`}>
                        <div className="section-header">
                            <h2 className="section-title text-center">Our Core Values</h2>
                            <p className="section-subtitle text-center">
                                The principles that guide everything we do
                            </p>
                        </div>
                        <div className="values-grid">
                            {values.map((value) => (
                                <div key={value.id} className="value-card">
                                    <div className="value-icon-container">
                                        <i data-feather={value.icon} className="value-icon"></i>
                                    </div>
                                    <h3 className="value-title">{value.title}</h3>
                                    <p className="value-description">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* History Timeline (Optional) */}
                <section 
                    className="timeline-section" 
                    data-section="timeline"
                >
                    <div className={`timeline-container ${isVisible.timeline ? 'animate-fade-up' : ''}`}>
                        <h2 className="section-title text-center">Our Journey</h2>
                        <div className="timeline">
                            <div className="timeline-item">
                                <div className="timeline-year">2010</div>
                                <div className="timeline-content">
                                    <h4>HomeHaven Founded</h4>
                                    <p>Started with a small office and big dreams</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-year">2014</div>
                                <div className="timeline-content">
                                    <h4>First 100 Homes</h4>
                                    <p>Helped 100 families find their perfect homes</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-year">2018</div>
                                <div className="timeline-content">
                                    <h4>Digital Platform Launch</h4>
                                    <p>Introduced our innovative online property platform</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-year">2023</div>
                                <div className="timeline-content">
                                    <h4>$2.5B in Sales</h4>
                                    <p>Milestone achievement in total property sales</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default About;