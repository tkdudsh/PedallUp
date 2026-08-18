import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, User } from "lucide-react";
import Logo from "../../components/common/Logo";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/routes";
import { getApiErrorMessage } from "../../utils/apiError";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ id: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => ({ ...previous, [field]: undefined, submit: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.id.trim()) nextErrors.id = "아이디를 입력해 주세요.";
    if (!form.password) nextErrors.password = "비밀번호를 입력해 주세요.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(form);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      setErrors({ submit: getApiErrorMessage(error, "로그인에 실패했습니다.") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between border-b border-border p-10 lg:border-b-0 lg:border-r lg:p-16 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px]">
        <Logo />
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-neon">라이더 커뮤니티</p>
          <h1 className="text-5xl font-extrabold leading-[1.1] sm:text-6xl">
            다시 달릴
            <br />
            <span className="text-neon">준비됐나요?</span>
          </h1>
          <p className="mt-6 max-w-sm text-sm text-gray-400">
            로그인하고 나만의 라이딩 대시보드를 확인하세요.
          </p>
        </div>
        <p className="border-t border-border pt-8 text-sm text-gray-500">PEDALLUP</p>
      </div>

      <div className="flex items-center justify-center p-10 lg:p-16">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-white">로그인</h2>
          <p className="mt-2 text-sm text-gray-400">
            계정이 없나요?{" "}
            <Link to={ROUTES.SIGNUP} className="font-semibold text-neon">회원가입</Link>
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <Button variant="dark" disabled title="소셜 로그인 준비 중">Google 로그인</Button>
            <Button variant="dark" disabled title="소셜 로그인 준비 중">Kakao 로그인</Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-gray-500">
            <span className="h-px flex-1 bg-border" />아이디로 로그인<span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input icon={User} placeholder="아이디" autoComplete="username" value={form.id} onChange={handleChange("id")} error={errors.id} />
            <Input icon={Lock} type="password" placeholder="비밀번호" autoComplete="current-password" value={form.password} onChange={handleChange("password")} error={errors.password} />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "로그인 중..." : "로그인"}<ArrowRight className="h-4 w-4" />
            </Button>
            {errors.submit && <p className="text-center text-sm text-danger">{errors.submit}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
