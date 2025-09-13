import { FadeLoader } from "react-spinners";
import styles from "./Loading.module.css";

const Loading = ({
    variant = "default",
    size = 50,
    text = "Loading...",
    className = ""
}) => {
    const getVariantClass = () => {
        switch (variant) {
            case "small":
                return styles.loadingSmall;
            case "inline":
                return styles.loadingInline;
            default:
                return "";
        }
    };

    const getSpinnerSize = () => {
        switch (variant) {
            case "small":
                return 30;
            case "inline":
                return 20;
            default:
                return size;
        }
    };

    return (
        <div className={`${styles.loading} ${getVariantClass()} ${className}`}>
            <FadeLoader
                color="var(--highlight-color)"
                size={getSpinnerSize()}
                className={styles.loadingSpinner}
            />
            <p className={styles.loadingText}>{text}</p>
        </div>
    );
};

export default Loading;