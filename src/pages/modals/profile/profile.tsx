import { useEffect, useMemo, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAtomValue, useSetAtom } from 'jotai'

import closeIcon from '@/assets/close-moda-sign.svg'
import pencilIcon from '@/assets/pencil.svg'
import checkMarkIcon from '@/assets/check-mark.svg'
import dropdownArrowIcon from '@/assets/dropdown-arrow.svg'
import uploadAvatarIcon from '@/assets/upload-avatar.svg'
import profileIcon from '@/assets/profile-sign.svg'
import greenDotIcon from '@/assets/green-dot.svg'

import { userAtom } from '@/store/auth'
import { getMe, updateProfile } from '@/api/profile'

type Props = {
    open: boolean
    onClose: () => void
}

type ProfileFormValues = z.infer<typeof MobileSchema>

const MobileSchema = z.object({
    fullName: z
        .string()
        .min(1, { message: 'Name is required' })
        .min(3, { message: 'Name must be at least 3 characters' })

        .max(50, { message: 'Name must not exceed 50 characters' })
        .regex(/^[A-Za-z\s]+$/, {
            message: 'Name must not contain numbers or special characters',
        }),
    email: z.string().email().optional(),
    mobileNumber: z
        .string()
        .min(1, { message: 'Mobile number is required' })
        .length(9, { message: 'Mobile number must be exactly 9 digits' })
        .regex(/^\d+$/, {
            message: 'Only numbers are allowed',
        })
        .refine((val) => val.startsWith('5'), {
            message: 'Georgian mobile numbers must start with 5',
        })
        .regex(/^5\d{8}$/, {
            message:
                'Please enter a valid Georgian mobile number (9 digits starting with 5)',
        }),
    age: z
        .string()
        .min(1, { message: 'Age is required' })
        .refine((v) => /^\d+$/.test(v), { message: 'Age must be a number' })

        .refine((n) => Number(n) >= 16, {
            message: 'You must be at least 16 years old to enroll',
        })
        .refine((n) => Number(n) <= 120, {
            message: 'Please enter a valid age',
        }),
    avatar: z
        .instanceof(File)
        .refine((file) => file.size <= 2 * 1024 * 1024, {
            message: 'File size must be less than 2MB',
        })
        .refine(
            (file) =>
                ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            {
                message: 'Avatar should be JPG, PNG or Webp format',
            },
        )
        .nullable()
        .optional(),
})

