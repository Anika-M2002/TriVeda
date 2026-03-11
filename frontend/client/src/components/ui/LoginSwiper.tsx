"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination } from "swiper/modules";

import { LoginCard } from "./LoginCard";
import { loginRoleImages } from "./loginRoleImages";

interface LoginSwiperProps {
  roles: { userType: "patient" | "doctor" | "admin"; image: string }[];
  onNavigate: (view: string, userType?: string) => void;
}

export const LoginSwiper: React.FC<LoginSwiperProps> = ({
  roles,
  onNavigate,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto py-12">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
        style={{ minHeight: "480px" }} // ensures space for square boxes
      >
        {roles.map((role) => (
          <SwiperSlide key={role.userType}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full h-full">
              {/* Left: Login Card */}
              <div className="flex items-center justify-center w-[370px] h-[370px] bg-white/80 rounded-2xl shadow-2xl border border-primary/10 overflow-hidden">
                <LoginCard
                  role={role.userType}
                  onLogin={() => onNavigate("login", role.userType)}
                  onRegister={() => {
                    if (role.userType === "patient")
                      onNavigate("patient-register");
                    else if (role.userType === "doctor")
                      onNavigate("doctor-register");
                    else if (role.userType === "admin")
                      onNavigate("admin-register");
                  }}
                />
              </div>

              {/* Divider */}
              <div
                className="hidden md:block w-[2px] h-[320px] bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 rounded-full"
                style={{ boxShadow: "0 0 16px 0 #b5e0c7, 0 0 0 1px #e0f2e9" }}
              />

              {/* Right: Role Image */}
              <div className="flex items-center justify-center w-[370px] h-[370px] bg-white rounded-xl shadow-xl border-2 border-primary/20 overflow-hidden">
                <img
                  src={loginRoleImages[role.userType]}
                  alt={`${role.userType} visual`}
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
