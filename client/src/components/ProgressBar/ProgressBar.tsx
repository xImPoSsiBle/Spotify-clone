import styles from './ProgressBar.module.css'

interface ProgressBarProps {
    progress: number
    duration: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, duration }) => {

    const percentage = duration > 0 ? (progress / duration) * 100 : 0;

    return (
        <div className={`w-[300px] relative hover:cursor-pointer ${styles.progressBar}`}>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-500 transition-all ease-linear"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div
                className={`absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white ${styles.dot}`}
                style={{ left: `calc(${percentage}% - 8px)` }}
            ></div>
        </div>
    )
}

export default ProgressBar