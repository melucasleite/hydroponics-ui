import React from "react";
import { getSchedules, getSettings } from "../utils";
import { FeedingChart } from "./FeedingChart";

const Actions: React.FC = async () => {
  const schedules = await getSchedules();
  const settings = await getSettings();

  const actions = schedules.map((schedule) => {
    return {
      ...schedule,
      weeklyParts: schedule.weeklyParts.map((part) => ({
        volumeA: (part.partA * settings.mainVolumeContainer).toFixed(1) + "ml",
        runA:
          (
            (part.partA * settings.mainVolumeContainer) /
            (settings.flowRateA / 60)
          ).toFixed(1) + "s",
        volumeB: (part.partB * settings.mainVolumeContainer).toFixed(1) + "ml",
        runB:
          (
            (part.partB * settings.mainVolumeContainer) /
            (settings.flowRateB / 60)
          ).toFixed(1) + "s",
        volumeC: (part.partC * settings.mainVolumeContainer).toFixed(1) + "ml",
        runC:
          (
            (part.partC * settings.mainVolumeContainer) /
            (settings.flowRateC / 60)
          ).toFixed(1) + "s",
      })),
    };
  });

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Actions</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Week</th>
              <th className="py-2 px-4 border-b">Volume A</th>
              <th className="py-2 px-4 border-b">Volume B</th>
              <th className="py-2 px-4 border-b">Volume C</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action, index) =>
              action.weeklyParts.map((part, partIndex) => (
                <tr key={`${index}-${partIndex}`}>
                  <td className="py-2 px-4 border-b">{partIndex + 1}</td>
                  <td className="py-2 px-4 border-b">{part.volumeA}</td>
                  <td className="py-2 px-4 border-b">{part.volumeB}</td>
                  <td className="py-2 px-4 border-b">{part.volumeC}</td>
                </tr>
              )),
            )}
            <tr>
              <td className="py-2 px-4 border-b">Total</td>
              <td className="py-2 px-4 border-b">
                {actions
                  .reduce(
                    (total, action) =>
                      total +
                      action.weeklyParts.reduce(
                        (partTotal, part) =>
                          partTotal + parseFloat(part.volumeA),
                        0,
                      ),
                    0,
                  )
                  .toFixed(1)}
                ml
              </td>
              <td className="py-2 px-4 border-b">
                {actions
                  .reduce(
                    (total, action) =>
                      total +
                      action.weeklyParts.reduce(
                        (partTotal, part) =>
                          partTotal + parseFloat(part.volumeB),
                        0,
                      ),
                    0,
                  )
                  .toFixed(1)}
                ml
              </td>
              <td className="py-2 px-4 border-b">
                {actions
                  .reduce(
                    (total, action) =>
                      total +
                      action.weeklyParts.reduce(
                        (partTotal, part) =>
                          partTotal + parseFloat(part.volumeC),
                        0,
                      ),
                    0,
                  )
                  .toFixed(1)}
                ml
              </td>
            </tr>
          </tbody>
        </table>
        {actions && actions.length > 0 && <FeedingChart action={actions[0]} />}
      </div>
    </div>
  );
};

export default Actions;
