import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Camera, Save, Shield, Calendar, BadgeCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { updateUser } from "@/reducer/authSlice";
import { ImageCropModel } from "./ImageCropModel";
import { pixelsAPI } from "@/api/allAPIs";
import { refreshNotifications } from "@/lib/notify";
import { getInitials } from "@/components/ui/UserAvatar";

const ProfilePage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: { name: user?.name || "", phone: user?.phone || "", address: user?.address || "" },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await pixelsAPI.updateProfile({
        email: user?.email,
        ...data,
        clinic_name: "N/A",
        clinic_address: data.address || "N/A",
      });
      if (response?.status === 1) {
        dispatch(updateUser(data));
        toast.success("Profile updated successfully");
        refreshNotifications();
      } else {
        toast.error(response?.info || "Failed to update profile");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setIsCropModalOpen(true);
    }
  };

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="portal-card border border-white/[0.08] overflow-hidden"
      >
        {/* Banner */}
        <div className="relative h-28 bg-gradient-to-r from-primary/20 via-brand-accent/15 to-primary/10">
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        </div>

        {/* Identity row */}
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-2xl overflow-hidden relative ring-4 ring-[#0f1524]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-brand-accent" />
                {user?.logo && user.logo.trim() !== "" && !imgError ? (
                  <img src={user.logo} alt="Profile" className="w-full h-full object-cover relative z-10" onError={() => setImgError(true)} />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white z-10">
                    {getInitials(user?.name)}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-brand-accent flex items-center justify-center border-2 border-[#0f1524]">
                <Camera size={12} className="text-white" />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <h2 className="text-xl font-display font-bold text-white truncate flex items-center gap-2">
                {user?.name || "User"}
                <BadgeCheck size={18} className="text-primary shrink-0" />
              </h2>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>

            <div className="flex items-center gap-2 pb-1">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/[0.08] border border-primary/[0.15] text-sm font-semibold text-primary">
                <Shield size={14} /> {user?.role || "Investor"}
              </span>
            </div>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-xs text-gray-400">
              <Mail size={13} className="text-gray-500" /> {user?.email}
            </span>
            {user?.join_date && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-xs text-gray-400">
                <Calendar size={13} className="text-gray-500" /> Joined {user.join_date}
              </span>
            )}
            {user?.status && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/[0.15] text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {user.status}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.07] my-6" />

          {/* Editable form */}
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <span className="w-1 h-4 bg-gradient-to-b from-primary to-brand-accent rounded-full" />
            Personal Information
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="portal-label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input {...register("name", { required: "Name is required" })} className="portal-input pl-9" placeholder="Your full name" />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message as string}</p>}
              </div>

              <div>
                <label className="portal-label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input value={user?.email || ""} disabled className="portal-input pl-9 opacity-50 cursor-not-allowed" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="portal-label">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input {...register("phone")} className="portal-input pl-9" placeholder="+1 234 567 8900" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="portal-label">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 text-gray-500" size={16} />
                  <textarea {...register("address")} rows={2} className="portal-input pl-9 resize-none" placeholder="Your address..." />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button type="submit" disabled={!isDirty}
                className="btn-gradient px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
                <Save size={15} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {isCropModalOpen && (
        <ImageCropModel imageFile={selectedFile} onClose={() => setIsCropModalOpen(false)} onSuccess={() => {}} />
      )}
    </div>
  );
};

export default ProfilePage;
