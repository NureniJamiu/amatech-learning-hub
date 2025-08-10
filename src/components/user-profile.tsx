"use client";

import { useState, useEffect } from "react";
import { Edit, Save, X, Upload, User as UserIcon } from "lucide-react";
import { toast } from "react-toastify";

import { useAppContext } from "@/context/app-context";
import {
  useUpdateProfile,
  useUploadAvatar,
  useProfileCompletion,
  type ProfileUpdateData,
} from "@/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { FormSection, FormField, FormGrid, FormActions } from "@/components/ui/form-layout";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { currentUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileUpdateData>({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    matricNumber: currentUser?.matricNumber ?? "",
    level: currentUser?.level ?? 100,
    currentSemester: currentUser?.currentSemester ?? 1,
  });

  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const profileCompletion = useProfileCompletion(currentUser);

  // Update form data when current user changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name ?? "",
        email: currentUser.email ?? "",
        matricNumber: currentUser.matricNumber ?? "",
        level: currentUser.level ?? 100,
        currentSemester: currentUser.currentSemester ?? 1,
      });
    }
  }, [currentUser]);

  const handleInputChange = (field: keyof ProfileUpdateData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to current user data
    setFormData({
      name: currentUser?.name ?? "",
      email: currentUser?.email ?? "",
      matricNumber: currentUser?.matricNumber ?? "",
      level: currentUser?.level ?? 100,
      currentSemester: currentUser?.currentSemester ?? 1,
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Use toast.promise for better UX
    toast.promise(
      uploadAvatarMutation.mutateAsync(file),
      {
        pending: "Uploading avatar...",
        success: "Avatar updated successfully! 🎉",
        error: "Failed to upload avatar. Please try again."
      }
    );

    // Clear the input value so the same file can be selected again if needed
    event.target.value = '';
  };

  if (!currentUser) {
    return null;
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile"
      description="View and update your profile information"
      size="lg"
    >
      {/* Profile Completion Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Profile Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Profile Completion</span>
              <span className="font-medium">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Avatar Section */}
      <FormSection
        title="Profile Picture"
        description="Update your profile picture"
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-20 w-20">
              {currentUser.avatar ? (
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              ) : (
                <AvatarFallback className="text-lg">
                  {currentUser.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              )}
              {uploadAvatarMutation.isPending && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className={`absolute -bottom-1 -right-1 p-1.5 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors ${
                uploadAvatarMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="h-3 w-3" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploadAvatarMutation.isPending}
              />
            </label>
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-lg">{currentUser.name ?? "User"}</h3>
            <p className="text-sm text-muted-foreground">{currentUser.email ?? "No email"}</p>
            <p className="text-sm text-muted-foreground">
              Level {currentUser.level ?? "N/A"} • Semester {currentUser.currentSemester ?? "N/A"}
            </p>
            {uploadAvatarMutation.isPending && (
              <p className="text-xs text-blue-600 font-medium">
                Uploading avatar...
              </p>
            )}
          </div>
        </div>
      </FormSection>

      {/* Profile Form */}
      <FormSection
        title="Profile Information"
        description={isEditing ? "Update your profile details" : "Your current profile information"}
      >
        <div className="flex justify-end mb-4">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <FormActions>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </FormActions>
          )}
        </div>

        <FormGrid columns={2}>
          <FormField label="Full Name" required>
            <Input
              value={isEditing ? formData.name : (currentUser.name ?? "")}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your full name"
            />
          </FormField>

          <FormField label="Email Address" required>
            <Input
              type="email"
              value={isEditing ? formData.email : (currentUser.email ?? "")}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your email"
            />
          </FormField>

          <FormField label="Matric Number" required>
            <Input
              value={isEditing ? formData.matricNumber : (currentUser.matricNumber ?? "")}
              onChange={(e) => handleInputChange("matricNumber", e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your matric number"
            />
          </FormField>

          <FormField label="Faculty">
            <Input
              value={currentUser.faculty ?? ""}
              disabled
              placeholder="Faculty not set"
            />
          </FormField>

          <FormField label="Department">
            <Input
              value={currentUser.department ?? ""}
              disabled
              placeholder="Department not set"
            />
          </FormField>

          <FormField label="Academic Level" required>
            {isEditing ? (
              <Select
                value={formData.level.toString()}
                onValueChange={(value) => handleInputChange("level", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 Level</SelectItem>
                  <SelectItem value="200">200 Level</SelectItem>
                  <SelectItem value="300">300 Level</SelectItem>
                  <SelectItem value="400">400 Level</SelectItem>
                  <SelectItem value="500">500 Level</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input value={`${currentUser.level ?? 100} Level`} disabled />
            )}
          </FormField>

          <FormField label="Current Semester" required>
            {isEditing ? (
              <Select
                value={formData.currentSemester.toString()}
                onValueChange={(value) => handleInputChange("currentSemester", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Semester</SelectItem>
                  <SelectItem value="2">2nd Semester</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input value={`${currentUser.currentSemester ?? 1}${(currentUser.currentSemester ?? 1) === 1 ? 'st' : 'nd'} Semester`} disabled />
            )}
          </FormField>
        </FormGrid>
      </FormSection>
    </ModalWrapper>
  );
}