export const Profile = ({ open, onClose }: Props) => {
    const user = useAtomValue(userAtom)
    const setUser = useSetAtom(userAtom)
    const avatarRef = useRef<HTMLInputElement>(null)
    const fullNameRef = useRef<HTMLInputElement>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const defaultValues: ProfileFormValues = useMemo(
        () => ({
            fullName: user?.fullName ?? '',
            email: user?.email ?? '',
            mobileNumber: user?.mobileNumber
                ? user.mobileNumber.replace(/^\\+?995\\s?/, '')
                : '',
            age: user?.age ? String(user.age) : '',
            avatar: null,
        }),
        [user],
    )

    const { control, clearErrors, setError, watch, reset, handleSubmit, formState } =
        useForm<z.infer<typeof MobileSchema>>({
            resolver: zodResolver(MobileSchema),
            defaultValues,
            mode: 'onBlur',
            reValidateMode: 'onBlur',
        })

    const hasErrors = Object.keys(formState.errors).length > 0

    const onSubmit = async (values: ProfileFormValues) => {
        try {
            setIsSaving(true)
            setServerError(null)

            const updated = await updateProfile({
                fullName: values.fullName ?? null,
                mobileNumber: values.mobileNumber ? values.mobileNumber : null,
                age: values.age ? Number(values.age) : null,
                avatar: values.avatar ?? null,
            })

            setUser((prev) => ({
                ...(prev ?? null),
                ...updated,
                avatar: updated.avatar ?? undefined,
                fullName: updated.fullName ?? undefined,
                mobileNumber: updated.mobileNumber ?? undefined,
                age: updated.age ?? undefined,
                token: prev?.token,
            }))
        } catch {
            setServerError('Failed to update profile. Try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const onInvalid = () => {
        setServerError(null)
    }

    useEffect(() => {
        if (open) {
            reset(defaultValues)
            setServerError(null)
        }
    }, [open, reset, defaultValues])

    useEffect(() => {
        if (!open) return
        let cancelled = false

        ;(async () => {
            try {
                const me = await getMe()
                if (cancelled) return

                setUser((prev) => ({
                    ...(prev ?? null),
                    ...me,
                    avatar: me.avatar ?? undefined,
                    fullName: me.fullName ?? undefined,
                    mobileNumber: me.mobileNumber ?? undefined,
                    age: me.age ?? undefined,
                    token: prev?.token,
                }))
            } catch (e) {
                console.warn('Failed to load profile', e)
            }
        })()

        return () => {
            cancelled = true
        }
    }, [open, setUser])

    const mobileValue = watch('mobileNumber') ?? ''
    const isMobileValid = /^5\d{8}$/.test(mobileValue)
    const handleClickUpload = () => avatarRef.current?.click()

    const allowedAvatarTypes = ['image/jpeg', 'image/png', 'image/webp']

    const handleFile = (
        file: File | null,
        onChange: (v: File | null) => void,
    ) => {
        if (!file) {
            onChange(null)
            if (avatarRef.current) avatarRef.current.value = ''
            return
        }
        if (!allowedAvatarTypes.includes(file.type)) {
            setError('avatar', {
                type: 'manual',
                message: 'Avatar should be JPG, PNG or Webp format',
            })
            if (avatarRef.current) avatarRef.current.value = ''
            return
        }
        if (file.size > 2 * 1024 * 1024) {
            setError('avatar', {
                type: 'manual',
                message: 'File size must be less than 2MB',
            })
            if (avatarRef.current) avatarRef.current.value = ''
            return
        }
        clearErrors('avatar')
        onChange(file)
    }

    const requestClose = () => {
        if (user?.profileComplete) {
            onClose()
            return
        }
        const ok = globalThis.confirm(
            "Your profile is incomplete. You won't be able to enroll in courses until you complete it. Close anyway?",
        )
        if (ok) onClose()
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pt-36">
            <button
                type="button"
                className="absolute inset-0 bg-black/30"
                onClick={requestClose}
                aria-label="Close modal backdrop"
            />

            <form
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                className="relative w-105 rounded-2xl bg-white px-7.5 pt-6 pb-6"
            >
                <button
                    type="button"
                    onClick={requestClose}
                    className="absolute top-5 right-5"
                    aria-label="Close modal"
                >
                    <img
                        src={closeIcon}
                        alt=""
                        aria-hidden="true"
                        className="h-3.5"
                    />
                </button>

                <div className="flex flex-col items-center pt-5">
                    <h2 className="font-inter text-center text-[32px] leading-8 font-semibold text-[#141414]">
                        Profile
                    </h2>
                </div>

                <div className="mt-6 flex items-center gap-4">
                    <div className="relative h-15 w-15 shrink-0">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt="Avatar"
                                className="h-15 w-15 rounded-full object-cover"
                            />
                        ) : (
                            <img
                                src={profileIcon}
                                alt=""
                                aria-hidden="true"
                                className="h-15 w-15"
                            />
                        )}
                        {user?.profileComplete ? (
                            <img
                                src={greenDotIcon}
                                alt=""
                                aria-hidden="true"
                                className="absolute right-0 bottom-0 h-4.5 w-4.5"
                            />
                        ) : user?.avatar ? (
                            <span
                                className="absolute right-0 bottom-0 h-4.5 w-4.5 rounded-full border-2 border-white"
                                style={{ backgroundColor: '#F4A316' }}
                            />
                        ) : null}
                    </div>

                    <div>
                        <p className="font-inter text-[20px] leading-6 font-semibold text-[#0A0A0A]">
                            {user?.username ?? 'Username'}
                        </p>
                        <p
                            className="font-inter mt-1 text-[10px] leading-2.5 font-normal"
                            style={{
                                color: user?.profileComplete
                                    ? '#1DC31D'
                                    : '#F4A316',
                            }}
                        >
                            {user?.profileComplete
                                ? 'Profile is Complete'
                                : 'Incomplete Profile'}
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="font-inter text-[14px] leading-3.5 font-medium text-[#3D3D3D]">
                        Full Name
                    </p>
                    <div className="relative mt-2">
                        <Controller
                            name="fullName"
                            control={control}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <input
                                    ref={fullNameRef}
                                    value={value ?? ''}
                                    onChange={(e) => {
                                        const next = e.target.value
                                        onChange(next)

                                        if (
                                            formState.errors.fullName &&
                                            next.trim().length >= 3 &&
                                            next.trim().length <= 50
                                        ) {
                                            clearErrors('fullName')
                                        }
                                    }}
                                    onBlur={onBlur}
                                    className={`font-inter h-11.75 w-90 rounded-lg border-[1.5px] bg-[#F5F5F5] px-4 pr-12 text-[14px] leading-3.5 font-medium outline-none ${
                                        formState.errors.fullName
                                            ? 'border-red-500 text-red-500'
                                            : 'border-[#ADADAD] text-[#ADADAD]'
                                    }`}
                                />
                            )}
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-4 -translate-y-1/2"
                            onClick={() => fullNameRef.current?.focus()}
                            aria-label="Edit full name"
                        >
                            <img
                                src={pencilIcon}
                                alt=""
                                aria-hidden="true"
                                className="h-5 w-5"
                            />
                        </button>
                    </div>
                    {formState.errors.fullName?.message ? (
                        <p className="font-inter mt-2 text-[12px] leading-3 font-medium text-red-500">
                            {String(formState.errors.fullName.message)}
                        </p>
                    ) : null}
                </div>

                <div className="mt-4">
                    <p className="font-inter text-[14px] leading-3.5 font-medium text-[#3D3D3D]">
                        Email
                    </p>
                    <div className="relative mt-2">
                        <Controller
                            name="email"
                            control={control}
                            render={({ field: { value } }) => (
                                <input
                                    value={value ?? ''}
                                    disabled
                                    className="font-inter h-11.75 w-90 rounded-lg border-[1.5px] border-[#ADADAD] bg-[#F5F5F5] px-4 pr-12 text-[14px] leading-3.5 font-medium text-[#ADADAD] disabled:opacity-100"
                                />
                            )}
                        />
                        <img
                            src={checkMarkIcon}
                            alt=""
                            aria-hidden="true"
                            className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2"
                        />
                    </div>
                </div>

                <div className="mt-4 flex gap-4">
                    <div className="w-1/2">
                        <p className="font-inter text-[14px] leading-3.5 font-medium text-[#3D3D3D]">
                            Mobile Number
                        </p>
                        <div className="relative mt-2">
                            <div className="flex h-11.75 w-66.75 items-center rounded-lg border-[1.5px] border-[#D1D1D1] bg-white px-4">
                                <span className="font-inter text-[14px] leading-3.5 font-medium text-[#C2C2C2]">
                                    +995
                                </span>
                                <span className="w-1" />
                                <Controller
                                    name="mobileNumber"
                                    control={control}
                                    render={({
                                        field: { onChange, onBlur, value },
                                    }) => (
                                        <input
                                            value={value ?? ''}
                                            onChange={(e) => {
                                                const next =
                                                    e.target.value.replace(
                                                        /\\D/g,
                                                        '',
                                                    )
                                                onChange(next)

                                                if (
                                                    formState.errors
                                                        .mobileNumber &&
                                                    /^5\\d{8}$/.test(next)
                                                ) {
                                                    clearErrors('mobileNumber')
                                                }
                                            }}
                                            onBlur={onBlur}
                                            className="font-inter w-full bg-transparent text-[14px] leading-3.5 font-medium text-[#ADADAD] outline-none"
                                        />
                                    )}
                                />
                            </div>
                            {isMobileValid ? (
                                <img
                                    src={checkMarkIcon}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute top-1/2 -right-19 h-5 w-5 -translate-y-1/2"
                                />
                            ) : null}
                        </div>
                        {formState.errors.mobileNumber?.message ? (
                            <p className="font-inter mt-2 text-[12px] leading-3 font-medium text-red-500">
                                {String(formState.errors.mobileNumber.message)}
                            </p>
                        ) : null}
                    </div>

                    <div className="w-1/2">
                        <div className="ml-auto w-21.25">
                            <p className="font-inter text-[14px] leading-3.5 font-medium text-[#3D3D3D]">
                                Age
                            </p>
                            <div className="relative mt-2 w-21.25">
                                <Controller
                                    name="age"
                                    control={control}
                                    render={({
                                        field: { onChange, onBlur, value },
                                    }) => (
                                        <input
                                            inputMode="numeric"
                                            value={value ?? ''}
                                            onChange={(e) => {
                                                const next = e.target.value
                                                onChange(next)

                                                if (formState.errors.age) {
                                                    const isDigits =
                                                        /^\\d+$/.test(next)
                                                    const n = Number(next)
                                                    if (
                                                        next.length > 0 &&
                                                        isDigits &&
                                                        n >= 16 &&
                                                        n <= 120
                                                    ) {
                                                        clearErrors('age')
                                                    }
                                                }
                                            }}
                                            onBlur={onBlur}
                                            className="font-inter h-11.75 w-21.25 rounded-lg border-[1.5px] border-[#D1D1D1] bg-white px-4 pr-12 text-[14px] leading-3.5 font-medium text-[#ADADAD] outline-none"
                                        />
                                    )}
                                />
                                <img
                                    src={dropdownArrowIcon}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2"
                                />
                            </div>
                            {formState.errors.age?.message ? (
                                <p className="font-inter mt-2 text-[12px] leading-3 font-medium text-red-500">
                                    {String(formState.errors.age.message)}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="font-inter text-[14px] leading-3.5 font-medium text-[#3D3D3D]">
                        Upload avatar
                    </p>

                    <Controller
                        name="avatar"
                        control={control}
                        render={({
                            field: { onChange, value },
                            fieldState: { error },
                        }) => {
                            const previewUrl =
                                value instanceof File
                                    ? URL.createObjectURL(value)
                                    : null
                            const fileMeta =
                                value instanceof File
                                    ? {
                                          name: value.name,
                                          sizeMb:
                                              Math.round(
                                                  (value.size / (1024 * 1024)) *
                                                      10,
                                              ) / 10,
                                      }
                                    : null

                            return (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={avatarRef}
                                        className="hidden"
                                        onChange={(e) =>
                                            handleFile(
                                                e.target.files?.[0] ?? null,
                                                onChange,
                                            )
                                        }
                                    />

                                    {previewUrl && fileMeta ? (
                                        <div className="mt-2 flex h-35 w-90 items-center gap-4 rounded-lg bg-[#EEEDFC] px-5">
                                            <img
                                                src={previewUrl}
                                                alt="Chosen avatar"
                                                className="h-15 w-15 rounded-full object-cover"
                                            />
                                            <div className="flex flex-col">
                                                <p className="font-inter text-[14px] leading-4 font-medium text-[#141414]">
                                                    {fileMeta.name}
                                                </p>
                                                <p className="font-inter mt-1 text-[12px] leading-3 font-normal text-[#666666]">
                                                    Size - {fileMeta.sizeMb}MB
                                                </p>
                                                <button
                                                    type="button"
                                                    className="font-inter mt-2 w-fit text-[12px] leading-3 font-medium text-[#4F46E5] underline"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleClickUpload()
                                                    }}
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            aria-label="Upload avatar"
                                            onClick={handleClickUpload}
                                            className="mt-2 flex h-35 w-90 cursor-pointer flex-col items-center justify-center rounded-lg border-[1.5px] border-[#D1D1D1]"
                                        >
                                            <img
                                                src={uploadAvatarIcon}
                                                alt=""
                                                aria-hidden="true"
                                                className="h-9 w-9"
                                            />
                                            <p className="font-inter mt-3 text-[14px] leading-3.5 font-medium text-[#666666]">
                                                Drag and drop or{' '}
                                                <span className="underline">
                                                    Upload file
                                                </span>
                                            </p>
                                            <p className="font-inter mt-2 text-[12px] leading-3 font-normal text-[#ADADAD]">
                                                JPG, PNG or Webp
                                            </p>
                                        </button>
                                    )}

                                    {error?.message ? (
                                        <p className="font-inter mt-2 text-[12px] leading-3 font-medium text-red-500">
                                            {error.message}
                                        </p>
                                    ) : null}
                                </>
                            )
                        }}
                    />
                </div>

                {serverError ? (
                    <p className="font-inter mt-4 text-center text-[12px] leading-3 font-medium text-red-500">
                        {serverError}
                    </p>
                ) : null}

                <button
                    type="submit"
                    disabled={isSaving || hasErrors}
                    className="font-inter mt-6 mb-6 h-11.75 w-90 rounded-lg bg-[#4F46E5] text-center text-[16px] leading-6 font-medium text-white disabled:opacity-60"
                >
                    {isSaving ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    )
}

export default Profile
