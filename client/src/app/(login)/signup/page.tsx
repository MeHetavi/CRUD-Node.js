'use client';

import { useEffect, useState, useRef } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Image } from 'lucide-react';

interface UserData {
    first_name?: string;
    last_name?: string;
    email?: string;
    gender?: string;
    age?: string;
    images?: File[];
}

interface ImagePreview {
    file: File;
    preview: string;
}

export default function SignUp() {
    const [userData, setUserData] = useState<UserData>({});
    const [nextPage, setNextPage] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const newFiles = Array.from(e.target.files);
        setUserData(prev => ({ ...prev, images: [...(prev.images || []), ...newFiles] }));

        // Create preview URLs for the new images
        const newPreviews = newFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImagePreviews(prev => [...prev, ...newPreviews]);
    };
    useEffect(() => {
        console.log(userData);
    }, [userData]);
    const removeImage = (index: number) => {
        // Remove from previews
        setImagePreviews(prev => {
            const newPreviews = [...prev];
            // Revoke the URL to prevent memory leaks
            URL.revokeObjectURL(newPreviews[index].preview);
            newPreviews.splice(index, 1);
            return newPreviews;
        });

        // Remove from userData
        setUserData(prev => {
            const newImages = [...(prev.images || [])];
            newImages.splice(index, 1);
            return { ...prev, images: newImages };
        });
    };

    // Clean up preview URLs when component unmounts
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => {
                URL.revokeObjectURL(preview.preview);
            });
        };
    }, []);

    return (
        <div className="flex">
            <div className=" hidden bg-gradient-to-br from-yellow-100 to-yellow-500 sm:block w-1/2  p-4 rounded-tr-[40px] rounded-br-[40px] h-[100vh]">
            </div>
            <div className="w-full sm:w-1/2 p-4 rounded h-[100vh] flex justify-center items-center ">
                <div className="p-4 w-[90vw]  sm:w-[30vw]  rounded-[10px] shadow-[0_10px_10px_10px_rgba(0,0,0,0.25)] max-h-fit">
                    <form action="#" method="POST" className="space-y-6 mt-1"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData();
                            formData.append('first_name', userData.first_name || '');
                            formData.append('last_name', userData.last_name || '');
                            formData.append('email', userData.email || '');
                            formData.append('gender', userData.gender || '');
                            formData.append('age', userData.age || '');

                            // Append each image file
                            userData.images?.forEach((image) => {
                                formData.append('images', image);
                            });

                            api.post('/users', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            })
                                .then((res) => {
                                    console.log(res.data);
                                    toast.success(res.data.message);
                                    setUserData({});
                                    setImagePreviews([]);
                                })
                                .catch((err) => {
                                    toast.error(err.response?.data?.message || 'An error occurred');
                                });
                        }}
                    >
                        {!nextPage &&
                            <>
                                <p className="subpixel-antialiased md:text-[18px] font-bold">Fill up the details to proceed further</p>
                                <div>
                                    <label htmlFor="first_name" className="block text-[10px] font-medium text-gray-900">
                                        First Name
                                    </label>
                                    <div>
                                        <input
                                            onChange={(e) => { setUserData({ ...userData, first_name: e.target.value }) }}
                                            id="first_name"
                                            name="first_name"
                                            type="name"
                                            placeholder="First Name"
                                            value={userData.first_name ? userData.first_name : ''}
                                            required
                                            className="placeholder:text-[10px] block h-[5vh] w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="last_name" className="placeholder:text-[10px] block text-[10px] font-medium text-gray-900">
                                        Last Name
                                    </label>
                                    <div>
                                        <input
                                            onChange={(e) => { setUserData({ ...userData, last_name: e.target.value }) }}
                                            id="last_name"
                                            name="last_name"
                                            type="name"
                                            placeholder="Last Name"
                                            value={userData.last_name ? userData.last_name : ''}
                                            required
                                            className="block h-[5vh] w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 placeholder:text-[10px] focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-[10px] font-medium text-gray-900">
                                        Email
                                    </label>
                                    <div>
                                        <input
                                            onChange={(e) => { setUserData({ ...userData, email: e.target.value }) }}
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            value={userData.email ? userData.email : ''}
                                            required
                                            autoComplete="email"
                                            className=" placeholder:text-[10px] block h-[5vh] w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="gender" className="block text-[10px] font-medium text-gray-900">
                                        Gender
                                    </label>
                                    <div className="flex items-center space-x-6">

                                        {/* Male Radio */}
                                        <input
                                            onChange={(e) => { setUserData({ ...userData, gender: e.target.value }) }}
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            className="form-radio h-5 m-1 w-5 text-blue-600"
                                            checked={userData.gender === 'male'}
                                        />
                                        <span className="text-gray-700 text-[10px]">Male</span>

                                        {/* Female Radio */}
                                        <input
                                            onChange={(e) => { setUserData({ ...userData, gender: e.target.value }) }}
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            className="form-radio h-5 w-5 m-1 text-pink-600"
                                            checked={userData.gender === 'female'}
                                        />
                                        <span className="text-gray-700 text-[10px] ml-0">Female</span>

                                        {/* Other Radio */}
                                        <input
                                            onChange={(e) => { setUserData({ ...userData, gender: e.target.value }) }}
                                            type="radio"
                                            name="gender"
                                            value="other"
                                            className="form-radio h-5 m-1 w-5 text-purple-600"
                                            checked={userData.gender === 'other'}
                                        />
                                        <span className="text-gray-700 text-[10px]">Other</span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="age" className="block text-[10px] font-medium text-gray-900">
                                        Age
                                    </label>
                                    <div>
                                        <input
                                            onChange={(e) => { setUserData({ ...userData, age: e.target.value }) }}
                                            id="age"
                                            name="age"
                                            type="number"
                                            placeholder="Age"
                                            value={userData.age ? userData.age : ''}
                                            required
                                            min={1}
                                            className="placeholder:text-[10px] block h-[5vh] w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => { setNextPage(true) }}
                                        className="p-1"
                                        style={{
                                            cursor: "pointer",
                                            background: 'linear-gradient(to bottom, #f4db00, #ffc107)',
                                            color: 'black',
                                            fontWeight: 'bold',
                                            width: '40%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            justifySelf: 'center',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        }
                        {nextPage && (
                            <div className="space-y-1">
                                <button
                                    onClick={() => { setNextPage(false) }}
                                    className="p-1"
                                    style={{
                                        justifySelf: 'start',
                                        width: 'fit-content',
                                        background: 'transparent',
                                        fontSize: '20px'
                                    }}
                                >
                                    &larr;
                                </button>
                                <p className="subpixel-antialiased md:text-[18px] font-bold text-center">
                                    Select photos
                                </p>

                                <div className="space-y-4">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <div className="flex flex-col items-center space-y-2 cursor-pointer">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-1"
                                        >
                                            <div className="bg-yellow-100 p-4 rounded-full">
                                                <Image className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <span className="text-sm text-gray-600">Browse</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative ">
                                                <img
                                                    src={preview.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                                    style={{
                                                        background: 'red',
                                                        width: 'fit-content',
                                                        height: 'auto',
                                                        borderRadius: '100%'
                                                    }
                                                    }
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        className="p-1"
                                        style={{
                                            cursor: "pointer",
                                            background: 'linear-gradient(to bottom, #f4db00, #ffc107)',
                                            color: 'black',
                                            fontWeight: 'bold',
                                            width: '40%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            justifySelf: 'center',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div >

        </div >

    )
}
