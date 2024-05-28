"use client";
import React from 'react';
import WaterIcon from '@/public/water.svg';
import WaterUpIcon from '@/public/water-up.svg';
import WaterDownIcon from '@/public/water-down.svg';
import { CurrentState } from '@prisma/client';

export interface WaterLevelProps {
    level: CurrentState['waterLevel'];
}

export const Water: React.FC<WaterLevelProps> = ({ level }) => {
    const color = {
        LOW: 'stroke-red-500',
        NORMAL: 'stroke-primary',
        HIGH: 'stroke-green-500'
    };
    const Icon = level === 'LOW' ? WaterDownIcon : level === 'NORMAL' ? WaterIcon : WaterUpIcon;
    return (
        <div className={`tooltip tooltip-right`} data-tip={level === 'LOW' ? "Water is low" : level === 'NORMAL' ? "Water is on optimal levels" : "Water is on it's max level"}>
            <Icon className={`w-[42px] h-[42px] stroke-2 ${color[level]}`} />
            <p>{level}</p>
        </div>
    );
};


