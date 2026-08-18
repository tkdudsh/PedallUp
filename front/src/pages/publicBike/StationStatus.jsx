import { useEffect, useState } from "react";
import { MapPinned, RefreshCw } from "lucide-react";
import StationCard from "../../components/cards/StationCard";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import Loading from "../../components/common/Loading";
import publicBikeService from "../../services/publicBikeService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function StationStatus() {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStations = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await publicBikeService.getStations();
      setStations(data.stations);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "대여소 정보를 불러오지 못했습니다."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-bike">서울시 공공데이터</p>
          <h2 className="mt-1 text-2xl font-extrabold text-white">따릉이 대여소 현황</h2>
          <p className="mt-2 text-sm text-gray-500">선택한 대여소 6개의 기본정보와 거치대 현황입니다.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadStations}>
          <RefreshCw className="h-4 w-4" />새로고침
        </Button>
      </div>

      {error ? (
        <EmptyState icon={MapPinned} title="대여소 정보를 불러오지 못했습니다" description={error} />
      ) : stations.length === 0 ? (
        <EmptyState icon={MapPinned} title="등록된 대여소가 없습니다" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      )}
    </div>
  );
}
