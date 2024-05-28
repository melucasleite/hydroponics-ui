"use client";
import React from "react";
import { saveSettings } from "../utils";
import { Settings } from "@prisma/client";
import { useForm } from "react-hook-form";

const SettingsTable: React.FC<{ settings: Settings }> = ({ settings }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Settings>();

  const handleOnSubmit = async (data: Settings) => {
    await saveSettings(data);
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <input
        type="hidden"
        value={settings.id}
        {...register("id", { valueAsNumber: true })}
      />
      <div className="grid lg:grid-cols-5 gap-3 w-full">
        <div className="w-full pt-5 pb-5">
          <label className="block text-center mb-3">Flow Rate A (ml/min)</label>
          <input
            type="number"
            defaultValue={settings.flowRateA}
            className="px-2 py-1 w-full rounded text-white text-center"
            {...register("flowRateA", {
              required: true,
              min: 1,
              max: 100,
              valueAsNumber: true,
            })}
          />
          {errors.flowRateA && (
            <span className="text-red-500">Required (1-100)</span>
          )}
        </div>
        <div className="w-full pt-5 pb-5">
          <label className="block text-center mb-3">Flow Rate B (ml/min)</label>
          <input
            type="number"
            defaultValue={settings.flowRateB}
            className="px-2 py-1 w-full rounded text-white text-center"
            {...register("flowRateB", {
              required: true,
              min: 1,
              max: 100,
              valueAsNumber: true,
            })}
          />
          {errors.flowRateB && (
            <span className="text-red-500">Required (1-100)</span>
          )}
        </div>
        <div className="w-full pt-5 pb-5">
          <label className="block text-center mb-3">Flow Rate C (ml/min)</label>
          <input
            type="number"
            defaultValue={settings.flowRateC}
            className="px-2 py-1 w-full rounded text-white text-center"
            {...register("flowRateC", {
              required: true,
              min: 1,
              max: 100,
              valueAsNumber: true,
            })}
          />
          {errors.flowRateC && (
            <span className="text-red-500">Required (1-100)</span>
          )}
        </div>
        <div className="w-full pt-5 pb-5">
          <label className="block text-center mb-3">Flow Rate D (ml/min)</label>
          <input
            type="number"
            defaultValue={settings.flowRateD}
            className="px-2 py-1 w-full rounded text-white text-center"
            {...register("flowRateD", {
              required: true,
              min: 1,
              max: 100,
              valueAsNumber: true,
            })}
          />
          {errors.flowRateD && (
            <span className="text-red-500">Required (1-100)</span>
          )}
        </div>
        <div className="w-full pt-5 pb-5">
          <label className="block text-center mb-3">Main Volume (g)</label>
          <input
            type="number"
            defaultValue={settings.mainVolumeContainer}
            className="px-2 py-1 w-full rounded text-white text-center"
            {...register("mainVolumeContainer", {
              required: true,
              min: 1,
              max: 100,
              valueAsNumber: true,
            })}
          />
          {errors.mainVolumeContainer && (
            <span className="text-red-500">Required (1-100)</span>
          )}
        </div>
      </div>
      <div className="flex pt-5">
        <button
          className="ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default SettingsTable;
