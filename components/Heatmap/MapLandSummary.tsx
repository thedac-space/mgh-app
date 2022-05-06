import React from "react";
import { Metaverse } from "../../lib/enums";
import { typedKeys } from "../../lib/utilities";

interface Props {
  coordinates: { x: number; y: number };
  ownerId: string;
  parcelName: string;
  metaverse: Metaverse;
}

const MapLandSummary = ({
  ownerId,
  parcelName,
  coordinates,
  metaverse,
}: Props) => {
  return (
    <div className="gray-box bg-opacity-100 ">
      <div className="flex gap-4 flex-col block">
        {metaverse === "decentraland" && (
          <div className="flex-row">
            {typedKeys(coordinates).map((coord) => (
              <span
                key={coord}
                className="text-white font-semibold whitespace-nowrap"
              >
                {coord.toUpperCase()}:{" "}
                {isNaN(coordinates[coord]) ? "xx" : coordinates[coord]}{" "}
              </span>
            ))}
          </div>
        )}

        <span className="text-white font-semibold ">
          {"Name: " + parcelName}
        </span>
        <span className="text-white font-semibold break-words ">
          {"Owner: " + ((ownerId && ownerId) || "none")}
        </span>
      </div>
    </div>
  );
};

export default MapLandSummary;
