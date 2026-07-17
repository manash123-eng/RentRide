import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { authService } from "../../services/authService.js";
import Button from "../../components/Button.jsx";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name, phone: user?.phone, address: user?.address, licenseNumber: user?.licenseNumber },
  });
  const { register: registerPwd, handleSubmit: handlePwdSubmit, reset: resetPwd } = useForm();
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await authService.updateProfile(data);
      updateUser(res.data.data);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data) => {
    setChangingPwd(true);
    try {
      await authService.changePassword(data);
      toast.success("Password changed successfully");
      resetPwd();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-white">Profile settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 space-y-4 p-6">
        <h2 className="font-display text-sm font-semibold text-white">Personal information</h2>
        <div>
          <label className="label-text">Full name</label>
          <input className="input-field" {...register("name")} />
        </div>
        <div>
          <label className="label-text">Email</label>
          <input className="input-field opacity-60" value={user?.email} disabled />
        </div>
        <div>
          <label className="label-text">Phone</label>
          <input className="input-field" {...register("phone")} />
        </div>
        <div>
          <label className="label-text">Address</label>
          <input className="input-field" {...register("address")} />
        </div>
        <div>
          <label className="label-text">Driving license number</label>
          <input className="input-field" {...register("licenseNumber")} />
        </div>
        <Button type="submit" isLoading={saving}>Save changes</Button>
      </form>

      <form onSubmit={handlePwdSubmit(onChangePassword)} className="card mt-6 space-y-4 p-6">
        <h2 className="font-display text-sm font-semibold text-white">Change password</h2>
        <div>
          <label className="label-text">Current password</label>
          <input type="password" className="input-field" {...registerPwd("currentPassword", { required: true })} />
        </div>
        <div>
          <label className="label-text">New password</label>
          <input type="password" className="input-field" {...registerPwd("newPassword", { required: true, minLength: 6 })} />
        </div>
        <Button type="submit" variant="secondary" isLoading={changingPwd}>Update password</Button>
      </form>
    </div>
  );
};

export default Profile;
