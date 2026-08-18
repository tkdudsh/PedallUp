import { Bike, CalendarDays, MapPin } from "lucide-react";
import Badge from "../common/Badge";

export default function StationCard({ station }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Badge variant="cyan">{station.operationType}</Badge>
        <span className="font-mono text-xs text-gray-500">{station.id}</span>
      </div>

      <h3 className="text-lg font-bold text-white">{station.name}</h3>
      <p className="mt-1 text-sm font-semibold text-bike">{station.district}</p>

      <div className="mt-4 flex items-start gap-2 text-sm text-gray-400">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
        <span>{station.address}</span>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
        <div className="rounded-lg bg-white/[0.03] p-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Bike className="h-3.5 w-3.5" />거치대
          </div>
          <p className="mt-1 text-xl font-extrabold text-white">
            {station.total}<span className="ml-1 text-xs font-medium text-gray-500">대</span>
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.03] p-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CalendarDays className="h-3.5 w-3.5" />설치일
          </div>
          <p className="mt-2 text-sm font-bold text-white">{station.installedAt}</p>
        </div>
      </div>
    </article>
  );
}
