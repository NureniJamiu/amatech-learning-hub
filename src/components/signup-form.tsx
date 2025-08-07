"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CustomPassword from "./custom-password";
import CustomPasswordConfirmation from "./custom-password-confirmation";
import CustomSelect from "./custom-select";
import { useRegister } from "@/hooks/use-auth";
import { redirectIfAuthenticated } from "@/utils/auth-utils";
import Link from "next/link";
import { toast } from "react-toastify";

interface SignupFormData {
    firstname: string;
    lastname: string;
    email: string;
    level: string;
    password: string;
    passwordConfirmation: string;
}

interface FormErrors {
    firstname?: string;
    lastname?: string;
    email?: string;
    level?: string;
    password?: string;
    passwordConfirmation?: string;
    general?: string;
}

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [formData, setFormData] = useState<SignupFormData>({
        firstname: "",
        lastname: "",
        email: "",
        level: "",
        password: "",
        passwordConfirmation: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const router = useRouter();
    const {
        mutate: register,
        isPending,
        error: registerError,
    } = useRegister({
        onSuccess: () => {
            toast.success("Signup successful! Welcome to Amatech Lasu.");
            router.push("/dashboard");
        },
        onError: (err: any) => {
            toast.error(err?.message || "Signup failed. Please try again.");
        },
    });

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.firstname.trim())
            newErrors.firstname = "First name is required";
        if (!formData.lastname.trim())
            newErrors.lastname = "Last name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Please enter a valid email address";
        if (!formData.level) newErrors.level = "Level is required";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8)
            newErrors.password = "Password must be at least 8 characters";
        if (!formData.passwordConfirmation)
            newErrors.passwordConfirmation = "Please confirm your password";
        else if (formData.password !== formData.passwordConfirmation)
            newErrors.passwordConfirmation = "Passwords do not match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof SignupFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field])
            setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            register({
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.password,
                level: formData.level,
            });
        }
    };

    useEffect(() => {
        redirectIfAuthenticated();
    }, []);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">
                                    Create an Account
                                </h1>
                                <p className="text-muted-foreground text-balance">
                                    Signup for your student account
                                </p>
                            </div>
                            {(registerError || errors.general) && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {registerError?.message ||
                                            errors.general ||
                                            "Signup failed. Please try again."}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-3">
                                    <Label htmlFor="firstname">Firstname</Label>
                                    <Input
                                        id="firstname"
                                        type="text"
                                        placeholder="John"
                                        value={formData.firstname}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "firstname",
                                                e.target.value
                                            )
                                        }
                                        required
                                        disabled={isPending}
                                        className={cn(
                                            errors.firstname &&
                                                "border-red-500 focus-visible:ring-red-500"
                                        )}
                                    />
                                    {errors.firstname && (
                                        <p className="text-sm text-red-500">
                                            {errors.firstname}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="lastname">Lastname</Label>
                                    <Input
                                        id="lastname"
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.lastname}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "lastname",
                                                e.target.value
                                            )
                                        }
                                        required
                                        disabled={isPending}
                                        className={cn(
                                            errors.lastname &&
                                                "border-red-500 focus-visible:ring-red-500"
                                        )}
                                    />
                                    {errors.lastname && (
                                        <p className="text-sm text-red-500">
                                            {errors.lastname}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        required
                                        disabled={isPending}
                                        className={cn(
                                            errors.email &&
                                                "border-red-500 focus-visible:ring-red-500"
                                        )}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <CustomSelect
                                        label="Level"
                                        options={[
                                            {
                                                value: "100",
                                                label: "100 Level",
                                            },
                                            {
                                                value: "200",
                                                label: "200 Level",
                                            },
                                            {
                                                value: "300",
                                                label: "300 Level",
                                            },
                                            {
                                                value: "400",
                                                label: "400 Level",
                                            },
                                            {
                                                value: "500",
                                                label: "500 Level",
                                            },
                                        ]}
                                        value={formData.level}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "level",
                                                e.target.value
                                            )
                                        }
                                        disabled={isPending}
                                        className={cn(
                                            errors.level &&
                                                "border-red-500 focus-visible:ring-red-500"
                                        )}
                                    />
                                    {errors.level && (
                                        <p className="text-sm text-red-500">
                                            {errors.level}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-3">
                                <CustomPassword
                                    value={formData.password}
                                    onChange={(val) =>
                                        handleInputChange("password", val)
                                    }
                                    disabled={isPending}
                                    className={cn(
                                        errors.password &&
                                            "border-red-500 focus-visible:ring-red-500"
                                    )}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <CustomPasswordConfirmation
                                    value={formData.passwordConfirmation}
                                    onChange={(val) =>
                                        handleInputChange(
                                            "passwordConfirmation",
                                            val
                                        )
                                    }
                                    disabled={isPending}
                                    className={cn(
                                        errors.passwordConfirmation &&
                                            "border-red-500 focus-visible:ring-red-500"
                                    )}
                                />
                                {errors.passwordConfirmation && (
                                    <p className="text-sm text-red-500">
                                        {errors.passwordConfirmation}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending}
                            >
                                {isPending ? "Signing up..." : "Signup"}
                            </Button>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/images/login.jpg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover object-right dark:brightness-[5] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
