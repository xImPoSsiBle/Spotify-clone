import { useRef, useState } from "react";
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    progress: number;
    duration: number;
    onSeekChange?: (newProgress: number) => void;
    onSeekCommit?: (newProgress: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, duration, onSeekChange, onSeekCommit }) => {
    const [isDragging, setIsDragging] = useState(false);
    const barRef = useRef<HTMLDivElement | null>(null);
    const [localProgress, setLocalProgress] = useState(progress);

    const activeProgress = isDragging ? localProgress : progress;
    const percentage = duration > 0 ? (activeProgress / duration) * 100 : 0;

    const updateProgress = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!barRef.current || !duration) return;

        const rect = barRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const newProgress = Math.min(Math.max(offsetX / rect.width, 0), 1) * duration;

        setLocalProgress(newProgress);
        onSeekChange?.(newProgress);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        updateProgress(e);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        updateProgress(e);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        onSeekCommit?.(localProgress);
    };

    return (
        <div
            ref={barRef}
            className={`w-full relative hover:cursor-pointer ${styles.progressBar}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-500 transition-all ease-linear"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div
                className={`absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white ${styles.dot}`}
                style={{ left: `calc(${percentage}% - 4px)` }}
            />
        </div>
    );
};

export default ProgressBar;
