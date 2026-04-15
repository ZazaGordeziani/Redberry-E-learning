import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import type { AxiosError } from 'axios'

import closeIcon from '@/assets/close-moda-sign.svg'
import hidePasswordIcon from '@/assets/hide-password.svg'
import showPasswordIcon from '@/assets/show-password.svg'

import { login } from '@/api/auth'
import { useSetAtom } from 'jotai'
import { userAtom } from '@/store/auth'

import { LoginFormSchema } from './schema'

type Props = {
    open: boolean
    onClose: () => void
    onOpenRegister: () => void
}

type LoginFormValues = {
    email: string
    password: string
}

type BackendErrorResponse = {
    message: string
    errors?: Record<string, string[]>
}

export const Login = ({ open, onClose, onOpenRegister }: Props) => {
    const [showPassword, setShowPassword] = useState(true)
    const [formError, setFormError] = useState<string | null>(null)
    const [invalidCredentials, setInvalidCredentials] = useState(false)
    const setUser = useSetAtom(userAtom)

    const iconErrorFilter = invalidCredentials
        ? 'invert(24%) sepia(94%) saturate(6250%) hue-rotate(356deg) brightness(98%) contrast(115%)'
        : undefined

    const { control, handleSubmit, formState } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onBlur',
    })

    const onSubmit = async (values: LoginFormValues) => {
        setFormError(null)
        setInvalidCredentials(false)
        try {
            const data = await login({ payload: values })
            if (data?.token) localStorage.setItem('token', data.token)
            if (data?.user?.email)
                localStorage.setItem('email', data.user.email)
            if (data?.user?.username)
                localStorage.setItem('username', data.user.username)
            setUser({
                id: data?.user?.id,
                email: data?.user?.email,
                username: data?.user?.username,
                token: data?.token,
                avatar: data?.user?.avatar ?? undefined,
                fullName: data?.user?.fullName ?? null,
                mobileNumber: data?.user?.mobileNumber ?? null,
                age: data?.user?.age ?? null,
                profileComplete: data?.user?.profileComplete ?? false,
            })
            console.log('user logged in successfully')
            console.log(data?.user?.email, data?.user?.username)
            window.scrollTo({ top: 0, behavior: 'auto' })
            onClose()
        } catch (e) {
            const err = e as AxiosError
            const data = err.response?.data as BackendErrorResponse | undefined
            const msg = (data?.message ?? '').toLowerCase()
            const status = err.response?.status

            const isAuthFailure =
                status === 401 ||
                msg.includes('invalid credential') ||
                msg.includes('incorrect') ||
                msg.includes('unauthorized')

            if (isAuthFailure) {
                setInvalidCredentials(true)
                setFormError(null)
                return
            }
            setFormError(data?.message ?? 'Login failed')
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pb-2">
            <button
                type="button"
                className="absolute inset-0 bg-black/30"
                onClick={onClose}
                aria-label="Close modal backdrop"
            />

            <div className="relative w-105 rounded-2xl bg-white px-7.5 pt-6 pb-6">
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
                    <h2 className="font-inter pt-5 text-center text-[32px] leading-8 font-semibold text-[#141414]">
                        Welcome Back
                    </h2>
                    <p className="font-inter mt-3 pb-3 text-center text-[14px] leading-3.5 font-medium text-[#666666]">
                        Log in to continue learning
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-6 flex flex-col items-center"
                >
                    <div className="w-90 pb-3">
                        <p
                            className={`font-inter text-[14px] leading-3.5 font-medium ${
                                invalidCredentials ||
                                (formState.errors.email &&
                                    (formState.touchedFields.email ||
                                        formState.submitCount > 0))
                                    ? 'text-red-500'
                                    : 'text-[#3D3D3D]'
                            }`}
                        >
                            Email
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
                                            onChange={(e) => {
                                                setInvalidCredentials(false)
                                                onChange(e)
                                            }}
                                            placeholder="you@example.com"
                                            className={`font-inter placeholder:font-inter h-11.75 w-90 rounded-lg border-[1.5px] px-4 text-[14px] leading-3.5 font-medium text-[#141414] placeholder:text-[14px] placeholder:leading-3.5 placeholder:font-medium placeholder:text-[#8A8A8A] ${
                                                invalidCredentials ||
                                                (error &&
                                                    (isTouched ||
                                                        formState.submitCount >
                                                            0))
                                                    ? 'border-red-500'
                                                    : 'border-[#D1D1D1]'
                                            } ${
                                                invalidCredentials ||
                                                (error &&
                                                    (isTouched ||
                                                        formState.submitCount >
                                                            0))
                                                    ? 'text-red-500'
                                                    : 'text-[#141414]'
                                            }`}
                                        />
                                        {error?.message &&
                                        (isTouched ||
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

                    <div className="mt-4 w-90">
                        <p
                            className={`font-inter text-[14px] leading-3.5 font-medium ${
                                invalidCredentials ||
                                (formState.errors.password &&
                                    (formState.touchedFields.password ||
                                        formState.submitCount > 0))
                                    ? 'text-red-500'
                                    : 'text-[#3D3D3D]'
                            }`}
                        >
                            Password
                        </p>
                        <div className="mt-2">
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
                                                onChange={(e) => {
                                                    setInvalidCredentials(false)
                                                    onChange(e)
                                                }}
                                                placeholder="••••••••"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                className={`font-inter placeholder:font-inter h-11.75 w-90 rounded-lg border-[1.5px] pr-12 pl-4 text-[14px] leading-3.5 font-medium placeholder:text-[14px] placeholder:leading-3.5 placeholder:font-medium placeholder:text-[#8A8A8A] ${
                                                    invalidCredentials ||
                                                    (error &&
                                                        (isTouched ||
                                                            formState.submitCount >
                                                                0))
                                                        ? 'border-red-500'
                                                        : 'border-[#D1D1D1]'
                                                } ${
                                                    invalidCredentials ||
                                                    (error &&
                                                        (isTouched ||
                                                            formState.submitCount >
                                                                0))
                                                        ? 'text-red-500'
                                                        : 'text-[#141414]'
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword((s) => !s)
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
                                                        filter: iconErrorFilter,
                                                    }}
                                                />
                                            </button>
                                        </div>
                                        {invalidCredentials ? (
                                            <p className="font-inter mt-2 text-[12px] leading-3 font-medium text-red-500">
                                                Invalid credentials
                                            </p>
                                        ) : error?.message &&
                                          (isTouched ||
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

                    <button
                        type="submit"
                        className="font-inter mt-4 h-11.75 w-90 rounded-lg bg-[#4F46E5] text-center text-[16px] leading-6 font-medium text-white"
                    >
                        Log In
                    </button>

                    {formError ? (
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

                    <div className="mt-4 flex items-center justify-center gap-1.5 pb-5">
                        <span className="font-inter text-[12px] leading-3 font-normal text-[#666666]">
                            Don&apos;t have an account?
                        </span>
                        <button
                            type="button"
                            className="font-inter text-[14px] leading-3.5 font-medium text-[#141414] underline"
                            onClick={() => {
                                onClose()
                                onOpenRegister()
                            }}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
