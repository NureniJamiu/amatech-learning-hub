"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedGridBackground } from "@/components/ui/animated-grid-background";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Users,
    Calendar,
    GraduationCap,
    FileText,
    Clock,
    CheckCircle,
    Star,
    Quote,
    ArrowRight,
    Download,
    Video,
    MessageCircle,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
};

const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
};

const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
};

const slideInFromRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function LandingPage() {
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const benefitsRef = useRef(null);
    const testimonialsRef = useRef(null);

    const heroInView = useInView(heroRef, { once: true });
    const featuresInView = useInView(featuresRef, { once: true });
    const benefitsInView = useInView(benefitsRef, { once: true });
    const testimonialsInView = useInView(testimonialsRef, { once: true });

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <motion.nav
                className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 h-16"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        <motion.div
                            className="flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                        >
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <GraduationCap className="h-8 w-8 text-primary" />
                            </motion.div>
                            <span className="font-bold text-xl text-gray-900">
                                Amalearn
                            </span>
                        </motion.div>

                        <div className="flex items-center space-x-3">
                            <Link href="/login">
                                <AnimatedButton
                                    variant="ghost"
                                    size="lg"
                                    className="px-6 py-2"
                                >
                                    Sign In
                                </AnimatedButton>
                            </Link>
                            <Link href="/signup">
                                <AnimatedButton size="lg" className="px-6 py-2">
                                    Get Started
                                </AnimatedButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative min-h-[calc(100vh-4rem)] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
                <AnimatedGridBackground className="opacity-50" />
                <div className="max-w-7xl mx-auto relative z-10 w-full">
                    <motion.div
                        ref={heroRef}
                        className="text-center space-y-8 max-w-4xl mx-auto"
                        variants={staggerContainer}
                        initial="initial"
                        animate={heroInView ? "animate" : "initial"}
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge
                                variant="secondary"
                                className="px-4 py-2 text-base"
                            >
                                🎓 Academic Excellence Platform
                            </Badge>
                        </motion.div>

                        <motion.h1
                            className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight"
                            variants={fadeInUp}
                        >
                            Your Gateway to
                            <motion.span
                                className="text-primary block"
                                variants={fadeInUp}
                            >
                                Academic Success
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
                            variants={fadeInUp}
                        >
                            Access comprehensive course materials, connect with
                            expert tutors, and excel in your academic journey
                            with our state-of-the-art learning management
                            system.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            variants={fadeInUp}
                        >
                            <Link href="/signup">
                                <AnimatedButton
                                    size="lg"
                                    className="text-lg p-8 w-auto inline-flex items-center"
                                >
                                    Start Learning Today
                                </AnimatedButton>
                            </Link>
                            <Link href="/login">
                                <AnimatedButton
                                    variant="outline"
                                    size="lg"
                                    className="text-lg p-8 w-auto inline-flex items-center"
                                >
                                    Access Your Account
                                </AnimatedButton>
                            </Link>
                        </motion.div>

                        <motion.div
                            className="flex items-center justify-center space-x-12 pt-8"
                            variants={fadeInUp}
                        >
                            <div className="text-center">
                                <motion.div
                                    className="text-4xl font-bold text-gray-900"
                                    whileHover={{
                                        scale: 1.1,
                                        color: "#22c55e",
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                    }}
                                >
                                    500+
                                </motion.div>
                                <div className="text-gray-600">
                                    Active Students
                                </div>
                            </div>
                            <div className="text-center">
                                <motion.div
                                    className="text-4xl font-bold text-gray-900"
                                    whileHover={{
                                        scale: 1.1,
                                        color: "#22c55e",
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                    }}
                                >
                                    150+
                                </motion.div>
                                <div className="text-gray-600">
                                    Course Materials
                                </div>
                            </div>
                            <div className="text-center">
                                <motion.div
                                    className="text-4xl font-bold text-gray-900"
                                    whileHover={{
                                        scale: 1.1,
                                        color: "#22c55e",
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                    }}
                                >
                                    50+
                                </motion.div>
                                <div className="text-gray-600">
                                    Expert Tutors
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center space-y-4 mb-16"
                        ref={featuresRef}
                        initial={{ opacity: 0, y: 60 }}
                        animate={
                            featuresInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 60 }
                        }
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Comprehensive Learning Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need for academic success, from
                            course materials to expert guidance
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate={featuresInView ? "animate" : "initial"}
                    >
                        {[
                            {
                                icon: BookOpen,
                                title: "Course Materials",
                                description:
                                    "Access comprehensive study materials, lecture notes, and academic resources",
                            },
                            {
                                icon: Video,
                                title: "Video Lectures",
                                description:
                                    "Watch recorded lectures and interactive video content anytime, anywhere",
                            },
                            {
                                icon: Users,
                                title: "Expert Tutors",
                                description:
                                    "Connect with qualified tutors for personalized guidance and support",
                            },
                            {
                                icon: FileText,
                                title: "Past Questions",
                                description:
                                    "Practice with extensive collections of past examination questions",
                            },
                            {
                                icon: Calendar,
                                title: "Study Timetables",
                                description:
                                    "Organize your study schedule with intelligent timetable management",
                            },
                            {
                                icon: MessageCircle,
                                title: "AI Assistant",
                                description:
                                    "Get instant help with our AI-powered academic assistant",
                            },
                        ].map((feature, index) => {
                            const FeatureCard = () => {
                                const [isHovered, setIsHovered] =
                                    useState(false);

                                return (
                                    <motion.div
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        whileHover={{
                                            y: -8,
                                            boxShadow:
                                                "0 25px 50px rgba(0, 0, 0, 0.1)",
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 25,
                                        }}
                                    >
                                        <Card className="border-0 shadow-lg h-full">
                                            <CardHeader>
                                                <motion.div
                                                    className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4"
                                                    animate={{
                                                        scale: isHovered
                                                            ? 1.1
                                                            : 1,
                                                        backgroundColor:
                                                            isHovered
                                                                ? "rgba(34, 197, 94, 0.2)"
                                                                : "rgba(34, 197, 94, 0.1)",
                                                        rotate: isHovered
                                                            ? 360
                                                            : 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.6,
                                                    }}
                                                >
                                                    <feature.icon className="h-8 w-8 text-primary" />
                                                </motion.div>
                                                <CardTitle className="text-xl">
                                                    {feature.title}
                                                </CardTitle>
                                                <CardDescription className="text-base">
                                                    {feature.description}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </motion.div>
                                );
                            };

                            return (
                                <motion.div key={index} variants={fadeInUp}>
                                    <FeatureCard />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        ref={benefitsRef}
                        className="grid lg:grid-cols-2 gap-16 items-center"
                        variants={staggerContainer}
                        initial="initial"
                        animate={benefitsInView ? "animate" : "initial"}
                    >
                        <motion.div className="space-y-8" variants={fadeInLeft}>
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                                    Why Choose Our Platform?
                                </h2>
                                <p className="text-xl text-gray-600">
                                    Experience the difference with our
                                    comprehensive academic support system
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    {
                                        title: "24/7 Access",
                                        description:
                                            "Study at your own pace with round-the-clock access to materials",
                                    },
                                    {
                                        title: "Expert Support",
                                        description:
                                            "Get help from qualified academic professionals",
                                    },
                                    {
                                        title: "Progressive Learning",
                                        description:
                                            "Track your progress and identify areas for improvement",
                                    },
                                    {
                                        title: "Community Learning",
                                        description:
                                            "Connect with peers and collaborate on academic projects",
                                    },
                                ].map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-start space-x-4"
                                        whileHover={{ x: 10 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 25,
                                        }}
                                    >
                                        <motion.div
                                            whileHover={{
                                                scale: 1.2,
                                                rotate: 360,
                                            }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <CheckCircle className="h-8 w-8 text-primary mt-0.5 flex-shrink-0" />
                                        </motion.div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {benefit.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div className="relative" variants={fadeInRight}>
                            <motion.div
                                whileHover={{ y: -10, rotateY: 5 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                }}
                            >
                                <Card className="border-0 shadow-2xl">
                                    <CardContent className="p-10">
                                        <div className="space-y-8">
                                            <div className="text-center">
                                                <motion.div
                                                    className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
                                                    whileHover={{
                                                        scale: 1.1,
                                                        backgroundColor:
                                                            "rgba(34, 197, 94, 0.2)",
                                                        rotate: 360,
                                                    }}
                                                    transition={{
                                                        duration: 0.6,
                                                    }}
                                                >
                                                    <Star className="h-10 w-10 text-primary" />
                                                </motion.div>
                                                <h3 className="text-2xl font-semibold text-gray-900">
                                                    Proven Results
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 text-center">
                                                <motion.div
                                                    className="p-6 bg-primary/5 rounded-xl"
                                                    whileHover={{
                                                        scale: 1.05,
                                                        backgroundColor:
                                                            "rgba(34, 197, 94, 0.1)",
                                                    }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 25,
                                                    }}
                                                >
                                                    <div className="text-3xl font-bold text-primary">
                                                        95%
                                                    </div>
                                                    <div className="text-gray-600">
                                                        Success Rate
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    className="p-6 bg-primary/5 rounded-xl"
                                                    whileHover={{
                                                        scale: 1.05,
                                                        backgroundColor:
                                                            "rgba(34, 197, 94, 0.1)",
                                                    }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 25,
                                                    }}
                                                >
                                                    <div className="text-3xl font-bold text-primary">
                                                        4.8/5
                                                    </div>
                                                    <div className="text-gray-600">
                                                        Student Rating
                                                    </div>
                                                </motion.div>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-gray-600 italic text-lg">
                                                    "This platform transformed
                                                    my academic journey and
                                                    helped me achieve excellence
                                                    in my studies."
                                                </p>
                                                <p className="text-gray-500 mt-2">
                                                    - Final Year Student
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center space-y-4 mb-16"
                        initial={{ opacity: 0, y: 60 }}
                        animate={
                            testimonialsInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 60 }
                        }
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            What Students Say
                        </h2>
                        <p className="text-xl text-gray-600">
                            Hear from our successful students about their
                            experience
                        </p>
                    </motion.div>

                    <motion.div
                        ref={testimonialsRef}
                        className="grid md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate={testimonialsInView ? "animate" : "initial"}
                    >
                        {[
                            {
                                quote: "The comprehensive study materials and expert tutors helped me improve my grades significantly. Highly recommended!",
                                name: "Adebayo Johnson",
                                role: "Computer Science, 400L",
                                initials: "AJ",
                            },
                            {
                                quote: "The AI assistant feature is incredible! It helps me understand complex concepts and provides instant clarifications.",
                                name: "Fatima Okonkwo",
                                role: "Mathematics, 300L",
                                initials: "FO",
                            },
                            {
                                quote: "The past questions collection is extensive and well-organized. It made my exam preparation much more effective.",
                                name: "Tunde Adebayo",
                                role: "Engineering, 500L",
                                initials: "TA",
                            },
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                variants={slideInFromRight}
                                whileHover={{ y: -8, rotateY: 5 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                }}
                            >
                                <Card className="border-0 shadow-lg h-full">
                                    <CardContent className="p-8">
                                        <div className="space-y-6">
                                            <motion.div
                                                whileHover={{
                                                    scale: 1.1,
                                                    rotate: 15,
                                                }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Quote className="h-10 w-10 text-primary" />
                                            </motion.div>
                                            <p className="text-gray-600 text-lg leading-relaxed">
                                                {testimonial.quote}
                                            </p>
                                            <div className="flex items-center space-x-4">
                                                <motion.div
                                                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
                                                    whileHover={{
                                                        scale: 1.1,
                                                        backgroundColor:
                                                            "rgba(34, 197, 94, 0.2)",
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                >
                                                    <span className="text-primary font-semibold">
                                                        {testimonial.initials}
                                                    </span>
                                                </motion.div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 text-lg">
                                                        {testimonial.name}
                                                    </div>
                                                    <div className="text-gray-600">
                                                        {testimonial.role}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(34,197,94,0.1),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_50%)]"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Ready to Excel in Your Academics?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join thousands of students who have transformed
                            their academic journey with our comprehensive
                            learning platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/signup">
                                <AnimatedButton
                                    size="lg"
                                    className="text-lg p-8 w-auto inline-flex items-center"
                                >
                                    Start Learning Now
                                </AnimatedButton>
                            </Link>
                            <Link href="/contact">
                                <AnimatedButton
                                    size="lg"
                                    variant="outline"
                                    className="text-lg p-8 w-auto inline-flex items-center"
                                >
                                    Access Your Account
                                </AnimatedButton>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 border-t py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid md:grid-cols-4 gap-8"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        <div className="space-y-4">
                            <motion.div
                                className="flex items-center space-x-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                }}
                            >
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <GraduationCap className="h-8 w-8 text-primary" />
                                </motion.div>
                                <span className="font-bold text-xl text-gray-900">
                                    Amalearn
                                </span>
                            </motion.div>
                            <p className="text-gray-600">
                                Empowering students with comprehensive academic
                                resources and expert guidance.
                            </p>
                        </div>

                        {[
                            {
                                title: "Platform",
                                links: [
                                    "Features",
                                    "Courses",
                                    "Tutors",
                                    "Pricing",
                                ],
                            },
                            {
                                title: "Support",
                                links: [
                                    "Help Center",
                                    "Contact Us",
                                    "FAQ",
                                    "Community",
                                ],
                            },
                            {
                                title: "Legal",
                                links: [
                                    "Privacy Policy",
                                    "Terms of Service",
                                    "Cookie Policy",
                                ],
                            },
                        ].map((section, index) => (
                            <div key={index} className="space-y-4">
                                <h3 className="font-semibold text-lg text-gray-900">
                                    {section.title}
                                </h3>
                                <div className="space-y-2">
                                    {section.links.map((link, linkIndex) => (
                                        <motion.a
                                            key={linkIndex}
                                            href="#"
                                            className="block text-gray-600 hover:text-gray-900 transition-colors"
                                            whileHover={{ x: 5 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 25,
                                            }}
                                        >
                                            {link}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="border-t border-gray-200 mt-12 pt-8 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-gray-600">
                            © {new Date().getFullYear()} Association of
                            Management Technology Students Learning Hub. <br />
                            All rights reserved.
                        </p>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
}
