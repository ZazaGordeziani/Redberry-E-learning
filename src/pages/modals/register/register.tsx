import { useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'

import closeIcon from '@/assets/close-moda-sign.svg'
import goBackIcon from '@/assets/go-back.svg'
import hidePasswordIcon from '@/assets/hide-password.svg'
import showPasswordIcon from '@/assets/show-password.svg'
import uploadAvatarIcon from '@/assets/upload-avatar.svg'

import { useRegister } from '@/react-query/mutation'

import {
    type BackendErrorResponse,
    RegisterFormDefaultValues,
    type RegisterFormValues,
} from './index.typs'
import { SignUpFormSchema } from './schema'

type Props = {
    open: boolean
    onClose: () => void
    onOpenLogin: () => void
}

const StepBars = ({ step }: { step: 0 | 1 | 2 }) => {
    const bars = [0, 1, 2] as const
    return (
        <div className="mt-6 flex items-center justify-center gap-3">
            {bars.map((i) => {
                const isCompleted = i < step
                const isActive = i === step
                const bg = isCompleted
                    ? '#4F46E5'
                    : isActive
                      ? '#B7B3F4'
                      : '#EEEDFC'

                return (
                    <div
                        key={i}
                        className="h-2 w-[114.76px] rounded-[30px]"
                        style={{ backgroundColor: bg }}
                    />
                )
            })}
        </div>
    )
}

export const Register = ({ open, onClose, onOpenLogin }: Props) => {
    const avatarRef = useRef<HTMLInputElement>(null)
    const [step, setStep] = useState<0 | 1 | 2>(0)
    const [showPassword, setShowPassword] = useState(true)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [isDragActive, setIsDragActive] = useState(false)
    const [stepTriedNext, setStepTriedNext] = useState({
        email: false,
        password: false,
    })

    const { control, trigger, setError, clearErrors, handleSubmit, formState } =
        useForm<RegisterFormValues>({
            resolver: zodResolver(SignUpFormSchema),
            defaultValues: RegisterFormDefaultValues,
            mode: 'onBlur',
        })

    const usernameValue = useWatch({ control, name: 'username' }) ?? ''
    const shouldShowUsernameError =
        !!formState.errors.username && usernameValue.length > 0

    const passwordMismatch =
        step === 1 && formState.errors.confirmPassword?.message === 'Passwords do not match'
    const iconErrorFilter = passwordMismatch
        ? 'invert(24%) sepia(94%) saturate(6250%) hue-rotate(356deg) brightness(98%) contrast(115%)'
        : undefined

    const { mutate: handleRegister, isPending } = useRegister({
        onError: (error) => {
            const data = error.response?.data as
                | BackendErrorResponse
                | undefined
            if (data?.errors) {
                const backendErrors = data.errors
                Object.entries(backendErrors).forEach(([field, messages]) => {
                    setError(field as keyof RegisterFormValues, {
                        type: 'server',
                        message: messages[0],
                    })
                })
                setFormError(data.message ?? null)
            } else {
                setFormError(data?.message ?? 'Registration failed')
            }
        },
        onSuccess: () => {
            onClose()
        },
    })

    useWatch({ control, name: 'username' })

    const canRender = open

    const onNext = async () => {
        if (step === 0) {
            setStepTriedNext((p) => ({ ...p, email: true }))
            const ok = await trigger(['email'])
            if (ok) {
                setStep(1)
            }
            return
        }
        if (step === 1) {
            setStepTriedNext((p) => ({ ...p, password: true }))
            const ok = await trigger(['password', 'confirmPassword'])
            if (ok) {
                setStep(2)
            }
            return
        }
    }

    const onSubmit = (payload: RegisterFormValues) => {
        setFormError(null)
        handleRegister(payload)
    }

    const onInvalid = (errors: Record<string, unknown>) => {
        if (errors.email) {
            setStep(0)
            return
        }
        if (errors.password || errors.confirmPassword) {
            setStep(1)
            return
        }
        setStep(2)
    }

    const renderStepContent = () => {
        if (step === 0) {
            return (
                <>
                    <div className="mt-6">
                        <p
                            className={`font-inter text-[14px] leading-3.5 font-medium ${
                                formState.errors.email &&
                                ((formState.touchedFields.email ?? false) ||
                                    stepTriedNext.email ||
                                    formState.submitCount > 0)
                                    ? 'text-red-500'
                                    : 'text-[#3D3D3D]'
                            }`}
                        >
                            Email*
                        </p>
                        <div className="mt-2">
                            <Controller
                                name="email"
                                control={control}
                                render={({
                                    field: { onChange, value },
                                    fieldState: { error, isTouched },
                                }) => (
                                    <>
                                        <input
                                            value={value}
                                            onChange={onChange}
                                            placeholder="you@example.com"
                                            className={`font-inter placeholder:font-inter h-11.75 w-90 rounded-lg border-[1.5px] px-4 text-[14px] leading-3.5 font-medium text-[#141414] placeholder:text-[14px] placeholder:leading-3.5 placeholder:font-medium placeholder:text-[#8A8A8A] ${
                                                error &&
                                                (isTouched ||
                                                    stepTriedNext.email ||
                                                    formState.submitCount > 0)
                                                    ? 'border-red-500'
                                                    : 'border-[#D1D1D1]'
                                            } ${
                                                error &&
                                                (isTouched ||
                                                    stepTriedNext.email ||
                                                    formState.submitCount > 0)
                                                    ? 'text-red-500'
                                                    : 'text-[#141414]'
                                            }`}
                                        />
                                        {error?.message &&
                                        (isTouched ||
                                            stepTriedNext.email ||
                                            formState.submitCount > 0) ? (
                                            <p className="font-inter mt-2 text-[12px] leading-3 font-medium text-red-500">
                                                {error.message}
                                            </p>
                                        ) : null}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </>
            )
        }

        if (step === 1) {
            return (
                <>
                    <div className="mt-6 flex flex-col gap-4">
                        <div>
                            <p
                                className={`font-inter text-[14px] leading-3.5 font-medium ${
                                    formState.errors.password &&
                                    ((formState.touchedFields.password ?? false) ||
                                        stepTriedNext.password ||
                                        formState.submitCount > 0)
                                        ? 'text-red-500'
                                        : 'text-black'
                                }`}
                            >
                                Password*
                            </p>
                            <div className="relative mt-2">
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error, isTouched },
                                    }) => (
                                        <>
                                            <div className="relative">
                                                <input
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder="Password"
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                className={`font-inter placeholder:font-inter h-11.75 w-90 rounded-lg border-[1.5px] pr-12 pl-4 text-[14px] leading-3.5 font-medium placeholder:text-[14px] placeholder:leading-3.5 placeholder:font-medium placeholder:text-[#8A8A8A] ${
                                                        error &&
                                                        (isTouched ||
                                                            stepTriedNext.password ||
                                                            formState.submitCount >
                                                                0)
                                                            ? 'border-red-500'
                                                            : 'border-[#D1D1D1]'
                                                } ${
                                                    error &&
                                                    (isTouched ||
                                                        stepTriedNext.password ||
                                                        formState.submitCount >
                                                            0)
                                                        ? 'text-red-500'
                                                        : 'text-[#141414]'
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (s) => !s,
                                                        )
                                                    }
                                                    className="absolute top-1/2 right-4 -translate-y-1/2"
                                                    aria-label="Toggle password visibility"
                                                >
                                                    <img
                                                        src={
                                                            showPassword
                                                                ? showPasswordIcon
                                                                : hidePasswordIcon
                                                        }
                                                        alt=""
                                                        aria-hidden="true"
                                                        className="h-5 w-5"
                                                        style={{
                                                            filter:
                                                                iconErrorFilter,
                                                        }}
                                                    />
                                                </button>
                                            </div>
                                            {error?.message &&
                                            (isTouched ||
                                                stepTriedNext.password ||
                                                formState.submitCount > 0) ? (
                                                <p className="font-inter mt-2 text-[12px] leading-3 font-medium text-red-500">
                                                    {error.message}
                                                </p>
                                            ) : null}
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        <div>
                            <p
                                className={`font-inter text-[14px] leading-3.5 font-medium ${
                                    formState.errors.confirmPassword &&
                                    ((formState.touchedFields.confirmPassword ??
                                        false) ||
                                        stepTriedNext.password ||
                                        formState.submitCount > 0)
                                        ? 'text-red-500'
                                        : 'text-black'
                                }`}
                            >
                                Confirm Password*
                            </p>
                            <div className="relative mt-2">
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error, isTouched },
                                    }) => (
                                        <>
                                            <div className="relative">
                                                <input
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder="Password"
                                                    type={
                                                        showConfirmPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                className={`font-inter placeholder:font-inter h-11.75 w-90 rounded-lg border-[1.5px] pr-12 pl-4 text-[14px] leading-3.5 font-medium placeholder:text-[14px] placeholder:leading-3.5 placeholder:font-medium placeholder:text-[#8A8A8A] ${
                                                        error &&
                                                        (isTouched ||
                                                            stepTriedNext.password ||
                                                            formState.submitCount >
                                                                0)
                                                            ? 'border-red-500'
                                                            : 'border-[#D1D1D1]'
                                                } ${
                                                    error &&
                                                    (isTouched ||
                                                        stepTriedNext.password ||
                                                        formState.submitCount >
                                                            0)
                                                        ? 'text-red-500'
                                                        : 'text-[#141414]'
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            (s) => !s,
                                                        )
                                                    }
                                                    className="absolute top-1/2 right-4 -translate-y-1/2"
                                                    aria-label="Toggle confirm password visibility"
                                                >
                                                    <img
                                                        src={
                                                            showConfirmPassword
                                                                ? showPasswordIcon
                                                                : hidePasswordIcon
                                                        }
                                                        alt=""
                                                        aria-hidden="true"
                                                        className="h-5 w-5"
                                                        style={{
                                                            filter:
                                                                iconErrorFilter,
                                                        }}
                                                    />
                                                </button>
                                            </div>
                                            {error?.message &&
                                            (isTouched ||
                                                stepTriedNext.password ||
                                                formState.submitCount > 0) ? (
                                                <p className="font-inter mt-2 text-[12px] leading-3 font-medium text-red-500">
                                                    {error.message}
                                                </p>
                                            ) : null}
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )
        }

        return (
            <>
                <div className="mt-6">
                    <p
                        className={`font-inter text-[14px] leading-3.5 font-medium ${
                            shouldShowUsernameError
                                ? 'text-red-500'
                                : 'text-black'
                        }`}
                    >
                        Username*
                    </p>
                    <div className="mt-2">
                        <Controller
                            name="username"
                            control={control}
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                            }) => (
                                <>
                                    {(() => {
                                        const shouldShowError =
                                            !!error && value.length > 0
                                        return (
                                            <>
                                                <input
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder="Username"
                                                    className={`font-inter placeholder:font-inter h-11.75 w-90 rounded-lg border-[1.5px] px-4 text-[14px] leading-3.5 font-medium text-[#141414] placeholder:text-[14px] placeholder:leading-3.5 placeholder:font-medium placeholder:text-[#8A8A8A] ${
                                                        shouldShowError
                                                            ? 'border-red-500'
                                                            : 'border-[#D1D1D1]'
                                                    } ${
                                                        shouldShowError
                                                            ? 'text-red-500'
                                                            : 'text-[#141414]'
                                                    }`}
                                                />
                                                {error?.message &&
                                                shouldShowError ? (
                                                    <p className="font-inter mt-2 text-[12px] leading-3 font-medium text-red-500">
                                                        {error.message}
                                                    </p>
                                                ) : null}
                                            </>
                                        )
                                    })()}
                                </>
                            )}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <p className="font-inter text-[14px] leading-3.5 font-medium text-[#3D3D3D]">
                        Upload avatar
                    </p>

                    <Controller
                        name="avatar"
                        control={control}
                        render={({ field: { onChange, value } }) => {
                            const handleClick = () => {
                                avatarRef.current?.click()
                            }

                            const handleFile = (file: File) => {
                                if (file.size > 1 * 1024 * 1024) {
                                    setError('avatar', {
                                        type: 'manual',
                                        message: 'File size must be less than 1MB',
                                    })
                                    if (avatarRef.current)
                                        avatarRef.current.value = ''
                                    return
                                }
                                clearErrors('avatar')
                                onChange(file)
                            }

                            const handleFileChange = async (
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                const file = e.target.files?.[0]

                                if (file) {
                                    handleFile(file)
                                }
                            }

                            const previewUrl = value
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
                                        onChange={handleFileChange}
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
                                                        handleClick()
                                                    }}
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            role="button"
                                            aria-label="Upload avatar"
                                            onClick={handleClick}
                                            onDragEnter={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setIsDragActive(true)
                                            }}
                                            onDragOver={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setIsDragActive(true)
                                            }}
                                            onDragLeave={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setIsDragActive(false)
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setIsDragActive(false)
                                                const file = e.dataTransfer.files?.[0]
                                                if (file) handleFile(file)
                                            }}
                                            className={`mt-2 flex h-35 w-90 cursor-pointer flex-col items-center justify-center rounded-lg border-[1.5px] ${
                                                isDragActive
                                                    ? 'border-[#4F46E5] bg-[#EEEDFC]'
                                                    : 'border-[#D1D1D1] bg-white'
                                            }`}
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
                                        </div>
                                    )}
                                </>
                            )
                        }}
                    />
                </div>
            </>
        )
    }

    if (!canRender) return null

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-74">
            <div
                className="absolute inset-0 bg-black/30"
                onClick={onClose}
                role="button"
                tabIndex={-1}
                aria-label="Close modal backdrop"
            />

            <div className="relative w-105 rounded-2xl bg-white px-7.5 pt-6 pb-6">
                {step > 0 ? (
                    <button
                        type="button"
                        onClick={() => {
                            setStep((s) => (s > 0 ? ((s - 1) as 0 | 1) : s))
                        }}
                        className="absolute top-5 left-5"
                        aria-label="Go back"
                    >
                        <img
                            src={goBackIcon}
                            alt=""
                            aria-hidden="true"
                            className="h-3.5"
                        />
                    </button>
                ) : null}

                <button
                    type="button"
                    onClick={onClose}
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
                        Create Account
                    </h2>
                    <p className="font-inter mt-3 text-center text-[14px] leading-3.5 font-medium text-[#666666]">
                        Join and start learning today
                    </p>
                </div>

                <StepBars step={step} />

                <form
                    onSubmit={handleSubmit(onSubmit, onInvalid)}
                    className="flex flex-col items-center"
                >
                    {renderStepContent()}

                    <button
                        type={step === 2 ? 'submit' : 'button'}
                        onClick={step === 2 ? undefined : onNext}
                        disabled={isPending}
                        className="font-inter mt-4 h-11.75 w-90 rounded-lg bg-[#4F46E5] text-center text-[16px] leading-6 font-medium text-white disabled:opacity-60"
                    >
                        {step === 2 ? 'Sign Up' : 'Next'}
                    </button>

                    {step === 2 && formError ? (
                        <p className="font-inter mt-3 text-center text-[12px] leading-4 font-medium text-red-500">
                            {formError}
                        </p>
                    ) : null}

                    <div className="relative mt-6 flex w-80 items-center justify-center">
                        <div className="h-px w-full bg-[#D1D1D1]" />
                        <span className="font-inter absolute bg-white px-2.5 pb-1 text-[12px] leading-3 font-medium text-[#8A8A8A]">
                            or
                        </span>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-1.5">
                        <span className="font-inter text-[12px] leading-3 font-normal text-[#666666]">
                            Already have an account?
                        </span>
                        <button
                            type="button"
                            className="font-inter text-[14px] leading-3.5 font-medium text-[#141414] underline"
                            onClick={() => {
                                onClose()
                                onOpenLogin()
                            }}
                        >
                            Log In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
