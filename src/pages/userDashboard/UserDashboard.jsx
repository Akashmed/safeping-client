import { useEffect, useRef, useState } from "react"
import { Edit, Save, X, Camera, Mail, Phone, User, House } from "lucide-react"
import React from "react"
import useAuth from "../../hooks/useAuth"
import { imageUpload } from "../../api/utensils"
import { getUser, updateUser } from "../../api/auth"
import toast from "react-hot-toast"
import Hashloader from "../../components/loader/Hashloader"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

export default function UserDashboard() {
    const [isEditing, setIsEditing] = useState(false)
    const { user, updateUserProfile, loading } = useAuth()
    const [selectedFile, setSelectedFile] = useState(null);
    const [userData, setUserData] = useState(null);
    const fileInputRef = useRef(null);

    const [editedInfo, setEditedInfo] = useState({
        name: "",
        email: "",
        phone: "",
        status: "",
        AccountType: "",
        image: "/placeholder.svg?height=120&width=120",
    })

    useEffect(() => {
        if (user) fetchUserData();
    }, [user]);

    useEffect(() => {
        if (user) {
            if (userData) {
                setEditedInfo({
                    name: user.displayName || "",
                    email: user.email || "",
                    phone: userData.phone || user.phoneNumber || "",
                    status: userData.status || "fetching",
                    AccountType: userData.accountType || "",
                    image: user.photoURL || "/placeholder.svg?height=120&width=120",
                })
            } else {
                setEditedInfo({
                    name: user.displayName || "",
                    email: user.email || "",
                    phone: user.phoneNumber || "",
                    status: "unverified",
                    AccountType: "Basic",
                    image: user.photoURL || "/placeholder.svg?height=120&width=120",
                })
            }
        }
    }, [user, userData, isEditing]);


    const fetchUserData = async () => {
        const userDB = await getUser(user?.email);
        setUserData(userDB);
    }


    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = async () => {
        const toastId = toast.loading('Updating info...');
        let imageUrl = user?.photoURL;

        // Only upload if a new file was selected
        if (selectedFile) {
            try {
                // Replace this with your actual upload function
                imageUrl = await imageUpload(selectedFile);
            } catch (error) {
                console.error("Image upload failed:", error);
                return;
            }
        }


        if (editedInfo.phone === "") {
            // If phone is empty, set it to null
            editedInfo.phone = user?.phoneNumber || null;
        }

        // Save all user info including the new image URL
        setEditedInfo(prev => ({ ...prev, image: imageUrl?.data?.display_url || imageUrl }));
        setIsEditing(false);
        setSelectedFile(null);

        // Here you would typically save all user data to your database
        try {
            // update user info in the database
            if (editedInfo.name !== user.displayName || imageUrl?.data?.display_url !== user.photoURL) {
                await updateUserProfile(editedInfo.name, imageUrl?.data?.display_url || imageUrl);
            }
            if (editedInfo.phone) {
                await updateUser(user?.email, { phone: editedInfo.phone });
            }
            toast.success("Profile updated successfully", { id: toastId });
        } catch (error) {
            console.error("Failed to update user:", error);
            toast.error(error.message, { id: toastId });
        }
    };

    const handleCancel = () => {
        if (user) {
            setEditedInfo({
                name: user.displayName || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
                status: user.status || "unverified",
                AccountType: user.accountType || "Basic",
                image: user.photoURL || "/placeholder.svg?height=120&width=120",
            })
        }
        setIsEditing(false)
    }

    const handleInputChange = (field, value) => {
        setEditedInfo(prev => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            // Preview the image
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditedInfo(prev => ({
                    ...prev,
                    image: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = (name) =>
        name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()

    const date = new Date(user?.metadata?.creationTime || Date.now())
    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })

    const lastLoginAt = (timestamp) => {
        const now = Date.now()
        const diffMs = now - Number(timestamp)
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

        if (diffHours < 1) return "less than an hour ago"
        if (diffHours === 1) return "1 hour ago"
        return `${diffHours} hours ago`
    }

    const lastLogin = lastLoginAt(user?.metadata?.lastLoginAt)
    if (loading && !userData) return <Hashloader />

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <Helmet>
                <title>User Dashboard</title>
            </Helmet>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold flex gap-2 justify-between items-center text-gray-900">User Dashboard
                        <Link to={'/'}><House size={28} strokeWidth={2.5} /></Link>
                    </h1>
                    <p className="text-gray-600 mt-1">Manage your profile information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                    <div className="md:p-6 p-3 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
                                <p className="text-gray-500 text-sm">Your personal details and contact information</p>
                            </div>
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 border border-gray-200 bg-white shadow-sm hover:bg-gray-100 h-9 px-4 md:py-2 py-6"
                                >
                                    <Edit className="w-6 md:w-4 h-6 md:h-4 mr-2" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 border border-gray-200 bg-white shadow-sm hover:bg-gray-100 h-9 px-4 py-2"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 pt-0">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {editedInfo.image ? (
                                            <img
                                                src={editedInfo.image}
                                                alt="Profile picture"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl font-semibold">
                                                {getInitials(editedInfo.name)}
                                            </span>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                                            <Camera className="w-4 h-4" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                ref={fileInputRef}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${editedInfo.status === 'verified' ? 'bg-green-300' : 'bg-red-300'} text-gray-800`}>
                                    {editedInfo.status}
                                </span>
                            </div>

                            {/* User Info Fields */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <User className="w-4 h-4" />
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            id="name"
                                            value={editedInfo.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            placeholder="Enter your full name"
                                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-md border">
                                            <p className="font-medium">{editedInfo.name}</p>
                                        </div>
                                    )}
                                </div>

                                <hr className="my-4 border-t border-gray-200" />

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            id="email"
                                            type="email"
                                            value={editedInfo.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            placeholder="Enter your email"
                                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            readOnly
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-md border">
                                            <p className="font-medium">{editedInfo.email}</p>
                                        </div>
                                    )}
                                </div>

                                <hr className="my-4 border-t border-gray-200" />

                                {/* Phone Field */}
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Phone className="w-4 h-4" />
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={editedInfo.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            placeholder="Enter your phone number"
                                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-md border">
                                            <p className={`${!editedInfo?.phone ? 'text-gray-400 font-light' : 'font-medium'}`}>{editedInfo.phone || 'Enter your phone number'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Account Type</span>
                                <span className={` ${editedInfo.AccountType === 'Premium' ? 'text-purple-800 bg-purple-100' : 'text-blue-600 bg-blue-100'}  px-2 py-0.5 rounded-full text-xs font-semibold`}>{editedInfo.AccountType}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Member Since</span>
                                <span className="font-medium">{formattedDate}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Last Login</span>
                                <span className="font-medium">{lastLogin}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full text-sm px-4 py-2 border rounded-md bg-white hover:bg-gray-100">
                                Change Password
                            </button>
                            <button className="w-full text-sm px-4 py-2 border rounded-md bg-white hover:bg-gray-100">
                                Privacy Settings
                            </button>
                            <button className="w-full text-sm px-4 py-2 border rounded-md bg-white hover:bg-gray-100">
                                Download Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}