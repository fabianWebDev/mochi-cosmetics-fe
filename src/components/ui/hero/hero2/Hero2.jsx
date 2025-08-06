import classes from "./Hero2.module.css";
import { storeConfig } from "../../../../config/storeConfig";

const Hero2 = () => {
    return (
        <div className={classes.hero_container}>
            <img
                src={storeConfig.hero_background}
                alt="Hero background"
                className={classes.hero_background_image}
            />
        </div>
    );
}

export default Hero2;