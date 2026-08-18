export function getApiErrorMessage(error, fallbackMessage) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return detail[0]?.msg || fallbackMessage;
  }
  if (error?.code === "ERR_NETWORK") {
    return "FastAPI 서버에 연결할 수 없습니다.";
  }
  return error?.message || fallbackMessage;
}
