import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Phone, User } from "lucide-react";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/routes";
import { getApiErrorMessage } from "../../utils/apiError";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    id: "",
    nickname: "",
    phone: "",
    email: "",
    password: "",
    passwordConfirm: "",
    agreeRequired: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    const value = field === "agreeRequired" ? event.target.checked : event.target.value;
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined, submit: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.id.trim()) nextErrors.id = "아이디를 입력해 주세요.";
    if (!form.nickname.trim()) nextErrors.nickname = "이름을 입력해 주세요.";
    if (!/^\d{8,20}$/.test(form.phone.replaceAll("-", ""))) nextErrors.phone = "전화번호는 숫자 8~20자로 입력해 주세요.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "올바른 이메일 주소를 입력해 주세요.";
    if (form.password.length < 8) nextErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    if (form.passwordConfirm !== form.password) nextErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    if (!form.agreeRequired) nextErrors.agreeRequired = "필수 약관에 동의해 주세요.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signup({ ...form, phone: form.phone.replaceAll("-", "") });
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      setErrors({ submit: getApiErrorMessage(error, "회원가입에 실패했습니다.") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between border-b border-border p-10 lg:border-b-0 lg:border-r lg:p-16 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px]">
        <Logo />
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-neon">지금 시작하세요</p>
          <h1 className="text-5xl font-extrabold leading-[1.1] sm:text-6xl">
            당신의 첫<br /><span className="text-neon">라이딩을</span><br />기록하세요
          </h1>
          <p className="mt-6 max-w-sm text-sm text-gray-400">회원가입 후 바로 로그인되어 대시보드로 이동합니다.</p>
        </div>
        <p className="border-t border-border pt-8 text-sm text-gray-500">PEDALLUP</p>
      </div>

      <div className="flex items-center justify-center p-10 lg:p-16">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-white">회원가입</h2>
          <p className="mt-2 text-sm text-gray-400">
            이미 계정이 있나요?{" "}<Link to={ROUTES.LOGIN} className="font-semibold text-neon">로그인</Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input icon={User} placeholder="아이디" autoComplete="username" value={form.id} onChange={handleChange("id")} error={errors.id} />
            <Input icon={User} placeholder="이름" autoComplete="name" value={form.nickname} onChange={handleChange("nickname")} error={errors.nickname} />
            <Input icon={Phone} type="tel" placeholder="전화번호 (숫자만)" autoComplete="tel" value={form.phone} onChange={handleChange("phone")} error={errors.phone} />
            <Input icon={Mail} type="email" placeholder="이메일" autoComplete="email" value={form.email} onChange={handleChange("email")} error={errors.email} />
            <Input icon={Lock} type="password" placeholder="비밀번호 (8자 이상)" autoComplete="new-password" value={form.password} onChange={handleChange("password")} error={errors.password} />
            <Input icon={Lock} type="password" placeholder="비밀번호 확인" autoComplete="new-password" value={form.passwordConfirm} onChange={handleChange("passwordConfirm")} error={errors.passwordConfirm} />

            <label className="flex items-start gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={form.agreeRequired} onChange={handleChange("agreeRequired")} className="mt-0.5 h-4 w-4 accent-neon" />
              <span><strong className="text-white">[필수]</strong> 이용약관 및 개인정보처리방침에 동의합니다.</span>
            </label>
            {errors.agreeRequired && <p className="text-xs text-danger">{errors.agreeRequired}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "가입 중..." : "회원가입"}<ArrowRight className="h-4 w-4" />
            </Button>
            {errors.submit && <p className="text-center text-sm text-danger">{errors.submit}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
