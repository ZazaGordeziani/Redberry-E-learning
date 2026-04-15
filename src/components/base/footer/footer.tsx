import { Link } from 'react-router-dom'

import logo from '@/assets/logo.svg'

import facebook from '@/assets/facebook-sign.svg'
import instagram from '@/assets/instagram-sign.svg'
import linkedin from '@/assets/linked-in-sign.svg'
import x from '@/assets/x-sign.svg'
import youtube from '@/assets/youtube-sign.svg'

import contactSign from '@/assets/contact-sign.svg'
import emailSign from '@/assets/e-mail-sign.svg'
import locationSign from '@/assets/location-sign.svg'

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' })
}

type FooterProps = {
    onMyProfileClick?: () => void
}

export default function Footer({ onMyProfileClick }: Readonly<FooterProps>) {
    return (
        <footer className="mx-auto flex h-83.5 w-full max-w-480 flex-col justify-center gap-18.5 border-t border-[#D1D1D1] bg-[#F5F5F5] pt-20 pb-5">
            <div className="mx-auto flex w-full max-w-391.5 justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="inline-flex shrink-0 cursor-pointer"
                            aria-label="Redberry home"
                            onClick={scrollToTop}
                        >
                            <img
                                src={logo}
                                alt=""
                                className="h-11 w-11"
                                aria-hidden
                            />
                        </Link>
                        <span className="font-inter text-[24px] leading-6 font-medium text-[#130E67]">
                            Bootcamp
                        </span>
                    </div>
                    <p className="font-inter text-[14px] leading-4.5 font-medium text-[#130E67]">
                        Your learing journey starts here!
                        <br />
                        Browse courses to get started.
                    </p>

                    <div className="flex items-center gap-5 pt-2">
                        <a
                            href="https://www.facebook.com/RayRedberry/?locale=ka_GE"
                            className="cursor-pointer"
                            aria-label="Facebook"
                            target="_blank"
                        >
                            <img src={facebook} alt="facebook" />
                        </a>
                        <a
                            href="https://x.com/Redberry_agency"
                            className="cursor-pointer"
                            aria-label="X"
                            target="_blank"
                        >
                            <img src={x} alt="X" />
                        </a>
                        <a
                            href="https://www.instagram.com/redberry_rockets/"
                            className="cursor-pointer"
                            aria-label="Instagram"
                            target="_blank"
                        >
                            <img src={instagram} alt="instagram" />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/redberry-%E2%80%A2-%E1%83%A0%E1%83%94%E1%83%93%E1%83%91%E1%83%94%E1%83%A0%E1%83%98/?originalSubdomain=ge"
                            className="cursor-pointer"
                            aria-label="LinkedIn"
                            target="_blank"
                        >
                            <img src={linkedin} alt="linkedin" />
                        </a>
                        <a
                            href="#"
                            className="cursor-pointer"
                            aria-label="YouTube"
                        >
                            <img src={youtube} alt="youtube" />
                        </a>
                    </div>
                </div>

                <div className="flex gap-30">
                    <div className="flex flex-col">
                        <h3 className="font-inter text-xl leading-6 font-semibold text-[#130E67]">
                            Explore
                        </h3>
                        <div className="font-inter mt-5 flex flex-col gap-2 text-[18px] leading-4.5 font-normal text-[#666666]">
                            <p>Enrolled Courses</p>
                            <Link
                                to="/courses"
                                className="text-inherit transition-colors hover:text-[#4F46E5]"
                                onClick={scrollToTop}
                            >
                                Browse Courses
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h3 className="font-inter text-xl leading-6 font-semibold text-[#130E67]">
                            Account
                        </h3>
                        <div className="mt-5 flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => onMyProfileClick?.()}
                                className="font-inter w-fit cursor-pointer text-left text-[18px] leading-4.5 font-normal text-[#666666] transition-colors hover:text-[#4F46E5]"
                            >
                                My Profile
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h3 className="font-inter text-xl leading-6 font-semibold text-[#130E67]">
                            Contact
                        </h3>
                        <div className="mt-5 flex flex-col gap-2">
                            <div className="flex items-center gap-1.5">
                                <img
                                    src={emailSign}
                                    alt=""
                                    aria-hidden="true"
                                    className="w-4.5s h-4.5"
                                />
                                <p className="font-inter text-[18px] leading-4.5 font-normal text-[#666666]">
                                    contact@company.com
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <img
                                    src={contactSign}
                                    alt=""
                                    aria-hidden="true"
                                    className="h-4.5 w-4.5"
                                />
                                <p className="font-inter text-[18px] leading-4.5 font-normal text-[#666666]">
                                    (+995) 555 111 222
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <img
                                    src={locationSign}
                                    alt=""
                                    aria-hidden="true"
                                    className="h-4.5 w-4.5"
                                />
                                <p className="font-inter text-[18px] leading-4.5 font-normal text-[#666666]">
                                    Aghmshenebeli St.115
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-391.5 items-center justify-between">
                <h4 className="font-inter text-[18px] leading-4.5 font-normal text-[#666666]">
                    Copyright © 2026 Redberry International
                </h4>

                <div className="flex items-center gap-2">
                    <span className="font-inter text-[18px] leading-4.5 font-normal text-[#666666]">
                        All Rights Reserved
                    </span>
                    <span className="text-[#666666]">|</span>
                    <span className="font-inter text-[18px] leading-4.5 font-normal text-[#4F46E5]">
                        Terms and Conditions
                    </span>
                    <span className="text-[#666666]">|</span>
                    <span className="font-inter text-[18px] leading-4.5 font-normal text-[#4F46E5]">
                        Privacy Policy
                    </span>
                </div>
            </div>
        </footer>
    )
}
