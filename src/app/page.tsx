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
import { useIsAuthenticated } from "@/hooks/use-auth";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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

    // Check authentication status
    const { isAuthenticated, isLoading } = useIsAuthenticated();

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
                                <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                            </motion.div>
                            <span className="font-bold text-lg sm:text-xl text-gray-900">
                                AmaLearn
                            </span>
                        </motion.div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {!isLoading && (
                                <>
                                    {isAuthenticated ? (
                                        <Link href="/dashboard">
                                            <AnimatedButton
                                                size="lg"
                                                className="px-8 py-3 text-lg"
                                            >
                                                Go to Dashboard
                                            </AnimatedButton>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/login">
                                                <AnimatedButton
                                                    variant="ghost"
                                                    size="lg"
                                                    className="px-8 py-3 text-lg"
                                                >
                                                    Sign In
                                                </AnimatedButton>
                                            </Link>
                                            <Link href="/signup">
                                                <AnimatedButton
                                                    size="lg"
                                                    className="px-8 py-3 text-lg"
                                                >
                                                    Get Started
                                                </AnimatedButton>
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
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
                        className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto"
                        variants={staggerContainer}
                        initial="initial"
                        animate={heroInView ? "animate" : "initial"}
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge
                                variant="secondary"
                                className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base"
                            >
                                Association of Management Technology Students
                            </Badge>
                        </motion.div>

                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 leading-tight"
                            variants={fadeInUp}
                        >
                            Empowering Future
                            <motion.span
                                className="text-primary block"
                                variants={fadeInUp}
                            >
                                Project Managers
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto px-4"
                            variants={fadeInUp}
                        >
                            Access comprehensive course materials, and excel in
                            your Project Management Technology studies at Lagos
                            State University (LASU).
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
                            variants={fadeInUp}
                        >
                            {!isLoading && (
                                <>
                                    {isAuthenticated ? (
                                        <Link
                                            href="/dashboard"
                                            className="w-full sm:w-auto"
                                        >
                                            <AnimatedButton
                                                size="lg"
                                                className="text-lg px-8 py-3 w-full sm:w-auto inline-flex items-center justify-center"
                                            >
                                                Go to Dashboard
                                            </AnimatedButton>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href="/signup"
                                                className="w-full sm:w-auto"
                                            >
                                                <AnimatedButton
                                                    size="lg"
                                                    className="text-lg px-8 py-3 w-full sm:w-auto inline-flex items-center justify-center"
                                                >
                                                    Join fellow students
                                                </AnimatedButton>
                                            </Link>
                                            <Link
                                                href="/login"
                                                className="w-full sm:w-auto"
                                            >
                                                <AnimatedButton
                                                    variant="outline"
                                                    size="lg"
                                                    className="text-lg px-8 py-3 w-full sm:w-auto inline-flex items-center justify-center"
                                                >
                                                    Student login
                                                </AnimatedButton>
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </motion.div>

                        <motion.div
                            className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 pt-6 sm:pt-8"
                            variants={fadeInUp}
                        >
                            <div className="text-center">
                                <motion.div
                                    className="text-3xl sm:text-4xl font-bold text-gray-900"
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
                                    300+
                                </motion.div>
                                <div className="text-sm sm:text-base text-gray-600">
                                    AMATECH Students
                                </div>
                            </div>
                            <div className="text-center">
                                <motion.div
                                    className="text-3xl sm:text-4xl font-bold text-gray-900"
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
                                <div className="text-sm sm:text-base text-gray-600">
                                    PMT Course Materials
                                </div>
                            </div>
                            <div className="text-center">
                                <motion.div
                                    className="text-3xl sm:text-4xl font-bold text-gray-900"
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
                                    15+
                                </motion.div>
                                <div className="text-sm sm:text-base text-gray-600">
                                    Faculty & Tutors
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 sm:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center space-y-4 mb-12 sm:mb-16"
                        ref={featuresRef}
                        initial={{ opacity: 0, y: 60 }}
                        animate={
                            featuresInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 60 }
                        }
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                            Tailored for Project Management Technology
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                            Specialized tools and resources designed
                            specifically for AMATECH students to excel in
                            Project Management Technology studies
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate={featuresInView ? "animate" : "initial"}
                    >
                        {[
                            {
                                icon: BookOpen,
                                title: "PMT Course Materials",
                                description:
                                    "Access specialized Project Management Technology materials, lecture notes, and resources",
                            },
                            {
                                icon: Video,
                                title: "Recorded Lectures",
                                description:
                                    "Watch PMT lectures and interactive content from Lagos State University faculty",
                            },
                            {
                                icon: Users,
                                title: "Faculty & Peer Support",
                                description:
                                    "Connect with AMATECH faculty and fellow students for academic guidance",
                            },
                            {
                                icon: FileText,
                                title: "Past Questions Bank",
                                description:
                                    "Practice with organized collections of PMT past examination questions",
                            },
                            {
                                icon: Calendar,
                                title: "Academic Timetables",
                                description:
                                    "Stay organized with AMATECH class schedules and project deadlines",
                            },
                            {
                                icon: MessageCircle,
                                title: "AI Study Assistant",
                                description:
                                    "Get instant help with PMT concepts through our intelligent assistant",
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
                                                    "AMATECH Hub has transformed
                                                    my Project Management
                                                    Technology studies and
                                                    helped me excel in my
                                                    coursework."
                                                </p>
                                                <p className="text-gray-500 mt-2">
                                                    - AMATECH Final Year Student
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
                            What AMATECH Students Say
                        </h2>
                        <p className="text-xl text-gray-600">
                            Hear from fellow Project Management Technology
                            students about their experience with the platform
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
                                quote: "AMATECH Hub has all our PMT materials in one place! No more searching through scattered resources. It's been a game-changer for my studies.",
                                name: "Adebayo Johnson",
                                role: "PMT, 400L",
                                initials: "AJ",
                            },
                            {
                                quote: "The AI assistant helps me understand complex project management concepts instantly. Perfect for late-night study sessions!",
                                name: "Fatima Okonkwo",
                                role: "PMT, 300L",
                                initials: "FO",
                            },
                            {
                                quote: "The organized past questions and faculty support made my exam prep so much easier. Proud to be part of AMATECH!",
                                name: "Tunde Adebayo",
                                role: "PMT, 500L",
                                initials: "TA",
                            },
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                variants={slideInFromRight}
                                whileHover={{ y: -2 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 40,
                                }}
                            >
                                <Card className="border-0 shadow h-full">
                                    <CardContent className="p-8">
                                        <div className="space-y-6">
                                            <Quote className="h-10 w-10 text-primary mb-2" />
                                            <p className="text-gray-600 text-lg leading-relaxed">
                                                {testimonial.quote}
                                            </p>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <span className="text-primary font-semibold">
                                                        {testimonial.initials}
                                                    </span>
                                                </div>
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
            <section className="py-16 sm:py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        className="space-y-6 sm:space-y-8"
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                            Ready to Excel in Project Management Technology?
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                            Join your fellow AMATECH students who have
                            streamlined their studies with our centralized
                            learning platform designed specifically for Lagos
                            State University PMT students.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                            {!isLoading && (
                                <>
                                    {isAuthenticated ? (
                                        <Link
                                            href="/dashboard"
                                            className="w-full sm:w-auto"
                                        >
                                            <AnimatedButton
                                                size="lg"
                                                className="text-lg px-8 py-3 w-full sm:w-auto inline-flex items-center justify-center"
                                            >
                                                Go to Dashboard
                                            </AnimatedButton>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href="/signup"
                                                className="w-full sm:w-auto"
                                            >
                                                <AnimatedButton
                                                    size="lg"
                                                    className="text-lg px-8 py-3 w-full sm:w-auto inline-flex items-center justify-center"
                                                >
                                                    Join AMATECH Hub Now
                                                </AnimatedButton>
                                            </Link>
                                            <Link
                                                href="/login"
                                                className="w-full sm:w-auto"
                                            >
                                                <AnimatedButton
                                                    size="lg"
                                                    variant="outline"
                                                    className="text-lg px-8 py-3 w-full sm:w-auto inline-flex items-center justify-center"
                                                >
                                                    Student Login
                                                </AnimatedButton>
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 border-t py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        <div className="space-y-4 sm:col-span-2 md:col-span-1">
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
                                    <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                                </motion.div>
                                <span className="font-bold text-lg sm:text-xl text-gray-900">
                                    AMATECH Hub
                                </span>
                            </motion.div>
                            <p className="text-sm sm:text-base text-gray-600">
                                Empowering Project Management Technology
                                students at Lagos State University with
                                centralized learning resources and academic
                                support.
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
                        className="border-t border-gray-200 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-sm sm:text-base text-gray-600">
                            © {new Date().getFullYear()} AMATECH Learning Hub -
                            Association of Management Technology Students, Lagos
                            State University.{" "}
                            <br className="hidden sm:inline" />
                            Developed with ❤️ by the Student President. All
                            rights reserved.
                        </p>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
}
