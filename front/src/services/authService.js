import api from "../api/axios";

async function login({ id, password }) {
  const { data } = await api.post("/member/login", {
    id: id.trim(),
    pwd: password,
  });

  if (!data.isLogin || !data.accessToken) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  }

  return {
    accessToken: data.accessToken,
    user: {
      id: id.trim(),
      nickname: data.name,
      role: data.role,
    },
  };
}

async function signup({ id, password, nickname, phone, email }) {
  const member = (
    await api.post("/member/signup", {
      id: id.trim(),
      pwd: password,
      name: nickname.trim(),
      phone: phone.trim(),
      email: email.trim(),
    })
  ).data;

  const session = await login({ id, password });
  return {
    ...session,
    user: {
      ...session.user,
      nickname: member.name,
      email: member.email,
      phone: member.phone,
    },
  };
}

function logout() {
  localStorage.removeItem("pedalup_access_token");
  localStorage.removeItem("pedalup_user");
}

const authService = { login, signup, logout };
export default authService;
